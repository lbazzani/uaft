#!/usr/bin/env tsx

/**
 * Script per verificare la configurazione mail di un utente
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Verifica configurazione mail...\n');

  // Get all users with their mail addresses
  const users = await prisma.user.findMany({
    include: {
      mailAddresses: {
        include: {
          domain: true,
        },
      },
    },
  });

  for (const user of users) {
    console.log(`\n👤 User: ${user.email} (ID: ${user.id})`);
    console.log(`   Admin: ${user.isAdmin}`);
    console.log(`   Mail Addresses: ${user.mailAddresses.length}`);

    for (const addr of user.mailAddresses) {
      console.log(`\n   📧 ${addr.address}`);
      console.log(`      - Address Active: ${addr.isActive}`);
      console.log(`      - Domain: ${addr.domain.domain}`);
      console.log(`      - Domain Active: ${addr.domain.isActive}`);
      console.log(`      - Can Send: ${addr.isActive && addr.domain.isActive ? '✅ YES' : '❌ NO'}`);
    }
  }

  // Check domains
  console.log('\n\n📮 Domini configurati:\n');
  const domains = await prisma.mailDomain.findMany();

  for (const domain of domains) {
    console.log(`   ${domain.isActive ? '✅' : '❌'} ${domain.domain}`);
    console.log(`      - Active: ${domain.isActive}`);
    console.log(`      - TLS Cert: ${domain.tlsCertStatus || 'N/A'}`);
  }

  await prisma.$disconnect();
}

main()
  .catch((e) => {
    console.error('❌ Errore:', e);
    process.exit(1);
  });
