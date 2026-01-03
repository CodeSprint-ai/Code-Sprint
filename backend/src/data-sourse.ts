import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { User } from './user/entities/user.model';
import { Problem } from './problem/entities/Problem';
import { TestCase } from './problem/entities/TestCase';
import { Submission } from './submission/entities/Submission';
import { SprintSession } from './sprint/entities/SprintSession';
import { SprintProblem } from './sprint/entities/SprintProblem';

// Load environment variables
config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('neon') ? { rejectUnauthorized: false } : false,
  synchronize: false,
  logging: true,
  entities: [User, Problem, TestCase, Submission, SprintSession, SprintProblem],
  migrations: ['src/migrations/*.ts'],
  subscribers: [],
});
