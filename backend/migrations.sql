-- Create typeorm_migrations table to track migrations
CREATE TABLE IF NOT EXISTS typeorm_migrations (
  id SERIAL PRIMARY KEY,
  timestamp BIGINT NOT NULL,
  name VARCHAR NOT NULL,
  UNIQUE(name)
);

-- Create tokenizers table
CREATE TABLE IF NOT EXISTS tokenizers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL UNIQUE,
  email VARCHAR NOT NULL UNIQUE,
  "apiKeyHash" VARCHAR NOT NULL,
  "subscriptionTier" VARCHAR,
  status VARCHAR NOT NULL DEFAULT 'active',
  metadata JSONB,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "IDX_tokenizers_email" ON tokenizers(email);
CREATE INDEX IF NOT EXISTS "IDX_tokenizers_name" ON tokenizers(name);

-- Create stablecoins table
CREATE TABLE IF NOT EXISTS stablecoins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tokenizerId" UUID NOT NULL REFERENCES tokenizers(id) ON DELETE CASCADE,
  "clientId" VARCHAR NOT NULL UNIQUE,
  name VARCHAR NOT NULL,
  "clientWallet" VARCHAR NOT NULL,
  currency VARCHAR NOT NULL DEFAULT 'RLBRL',
  "paymentMethod" VARCHAR NOT NULL DEFAULT 'PIX',
  status VARCHAR NOT NULL DEFAULT 'pending_deposit',
  "totalIssuedRlbrl" NUMERIC(20, 8) DEFAULT 0,
  "totalDepositedBrl" NUMERIC(20, 8) DEFAULT 0,
  "webhookUrl" VARCHAR,
  metadata JSONB,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "activatedAt" TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "IDX_stablecoins_clientId" ON stablecoins("clientId");
CREATE INDEX IF NOT EXISTS "IDX_stablecoins_tokenizerId" ON stablecoins("tokenizerId");

-- Create operations table
CREATE TABLE IF NOT EXISTS operations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "stablecoinId" UUID NOT NULL REFERENCES stablecoins(id) ON DELETE CASCADE,
  type VARCHAR NOT NULL,
  status VARCHAR NOT NULL DEFAULT 'pending',
  "amountRlbrl" NUMERIC(20, 8),
  "amountRlusd" NUMERIC(20, 8),
  "amountBrl" NUMERIC(20, 8),
  "exchangeRate" NUMERIC(10, 4),
  "feeCharged" NUMERIC(20, 8),
  "paymentMethod" VARCHAR,
  "depositRequestId" VARCHAR,
  "returnMethod" VARCHAR,
  "returnDestination" JSONB,
  "burnWallet" VARCHAR,
  "burnMemo" VARCHAR,
  "blockchainTxHash" VARCHAR,
  "blockchainBurnTxHash" VARCHAR,
  "completedAt" TIMESTAMP,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "IDX_operations_stablecoinId" ON operations("stablecoinId");
CREATE INDEX IF NOT EXISTS "IDX_operations_status" ON operations(status);
CREATE INDEX IF NOT EXISTS "IDX_operations_type" ON operations(type);

-- Create exchange_rates table
CREATE TABLE IF NOT EXISTS exchange_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source VARCHAR NOT NULL,
  "rateUsdBrl" NUMERIC(10, 4) NOT NULL,
  "fetchedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "IDX_exchange_rates_source" ON exchange_rates(source);
CREATE INDEX IF NOT EXISTS "IDX_exchange_rates_fetchedAt" ON exchange_rates("fetchedAt");

-- Create webhook_events table
CREATE TABLE IF NOT EXISTS webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tokenizerId" UUID NOT NULL REFERENCES tokenizers(id) ON DELETE CASCADE,
  "eventType" VARCHAR NOT NULL,
  "stablecoinId" UUID REFERENCES stablecoins(id) ON DELETE SET NULL,
  "operationId" UUID REFERENCES operations(id) ON DELETE SET NULL,
  payload JSONB NOT NULL,
  "webhookUrl" VARCHAR NOT NULL,
  status VARCHAR NOT NULL DEFAULT 'pending',
  attempts INT DEFAULT 0,
  "lastAttemptAt" TIMESTAMP,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "IDX_webhook_events_tokenizerId" ON webhook_events("tokenizerId");
CREATE INDEX IF NOT EXISTS "IDX_webhook_events_status" ON webhook_events(status);
CREATE INDEX IF NOT EXISTS "IDX_webhook_events_eventType" ON webhook_events("eventType");

-- Insert migration records
INSERT INTO typeorm_migrations (timestamp, name) VALUES
  (1730917200000, '1730917200000-CreateTokenizersTable'),
  (1730917210000, '1730917210000-CreateStablecoinsTable'),
  (1730917220000, '1730917220000-CreateOperationsTable'),
  (1730917230000, '1730917230000-CreateExchangeRatesTable'),
  (1730917240000, '1730917240000-CreateWebhookEventsTable')
ON CONFLICT (name) DO NOTHING;
