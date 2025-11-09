# 📊 Logging Examples - Fountain Backend

Este arquivo mostra exemplos de como os logs aparecem quando você chama as rotas da API.

---

## 📝 Exemplo 1: User Registration

### Requisição:
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "SecurePassword123!",
    "name": "John Doe"
  }'
```

### Logs Gerados:

```
╔════════════════════════════════════════════════════════════════╗
║ ▶️  STARTING REGISTER OPERATION
╚════════════════════════════════════════════════════════════════╝
📋 Input Data: {"email":"newuser@example.com","name":"John Doe"}

⚙️  [1] Checking if email already exists
   └─ {"email":"newuser@example.com"}

✅ Email availability: PASSED
   └─ {"found":"Email available"}

⚙️  [2] Hashing password with bcrypt (10 salt rounds)
ℹ️  Password hashed successfully

⚙️  [3] Creating new user entity
   └─ {"email":"newuser@example.com","name":"John Doe"}

⚙️  [4] Saving user to database
✨ USER CREATED - ID: 550e8400-e29b-41d4-a716-446655440000
   └─ Data: {"email":"newuser@example.com","name":"John Doe","role":"user"}

⚙️  [5] Preparing response (password excluded)

╔════════════════════════════════════════════════════════════════╗
║ ✅ REGISTER OPERATION SUCCESS
╚════════════════════════════════════════════════════════════════╝
📊 Result: {"id":"550e8400-e29b-41d4-a716-446655440000","email":"newuser@example.com","name":"John Doe","role":"user"}
```

---

## 🔐 Exemplo 2: User Login

### Requisição:
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "SecurePassword123!"
  }'
```

### Logs Gerados:

```
╔════════════════════════════════════════════════════════════════╗
║ ▶️  STARTING LOGIN OPERATION
╚════════════════════════════════════════════════════════════════╝
📋 Input Data: {"email":"newuser@example.com"}

⚙️  [1] Looking up user by email
   └─ {"email":"newuser@example.com"}

✅ User exists: PASSED
   └─ {"status":"Found"}

⚙️  [2] Comparing provided password with stored hash
✅ Password match: PASSED
   └─ {"status":"Correct"}

⚙️  [3] Checking user account status
   └─ {"isActive":true}

✅ Account active: PASSED
   └─ {"status":"Active"}

⚙️  [4] Generating JWT token
ℹ️  JWT token generated successfully
   └─ {"expiresIn":"7d"}

⚙️  [5] Preparing login response

╔════════════════════════════════════════════════════════════════╗
║ ✅ LOGIN OPERATION SUCCESS
╚════════════════════════════════════════════════════════════════╝
📊 Result: {"userId":"550e8400-e29b-41d4-a716-446655440000","email":"newuser@example.com","tokenExpires":"7d"}
```

---

## 🪙 Exemplo 3: Create Mint Operation (Depositar XRP e Mintar BRL)

### Requisição:
```bash
curl -X POST http://localhost:3000/api/v1/operations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGc..." \
  -d '{
    "stablecoinId": "550e8400-e29b-41d4-a716-446655440000",
    "type": "mint",
    "amountBrl": 1000.50,
    "paymentMethod": "PIX",
    "depositRequestId": "req_12345"
  }'
```

### Logs Esperados (quando implementado):

```
╔════════════════════════════════════════════════════════════════╗
║ ▶️  STARTING MINT OPERATION
╚════════════════════════════════════════════════════════════════╝
📋 Input Data: {
  "stablecoinId":"550e8400-e29b-41d4-a716-446655440000",
  "type":"mint",
  "amountBrl":1000.50,
  "paymentMethod":"PIX",
  "depositRequestId":"req_12345"
}

⚙️  [1] Validating stablecoin exists
   └─ {"stablecoinId":"550e8400-e29b-41d4-a716-446655440000"}

✅ Stablecoin found: PASSED
   └─ {"clientId":"client_123","status":"active"}

⚙️  [2] Fetching exchange rate
ℹ️  Exchange rate retrieved
   └─ {"source":"BACEN","rateUsdBrl":5.25}

⚙️  [3] Calculating XRP amount needed
🧮 XRP Calculation
   ├─ Inputs: {"amountBrl":1000.50,"exchangeRate":5.25}
   └─ Output: 190.57142857 XRP

⚙️  [4] Validating pool collateralization
✅ Collateralization ratio validation: PASSED
   └─ {"currentRatio":1.65,"minimumRequired":1.50,"status":"SAFE"}

⚙️  [5] Creating operation record
✨ OPERATION CREATED - ID: 660e8400-e29b-41d4-a716-446655440001
   └─ Data: {
     "stablecoinId":"550e8400-e29b-41d4-a716-446655440000",
     "type":"mint",
     "status":"pending",
     "amountBrl":1000.50,
     "amountRlbrl":190.57142857,
     "paymentMethod":"PIX"
   }

⚙️  [6] Updating pool collateral
🔄 POOL STATE UPDATED - ID: global_pool
   ├─ Old: {"totalXrp":1000.0,"totalBrl":150000.0,"ratio":1.65}
   └─ New: {"totalXrp":1190.57,"totalBrl":151000.50,"ratio":1.67}

⚙️  [7] Recording blockchain transaction
⛓️  BLOCKCHAIN TRANSACTION
   ├─ TxHash: 0x000000ABC123DEF789...
   └─ Data: {"type":"mint","amountBrl":1000.50,"timestamp":"2025-01-08T10:30:45Z"}

⚙️  [8] Sending webhook notification
🔔 WEBHOOK DELIVERY - DELIVERED
   ├─ URL: https://client-webhook.example.com/events
   └─ Event: operation.completed

╔════════════════════════════════════════════════════════════════╗
║ ✅ MINT OPERATION SUCCESS
╚════════════════════════════════════════════════════════════════╝
📊 Result: {
  "operationId":"660e8400-e29b-41d4-a716-446655440001",
  "status":"completed",
  "amountBrl":1000.50,
  "amountXrpUsed":190.57,
  "clientId":"client_123",
  "newCollateralizationRatio":1.67,
  "newPoolState":{"totalXrp":1190.57,"totalBrl":151000.50}
}
```

---

## 📊 Exemplo 4: Burn Operation (BRL para PIX)

### Logs Esperados:

```
╔════════════════════════════════════════════════════════════════╗
║ ▶️  STARTING BURN OPERATION
╚════════════════════════════════════════════════════════════════╝
📋 Input Data: {
  "stablecoinId":"550e8400-e29b-41d4-a716-446655440000",
  "type":"burn",
  "amountBrl":500.00,
  "returnDestination":{"cpf":"12345678901","account":"xxxxx"}
}

⚙️  [1] Validating stablecoin exists
✅ Stablecoin found: PASSED

⚙️  [2] Validating sufficient BRL balance
✅ Balance sufficient: PASSED
   └─ {"available":1000.50,"requested":500.00}

⚙️  [3] Fetching exchange rate
ℹ️  Exchange rate retrieved
   └─ {"rateUsdBrl":5.25}

⚙️  [4] Calculating XRP to return
🧮 XRP Return Calculation
   ├─ Inputs: {"amountBrl":500.00,"exchangeRate":5.25}
   └─ Output: 95.238095238 XRP

⚙️  [5] Validating pool has sufficient XRP
✅ Pool XRP available: PASSED
   └─ {"available":1190.57,"required":95.24}

⚙️  [6] Creating burn operation record
✨ OPERATION CREATED - ID: 770e8400-e29b-41d4-a716-446655440002
   └─ Data: {"type":"burn","status":"pending","amountBrl":500.00}

⚙️  [7] Burning BRL tokens from blockchain
⛓️  BLOCKCHAIN TRANSACTION
   ├─ TxHash: 0x111111DEF456GHI012...
   └─ Data: {"action":"burn","tokenAmount":500.00,"timestamp":"2025-01-08T10:35:22Z"}

⚙️  [8] Releasing XRP from pool
🔄 POOL STATE UPDATED - ID: global_pool
   ├─ Old: {"totalXrp":1190.57,"totalBrl":151000.50,"ratio":1.67}
   └─ New: {"totalXrp":1095.33,"totalBrl":150500.50,"ratio":1.68}

⚙️  [9] Preparing PIX transfer instruction
ℹ️  PIX transfer scheduled
   └─ {"cpf":"12345678901","amount":"500.00 BRL (admin responsibility)"}

⚙️  [10] Sending completion webhook
🔔 WEBHOOK DELIVERY - DELIVERED
   ├─ URL: https://client-webhook.example.com/events
   └─ Event: operation.completed

╔════════════════════════════════════════════════════════════════╗
║ ✅ BURN OPERATION SUCCESS
╚════════════════════════════════════════════════════════════════╝
📊 Result: {
  "operationId":"770e8400-e29b-41d4-a716-446655440002",
  "status":"completed",
  "amountBrlBurned":500.00,
  "amountXrpReleased":95.24,
  "pixTransferAmount":"500.00 BRL",
  "newCollateralizationRatio":1.68,
  "newPoolState":{"totalXrp":1095.33,"totalBrl":150500.50}
}
```

---

## 🚨 Exemplo 5: Login com Falha (Email não existe)

### Logs Gerados:

```
╔════════════════════════════════════════════════════════════════╗
║ ▶️  STARTING LOGIN OPERATION
╚════════════════════════════════════════════════════════════════╝
📋 Input Data: {"email":"nonexistent@example.com"}

⚙️  [1] Looking up user by email
   └─ {"email":"nonexistent@example.com"}

❌ User exists: FAILED
   └─ {"status":"Not found"}

⚠️  Login failed - User not found
   └─ {"email":"nonexistent@example.com"}

╔════════════════════════════════════════════════════════════════╗
║ ❌ LOGIN OPERATION FAILED
╚════════════════════════════════════════════════════════════════╝
🚨 Error: Invalid email or password
```

---

## ⚠️ Exemplo 6: Mint com Colaterização Insuficiente

### Logs Gerados:

```
╔════════════════════════════════════════════════════════════════╗
║ ▶️  STARTING MINT OPERATION
╚════════════════════════════════════════════════════════════════╝

[passos 1-3...]

⚙️  [4] Validating pool collateralization
❌ Collateralization ratio validation: FAILED
   └─ {"currentRatio":1.45,"minimumRequired":1.50,"status":"INSUFFICIENT"}

⚠️  Mint rejected - Pool collateralization below minimum (1.45 < 1.50)
   └─ {"pool":{"totalXrp":1000.0,"totalBrl":180000.0}}

╔════════════════════════════════════════════════════════════════╗
║ ❌ MINT OPERATION FAILED
╚════════════════════════════════════════════════════════════════╝
🚨 Error: Pool collateralization ratio below minimum (1.45 < 1.50). Cannot issue more BRL.
```

---

## 🎯 Como Usar

### Development (Verbose Logging):
```bash
npm start:dev
# Ver todos os logs incluindo DEBUG
```

### Production (Summary Only):
```bash
NODE_ENV=production npm start:prod
# Ver apenas INFO, WARN, ERROR
```

### Filtrar Logs por Tipo:
```bash
# Apenas operações bem-sucedidas
npm start:dev | grep "✅\|SUCCESS"

# Apenas erros
npm start:dev | grep "❌\|ERROR"

# Apenas operações específicas
npm start:dev | grep "MINT\|BURN"
```

---

## 📚 Métodos Disponíveis no CustomLogger

```typescript
// Iniciar/finalizar operações
logger.logOperationStart(operationType: string, data: any)
logger.logOperationSuccess(operationType: string, result: any)
logger.logOperationError(operationType: string, error: any)

// Passos da operação
logger.logStep(stepNumber: number, stepName: string, details?: any)

// Validações
logger.logValidation(validationName: string, result: boolean, details?: any)

// Criação/Atualização de dados
logger.logDataCreated(entityType: string, id: string, data: any)
logger.logStateUpdate(entity: string, id: string, oldState: any, newState: any)

// Cálculos e transações
logger.logCalculation(calculationName: string, inputs: any, output: any)
logger.logBlockchainTransaction(txHash: string, data: any)
logger.logWebhookDelivery(webhookUrl: string, eventType: string, success: boolean, attempt: number)

// Gerais
logger.logInfo(message: string, data?: any)
logger.logWarning(message: string, data?: any)
logger.logError(message: string, error?: any)
logger.logDatabaseQuery(query: string, parameters?: any)
```

---

## 🔗 Próximas Operações a Logar

- [ ] Register user - ✅ DONE
- [ ] Login user - ✅ DONE
- [ ] Get profile - ⏳ TODO
- [ ] Create stablecoin - ⏳ TODO
- [ ] Mint operation - ⏳ TODO
- [ ] Burn operation - ⏳ TODO
- [ ] Update pool state - ⏳ TODO
- [ ] Webhook delivery - ⏳ TODO
- [ ] Oracle rate fetch - ⏳ TODO
- [ ] Blockchain transaction - ⏳ TODO

