import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'fountain',
  password: process.env.DB_PASSWORD || 'fountain_dev_pass',
  database: process.env.DB_NAME || 'fountain_db',
  entities: [path.join(__dirname, 'dist/modules/**/entities/*.entity.js')],
  migrations: [path.join(__dirname, 'dist/migrations/**/*.js')],
  migrationsTableName: 'typeorm_migrations',
  synchronize: false,
  logging: true,
  connectTimeoutMS: 5000,
  keepConnectionAlive: true,
  subscribers: [],
});
