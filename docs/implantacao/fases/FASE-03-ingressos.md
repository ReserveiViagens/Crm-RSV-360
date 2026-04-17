# FASE 03 — CATÁLOGO /INGRESSOS COM CARRINHO

**Status geral:** `[x]` Concluído  
**Branch:** `main`  
**Último commit relacionado:** Sprint 2+3 (Task #11)  
**Estimativa:** 2–3 dias úteis

---

## Objetivo

Garantir que o fluxo `/ingressos` está completo e robusto: grid, stepper, carrinho persistente em localStorage, analytics mínimos.

---

## O que já existe

- Página `/ingressos` com 5 parques, stepper, filtros de aba, Combo IA (hardcoded 15%), badges, timer
- `cart-store.ts` — carrinho em localStorage com addToCart/removeFromCart/updateQty
- `CartStickyBar` — barra bottom:0 com total e CTA para checkout
- `TicketsGrid` — grid componentizado com stepper e badges
- `QuickDecisionSection` — 4 atalhos de filtro
- `MiniWizard` — modal de recomendação 3 passos
- `analytics.ts` — 19 tipos de eventos

---

## Checklist da fase

### 03.1 — Carrinho
- [x] `cart-store.ts` — implementado
- [x] `useTicketsCart.ts` — StorageEvent multi-aba + reidratação no mount
- [x] Persistência em localStorage confirmada
- [x] Sincronização storage ↔ estado React após refresh (useEffect no mount + StorageEvent)
- [x] `ticketId` padronizado (não há mix com `id` — verificado)

### 03.2 — Grid e cards
- [x] `TicketsGrid.tsx` — grid, nunca lista
- [x] Altura dos cards estável (stepper não muda altura — layout flex column + auto)
- [x] CTA com `qty=0` → botão "Comprar Agora"
- [x] Stepper com `qty>0` — minus/plus/delete
- [x] `LoadingSkeleton variant="card"` no estado de carregamento (`skeleton-loading`)
- [x] `SearchEmptyState` quando filtro retorna vazio

### 03.3 — CartStickyBar
- [x] `CartStickyBar.tsx` (bottom:0, z-200)
- [x] Quantidade e total exibidos
- [x] CTA navega para `/ingressos/checkout`
- [x] `safe-area-inset-bottom` adicionado para iOS (paddingBottom com env())
- [x] `trackEvent("tickets_checkout_start")` disparado no clique do CTA

### 03.4 — Analytics
- [x] `tickets_page_view` — disparado no load
- [x] `ticket_add_to_cart` — disparado no handleBuy
- [x] `ticket_remove_from_cart` — disparado no handleRemove
- [x] `ticket_filter_change` — disparado em handleQuickPick
- [x] `tickets_checkout_start` — disparado no CartStickyBar CTA e no sidebar checkout

### 03.5 — Gate de validação + docs + push
- [x] TypeScript 0 erros (`npx tsc --noEmit`)
- [x] Smoke: `/ingressos` → add ingresso → ver stepper → ver CartStickyBar → clicar checkout
- [x] Refresh mantém carrinho (localStorage + reidratação no mount)
- [x] `01-STATUS-GERAL.md` atualizado: Fase 3 → `[x]`
- [x] `02-HANDOFF-ATUAL.md` atualizado
- [x] Commit + push feitos

---

## Implementado nesta fase

- `CartStickyBar.tsx` — safe-area-inset + analytics checkout_start
- `ingressos.tsx` — LoadingSkeleton variant="card" substituindo skeleton inline
- `shells/index.tsx` — LoadingSkeleton variant="card" adicionado

---

## Pendências

_(nenhuma — Sprint 4 = Combo IA backend)_

---

## Critério de conclusão

✅ Carrinho persiste após refresh  
✅ Totais corretos no CartStickyBar  
✅ CTA de checkout funciona + dispara `tickets_checkout_start`  
✅ Smoke test do fluxo completo  
✅ Commit + push feitos
