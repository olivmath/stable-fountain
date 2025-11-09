import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { createProductionDataSourceOptions } from '../../src/config/database.config';

/**
 * Migration DataSource configuration
 * Used for running migrations in production and CI/CD
 * Configured for compiled dist files
 * Uses environment variables from @backend/src/config/env module
 */
export const AppDataSource = new DataSource(
  createProductionDataSourceOptions({
    logging: true,
    subscribers: [],
  }) as any,
);
