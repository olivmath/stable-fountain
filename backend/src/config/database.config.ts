import 'reflect-metadata';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';
import { ConfigService } from './env/config.service';

// Load environment variables for scripts that run outside NestJS
dotenv.config();

/**
 * Get database configuration from environment variables
 * Used for scripts and configurations that run outside of NestJS DI
 */
function getEnvDatabaseConfig() {
  return {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'fountain',
    password: process.env.DB_PASSWORD || 'fountain_dev_pass',
    database: process.env.DB_NAME || 'fountain_db',
    logging: process.env.DB_LOGGING === 'true',
  };
}

/**
 * NestJS Configuration - used with injected ConfigService
 */
export const databaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const isProduction = configService.isProduction;

  // During development, we're running from the dist folder (compiled JS)
  // but TypeORM is being initialized from the dist source
  // We need to provide proper paths to the compiled entities
  const entitiesPath = isProduction
    ? 'dist/modules/**/entities/*.entity.js'
    : 'dist/modules/**/entities/*.entity.js';

  const migrationsPath = isProduction
    ? 'dist/migrations/**/*.js'
    : 'dist/migrations/**/*.js';

  return {
    type: 'postgres',
    host: configService.dbHost,
    port: configService.dbPort,
    username: configService.dbUsername,
    password: configService.dbPassword,
    database: configService.dbName,
    entities: [entitiesPath],
    migrations: [migrationsPath],
    migrationsTableName: 'typeorm_migrations',
    synchronize: false,
    logging: configService.isDevelopment,
    connectTimeoutMS: 5000,
    keepConnectionAlive: true,
  };
};

/**
 * Creates TypeORM DataSource options from environment variables
 * Used for migration files and utility scripts
 */
export function createDataSourceOptions(
  overrides: Partial<DataSourceOptions> = {},
): DataSourceOptions {
  const dbConfig = getEnvDatabaseConfig();

  return {
    type: 'postgres',
    host: dbConfig.host,
    port: dbConfig.port,
    username: dbConfig.username,
    password: dbConfig.password,
    database: dbConfig.database,
    synchronize: false,
    logging: dbConfig.logging as boolean,
    connectTimeoutMS: 5000,
    migrationsTableName: 'typeorm_migrations',
    keepConnectionAlive: true,
    ...overrides,
  } as DataSourceOptions;
}

/**
 * Creates DataSource options for production (compiled dist files)
 */
export function createProductionDataSourceOptions(
  overrides: Partial<DataSourceOptions> = {},
): DataSourceOptions {
  const baseDir = path.resolve(__dirname, '../../');

  return createDataSourceOptions({
    entities: [path.join(baseDir, 'dist/modules/**/entities/*.entity.js')],
    migrations: [path.join(baseDir, 'dist/migrations/**/*.js')],
    ...overrides,
  });
}

/**
 * Creates DataSource options for development (TypeScript source files)
 */
export function createDevelopmentDataSourceOptions(
  overrides: Partial<DataSourceOptions> = {},
): DataSourceOptions {
  return createDataSourceOptions({
    entities: ['src/modules/**/entities/*.entity.ts'],
    migrations: ['src/migrations/*.ts'],
    ...overrides,
  });
}

/**
 * Creates DataSource options for testing
 */
export function createTestDataSourceOptions(
  overrides: Partial<DataSourceOptions> = {},
): DataSourceOptions {
  const baseDir = path.resolve(__dirname, '../../');

  return createDataSourceOptions({
    database: 'fountain_test_db',
    synchronize: true,
    dropSchema: true,
    entities: [path.join(baseDir, 'dist/modules/**/entities/*.entity.js')],
    logging: false as unknown as boolean,
    ...overrides,
  });
}
