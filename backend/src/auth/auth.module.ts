import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtTokenService } from './jwt.service';
import { UserService } from 'src/user/user.service';
import { ConfigService } from '@nestjs/config';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { GithubStrategy } from './strategies/github.strategy';
import { GoogleStrategy } from './strategies/google.stategy';
import { CommonModule } from 'src/common/common.module';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [UserModule, CommonModule],
  providers: [
    AuthService,
    JwtTokenService,
    UserService,
    NestJwtService,
    ConfigService,
    GoogleStrategy,
    GithubStrategy,
    JwtStrategy,
  ],
  exports: [JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
