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
import { ProfileModule } from './profile/profile.module';
import { ContestModule } from './contest/contest.module';
import { CloudinaryModule } from './common/cloudinary';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from './auth/guard/role.guard';
import { JwtAuthGuard } from './auth/guard/jwt.guard';
import { BullModule } from '@nestjs/bull';
import { SubmissionProcessor } from './submission/processor/submissionProcessor';

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
        synchronize: false, // Disabled - using migrations instead
        migrationsRun: true, // Auto-run migrations on startup
        migrations: ['dist/migrations/*.js'],
      }),
      inject: [ConfigService],
    }),
    BullModule.forRoot({
      // @ts-ignore
      redis: { url: process.env.REDIS_URL || 'redis://localhost:6379' },
    }),
    BullModule.registerQueue({ name: 'submissions' }),
    AuthModule,
    UserModule,
    ProblemModule,
    SubmissionModule,
    SprintModule,
    ProfileModule,
    ContestModule,
    CloudinaryModule,
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
export class AppModule { }
