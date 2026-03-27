# FASE 04 — COMBO IA — MOTOR + PRICING + API

**Status geral:** `[ ]` Não iniciado  
**Branch:** `main`  
**Último commit relacionado:** —  
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
- [ ] Criar `server/domain/affinity-map.ts` — mapa de afinidade entre categorias (hotel × parque × add-on)
- [ ] Criar `server/domain/combo-engine.ts` — recebe itens do carrinho, retorna sugestões ranqueadas

### 04.2 — Backend: PricingEngine
- [ ] Criar `server/services/pricing-engine.ts`
- [ ] Retornar `{ originalPrice, comboPrice, savings }` por combinação
- [ ] Toda regra de desconto passa por aqui (nunca no frontend)

### 04.3 — Backend: Recommendations service e rotas
- [ ] Criar `server/services/recommendation.service.ts` — orquestra combo-engine + PricingEngine
- [ ] Registrar `POST /api/recommendations/combo` em `server/routes.ts`
- [ ] Registrar `GET /api/recommendations/cart/:sessionId` em `server/routes.ts`
- [ ] Contrato de resposta: `{ suggestions: [{ id, name, reason, originalPrice, comboPrice, savings }] }`

### 04.4 — Frontend: Hook de trigger
- [ ] Criar `client/src/hooks/useComboTrigger.ts`
  - [ ] Observa mudanças no carrinho
  - [ ] Dispara após delay de 1.5–2s
  - [ ] Registra dismiss na sessão (sessionStorage) — não reabre na mesma sessão
  - [ ] Permite pular sem travar o checkout

### 04.5 — Frontend: API client e hook de dados
- [ ] Criar `client/src/services/recommendationApi.ts` — chama endpoints de recomendação
- [ ] Criar `client/src/hooks/useComboRecommendations.ts` — TanStack Query, estados loading/error/empty

### 04.6 — Frontend: ComboIAWizard, SuggestionCard, ComboIAEmptyState
- [ ] Criar `client/src/components/tickets/ComboIAWizard.tsx`
  - [ ] Skeleton de loading enquanto carrega sugestões
  - [ ] Erro neutro sem quebrar o fluxo
  - [ ] Botão "Pular" sempre visível
  - [ ] Delay entre 1.5s e 2s antes de abrir
- [ ] Criar `client/src/components/tickets/SuggestionCard.tsx`
  - [ ] Nome + motivo + preço original riscado + preço combo + economia
- [ ] Criar `client/src/components/tickets/ComboIAEmptyState.tsx` — mensagem neutra

### 04.7 — Integração na página /ingressos
- [ ] Conectar `useComboTrigger` + `ComboIAWizard` em `client/src/pages/ingressos.tsx`
- [ ] Posicionar combo antes da seção de checkout Pix
- [ ] Confirmar que hero, grid e badges são preservados

### 04.8 — Gate de validação + docs + push
- [ ] Build + typecheck OK
- [ ] Smoke: add ingresso → aguardar wizard → testar skip → confirmar que não reabre após dismiss
- [ ] Smoke: aceitar sugestão → confirmar que item é adicionado ao carrinho com preço combo
- [ ] Demonstrar payload com: sugestão, motivo, preço original, preço combo, economia
- [ ] Atualizar `01-STATUS-GERAL.md`: Fase 4 → `[x]`
- [ ] Atualizar `02-HANDOFF-ATUAL.md`
- [ ] Commitar com `feat(fase-04): conclui combo IA com motor de recomendação e pricing`
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
- Wizard abre automaticamente após add (delay 1.5–2s)
- Skip funciona sem travar checkout
- Não reabre após dismiss na mesma sessão
- Sugestões vêm do backend (não hardcoded)
- Pricing calculado pelo `PricingEngine` no backend
- Commit + push feitos
