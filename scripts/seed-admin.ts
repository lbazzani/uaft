#!/usr/bin/env ts-node

/**
 * Seed Admin User
 * Crea l'utente amministratore super supremo
 */

import 'dotenv/config';
import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('🌱 Seeding admin user...\n');

  const adminEmail = process.env.ADMIN_EMAIL || 'lorenzo@uaft.it';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log('✅ Admin user already exists:', adminEmail);
    return;
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  // Create admin user
  const admin = await prisma.user.create({
    data: {
      name: 'Lorenzo - Super Admin',
      email: adminEmail,
      password: hashedPassword,
      isAdmin: true,
    },
  });

  console.log('✅ Admin user created successfully!');
  console.log('📧 Email:', admin.email);
  console.log('🔑 Password:', adminPassword);
  console.log('👑 Role: Super Administrator God Supreme\n');
}

main()
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
