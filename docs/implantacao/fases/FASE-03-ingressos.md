# FASE 03 — CATÁLOGO /INGRESSOS COM CARRINHO

**Status geral:** `[~]` Parcial  
**Branch:** `main`  
**Último commit relacionado:** `fb0fb425`  
**Estimativa:** 2–3 dias úteis (auditoria + gaps)

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
- `analytics.ts` — 19 tipos de eventos (alguns já disparados)

---

## Checklist da fase

### 03.1 — Carrinho
- [x] Criar `cart-store.ts`
- [x] Criar `useTicketsCart.ts` com StorageEvent multi-aba
- [~] Persistência em localStorage (existe, mas precisa de auditoria de reidratação)
- [ ] Confirmar sincronização storage ↔ estado React após refresh
- [ ] Padronizar identificador em `ticketId` (verificar se há mix com `id`)

### 03.2 — Grid e cards
- [x] Criar `TicketsGrid.tsx`
- [x] Preservar grid (nunca lista)
- [x] Preservar altura dos cards (stepper não muda altura)
- [x] Exibir CTA com `qty=0`
- [x] Exibir stepper com `qty>0`
- [ ] Confirmar LoadingSkeleton no estado de carregamento
- [ ] Confirmar EmptyState quando filtro retorna vazio

### 03.3 — CartStickyBar
- [x] Criar `CartStickyBar.tsx` (bottom:0, z-200)
- [x] Exibir quantidade e total
- [~] CTA de checkout (verificar que navega para `/ingressos/checkout`)
- [ ] Testar comportamento em mobile (safe-area-inset)

### 03.4 — Analytics
- [x] `page_view` / `tickets_page_view`
- [x] `add_to_cart` / `ticket_add_to_cart`
- [x] `remove_from_cart` / `ticket_remove_from_cart`
- [~] `filter_change` (verificar se está disparando)
- [ ] `checkout_start` / `tickets_checkout_start` ao clicar CartStickyBar

### 03.5 — Gate de validação + docs + push
- [ ] Build + typecheck OK
- [ ] Smoke: `/ingressos` → add ingresso → ver stepper → ver CartStickyBar → clicar checkout
- [ ] Confirmar que refresh da página mantém o carrinho
- [ ] Atualizar `01-STATUS-GERAL.md`: Fase 3 → `[x]`
- [ ] Atualizar `02-HANDOFF-ATUAL.md`
- [ ] Commitar com `feat(fase-03): conclui catálogo /ingressos e carrinho robusto`
- [ ] `git push origin main`

---

## Implementado nesta fase

_(preencher ao concluir)_

---

## Pendências

_(preencher ao concluir)_

---

## Critério de conclusão

A fase só vira `[x]` quando:
- Carrinho persiste após refresh da página
- Totais corretos no CartStickyBar
- CTA de checkout funciona e dispara analytics `checkout_start`
- Smoke test de `/ingressos` passar completamente
- Commit + push feitos
