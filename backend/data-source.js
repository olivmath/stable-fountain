require('reflect-metadata');
require('dotenv').config();

const { DataSource } = require('typeorm');
const { join } = require('path');

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'fountain',
  password: process.env.DB_PASSWORD || 'fountain_dev_pass',
  database: process.env.DB_NAME || 'fountain_db',
  synchronize: false,
  logging: process.env.DB_LOGGING === 'true',
  entities: [join(__dirname, 'dist/modules/**/entities/*.entity.js')],
  migrations: [join(__dirname, 'dist/migrations/*.js')],
  migrationsTableName: 'typeorm_migrations',
  connectTimeoutMS: 5000,
});

module.exports = {
  AppDataSource,
};
