# 🧪 Fountain API - Test Scenarios (BDD)

Este documento descreve os cenários de teste para todos os módulos da Fountain API usando a sintaxe **BDD (Behavior-Driven Development)** com formato **Gherkin** (Given-When-Then).

---

## 🔐 AUTH MODULE

### ✅ Cenário 1: Register - Novo Usuário
```gherkin
Scenario: Register a new user successfully
  Given I am a new user without account
  When I POST to /api/v1/auth/register with:
    | Field    | Value                      |
    | email    | newuser@example.com        |
    | password | SecurePassword123!         |
    | name     | John Doe                   |
  Then I should receive HTTP 201 Created
  And response contains user object with fields:
    | id   | UUID   |
    | email| string |
    | name | string |
    | role | string |
  And password is NOT returned in response
  And user is created in database with hashed password
```

### ✅ Cenário 2: Register - Email já existe
```gherkin
Scenario: Register with duplicate email fails
  Given an existing user with email "existing@example.com"
  When I POST to /api/v1/auth/register with:
    | email    | existing@example.com |
    | password | Password123!         |
    | name     | Another User         |
  Then I should receive HTTP 409 Conflict
  And response error message is: "Email already registered"
```

### ✅ Cenário 3: Register - Email inválido
```gherkin
Scenario: Register with invalid email format fails
  Given I want to create a new account
  When I POST to /api/v1/auth/register with:
    | email    | invalid-email    |
    | password | Password123!     |
    | name     | Test User        |
  Then I should receive HTTP 400 Bad Request
  And response error contains: "email must be an email"
```

### ✅ Cenário 4: Register - Senha curta
```gherkin
Scenario: Register with password less than 6 characters fails
  Given I want to create a new account
  When I POST to /api/v1/auth/register with:
    | email    | user@example.com |
    | password | 12345            |
    | name     | Test User        |
  Then I should receive HTTP 400 Bad Request
  And response error contains: "password must be at least 6 characters"
```

### ✅ Cenário 5: Login - Credenciais válidas
```gherkin
Scenario: Login with correct credentials returns JWT token
  Given I have a registered account:
    | email    | testuser@example.com          |
    | password | SecurePassword123! (hashed)   |
  When I POST to /api/v1/auth/login with:
    | email    | testuser@example.com |
    | password | SecurePassword123!   |
  Then I should receive HTTP 200 OK
  And response contains:
    | access_token | JWT string |
    | user         | object     |
  And access_token is a valid JWT
  And user object includes:
    | id   | UUID   |
    | email| string |
    | role | string |
```

### ✅ Cenário 6: Login - Email não existe
```gherkin
Scenario: Login with non-existent email fails
  Given I have no account
  When I POST to /api/v1/auth/login with:
    | email    | nonexistent@example.com |
    | password | AnyPassword123!         |
  Then I should receive HTTP 401 Unauthorized
  And response error message is: "Invalid email or password"
```

### ✅ Cenário 7: Login - Senha incorreta
```gherkin
Scenario: Login with incorrect password fails
  Given I have a registered account with password "CorrectPassword123!"
  When I POST to /api/v1/auth/login with:
    | email    | testuser@example.com |
    | password | WrongPassword123!    |
  Then I should receive HTTP 401 Unauthorized
  And response error message is: "Invalid email or password"
```

### ✅ Cenário 8: Get Profile - Autenticado
```gherkin
Scenario: Get current user profile with valid JWT token
  Given I have a valid JWT token from login
  When I GET /api/v1/auth/profile with Authorization header:
    | Authorization | Bearer {access_token} |
  Then I should receive HTTP 200 OK
  And response contains complete user profile:
    | id       | UUID      |
    | email    | string    |
    | name     | string    |
    | role     | string    |
    | createdAt| timestamp |
    | updatedAt| timestamp |
```

### ✅ Cenário 9: Get Profile - Sem token
```gherkin
Scenario: Access protected endpoint without token returns 401
  Given I do not have an access token
  When I GET /api/v1/auth/profile without Authorization header
  Then I should receive HTTP 401 Unauthorized
  And response error message is: "Unauthorized"
```

### ✅ Cenário 10: Get Profile - Token inválido
```gherkin
Scenario: Access protected endpoint with invalid token returns 401
  Given I have an invalid or expired JWT token
  When I GET /api/v1/auth/profile with Authorization header:
    | Authorization | Bearer invalid_token_xyz |
  Then I should receive HTTP 401 Unauthorized
  And response error message is: "Unauthorized"
```

---

## 🪙 STABLECOINS MODULE

### ✅ Cenário 1: Create Stablecoin
```gherkin
Scenario: Create a new stablecoin account
  Given I am authenticated user
  And I have a valid tokenizer ID
  When I POST to /api/v1/stablecoins with:
    | Field         | Value                    |
    | tokenizerId   | {valid-uuid}             |
    | clientId      | client_acme_001          |
    | name          | Acme Corp BRL Account    |
    | clientWallet  | rN7n7otQDd6FczFgLdcq... |
    | webhookUrl    | https://acme.com/webhook |
  Then I should receive HTTP 201 Created
  And response stablecoin contains:
    | id               | UUID              |
    | tokenizerId      | {same-uuid}       |
    | clientId         | client_acme_001   |
    | status           | pending_deposit   |
    | totalIssuedRlbrl | 0                 |
```

### ✅ Cenário 2: List Stablecoins
```gherkin
Scenario: Get all stablecoins
  Given I am authenticated user
  And there are 5 stablecoins in database
  When I GET /api/v1/stablecoins
  Then I should receive HTTP 200 OK
  And response is array with 5 stablecoin objects
  And each stablecoin has: id, tokenizerId, clientId, status, totalIssuedRlbrl
```

### ✅ Cenário 3: Get Stablecoin by ID
```gherkin
Scenario: Get specific stablecoin by ID
  Given I am authenticated user
  And a stablecoin exists with ID "{stablecoin-id}"
  When I GET /api/v1/stablecoins/{stablecoin-id}
  Then I should receive HTTP 200 OK
  And response contains stablecoin with full details
```

### ✅ Cenário 4: Get Stablecoin - Não existe
```gherkin
Scenario: Get non-existent stablecoin returns 404
  Given I am authenticated user
  When I GET /api/v1/stablecoins/00000000-0000-0000-0000-000000000000
  Then I should receive HTTP 404 Not Found
  And response error message is: "Stablecoin not found"
```

### ✅ Cenário 5: Update Stablecoin Status
```gherkin
Scenario: Update stablecoin status to active
  Given I am authenticated user
  And a stablecoin exists with status "pending_deposit"
  When I PATCH /api/v1/stablecoins/{id} with:
    | status | active |
  Then I should receive HTTP 200 OK
  And response stablecoin status is "active"
  And activatedAt timestamp is set to current time
```

---

## 📊 OPERATIONS MODULE

### ✅ Cenário 1: Create Mint Operation
```gherkin
Scenario: Create mint operation (PIX -> BRL)
  Given I am authenticated user
  And a stablecoin exists with sufficient collateral
  When I POST to /api/v1/operations with:
    | Field            | Value              |
    | stablecoinId     | {stablecoin-id}    |
    | type             | mint               |
    | amountBrl        | 1000.50            |
    | paymentMethod    | PIX                |
    | depositRequestId | req_12345          |
  Then I should receive HTTP 201 Created
  And response operation contains:
    | type      | mint    |
    | status    | pending |
    | amountBrl | 1000.50 |
```

### ✅ Cenário 2: Create Burn Operation
```gherkin
Scenario: Create burn operation (BRL -> PIX)
  Given I am authenticated user
  And a stablecoin exists with 5000 BRL balance
  When I POST to /api/v1/operations with:
    | Field                 | Value           |
    | stablecoinId          | {stablecoin-id} |
    | type                  | burn            |
    | amountBrl             | 1000.50         |
    | returnDestination     | {cpf, account}  |
  Then I should receive HTTP 201 Created
  And response operation type is "burn"
  And response operation status is "pending"
```

### ✅ Cenário 3: List Operations
```gherkin
Scenario: Get all operations
  Given I am authenticated user
  And there are 10 operations in database
  When I GET /api/v1/operations
  Then I should receive HTTP 200 OK
  And response is array with operations
  And each has: id, type, status, amountBrl, createdAt
```

### ✅ Cenário 4: Get Operation by ID
```gherkin
Scenario: Get specific operation details
  Given I am authenticated user
  And an operation exists with ID "{operation-id}"
  When I GET /api/v1/operations/{operation-id}
  Then I should receive HTTP 200 OK
  And response contains complete operation details
```

### ✅ Cenário 5: Update Operation Status
```gherkin
Scenario: Update operation status to completed
  Given I am authenticated user
  And an operation exists with status "pending"
  When I PATCH /api/v1/operations/{id} with:
    | status               | completed          |
    | blockchainTxHash     | 000000ABC123DEF... |
  Then I should receive HTTP 200 OK
  And response operation status is "completed"
  And completedAt timestamp is set
```

---

## 🔑 TOKENIZERS MODULE

### ✅ Cenário 1: Create Tokenizer
```gherkin
Scenario: Create a new tokenizer account
  Given I am authenticated user
  When I POST to /api/v1/tokenizers with:
    | Field            | Value               |
    | name             | ABToken Inc         |
    | email            | contact@abtoken.io  |
    | subscriptionTier | pro                 |
  Then I should receive HTTP 201 Created
  And response tokenizer contains:
    | id               | UUID          |
    | name             | ABToken Inc   |
    | email            | contact@...   |
    | subscriptionTier | pro           |
    | status           | active        |
```

### ✅ Cenário 2: Create Tokenizer - Email duplicado
```gherkin
Scenario: Create tokenizer with duplicate email fails
  Given I am authenticated user
  And a tokenizer exists with email "existing@abtoken.io"
  When I POST to /api/v1/tokenizers with:
    | email | existing@abtoken.io |
    | name  | Another Name        |
  Then I should receive HTTP 409 Conflict
  And response error is: "Email already registered"
```

### ✅ Cenário 3: List Tokenizers
```gherkin
Scenario: Get all tokenizers
  Given I am authenticated user
  When I GET /api/v1/tokenizers
  Then I should receive HTTP 200 OK
  And response is array of tokenizers
  And each has: id, name, email, subscriptionTier, status
```

### ✅ Cenário 4: Get Tokenizer by ID
```gherkin
Scenario: Get specific tokenizer
  Given I am authenticated user
  And a tokenizer exists with ID "{tokenizer-id}"
  When I GET /api/v1/tokenizers/{tokenizer-id}
  Then I should receive HTTP 200 OK
  And response contains complete tokenizer object
```

### ✅ Cenário 5: Update Tokenizer
```gherkin
Scenario: Update tokenizer subscription tier
  Given I am authenticated user
  And a tokenizer exists with tier "starter"
  When I PATCH /api/v1/tokenizers/{id} with:
    | subscriptionTier | enterprise |
  Then I should receive HTTP 200 OK
  And response tokenizer tier is "enterprise"
```

---

## 💱 ORACLE MODULE

### ✅ Cenário 1: Get Exchange Rates (Public)
```gherkin
Scenario: Fetch current exchange rates without authentication
  Given I do NOT need authentication
  When I GET /api/v1/oracle
  Then I should receive HTTP 200 OK
  And response is array of exchange rates with:
    | id        | number    |
    | source    | string    |
    | rateUsdBrl| number    |
    | fetchedAt | timestamp |
```

### ✅ Cenário 2: Get Specific Rate (Public)
```gherkin
Scenario: Get exchange rate by ID
  Given I do NOT need authentication
  And an exchange rate exists with ID 1
  When I GET /api/v1/oracle/1
  Then I should receive HTTP 200 OK
  And response contains rate: source, rateUsdBrl, fetchedAt
```

### ✅ Cenário 3: Create Exchange Rate
```gherkin
Scenario: Record new exchange rate
  Given I am authenticated user
  When I POST to /api/v1/oracle with:
    | source      | BACEN |
    | rateUsdBrl  | 5.30  |
  Then I should receive HTTP 201 Created
  And response contains new rate with id, source, rateUsdBrl
```

### ✅ Cenário 4: Update Exchange Rate
```gherkin
Scenario: Update existing exchange rate
  Given I am authenticated user
  And an exchange rate exists with rateUsdBrl 5.25
  When I PATCH /api/v1/oracle/1 with:
    | rateUsdBrl | 5.35 |
  Then I should receive HTTP 200 OK
  And response rate has rateUsdBrl: 5.35
```

---

## 👨‍💼 ADMIN MODULE

### ✅ Cenário 1: Admin Operations
```gherkin
Scenario: Admin access to protected endpoints
  Given I am authenticated as admin user
  When I GET /api/v1/admin/pool or any /admin/* endpoint
  Then I should receive HTTP 200 OK
  And response contains requested admin data

Scenario: Non-admin user cannot access /admin
  Given I am authenticated as regular user (not admin)
  When I GET /api/v1/admin/pool
  Then I should receive HTTP 403 Forbidden
  And response error is: "Access denied"
```

---

## 🔗 BLOCKCHAIN MODULE

### ✅ Cenário 1: Configure Blockchain
```gherkin
Scenario: Setup blockchain connection
  Given I am authenticated user
  When I POST to /api/v1/blockchain with:
    | network       | xahau               |
    | websocketUrl  | wss://xahau...      |
    | hookAccount   | rN7n7otQDd6F..      |
    | hookSecret    | sEd7rBGm5k...       |
  Then I should receive HTTP 201 Created
  And response blockchain config contains:
    | id       | UUID  |
    | network  | xahau |
    | status   | active|
```

### ✅ Cenário 2: Get Blockchain Status
```gherkin
Scenario: Check blockchain network status
  Given I am authenticated user
  When I GET /api/v1/blockchain/status
  Then I should receive HTTP 200 OK
  And response contains:
    | network       | xahau       |
    | synchronized  | boolean     |
```

---

## 🔔 WEBHOOKS MODULE

### ✅ Cenário 1: Subscribe to Events
```gherkin
Scenario: Create webhook subscription
  Given I am authenticated user
  When I POST to /api/v1/webhooks with:
    | url       | https://acme.com/webhook      |
    | eventType | operation.completed           |
    | secret    | webhook_secret_key_12345      |
  Then I should receive HTTP 201 Created
  And response webhook contains:
    | id        | UUID                   |
    | url       | https://acme.com/...   |
    | eventType | operation.completed    |
    | status    | active                 |
```

### ✅ Cenário 2: List Webhooks
```gherkin
Scenario: Get all webhook subscriptions
  Given I am authenticated user
  When I GET /api/v1/webhooks
  Then I should receive HTTP 200 OK
  And response is array of webhooks
  And each has: id, url, eventType, status, createdAt
```

### ✅ Cenário 3: Get Webhook by ID
```gherkin
Scenario: Retrieve specific webhook
  Given I am authenticated user
  And a webhook exists with ID "{webhook-id}"
  When I GET /api/v1/webhooks/{webhook-id}
  Then I should receive HTTP 200 OK
  And response contains webhook with delivery history
```

### ✅ Cenário 4: Update Webhook
```gherkin
Scenario: Update webhook subscription
  Given I am authenticated user
  And a webhook exists with URL "https://old.com/webhook"
  When I PATCH /api/v1/webhooks/{id} with:
    | url | https://new.com/webhook |
  Then I should receive HTTP 200 OK
  And response webhook has updated URL
```

### ✅ Cenário 5: Delete Webhook
```gherkin
Scenario: Unsubscribe from webhook events
  Given I am authenticated user
  And a webhook exists with ID "{webhook-id}"
  When I DELETE /api/v1/webhooks/{webhook-id}
  Then I should receive HTTP 200 OK
  And webhook is no longer in database
```

---

## ⚙️ HEALTH / SYSTEM

### ✅ Cenário 1: Health Check (Public)
```gherkin
Scenario: Check API health status
  Given I do NOT need authentication
  When I GET /api/v1/health
  Then I should receive HTTP 200 OK
  And response contains:
    | status    | ok       |
    | timestamp | ISO-8601 |
    | version   | 0.1.0    |
```

---

## 🔄 INTEGRAÇÃO / FLUXOS COMPLETOS

### 🔄 Fluxo 1: PIX -> BRL (Mint Complete)
```gherkin
Scenario: Complete mint operation flow (PIX to BRL)
  Given admin has pool with sufficient XRP
  And exchange rate is 5.25 BRL/XRP
  When:
    1. Customer makes PIX payment to admin (off-chain)
    2. Admin POSTs /operations with type=mint, amountBrl=1000
    3. System validates collateralization ratio >= 150%
    4. System creates operation record with status=pending
    5. System transfers XRP from pool (if blockchain enabled)
    6. System sends BRL tokens to customer wallet
    7. System records blockchainTxHash
    8. System sends webhook to subscriber (if configured)
  Then:
    - Operation status = "completed"
    - Customer receives 1000 BRL tokens
    - Pool collateralization ratio updated correctly
    - Audit log records transaction
```

### 🔄 Fluxo 2: BRL -> PIX (Burn Complete)
```gherkin
Scenario: Complete burn operation flow (BRL to PIX)
  Given customer has 1000 BRL tokens
  And customer submits redemption request
  When:
    1. Customer sends/burns BRL tokens (if on blockchain)
    2. Admin POSTs /operations with type=burn, amountBrl=1000
    3. System validates sufficient XRP in pool
    4. System burns BRL tokens (if blockchain enabled)
    5. System releases XRP from collateral
    6. System sends operation to completed status
    7. Admin processes PIX transfer to customer (off-chain)
    8. System sends webhook to subscriber
  Then:
    - Operation status = "completed"
    - BRL tokens removed from circulation
    - XRP released from pool
    - Customer receives PIX payment
    - Pool collateralization ratio updated
```

---

## 📝 COMO EXECUTAR

### Via Swagger UI (Visual):
```bash
1. npm run build
2. npm run migration:run
3. npm start:dev
4. Acesse http://localhost:3000/docs
5. Execute cada cenário manualmente
```

### Via cURL (Command Line):
```bash
# Exemplo: Register
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"Pass123!","name":"John"}'

# Exemplo: Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"Pass123!"}'

# Exemplo: Protected endpoint
curl -X GET http://localhost:3000/api/v1/auth/profile \
  -H "Authorization: Bearer {access_token}"
```

### Automático (Quando implementar testes):
```bash
npm run test:e2e          # Todos os testes E2E
npm run test:e2e -- auth  # Apenas Auth
npm test:watch            # Watch mode
```

---

## 📊 STATUS DA IMPLEMENTAÇÃO

| Módulo      | BDD Docs | Implementado | Testado |
|:------------|:--------:|:------------:|:-------:|
| Auth        | ✅ 100%  | ✅ 100%      | ⏳ 0%   |
| Stablecoins | ✅ 100%  | ⏳ 30%       | ⏳ 0%   |
| Operations  | ✅ 100%  | ⏳ 30%       | ⏳ 0%   |
| Tokenizers  | ✅ 100%  | ⏳ 30%       | ⏳ 0%   |
| Oracle      | ✅ 100%  | ⏳ 30%       | ⏳ 0%   |
| Admin       | ✅ 100%  | ⏳ 10%       | ⏳ 0%   |
| Blockchain  | ✅ 100%  | ⏳ 10%       | ⏳ 0%   |
| Webhooks    | ✅ 100%  | ⏳ 20%       | ⏳ 0%   |
| Health      | ✅ 100%  | ✅ 100%      | ✅ 100% |
| **TOTAL**   | ✅ 100%  | ⏳ 32%       | ⏳ 10%  |

---

## 🚀 PRÓXIMOS PASSOS

1. ✅ Gerar OpenAPI: `npm run generate:openapi`
2. ✅ Gerar SDK: `npm run generate:sdk`
3. ⏳ Implementar Service logic real (substitua placeholders)
4. ⏳ Escrever testes E2E automatizados
5. ⏳ Integração com Xahau/XRPL
6. ⏳ Integração com Webhooks reais
7. ⏳ Integração com Oracles (BACEN/Frankfurter)

