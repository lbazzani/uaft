import { prisma } from '../lib/prisma';

async function updateDomain() {
  console.log('🔄 Updating uaft.it domain with mail subdomain...');

  const updated = await prisma.mailDomain.update({
    where: { domain: 'uaft.it' },
    data: {
      mailSubdomain: 'mail.uaft.it',
      serverIp: '135.236.155.164',
      aRecord: '135.236.155.164',
      ptrRecord: 'mail.uaft.it',
    },
  });

  console.log('✅ Domain updated successfully!');
  console.log(JSON.stringify(updated, null, 2));

  await prisma.$disconnect();
}

updateDomain().catch(console.error);
