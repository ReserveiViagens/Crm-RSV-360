# 03 — CHANGELOG DE IMPLEMENTAÇÃO RSV360

Histórico de implementação por data e commit. Atualizar a cada fase concluída.

---

## 2026-03-27 — Fase 08: Hardening, Observabilidade e Segurança (PROJETO CONCLUÍDO)

**Commits:** `feat(fase-08): conclui hardening, segurança e documentação final`  
**Responsável:** Replit Agent (Task #3)

### Objetivo
Endurecer a operação antes de escalar: logging estruturado, proteção de voucher, rate limit, filas separadas, alertas críticos e runbook.

### Entregáveis
- `.env.example` — todas as variáveis documentadas com comentários
- `server/lib/logger.ts` — logger estruturado JSON (level, message, timestamp, orderId)
- `server/lib/alerts.ts` — sistema de alertas críticos (raiseAlert, acknowledgeAlert, getActiveAlerts)
- `server/routes.ts`:
  - `GET /api/status` atualizado com queues + alerts count
  - UUID v4 + HMAC-SHA256 token para cada voucher
  - `GET /api/orders/:id/voucher?token=<hmac>` valida token (403 se inválido)
  - Rate limit: voucher 10/min, webhook 30/min, recomendações 60/min
  - `GET /api/admin/alerts` + `POST /api/admin/alerts/:id/acknowledge`
- `server/services/retry-queue.service.ts` — filas separadas: voucherDeliveryQueue + paymentConfirmationQueue
- `server/services/post-payment-orchestrator.service.ts` — integrado com logger + raiseAlert
- `client/src/components/admin/CriticalAlertsPanel.tsx` — painel de alertas no admin
- `docs/runbook.md` — rollback, reenvio, invalidação, escalation

### Gate Final Verificado
- ✅ GET /api/status → `{"ok":true, queues:{...}, alerts:{...}}`
- ✅ voucherId = UUID v4 (não sequencial)
- ✅ voucherToken = HMAC-SHA256 → 403 em token inválido
- ✅ Rate limit voucher → 429 após ~8 req/min
- ✅ Rate limit recomendações → 429 na req #61
- ✅ GET /api/admin/alerts → `{"alerts":[]}`

---

## 2026-03-27 — Task #9 (Sprint 0): Auditoria + Estrutura-Base

**Commits Sprint 0:** chain `8e3e43c` → `8e927e9` → `2354ff3` (docs + schema + FASE-00 checklist)  
**Nota de processo:** push feito via GitHub Contents API (HTTP 200/201) — `git push` bloqueado por arquivo LFS de 170MB no repo remoto.  
**Responsável:** Replit Agent

### Objetivo
Estabelecer a fundação documental viva e formalizar os tipos compartilhados de domínio.

### Entregáveis
- `docs/ROUTES_INVENTORY.md` — inventário de 60+ rotas frontend e 80+ endpoints backend com legenda de fonte de dados
- `docs/AUDIT.md` — auditoria completa de implementação por rota/endpoint (status `[x]`/`[~]`/`[ ]` + coluna Dados)
- `docs/GAPS.md` — 15 gaps priorizados por impacto no fluxo comprável (prioridade 1–5, cada um com sprint alvo)
- `shared/schema.ts` atualizado com:
  - `PaymentMethodSchema` / `PaymentMethod` (PIX | CARTAO | DINHEIRO)
  - `OrderStatusSchema` / `OrderStatus` (PENDING | PAID | APPROVED | CANCELLED | EXPIRED | FAILED)
  - `productSchema` / `Product` / `InsertProduct`
  - `cartItemSchema` / `CartItem`
  - `orderCustomerSchema` / `OrderCustomer`
  - `orderSchema` / `Order` / `InsertOrder`
- `01-STATUS-GERAL.md` — Fase 00 marcada `[x]`, legenda completa com `[!]`/`[-]`, path FASE-01 correto
- `02-HANDOFF-ATUAL.md` — totalmente atualizado para estado pós-Sprint-0, refs de commit normalizadas

### Decisões de design
- `OrderStatus.APPROVED` mantido para compatibilidade com `ticket-payment.service.ts` (gateway usa "approved")
- `productSchema.image` sem `.url()` (catálogo atual usa caminhos relativos de asset)
- `ROUTES_INVENTORY.md` e `AUDIT.md` usam legendas complementares (dados vs. implementação) — ver nota no topo do `ROUTES_INVENTORY.md`

### Gate
- `npx tsc --noEmit` → 0 erros
- Todos os arquivos pushados para GitHub via Contents API (HTTP 200/201)

---

## 2026-03-27 — Task #18: Fundação Documental

**Commits:** Arquivos criados via GitHub Contents API sobre baseline `fb0fb425` (Task #7) + `e88e7b23` (Task #8)  
**Commits locais Replit:** `a537132c` (transição plan→build), `2ac0bce` (docs commit)  
**Responsável:** Replit Agent

### O que foi criado
- `AGENTS.md` na raiz — instrução para todos os agentes
- `docs/implantacao/00-PLANO-MESTRE.md` — plano completo das 9 fases
- `docs/implantacao/01-STATUS-GERAL.md` — painel de status em tempo real
- `docs/implantacao/02-HANDOFF-ATUAL.md` — handoff para continuidade
- `docs/implantacao/03-CHANGELOG-IMPLEMENTACAO.md` — este arquivo
- `docs/implantacao/fases/FASE-00-auditoria.md` a `FASE-08-hardening.md` — checklists detalhados

### Estado do projeto neste momento
- Tasks históricas #1–#8 concluídas (código no repositório)
- Plano de 9 sprints (Fases 0–8) definido e documentado
- Fases 0, 4, 7 e 8: não iniciadas
- Fases 1, 2, 3, 5 e 6: parcialmente implementadas (ver detalhes em `01-STATUS-GERAL.md`)

---

## 2026-03-27 — Tasks #1–#8: Base do Produto (histórico)

**Commits relevantes:**  
- `fb0fb425` — Tasks #1–#7: estrutura base, admin, NTX modules
- `e88e7b23` — Task #8: Mapa Leaflet Real (Caldas Novas)

### Resumo do que foi construído

**Frontend (Tasks #1–#8):**
- Home, landing, shells de layout (5 famílias)
- Admin dashboard com NTX section (WaaS, KYC, Gamificação)
- Fluxo de excursões: wizard 5 passos, landing pública, viagens-grupo com 5 abas
- Social commerce: convites, split Pix, vouchers
- Catálogo de excursões com busca por localização (ViaCEP)
- Perfil por hierarquia (Visitante/Passageiro/Organizador/Admin)
- Página /ingressos: 5 parques, stepper, carrinho localStorage, Combo IA (hardcoded 15%), filtros
- Checkout Pix de ingresso (sem split) → sucesso (download TXT)
- Mapa Leaflet com 14 pins OSM, toggle Mapa/Lista, polyline de rota IA

**Backend:**
- Express REST API (`server/routes.ts`)
- Persistência em memória para excursões, reservas, grupos, social commerce
- PostgreSQL para users e gamificação (Drizzle ORM)
- WebSocket para tempo real (`/ws`)
- WhatsApp WaaS (Evolution API, demo mode)
- Split Pix para excursões, Pix simples para ingressos
- ANTT manifests, FNRH ficha, voucher VIP (PDF)

---

## 2026-03-27 — Task #16 (Sprint 7): Admin Métricas Reais + Pós-Pagamento

**Commit:** `f6320ea`  
**Branch:** main  
**Responsável:** Replit Agent

### O que foi implementado

- `server/services/post-payment-orchestrator.service.ts` — `Promise.allSettled([generateVoucherPdf, deliverVoucher])` — pagamento PAID nunca depende de canal
- `server/services/notification.service.ts` — `sendVoucherByWhatsApp` (Evolution API/demo) + `sendVoucherByEmail` (nodemailer/SMTP)
- `server/services/voucher-delivery.service.ts` — `deliverVoucher` + `retryDelivery`; enfileira pendências quando canal falha
- `server/services/retry-queue.service.ts` — Map em memória com enqueue/dequeue/update/list/get
- `GET /api/admin/metrics` — métricas reais do `ticketTransactions` (totalOrders, paidOrders, totalRevenue, averageTicket, comboAcceptanceRate, pendingDeliveries, resendCount)
- `POST /api/admin/orders/:id/resend` — reenvio manual de voucher pelo admin
- Orquestrador disparado assincronamente no webhook PAID via `void runPostPaymentOrchestration(...)`
- Admin dashboard com dados reais, zero hardcoded

### O que está parcial

_(nada — fase 07 completa)_

### Gate de passagem

- [x] build OK
- [x] typecheck OK
- [x] smoke OK: pedido demo PAID → voucher gerado → delivery pendente visível → reenvio manual
- [x] admin com dados reais confirmado

---

## 2026-03-27 — Task #17 (Sprint 7c): Módulo de Clima Open-Meteo

**Commit:** implementado em codebase (Replit), push via Task #1  
**Branch:** main  
**Responsável:** Replit Agent

### O que foi implementado

- `server/services/open-meteo-provider.ts` — cliente Open-Meteo API com parâmetros WMO
- `server/services/weather-service.ts` — `getWeatherByCity`, `getWeatherByCoords`, `warmupCache`
- `server/services/weather-cache.ts` — cache Map com TTL 60min e stale-while-revalidate 6h
- `server/utils/weather-normalizer.ts` — normaliza resposta Open-Meteo → WeatherData
- `server/utils/weather-validators.ts` — valida query params city/country e lat/lon
- `server/utils/weather-code-map.ts` — mapa WMO code → descrição em pt-BR
- `server/routes/weather-routes.ts` — `GET /api/weather`, `GET /api/weather/by-coords`, `POST /internal/weather/warmup`
- `client/src/hooks/useWeather.ts` — hook TanStack Query com staleTime 55min
- `client/src/lib/weather-api.ts` — funções de fetch tipadas
- `client/src/components/WeatherCard.tsx` — card responsivo com ícone, temp, descrição, umidade, vento
- `client/src/components/WeatherPreviewSection.tsx` — seção de previsão para landing page
- Integrado em `/ingressos` e landing page; frontend nunca chama Open-Meteo diretamente

### Regra arquitetural

- Frontend NUNCA chama Open-Meteo diretamente — sempre via `/api/weather` (proxy com cache 60min TTL, 6h stale)

### Gate de passagem

- [x] rota `/api/weather?city=Caldas+Novas` → JSON com previsão 7 dias
- [x] cache hit verificado nos logs
- [x] WeatherCard renderiza na página /ingressos

---

## Template para próximas entradas

```
## YYYY-MM-DD — Sprint N: Nome da Fase

**Commits:** `abcdef1`, `abcdef2`
**Branch:** main
**Responsável:** [Replit Agent / nome]

### O que foi implementado
- item 1
- item 2

### O que está parcial
- item (motivo)

### Gate de passagem
- [x] build OK
- [x] lint OK
- [x] typecheck OK
- [x] smoke OK
- [x] checklist manual OK
```
