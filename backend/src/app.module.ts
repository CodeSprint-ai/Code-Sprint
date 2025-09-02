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
  providers: [AppService, SprintService],
})
export class AppModule {}
