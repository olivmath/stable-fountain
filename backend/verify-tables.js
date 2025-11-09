const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

async function verifyTables() {
  try {
    await client.connect();
    console.log('✓ Connected to Supabase\n');

    const result = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    console.log('📋 Database Tables:');
    console.log('─'.repeat(40));
    result.rows.forEach(row => {
      console.log(`  • ${row.table_name}`);
    });

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
    console.error('Error:', error.message);
    process.exit(1);
  }
}

verifyTables();
