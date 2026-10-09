#!/usr/bin/env ts-node

/**
 * UAFT - TLS Certificate Generator
 *
 * Genera certificati TLS per un dominio usando Let's Encrypt o self-signed
 *
 * Usage:
 *   npm run cert:generate -- <domain> [--self-signed]
 *
 * Examples:
 *   npm run cert:generate -- example.com
 *   npm run cert:generate -- mail.example.com --self-signed
 */

import 'dotenv/config';
import { prisma } from '../lib/prisma';
import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { nomeHostValido } from '../lib/mail/validazione';

// Comandi senza shell (execFileSync con argomenti separati) e dominio
// controllato prima di usarlo: prima finiva interpolato in una stringa per
// /bin/sh, insieme a «admin@dominio» e «mail.dominio».

const CERTS_DIR = process.env.CERTIFICATES_DIR || '/etc/ssl/mail-certs';

interface CertificateResult {
  success: boolean;
  keyPath?: string;
  certPath?: string;
  error?: string;
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('❌ Usage: npm run cert:generate -- <domain> [--self-signed]');
    console.error('');
    console.error('Examples:');
    console.error('  npm run cert:generate -- mail.example.com');
    console.error('  npm run cert:generate -- mail.example.com --self-signed');
    process.exit(1);
  }

  const domain = args[0].trim().toLowerCase();
  const selfSigned = args.includes('--self-signed');

  if (!nomeHostValido(domain) || !nomeHostValido(`mail.${domain}`)) {
    console.error(`❌ Invalid domain name: ${JSON.stringify(args[0])}`);
    process.exit(1);
  }

  console.log(`\n🔐 Generating TLS certificate for: ${domain}`);
  console.log(`   Method: ${selfSigned ? 'Self-Signed' : 'Let\'s Encrypt'}\n`);

  // Verifica che il dominio esista nel database
  const mailDomain = await prisma.mailDomain.findUnique({
    where: { domain },
  });

  if (!mailDomain) {
    console.error(`❌ Domain not found in database: ${domain}`);
    console.error('   Create the domain first in the admin panel.');
    process.exit(1);
  }

  let result: CertificateResult;

  if (selfSigned) {
    result = await generateSelfSignedCertificate(domain);
  } else {
    result = await generateLetsEncryptCertificate(domain);
  }

  if (!result.success) {
    console.error(`\n❌ Failed to generate certificate: ${result.error}`);
    process.exit(1);
  }

  // Aggiorna database
  await prisma.mailDomain.update({
    where: { domain },
    data: {
      tlsKeyPath: result.keyPath,
      tlsCertPath: result.certPath,
      tlsAutoRenew: !selfSigned,
    },
  });

  console.log('\n✅ Certificate generated successfully!');
  console.log(`   Key:  ${result.keyPath}`);
  console.log(`   Cert: ${result.certPath}`);
  console.log('');
  console.log('📝 Next steps:');
  console.log('   1. Restart SMTP server: sudo systemctl restart uaft-smtp');
  console.log('   2. Test connection: openssl s_client -connect mail.${domain}:587 -starttls smtp');
  console.log('');
}

/**
 * Genera certificato Let's Encrypt
 */
async function generateLetsEncryptCertificate(domain: string): Promise<CertificateResult> {
  try {
    console.log('📋 Checking prerequisites...');

    // Verifica che certbot sia installato
    try {
      execFileSync('which', ['certbot'], { stdio: 'ignore' });
    } catch {
      return {
        success: false,
        error: 'Certbot not found. Install with: sudo apt-get install certbot',
      };
    }

    // Verifica che la porta 80 sia disponibile (per HTTP challenge)
    console.log('🌐 Generating Let\'s Encrypt certificate...');
    console.log('   Note: Port 80 must be open for HTTP-01 challenge');
    console.log('');

    // Genera certificato con certbot
    const certbotArgs = [
      'certonly', '--standalone', '--non-interactive', '--agree-tos',
      '--email', `admin@${domain}`,
      '--domains', `mail.${domain}`,
      '--preferred-challenges', 'http',
    ];

    try {
      execFileSync('certbot', certbotArgs, { stdio: 'inherit' });
    } catch (error) {
      return {
        success: false,
        error: 'Certbot failed. Make sure port 80 is open and DNS points to this server.',
      };
    }

    const keyPath = `/etc/letsencrypt/live/mail.${domain}/privkey.pem`;
    const certPath = `/etc/letsencrypt/live/mail.${domain}/fullchain.pem`;

    // Verifica che i file esistano
    if (!fs.existsSync(keyPath) || !fs.existsSync(certPath)) {
      return {
        success: false,
        error: 'Certificate files not found after certbot execution',
      };
    }

    return {
      success: true,
      keyPath,
      certPath,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Genera certificato self-signed
 */
async function generateSelfSignedCertificate(domain: string): Promise<CertificateResult> {
  try {
    // Crea directory certificati se non esiste
    if (!fs.existsSync(CERTS_DIR)) {
      console.log(`📁 Creating certificates directory: ${CERTS_DIR}`);
      fs.mkdirSync(CERTS_DIR, { recursive: true, mode: 0o700 });
    }

    const keyPath = path.join(CERTS_DIR, `mail.${domain}.key`);
    const certPath = path.join(CERTS_DIR, `mail.${domain}.crt`);

    console.log('🔧 Generating self-signed certificate...');

    // Genera certificato self-signed
    execFileSync(
      'openssl',
      [
        'req', '-x509', '-nodes', '-days', '365', '-newkey', 'rsa:2048',
        '-keyout', keyPath,
        '-out', certPath,
        '-subj', `/C=IT/ST=Italy/L=Rome/O=UAFT Mail/CN=mail.${domain}`,
      ],
      { stdio: 'inherit' }
    );

    // Imposta permessi corretti
    fs.chmodSync(keyPath, 0o600);
    fs.chmodSync(certPath, 0o644);

    return {
      success: true,
      keyPath,
      certPath,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}

main();
