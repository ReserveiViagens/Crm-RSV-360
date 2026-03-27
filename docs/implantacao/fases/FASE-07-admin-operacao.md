# FASE 07 — ADMIN COM MÉTRICAS REAIS + AUTOMAÇÃO PÓS-PAGAMENTO

**Status geral:** `[ ]` Não iniciado  
**Branch:** `main`  
**Último commit relacionado:** —  
**Estimativa:** 4–5 dias úteis

---

## Objetivo

Fechar o ciclo comercial: admin com dados reais (não hardcoded) e pós-pagamento automatizado com retentativa e auditoria. Regra de ouro: pagamento confirmado nunca depende do sucesso da notificação.

---

## O que já existe

- Admin dashboard em `/admin/dashboard` com métricas (hardcoded)
- `whatsapp.service.ts` — sendPaymentConfirmation, createGroup, etc.
- `ticket-payment.service.ts` — atualiza status após webhook
- `orderStore` em `persistence.ts`

---

## Checklist da fase

### 07.1 — Backend: API de métricas reais
- [ ] Criar `GET /api/admin/metrics` — lê de `orderStore` e analytics
- [ ] Retornar: taxa de abertura wizard Combo IA, taxa de aceitação por grupo hoteleiro, ticket médio com/sem combo, vouchers gerados, vouchers reenviados

### 07.2 — Frontend: Componentes de métricas
- [ ] Criar `ComboConversionCard.tsx` — wizard open rate + acceptance rate
- [ ] Criar `TopSuggestedHotelsTable.tsx` — top 5 hotéis sugeridos com taxa de aceite
- [ ] Criar `TriggerAcceptanceChart.tsx` — gráfico de aceitação no tempo (recharts)
- [ ] Criar `VoucherDeliveryStatusTable.tsx` — vouchers pendentes de reenvio
- [ ] Todos usando TanStack Query com `GET /api/admin/metrics`
- [ ] Remover dados hardcoded do admin dashboard

### 07.3 — Backend: Post-payment orchestrator
- [ ] Criar `server/services/post-payment-orchestrator.service.ts`
- [ ] Ao receber status `PAID`: executa `Promise.allSettled([generateVoucher, enqueueNotification])`
- [ ] Falha em qualquer etapa → `PendingDelivery` no `orderStore`, não reversão do pagamento
- [ ] Pedido vai para `PAID` antes do envio (nunca bloquear em notificação)

### 07.4 — Backend: Notification service
- [ ] Criar `server/services/notification.service.ts`
- [ ] `sendVoucherByWhatsApp(orderId)` — usa `whatsapp.service.ts`
- [ ] `sendVoucherByEmail(orderId)` — usa nodemailer
- [ ] Retorna `{ success: boolean, channel, error? }`

### 07.5 — Backend: Voucher delivery service e retry queue
- [ ] Criar `server/services/voucher-delivery.service.ts` — tentativa de entrega + log resultado
- [ ] Criar `server/services/retry-queue.service.ts` — lista de pedidos com entrega pendente
- [ ] Admin pode consultar e acionar reenvio manual via `POST /api/admin/orders/:id/resend`

### 07.6 — Integração no fluxo de pagamento
- [ ] Conectar orchestrator ao `ticket-payment.service.ts`
- [ ] Quando status muda para `PAID` → disparar orchestrator de forma assíncrona (não bloquear resposta)

### 07.7 — Gate de validação + docs + push
- [ ] Build + typecheck OK
- [ ] Smoke: pedido pago (demo) → voucher gerado → delivery pendente visível no admin → clicar reenviar
- [ ] Confirmar que admin mostra dados do banco (não hardcoded)
- [ ] Atualizar `01-STATUS-GERAL.md`: Fase 7 → `[x]`
- [ ] Atualizar `02-HANDOFF-ATUAL.md`
- [ ] Commitar com `feat(fase-07): conclui admin com métricas reais e automação pós-pagamento`
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
- Admin dashboard lê dados reais do banco (zero hardcoded)
- Pedido PAID → voucher gerado → notificação tentada via `Promise.allSettled`
- Falha de canal gera pendência operacional, não reversão de compra
- Admin exibe e permite reenvio manual
- Commit + push feitos
