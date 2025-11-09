import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from './env/config.service';

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
