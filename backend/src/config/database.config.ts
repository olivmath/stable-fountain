import 'reflect-metadata';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { ConfigService } from './env/config.service';

// Load environment variables for scripts that run outside NestJS
dotenv.config();

/**
 * Factory function to create a ConfigService instance for use outside NestJS DI
 * This ensures consistent configuration validation across all contexts
 *
 * Used for scripts that run outside of NestJS dependency injection container
 */
function createConfigServiceInstance(): ConfigService {
  // Create a NestJS ConfigService that reads from process.env
  // This approach works because dotenv.config() was already called at module load time
  const nestConfigService = new NestConfigService(process.env);
  return new ConfigService(nestConfigService);
}

/**
 * Get database configuration using ConfigService
 * Used for scripts and configurations that run outside of NestJS DI
 * Ensures consistency with the main @backend/src/config/env module
 */
function getEnvDatabaseConfig() {
  const configService = createConfigServiceInstance();

  return {
    host: configService.dbHost,
    port: configService.dbPort,
    username: configService.dbUsername,
    password: configService.dbPassword,
    database: configService.dbName,
    logging: configService.isDevelopment,
    ssl: configService.dbHost.includes('supabase')
      ? { rejectUnauthorized: false }
      : (undefined as any),
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
    ssl: configService.dbHost.includes('supabase')
      ? { rejectUnauthorized: false }
      : (undefined as any),
    entities: [entitiesPath],
    migrations: [migrationsPath],
    migrationsTableName: 'typeorm_migrations',
    synchronize: false,
    logging: configService.isDevelopment,
    keepConnectionAlive: true,
  };
};

/**
 * Creates TypeORM DataSource options from environment variables
 * Used for migration files and utility scripts
 *
 * Uses ConfigService under the hood to ensure:
 * - Environment variable validation (via Joi schema)
 * - Type-safe configuration access
 * - Consistency with NestJS dependency injection context
 */
export function createDataSourceOptions(
  overrides: Partial<PostgresConnectionOptions> = {},
): PostgresConnectionOptions {
  const dbConfig = getEnvDatabaseConfig();

  return {
    type: 'postgres',
    host: dbConfig.host,
    port: dbConfig.port,
    username: dbConfig.username,
    password: dbConfig.password,
    database: dbConfig.database,
    ssl: dbConfig.ssl,
    synchronize: false,
    logging: dbConfig.logging as boolean,
    migrationsTableName: 'typeorm_migrations',
    ...overrides,
  } as PostgresConnectionOptions;
}

/**
 * Creates DataSource options for production (compiled dist files)
 */
export function createProductionDataSourceOptions(
  overrides: Partial<PostgresConnectionOptions> = {},
): PostgresConnectionOptions {
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
  overrides: Partial<PostgresConnectionOptions> = {},
): PostgresConnectionOptions {
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
  overrides: Partial<PostgresConnectionOptions> = {},
): PostgresConnectionOptions {
  const baseDir = path.resolve(__dirname, '../../');

  return createDataSourceOptions({
    database: 'fountain_test_db',
    synchronize: true,
    dropSchema: true,
    entities: [path.join(baseDir, 'dist/modules/**/entities/*.entity.js')],
    logging: false,
    ...overrides,
  });
}
