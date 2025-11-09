# Fountain Backend

Stablecoin-as-a-Service Platform API built with NestJS.

## Status

### ✅ Completed
- [x] NestJS project structure
- [x] TypeORM + PostgreSQL configuration
- [x] Base modules generated (auth, tokenizers, stablecoins, operations, oracle, blockchain, webhooks, admin)
- [x] Swagger/OpenAPI integration
- [x] Environment variables setup
- [x] Project compiles successfully

### 🚀 Next Steps

1. **Implement Entities** (`src/modules/*/entities/*.entity.ts`)
   - TokenizerEntity
   - StablecoinEntity
   - OperationEntity
   - DepositRequestEntity
   - ExchangeRateEntity
   - WebhookEventEntity

2. **Implement DTOs** (`src/modules/*/dto/*.dto.ts`)
   - Create/Update DTOs for each entity
   - Add Swagger decorators (@ApiProperty)

3. **Implement Services** (`src/modules/*/services/*.service.ts`)
   - TokenizersService (CRUD)
   - StablecoinsService (CRUD + deposit/withdraw logic)
   - OperationsService (transaction logic)
   - OracleService (BACEN + Frankfurter rates)
   - BlockchainService (Mock + Real implementations)
   - WebhooksService (event publishing)

4. **Implement Controllers** (`src/modules/*/controllers/*.controller.ts`)
   - Add Swagger decorators (@ApiOperation, @ApiResponse)
   - Add request/response types
   - Wire up services

5. **Implement Mock Services**
   - MockPixService (PIX payment simulation)
   - MockRLUSDService (RLUSD blockchain simulation)
   - MockRLBRLService (RLBRL token simulation)

6. **Add Cronjobs**
   - Daily USD/BRL rate fetching
   - Webhook retry mechanism
   - Payment status checking (mock)

7. **Testing & SDK**
   - Generate OpenAPI spec
   - Auto-generate TypeScript SDK
   - Create example integrations

## Database Schema

```
tokenizers
├── id (UUID)
├── name (VARCHAR)
├── email (VARCHAR)
├── apiKeyHash (VARCHAR)
├── subscriptionTier (VARCHAR)
├── status (VARCHAR)
└── metadata (JSONB)

stablecoins
├── id (UUID)
├── tokenizerId (UUID)
├── clientId (VARCHAR)
├── name (VARCHAR)
├── clientWallet (VARCHAR)
├── paymentMethod (VARCHAR: PIX|RLUSD)
├── currency (VARCHAR: RLBRL)
├── status (VARCHAR: pending_deposit|active|suspended)
├── totalIssuedRlbrl (NUMERIC)
├── totalDepositedBrl (NUMERIC)
└── webhookUrl (VARCHAR)

operations
├── id (UUID)
├── stablecoinId (UUID)
├── type (VARCHAR: deposit|withdraw)
├── status (VARCHAR: pending|burning|completed)
├── amountRlbrl (NUMERIC)
├── amountRlusd (NUMERIC)
├── exchangeRate (NUMERIC)
├── blockchainTxHash (VARCHAR)
└── ...

deposit_requests
├── id (UUID)
├── stablecoinId (UUID)
├── paymentMethod (VARCHAR)
├── qrcodePix (TEXT)
├── fountainWallet (VARCHAR)
├── memo (VARCHAR)
└── status (VARCHAR)

exchange_rates
├── id (UUID)
├── source (VARCHAR: BACEN|Frankfurter)
├── rateUsdBrl (NUMERIC)
└── fetchedAt (TIMESTAMP)

webhook_events
├── id (UUID)
├── tokenizerId (UUID)
├── eventType (VARCHAR)
├── payload (JSONB)
├── status (VARCHAR)
└── retries (INT)
```

## API Architecture

```
POST   /api/v1/auth/register         # Register tokenizadora
POST   /api/v1/auth/login            # Get JWT token

GET    /api/v1/tokenizers/me         # Current tokenizer info
PATCH  /api/v1/tokenizers/me         # Update profile

GET    /api/v1/stablecoins           # List stablecoins
POST   /api/v1/stablecoins           # Create stablecoin
GET    /api/v1/stablecoins/:id       # Get stablecoin
PATCH  /api/v1/stablecoins/:id       # Update stablecoin

POST   /api/v1/operations/deposit    # Create deposit request
POST   /api/v1/operations/withdraw   # Create withdraw request
GET    /api/v1/operations            # List operations
GET    /api/v1/operations/:id        # Get operation details

GET    /api/v1/oracle/rate           # Current USD/BRL rate
GET    /api/v1/oracle/history        # Historical rates

POST   /api/v1/admin/deposits/:id/confirm-payment     # PoC: Confirm deposit
POST   /api/v1/admin/withdrawals/:id/confirm-rlbrl    # PoC: Confirm RLBRL received
```

## Running Locally

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Setup PostgreSQL (or Docker)
# Make sure DB_HOST, DB_NAME, etc. match your setup

# Run migrations
npm run migration:run

# Start development server
npm run start:dev

# Build for production
npm run build
npm run start:prod
```

## Testing with Swagger

Navigate to http://localhost:3000/docs after starting the server.

## Architecture Decisions

1. **Modules as Bounded Contexts**: Each feature is isolated in its own module
2. **Services for Business Logic**: Controllers delegate to services
3. **Entities with Relations**: TypeORM handles DB integrity
4. **DTOs for Type Safety**: Class-validator decorators for validation
5. **Swagger Decorators**: Auto-documentation
6. **Mock Services**: Easy switching between mock and real implementations

## Next Phase: Smart Contract

Once API is stable, implement `src/peggy.c` for multi-tenant stablecoin minting on Xahau testnet.

See `/src/peggy.c` for current implementation.

## References

- [NestJS Documentation](https://docs.nestjs.com)
- [TypeORM Documentation](https://typeorm.io)
- [XRPL Hooks](https://xrpl-hooks.readme.io)
- [Xahau Network](https://xahau.network)
- [Fountain Architecture](../CLAUDE.md)
