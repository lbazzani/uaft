#!/usr/bin/env node
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkSentMessages() {
  console.log('📧 Checking sent messages in database...\n');

  // Trova l'utente lorenzo@uaft.it
  const user = await prisma.user.findUnique({
    where: { email: 'lorenzo@uaft.it' },
    include: {
      mailAddresses: true,
    },
  });

  if (!user) {
    console.log('User not found');
    return;
  }

  console.log(`User: ${user.name} (${user.email})`);
  console.log(`Mail addresses: ${user.mailAddresses.map(a => a.address).join(', ')}\n`);

  // Trova i messaggi inviati
  const sentMessages = await prisma.mailMessage.findMany({
    where: {
      senderId: user.id,
    },
    orderBy: {
      sentAt: 'desc',
    },
    take: 10,
  });

  console.log(`Found ${sentMessages.length} sent messages:\n`);

  sentMessages.forEach((msg, index) => {
    console.log(`--- Message ${index + 1} ---`);
    console.log(`From: ${msg.fromAddress}`);
    console.log(`To: ${msg.toAddresses.join(', ')}`);
    console.log(`Subject: ${msg.subject}`);
    console.log(`Sent At: ${msg.sentAt}`);
    console.log(`Message ID: ${msg.messageId}`);
    console.log('');
  });

  await prisma.$disconnect();
}

checkSentMessages().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
