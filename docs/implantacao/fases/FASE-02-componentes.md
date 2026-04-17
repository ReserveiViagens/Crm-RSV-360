# FASE 02 — COMPONENTES COMPARTILHADOS

**Status geral:** `[x]` Concluído  
**Branch:** `main`  
**Último commit relacionado:** Sprint 2 (Task #11)  
**Estimativa:** 2–3 dias úteis

---

## Objetivo

Padronizar a biblioteca de componentes base: botões, badges, estados de loading/empty.

---

## O que já existe

- `EmptyState`, `LoadingSkeleton`, `StatusBadge`, `SearchBar`, `FilterChips` em `shells/index.tsx`
- `CartStickyBar`, `CartAddModal`, `TicketsGrid`, `QuickDecisionSection`, `MiniWizard` — já implementados
- `HeroSection`, `SocialProofSection`, e outros componentes home

---

## Checklist da fase

### 02.1 — Componentes de botão padronizados
- [x] Criar `PrimaryButton` em `client/src/components/ui/primary-button.tsx` — size (sm/md/lg), loading state, disabled, data-testid
- [x] Criar `SecondaryButton` em `client/src/components/ui/secondary-button.tsx` — variante outline com tamanhos e loading

### 02.2 — StatusBadge formal
- [x] `StatusBadge` estendido para cobrir: PAID, APPROVED, PENDING, CANCELLED, EXPIRED, FAILED (+ semânticos existentes)
- [x] `data-testid={status-badge-${status}}` adicionado

### 02.3 — EmptyState e LoadingSkeleton
- [x] `EmptyState` confirmado: recebe icon, title, description, action (CTA opcional)
- [x] `LoadingSkeleton` ganhou variante `card` (grade de cards com shimmer) em `shells/index.tsx`
- [x] `LoadingSkeleton variant="card"` integrado em `/ingressos` (skeleton-loading)

### 02.4 — Auditoria de data-testid
- [x] `data-testid` confirmados em: `cart-sticky`, `button-go-checkout`, `card-ticket-*`, `button-buy-*`, `stepper-*`, todos os botões CTA do TicketsGrid
- [x] `StatusBadge` ganhou `data-testid={status-badge-${status}}`

### 02.5 — Gate de validação + docs + push
- [x] `npx tsc --noEmit` — 0 erros TypeScript
- [x] Atualizar `01-STATUS-GERAL.md`: Fase 2 → `[x]`
- [x] Atualizar `02-HANDOFF-ATUAL.md`: próximo passo = Sprint 3 (Catálogo)
- [x] Commit + push feitos

---

## Implementado nesta fase

- `client/src/components/ui/primary-button.tsx` — PrimaryButton (sm/md/lg, loading, disabled, data-testid)
- `client/src/components/ui/secondary-button.tsx` — SecondaryButton (sm/md/lg, loading, disabled, data-testid)
- `client/src/components/shells/index.tsx` — LoadingSkeleton `variant="card"` + StatusBadge estendido (PAID/APPROVED/PENDING/CANCELLED/EXPIRED/FAILED)
- `client/src/components/CartStickyBar.tsx` — safe-area-inset + trackEvent("tickets_checkout_start")
- `client/src/pages/ingressos.tsx` — skeleton loading → LoadingSkeleton variant="card"

---

## Pendências

_(nenhuma)_

---

## Bloqueios

_(nenhum)_

---

## Critério de conclusão

✅ `PrimaryButton` e `SecondaryButton` com data-testid existem em `client/src/components/ui/`  
✅ `EmptyState` e `LoadingSkeleton` têm variantes adequadas e estão integrados  
✅ `npx tsc --noEmit` passa sem erros  
✅ Commit + push feitos
