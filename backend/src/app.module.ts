import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppDataSource } from './data-sourse';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.model';
import { ProblemModule } from './problem/problem.module';
import { SubmissionModule } from './submission/submission.module';
import { SprintService } from './sprint/sprint.service';
import { SprintModule } from './sprint/sprint.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from './auth/guard/role.guard';
import { JwtAuthGuard } from './auth/guard/jwt.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes env available globally
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        ssl: {
          rejectUnauthorized: false, // Required for Neon's SSL connection
        },
        autoLoadEntities: true,
        synchronize: true, // Set to false in production. More on this below.
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    ProblemModule,
    SubmissionModule,
    SprintModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard, //, // First: always check JWT
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard, // Then: always check roles if @Roles() is present
    },
  ],
})
export class AppModule {}
