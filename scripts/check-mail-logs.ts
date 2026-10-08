#!/usr/bin/env node
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkLogs() {
  console.log('📧 Checking recent mail logs...\n');

  const logs = await prisma.mailLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
  });

  if (logs.length === 0) {
    console.log('No mail logs found.');
    return;
  }

  logs.forEach((log, index) => {
    console.log(`\n--- Log ${index + 1} ---`);
    console.log(`Type: ${log.type}`);
    console.log(`From: ${log.from}`);
    console.log(`To: ${log.to}`);
    console.log(`Subject: ${log.subject}`);
    console.log(`Status: ${log.status}`);
    if (log.error) {
      console.log(`❌ Error: ${log.error}`);
    }
    if (log.metadata) {
      console.log(`Metadata: ${JSON.stringify(log.metadata, null, 2)}`);
    }
    console.log(`Created: ${log.createdAt}`);
  });

  await prisma.$disconnect();
}

checkLogs().catch((error) => {
  console.error('Error checking logs:', error);
  process.exit(1);
});
