import 'reflect-metadata';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

/**
 * Development DataSource configuration for migrations
 * Used for running migrations in development environment
 */
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'fountain',
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
  entities: ['dist/modules/**/entities/*.entity.js'],
  migrations: ['dist/migrations/**/*.js'],
  migrationsTableName: 'typeorm_migrations',
});
