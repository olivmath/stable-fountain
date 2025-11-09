/**
 * Configuration Loader for JavaScript Scripts
 *
 * This module centralizes environment variable loading for all scripts
 * that run outside of the NestJS application context.
 *
 * All scripts should use this loader instead of accessing process.env directly.
 * This ensures consistency with the @backend/src/config/env module.
 */

require('dotenv').config();

/**
 * Get database configuration from environment variables
 * @returns {Object} Database configuration object
 */
function getDatabaseConfig() {
  return {
    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_PORT: parseInt(process.env.DB_PORT || '5432', 10),
    DB_USERNAME: process.env.DB_USERNAME || 'fountain',
    DB_PASSWORD: process.env.DB_PASSWORD || 'fountain_dev_pass',
    DB_NAME: process.env.DB_NAME || 'fountain_db',
    DB_LOGGING: process.env.DB_LOGGING === 'true',
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
