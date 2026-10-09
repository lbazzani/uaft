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
  // Niente password di riserva: prima ce n'era una debole, scritta qui nel
  // repository (e stampata a video dopo la creazione).
  const adminPassword = process.env.ADMIN_PASSWORD ?? '';
  if (adminPassword.length < 12) {
    console.error('❌ ADMIN_PASSWORD mancante o più corta di 12 caratteri: impostala nell\'ambiente.');
    process.exit(1);
  }

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
  console.log('🔑 Password: quella di ADMIN_PASSWORD (non viene stampata)');
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
