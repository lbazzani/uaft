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
    // Usa la directory certs/ nel progetto invece di /etc/ssl/mail-certs
    const defaultCertsDir = path.join(process.cwd(), 'certs');
    this.certificatesDir = process.env.CERTIFICATES_DIR || defaultCertsDir;
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
        mailSubdomain: true,
        tlsKeyPath: true,
        tlsCertPath: true,
      },
    });

    for (const domain of domains) {
      if (domain.tlsKeyPath && domain.tlsCertPath) {
        // Usa mailSubdomain se disponibile, altrimenti domain (per retrocompatibilità)
        const certDomain = domain.mailSubdomain || domain.domain;
        await this.loadCertificate(certDomain, domain.tlsKeyPath, domain.tlsCertPath);
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
      const { execSync } = require('child_process');
      const isLetsEncrypt = keyPath.includes('/etc/letsencrypt/');

      // Verifica esistenza file
      if (isLetsEncrypt) {
        // Per Let's Encrypt usa sudo test
        try {
          execSync(`sudo test -f "${keyPath}"`, { stdio: 'ignore' });
          execSync(`sudo test -f "${certPath}"`, { stdio: 'ignore' });
        } catch {
          console.warn(`⚠️  TLS files not found for ${domain}: ${keyPath}`);
          return false;
        }
      } else {
        // Per certificati locali usa fs.existsSync
        if (!fs.existsSync(keyPath) || !fs.existsSync(certPath)) {
          console.warn(`⚠️  TLS files not found for ${domain}: ${keyPath}`);
          return false;
        }
      }

      // Leggi i file
      let key: Buffer;
      let cert: Buffer;

      if (isLetsEncrypt) {
        // Per Let's Encrypt usa sudo cat
        key = execSync(`sudo cat "${keyPath}"`);
        cert = execSync(`sudo cat "${certPath}"`);
      } else {
        // Per certificati locali usa fs.readFileSync
        key = fs.readFileSync(keyPath);
        cert = fs.readFileSync(certPath);
      }

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
   * @param domain - Il dominio principale (es: uaft.it)
   * @param mailSubdomain - Il sottodominio mail (es: mail.uaft.it) - opzionale, se non specificato usa domain
   */
  async generateSelfSignedCertificate(
    domain: string,
    mailSubdomain?: string
  ): Promise<{
    keyPath: string;
    certPath: string;
  }> {
    const { execSync } = require('child_process');

    // Usa mailSubdomain se fornito, altrimenti domain
    const certDomain = mailSubdomain || domain;
    const keyPath = path.join(this.certificatesDir, `${certDomain}.key`);
    const certPath = path.join(this.certificatesDir, `${certDomain}.crt`);

    console.log(`🔧 Generating self-signed certificate for: ${certDomain}`);

    // Genera certificato self-signed
    execSync(
      `openssl req -x509 -nodes -days 365 -newkey rsa:2048 ` +
      `-keyout "${keyPath}" ` +
      `-out "${certPath}" ` +
      `-subj "/C=IT/ST=Italy/L=Rome/O=UAFT Mail Server/CN=${certDomain}"`
    );

    // Imposta permessi
    fs.chmodSync(keyPath, 0o600);
    fs.chmodSync(certPath, 0o644);

    console.log(`✅ Self-signed certificate generated for: ${certDomain}`);

    // Carica il certificato usando il certDomain
    await this.loadCertificate(certDomain, keyPath, certPath);

    // Aggiorna database (usa il domain principale come chiave)
    await prisma.mailDomain.update({
      where: { domain },
      data: {
        tlsKeyPath: keyPath,
        tlsCertPath: certPath,
        tlsCertStatus: 'valid',
        tlsCertExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 anno
      },
    });

    return { keyPath, certPath };
  }

  /**
   * Genera certificato Let's Encrypt per produzione
   * @param domain - Il dominio principale (es: uaft.it)
   * @param email - Email per Let's Encrypt
   * @param autoRenew - Abilita auto-rinnovo
   */
  async generateLetsEncryptCertificate(
    domain: string,
    email: string,
    autoRenew: boolean = true
  ): Promise<{
    keyPath: string;
    certPath: string;
  }> {
    const { execSync } = require('child_process');

    // Recupera il mailSubdomain dal database
    const domainInfo = await prisma.mailDomain.findUnique({
      where: { domain },
      select: { mailSubdomain: true },
    });

    if (!domainInfo) {
      throw new Error(`Domain ${domain} not found in database`);
    }

    const certDomain = domainInfo.mailSubdomain || domain;

    console.log(`🔐 Generating Let's Encrypt certificate for: ${certDomain}`);
    console.log(`📧 Using email: ${email}`);

    try {
      // Usa certbot per generare il certificato
      // IMPORTANTE: Questo richiede che certDomain punti all'IP del server
      // e che nginx sia configurato con un server block per il dominio
      const certbotCommand =
        `sudo certbot certonly --nginx ` +
        `--non-interactive --agree-tos ` +
        `--email ${email} ` +
        `-d ${certDomain}`;

      console.log(`Running: ${certbotCommand}`);
      execSync(certbotCommand, { stdio: 'inherit' });

      // I certificati Let's Encrypt vengono salvati in /etc/letsencrypt/live/{domain}/
      const letsencryptDir = `/etc/letsencrypt/live/${certDomain}`;
      const keyPath = path.join(letsencryptDir, 'privkey.pem');
      const certPath = path.join(letsencryptDir, 'fullchain.pem');

      // Verifica che i file esistano usando sudo (i file sono in directory root-only)
      try {
        execSync(`sudo test -f "${keyPath}"`, { stdio: 'ignore' });
        execSync(`sudo test -f "${certPath}"`, { stdio: 'ignore' });
      } catch {
        throw new Error('Certificate files not found after certbot execution');
      }

      console.log(`✅ Let's Encrypt certificate generated for: ${certDomain}`);

      // Carica il certificato
      await this.loadCertificate(certDomain, keyPath, certPath);

      // Calcola data di scadenza (Let's Encrypt: 90 giorni)
      const expiryDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);

      // Aggiorna database
      await prisma.mailDomain.update({
        where: { domain },
        data: {
          tlsKeyPath: keyPath,
          tlsCertPath: certPath,
          tlsAutoRenew: autoRenew,
          tlsCertStatus: 'valid',
          tlsCertExpiry: expiryDate,
          tlsCertEmail: email,
        },
      });

      return { keyPath, certPath };
    } catch (error) {
      console.error(`❌ Failed to generate Let's Encrypt certificate:`, error);

      // Aggiorna stato nel database
      await prisma.mailDomain.update({
        where: { domain },
        data: {
          tlsCertStatus: 'failed',
          tlsCertEmail: email,
        },
      });

      throw error;
    }
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
