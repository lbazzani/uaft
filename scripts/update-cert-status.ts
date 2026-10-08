import { prisma } from '../lib/prisma';

async function updateCertificateStatus() {
  console.log('🔄 Updating certificate status for uaft.it...');

  const domain = await prisma.mailDomain.update({
    where: { domain: 'uaft.it' },
    data: {
      tlsKeyPath: '/etc/letsencrypt/live/mail.uaft.it/privkey.pem',
      tlsCertPath: '/etc/letsencrypt/live/mail.uaft.it/fullchain.pem',
      tlsCertStatus: 'valid',
      tlsCertExpiry: new Date('2026-02-14'),
      tlsCertEmail: 'lorenzo@bazzani.info',
      tlsAutoRenew: true,
    },
  });

  console.log('✅ Certificate status updated:', domain);
  await prisma.$disconnect();
}

updateCertificateStatus().catch(console.error);
