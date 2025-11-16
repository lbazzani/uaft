#!/usr/bin/env ts-node

/**
 * UAFT Mail Server - Standalone SMTP Server
 *
 * Questo script avvia il server SMTP per ricevere email in arrivo.
 *
 * Usage:
 *   npm run smtp:start
 *
 * Oppure con porta personalizzata:
 *   SMTP_PORT=2525 npm run smtp:start
 */

import 'dotenv/config';
import { getSmtpServer } from '../lib/mail/smtp-server';

async function main() {
  console.log('🚀 Starting UAFT Mail Server...\n');

  const port = parseInt(process.env.SMTP_PORT || '25');

  try {
    const smtpServer = getSmtpServer(port);
    await smtpServer.start();

    console.log('\n✅ UAFT Mail Server is running!');
    console.log(`📬 Listening on port: ${port}`);
    console.log(`🗄️  Database: ${process.env.DATABASE_URL?.split('@')[1] || 'configured'}`);
    console.log('\n💡 Tips:');
    console.log('   - Test with: telnet localhost ' + port);
    console.log('   - Send test email with: npm run smtp:test');
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
