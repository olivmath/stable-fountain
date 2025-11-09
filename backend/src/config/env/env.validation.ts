import * as Joi from 'joi';

export const validationSchema = Joi.object({
  // Server Configuration
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().port().default(3000),

  // Database Configuration (Supabase PostgreSQL)
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().port().default(5432),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().default('postgres'),

  // Authentication (JWT)
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRATION: Joi.string().default('7d'),

  // Queue & Cache (Redis)
  REDIS_URL: Joi.string().default('redis://localhost:6379'),

  // Webhooks & Async Processing
  WEBHOOK_RETRY_ATTEMPTS: Joi.number().default(3),
  WEBHOOK_RETRY_DELAY: Joi.number().default(5000),

  // Collateralization Ratios
  COLLATERAL_RATIO_MIN: Joi.number().default(150),
  COLLATERAL_RATIO_EMERGENCY: Joi.number().default(120),

  // Future: Xahau/XRPL Integration (Optional)
  XRPL_NETWORK: Joi.string().optional(),
  XRPL_WEBSOCKET_URL: Joi.string().uri().optional(),
  XRPL_ACCOUNT: Joi.string().optional(),
  XRPL_SECRET: Joi.string().optional(),
});
