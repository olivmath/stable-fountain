# 🔬 02-research/ - Pesquisa de Mercado

Documentação de pesquisa com clientes reais, descoberta de requisitos, análise de necessidades de mercado.

---

## 📚 Documentos

### 👥 [sonica-responses.md](./sonica-responses.md) - RESPOSTAS DO CLIENTE

Respostas completas de **Sônica** ao formulário de discovery.

**Cliente:**
- Tokenizadora de ativos reais (imobiliário, ESG, fundos)
- 10 clientes ativos em produção
- Casos de uso: Captação via CVM88, investidores varejo

**Insights Principais:**
- Tokens separados por cliente = escolha de negócio (não regulatória)
- Dores atuais: Custos altos, compliance complexa, lentidão
- Solução esperada: On-ramp PIX + mint instantâneo + off-ramp automático
- Urgência: **Must-have**, prazo 1-3 meses

**Use este documento para:**
- Entender requisitos reais do mercado
- Validar decisões de arquitetura
- Priorizar features para MVP

---

### ❓ [follow-up-questions.md](./follow-up-questions.md)

Perguntas adicionais que surgiram após analisar respostas de Sônica.

**Tópicos:**
- Realmente precisa de tokens separados? (confirmou: sim)
- Como funciona rentabilização durante captação?
- Modelo de negócio: Sônica vs plataforma

**Use para:** Próximas entrevistas / validações

---

### 📋 [discovery-questionnaire.md](./discovery-questionnaire.md)

Formulário de discovery estruturado usado com Sônica.

**Seções:**
1. Contexto do negócio (ativos, clientes, casos de uso)
2. Origem da ideia e problema
3. Solução imaginada
4. Requisitos regulatórios
5. Modelo de negócio
6. Casos de uso concretos

**Use para:**
- Replicar com próximos clientes
- Entender perguntas que fizemos
- Adaptar para validar novas hipóteses

---

## 🗂️ Estrutura

```
02-research/
├── README.md (este arquivo)
├── discovery-questionnaire.md (formulário usado)
├── sonica-responses.md (respostas reais)
├── follow-up-questions.md (perguntas adicionais)
└── archived/
    ├── discovery-questionnaire.csv (export do formulário)
    └── sonica-responses.csv (export das respostas)
```

---

## 📊 Insights Principais

### Sobre o Cliente (Sônica)

- **Urgência:** Must-have (não nice-to-have)
- **Timeframe:** 1-3 meses para MVP
- **Comprometimento:** Alto (cliente comprometida a testar)
- **Volume:** ~4M/mês, 50 transações/mês inicialmente
- **Potencial:** >50M no primeiro ano

### Sobre o Problema

**Dores atuais:**
1. ✅ Custos altos com stablecoins existentes
2. ✅ Compliance complexa (burocracia de limites)
3. ✅ Lentidão de processamento

**Custos em números:**
- Tempo: Delays em KYC, aprovação de limites
- Dinheiro: BRL parado durante captação (até 180 dias) poderia estar rendendo

### Sobre a Solução

**Necessidade:** On-ramp PIX + Mint + Off-ramp

**Fluxo esperado:**
```
ON-RAMP:
1. Investidor faz PIX para Sônica
2. Sônica identifica PIX
3. Sônica compra stable BRL
4. Sônica executa mint
5. Investidor recebe token

OFF-RAMP:
1. Investidor solicita resgate
2. Token transferido para Sônica
3. Sônica queima e vende stable
4. Entrega via PIX
```

**Tempo esperado:** Instantâneo (ambos)

### Sobre Requisitos Específicos

- **Tokens separados:** Sim (APBRL, XYZBRL) = cada cliente seu token
- **Colateralização:** 1:1 (não over-collateralized)
- **KYC:** Sônica faz (usando Avenia - 3 tiers)
- **Emissor:** Cliente final (não Sônica diretamente)
- **Uso livre:** Transferir, pagar, DeFi, pagamentos

---

## 🎯 Como Usar Esta Pasta

### Para Entender o Cliente
1. Leia [sonica-responses.md](./sonica-responses.md) - Respostas reais
2. Veja [discovery-questionnaire.md](./discovery-questionnaire.md) - Perguntas feitas
3. Consulte [follow-up-questions.md](./follow-up-questions.md) - Próximas validações

### Para Validar Arquitetura
- Use respostas em sonica-responses.md como "source of truth"
- Confira que cada feature implementada resolve alguma dor
- Priorize: Tokens separados > On-ramp PIX > Off-ramp

### Para Onboarding Próximos Clientes
1. Use [discovery-questionnaire.md](./discovery-questionnaire.md) como template
2. Adapte perguntas baseado em learnings de Sônica
3. Compare respostas com Sônica para validar padrões

---

## 📈 Próximas Pesquisas

### Cliente 2: FIDC Tokenizado
- Entrevista agendada
- Foco: Captação de 5-10M com investidores varejo
- Pergunte sobre: Modelos de fee, compliance, rentabilização

### Expansão de Clientes
- Planejar outreach para 5-10 tokenizadores
- Validar se requisitos Sônica são universais
- Identificar diferenças por segmento

### Validação de Monetização
- Sônica respondeu "Não definido"
- Próxima pesquisa: Que modelo de taxa aceitaria?

---

## 🔗 Links Relacionados

### Documentação Relacionada
- **[../01-evolution/project-journey.md](../01-evolution/project-journey.md)** - Contexto de como fizemos discovery
- **[../01-evolution/phase-3-final-architecture.md](../01-evolution/phase-3-final-architecture.md)** - Arquitetura resultado da pesquisa
- **[../../CLAUDE.md](../../CLAUDE.md)** - Instruções para desenvolvimento

### Documentação Cliente
- [sonica-responses.md](./sonica-responses.md) - Respostas completas
- [follow-up-questions.md](./follow-up-questions.md) - Perguntas de follow-up

---

## 📝 Metodologia

### Como Fizemos Discovery

1. **Preparação:** Criamos formulário estruturado com 78 perguntas
2. **Contato:** Abordamos Sônica (referência do mercado)
3. **Entrevista:** ~1 hora respondendo questionnaire
4. **Análise:** Extraimos insights e validamos hipóteses
5. **Iteração:** Definimos perguntas de follow-up

### Aprendizado

Este processo revelou que nosso problema original (pool global descentralizado) era completamente diferente do que cliente realmente precisava (múltiplos tokens, on-ramp PIX, colateralização 1:1).

---

## 📞 Contato

**Representante Sônica (para follow-ups):**
- Nome: [TBD]
- Email: [TBD]
- Status de comprometimento: Alto

**Próxima call:** [TBD] para validar arquitetura proposta

---

**Última atualização:** Novembro 2024
**Mantido por:** Time de Desenvolvimento
**Próxima revisão:** Janeiro 2025 (após feedback de MVP)
