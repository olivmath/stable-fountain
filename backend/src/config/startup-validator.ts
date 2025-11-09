import { Logger } from '@nestjs/common';

/**
 * Startup Validator
 *
 * This validator runs at application startup (in main.ts) and ensures all
 * required environment variables are present and correctly formatted.
 *
 * If any required variables are missing or invalid, it will:
 * 1. Print a clear error message for each missing/invalid variable
 * 2. Print instructions on how to fix it
 * 3. Throw an error to prevent the application from starting
 */

const logger = new Logger('StartupValidator');

/**
 * Required environment variables and their descriptions
 */
const REQUIRED_ENV_VARS = {
  DB_HOST: {
    description: 'Database hostname (e.g., db.example.com)',
    example: 'db.pggwkqshqyxjhjlsdzww.supabase.co',
  },
  DB_USERNAME: {
    description: 'Database username',
    example: 'postgres',
  },
  DB_PASSWORD: {
    description: 'Database password',
    example: 'your_secure_password_here',
  },
  JWT_SECRET: {
    description: 'JWT secret for signing tokens (min 32 characters)',
    example: 'your_secret_key_must_be_at_least_32_characters_long',
  },
};

/**
 * Validates that all required environment variables are present at startup
 * Called in main.ts before the application is fully initialized
 */
export function validateStartupEnvironment(): void {
  const missingVars: string[] = [];
  const invalidVars: Array<{ name: string; reason: string }> = [];

  // Check required environment variables
  for (const [varName, info] of Object.entries(REQUIRED_ENV_VARS)) {
    const value = process.env[varName];

    if (!value || value.trim() === '') {
      missingVars.push(varName);
    } else if (varName === 'JWT_SECRET' && value.length < 32) {
      invalidVars.push({
        name: varName,
        reason: `JWT_SECRET must be at least 32 characters long (current: ${value.length} chars)`,
      });
    }
  }

  // If there are errors, display them clearly and exit
  if (missingVars.length > 0 || invalidVars.length > 0) {
    printStartupValidationErrors(missingVars, invalidVars);
    process.exit(1);
  }

  logger.log('✅ All required environment variables are present and valid');
}

/**
 * Prints validation errors in a clear, actionable format
 */
function printStartupValidationErrors(
  missing: string[],
  invalid: Array<{ name: string; reason: string }>,
): void {
  console.error('\n');
  console.error('╔════════════════════════════════════════════════════════════════╗');
  console.error('║                 ❌ CONFIGURATION ERROR                          ║');
  console.error('║                                                                ║');
  console.error('║  Required environment variables are missing or invalid.         ║');
  console.error('║  The application cannot start.                                 ║');
  console.error('╚════════════════════════════════════════════════════════════════╝');
  console.error('\n');

  // Print missing variables
  if (missing.length > 0) {
    console.error('📋 MISSING REQUIRED VARIABLES:');
    console.error('─'.repeat(64));
    missing.forEach((varName) => {
      const info = REQUIRED_ENV_VARS[varName];
      console.error(`\n  ❌ ${varName}`);
      console.error(`     Description: ${info.description}`);
      console.error(`     Example:     ${info.example}`);
    });
    console.error('\n');
  }

  // Print invalid variables
  if (invalid.length > 0) {
    console.error('⚠️  INVALID VARIABLE VALUES:');
    console.error('─'.repeat(64));
    invalid.forEach(({ name, reason }) => {
      console.error(`\n  ❌ ${name}`);
      console.error(`     Issue: ${reason}`);
    });
    console.error('\n');
  }

  // Print solution instructions
  console.error('📝 HOW TO FIX:');
  console.error('─'.repeat(64));
  console.error('\n  1. Check your .env file in the project root');
  console.error('  2. Ensure all required variables above are set');
  console.error('  3. Make sure values are not empty or whitespace-only');
  console.error('  4. Restart the application\n');

  console.error('  Environment file location: .env');
  console.error('  Example: .env.example\n');

  console.error('═'.repeat(64));
  console.error('Application startup aborted due to configuration errors.\n');
}

/**
 * Handles errors that occur during ConfigModule initialization
 * This is called if the NestJS ConfigModule validation fails
 */
export function handleConfigurationError(error: Error): void {
  console.error('\n');
  console.error('╔════════════════════════════════════════════════════════════════╗');
  console.error('║              ❌ CONFIGURATION VALIDATION FAILED                 ║');
  console.error('║                                                                ║');
  console.error('║  Invalid environment variable types or formats detected.        ║');
  console.error('╚════════════════════════════════════════════════════════════════╝');
  console.error('\n');

  console.error('Error Details:');
  console.error('─'.repeat(64));
  console.error(error.message);
  console.error('\n');

  console.error('💡 Common Issues:');
  console.error('  • PORT is not a valid number (1-65535)');
  console.error('  • DB_PORT is not a valid port number');
  console.error('  • NODE_ENV is not one of: development, production, test');
  console.error('  • REDIS_URL is not a valid connection URL');
  console.error('  • Number values are enclosed in quotes\n');

  console.error('📚 Check .env file for type mismatches and fix them.\n');
  console.error('═'.repeat(64));
  console.error('Application startup aborted due to configuration errors.\n');
}
