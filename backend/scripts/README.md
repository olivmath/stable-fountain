# Backend Scripts

This directory contains utility scripts for the Stable Fountain backend application.

## Directory Structure

```
scripts/
├── database/              # Database management scripts
│   ├── migrate.js        # Run database migrations
│   ├── check-connection.js # Test database connection
│   └── verify-tables.js   # Verify and inspect database tables
├── typeorm/              # TypeORM configuration files
│   ├── data-source.ts    # Development DataSource (TypeScript)
│   ├── data-source.migration.ts # Migration DataSource (TypeScript)
│   └── data-source.js    # Production DataSource (JavaScript)
└── generate-openapi.ts   # Generate OpenAPI documentation
```

## Configuration

All scripts use centralized configuration from `config/config-loader.js` which loads environment variables.
This ensures consistency with the main NestJS `@backend/src/config/env` module.

### Environment Variables

Required environment variables (see `.env.example`):
- `DB_HOST` - Database host
- `DB_PORT` - Database port (default: 5432)
- `DB_USERNAME` - Database username
- `DB_PASSWORD` - Database password
- `DB_NAME` - Database name

Optional:
- `DB_LOGGING` - Enable TypeORM logging (true/false)

## Database Scripts

### Migrate (`scripts/database/migrate.js`)

Run pending database migrations.

```bash
npm run migrate
```

Uses `scripts/typeorm/data-source.ts` for configuration.

### Check Connection (`scripts/database/check-connection.js`)

Test the database connection without making any changes.

```bash
npm run test:db
```

### Verify Tables (`scripts/database/verify-tables.js`)

List all database tables and inspect their structure.

```bash
npm run verify:tables
```

## TypeORM DataSource Files

These files configure TypeORM for different contexts:

- **data-source.ts** - Used for development and CLI commands with TypeScript sources
- **data-source.migration.ts** - Used for running migrations with compiled dist files
- **data-source.js** - JavaScript version for compiled migrations

All use environment variables via `config/config-loader.js`.

## Configuration Loader

The `config/config-loader.js` module provides functions to get configuration:

```javascript
const { getDatabaseConfig, getPostgresClientConfig, getAllConfig } = require('./config/config-loader');

// Database configuration object
const dbConfig = getDatabaseConfig();
// => { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME, DB_LOGGING }

// PostgreSQL client configuration
const pgConfig = getPostgresClientConfig();
// => { host, port, user, password, database }

// All configuration
const allConfig = getAllConfig();
// => { database, postgres, server }
```

## Adding New Scripts

1. Create your script in the appropriate subdirectory
2. Import configuration from `../../config/config-loader`
3. Use the config functions instead of accessing `process.env` directly
4. Update `package.json` with the new npm script
5. Document the usage in this README

## Important Notes

- All scripts use `require('dotenv').config()` via the config-loader
- Scripts are executable with `#!/usr/bin/env node` shebang
- Paths in scripts are relative to their location, accounting for directory depth
- Migration paths account for both TypeScript sources and compiled JavaScript
