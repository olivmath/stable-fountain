# ⚠️ DEPRECATED - Conteúdo Obsoleto

Este diretório contém documentação e referências de **fases anteriores** do projeto que **não devem mais ser usadas em código novo**.

---

## ❌ Não Use Este Conteúdo!

**Todos os documentos neste diretório são obsoletos.** Referem-se a arquitetura descontinuada (Hooks + Xahau), modelos deprecated, e abordagens que não são mais válidas.

**Se encontrou referência a conteúdo deste diretório em código novo:**
- Marque como bug/technical debt
- Remova referências
- Use documentação atual em `/docs/01-evolution/`, `/docs/03-architecture/`, etc

---

## 📚 Conteúdo

### 📋 [old-claude-instructions.md](./old-claude-instructions.md)

Versão **anterior** do [CLAUDE.md](../../CLAUDE.md) (raiz do projeto).

**Por que é obsoleto:**
- Refere-se a Hooks + Xahau (Fase 1)
- Descreve arquitetura com pool global 150%
- Menciona singlecoin RLBRL
- Não reflete arquitetura atual (Issued Currencies)

**Use em vez disso:** [CLAUDE.md](../../CLAUDE.md) na raiz (versão 3.0)

---

### 📖 [old-peggy-readme.md](./old-peggy-readme.md)

README antigo do projeto focado em Peggy Hook.

**Por que é obsoleto:**
- Peggy = nome da Fase 1 (Hooks)
- Descreve sobre Xahau Network (descontinuado)
- Referências a scripts `admin-mint.js`, `admin-burn.js` (não mais usados)
- Modelo de pool global não é mais usado

**Use em vez disso:**
- Novo README (TBD na raiz)
- [project-journey.md](../01-evolution/project-journey.md) para contexto histórico

---

## 📦 O Que Foi Descontinuado

### Tecnologia
- ❌ XRPL Hooks (Smart Contracts em C/WASM)
- ❌ Xahau Network (rede experimental)
- ❌ Pool global com 150% colateralização

### Código
- ❌ `/blockchain/src/peggy.c` - Hook smart contract
- ❌ `/blockchain/src/include/` - Headers XRPL Hooks
- ❌ Scripts: `admin-mint.js`, `admin-burn.js`, etc

### Configuração
- ❌ `COLLATERAL_RATIO_MIN` (150%)
- ❌ `COLLATERAL_RATIO_EMERGENCY` (120%)
- ❌ Variáveis de Xahau/Hooks

### Entidades
- ❌ Campo `currency: 'RLBRL'` (hardcoded)
- ❌ Campo `totalIssuedRlbrl` (nomeado para moeda específica)

---

## ✅ O Que Usar Agora

### Tecnologia Atual
- ✅ XRPL Issued Currencies (nativo)
- ✅ XRPL Mainnet (produção)
- ✅ Colateralização 1:1 (por cliente)

### Arquitetura Atual
- ✅ Backend NestJS + TypeScript
- ✅ Integração Asas (PIX)
- ✅ Integração Binance (conversões XRP)
- ✅ Issued Currencies (tokens únicos por cliente)

### Documentação Atual
- ✅ [CLAUDE.md](../../CLAUDE.md) - Instruções atualizadas
- ✅ [project-journey.md](../01-evolution/project-journey.md) - História completa
- ✅ [phase-3-final-architecture.md](../01-evolution/phase-3-final-architecture.md) - Specs técnicas
- ✅ [01-evolution/README.md](../01-evolution/README.md) - Visão geral de fases

---

## 🔄 Transição Entre Versões

### De Fase 1 (Hooks) para Fase 3 (Issued Currencies)

**Se você precisa entender a transição:**
1. Leia [project-journey.md](../01-evolution/project-journey.md) para contexto
2. Veja [phase-3-final-architecture.md](../01-evolution/phase-3-final-architecture.md) para specs atuais
3. Consulte [CLAUDE.md](../../CLAUDE.md) para instruções de desenvolvimento

**Se você encontrou código Hooks antigo:**
1. Mova para branch `deprecated-hooks` ou tag `phase-1-final`
2. Remova de codebase principal
3. Documente por que foi removido

---

## 📚 Como Acessar Histórico

### Arquivo vs Ativo

**Este diretório = Arquivo:**
- Conteúdo histórico (informativo apenas)
- Não usado em desenvolvimento
- Mantido para referência

**Documentação Ativa:**
- [/docs/01-evolution/](../01-evolution/) - Fases do projeto
- [/docs/03-architecture/](../03-architecture/) - Arquitetura atual
- [/CLAUDE.md](../../CLAUDE.md) - Instruções para desenvolvimento

---

## 🔍 Se Você Quer Aprender Sobre Fases Anteriores

**Recomendação:** Não estude Hooks em profundidade (mais é perder tempo).

**Se realmente quer contexto histórico:**
1. Leia [project-journey.md](../01-evolution/project-journey.md) para resumo
2. Veja seção "Fase 1" para por que foi descontinuado
3. Entenda as lições aprendidas

**Então:** Foque em Issued Currencies (arquitetura atual)

---

## ⚠️ Aviso Legal

**Qualquer referência a este diretório em código novo será considerada:**
- Bug de documentação
- Technical debt
- Regressão arquitetural

**Se encontrar na code review:**
1. Marque como issue
2. Sugira alteração para docs atuais
3. Remova antes de merge

---

## 📝 Manutenção

Este diretório é **read-only**. Não adicione novos documentos aqui.

Se tem conteúdo deprecated novo:
1. Documente por que é deprecated
2. Coloque em `/docs/DEPRECATED/`
3. Atualize este README
4. Remova do código ativo

---

**Última atualização:** Novembro 2024
**Status:** Read-only (conteúdo histórico)
**Próxima revisão:** Junho 2025 (depois de 6 meses de v3.0)

---

> **Lição aprendida:** Documentação obsoleta é mais perigosa que falta de documentação.
>
> Mantenha-a organizada, claramente marcada, e refira para o conteúdo ativo atual.
