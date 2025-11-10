# Backend Scripts Organization

## Overview

All backend scripts have been organized into a structured directory layout for better maintainability and clarity.

## Directory Structure

```
backend/
├── config/
│   └── config-loader.js              # Centralized configuration loader
├── scripts/
│   ├── README.md                     # Scripts documentation
│   ├── database/                     # Database management scripts
│   │   ├── migrate.js               # Run migrations
│   │   ├── check-connection.js       # Test database connection
│   │   └── verify-tables.js          # Verify database structure
│   ├── typeorm/                      # TypeORM configuration files
│   │   ├── data-source.ts           # Dev DataSource (TypeScript)
│   │   ├── data-source.migration.ts # Migration DataSource
│   │   └── data-source.js           # Prod DataSource (JavaScript)
│   └── generate-openapi.ts          # OpenAPI schema generation
├── package.json                      # Updated with new scripts
└── README.md
```

## Key Changes

### Moved Files

| Old Location | New Location | Purpose |
|---|---|---|
| `data-source.ts` | `scripts/typeorm/data-source.ts` | Development TypeORM config |
| `data-source.migration.ts` | `scripts/typeorm/data-source.migration.ts` | Migration TypeORM config |
| `data-source.js` | `scripts/typeorm/data-source.js` | Compiled migration config |
| `test-connection.js` | `scripts/database/check-connection.js` | Test DB connection |
| `verify-tables.js` | `scripts/database/verify-tables.js` | Verify DB schema |
| `run-migrations.js` | `scripts/database/migrate.js` | Run migrations |
| `config-loader.js` | `config/config-loader.js` | Env var loader |

### New npm Scripts

Added convenient commands in `package.json`:

```json
{
  "scripts": {
    "test:db": "node scripts/database/check-connection.js",
    "verify:tables": "node scripts/database/verify-tables.js",
    "migrate": "node scripts/database/migrate.js"
  }
}
```

### Usage

**Test database connection:**
```bash
npm run test:db
```

**Verify database tables:**
```bash
npm run verify:tables
```

**Run migrations:**
```bash
npm run migrate
# or (using typeorm directly)
npm run migration:run
```

## Configuration

All scripts use `config/config-loader.js` for centralized environment variable management.

This loader:
- ✅ Loads `.env` file automatically
- ✅ Provides type-safe configuration functions
- ✅ Maintains consistency with `src/config/env` module
- ✅ Eliminates direct `process.env` access

### Configuration Functions

```javascript
const { getDatabaseConfig, getPostgresClientConfig } = require('./config/config-loader');

// Get database config object
const dbConfig = getDatabaseConfig();

// Get PostgreSQL client config
const pgConfig = getPostgresClientConfig();
```

## Benefits

✅ **Organized** - Scripts grouped by functionality
✅ **Maintainable** - Single config loader for all scripts
✅ **Discoverable** - Clear directory structure
✅ **Documented** - README in scripts directory
✅ **Consistent** - All scripts follow same patterns

## Adding New Scripts

1. Create your script in the appropriate subdirectory
2. Use `require('../../config/config-loader')` to load configuration
3. Add npm script to `package.json`
4. Document in `scripts/README.md`

Example:
```javascript
// scripts/my-feature/my-script.js
const { getDatabaseConfig } = require('../../config/config-loader');

const config = getDatabaseConfig();
// Use config...
```

Then add to `package.json`:
```json
{
  "scripts": {
    "my:script": "node scripts/my-feature/my-script.js"
  }
}
```

## Notes

- All database scripts use shared configuration
- Path references account for directory depth
- Scripts are executable with `#!/usr/bin/env node` shebang
- Migration files handle both TypeScript and compiled JavaScript paths
