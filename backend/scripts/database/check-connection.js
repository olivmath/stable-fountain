#!/usr/bin/env node

const { Client } = require('pg');
const { getPostgresClientConfig } = require('../../config/config-loader');

/**
 * Test database connection
 * Uses configuration from @backend/config/config-loader module
 *
 * Usage: npm run test:db
 */

const config = getPostgresClientConfig();
const client = new Client(config);

console.log('🔍 Testing database connection...');
console.log(`   Host: ${config.host}`);
console.log(`   Port: ${config.port}`);
console.log(`   Database: ${config.database}`);
console.log('');

client.connect((err) => {
  if (err) {
    console.error('❌ Connection error:', err.message);
    process.exit(1);
  }

  console.log('✅ Connected successfully to database!');
  console.log('');
  client.end();
});
