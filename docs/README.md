# 📚 Documentação - Stable Fountain

Bem-vindo à documentação do **Stable Fountain**, um serviço B2B SaaS de emissão de stablecoins BRL customizadas na XRP Ledger.

Este diretório contém toda a documentação do projeto, organizada por tema e fase de desenvolvimento.

---

## 🗺️ Estrutura da Documentação

### 📖 [01-evolution/](./01-evolution/) - Evolução do Projeto

Documentação histórica das **três fases** do projeto, desde a exploração de Hooks/Xahau até a arquitetura final com Issued Currencies.

**Comece por:**
- **[project-journey.md](./01-evolution/project-journey.md)** ⭐ - **LEIA PRIMEIRO!**
  - História completa: por que começamos com Hooks, o que aprendemos com Sônica, por que pivotamos
  - Entenda o contexto antes de mergulhar em código

**Documentação técnica histórica:**
- [phase-3-final-architecture.md](./01-evolution/phase-3-final-architecture.md) - Especificação técnica completa (ex-NEW_VERSION.md)

---

### 🔬 [02-research/](./02-research/) - Pesquisa de Mercado

Resultados de pesquisa com clientes reais, descoberta de requisitos, análise de mercado.

**Documentos principais:**
- **[discovery-questionnaire.md](./02-research/discovery-questionnaire.md)** - Formulário estruturado para discovery
- **[sonica-responses.md](./02-research/sonica-responses.md)** - Respostas reais de Sônica (cliente principal)
- **[follow-up-questions.md](./02-research/follow-up-questions.md)** - Perguntas adicionais a validar

**Arquivo:**
- [archived/](./02-research/archived/) - CSVs e materiais antigos

---

### 🏗️ [03-architecture/](./03-architecture/) - Arquitetura Técnica

Especificações técnicas da arquitetura atual, modelos de negócio, integrações.

**Em construção.** Será organizado em:
- `current-system-overview.md` - Visão geral da arquitetura
- `issued-currencies-guide.md` - Guia técnico de Issued Currencies
- `b2b-saas-model.md` - Modelo de negócio B2B SaaS
- `pix-integration.md` - Integração com PIX (Asas)
- `trust-lines-clawback.md` - Trust Lines e Clawback
- `security-compliance.md` - Segurança e compliance

---

### ⚙️ [04-backend/](./04-backend/) - Documentação Backend

Guias técnicos para desenvolvimento, setup e operação do backend NestJS.

**Documentos:**
- **[README.md](./04-backend/README.md)** - Visão geral do backend e estrutura
- **[setup-guide.md](./04-backend/setup-guide.md)** - Como configurar ambiente Supabase
- **[logging-guide.md](./04-backend/logging-guide.md)** - Sistema de logging e exemplos
- **[scripts-organization.md](./04-backend/scripts-organization.md)** - Organização de scripts e utilities

---

### 📖 [05-references/](./05-references/) - Referências Externas

Links curados de documentação oficial XRPL, whitepapers, glossário.

**Em construção.** Será organizado em:
- `xrpl-resources.md` - Documentação XRPL curada
- `glossary.md` - Glossário de termos técnicos
- `archived-research/` - Whitepapers e materiais históricos (Xahau, etc)

---

### 📦 [DEPRECATED/](./DEPRECATED/) - Conteúdo Obsoleto

Código antigo, instruções obsoletas, documentação de fases passadas.

**Não use estes documentos em código novo!** São referência histórica apenas.

---

## 🚀 Início Rápido

### 🆕 Novo no Projeto?

**Leia nesta ordem:**
1. **[project-journey.md](./01-evolution/project-journey.md)** - Entenda a história
2. **[/CLAUDE.md](../CLAUDE.md)** - Instruções para Claude Code
3. **[phase-3-final-architecture.md](./01-evolution/phase-3-final-architecture.md)** - Especificação técnica

### 💻 Desenvolvedor Backend?

Acesse direto:
1. **[04-backend/README.md](./04-backend/README.md)** - Setup do projeto
2. **[04-backend/setup-guide.md](./04-backend/setup-guide.md)** - Supabase e DB
3. **[04-backend/logging-guide.md](./04-backend/logging-guide.md)** - Padrões de logging

### 🏗️ Entender a Arquitetura?

Comece por:
1. **[CLAUDE.md](../CLAUDE.md)** - Visão geral (raiz do projeto)
2. **[project-journey.md](./01-evolution/project-journey.md)** - Contexto
3. **[phase-3-final-architecture.md](./01-evolution/phase-3-final-architecture.md)** - Specs técnicas

### 📊 Análise da Pesquisa com Cliente?

Acesse:
1. **[sonica-responses.md](./02-research/sonica-responses.md)** - Respostas reais
2. **[discovery-questionnaire.md](./02-research/discovery-questionnaire.md)** - Perguntas usadas
3. **[follow-up-questions.md](./02-research/follow-up-questions.md)** - Próximas perguntas

---

## 📋 Documentos Críticos

### No Projeto (Raiz)

- **[CLAUDE.md](../CLAUDE.md)** - Instruções para Claude Code (ATUALIZADO)
- **[NEW_VERSION.md](../NEW_VERSION.md)** - Copiado para [01-evolution/phase-3-final-architecture.md](./01-evolution/phase-3-final-architecture.md)

### Neste Diretório

- **[project-journey.md](./01-evolution/project-journey.md)** ⭐ - **ESSENCIAL** - Historia completa do projeto
- **[phase-3-final-architecture.md](./01-evolution/phase-3-final-architecture.md)** - Especificação técnica atual
- **[sonica-responses.md](./02-research/sonica-responses.md)** - Requisitos do cliente real

---

## 🔗 Links Importantes

### XRPL Oficial (Use Sempre)

- **Issued Currencies:** https://xrpl.org/docs/concepts/tokens/fungible-tokens/
- **Stablecoins:** https://xrpl.org/docs/concepts/tokens/fungible-tokens/stablecoins/
- **Clawback:** https://xrpl.org/docs/references/protocol/transactions/types/clawback
- **Trust Lines:** https://xrpl.org/docs/concepts/tokens/fungible-tokens/authorized-trust-lines
- **Ripple USD (RLUSD):** https://ripple.com/solutions/stablecoin/

### Documentação Interna

- **Instruções Claude:** [/CLAUDE.md](../CLAUDE.md)
- **Backend Setup:** [04-backend/setup-guide.md](./04-backend/setup-guide.md)
- **Logging Patterns:** [04-backend/logging-guide.md](./04-backend/logging-guide.md)

---

## 🏢 Sobre Stable Fountain

**Modelo:** B2B SaaS para emissão de stablecoins BRL customizadas

**Tecnologia:**
- Backend: NestJS + TypeScript
- Blockchain: XRPL Issued Currencies
- Integrações: Asas (PIX), Binance (conversões XRP)

**Cliente Principal:** Sônica (Tokenizadora de Ativos Reais)

**Status:** MVP em desenvolvimento (3 meses para lançamento)

**Versão Atual:** 3.0 (Issued Currencies) - Novembro 2024

---

## 📝 Como Contribuir para Documentação

1. **Editar documentos existentes:**
   - Mantenha estrutura e hierarquia
   - Atualize links internos se mover arquivos
   - Use formatação markdown consistente

2. **Adicionar novos documentos:**
   - Use nome descritivo (sem timestamps)
   - Comece com header `#` único
   - Adicione link em `README.md` correspondente
   - Siga convenção de nomeação (kebab-case)

3. **Arquivar conteúdo antigo:**
   - Nunca delete, mova para `DEPRECATED/`
   - Deixe nota explicando por que é deprecated
   - Mantenha link histórico se relevante

---

## 🎯 Roadmap de Documentação

### ✅ Completo
- [x] project-journey.md (história completa)
- [x] CLAUDE.md (reescrito para v3.0)
- [x] phase-3-final-architecture.md (especificação)
- [x] Reorganização de research documents
- [x] Movimentação de backend docs

### 🔄 Em Progresso
- [ ] READMEs dos subdiretórios
- [ ] Documentação de Issued Currencies (guia técnico)
- [ ] Documentação de B2B SaaS (modelo)
- [ ] Documentação de integrações (Asas, Binance)

### ⏳ A Fazer
- [ ] Glossário técnico completo
- [ ] XRPL Resources curados
- [ ] API Documentation (OpenAPI)
- [ ] SDK Documentation (TypeScript, Python)
- [ ] Troubleshooting Guide

---

## 📞 Dúvidas?

- **Sobre a jornada do projeto?** → Leia [project-journey.md](./01-evolution/project-journey.md)
- **Sobre como desenvolver?** → Leia [CLAUDE.md](../CLAUDE.md)
- **Sobre setup técnico?** → Vá para [04-backend/setup-guide.md](./04-backend/setup-guide.md)
- **Sobre requisitos do cliente?** → Veja [sonica-responses.md](./02-research/sonica-responses.md)
- **Sobre arquitetura?** → Consulte [phase-3-final-architecture.md](./01-evolution/phase-3-final-architecture.md)

---

**Última atualização:** Novembro 2024
**Mantido por:** Time de Desenvolvimento
**Versão:** 1.0
