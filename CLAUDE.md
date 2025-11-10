# CLAUDE.md

Este arquivo fornece orientações ao Claude Code ao trabalhar neste repositório.

## Visão Geral do Projeto

**Stable Fountain** é um serviço backend B2B SaaS para emissão e gerenciamento de stablecoins BRL customizadas na XRP Ledger (XRPL), projetado para empresas tokenizadoras de ativos reais.

### Modelo de Negócio

- **B2B SaaS:** Clientes são empresas tokenizadoras (ex: Sônica), não usuários finais
- **Stablecoins customizadas:** Cada cliente pode ter seu próprio currency code (ex: APBRL, XYBRL)
- **On/Off-ramp:** PIX (via Asas) ou XRP/RLUSD (via Binance)
- **Compliance abstraído:** Tokenizadora faz KYC/AML, nós fornecemos infraestrutura técnica

### Arquitetura Atual: Issued Currencies (XRPL)

**Tecnologia Core:**
- **XRPL Issued Currencies:** Tokens fungíveis nativos da XRP Ledger
- **Trust Lines:** Conexões entre issuer e holders (gerencia saldos on-chain)
- **Clawback:** Recuperação parcial de tokens (compliance/redemptions)
- **Authorized Trust Lines:** Apenas contas aprovadas podem receber tokens (KYC)

**NÃO USAMOS:**
- ❌ XRPL Hooks (pivotamos dessa arquitetura na Fase 1)
- ❌ Xahau Network (voltamos para XRPL mainnet)
- ❌ Smart contracts em WebAssembly
- ❌ Pools de colateralização descentralizados

## Evolução do Projeto

Este projeto passou por 3 fases distintas. **Para a história completa, consulte `/docs/01-evolution/project-journey.md`**.

### Fase 1: Hooks + Xahau (Deprecated)
- Arquitetura inicial com smart contracts em C/WebAssembly
- Pool global de XRP com 150% de colateralização
- Singlecoin (RLBRL para todos)
- **Status:** Deprecated - Referência histórica apenas

### Fase 2: Client Discovery (Novembro 2024)
- Entrevistas com Sônica (tokenizadora imobiliária)
- Descoberta de requisitos reais do mercado
- Learnings: múltiplos tokens, colateralização 1:1, PIX essencial

### Fase 3: Issued Currencies (Atual)
- Pivot para Issued Currencies XRPL nativas
- Modelo B2B SaaS com webhook notifications
- Integração PIX (Asas) + Binance (conversões XRP)
- **Status:** Em desenvolvimento

## Arquitetura Técnica

### Backend (NestJS + TypeScript)

**Estrutura de Módulos:**
```
src/
├── config/          - Configuração (env vars, validação)
├── modules/
│   ├── auth/        - Autenticação JWT (Tokenizers)
│   ├── tokenizers/  - Gerenciamento de clientes B2B
│   ├── stablecoins/ - CRUD de stablecoins (Issued Currencies)
│   ├── operations/  - Mint/Burn operations (auditoria)
│   ├── oracle/      - Exchange rates (XRP/BRL, RLUSD/BRL)
│   ├── webhooks/    - Event notifications
│   ├── xrpl/        - Integração XRPL (NOVO)
│   ├── asas/        - Integração PIX via Asas (NOVO)
│   └── binance/     - Integração conversão XRP (NOVO)
└── database/        - TypeORM, entities, migrations
```

**Banco de Dados (Supabase/PostgreSQL):**
- Tokenizers (empresas clientes)
- Stablecoins (stablecoins em emissão)
- Operations (histórico de mint/burn)
- Users (admins do sistema)
- Webhooks (notificações para tokenizers)
- Exchange rates (oráculos de preço)

### Fluxo de Mint (Criar Stablecoin)

**Via PIX:**
```
1. POST /stablecoins/mint (JWT auth)
   ├─ Parâmetros: valor_brl, modo: "pix", webhook, wallet_destino, client_name
   └─ Backend valida e salva no DB

2. Backend → Asas API: gera QR Code PIX
   └─ Retorna QR Code para tokenizadora

3. Asas Webhook → Backend: PIX confirmado
   └─ Backend registra recebimento, dispara fila Binance

4. Fila Binance: Compra XRP com BRL
   ├─ Valida slippage
   └─ Transfere XRP para issuer wallet

5. Fila Mint: Executa minting na XRPL
   ├─ Payment transaction com currency code (ex: APBRL)
   ├─ Amount proporcional ao depósito (1:1)
   ├─ Estabelece trust line com holder
   └─ Ativa clawback se necessário

6. Backend → Tokenizadora Webhook: operação completa
   └─ Inclui tx hash, currency code, amount

**Timeout:** 10min; cancela se PIX não cair
```

**Via On-Chain (XRP/RLUSD):**
```
1. POST /stablecoins/mint (modo: "on_chain_xrp")
2. Backend cria wallet XRPL temporária + subscriber
3. Retorna endereço para depósito
4. Subscriber detecta transação on-chain → valida
5. Transfere colateral para issuer wallet → Fila Mint
6. Webhook de confirmação para tokenizadora
```

### Fluxo de Burn (Resgatar Stablecoin)

```
1. POST /stablecoins/:id/burn
   ├─ Parâmetros: amount, modo (pix/on-chain)
   └─ Pré-requisito: chave PIX ou wallet cadastrada

2. Backend valida saldo na trustline (via XRPL API)

3. Backend → XRPL: Clawback transaction
   ├─ Recupera apenas o valor especificado
   └─ Libera colateral proporcional

4. Conversão:
   ├─ Via PIX: vende XRP (Binance) → saca (Asas) → PIX
   └─ Via On-Chain: transfere XRP/RLUSD direto

5. Webhook: status "resgatado"
```

### Gerenciamento de Saldos (On-Chain)

**Trust Lines = "Contas Bancárias" On-Chain:**
- Cada stablecoin (currency code) tem suas próprias trust lines
- Saldos trackados nativamente pela XRPL (não no nosso DB)
- Consulta: `getAccountLines(holder_account, issuer_account)`

**Exemplo:**
```javascript
// Cliente Sônica tem 3 stablecoins diferentes:
// APBRL (America Park), XYZBRL (outro cliente), FIDBRL (FIDC)

const lines = await xrpl.getAccountLines({
  account: "rSonica...",
  peer: "rStableFountainIssuer..."
});

// Retorna:
[
  { currency: "APBRL", balance: "1000000", limit: "0" },
  { currency: "XYZBRL", balance: "500000", limit: "0" },
  { currency: "FIDBRL", balance: "250000", limit: "0" }
]
```

**Colateral:**
- Travado na issuer wallet (XRP/RLUSD)
- Lastreamento 1:1 (não 150% como na Fase 1)
- Auditável via XRPL API (transparência)

## Diferenças Críticas: Fase 1 vs Fase 3

| Aspecto | Fase 1 (Hooks - Deprecated) | Fase 3 (Issued Currencies - Atual) |
|---------|---------------------------|------------------------|
| **Tecnologia** | XRPL Hooks (WebAssembly/C) | Issued Currencies (nativo XRPL) |
| **Rede** | Xahau | XRPL Mainnet |
| **Colateral** | Pool global 150% | 1:1 por token |
| **Tokens** | Um único (RLBRL) | Múltiplos (APBRL, XYBRL...) |
| **Smart Contracts** | Código C no hook | Nenhum (features nativas) |
| **Clientes** | Recebem de pool global | Cada um com currency code próprio |
| **Complexidade** | Alta (C, debugging difícil) | Baixa (APIs REST + XRPL.js) |

## Importante para Desenvolvimento

### Ao Trabalhar com Código

1. **NUNCA referencie Hooks ou Xahau** em código novo
   - Se encontrar referências antigas, marque para remoção

2. **Use sempre XRPL nativo:**
   - `xrpl` package (não `xrpl-hooks` ou `xahau-lib`)
   - Issued Currencies transactions (Payment, TrustSet, Clawback)

3. **Auditoria on-chain é suficiente:**
   - Não precisamos replicar saldos no DB (trust lines fazem isso)
   - DB só para operações, clientes, webhooks

4. **Segurança de wallets:**
   - Chaves privadas em variáveis de ambiente (nunca commitar)
   - Considerar HSM ou Vault para produção
   - Wallets temporárias (mint on-chain) devem ser descartadas após uso

### Ao Escrever Documentação

1. **Sempre esclareça a fase:**
   - Se falar de Hooks, mencionar "Fase 1 (deprecated)"
   - Se falar de Issued Currencies, mencionar "Arquitetura atual"

2. **Links para documentação:**
   - Usar documentos em `/docs/`
   - Docs oficiais XRPL: https://xrpl.org/
   - Evitar links para Xahau/Hooks (só em seção histórica)

### Estrutura de Documentação

Consulte `/docs/README.md` para navegação completa:
- **Evolução do projeto:** `/docs/01-evolution/project-journey.md`
- **Pesquisa de mercado:** `/docs/02-research/`
- **Arquitetura atual:** `/docs/03-architecture/`
- **Guias backend:** `/docs/04-backend/`
- **Referências:** `/docs/05-references/`

## Cliente Principal: Sônica

**Perfil:**
- Tokenizadora de ativos reais (imobiliário, florestas, FIDC)
- 10 clientes ativos, média empresas
- Casos de uso: captação via CVM88, investidores varejo

**Cenário de Uso:**
Captação de R$ 10M para "America Park" (Real Estate):
1. Sônica cria stablecoin "APBRL"
2. Investidores fazem PIX → recebem APBRL tokens
3. Durante captação (até 180 dias): rentabiliza BRL off-chain
4. Investidores transferem APBRL entre si (P2P via XRPL)
5. Resgate: clawback tokens → conversão → PIX

**Status:** Comprometida a testar MVP em 1-3 meses

## Monetização (Propostas)

1. **Taxas por transação:** 0.1-0.5% sobre mint/burn
2. **SaaS por assinatura:** Planos basic/premium/enterprise
3. **Parcerias/comissões:** Revenue sharing com Ripple (RLUSD)

Ver `/docs/03-architecture/b2b-saas-model.md` para detalhes.

## Segurança e Compliance

### Pontos Críticos

- **Chaves privadas:** Nunca commitar, usar HSM em produção
- **Webhooks:** HMAC authentication, idempotência
- **KYC/AML:** Responsabilidade da tokenizadora, mas trackamos para auditoria
- **Clawback:** Só para compliance legítimo (resgate/correções)
- **Rate limiting:** APIs devem ter throttling

### Falhas Possíveis e Mitigações

- **Asas/Binance downtime:** Implementar retries com backoff, fallbacks
- **Volatilidade XRP:** Usar oracles, buffers de taxa, slippage validation
- **Subscribers XRPL falham:** Fallback para polling
- **Timeouts não gerenciados:** Cron jobs para limpeza de operações pendentes (>10min)

## Referências Técnicas

### XRPL Official Docs (Usar Sempre)

- **Issued Currencies:** https://xrpl.org/docs/concepts/tokens/fungible-tokens/
- **Stablecoins:** https://xrpl.org/docs/concepts/tokens/fungible-tokens/stablecoins/
- **Clawback:** https://xrpl.org/docs/references/protocol/transactions/types/clawback
- **Trust Lines:** https://xrpl.org/docs/concepts/tokens/fungible-tokens/authorized-trust-lines
- **Ripple USD (RLUSD):** https://ripple.com/solutions/stablecoin/

### Documentação Interna

- **Especificação técnica completa:** `/docs/01-evolution/phase-3-final-architecture.md`
- **Setup backend:** `/docs/04-backend/setup-guide.md`
- **Logging:** `/docs/04-backend/logging-guide.md`
- **Pesquisa com cliente:** `/docs/02-research/sonica-responses.md`

### Deprecated (Não Usar em Código Novo)

- ~~XRPL Hooks Documentation~~ (Fase 1 - ver `/docs/DEPRECATED/`)
- ~~Xahau Network~~ (Fase 1 - ver `/docs/DEPRECATED/`)
- ~~Original Peggy Hook~~ (Inspiração, não nossa arquitetura)

## Comandos Úteis

### Desenvolvimento Local

```bash
# Backend
cd backend
npm run start:dev

# Testes
npm run test
npm run test:e2e

# Migrations
npm run migration:generate -- src/migrations/MigrationName
npm run migration:run
```

### XRPL Interação (Exemplos)

```javascript
import { Client } from 'xrpl';

// Conectar (testnet ou mainnet)
const client = new Client('wss://s.altnet.rippletest.net:51233');
await client.connect();

// Verificar saldo de stablecoin
const lines = await client.request({
  command: 'account_lines',
  account: 'rHolderAddress...',
  peer: 'rIssuerAddress...'
});

// Emitir stablecoin (Payment)
const tx = {
  TransactionType: 'Payment',
  Account: 'rIssuer...',
  Destination: 'rHolder...',
  Amount: {
    currency: 'APBRL',
    value: '1000',
    issuer: 'rIssuer...'
  }
};

// Clawback parcial
const clawbackTx = {
  TransactionType: 'Clawback',
  Account: 'rIssuer...',
  Amount: {
    currency: 'APBRL',
    value: '500',
    issuer: 'rIssuer...'
  },
  Holder: 'rHolder...'
};
```

## Glossário Rápido

- **Issued Currency:** Token fungível nativo XRPL (ex: APBRL, XYBRL)
- **Trust Line:** Conexão on-chain que permite holder receber tokens
- **Clawback:** Recuperar tokens de holder (para compliance/resgates)
- **Authorized Trust Lines:** Trust lines que requerem aprovação do issuer (KYC)
- **Issuer:** Wallet que emite o token (nossa wallet central ou por cliente)
- **Holder:** Wallet que possui tokens (tokenizadora ou investidores)
- **Currency Code:** Código de 3-40 caracteres ASCII (ex: APBRL)
- **RLUSD:** Stablecoin USD da Ripple (alternativa a USDC/USDT)
- **Tokenizer:** Empresa cliente que usa nossa plataforma
- **Mint:** Criar/emitir novos tokens
- **Burn:** Destruir tokens (via Clawback)

## Próximos Passos (Roadmap)

**FASE 1 - Fundação (2-3 semanas):**
- Completar migrações de entities (Stablecoin, Operation, Oracle)
- Módulo XRPL básico (conexão + mint simples)
- Setup Testnet (XRPL + Asas sandbox + Binance Testnet)

**FASE 2 - Core (3-4 semanas):**
- Módulos Asas + Binance (integração completa)
- Queues Bull (BinanceConversion + Mint)
- Endpoint mint via PIX completo
- Testes E2E

**FASE 3 - Avançado (2-3 semanas):**
- Subscriber XRPL (depósitos on-chain)
- Clawback service (resgate parcial)
- Endpoint burn (PIX + On-Chain)
- Trust Lines autorizadas

**FASE 4 - Produção (1-2 semanas):**
- Segurança (criptografia seeds, HSM)
- Observabilidade (Prometheus, alertas)
- Documentação OpenAPI + SDK
- Load testing e hardening

---

**Versão:** 3.0 (Issued Currencies)
**Última atualização:** Novembro 2024
**Contato:** [Time de desenvolvimento]

Para dúvidas ou esclarecimentos, consulte `/docs/01-evolution/project-journey.md` para contexto histórico.
