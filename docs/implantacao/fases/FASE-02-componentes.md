# FASE 02 — COMPONENTES COMPARTILHADOS

**Status geral:** `[~]` Parcial  
**Branch:** `main`  
**Último commit relacionado:** `fb0fb425`  
**Estimativa:** 2–3 dias úteis

---

## Objetivo

Padronizar a biblioteca de componentes base: botões, badges, estados de loading/empty. Muitos componentes já existem, mas precisam de padronização (data-testid, variantes consistentes, tipagem alinhada com shared/schema.ts).

---

## O que já existe

- `EmptyState`, `LoadingSkeleton`, `StatusBadge`, `SearchBar`, `FilterChips` em `shells/index.tsx`
- `CartStickyBar`, `CartAddModal`, `TicketsGrid`, `QuickDecisionSection`, `MiniWizard` — já implementados
- `HeroSection`, `SocialProofSection`, e outros componentes home

---

## Checklist da fase

### 02.1 — Componentes de botão padronizados
- [ ] Criar `PrimaryButton` em `client/src/components/ui/` — wrapper Shadcn com data-testid obrigatório
- [ ] Criar `SecondaryButton` — variante outline/ghost com data-testid
- [ ] Documentar variantes: size (sm/md/lg), state (default/loading/disabled)

### 02.2 — StatusBadge formal
- [ ] Verificar se `StatusBadge` existente cobre: PAID, PENDING, CANCELLED, EXPIRED
- [ ] Se necessário, estender variantes com as cores corretas por status

### 02.3 — EmptyState e LoadingSkeleton
- [ ] Confirmar que `EmptyState` recebe: icon, title, description, CTA (opcional)
- [ ] Confirmar que `LoadingSkeleton` tem variante card (para TicketsGrid)
- [ ] Integrar nos locais que fazem loading sem skeleton hoje

### 02.4 — Auditoria de data-testid
- [ ] Confirmar `data-testid` em: todos os botões CTA, todos os inputs de formulário, CartStickyBar, TicketsGrid cards
- [ ] Adicionar onde estiver faltando

### 02.5 — Gate de validação + docs + push
- [ ] Rodar `npm run build` — 0 erros TypeScript
- [ ] Smoke: verificar que componentes base renderizam corretamente
- [ ] Atualizar `01-STATUS-GERAL.md`: Fase 2 → `[x]`
- [ ] Atualizar `02-HANDOFF-ATUAL.md`: próximo passo = Sprint 3 (Catálogo)
- [ ] Commitar com `feat(fase-02): conclui componentes compartilhados padronizados`
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
- `PrimaryButton` e `SecondaryButton` com data-testid existem em `client/src/components/ui/`
- `EmptyState` e `LoadingSkeleton` têm variantes adequadas e estão integrados onde necessário
- `npm run build` passa sem erros
- Commit + push feitos
