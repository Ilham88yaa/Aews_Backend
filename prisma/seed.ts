import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Hash password biar aman (seperti yang kita buat sebelumnya)
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('admin123', salt);

  // Buat akun Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@aews.com' },
    update: {},
    create: {
      email: 'admin@aews.com',
      password: hashedPassword,
      name: 'Dr. Jane Smith', // Sesuai dengan UI Anda
      role: 'ADMIN', // Menggunakan enum Role yang baru
    },
  });

  console.log('✅ Seeding berhasil! Akun admin dibuat:', admin.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });