# FASE 05 — CHECKOUT PIX COMPLETO

**Status geral:** `[x]` Concluído  
**Branch:** `main`  
**Último commit relacionado:** ver Task #13  
**Estimativa:** 3–4 dias úteis (fechamento de gaps)

---

## Objetivo

Garantir que o checkout Pix seja confiável, claro e rastreável de ponta a ponta. O fluxo já existe — esta fase fecha os gaps e endurece o comportamento.

---

## O que já existe

- Página `/ingressos/checkout` com formulário + QR Pix + polling 3s
- `ticket-payment.service.ts` — createTicketPix (sem split, demo mode se sem gateway)
- Rotas: `POST /api/payments/tickets/create`, `GET /api/payments/tickets/:id/status`, `GET /api/payments/tickets/:id`, `POST /api/webhooks/tickets`
- Formulário com validação (nome 2 palavras, email com @, CPF 11 dígitos, telefone 10 dígitos)
- `PaymentCheckout.tsx` — QR code, copy-paste, countdown 30min

---

## Checklist da fase

### 05.1 — Backend: Rotas e serviço
- [x] `POST /api/payments/tickets/create` — cria transação Pix
- [x] `GET /api/payments/tickets/:id/status` — retorna status
- [x] `GET /api/payments/tickets/:id` — retorna dados da transação
- [x] `POST /api/payments/tickets/:id/cancel` — implementado (Task #13)
- [x] `POST /api/payments/tickets/:id/demo-confirm` — confirma demo manualmente (Task #13)
- [x] `ticket-payment.service.ts` usa `PricingEngine.calculateCartComboTotal` para calcular total
- [x] Demo mode funciona sem gateway real configurado
- [x] `DEMO_CONFIRM_DELAY_MS` env — auto-confirm opcional via timer

### 05.2 — Frontend: Formulário
- [x] validações manuais (nome, email, CPF, telefone) com mensagens por campo
- [x] `data-testid` em todos os campos e botão submit confirmados
- [x] Mensagens de erro claras por campo (formErrors state)

### 05.3 — Frontend: CheckoutSummaryCard
- [x] Exibe itens individuais com qtd e preço
- [x] Desconto Combo IA (15%) exibido quando cart ≥ 2 itens
- [x] Preço total calculado pelo backend exibido após criação do Pix (`data-testid="text-backend-total"`)
- [x] Economia combo exibida (`data-testid="text-combo-savings"`)

### 05.4 — Frontend: Pix UI Components
- [x] QR Code (imagem base64) — `data-testid="div-qr-code"`
- [x] Copy-paste com botão e feedback — `data-testid="field-pix-code"`, `data-testid="button-copy-pix"`
- [x] Countdown (timer baseado em `expirationDate`) — `data-testid="text-pix-countdown"`
- [x] StatusBanner PENDING/APPROVED/EXPIRED — `data-testid="banner-payment-*"`

### 05.5 — Frontend: Polling e redirecionamento
- [x] Polling a cada 3s via `GET /api/payments/tickets/:id/status`
- [x] Para ao confirmar ou expirar
- [x] Redireciona para `/ingressos/sucesso?txn=ID` ao confirmar
- [x] Botão cancelar — chama `POST /api/payments/tickets/:id/cancel` e navega para `/ingressos` (`data-testid="button-cancel-pix"`)
- [x] Botão demo confirm — `data-testid="button-demo-confirm-pix"` (visível em demo mode)

### 05.6 — Gate de validação + docs + push
- [x] Build + typecheck OK (`npx tsc --noEmit` zero erros)
- [x] Smoke: formulário → submit → QR → Simular Pagamento (Demo) → redirecionamento sucesso
- [x] Fallback demo sem gateway real confirmado
- [x] Atualizar `01-STATUS-GERAL.md`: Fase 5 → `[x]`
- [x] Atualizar `02-HANDOFF-ATUAL.md`
- [x] Commit + push feitos

---

## Implementado nesta fase

### Backend (Task #13)
- `ticket-payment.service.ts` integrado com `PricingEngine.calculateCartComboTotal` — total calculado server-side com desconto Combo IA (15% quando ≥ 2 itens)
- `cancelTicketPix()` — cancela demo ou chama gateway real
- `demoAutoConfirmCallbacks` — mapa de callbacks para auto-confirm por `DEMO_CONFIRM_DELAY_MS`
- `POST /api/payments/tickets/:id/cancel` — route formal de cancelamento
- `POST /api/payments/tickets/:id/demo-confirm` — endpoint para simular pagamento no modo demo
- Resposta do `create` inclui `originalTotal`, `totalSavings`, `isCombo`

### Frontend (Task #13)
- `CheckoutSummaryCard` atualizado: lista itens individuais, desconto Combo IA, total calculado pelo backend
- Botão "Simular Pagamento (Demo)" — visível em demo mode, chama `/demo-confirm`, redireciona para sucesso
- Botão "Cancelar e voltar" — chama `/cancel`, navega para `/ingressos`
- `data-testid` completo em todos os elementos interativos e informativos
- `pix_cancelled` adicionado ao tipo `AnalyticsEvent`

---

## Pendências

Nenhuma — fase concluída com gate formal.

---

## Bloqueios

_(nenhum identificado)_

---

## Critério de conclusão

A fase só vira `[x]` quando:
- Formulário valida todos os campos com mensagens claras
- QR e copia-e-cola funcionam no demo mode
- Polling confirma pagamento e redireciona automaticamente para sucesso
- `data-testid` em todos os elementos interativos do checkout
- Commit + push feitos
