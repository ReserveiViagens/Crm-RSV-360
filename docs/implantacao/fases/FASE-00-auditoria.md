# FASE 00 — AUDITORIA + ESTRUTURA-BASE

**Status geral:** `[x]` Concluído — Task #9 (Sprint 0)  
**Branch:** `main`  
**Commits Sprint 0:** `8e3e43c` → `8e927e9` → `2354ff3` (chain completo, ver `git log --oneline`)  
**Concluído em:** 2026-03-27

---

## Objetivo

Levantar o estado real do projeto, congelar os riscos conhecidos e preparar a fundação compartilhada de tipos para que as sprints seguintes não pisem em código existente sem saber.

> Nota: A monorepo refactor (turbo.json, pnpm-workspace.yaml, apps/) NÃO será feita — quebraria o setup Replit. Tipos compartilhados ficam em `shared/schema.ts`.

---

## Checklist da fase

### 00.1 — Inventário de rotas frontend
- [x] Mapear todas as rotas em `client/src/App.tsx` (públicas, auth, admin, organizer, checkout)
- [x] Registrar em `docs/ROUTES_INVENTORY.md` com status (implementado / parcial / stub)

### 00.2 — Inventário de endpoints backend
- [x] Mapear todos os endpoints em `server/routes.ts` e sub-arquivos
- [x] Classificar por status: dados reais / mockado / demo mode / stub
- [x] Registrar em `docs/ROUTES_INVENTORY.md` (seção backend)

### 00.3 — Inventário de estado compartilhado
- [x] Auditar `client/src/lib/cart-store.ts` — interfaces de dados usadas
- [x] Auditar `server/services/payment.service.ts` e `ticket-payment.service.ts`
- [x] Auditar `server/persistence.ts` — estrutura do in-memory store
- [x] Registrar interfaces identificadas em `docs/AUDIT.md`

### 00.4 — Documento de gaps
- [x] Gerar `docs/GAPS.md` com gaps priorizados por impacto no fluxo comprável
- [x] Incluir: funcionalidades faltando, mocks sem fallback, TODOs críticos, tipos não formalizados

### 00.5 — Tipos compartilhados
- [x] Adicionar/formalizar em `shared/schema.ts`:
  - [x] `Product` (schema Zod + tipo infer)
  - [x] `CartItem` (alinhado com cart-store.ts)
  - [x] `OrderCustomer` (nome, email, CPF, telefone)
  - [x] `Order` (id, items, customer, total, status, createdAt)
  - [x] `PaymentMethod` (enum: PIX, CARTAO, DINHEIRO)
  - [x] `OrderStatus` (enum: PENDING, PAID, APPROVED, CANCELLED, EXPIRED, FAILED)
- [x] Confirmar que nenhum tipo existente foi removido

### 00.6 — Gate de validação + docs + push
- [x] Rodar `npm run build` — 0 erros TypeScript
- [x] Criar `docs/AUDIT.md` com resultado do build + inventário
- [x] Atualizar `01-STATUS-GERAL.md`: Fase 0 → `[x]`
- [x] Atualizar `02-HANDOFF-ATUAL.md`: próximo passo = Sprint 1
- [x] Commitar com `feat(fase-00): conclui auditoria, tipos compartilhados e documentação viva`
- [x] Push para GitHub via Contents API (HTTP 200/201 confirmados)

---

## Implementado nesta fase

- `docs/ROUTES_INVENTORY.md` — inventário de 60+ rotas frontend e 80+ endpoints backend (legenda [R]/[D]/[I]/[M])
- `docs/AUDIT.md` — auditoria de implementação por rota/endpoint (status [x]/[~]/[ ] + coluna Dados)
- `docs/GAPS.md` — 15 gaps priorizados (prioridade 1–5, cada um com sprint alvo e arquivo afetado)
- `shared/schema.ts` atualizado:
  - `PaymentMethodSchema`, `OrderStatusSchema` (com APPROVED para compat. com ticket-payment.service.ts)
  - `productSchema`, `cartItemSchema`, `orderCustomerSchema`, `orderSchema` + variantes insert + TypeScript types
- `03-CHANGELOG-IMPLEMENTACAO.md` — entrada Sprint 0 com entregáveis e decisões de design

---

## Pendências

Nenhuma. Todos os critérios de conclusão foram atendidos.

---

## Bloqueios

Nenhum.

---

## Critério de conclusão

✅ `docs/AUDIT.md`, `docs/ROUTES_INVENTORY.md` e `docs/GAPS.md` existem e têm conteúdo real  
✅ `shared/schema.ts` contém `Product`, `CartItem`, `OrderCustomer`, `Order`, `PaymentMethod`, `OrderStatus` como Zod schemas  
✅ `npm run build` passa sem erros  
✅ `01-STATUS-GERAL.md` marcado `[x]` para esta fase  
✅ Commit + push feitos (chain Sprint 0: `8e3e43c` → `8e927e9` → `2354ff3`)
