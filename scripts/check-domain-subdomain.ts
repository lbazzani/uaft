import { prisma } from '../lib/prisma';

async function checkDomain() {
  const domain = await prisma.mailDomain.findUnique({
    where: { domain: 'uaft.it' },
    select: {
      domain: true,
      mailSubdomain: true,
      serverIp: true,
      aRecord: true,
      mxRecord: true,
      ptrRecord: true,
    },
  });

  console.log('=== Domain Info for uaft.it ===');
  console.log(JSON.stringify(domain, null, 2));

  if (!domain) {
    console.log('❌ Domain not found!');
  } else if (!domain.mailSubdomain) {
    console.log('⚠️  mailSubdomain is NULL - this is the problem!');
  } else {
    console.log(`✅ mailSubdomain is set to: ${domain.mailSubdomain}`);
  }

  await prisma.$disconnect();
}

checkDomain().catch(console.error);
