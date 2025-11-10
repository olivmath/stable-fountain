# ⚙️ Stable Fountain Backend

API REST para emissão e gerenciamento de stablecoins BRL, construída com NestJS + TypeORM + PostgreSQL.

## 🎯 Visão Geral

**Stable Fountain Backend** é a camada de aplicação do serviço B2B SaaS de emissão de stablecoins. Orquestra:

- **Autenticação:** JWT para tokenizadoras (clientes B2B)
- **CRUD:** Gerenciamento de stablecoins, operações, webhooks
- **Integrações:** XRPL (Issued Currencies), Asas (PIX), Binance (conversões)
- **Assincronia:** Bull queues para mint/burn processamento
- **Webhooks:** Notificações para tokenizadoras (eventos)

## 📊 Status Atual

### ✅ Completo
- [x] Estrutura NestJS (módulos, controllers, services)
- [x] TypeORM + PostgreSQL configurado
- [x] Autenticação JWT
- [x] CRUD Tokenizers, Stablecoins, Operations
- [x] Sistema de logging customizado
- [x] Environment validation
- [x] Migrations framework

### 🔄 Em Desenvolvimento
- [ ] Integração XRPL (xrpl.js client)
- [ ] Integração Asas (PIX provider)
- [ ] Integração Binance (conversões XRP)
- [ ] Bull Queues (async processing)
- [ ] Webhooks system (event publishing)

### ⏳ Planejado
- [ ] Clawback service
- [ ] Authorized Trust Lines
- [ ] XRPL subscribers (monitor deposits)
- [ ] Security hardening
- [ ] OpenAPI/Swagger docs

## 🚀 Quick Start

### Setup
```bash
cd backend
npm install
npm run start:dev
```

**Pré-requisitos:** Node 18+, PostgreSQL (ou Supabase)

Veja [setup-guide.md](./setup-guide.md) para detalhes completos.

### Rodar Testes
```bash
npm run test           # Unit tests
npm run test:e2e       # E2E tests
```

### Migrations
```bash
npm run migration:generate -- src/migrations/MigrationName
npm run migration:run
npm run migration:revert
```

## 📚 Documentação

| Documento | Descrição |
|-----------|-----------|
| **[setup-guide.md](./setup-guide.md)** | Como configurar ambiente local |
| **[logging-guide.md](./logging-guide.md)** | Sistema de logging e padrões |
| **[scripts-organization.md](./scripts-organization.md)** | Scripts úteis do projeto |

## 🏗️ Arquitetura

```
backend/
├── src/
│   ├── config/           - Env vars, validation
│   ├── modules/          - NestJS modules
│   │   ├── auth/         - JWT, strategies
│   │   ├── tokenizers/   - Cliente B2B CRUD
│   │   ├── stablecoins/  - Stablecoin CRUD
│   │   ├── operations/   - Mint/burn tracking
│   │   ├── oracle/       - Exchange rates
│   │   ├── webhooks/     - Event notifications
│   │   ├── xrpl/         - XRPL integration (NOVO)
│   │   ├── asas/         - PIX integration (NOVO)
│   │   └── binance/      - XRP conversions (NOVO)
│   ├── database/         - TypeORM, entities, migrations
│   ├── common/           - Logger, decorators, pipes
│   ├── main.ts
│   └── app.module.ts
├── package.json
├── tsconfig.json
└── docker-compose.yml    - Local Postgres
```

## 🔧 Stack Técnico

- **Runtime:** Node.js 18+
- **Framework:** NestJS (TypeScript)
- **Database:** PostgreSQL + Supabase
- **ORM:** TypeORM
- **Auth:** JWT (passport)
- **Async Jobs:** Bull (TBD)
- **Logging:** Custom Logger Service
- **API Docs:** Swagger/OpenAPI (TBD)
- **Testing:** Jest, Supertest

## 📖 Documentação Relacionada

### Projeto
- **[../../CLAUDE.md](../../CLAUDE.md)** - Instruções para Claude
- **[../README.md](../README.md)** - Índice de documentação geral
- **[../01-evolution/project-journey.md](../01-evolution/project-journey.md)** - Contexto histórico

### Arquitetura
- **[../01-evolution/phase-3-final-architecture.md](../01-evolution/phase-3-final-architecture.md)** - Specs técnicas
- **[../03-architecture/](../03-architecture/)** - Guias de arquitetura

## 🚦 Próximas Fases

### Fase 1: Fundação (2-3 semanas)
- Completar migrações de entities
- Módulo XRPL básico
- Setup Testnet

### Fase 2: Core Features (3-4 semanas)
- Integração Asas (PIX)
- Integração Binance
- Endpoint mint (PIX)
- Testes E2E

### Fase 3: Avançado (2-3 semanas)
- Subscribers XRPL
- Endpoint burn (clawback)
- Trust Lines autorizadas

### Fase 4: Produção (1-2 semanas)
- Segurança (HSM, Vault)
- Observabilidade (Prometheus)
- Load testing

Veja [project-journey.md](../01-evolution/project-journey.md) para detalhes.

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
