import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { config } from 'dotenv';

// Load environment variables
config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'fountain',
  password: process.env.DB_PASSWORD || 'fountain_dev_pass',
  database: process.env.DB_NAME || 'fountain_db',
  synchronize: false,
  logging: process.env.DB_LOGGING === 'true',
  entities: ['src/modules/**/entities/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
  migrationsTableName: 'typeorm_migrations',
  connectTimeoutMS: 5000,
});
