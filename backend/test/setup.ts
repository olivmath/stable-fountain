import { DataSource } from 'typeorm';
import { join } from 'path';

let testDataSource: DataSource;

export async function setupTestDatabase() {
  testDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'fountain',
    password: process.env.DB_PASSWORD || 'fountain_dev_pass',
    database: process.env.DB_NAME || 'fountain_test_db',
    synchronize: true,
    dropSchema: true,
    entities: [join(__dirname, '../dist/modules/**/entities/*.entity.js')],
    logging: false,
  });

  await testDataSource.initialize();
  return testDataSource;
}

export async function closeTestDatabase() {
  if (testDataSource && testDataSource.isInitialized) {
    await testDataSource.destroy();
  }
}

export async function clearDatabase() {
  if (!testDataSource || !testDataSource.isInitialized) {
    return;
  }

  const entities = testDataSource.entityMetadatas;
  for (const entity of entities) {
    const repository = testDataSource.getRepository(entity.name);
    await repository.query(`TRUNCATE TABLE "${entity.tableName}" CASCADE;`);
  }
}

export function getTestDataSource(): DataSource {
  if (!testDataSource || !testDataSource.isInitialized) {
    throw new Error('Test database not initialized');
  }
  return testDataSource;
}
