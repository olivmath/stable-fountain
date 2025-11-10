# 📊 Logging Examples - Fountain Backend

Este arquivo mostra exemplos de como os logs aparecem quando você chama as rotas da API.

> ❗ **IMPORTANTE**: Usuários são inseridos **manualmente** no banco de dados. Não existe auto-registro. A autenticação apenas valida se o email existe.

---

## 🔐 Exemplo 1: User Authentication (Email-Only)

### Requisição:

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "sonica@fountain.io"}'
```

### Logs Gerados (Sucesso):

```
╔════════════════════════════════════════════════════════════════╗
║ ▶️  STARTING LOGIN OPERATION
╚════════════════════════════════════════════════════════════════╝
📋 Input Data: {"email":"sonica@fountain.io"}

⚙️ [1] Looking up user by email
   └─ {"email":"sonica@fountain.io"}

✅ User found: PASSED
   └─ {"id": "550e8400-e29b-41d4-a716-446655440000", "email":"sonica@fountain.io", "role":"user"}

⚙️ [2] Generating JWT token
ℹ️ JWT token generated successfully
   └─ {"expiresIn":"7d"}

╔════════════════════════════════════════════════════════════════╗
║ ✅ LOGIN OPERATION SUCCESS
╚════════════════════════════════════════════════════════════════╝

📊 Result: {
   "access_token": "eyJhbGc...",
   "user": {
     "id": "550e8400-e29b-41d4-a716-446655440000",
     "email": "sonica@fountain.io",
     "role": "user"
   }
}
```

### Logs Gerados (Email não encontrado):

```
╔════════════════════════════════════════════════════════════════╗
║ ▶️  STARTING LOGIN OPERATION
╚════════════════════════════════════════════════════════════════╝
📋 Input Data: {"email":"unknown@fountain.io"}

⚙️ [1] Looking up user by email
   └─ {"email":"unknown@fountain.io"}

❌ User not found: FAILED
   └─ {"error":"Email not registered in system"}

╔════════════════════════════════════════════════════════════════╗
║ ❌ LOGIN OPERATION FAILED - 401 UNAUTHORIZED
╚════════════════════════════════════════════════════════════════╝
```

---

## 🪙 Exemplo 2: Create New Stablecoin (On-Chain RLUSD → Mint CUSTOM_BRL)

### Requisição:

```bash
curl -X POST http://localhost:3000/api/v1/stablecoins \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGc..." \
  -d '{
    "tokenizerId": "550e8400-e29b-41d4-a716-446655440000",
    "clientId": "client_sonica_01",
    "name": "Sônica Park BRL",
    "clientWallet": "rN7n7otQDd6FczFgLdcqpHnZc5LiMvMPAr",
    "webhookUrl": "https://webhook.sonica.com/fountain",
    "metadata": {
      "legalName": "Sônica Park Brasil",
      "document": "12345678901234"
    }
  }'
```

### Logs Esperados:

```
╔════════════════════════════════════════════════════════════════╗
║ ▶️  STARTING CREATE STABLECOIN OPERATION
╚════════════════════════════════════════════════════════════════╝
📋 Input Data: {
   "tokenizerId": "550e8400-e29b-41d4-a716-446655440000",
   "clientId": "client_sonica_01",
   "name": "Sônica Park BRL",
   "clientWallet": "rN7n7otQDd6FczFgLdcqpHnZc5LiMvMPAr"
}

⚙️ [1] Validating tokenizer exists
✅ Tokenizer found: PASSED
   └─ {"id": "550e8400-e29b-41d4-a716-446655440000", "name": "Sônica", "status": "active"}

⚙️ [2] Validating client wallet address
✅ XRPL address valid: PASSED
   └─ {"address": "rN7n7otQDd6FczFgLdcqpHnZc5LiMvMPAr"}

⚙️ [3] Generating issuer wallet on-chain
⛓️ BLOCKCHAIN OPERATION
   ├─ Wallet Generated: rIssuerWalletAddress123...
   └─ Encrypted Seed Stored: ***masked***

⚙️ [4] Creating stablecoin record
✨ STABLECOIN CREATED - ID: 660e8400-e29b-41d4-a716-446655440001
   └─ Data: {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "tokenizerId": "550e8400-e29b-41d4-a716-446655440000",
      "clientId": "client_sonica_01",
      "name": "Sônica Park BRL",
      "currencyCode": "SPCBRL",
      "status": "pending_setup",
      "issuerWalletAddress": "rIssuerWalletAddress123...",
      "totalSupply": 0
   }

╔════════════════════════════════════════════════════════════════╗
║ ✅ STABLECOIN CREATED SUCCESSFULLY
╚════════════════════════════════════════════════════════════════╝

📊 Result: {
   "id": "660e8400-e29b-41d4-a716-446655440001",
   "currencyCode": "SPCBRL",
   "status": "pending_setup",
   "issuerWallet": "rIssuerWalletAddress123...",
   "readyForOperations": false
}
```

---

## 🪙 Exemplo 3: Mint Stablecoin (On-Chain RLUSD Deposit)

### Cenário:
Cliente deposita 5000 RLUSD on-chain. Sistema:
1. Detecta depósito via XRPL listener
2. Converte RLUSD → BRL via taxa de câmbio
3. Minta tokens SPCBRL equivalentes
4. Envia tokens para cliente

### Logs Esperados:

```
╔════════════════════════════════════════════════════════════════╗
║ ▶️  STARTING MINT OPERATION (ON-CHAIN RLUSD)
╚════════════════════════════════════════════════════════════════╝
📋 Deposit Detected: {
   "hash": "0xDEPOSIT123...",
   "stablecoinId": "660e8400-e29b-41d4-a716-446655440001",
   "amount": 5000,
   "asset": "RLUSD",
   "from": "rClientWallet..."
}

⚙️ [1] Validating stablecoin status
✅ Status valid: PASSED
   └─ {"status": "pending_setup" → "active"}

⚙️ [2] Fetching USD/BRL exchange rate
ℹ️ Exchange rate retrieved from BACEN
   └─ {"rate": 5.25}

⚙️ [3] Converting RLUSD to BRL
🧮 Conversion Calculation
   ├─ Input: 5000 RLUSD
   ├─ Rate: 1 USD = 5.25 BRL
   └─ Output: 26250 BRL (5000 × 5.25)

⚙️ [4] Creating operation record
✨ OPERATION CREATED - ID: 770e8400-e29b-41d4-a716-446655440002
   └─ Data: {
      "id": "770e8400-e29b-41d4-a716-446655440002",
      "stablecoinId": "660e8400-e29b-41d4-a716-446655440001",
      "type": "mint",
      "status": "processing",
      "amountRlusd": 5000,
      "amountBrl": 26250,
      "blockchainTxHash": "0xDEPOSIT123..."
   }

⚙️ [5] Creating trustline on XRPL
⛓️ BLOCKCHAIN TRANSACTION
   ├─ TxHash: 0xTRUSTLINE123...
   ├─ Action: SetTrustLine
   └─ Currency: SPCBRL (Sônica Park BRL)

⚙️ [6] Minting tokens on-chain
⛓️ BLOCKCHAIN TRANSACTION
   ├─ TxHash: 0xMINT123...
   ├─ Action: Payment (IssuerPayment)
   ├─ Currency: SPCBRL
   ├─ Amount: 26250
   └─ Destination: rClientWallet...

⚙️ [7] Updating stablecoin state
🔄 STATE UPDATE - STABLECOIN
   ├─ ID: 660e8400-e29b-41d4-a716-446655440001
   └─ Changes: {
      "totalSupply": 0 → 26250,
      "status": "pending_setup" → "active",
      "activatedAt": "2024-11-10T02:30:00Z"
   }

⚙️ [8] Sending webhook notification
🔔 WEBHOOK DELIVERY - DELIVERED
   ├─ URL: https://webhook.sonica.com/fountain
   ├─ Event: mint.completed
   ├─ Attempt: 1/3
   └─ Payload: {
      "operationId": "770e8400-e29b-41d4-a716-446655440002",
      "status": "completed",
      "amountBrl": 26250,
      "tokensMinted": 26250
   }

╔════════════════════════════════════════════════════════════════╗
║ ✅ MINT OPERATION SUCCESS (ON-CHAIN RLUSD)
╚════════════════════════════════════════════════════════════════╝

📊 Result: {
   "operationId": "770e8400-e29b-41d4-a716-446655440002",
   "status": "completed",
   "amountRlusdDeposited": 5000,
   "amountBrlConverted": 26250,
   "tokensMinted": 26250,
   "txHash": "0xMINT123..."
}
```

---

## 🔥 Exemplo 4: Burn & Withdraw (BRL → RLUSD Return)

### Requisição:

```bash
curl -X POST http://localhost:3000/api/v1/operations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGc..." \
  -d '{
    "stablecoinId": "660e8400-e29b-41d4-a716-446655440001",
    "type": "burn",
    "amountBrl": 10000,
    "returnMethod": "RLUSD",
    "burnWallet": "rClientWallet...",
    "burnMemo": "redemption_sonica_001"
  }'
```

### Logs Esperados:

```
╔════════════════════════════════════════════════════════════════╗
║ ▶️  STARTING BURN OPERATION (RLUSD RETURN)
╚════════════════════════════════════════════════════════════════╝
📋 Input Data: {
   "stablecoinId": "660e8400-e29b-41d4-a716-446655440001",
   "amountBrl": 10000,
   "returnMethod": "RLUSD"
}

⚙️ [1] Validating stablecoin exists
✅ Stablecoin found: PASSED
   └─ {"id": "660e8400-e29b-41d4-a716-446655440001", "status": "active"}

⚙️ [2] Validating sufficient token balance
✅ Balance sufficient: PASSED
   └─ {"available": 26250, "requested": 10000}

⚙️ [3] Fetching USD/BRL exchange rate
ℹ️ Exchange rate retrieved
   └─ {"source": "BACEN", "rate": 5.25}

⚙️ [4] Calculating return amount (BRL → RLUSD)
🧮 Return Calculation
   ├─ Input: 10000 BRL
   ├─ Formula: BRL ÷ Rate = RLUSD
   ├─ Calculation: 10000 ÷ 5.25 = 1904.76
   └─ Output: 1904.76 RLUSD to return

⚙️ [5] Executing clawback on XRPL
⛓️ BLOCKCHAIN TRANSACTION
   ├─ TxHash: 0xCLAWBACK123...
   ├─ Action: Clawback
   ├─ Currency: SPCBRL
   ├─ Amount: 10000 tokens
   └─ From: rClientWallet...

⚙️ [6] Sending RLUSD return transfer
⛓️ BLOCKCHAIN TRANSACTION
   ├─ TxHash: 0xRLUSD_RETURN123...
   ├─ Action: Payment
   ├─ Asset: RLUSD
   ├─ Amount: 1904.76
   └─ Destination: rClientWallet...

⚙️ [7] Updating stablecoin state
🔄 STATE UPDATE - STABLECOIN
   ├─ ID: 660e8400-e29b-41d4-a716-446655440001
   └─ Changes: {
      "totalSupply": 26250 → 16250,
      "updatedAt": "2024-11-10T02:35:00Z"
   }

⚙️ [8] Creating operation record
✨ OPERATION COMPLETED - ID: 880e8400-e29b-41d4-a716-446655440003
   └─ Data: {
      "id": "880e8400-e29b-41d4-a716-446655440003",
      "stablecoinId": "660e8400-e29b-41d4-a716-446655440001",
      "type": "burn",
      "status": "completed",
      "amountBrl": 10000,
      "amountRlusd": 1904.76,
      "blockchainTxHash": "0xCLAWBACK123...",
      "returnMethod": "RLUSD"
   }

⚙️ [9] Sending webhook notification
🔔 WEBHOOK DELIVERY - DELIVERED
   ├─ URL: https://webhook.sonica.com/fountain
   ├─ Event: burn.completed
   ├─ Attempt: 1/3
   └─ Payload: {
      "operationId": "880e8400-e29b-41d4-a716-446655440003",
      "status": "completed",
      "amountBrlBurned": 10000,
      "amountRlusdReturned": 1904.76
   }

╔════════════════════════════════════════════════════════════════╗
║ ✅ BURN OPERATION SUCCESS (RLUSD RETURN)
╚════════════════════════════════════════════════════════════════╝

📊 Result: {
   "operationId": "880e8400-e29b-41d4-a716-446655440003",
   "status": "completed",
   "amountBrlBurned": 10000,
   "amountRlusdReturned": 1904.76,
   "txHash": "0xCLAWBACK123..."
}
```

---

## 🪙 Exemplo 5: Create Stablecoin (Off-Chain PIX Deposit)

### Requisição:

```bash
curl -X POST http://localhost:3000/api/v1/stablecoins \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGc..." \
  -d '{
    "tokenizerId": "550e8400-e29b-41d4-a716-446655440000",
    "clientId": "client_pix_001",
    "name": "Loja ABC BRL",
    "clientWallet": "rLojaABC123...",
    "depositMode": "PIX",
    "webhookUrl": "https://webhook.lojabc.com/fountain"
  }'
```

### Logs Esperados:

```
╔════════════════════════════════════════════════════════════════╗
║ ▶️  STARTING CREATE STABLECOIN OPERATION (PIX MODE)
╚════════════════════════════════════════════════════════════════╝
📋 Input Data: {
   "tokenizerId": "550e8400-e29b-41d4-a716-446655440000",
   "clientId": "client_pix_001",
   "name": "Loja ABC BRL",
   "depositMode": "PIX"
}

⚙️ [1] Validating tokenizer exists
✅ Tokenizer found: PASSED

⚙️ [2] Validating XRPL wallet address
✅ XRPL address valid: PASSED

⚙️ [3] Generating issuer wallet on-chain
⛓️ BLOCKCHAIN OPERATION
   ├─ Wallet Generated: rLojaIssuer456...
   └─ Encrypted Seed Stored: ***masked***

⚙️ [4] Setting up PIX payment infrastructure
🏦 PIX SETUP (ASAS)
   ├─ Service: Asas API
   ├─ Action: Register merchant
   └─ Status: pending_kyc_approval

⚙️ [5] Creating stablecoin record
✨ STABLECOIN CREATED - ID: 990e8400-e29b-41d4-a716-446655440004
   └─ Data: {
      "id": "990e8400-e29b-41d4-a716-446655440004",
      "clientId": "client_pix_001",
      "name": "Loja ABC BRL",
      "currencyCode": "LOJBRL",
      "depositMode": "PIX",
      "status": "pending_setup",
      "issuerWalletAddress": "rLojaIssuer456..."
   }

╔════════════════════════════════════════════════════════════════╗
║ ✅ STABLECOIN CREATED (PIX MODE)
╚════════════════════════════════════════════════════════════════╝

📊 Result: {
   "id": "990e8400-e29b-41d4-a716-446655440004",
   "currencyCode": "LOJBRL",
   "depositMode": "PIX",
   "status": "pending_setup",
   "nextStep": "KYC approval required to generate PIX QR code"
}
```

---

## 🪙 Exemplo 6: Mint Stablecoin (Off-Chain PIX Deposit)

### Cenário:
Cliente envia 5000 BRL via PIX. Sistema:
1. Listener Asas detecta pagamento
2. Integração Binance converte BRL → XRP
3. Deposita XRP no issuer
4. Minta tokens equivalentes
5. Notifica cliente via webhook

### Logs Esperados:

```
╔════════════════════════════════════════════════════════════════╗
║ ▶️  STARTING MINT OPERATION (OFF-CHAIN PIX)
╚════════════════════════════════════════════════════════════════╝
📋 PIX Payment Detected: {
   "amount": 5000,
   "currency": "BRL",
   "payer": "user@example.com",
   "key": "cpf@example.com",
   "transactionId": "pix_123abc"
}

⚙️ [1] Validating stablecoin status
✅ Status valid: PASSED

⚙️ [2] Fetching BRL/XRP exchange rate
ℹ️ Exchange rate retrieved from Binance
   └─ {"source": "Binance", "rate": 0.19} (1 BRL = 0.19 XRP)

⚙️ [3] Converting BRL to XRP
🧮 Conversion Calculation
   ├─ Input: 5000 BRL
   ├─ Rate: 1 BRL = 0.19 XRP
   ├─ XRP needed: 950 XRP (5000 × 0.19)
   ├─ Add buffer: +5% = 997.5 XRP
   └─ Output: 997.5 XRP to deposit

⚙️ [4] Purchasing XRP on Binance
💱 BINANCE TRANSACTION
   ├─ Service: Binance P2P / Spot
   ├─ Amount: 997.5 XRP
   ├─ Cost: 5250 BRL (includes fee 5%)
   └─ TxHash: binance_tx_456...

⚙️ [5] Depositing XRP to issuer wallet
⛓️ BLOCKCHAIN TRANSACTION
   ├─ TxHash: 0xXRP_DEPOSIT123...
   ├─ Action: Payment
   ├─ Asset: XRP
   ├─ Amount: 997.5 XRP
   └─ To: rLojaIssuer456...

⚙️ [6] Creating trustline
⛓️ BLOCKCHAIN TRANSACTION
   ├─ TxHash: 0xTRUSTLINE456...
   └─ Action: SetTrustLine (LOJBRL)

⚙️ [7] Minting tokens
⛓️ BLOCKCHAIN TRANSACTION
   ├─ TxHash: 0xMINT456...
   ├─ Action: Payment (IssuedCurrency)
   ├─ Currency: LOJBRL
   ├─ Amount: 5000
   └─ Destination: rClientWallet...

⚙️ [8] Updating PIX payment status
✅ Payment confirmed
   └─ {"transactionId": "pix_123abc", "status": "completed"}

⚙️ [9] Updating stablecoin state
🔄 STATE UPDATE - STABLECOIN
   ├─ ID: 990e8400-e29b-41d4-a716-446655440004
   └─ Changes: {
      "totalSupply": 0 → 5000,
      "status": "pending_setup" → "active",
      "totalDepositedBrl": 0 → 5250
   }

⚙️ [10] Sending webhook notification
🔔 WEBHOOK DELIVERY - DELIVERED
   ├─ URL: https://webhook.lojabc.com/fountain
   ├─ Event: mint.completed
   └─ Payload: {
      "amountBrlDeposited": 5000,
      "tokensMinted": 5000,
      "pixKey": "cpf@example.com"
   }

╔════════════════════════════════════════════════════════════════╗
║ ✅ MINT OPERATION SUCCESS (OFF-CHAIN PIX)
╚════════════════════════════════════════════════════════════════╝

📊 Result: {
   "operationId": "aa0e8400-e29b-41d4-a716-446655440005",
   "status": "completed",
   "amountBrlDeposited": 5000,
   "tokensMinted": 5000,
   "xrpPurchased": 997.5,
   "txHash": "0xMINT456..."
}
```

---

## 🔥 Exemplo 7: Burn & Withdraw (BRL → PIX Return)

### Requisição:

```bash
curl -X POST http://localhost:3000/api/v1/operations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGc..." \
  -d '{
    "stablecoinId": "990e8400-e29b-41d4-a716-446655440004",
    "type": "burn",
    "amountBrl": 2500,
    "returnMethod": "PIX",
    "returnDestination": {
      "pixKey": "user@example.com",
      "keyType": "email"
    }
  }'
```

### Logs Esperados:

```
╔════════════════════════════════════════════════════════════════╗
║ ▶️  STARTING BURN OPERATION (PIX RETURN)
╚════════════════════════════════════════════════════════════════╝
📋 Input Data: {
   "stablecoinId": "990e8400-e29b-41d4-a716-446655440004",
   "amountBrl": 2500,
   "returnMethod": "PIX"
}

⚙️ [1] Validating stablecoin exists
✅ Stablecoin found: PASSED

⚙️ [2] Validating sufficient token balance
✅ Balance sufficient: PASSED
   └─ {"available": 5000, "requested": 2500}

⚙️ [3] Fetching BRL/XRP exchange rate
ℹ️ Exchange rate retrieved from Binance
   └─ {"rate": 0.19}

⚙️ [4] Calculating XRP to sell
🧮 Calculation
   ├─ Input: 2500 BRL (to be returned)
   ├─ Rate: 1 BRL = 0.19 XRP
   ├─ XRP to sell: 475 XRP (2500 × 0.19)
   └─ Output: 475 XRP

⚙️ [5] Executing clawback on XRPL
⛓️ BLOCKCHAIN TRANSACTION
   ├─ TxHash: 0xCLAWBACK456...
   ├─ Action: Clawback
   ├─ Currency: LOJBRL
   ├─ Amount: 2500 tokens

⚙️ [6] Transferring XRP to Binance wallet
⛓️ BLOCKCHAIN TRANSACTION
   ├─ TxHash: 0xXRP_SELL456...
   ├─ Action: Payment
   ├─ Amount: 475 XRP
   └─ To: binance_receiving_wallet

⚙️ [7] Selling XRP on Binance
💱 BINANCE TRANSACTION
   ├─ Service: Binance P2P
   ├─ Amount: 475 XRP
   ├─ Received: 2375 BRL (after fees ~5%)
   └─ TxHash: binance_sell_789...

⚙️ [8] Sending PIX payment to customer
🏦 PIX PAYMENT (ASAS)
   ├─ Service: Asas API
   ├─ Amount: 2375 BRL
   ├─ Destination: user@example.com (PIX email key)
   ├─ TxHash: pix_out_123abc
   └─ Status: completed

⚙️ [9] Updating stablecoin state
🔄 STATE UPDATE - STABLECOIN
   ├─ ID: 990e8400-e29b-41d4-a716-446655440004
   └─ Changes: {
      "totalSupply": 5000 → 2500,
      "totalDepositedBrl": 5250 → 2875
   }

⚙️ [10] Creating operation record
✨ OPERATION COMPLETED - ID: bb0e8400-e29b-41d4-a716-446655440006
   └─ Data: {
      "id": "bb0e8400-e29b-41d4-a716-446655440006",
      "stablecoinId": "990e8400-e29b-41d4-a716-446655440004",
      "type": "burn",
      "status": "completed",
      "amountBrl": 2500,
      "amountXrpSold": 475,
      "pixPaymentAmount": 2375,
      "returnMethod": "PIX"
   }

⚙️ [11] Sending webhook notification
🔔 WEBHOOK DELIVERY - DELIVERED
   ├─ URL: https://webhook.lojabc.com/fountain
   ├─ Event: burn.completed
   └─ Payload: {
      "operationId": "bb0e8400-e29b-41d4-a716-446655440006",
      "status": "completed",
      "amountBrlBurned": 2500,
      "amountPixReturned": 2375,
      "pixKey": "user@example.com"
   }

╔════════════════════════════════════════════════════════════════╗
║ ✅ BURN OPERATION SUCCESS (PIX RETURN)
╚════════════════════════════════════════════════════════════════╝

📊 Result: {
   "operationId": "bb0e8400-e29b-41d4-a716-446655440006",
   "status": "completed",
   "amountBrlBurned": 2500,
   "amountPixReturned": 2375,
   "pixKey": "user@example.com"
}
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

# Apenas blockchain transactions
npm start:dev | grep "BLOCKCHAIN\|TxHash"

# Apenas webhooks
npm start:dev | grep "WEBHOOK\|DELIVERY"
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

// Integrações externas
logger.logExternalService(service: string, action: string, data: any, success: boolean)
logger.logExchangeRateConversion(from: string, to: string, rate: number, amount: number, result: number)
logger.logPixPayment(amount: number, key: string, status: string)
logger.logBinanceTransaction(action: string, amount: number, currency: string, txHash: string)

// Gerais
logger.logInfo(message: string, data?: any)
logger.logWarning(message: string, data?: any)
logger.logError(message: string, error?: any)
logger.logDatabaseQuery(query: string, parameters?: any)
```

---

## 📋 Resumo dos Fluxos

| Exemplo | Cenário | Entrada | Saída |
|---------|---------|---------|-------|
| 1 | Auth Email-Only | Email | JWT Token |
| 2 | Create Stablecoin | Dados do cliente + tokenizer | Stablecoin ativo |
| 3 | Mint On-Chain RLUSD | 5000 RLUSD | 26250 BRL tokens |
| 4 | Burn On-Chain RLUSD | 10000 BRL tokens | 1904.76 RLUSD |
| 5 | Create Stablecoin PIX | Dados + modo PIX | Stablecoin em setup |
| 6 | Mint Off-Chain PIX | 5000 BRL via PIX | 5000 BRL tokens |
| 7 | Burn Off-Chain PIX | 2500 BRL tokens | 2375 BRL via PIX |

---

## ⚙️ Fluxos de Dados Completos

### On-Chain (RLUSD):
```
Deposit RLUSD → Detect → Convert (RLUSD→BRL) → Mint Tokens → Webhook
Burn Tokens → Clawback → Convert (BRL→RLUSD) → Send RLUSD → Webhook
```

### Off-Chain (PIX):
```
PIX Received → Detect (Asas) → Convert (BRL→XRP, Binance) → Deposit XRP → Mint Tokens → Webhook
Burn Tokens → Clawback → Convert (XRP→BRL, Binance) → Send PIX (Asas) → Webhook
```

---

## 🔄 Estado das Operações

```
Pending → Processing → Completed ✅
       ↓
      Failed ❌ → Retry (max 3x) → Webhook Notification
```

---
