#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const { getAllConfig } = require('../../config/config-loader');

/**
 * Run database migrations
 * Uses environment variables from @backend/config/config-loader module
 *
 * Usage: npm run migrate
 */

// Ensure environment is loaded
const config = getAllConfig();

try {
  console.log('🚀 Running migrations...');
  console.log(`📝 Connecting to ${config.database.DB_HOST}:${config.database.DB_PORT}/${config.database.DB_NAME}`);
  console.log('');

  execSync(
    `npx typeorm -d "${path.join(__dirname, 'data-source.ts')}" migration:run`,
    {
      stdio: 'inherit',
      cwd: path.join(__dirname, '../..'),
      env: { ...process.env, NODE_OPTIONS: '--loader ts-node/esm' }
    }
  );

  console.log('');
  console.log('✅ Migrations completed successfully!');
} catch (error) {
  console.error('❌ Migration failed:', error.message);
  process.exit(1);
}
