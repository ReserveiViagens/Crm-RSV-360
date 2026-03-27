# FASE 01 — DESIGN SYSTEM + LAYOUT SYSTEM

**Status geral:** `[~]` Parcial  
**Branch:** `main`  
**Último commit relacionado:** `fb0fb425`  
**Estimativa:** 3–4 dias úteis

---

## Objetivo

Criar tokens TypeScript de cor/espaçamento/tipografia e componentes de layout reutilizáveis. Shells de layout já existem — esta fase completa o que falta e formaliza os tokens.

---

## O que já existe

- 5 shells em `client/src/components/shells/index.tsx` (`PublicPageShell`, `CatalogPageShell`, `AdminShell`, `AppMobileShell`, `AuthPageShell`)
- Tokens CSS RSV360 em `client/src/index.css` (variáveis `--rsv-*`)
- `PageHeader`, `SectionHeader`, `MetricCard`, `DataCard`, `StatusBadge`, `EmptyState`, `LoadingSkeleton` já no `shells/index.tsx`

---

## Checklist da fase

### 01.1 — Tokens TypeScript
- [ ] Criar `client/src/tokens/colors.ts` — mapeando cores já usadas como constantes nomeadas
- [ ] Criar `client/src/tokens/spacing.ts` — escala de espaçamento padronizada
- [ ] Criar `client/src/tokens/layout.ts` — larguras de container por família de página
- [ ] Criar `client/src/tokens/typography.ts` — escala de fonte, peso e linha

### 01.2 — Componentes de layout (se não existirem)
- [ ] Verificar se `PageContainer` existe — se não, criar em `client/src/components/layout/`
- [ ] Verificar se `SectionContainer` existe — se não, criar

### 01.3 — Auditoria dos shells existentes
- [ ] Substituir valores hardcoded críticos pelos novos tokens (sem alterar comportamento)
- [ ] Confirmar que shells importam de `client/src/tokens/` onde aplicável

### 01.4 — Gate de validação + docs + push
- [ ] Rodar `npm run build` — 0 erros TypeScript
- [ ] Abrir `/`, `/ingressos`, `/admin/dashboard` — sem quebra visual
- [ ] Atualizar `01-STATUS-GERAL.md`: Fase 1 → `[x]`
- [ ] Atualizar `02-HANDOFF-ATUAL.md`: próximo passo = Sprint 2
- [ ] Atualizar este arquivo com o que foi implementado
- [ ] Commitar com `feat(fase-01): conclui design system e layout tokens`
- [ ] `git push origin main`

---

## Implementado nesta fase

_(preencher ao concluir)_

---

## Pendências

_(preencher ao concluir)_

---

## Bloqueios

_(nenhum identificado)_

---

## Critério de conclusão

A fase só vira `[x]` quando:
- Arquivos `client/src/tokens/colors.ts`, `spacing.ts`, `layout.ts`, `typography.ts` existem
- `/`, `/ingressos` e `/admin/dashboard` renderizam sem quebra visual
- `npm run build` passa sem erros
- Commit + push feitos
