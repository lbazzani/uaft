#!/usr/bin/env ts-node

/**
 * UAFT Mail Server - Production SMTP Server
 *
 * Avvia il server SMTP con TLS, autenticazione e anti-spam
 *
 * Usage:
 *   npm run smtp:start:prod
 *
 * Oppure con porta personalizzata:
 *   SMTP_SUBMISSION_PORT=587 npm run smtp:start:prod
 *
 * IMPORTANTE: Prima di avviare in produzione:
 * 1. Configura i certificati TLS (TLS_KEY_PATH, TLS_CERT_PATH)
 * 2. Assicurati che il database sia configurato
 * 3. Configura i record DNS (MX, SPF, DKIM, DMARC)
 * 4. Testa con `npm run mail:verify`
 */

import 'dotenv/config';
import { getSmtpServerProduction } from '../lib/mail/smtp-server-production';

async function main() {
  console.log('🚀 Starting UAFT Mail Server (PRODUCTION)...\n');

  // Porta per SMTP submission (587) - richiede auth
  const port = parseInt(process.env.SMTP_SUBMISSION_PORT || '587');

  // Verifica variabili d'ambiente critiche
  const requiredEnvVars = ['DATABASE_URL'];
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:');
    missingVars.forEach(varName => console.error(`   - ${varName}`));
    process.exit(1);
  }

  // Warning se TLS non configurato
  if (!process.env.TLS_KEY_PATH || !process.env.TLS_CERT_PATH) {
    console.warn('\n⚠️  WARNING: TLS not configured!');
    console.warn('   Set TLS_KEY_PATH and TLS_CERT_PATH in .env');
    console.warn('   Running without TLS is NOT recommended for production!\n');

    // In sviluppo, continua. In produzione, blocca.
    if (process.env.NODE_ENV === 'production') {
      console.error('❌ Cannot start production server without TLS');
      process.exit(1);
    }
  }

  try {
    const smtpServer = getSmtpServerProduction(port);
    await smtpServer.start();

    console.log('\n✅ UAFT Mail Server (PRODUCTION) is running!');
    console.log(`📬 Listening on port: ${port}`);
    console.log(`🗄️  Database: ${process.env.DATABASE_URL?.split('@')[1] || 'configured'}`);
    console.log('\n💡 Important:');
    console.log('   - Clients must authenticate to send email');
    console.log('   - Configure DNS records (MX, SPF, DKIM, DMARC)');
    console.log('   - Monitor logs in database (mail_logs table)');
    console.log('   - Stop server with: Ctrl+C\n');

    // Handle graceful shutdown
    process.on('SIGINT', async () => {
      console.log('\n\n🛑 Shutting down SMTP server...');
      await smtpServer.stop();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      console.log('\n\n🛑 Shutting down SMTP server...');
      await smtpServer.stop();
      process.exit(0);
    });
  } catch (error) {
    console.error('❌ Failed to start SMTP server:', error);
    process.exit(1);
  }
}

main();
