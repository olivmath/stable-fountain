# 📊 Logging Examples - Fountain Backend

Este arquivo mostra exemplos de como os logs aparecem quando você chama as rotas da API.

---

## 🔐 Exemplo 1: User Authentication

### Requisição:

```bash
curl -X POST http://localhost:3000/api/v1/auth \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
  }'
```

### Logs Gerados:

```
╔════════════════════════════════════════════════════════════════╗
║ ▶️  STARTING LOGIN OPERATION
╚════════════════════════════════════════════════════════════════╝
📋 Input Data: {"email":"newuser@example.com"}

⚙️ [1] Looking up user by email
   └─ {"email":"newuser@example.com"}

✅ User found: PASSED
   └─ {"companyId": "550e8400-e29b-41d4-a716-446655440000", "status":"Active"}

⚙️ [2] Generating JWT token
ℹ️ JWT token generated successfully
   └─ {"expiresIn":"7d"}

╔════════════════════════════════════════════════════════════════╗
║ ✅ LOGIN OPERATION SUCCESS
╚════════════════════════════════════════════════════════════════╝

📊 Result: {
   "jwt": "eyJhbGc...",
   "expires": "7d"
}
```

---

## 🪙 Exemplo 2: Create new Stablecoin (Depósito On-Chain RLUSD → Create Token: CUSTOM_BRL)

### Requisição:

```bash
curl -X POST http://localhost:3000/api/v1/stablecoin \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGc..." \
  -d '{
      "companyId": "550e8400-e29b-41d4-a716-446655440000",
      "clientId": "88995721-e29b-41d4-a716-446655440001",
      "companyWallet": "rN7n7otQDd6FczFgLdcqpHnZc5LiMvMPAr",
      "webhookUrl": "https://webhook.parkamerica.com/client123",
      "clientName": "Park America Building",
      "depositType": "RLUSD",
      "stableCode": "PABRL",
      "amount": 13000,
   }'
```

### Logs Esperados:

```
╔════════════════════════════════════════════════════════════════╗
║ ▶️  STARTING MINT OPERATION
╚════════════════════════════════════════════════════════════════╝
📋 Input Data: {
   "companyId": "550e8400-e29b-41d4-a716-446655440000",
   "companyWallet": "rN7n7otQDd6FczFgLdcqpHnZc5LiMvMPAr",
   "clientId": "88995721-e29b-41d4-a716-446655440001",
   "webhookUrl": "https://webhook.acme.com/fountain",
   "clientName": "Park America Building",
   "depositType": "RLUSD",
   "stableCode": "PABRL",
   "amount": 13000,
}

⚙️ [1] Generating temporary deposit wallet (on-chain)
   └─ {
      "companyId":"550e8400-e29b-41d4-a716-446655440000",
      "walletType":"temporary",
      "address":"rcLASSiCq8LWcymCHaCgK19QMEvUspuRM",
      "seed":"***masked***"
   }

⚙️ [2] Calculating on-chain require amount
   ├─ Fetch Dolar price: { "rate": 5.25 }
   └─ Calc: 13000 / 5.25 == 2476.190476

⚙️ [3] Creating operation record
✨ OPERATION CREATED - ID: 660e8400-e29b-41d4-a716-446655440001
   └─ Data: {
     "stablecoinId":"660e8400-e29b-41d4-a716-446655440001",
     "status":"REQUIRE_DEPOSIT",
     "currencyCode":"PABRL",
     "amountRLUSD": 2476.190476,
     "amountDeposited": 0,
     "amountRLBRL":13000,
     "paymentMethod":"RLUSD"
   }

⚙️ [4] Starting subscribe for this operation
   LISTEN DEPOSIT ON rcLASSiCq8LWcymCHaCgK19QMEvUspuRM

╔════════════════════════════════════════════════════════════════╗
║ ✅ OPERATION CREATED
╚════════════════════════════════════════════════════════════════╝
📊 Result: {
   "operationId":"660e8400-e29b-41d4-a716-446655440001",
   "status":"REQUIRE_DEPOSIT",
   "amountRLUSD": 2476.190476,
   "wallet": "rcLASSiCq8LWcymCHaCgK19QMEvUspuRM",
}
```

### Listener ouve o pagamento do cliente 

```bash
⚙️ [1] Catch new deposit on rcLASSiCq8LWcymCHaCgK19QMEvUspuRM
   ├─ Expected: 2476.190476
   └─ Deposited: 2476.190476

⚙️ [2] Deposit operation record
✨ OPERATION UPDATE - ID: 660e8400-e29b-41d4-a716-446655440001
   └─ Data: {
     "stablecoinId": "660e8400-e29b-41d4-a716-446655440001",
     "status": "DEPOSIT_CONFIRMED",
     "amountRLUSD": 2476.190476,
     "amountDeposited": 2476.190476,
     "txhash": "0x123AECF..."
   }

⚙️ [3] Mint APBRL on-chain
⛓️ BLOCKCHAIN TRANSACTION
   ├─ TxHash: 0x0ABC123123...
   └─ Data: {
      "type": "issued_currency_payment",
      "currency": "APBRL",
      "amount": 13000,
   }

⚙️ [4] Deposit APBRL to company wallet
   ├─ TxHash: 0x4458f8c9a...
   └─ Data: { to: "rN7n7otQDd6FczFgLdcqpHnZc5LiMvMPAr" }

⚙️ [5] Sending webhook notification
🔔 WEBHOOK DELIVERY - DELIVERED
   ├─ URL: https://webhook.parkamerica.com/client123
   └─ Event: mint.stablecoin.completed
```

---





## 🪙 Exemplo 2: Mint more Stablecoin (Depósito On-Chain RLUSD → Mint +CUSTOM_BRL)

## 🔥 Exemplo 3: Withdraw Stablecoin (Depósito On-Chain CUSTOM_BRL → Burn CUSTOM_BRL → Depósito On-Chain RLUSD to company)

### Requisição:

```bash
curl -X POST http://localhost:3000/api/v1/stablecoin/burn \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGc..." \
  -d '{
      "stablecoinId": "550e8400-e29b-41d4-a716-446655440000",
      "currencyCode": "APBRL",
      "amountBrl": 500.00,
      "returnAsset": "RLUSD", 
      "clientWallet": "rClientOnChainWallet...",
      "webhookUrl": "https://webhook.acme.com/fountain"
   }'
```

### Logs Esperados:

```
╔════════════════════════════════════════════════════════════════╗
║ ▶️  STARTING BURN OPERATION (RLUSD)
╚════════════════════════════════════════════════════════════════╝
📋 Input Data: {"stablecoinId":"550e8400-e29b-41d4-a716-446655440000","amountBrl":500.00,"returnAsset":"RLUSD"}

⚙️  [1] Validating stablecoin exists
✅ Stablecoin found: PASSED

⚙️  [2] Validating sufficient BRL balance
✅ Balance sufficient: PASSED
   └─ {"available":1000.50,"requested":500.00}

⚙️  [3] Fetching exchange rate
ℹ️  Exchange rate retrieved
   └─ {"source":"BACEN","rateUsdBrl":5.25}

⚙️  [4] Calculating on-chain return amount (RLUSD/XRP)
🧮 Return Calculation
   ├─ Inputs: {"amountBrl":500.00,"rateUsdBrl":5.25,"returnAsset":"RLUSD"}
   └─ Output: {"rlusdToReturn":95.238095,"notes":"uses USD/BRL oracle; XRP path skipped"}

⚙️  [5] Executing clawback (partial) on XRPL
⛓️  BLOCKCHAIN TRANSACTION
   ├─ TxHash: 0xCLAWABC123...
   └─ Data: {"action":"clawback","currency":"APBRL","tokenAmount":500.00}

⚙️  [6] Preparing on-chain transfer
✅ Transfer prepared
   └─ {"asset":"RLUSD","destination":"rClientOnChainWallet..."}

⚙️  [7] Sending on-chain transfer
⛓️  BLOCKCHAIN TRANSACTION
   ├─ TxHash: 0xSENDRLUSD456...
   └─ Data: {"asset":"RLUSD","amount":95.238095,"destination":"rClientOnChainWallet..."}

⚙️  [8] Updating issuer collateral
🔄 COLLATERAL STATE UPDATED - ISSUER
   ├─ Old: {"totalXrp":1190.57,"totalBrl":151000.50}
   └─ New: {"totalXrp":1095.33,"totalBrl":150500.50}

⚙️  [9] Sending completion webhook
🔔 WEBHOOK DELIVERY - DELIVERED
   ├─ URL: https://client-webhook.example.com/events
   └─ Event: operation.completed

╔════════════════════════════════════════════════════════════════╗
║ ✅ BURN OPERATION SUCCESS (RLUSD)
╚════════════════════════════════════════════════════════════════╝
📊 Result: {"operationId":"770e8400-e29b-41d4-a716-446655440002","status":"completed","amountBrlBurned":500.00,"amountRlusdReturned":95.238095}
```

---

## 🪙 Exemplo 4: Create new Stablecoin (Depósito Off-Chain PIX → Create Token: CUSTOM_BRL)

## 🪙 Exemplo 5: Mint more Stablecoin (Depósito Off-Chain PIX → Mint +CUSTOM_BRL)

## 🔥 Exemplo 6: Withdraw Stablecoin (Depósito On-Chain CUSTOM_BRL → Burn CUSTOM_BRL → Depósito Off-Chain PIX to company)


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
