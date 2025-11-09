import * as Joi from 'joi';

/**
 * Environment Variables Validation Schema
 *
 * This schema is used to validate all environment variables at startup.
 * If any required variable is missing, the application will fail with a clear error message.
 *
 * Configuration is applied in this order:
 * 1. Values from .env file (via dotenv)
 * 2. Validation against this schema
 * 3. Default values applied
 *
 * Startup Validation: All errors are collected and shown together.
 */
export const validationSchema = Joi.object({
  // ===== Server Configuration =====
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development')
    .messages({
      'any.only': 'NODE_ENV must be one of: development, production, test',
    }),
  PORT: Joi.number().port().default(3000).messages({
    'number.port': 'PORT must be a valid port number (1-65535)',
  }),

  // ===== Database Configuration (Supabase PostgreSQL) =====
  DB_HOST: Joi.string()
    .required()
    .messages({
      'any.required': 'DB_HOST is required. Provide the database hostname.',
      'string.empty': 'DB_HOST cannot be empty.',
    }),
  DB_PORT: Joi.number().port().default(5432).messages({
    'number.port': 'DB_PORT must be a valid port number (default: 5432)',
  }),
  DB_USERNAME: Joi.string()
    .required()
    .messages({
      'any.required':
        'DB_USERNAME is required. Provide the database username.',
      'string.empty': 'DB_USERNAME cannot be empty.',
    }),
  DB_PASSWORD: Joi.string()
    .required()
    .messages({
      'any.required':
        'DB_PASSWORD is required. Provide the database password.',
      'string.empty': 'DB_PASSWORD cannot be empty.',
    }),
  DB_NAME: Joi.string().default('postgres').messages({
    'string.empty': 'DB_NAME cannot be empty.',
  }),

  // ===== Authentication (JWT) =====
  JWT_SECRET: Joi.string()
    .required()
    .min(32)
    .messages({
      'any.required':
        'JWT_SECRET is required. Generate a secure random string (min 32 chars).',
      'string.empty': 'JWT_SECRET cannot be empty.',
      'string.min': 'JWT_SECRET must be at least 32 characters long.',
    }),
  JWT_EXPIRATION: Joi.string().default('7d').messages({
    'string.empty': 'JWT_EXPIRATION cannot be empty.',
  }),

  // ===== Queue & Cache (Redis) =====
  REDIS_URL: Joi.string().default('redis://localhost:6379').messages({
    'string.uri': 'REDIS_URL must be a valid Redis connection URL.',
  }),

  // ===== Webhooks & Async Processing =====
  WEBHOOK_RETRY_ATTEMPTS: Joi.number().default(3).messages({
    'number.base': 'WEBHOOK_RETRY_ATTEMPTS must be a number.',
  }),
  WEBHOOK_RETRY_DELAY: Joi.number().default(5000).messages({
    'number.base': 'WEBHOOK_RETRY_DELAY must be a number (milliseconds).',
  }),

  // ===== Collateralization Ratios =====
  COLLATERAL_RATIO_MIN: Joi.number().default(150).messages({
    'number.base': 'COLLATERAL_RATIO_MIN must be a number (default: 150%).',
  }),
  COLLATERAL_RATIO_EMERGENCY: Joi.number().default(120).messages({
    'number.base': 'COLLATERAL_RATIO_EMERGENCY must be a number (default: 120%).',
  }),

  // ===== Future: Xahau/XRPL Integration (Optional) =====
  XRPL_NETWORK: Joi.string().optional().messages({
    'string.empty': 'XRPL_NETWORK cannot be empty if provided.',
  }),
  XRPL_WEBSOCKET_URL: Joi.string().uri().optional().messages({
    'string.uri': 'XRPL_WEBSOCKET_URL must be a valid WebSocket URL.',
  }),
  XRPL_ACCOUNT: Joi.string().optional().messages({
    'string.empty': 'XRPL_ACCOUNT cannot be empty if provided.',
  }),
  XRPL_SECRET: Joi.string().optional().messages({
    'string.empty': 'XRPL_SECRET cannot be empty if provided.',
  }),
}).unknown(true);
