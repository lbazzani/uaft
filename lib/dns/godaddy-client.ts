/**
 * GoDaddy DNS API Client
 * Documentazione: https://developer.godaddy.com/doc/endpoint/domains
 */

interface GoDaddyConfig {
  apiKey: string;
  apiSecret: string;
  environment?: 'production' | 'test';
}

interface DNSRecord {
  type: 'A' | 'AAAA' | 'CNAME' | 'MX' | 'TXT' | 'SRV' | 'NS';
  name: string;
  data: string;
  ttl?: number;
  priority?: number;
}

export class GoDaddyDNSClient {
  private apiKey: string;
  private apiSecret: string;
  private baseUrl: string;

  constructor(config: GoDaddyConfig) {
    this.apiKey = config.apiKey;
    this.apiSecret = config.apiSecret;
    this.baseUrl = config.environment === 'test'
      ? 'https://api.ote-godaddy.com'
      : 'https://api.godaddy.com';
  }

  private getHeaders(): HeadersInit {
    return {
      'Authorization': `sso-key ${this.apiKey}:${this.apiSecret}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }

  /**
   * Ottiene tutti i record DNS per un dominio
   */
  async getDNSRecords(domain: string): Promise<DNSRecord[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/v1/domains/${domain}/records`,
        {
          method: 'GET',
          headers: this.getHeaders(),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`GoDaddy API Error: ${error.message || response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching DNS records:', error);
      throw error;
    }
  }

  /**
   * Aggiunge o aggiorna record DNS
   */
  async updateDNSRecords(domain: string, records: DNSRecord[]): Promise<void> {
    try {
      const response = await fetch(
        `${this.baseUrl}/v1/domains/${domain}/records`,
        {
          method: 'PATCH',
          headers: this.getHeaders(),
          body: JSON.stringify(records),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`GoDaddy API Error: ${error.message || response.statusText}`);
      }
    } catch (error) {
      console.error('Error updating DNS records:', error);
      throw error;
    }
  }

  /**
   * Configura automaticamente tutti i record DNS per un mail server
   */
  async configureMailDNS(
    domain: string,
    config: {
      mxRecord: string;
      spfRecord: string;
      dkimSelector: string;
      dkimPublicKey: string;
      dmarcRecord: string;
    }
  ): Promise<{ success: boolean; message: string }> {
    try {
      // Prepara i record DNS da aggiungere
      const records: DNSRecord[] = [];

      // 1. Record MX
      const mxParts = config.mxRecord.split(' ');
      const mxPriority = parseInt(mxParts[0]) || 10;
      const mxHost = mxParts[1] || config.mxRecord;

      records.push({
        type: 'MX',
        name: '@',
        data: mxHost,
        priority: mxPriority,
        ttl: 3600,
      });

      // 2. Record SPF (TXT)
      records.push({
        type: 'TXT',
        name: '@',
        data: config.spfRecord,
        ttl: 3600,
      });

      // 3. Record DKIM (TXT)
      records.push({
        type: 'TXT',
        name: `${config.dkimSelector}._domainkey`,
        data: config.dkimPublicKey,
        ttl: 3600,
      });

      // 4. Record DMARC (TXT)
      records.push({
        type: 'TXT',
        name: '_dmarc',
        data: config.dmarcRecord,
        ttl: 3600,
      });

      // Aggiorna i record DNS su GoDaddy
      await this.updateDNSRecords(domain, records);

      return {
        success: true,
        message: 'Record DNS configurati con successo su GoDaddy',
      };
    } catch (error: any) {
      console.error('Error configuring mail DNS:', error);
      return {
        success: false,
        message: error.message || 'Errore nella configurazione DNS',
      };
    }
  }

  /**
   * Verifica se le credenziali API sono valide
   */
  async validateCredentials(): Promise<boolean> {
    try {
      const response = await fetch(
        `${this.baseUrl}/v1/domains/available?domain=test.com`,
        {
          method: 'GET',
          headers: this.getHeaders(),
        }
      );

      return response.ok;
    } catch (error) {
      console.error('Error validating credentials:', error);
      return false;
    }
  }

  /**
   * Ottiene la lista dei domini dell'account
   */
  async getDomains(): Promise<string[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/v1/domains`,
        {
          method: 'GET',
          headers: this.getHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch domains');
      }

      const domains = await response.json();
      return domains.map((d: any) => d.domain);
    } catch (error) {
      console.error('Error fetching domains:', error);
      throw error;
    }
  }
}

/**
 * Factory function per creare un client GoDaddy
 */
export function createGoDaddyClient(): GoDaddyDNSClient | null {
  const apiKey = process.env.GODADDY_API_KEY;
  const apiSecret = process.env.GODADDY_API_SECRET;

  if (!apiKey || !apiSecret) {
    console.warn('GoDaddy API credentials not configured');
    return null;
  }

  return new GoDaddyDNSClient({
    apiKey,
    apiSecret,
    environment: 'production',
  });
}
