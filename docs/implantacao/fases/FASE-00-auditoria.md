# FASE 00 — AUDITORIA + ESTRUTURA-BASE

**Status geral:** `[ ]` Não iniciado  
**Branch:** `main`  
**Último commit relacionado:** —  
**Estimativa:** 2–3 dias úteis

---

## Objetivo

Levantar o estado real do projeto, congelar os riscos conhecidos e preparar a fundação compartilhada de tipos para que as sprints seguintes não pisem em código existente sem saber.

> Nota: A monorepo refactor (turbo.json, pnpm-workspace.yaml, apps/) NÃO será feita — quebraria o setup Replit. Tipos compartilhados ficam em `shared/schema.ts`.

---

## Checklist da fase

### 00.1 — Inventário de rotas frontend
- [ ] Mapear todas as rotas em `client/src/App.tsx` (públicas, auth, admin, organizer, checkout)
- [ ] Registrar em `docs/ROUTES_INVENTORY.md` com status (implementado / parcial / stub)

### 00.2 — Inventário de endpoints backend
- [ ] Mapear todos os endpoints em `server/routes.ts` e sub-arquivos
- [ ] Classificar por status: dados reais / mockado / demo mode / stub
- [ ] Registrar em `docs/ROUTES_INVENTORY.md` (seção backend)

### 00.3 — Inventário de estado compartilhado
- [ ] Auditar `client/src/lib/cart-store.ts` — interfaces de dados usadas
- [ ] Auditar `server/services/payment.service.ts` e `ticket-payment.service.ts`
- [ ] Auditar `server/persistence.ts` — estrutura do in-memory store
- [ ] Registrar interfaces identificadas em `docs/AUDIT.md`

### 00.4 — Documento de gaps
- [ ] Gerar `docs/GAPS.md` com gaps priorizados por impacto no fluxo comprável
- [ ] Incluir: funcionalidades faltando, mocks sem fallback, TODOs críticos, tipos não formalizados

### 00.5 — Tipos compartilhados
- [ ] Adicionar/formalizar em `shared/schema.ts`:
  - [ ] `Product` (schema Zod + tipo infer)
  - [ ] `CartItem` (alinhado com cart-store.ts)
  - [ ] `OrderCustomer` (nome, email, CPF, telefone)
  - [ ] `Order` (id, items, customer, total, status, createdAt)
  - [ ] `PaymentMethod` (enum: PIX, CARTAO, DINHEIRO)
  - [ ] `OrderStatus` (enum: PENDING, PAID, CANCELLED, EXPIRED, FAILED)
- [ ] Confirmar que nenhum tipo existente foi removido

### 00.6 — Gate de validação + docs + push
- [ ] Rodar `npm run build` — 0 erros TypeScript
- [ ] Criar `docs/AUDIT.md` com resultado do build + inventário
- [ ] Atualizar `01-STATUS-GERAL.md`: Fase 0 → `[x]`
- [ ] Atualizar `02-HANDOFF-ATUAL.md`: próximo passo = Sprint 1
- [ ] Commitar com `docs(fase-00): conclui auditoria e estrutura de documentação viva`
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
- `docs/AUDIT.md`, `docs/ROUTES_INVENTORY.md` e `docs/GAPS.md` existem e têm conteúdo real
- `shared/schema.ts` contém `Product`, `CartItem`, `OrderCustomer`, `Order`, `PaymentMethod`, `OrderStatus` como Zod schemas
- `npm run build` passa sem erros
- `01-STATUS-GERAL.md` marcado `[x]` para esta fase
- Commit + push feitos
