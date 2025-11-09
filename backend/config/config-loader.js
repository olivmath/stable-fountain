/**
 * Configuration Loader for JavaScript Scripts
 *
 * This module centralizes environment variable loading for all scripts
 * that run outside of the NestJS application context.
 *
 * All scripts should use this loader instead of accessing process.env directly.
 * This ensures consistency with the @backend/src/config/env/config.service module.
 *
 * NOTE: This is a JavaScript module that mirrors the TypeScript ConfigService
 * for use in Node.js scripts. For TypeScript code, use the ConfigService directly.
 */

require('dotenv').config();

/**
 * Get database configuration from environment variables
 * Uses same defaults and validation as the TypeScript ConfigService
 * @returns {Object} Database configuration object
 */
function getDatabaseConfig() {
  // These defaults match @backend/src/config/env/env.validation.ts
  const dbHost = process.env.DB_HOST || 'localhost';
  const dbPort = parseInt(process.env.DB_PORT || '5432', 10);
  const dbUsername = process.env.DB_USERNAME || 'fountain';
  const dbPassword = process.env.DB_PASSWORD || 'fountain_dev_pass';
  const dbName = process.env.DB_NAME || 'fountain_db';
  const dbLogging = process.env.DB_LOGGING === 'true';

  return {
    DB_HOST: dbHost,
    DB_PORT: dbPort,
    DB_USERNAME: dbUsername,
    DB_PASSWORD: dbPassword,
    DB_NAME: dbName,
    DB_LOGGING: dbLogging,
  };
}

/**
 * Create PostgreSQL client configuration
 * @returns {Object} PostgreSQL client config for 'pg' library
 */
function getPostgresClientConfig() {
  const config = getDatabaseConfig();
  return {
    host: config.DB_HOST,
    port: config.DB_PORT,
    user: config.DB_USERNAME,
    password: config.DB_PASSWORD,
    database: config.DB_NAME,
  };
}

/**
 * Get server configuration
 * @returns {Object} Server configuration
 */
function getServerConfig() {
  return {
    PORT: parseInt(process.env.PORT || '3000', 10),
    NODE_ENV: process.env.NODE_ENV || 'development',
  };
}

/**
 * Get all configuration
 * @returns {Object} Complete configuration object
 */
function getAllConfig() {
  return {
    database: getDatabaseConfig(),
    postgres: getPostgresClientConfig(),
    server: getServerConfig(),
  };
}

module.exports = {
  getDatabaseConfig,
  getPostgresClientConfig,
  getServerConfig,
  getAllConfig,
};
