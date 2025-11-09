import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { createDevelopmentDataSourceOptions } from '../../src/config/database.config';

/**
 * Development DataSource configuration
 * Used for running migrations in development environment
 * Uses environment variables from @backend/src/config/env module
 */
export const AppDataSource = new DataSource(
  createDevelopmentDataSourceOptions() as any,
);
