// auth/jwt/jwt.service.ts
import { Injectable, ForbiddenException } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { TokensDto } from './dto/token.dto';
import { Mongoose } from 'mongoose';


@Injectable()
export class JwtTokenService {
  constructor(
    private readonly jwt: NestJwtService,
    private readonly config: ConfigService,
  ) {}

  async generateTokens(userId: string, email: string): Promise<TokensDto> {
    const payload = { sub: userId, email };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(payload, {
        secret: this.config.get('JWT_ACCESS_SECRET'),
        expiresIn: '15m',
      }),
      this.jwt.signAsync(payload, {
        secret: this.config.get('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      }),
    ]);

    return { accessToken, refreshToken };
  }

  async hashRefreshToken(refreshToken: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(refreshToken, saltRounds);
  }

  async validateRefreshToken(rawToken: string, hashedToken: string): Promise<void> {
    const isValid = await bcrypt.compare(rawToken, hashedToken);
    if (!isValid) throw new ForbiddenException('Invalid refresh token');
  }
}
