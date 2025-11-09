const { execSync } = require('child_process');
const path = require('path');
require('dotenv').config();

// Run migrations using the dist files
try {
  console.log('Running migrations...');
  execSync(
    `npx typeorm -d "${path.join(__dirname, 'data-source.ts')}" migration:run`,
    {
      stdio: 'inherit',
      cwd: __dirname,
      env: { ...process.env, NODE_OPTIONS: '--loader ts-node/esm' }
    }
  );
  console.log('Migrations completed successfully!');
} catch (error) {
  console.error('Migration failed:', error.message);
  process.exit(1);
}
