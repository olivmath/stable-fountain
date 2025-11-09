#!/usr/bin/env node

const { Client } = require('pg');
const { getPostgresClientConfig } = require('../../config/config-loader');

/**
 * Verify database tables
 * Uses configuration from @backend/config/config-loader module
 *
 * Usage: npm run verify:tables
 */

const client = new Client(getPostgresClientConfig());

async function verifyTables() {
  try {
    await client.connect();
    console.log('✓ Connected to database\n');

    const result = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    console.log('📋 Database Tables:');
    console.log('─'.repeat(40));

    if (result.rows.length === 0) {
      console.log('  (No tables found)');
    } else {
      result.rows.forEach(row => {
        console.log(`  • ${row.table_name}`);
      });
    }

    // Get column info for a sample table
    if (result.rows.length > 0) {
      const sampleTable = result.rows[0].table_name;
      console.log(`\n📊 Sample Table Structure (${sampleTable}):`);
      console.log('─'.repeat(40));

      const colsResult = await client.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = $1
        ORDER BY ordinal_position
      `, [sampleTable]);

      colsResult.rows.forEach(col => {
        const nullable = col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL';
        console.log(`  • ${col.column_name}: ${col.data_type} ${nullable}`);
      });
    }

    console.log('\n✅ Database verification complete!');
    await client.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

verifyTables();
