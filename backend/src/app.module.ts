//app.module.ts
import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { JwtStrategy } from './auth/strategy/jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from './auth/guard/jwt.guard';
import { PrismaModule } from './prisma/prisma.module';
import { FolderModule } from './folder/folder.module';
import { UserModule } from './user/user.module';
import { MailerModule } from './mailer/mailer.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    AuthModule,
    PrismaModule,
    FolderModule,
    UserModule,
    MailerModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    JwtStrategy,
  ],
})
export class AppModule {}
