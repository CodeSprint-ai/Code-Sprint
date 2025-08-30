import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
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
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost', // change if using Docker
      port: 5432,
      username: 'postgres', // your DB user
      password: 'macerace120', // your DB password
      database: 'codesprint', // your DB name
      synchronize: true, // auto create schema (disable in production)
      logging: true,
      entities: [User],
      migrations: [],
      subscribers: [],
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
export class AppModule { }
