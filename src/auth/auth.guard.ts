import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    
    if (!token) {
      throw new UnauthorizedException('Anda tidak memiliki akses. Silakan login terlebih dahulu.');
    }
    
    try {
      // Verifikasi token menggunakan rahasia yang sama persis
      const payload = await this.jwtService.verifyAsync(token, {
        secret: 'RAHASIA_SUPER_AEWS_123',
      });
      // Sisipkan data payload ke dalam request agar bisa dipakai di Controller
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException('Token tidak valid atau sudah kedaluwarsa.');
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}