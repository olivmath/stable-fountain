# Peggy - Sistema de Stablecoin BRL Administrado

Peggy é um hook que implementa um sistema de stablecoin em Real Brasileiro (BRL) lastreado em XRP, com gerenciamento centralizado por um admin que atua como intermediário entre usuários finais e a rede blockchain.

## Como Funciona

### Fluxo Geral

```
COMPRA (Fiat → BRL Tokens):
┌─────────┐         ┌──────────┐         ┌────────┐
│ Cliente │ PIX     │ Admin    │ XRP     │ Hook   │
│ (Reais) ├────────>│ Recebe   ├────────>│ Emite  │ eBRL → Cliente
└─────────┘         └──────────┘         └────────┘

RESGATE (eBRL Tokens → Fiat):
┌─────────┐   eBRL  ┌──────────┐    XRP  ┌────────┐
│ Cliente ├────────>│ Admin    │<-───────┤ Hook   │
│         │ queima  │ recebe   │   xrpl  │ queima │
└─────────┘         └──────────┘         └────────┘
                         │
                         │ PIX
                         ↓
                    (Cliente recebe R$)
```

## Arquitetura

### Componentes

1. **Hook Inteligente (peggy.c)**: Smart contract na Xahau que gerencia o pool global de XRP
2. **Pool Global**: Uma única reserva de XRP compartilhada, garantindo todos os BRL emitidos
3. **Admin**: Único intermediário que interage com o hook, processando mint/burn
4. **Clientes**: Recebem/usam BRL tokens, transferem entre si, podem resgatar via admin

### Segurança - Collateralization

- **150% Collateralization**: Novo BRL só pode ser emitido se pool mantiver 150% de cobertura
- **120% Emergency Mode**: Se pool cair abaixo de 120%, admin deve adicionar XRP urgentemente
- **Fórmula**: (Total XRP × Taxa de Câmbio) / Total BRL Emitido ≥ 150%

### Exemplo

```
Cenário: Taxa BRL/XRP = 150 R$/XRP

Estado Inicial:
- Pool: 100 XRP = 15,000 R$ colateral
- BRL Emitido: 0
- Ratio: ∞ (seguro)

Admin deposita 1,000 XRP:
- Pool: 1,100 XRP = 165,000 R$ colateral
- BRL Máximo: 165,000 × (2/3) = 110,000 R$
- Admin emite: 100,000 BRL para cliente
- Ratio: 165,000 / 100,000 = 1.65 = 165% ✅

Cliente resga 50,000 BRL:
- Admin queima os 50,000 BRL
- Retorna: 50,000 / 150 = 333.33 XRP
- Pool: 766.67 XRP = 115,000 R$
- BRL Pendente: 50,000 BRL
- Ratio: 115,000 / 50,000 = 2.3 = 230% ✅
```

## Requisitos

### Ambiente

- **Rede**: Xahau (hooks-testnet-v3.xrpl-labs.com)
- **Contas necessárias**: 5 mínimo
  1. **Admin**: Interage com o hook (mint/burn)
  2. **Hook**: Deploy do Peggy (emite BRL)
  3. **Carlos**: Oracle de preço (baixo)
  4. **Charlie**: Oracle de preço (alto)
  5. **Clientes**: Recebem BRL tokens (quantidade variável)

### Dependências

```bash
npm install ripple-address-codec xrpl-accountlib ripple-keypairs xrpl-client
```

---

## Compilação

### Compilar peggy.c para WebAssembly

```bash
# Usando clang
clang --target=wasm32 -O3 -nostdlib -nostdinc \
  -I src/include \
  -fno-builtin \
  -c src/peggy.c -o peggy.wasm

# Ou usando compilador Xahau
xahau-clang -I src/include src/peggy.c -o peggy.wasm
```

### Verificar arquivo compilado

```bash
file peggy.wasm
# Deve retornar: WebAssembly (wasm) binary module
```

---

## Setup Inicial - Passo a Passo

### Passo 1: Configurar Oráculo de Preço

O oráculo determina a taxa de câmbio BRL/XRP usando uma trustline entre dois accounts.

**1.1 - Converter contas oracle para binário:**

```bash
# Para Carlos (oracle baixo)
export a="rN7n7otQDd6FczFgLdDqiZvgFoHGkPNc2h"
node scripts/decode.js
# Salve o resultado em hex

# Para Charlie (oracle alto)
export a="rLHzPsX6oXkzU9dP2EJ4gBaWNTtbGRBNJW"
node scripts/decode.js
# Salve o resultado em hex

# IMPORTANTE: Carlos numericamente > Charlie
# Se não, inverta os papéis!
```

**1.2 - Configurar trustline do oráculo:**

```bash
export low_secret="sEd7jv..."          # Chave privada de Carlos
export high_account="rLHzPsX6oXkzU9dP2EJ4gBaWNTtbGRBNJW"  # Charlie
node scripts/trust-oracle.js
```

**Resultado esperado**: Trustline entre Carlos e Charlie com limite de 150 BRL/XRP

### Passo 2: Deploy do Hook

1. Abra Hooks Builder
2. Selecione conta **Hook** (onde Peggy será deployado)
3. Upload: `peggy.wasm`
4. Configure parâmetros:
   - `admin`: Endereço do Admin (em binário)
   - `oracle_lo`: Carlos (em binário, obtido no Passo 1)
   - `oracle_hi`: Charlie (em binário, obtido no Passo 1)

### Passo 3: Configurar Trustline dos Clientes

**Cada cliente** precisa configurar uma trustline para receber BRL:

```bash
export user_secret="sEd7jv..."      # Chave privada do cliente
export hook_account="rGJD..."       # Conta do hook
node scripts/trust-user.js
```

---

## Operações do Admin

### Operação 1: MINT - Emitir BRL para Cliente

**Fluxo off-chain:**
1. Cliente paga PIX/fiat para Admin (R$ 1000)
2. Admin regista no seu sistema que deve emitir R$ 1000 em BRL

**Fluxo on-chain:**

```bash
export admin_secret="sEd7jv..."              # Chave privada do Admin
export hook_account="rGJD..."                # Conta do hook
export xrp_amount="6666666"                  # XRP equivalente a R$ 1000 (100 XRP × 150 = 15000 ÷ 2.25 = 6667)
export beneficiary_account="rMaria..."       # Conta do cliente que receberá BRL
node scripts/admin-mint.js
```

**O que acontece:**
1. Admin envia XRP para o hook (com InvoiceID = endereço do cliente)
2. Hook adiciona XRP ao pool global
3. Hook calcula BRL a emitir: XRP × Taxa × (2/3) [150% collateral]
4. Hook envia BRL direto para o cliente
5. Cliente recebe BRL na sua wallet

**Exemplo numérico:**
```
Admin deposita: 100 XRP
Taxa: 150 BRL/XRP
Valor: 100 × 150 = 15,000 BRL
Emitido (150%): 15,000 × (2/3) = 10,000 BRL
Cliente recebe: 10,000 BRL tokens
```

### Operação 2: BURN - Resgatar BRL por XRP

**Fluxo off-chain:**
1. Cliente solicita resgate (app/site)
2. Cliente indica quanto quer resgatar (R$ 500)
3. Admin aprova e coordena

**Fluxo on-chain:**

```bash
export admin_secret="sEd7jv..."              # Chave privada do Admin
export hook_account="rGJD..."                # Conta do hook
export brl_amount="5000"                     # Quantidade de BRL a queimar
export beneficiary_account="rMaria..."       # Conta original do cliente
node scripts/admin-burn.js
```

**O que acontece:**
1. Cliente já enviou BRL tokens para Admin (via trustline payment)
2. Admin executa burn: envia BRL para o hook (com InvoiceID = endereço do cliente)
3. Hook queima BRL (remove da circulação)
4. Hook calcula XRP: BRL / Taxa
5. Hook envia XRP de volta para Admin
6. Admin paga PIX/fiat ao cliente

**Exemplo numérico:**
```
Cliente resga: 5,000 BRL
Taxa: 150 BRL/XRP
XRP enviado: 5,000 / 150 = 33.33 XRP
Admin recebe: 33.33 XRP
Admin paga PIX: R$ 5,000 ao cliente
```

---

## Operações dos Clientes

### P2P Transfer - Transferir BRL para Outro Cliente

Clientes podem transferir BRL entre si normalmente:

```javascript
// Exemplo: Maria transfere 1000 BRL para João
const tx = {
    "TransactionType": "Payment",
    "Account": "rMaria...",
    "Destination": "rJoao...",
    "Amount": {
        "currency": "BRL",
        "issuer": "rHook...",      // Hook account
        "value": "1000"
    },
    "Fee": "12"
};
```

**Resultado**: João recebe 1000 BRL direto na wallet

---

## Monitoramento e Debugging

### Verificar Saldo de BRL

```javascript
const client = new XrplClient('wss://hooks-testnet-v3.xrpl-labs.com');
const lines = await client.send({
    command: 'account_lines',
    account: 'rMaria...',
    peer: 'rHook...'
});
console.log(lines.lines[0].balance);  // Saldo em BRL
```

### Verificar Estado do Pool

```bash
# Ver estado da blockchain (requisição direta ao ledger)
# Precisaria fazer uma query ao hook state do Xahau
# Estado fica em: GLOBAL_POOL key = "GLOBAL_POOL" (11 bytes)
```

### Erros Comuns

| Erro | Causa | Solução |
|------|-------|--------|
| "Only admin can interact" | Transação não é do admin | Use conta Admin configurada no hook |
| "Pool would exceed 150%" | Emissão quebraria collateral | Adicione mais XRP ou reduza emissão |
| "InvoiceID must contain beneficiary" | Falta especificar cliente | Adicione InvoiceID com endereço do beneficiário |
| "Pool does not have sufficient XRP" | Pool muito baixo | Admin deve adicionar mais XRP |
| "Currency not issued by this hook" | BRL de outro lugar | Use apenas BRL do hook |

---

## Fluxo de Exemplo Completo

### Cenário: Maria compra R$ 10,000 em BRL

```
Pré-condições:
- Pool: 500 XRP (vazio)
- Maria tem trustline com hook para BRL
- Taxa: 150 BRL/XRP

1. Maria paga PIX R$ 10,000 → Admin (off-chain)

2. Admin executa:
   export admin_secret="sEd7...Carlos"
   export hook_account="rHookXYZ"
   export xrp_amount="67000000"     # 67 XRP ≈ 10,000 BRL
   export beneficiary_account="rMaria"
   node scripts/admin-mint.js

3. Hook processa:
   ✓ Valida que é admin
   ✓ Adiciona 67 XRP ao pool (500 + 67 = 567)
   ✓ Calcula BRL: 67 × 150 × (2/3) = 6700 BRL (aprox)
   ✓ Envia 6700 BRL → Maria
   ✓ Pool agora: 567 XRP, 6700 BRL emitido

4. Maria recebe 6700 BRL na wallet

5. Dias depois, Maria quer resgatar R$ 5,000:

   a) Maria avisa ao Admin (via app/site)
   b) Admin confirma e pede para Maria enviar BRL
   c) Maria envia 5000 BRL → Admin wallet (trustline transfer)
   d) Admin executa:
      export admin_secret="sEd...Carlos"
      export hook_account="rHookXYZ"
      export brl_amount="5000"
      export beneficiary_account="rMaria"
      node scripts/admin-burn.js

   e) Hook processa:
      ✓ Valida que é admin
      ✓ Queima 5000 BRL
      ✓ Calcula XRP: 5000 / 150 = 33.33 XRP
      ✓ Envia 33.33 XRP → Admin
      ✓ Pool agora: 533.67 XRP, 1700 BRL emitido

   f) Admin paga PIX R$ 5,000 → Maria

6. Final:
   - Maria: 1700 BRL (6700 - 5000) + R$ 5,000 (recebeu PIX)
   - Admin: 33.33 XRP + lucro de operação
   - Pool: Seguro com 533.67 / 1700 = 3.14 = 314% collateral
```

---

## Considerações de Segurança

### Riscos

1. **Administração centralizada**: Admin é único ponto de falha
   - Mitigação: Usar multi-sig para admin

2. **Oracle failure**: Se oráculo fico offline, taxa fica congelada
   - Mitigação: Ter backup de oráculos alternativos

3. **Liquidez**: Se muitos resgatam ao mesmo tempo
   - Mitigação: Admin monitora e adiciona XRP quando necessário

4. **Compliance**: Admin responsável por KYC/AML
   - Mitigação: Implementar verificações before mint

### Garantias

✅ Todo BRL emitido está garantido por XRP (150% minimum)
✅ Smart contract valida collateral automaticamente
✅ Apenas admin pode criar/destruir BRL
✅ Clientes sempre podem transferir entre si
✅ Resgate sempre possível enquanto pool tiver XRP

---

## Referências

- [XRPL Hooks Documentation](https://xrpl-hooks.readme.io/)
- [Trustlines - XRPL Docs](https://xrpl.org/trust-lines-and-issuing.html)
- [Xahau Network](https://xahau.network/)
- [Hooks Builder](https://hooks-testnet-v3.xrpl-labs.com)
