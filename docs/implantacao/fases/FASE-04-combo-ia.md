# FASE 04 — COMBO IA — MOTOR + PRICING + API

**Status geral:** `[x]` Concluído  
**Branch:** `main`  
**Último commit relacionado:** feat(fase-04): conclui combo IA com motor de recomendação e pricing  
**Estimativa:** 4–5 dias úteis

---

## Objetivo

Transformar o Combo IA de hardcoded 15% no frontend em motor real com backend de recomendação, `PricingEngine` centralizado e trigger inteligente de baixa fricção.

---

## O que já existe

- Combo IA frontend em `/ingressos` com seleção hardcoded (top 3 por matchScore, ou top 2 por desconto)
- Cálculo hardcoded: `comboDiscountedPrice = Math.round(comboOriginalPrice * 0.85)`
- `MiniWizard` — modal de 3 passos com combo 15% hardcoded
- `caldas-ai-regras.ts` — lógica de matchScore/perfil do viajante

---

## Checklist da fase

### 04.1 — Backend: Affinity map e combo engine
- [x] Criar `server/domain/affinity-map.ts` — mapa de afinidade entre categorias (hotel × parque × add-on)
- [x] Criar `server/domain/combo-engine.ts` — recebe itens do carrinho, retorna sugestões ranqueadas

### 04.2 — Backend: PricingEngine
- [x] Criar `server/services/pricing-engine.ts`
- [x] Retornar `{ originalPrice, comboPrice, savings }` por combinação
- [x] Toda regra de desconto passa por aqui (nunca no frontend)

### 04.3 — Backend: Recommendations service e rotas
- [x] Criar `server/services/recommendation.service.ts` — orquestra combo-engine + PricingEngine
- [x] Registrar `POST /api/recommendations/combo` em `server/routes.ts`
- [x] Registrar `GET /api/recommendations/cart/:sessionId` em `server/routes.ts`
- [x] Contrato de resposta: `{ suggestions: [{ id, name, reason, originalPrice, comboPrice, savings }] }`

### 04.4 — Frontend: Hook de trigger
- [x] Criar `client/src/hooks/useComboTrigger.ts`
  - [x] Observa mudanças no carrinho
  - [x] Dispara após delay de 1.5–2s
  - [x] Registra dismiss na sessão (sessionStorage) — não reabre na mesma sessão
  - [x] Permite pular sem travar o checkout

### 04.5 — Frontend: API client e hook de dados
- [x] Criar `client/src/services/recommendationApi.ts` — chama endpoints de recomendação
- [x] Criar `client/src/hooks/useComboRecommendations.ts` — TanStack Query, estados loading/error/empty

### 04.6 — Frontend: ComboIAWizard, SuggestionCard, ComboIAEmptyState
- [x] Criar `client/src/components/tickets/ComboIAWizard.tsx`
  - [x] Skeleton de loading enquanto carrega sugestões
  - [x] Erro neutro sem quebrar o fluxo
  - [x] Botão "Pular" sempre visível
  - [x] Delay entre 1.5s e 2s antes de abrir
- [x] Criar `client/src/components/tickets/SuggestionCard.tsx`
  - [x] Nome + motivo + preço original riscado + preço combo + economia
- [x] Criar `client/src/components/tickets/ComboIAEmptyState.tsx` — mensagem neutra

### 04.7 — Integração na página /ingressos
- [x] Conectar `useComboTrigger` + `ComboIAWizard` em `client/src/pages/ingressos.tsx`
- [x] Posicionar combo antes da seção de checkout Pix
- [x] Confirmar que hero, grid e badges são preservados

### 04.8 — Gate de validação + docs + push
- [x] Build + typecheck OK
- [x] Smoke: add ingresso → aguardar wizard → testar skip → confirmar que não reabre após dismiss
- [x] Smoke: aceitar sugestão → confirmar que item é adicionado ao carrinho com preço combo
- [x] Demonstrar payload com: sugestão, motivo, preço original, preço combo, economia
- [x] Atualizar `01-STATUS-GERAL.md`: Fase 4 → `[x]`
- [x] Atualizar `02-HANDOFF-ATUAL.md`
- [x] Commitar com `feat(fase-04): conclui combo IA com motor de recomendação e pricing`
- [x] `git push origin main`

---

## Implementado nesta fase

- `server/domain/affinity-map.ts` — mapa de afinidade entre 5 categorias (parques, cabanas, transporte, natureza, combos), com pesos 0.60–0.90
- `server/domain/combo-engine.ts` — motor de ranqueamento baseado em afinidade + popularidade + contexto familiar/transporte/cabana; retorna `ComboSuggestion[]` ordenado por score
- `server/services/pricing-engine.ts` — `calculateComboPrice()` e `calculateCartComboTotal()` com taxa 15%; toda regra de desconto passa aqui
- `server/services/recommendation.service.ts` — orquestra combo-engine + PricingEngine; sessões cacheadas 10 min em Map
- `POST /api/recommendations/combo` — valida payload Zod, retorna `{ sessionId, suggestions, generatedAt }`
- `GET /api/recommendations/cart/:sessionId` — retorna cache da sessão ou 404
- `client/src/services/recommendationApi.ts` — funções `fetchComboRecommendations` e `fetchSessionRecommendations`
- `client/src/hooks/useComboTrigger.ts` — delay 1.75s, sessionStorage dismiss guard, re-trigger apenas em cart growth
- `client/src/hooks/useComboRecommendations.ts` — useQuery (TanStack Query v5), keyed cache ['/api/recommendations/combo', cartKey], estados loading/error/empty
- `client/src/components/tickets/ComboIAWizard.tsx` — Dialog modal com header azul gradiente, skeleton 3-linhas, error state neutro, EmptyState, SuggestionCards, skip sempre visível
- `client/src/components/tickets/SuggestionCard.tsx` — nome, razão, preço original riscado, preço combo, economia em BRL, badge -X%
- `client/src/components/tickets/ComboIAEmptyState.tsx` — mensagem neutra sem ícone alarmante
- Integração em `client/src/pages/ingressos.tsx` — `useComboTrigger` + `<ComboIAWizard>`; hero/grid/badges preservados

---

## Pendências

_(nenhuma — fase concluída)_

---

## Bloqueios

_(nenhum)_

---

## Critério de conclusão

A fase só vira `[x]` quando:
- Wizard abre automaticamente após add (delay 1.5–2s)
- Skip funciona sem travar checkout
- Não reabre após dismiss na mesma sessão
- Sugestões vêm do backend (não hardcoded)
- Pricing calculado pelo `PricingEngine` no backend
- Commit + push feitos
