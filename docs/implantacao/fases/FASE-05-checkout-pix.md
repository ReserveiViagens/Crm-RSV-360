# FASE 05 — CHECKOUT PIX COMPLETO

**Status geral:** `[~]` Parcial  
**Branch:** `main`  
**Último commit relacionado:** `fb0fb425`  
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
- [~] `POST /api/payments/tickets/:id/cancel` — verificar se existe (rota de cancelamento)
- [ ] Confirmar que `ticket-payment.service.ts` usa `PricingEngine` para calcular total (após Fase 4)
- [x] Demo mode funciona sem gateway real configurado

### 05.2 — Frontend: Formulário
- [x] `react-hook-form` + validações (nome, email, CPF, telefone)
- [ ] Confirmar `data-testid` em todos os campos e botão submit
- [ ] Confirmar mensagens de erro claras por campo

### 05.3 — Frontend: CheckoutSummaryCard
- [~] Exibir itens do carrinho e total (verificar se desconto combo é exibido quando aplicado)
- [ ] Preços vindos do backend após `create` (não do carrinho local)

### 05.4 — Frontend: Pix UI Components
- [x] `PixQrCodePanel` (imagem QR base64)
- [x] `PixCopyPasteField` (copia-e-cola com botão copiar + feedback)
- [~] `PixCountdown` — verificar se temporizador de expiração (não de session) está implementado
- [x] `PaymentStatusBanner` — estados PENDING/APPROVED/EXPIRED/FAILED

### 05.5 — Frontend: Polling e redirecionamento
- [x] Polling a cada 3s via `GET /api/payments/tickets/:id/status`
- [x] Para ao confirmar ou expirar
- [x] Redireciona para `/ingressos/sucesso?txn=ID` ao confirmar
- [ ] Botão cancelar — verificar se existe e funciona corretamente

### 05.6 — Gate de validação + docs + push
- [ ] Build + typecheck OK
- [ ] Smoke completo: formulário → submit → ver QR → aguardar demo → ver redirecionamento para sucesso
- [ ] Confirmar fallback demo sem gateway real
- [ ] Atualizar `01-STATUS-GERAL.md`: Fase 5 → `[x]`
- [ ] Atualizar `02-HANDOFF-ATUAL.md`
- [ ] Commitar com `feat(fase-05): conclui checkout Pix com QR, polling e fallback demo`
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
- Formulário valida todos os campos com mensagens claras
- QR e copia-e-cola funcionam no demo mode
- Polling confirma pagamento e redireciona automaticamente para sucesso
- `data-testid` em todos os elementos interativos do checkout
- Commit + push feitos
