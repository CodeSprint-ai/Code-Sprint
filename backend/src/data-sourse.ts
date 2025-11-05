import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from 'src/user/entities/user.model';

export const AppDataSource = new DataSource({
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
});
