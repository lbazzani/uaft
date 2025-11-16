import fs from 'fs';
import path from 'path';
import { prisma } from '@/lib/prisma';
import { SecureContextOptions } from 'tls';

/**
 * TLS Certificate Manager
 *
 * Gestisce certificati TLS multipli per domini diversi usando SNI
 * (Server Name Indication)
 */

interface CertificateInfo {
  domain: string;
  keyPath: string;
  certPath: string;
  key: Buffer;
  cert: Buffer;
  isValid: boolean;
  expiresAt?: Date;
}

export class TLSCertificateManager {
  private certificates: Map<string, CertificateInfo> = new Map();
  private certificatesDir: string;

  constructor() {
    this.certificatesDir = process.env.CERTIFICATES_DIR || '/etc/ssl/mail-certs';
    this.ensureCertificatesDirectory();
  }

  /**
   * Crea la directory per i certificati se non esiste
   */
  private ensureCertificatesDirectory(): void {
    if (!fs.existsSync(this.certificatesDir)) {
      console.log(`📁 Creating certificates directory: ${this.certificatesDir}`);
      fs.mkdirSync(this.certificatesDir, { recursive: true, mode: 0o700 });
    }
  }

  /**
   * Carica tutti i certificati dei domini attivi dal database
   */
  async loadAllCertificates(): Promise<void> {
    console.log('🔐 Loading TLS certificates for all active domains...');

    const domains = await prisma.mailDomain.findMany({
      where: { isActive: true },
      select: {
        domain: true,
        tlsKeyPath: true,
        tlsCertPath: true,
      },
    });

    for (const domain of domains) {
      if (domain.tlsKeyPath && domain.tlsCertPath) {
        await this.loadCertificate(domain.domain, domain.tlsKeyPath, domain.tlsCertPath);
      }
    }

    console.log(`✅ Loaded ${this.certificates.size} TLS certificate(s)`);
  }

  /**
   * Carica un certificato specifico
   */
  async loadCertificate(
    domain: string,
    keyPath: string,
    certPath: string
  ): Promise<boolean> {
    try {
      if (!fs.existsSync(keyPath)) {
        console.warn(`⚠️  TLS key not found for ${domain}: ${keyPath}`);
        return false;
      }

      if (!fs.existsSync(certPath)) {
        console.warn(`⚠️  TLS cert not found for ${domain}: ${certPath}`);
        return false;
      }

      const key = fs.readFileSync(keyPath);
      const cert = fs.readFileSync(certPath);

      // Verifica validità certificato
      const expiresAt = this.getCertificateExpiration(cert);
      const isValid = expiresAt ? expiresAt > new Date() : true;

      this.certificates.set(domain, {
        domain,
        keyPath,
        certPath,
        key,
        cert,
        isValid,
        expiresAt,
      });

      console.log(`✅ Loaded TLS certificate for: ${domain}${!isValid ? ' (EXPIRED!)' : ''}`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to load certificate for ${domain}:`, error);
      return false;
    }
  }

  /**
   * Ottiene il certificato per un dominio
   */
  getCertificate(domain: string): SecureContextOptions | null {
    const cert = this.certificates.get(domain);

    if (!cert || !cert.isValid) {
      return null;
    }

    return {
      key: cert.key,
      cert: cert.cert,
    };
  }

  /**
   * Callback SNI per selezione certificato basata su hostname
   */
  getSNICallback() {
    return (servername: string, callback: (err: Error | null, ctx?: any) => void) => {
      console.log(`🔍 SNI request for: ${servername}`);

      const cert = this.getCertificate(servername);

      if (cert) {
        const tls = require('tls');
        const ctx = tls.createSecureContext(cert);
        callback(null, ctx);
      } else {
        console.warn(`⚠️  No certificate found for: ${servername}, using default`);
        callback(null); // Usa certificato di default
      }
    };
  }

  /**
   * Estrae la data di scadenza da un certificato
   */
  private getCertificateExpiration(certBuffer: Buffer): Date | null {
    try {
      const crypto = require('crypto');
      const cert = new crypto.X509Certificate(certBuffer);
      return new Date(cert.validTo);
    } catch (error) {
      return null;
    }
  }

  /**
   * Verifica certificati in scadenza
   */
  async checkExpiringCertificates(daysBeforeExpiry: number = 30): Promise<string[]> {
    const expiring: string[] = [];
    const now = new Date();
    const warningDate = new Date(now.getTime() + daysBeforeExpiry * 24 * 60 * 60 * 1000);

    for (const [domain, cert] of this.certificates.entries()) {
      if (cert.expiresAt && cert.expiresAt < warningDate) {
        expiring.push(domain);
        console.warn(`⚠️  Certificate for ${domain} expires on ${cert.expiresAt.toISOString()}`);
      }
    }

    return expiring;
  }

  /**
   * Rimuove un certificato dalla cache
   */
  removeCertificate(domain: string): void {
    this.certificates.delete(domain);
    console.log(`🗑️  Removed certificate for: ${domain}`);
  }

  /**
   * Ricarica tutti i certificati (utile dopo rinnovo)
   */
  async reloadAllCertificates(): Promise<void> {
    this.certificates.clear();
    await this.loadAllCertificates();
  }

  /**
   * Genera certificato self-signed per testing
   */
  async generateSelfSignedCertificate(domain: string): Promise<{
    keyPath: string;
    certPath: string;
  }> {
    const { execSync } = require('child_process');

    const keyPath = path.join(this.certificatesDir, `${domain}.key`);
    const certPath = path.join(this.certificatesDir, `${domain}.crt`);

    console.log(`🔧 Generating self-signed certificate for: ${domain}`);

    // Genera certificato self-signed
    execSync(
      `openssl req -x509 -nodes -days 365 -newkey rsa:2048 ` +
      `-keyout "${keyPath}" ` +
      `-out "${certPath}" ` +
      `-subj "/C=IT/ST=Italy/L=Rome/O=UAFT/CN=${domain}"`
    );

    // Imposta permessi
    fs.chmodSync(keyPath, 0o600);
    fs.chmodSync(certPath, 0o644);

    console.log(`✅ Self-signed certificate generated for: ${domain}`);

    // Carica il certificato
    await this.loadCertificate(domain, keyPath, certPath);

    // Aggiorna database
    await prisma.mailDomain.update({
      where: { domain },
      data: {
        tlsKeyPath: keyPath,
        tlsCertPath: certPath,
      },
    });

    return { keyPath, certPath };
  }

  /**
   * Lista tutti i certificati caricati
   */
  listCertificates(): CertificateInfo[] {
    return Array.from(this.certificates.values());
  }
}

// Singleton instance
let tlsManagerInstance: TLSCertificateManager | null = null;

export function getTLSCertificateManager(): TLSCertificateManager {
  if (!tlsManagerInstance) {
    tlsManagerInstance = new TLSCertificateManager();
  }
  return tlsManagerInstance;
}
