---
description: Executar auditoria visual automática (Pente Fino Bot)
---

# 🔍 Pente Fino Bot - Workflow

Este workflow executa uma auditoria visual completa no FinanceHub usando o SwarmPenteFino.

## Pré-requisitos

1. Servidor de desenvolvimento rodando (`npm run dev`)
2. Playwright instalado (`npx playwright install`)

## Execução Rápida

// turbo
```bash
npx playwright test swarm-pente-fino.spec.ts --reporter=line
```

## Execução com UI (visual)

```bash
npx playwright test swarm-pente-fino.spec.ts --ui
```

## Executar apenas Desktop

```bash
npx playwright test swarm-pente-fino.spec.ts -g "Desktop"
```

## Executar apenas Mobile

```bash
npx playwright test swarm-pente-fino.spec.ts -g "Mobile"
```

## O que o bot verifica

| Categoria | Verificações |
|-----------|--------------|
| **Tipografia** | Textos < 12px, variações de fonte |
| **Espaçamento** | Gaps inconsistentes, colisões |
| **Alinhamento** | Mistura de alinhamentos de texto |
| **Cores** | Contraste WCAG (4.5:1) |
| **Responsividade** | Overflow horizontal, elementos cortados |
| **Acessibilidade** | Alt em imagens, labels em botões |
| **Consistência** | Border-radius, alturas de botão |

## Interpretando o Score

| Score | Status | Ação |
|-------|--------|------|
| 90-100 | ✅ Excelente | Manter qualidade |
| 70-89 | 🟡 Bom | Corrigir warnings |
| 50-69 | 🟠 Atenção | Revisar issues |
| 0-49 | 🔴 Crítico | Corrigir imediatamente |

## Arquivos

- `tests/utils/SwarmPenteFino.ts` - Classe do bot
- `tests/swarm-pente-fino.spec.ts` - Testes automatizados
- `tests/evidence/` - Screenshots capturados
