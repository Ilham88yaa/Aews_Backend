import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Enkripsi password 'admin123' sebelum dimasukkan ke database
  const hashedPassword = await bcrypt.hash('admin123', 10);

  // Buat akun admin (upsert memastikan data tidak duplikat jika script dijalankan 2x)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@aews.com' },
    update: {},
    create: {
      email: 'admin@aews.com',
      name: 'Super Admin AEWS',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('🌱 Seed berhasil! Akun Admin dibuat:', admin.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });