import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      global: true, // Agar token bisa dipakai di seluruh modul
      secret: 'RAHASIA_SUPER_AEWS_123', // Di tahap produksi, ini harus dipindah ke .env
      signOptions: { expiresIn: '1d' }, // Token berlaku selama 1 hari
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService],
})
export class AuthModule {}