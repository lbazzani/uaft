#!/usr/bin/env tsx

/**
 * Script per attivare un dominio mail
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const domain = process.argv[2];

  if (!domain) {
    console.error('❌ Specifica un dominio');
    console.log('Usage: npx tsx scripts/activate-domain.ts <domain>');
    process.exit(1);
  }

  console.log(`🔄 Attivazione dominio: ${domain}...\n`);

  const result = await prisma.mailDomain.update({
    where: { domain },
    data: { isActive: true },
  });

  console.log(`✅ Dominio ${domain} attivato con successo!`);
  console.log(`   TLS Cert Status: ${result.tlsCertStatus || 'N/A'}`);
  console.log(`   TLS Cert Expiry: ${result.tlsCertExpiry || 'N/A'}`);

  await prisma.$disconnect();
}

main()
  .catch((e) => {
    console.error('❌ Errore:', e);
    process.exit(1);
  });
