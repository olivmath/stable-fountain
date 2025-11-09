import { DataSource } from 'typeorm';
import { createTestDataSourceOptions } from '../src/config/database.config';

let testDataSource: DataSource;

/**
 * Setup test database
 * Uses environment variables from @backend/src/config/env module
 */
export async function setupTestDatabase() {
  testDataSource = new DataSource(
    createTestDataSourceOptions() as any,
  );

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
