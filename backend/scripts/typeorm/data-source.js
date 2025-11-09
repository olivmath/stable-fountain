require('reflect-metadata');

const { DataSource } = require('typeorm');
const { join } = require('path');
const { getDatabaseConfig } = require('../config/config-loader');

/**
 * JavaScript DataSource configuration
 * Used for compiled migrations
 * Uses environment variables from @backend/config/config-loader module
 */
const dbConfig = getDatabaseConfig();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: dbConfig.DB_HOST,
  port: dbConfig.DB_PORT,
  username: dbConfig.DB_USERNAME,
  password: dbConfig.DB_PASSWORD,
  database: dbConfig.DB_NAME,
  synchronize: false,
  logging: dbConfig.DB_LOGGING,
  entities: [join(__dirname, '../../dist/modules/**/entities/*.entity.js')],
  migrations: [join(__dirname, '../../dist/migrations/*.js')],
  migrationsTableName: 'typeorm_migrations',
  connectTimeoutMS: 5000,
});

module.exports = {
  AppDataSource,
};
