import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
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
import { SessionService } from './session.service';
import { SecurityLogService } from './security-log.service';
import { UserSession } from 'src/profile/entities/UserSession';
import { SecurityLog } from './entities/SecurityLog';
import { OAuthProvider } from './entities/OAuthProvider';
import { RateLimiterGuard } from './guards/rate-limiter.guard';
import { APP_GUARD } from '@nestjs/core';
import { Reflector } from '@nestjs/core';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserSession, SecurityLog, OAuthProvider]),
    UserModule,
    CommonModule,
  ],
  providers: [
    AuthService,
    JwtTokenService,
    UserService,
    NestJwtService,
    ConfigService,
    GoogleStrategy,
    GithubStrategy,
    JwtStrategy,
    SessionService,
    SecurityLogService,
    RateLimiterGuard,
    Reflector,
  ],
  exports: [JwtStrategy, SessionService, SecurityLogService],
  controllers: [AuthController],
})
export class AuthModule { }

