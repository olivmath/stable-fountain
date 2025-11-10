# 📖 01-evolution/ - Evolução do Projeto

Documentação das **três fases** do projeto Stable Fountain, desde a exploração inicial com Hooks/Xahau até a arquitetura final com Issued Currencies XRPL.

---

## 📚 Documentos

### ⭐ [project-journey.md](./project-journey.md) - COMECE AQUI

A história completa do projeto em uma único documento.

**Conteúdo:**
- Fase 1: Por que começamos com Hooks + Xahau
- Fase 2: O que aprendemos com Sônica (cliente real)
- Fase 3: Por que pivotamos para Issued Currencies
- Lições aprendidas em cada fase
- Timeline e próximos passos

**Leia este documento primeiro para entender o contexto!**

---

### 📋 [phase-3-final-architecture.md](./phase-3-final-architecture.md)

Especificação técnica completa da arquitetura atual (Issued Currencies).

**Conteúdo:**
- Visão executiva e sugestões de monetização
- Fluxo detalhado de Mint (PIX e On-Chain)
- Fluxo detalhado de Burn/Redemption
- Gerenciamento de saldos e colateral na XRPL
- Pontos de atenção (segurança, compliance, operacional)
- Referências técnicas

**Use este documento para implementação técnica.**

---

## 🗂️ Estrutura

```
01-evolution/
├── README.md (este arquivo)
├── project-journey.md ⭐ (leia primeiro!)
├── phase-3-final-architecture.md (especificação técnica)
├── phase-1-hooks-xahau.md (TBD - histórico)
└── phase-2-client-discovery.md (TBD - descoberta com cliente)
```

---

## 🔗 Links Úteis

### Nesta Pasta
- **project-journey.md** - História completa ⭐
- **phase-3-final-architecture.md** - Specs técnicas

### Na Raiz do Projeto
- **[CLAUDE.md](../../CLAUDE.md)** - Instruções para Claude Code
- **[NEW_VERSION.md](../../NEW_VERSION.md)** - Alias para phase-3-final-architecture.md

### Documentação Relacionada
- **[../02-research/](../02-research/)** - Pesquisa com cliente (Sônica)
- **[../03-architecture/](../03-architecture/)** - Guias técnicos de arquitetura
- **[../04-backend/](../04-backend/)** - Documentação do backend

---

## 🎯 Como Usar Esta Pasta

### Para Novos Membros do Time
1. Leia [project-journey.md](./project-journey.md) para entender contexto
2. Consulte [CLAUDE.md](../../CLAUDE.md) para instruções de desenvolvimento
3. Reference [phase-3-final-architecture.md](./phase-3-final-architecture.md) durante implementação

### Para Stakeholders/Gestão
1. Leia resumo executivo em [phase-3-final-architecture.md](./phase-3-final-architecture.md)
2. Veja timeline e próximos passos em [project-journey.md](./project-journey.md)

### Para Developers
1. Skim [project-journey.md](./project-journey.md) para contexto
2. Use [phase-3-final-architecture.md](./phase-3-final-architecture.md) como referência técnica
3. Implemente baseado em `/docs/03-architecture/` e `/docs/04-backend/`

---

## 📊 Resumo das Fases

### Fase 1: Hooks + Xahau (October - November 2024)
**Status:** ❌ Deprecated

- Tecnologia: XRPL Hooks (Smart Contracts em C/WASM)
- Rede: Xahau (experimental)
- Modelo: Pool global de XRP com 150% colateralização
- Resultado: Over-engineered, maturidade baixa
- Lição: Validar com clientes antes de arquitetar

### Fase 2: Client Discovery (November 2024)
**Status:** ✅ Completo

- Cliente: Sônica (Tokenizadora de Ativos Reais)
- Método: Questionário discovery + entrevistas
- Descoberta: Requisitos bem diferentes do imaginado
- Insight: Tokens separados por cliente, colateralização 1:1, PIX essencial
- Resultado: Decisão de pivotar

### Fase 3: Issued Currencies (Current)
**Status:** 🔄 Em Desenvolvimento

- Tecnologia: XRPL Issued Currencies (nativo)
- Rede: XRPL Mainnet (produção)
- Modelo: B2B SaaS com tokens customizados por cliente
- Integrações: Asas (PIX), Binance (XRP), XRPL (blockchain)
- Timeline: MVP em 2-3 meses
- Resultado esperado: Lançamento com Sônica

---

## 🔄 Migrações Entre Fases

### De Fase 1 para Fase 3

**O que muda:**
- ❌ Deletar código Hooks (C)
- ❌ Deletar smart contract logic
- ✅ Usar XRPL nativo (Issued Currencies)
- ✅ Usar Asas para PIX
- ✅ Usar Binance para conversões
- ✅ Backend orquestra tudo (NestJS)

**Código a deletar:**
- `/blockchain/` (Hooks implementação)
- Referências a `COLLATERAL_RATIO_MIN/EMERGENCY`
- Campo `totalIssuedRlbrl` (usar `totalIssuedTokens`)

**Código a adicionar:**
- Módulos: xrpl/, asas/, binance/
- Entities: campos para `currencyCode`, `issuerWallet`, etc
- Queues: Binance conversion, Mint, Burn

---

## 📈 Próximas Atualizações

Este documento será atualizado com:
- [ ] phase-1-hooks-xahau.md (documentação histórica detalhada)
- [ ] phase-2-client-discovery.md (análise completa de discovery)
- [ ] Links para código de cada fase (branches/tags)
- [ ] Lições aprendidas elaboradas

---

**Última atualização:** Novembro 2024
**Mantido por:** Time de Desenvolvimento
