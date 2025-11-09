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
    .required()
    .messages({
      'any.required': 'NODE_ENV is required. Must be one of: development, production, test',
      'any.only': 'NODE_ENV must be one of: development, production, test',
    }),
  PORT: Joi.number().port().required().messages({
    'any.required': 'PORT is required. Provide a valid port number (1-65535)',
    'number.port': 'PORT must be a valid port number (1-65535)',
  }),

  // ===== Database Configuration (Supabase PostgreSQL) =====
  DB_HOST: Joi.string()
    .required()
    .messages({
      'any.required': 'DB_HOST is required. Provide the database hostname.',
      'string.empty': 'DB_HOST cannot be empty.',
    }),
  DB_PORT: Joi.number().port().required().messages({
    'any.required': 'DB_PORT is required. Provide a valid port number for database.',
    'number.port': 'DB_PORT must be a valid port number',
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
  DB_NAME: Joi.string().required().messages({
    'any.required': 'DB_NAME is required. Provide the database name.',
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
  JWT_EXPIRATION: Joi.string().required().messages({
    'any.required': 'JWT_EXPIRATION is required. Provide JWT token expiration time (e.g., 7d, 24h).',
    'string.empty': 'JWT_EXPIRATION cannot be empty.',
  }),

  // ===== Queue & Cache (Redis) =====
  REDIS_URL: Joi.string().required().messages({
    'any.required': 'REDIS_URL is required. Provide Redis connection URL (e.g., redis://localhost:6379).',
    'string.uri': 'REDIS_URL must be a valid Redis connection URL.',
  }),

  // ===== Webhooks & Async Processing =====
  WEBHOOK_RETRY_ATTEMPTS: Joi.number().required().messages({
    'any.required': 'WEBHOOK_RETRY_ATTEMPTS is required. Provide number of webhook retry attempts.',
    'number.base': 'WEBHOOK_RETRY_ATTEMPTS must be a number.',
  }),
  WEBHOOK_RETRY_DELAY: Joi.number().required().messages({
    'any.required': 'WEBHOOK_RETRY_DELAY is required. Provide retry delay in milliseconds.',
    'number.base': 'WEBHOOK_RETRY_DELAY must be a number (milliseconds).',
  }),

  // ===== Collateralization Ratios =====
  COLLATERAL_RATIO_MIN: Joi.number().required().messages({
    'any.required': 'COLLATERAL_RATIO_MIN is required. Provide minimum collateralization ratio (e.g., 150 for 150%).',
    'number.base': 'COLLATERAL_RATIO_MIN must be a number.',
  }),
  COLLATERAL_RATIO_EMERGENCY: Joi.number().required().messages({
    'any.required': 'COLLATERAL_RATIO_EMERGENCY is required. Provide emergency collateralization ratio (e.g., 120 for 120%).',
    'number.base': 'COLLATERAL_RATIO_EMERGENCY must be a number.',
  }),
}).unknown(true);
