# Database Configuration Architecture

## Overview

The database configuration uses a centralized, type-safe approach through the `ConfigService` to ensure consistency across all contexts (NestJS DI, migrations, and utility scripts).

## Architecture Layers

### 1. Environment Variable Validation (`env/env.validation.ts`)

Defines the Joi schema for all environment variables with types and defaults.

```typescript
DB_HOST: Joi.string().required(),
DB_PORT: Joi.number().port().default(5432),
// ... etc
```

### 2. Configuration Service (`env/config.service.ts`)

Provides typed getters for environment variables, used within NestJS DI context.

```typescript
@Injectable()
export class ConfigService {
  get dbHost(): string { ... }
  get dbPort(): number { ... }
  // ... etc
}
```

### 3. Database Configuration (`database.config.ts`)

Creates TypeORM options using ConfigService, handles three contexts:

#### For NestJS DI (Injected ConfigService)

```typescript
export const databaseConfig = (configService: ConfigService): TypeOrmModuleOptions => {
  // Uses injected ConfigService with validated environment variables
  return {
    host: configService.dbHost,
    port: configService.dbPort,
    // ... etc
  };
};
```

#### For Scripts (Factory Function)

```typescript
function createConfigServiceInstance(): ConfigService {
  const nestConfigService = new NestConfigService(process.env);
  return new ConfigService(nestConfigService);
}

export function createDataSourceOptions(): PostgresConnectionOptions {
  const dbConfig = getEnvDatabaseConfig(); // Uses factory internally
  // Returns TypeORM options
}
```

**Key Points:**
- ✅ Factory creates ConfigService instance on-demand for scripts
- ✅ Uses same validation schema as NestJS context
- ✅ No direct `process.env` access in production code

### 4. JavaScript Configuration Loader (`config/config-loader.js`)

For Node.js scripts that can't use TypeScript, mirrors ConfigService defaults.

```javascript
function getDatabaseConfig() {
  // Uses same defaults as ConfigService
  const dbHost = process.env.DB_HOST || 'localhost';
  // ... etc
}
```

## Configuration Flow

### NestJS Application

```
environment variables (.env)
          ↓
env.validation.ts (Joi schema)
          ↓
ConfigService (typed getters)
          ↓
database.config.ts (databaseConfig function)
          ↓
TypeORM configuration in app.module.ts
```

### Migration/Script Execution

```
environment variables (.env)
          ↓
database.config.ts (createDataSourceOptions)
          ↓
ConfigService (via factory function)
          ↓
TypeORM DataSource
```

### JavaScript Scripts

```
environment variables (.env)
          ↓
config/config-loader.js
          ↓
Script functions (migrate, check-connection, etc.)
```

## Benefits

✅ **Centralized**: Single source of truth for all configuration
✅ **Type-Safe**: TypeScript ensures correct types in TypeScript code
✅ **Validated**: All environment variables validated against schema
✅ **Consistent**: Same defaults and logic across all contexts
✅ **DI-Aware**: Works both with and without NestJS dependency injection
✅ **Documented**: Clear separation of concerns and responsibilities

## Usage Examples

### In NestJS Services

```typescript
@Injectable()
export class DatabaseService {
  constructor(private configService: ConfigService) {}

  getConnectionInfo() {
    return {
      host: this.configService.dbHost,
      port: this.configService.dbPort,
    };
  }
}
```

### In Migration Files

```typescript
import { createDevelopmentDataSourceOptions } from '@backend/src/config/database.config';

export const AppDataSource = new DataSource(
  createDevelopmentDataSourceOptions() as any
);
```

### In Utility Scripts

```javascript
const { getDatabaseConfig } = require('./config/config-loader');
const config = getDatabaseConfig();
// Use config.DB_HOST, config.DB_PORT, etc.
```

## Environment Variables

All configuration comes from these environment variables (with defaults):

| Variable | Type | Default | Notes |
|----------|------|---------|-------|
| `DB_HOST` | string | localhost | Database hostname |
| `DB_PORT` | number | 5432 | Database port |
| `DB_USERNAME` | string | fountain | Database user |
| `DB_PASSWORD` | string | fountain_dev_pass | Database password |
| `DB_NAME` | string | fountain_db | Database name |
| `DB_LOGGING` | boolean | false | Enable TypeORM logging |
| `NODE_ENV` | string | development | Environment (development/production) |

## SSL Configuration

SSL is automatically enabled for Supabase connections:

```typescript
ssl: configService.dbHost.includes('supabase')
  ? { rejectUnauthorized: false }
  : (undefined as any)
```

This is applied consistently in:
- `database.config.ts` (databaseConfig function)
- `database.config.ts` (createDataSourceOptions)
- `config/config-loader.js` (indirectly through getPostgresClientConfig)

## Testing

For tests, use `createTestDataSourceOptions`:

```typescript
import { createTestDataSourceOptions } from '@backend/src/config/database.config';

const testDataSource = new DataSource(
  createTestDataSourceOptions({
    database: 'custom_test_db',
  })
);
```

This automatically:
- Sets database to `fountain_test_db`
- Enables `synchronize: true`
- Enables `dropSchema: true`
- Disables logging

## Migration

### Development Migrations

```bash
npm run migration:generate -- path/to/migration
npm run migration:run
```

Uses `scripts/typeorm/data-source.ts` with development configuration.

### Production Migrations

Compiled migrations use `scripts/typeorm/data-source.migration.ts` which:
- Points to compiled `dist/` files
- Enables logging for visibility
- Uses production DataSource configuration

## Troubleshooting

### "Cannot find module"

Ensure you're importing from the correct location:
- TypeScript: `src/config/database.config.ts`
- Scripts: `config/config-loader.js`

### Database Connection Fails

Check that environment variables are set:

```bash
npm run test:db  # Uses config/config-loader.js
```

### Type Errors in TypeScript

Always inject `ConfigService` via NestJS DI, don't try to instantiate manually in application code (factory function is only for scripts/migrations).
