# GAPS — RSV360

**Atualizado em:** 2026-03-27  
**Baseado em:** Auditoria Sprint 0 + `docs/ROUTES_INVENTORY.md`

Gaps ordenados por **impacto no fluxo comprável** (prioridade 1 = crítico, 5 = melhoria).

---

## Prioridade 1 — Bloqueadores do fluxo comprável

### G1.1 — Backend Combo IA ausente
**Impacto:** O Combo IA calcula desconto de 15% hardcoded no frontend. Não há `PricingEngine` no backend, então qualquer regra de negócio (desconto dinâmico, regras de afiliação) deve ser implementada no cliente, violando a separação de responsabilidades.  
**Arquivo com gap:** `client/src/pages/ingressos.tsx` (linhas que calculam `comboDiscountedPrice`)  
**Sprint:** Fase 04 — Combo IA

### G1.2 — Voucher de ingresso é apenas TXT
**Impacto:** `/ingressos/sucesso` gera comprovante `.txt`. Não há PDF com QR code. Para uso real (parques físicos), o comprovante precisa ser escaneável.  
**Arquivo com gap:** `client/src/pages/ingressos-sucesso.tsx`  
**Sprint:** Fase 06 — Sucesso + Voucher

### G1.3 — Admin dashboard com métricas hardcoded
**Impacto:** `admin-dashboard.tsx` exibe KPIs fixos no código-fonte, não lê do banco. Impossível tomar decisões operacionais com dados reais.  
**Arquivo com gap:** `client/src/pages/admin-dashboard.tsx`  
**Sprint:** Fase 07 — Admin Métricas Reais

### G1.4 — Post-payment orchestrator ausente
**Impacto:** Após confirmação de pagamento, não há orquestrador que gere o voucher e tente entrega via WhatsApp/e-mail em `Promise.allSettled`. Falha de canal de notificação pode deixar passageiro sem ingresso.  
**Arquivo com gap:** `server/services/ticket-payment.service.ts` (falta hook pós-PAID)  
**Sprint:** Fase 07 — Admin Operação

---

## Prioridade 2 — Gaps que degradam confiabilidade

### G2.1 — `orderStore` de ingressos não persiste entre restarts
**Impacto:** `GET /api/payments/tickets/:id` busca transação de uma store in-memory. Após restart do servidor, transações são perdidas. Em demo mode é aceitável, mas em produção é crítico.  
**Arquivo com gap:** `server/routes.ts` (linhas ~2167: `orderStore` não declarado explicitamente — usa objeto local)  
**Sprint:** Fase 05 — Checkout Pix

### G2.2 — Reservas do passageiro sempre mockadas
**Impacto:** `GET /api/reservas/minhas` retorna dados seeded fixos (não lê do banco). Passageiros não veem suas reservas reais.  
**Arquivo com gap:** `server/routes.ts` (linhas ~313: `reservaPassageiroStore`)  
**Sprint:** Fase 07 — Admin Operação

### G2.3 — Notificações sempre mockadas
**Impacto:** `GET /api/notificacoes` retorna dados seeded fixos por userId. Não há persistência real de notificações.  
**Arquivo com gap:** `server/routes.ts` (linhas ~356: `notificacaoStore`)  
**Sprint:** Fase 07 — Admin Operação

### G2.4 — Tipos `Product`, `CartItem`, `Order` não formalizados em Zod
**Impacto:** O checkout de ingressos usa interfaces TypeScript locais. A ausência de schemas Zod compartilhados impede validação server-side do payload do pedido e dificulta a extensão do sistema.  
**Arquivo com gap:** `shared/schema.ts` (não tem Product, Order, CartItem formais)  
**Sprint:** Fase 00 — Auditoria (resolvido nesta sprint)

---

## Prioridade 3 — Gaps que afetam qualidade operacional

### G3.1 — Polling de status de ingresso sempre retorna PENDING em demo
**Impacto:** `checkTicketPaymentStatus` retorna sempre `{ status: "PENDING", paid: false }` em demo mode. O checkout de ingressos nunca redireciona para `/ingressos/sucesso` automaticamente. Precisaria de clique manual ou hook temporário para testar o fluxo completo.  
**Arquivo com gap:** `server/services/ticket-payment.service.ts` (linhas ~109)  
**Sugestão:** Adicionar lógica de auto-approve após Xs em demo mode  
**Sprint:** Fase 05 — Checkout Pix

### G3.2 — Excursões em memória (`server/persistence.ts`)
**Impacto:** Excursões, grupos, memberships, social commerce — todos em `data/db.json` (in-memory via `mutateDb`). Não há tabelas Drizzle para estes dados. Se o servidor reiniciar sem o arquivo JSON, tudo é perdido.  
**Arquivo com gap:** `server/persistence.ts`, `server/excursoes.ts`, `server/social-commerce.ts`  
**Sprint:** Longa duração — não bloqueador imediato

### G3.3 — Token files TypeScript ausentes (`client/src/tokens/`)
**Impacto:** Os tokens CSS estão em `client/src/index.css` como variáveis `--rsv-*`, mas não existem como constantes TypeScript importáveis. Isso força valores hardcoded espalhados nos componentes (ex: `#0891B2`, `#2563EB` na ingressos.tsx).  
**Arquivo com gap:** `client/src/tokens/` (diretório não existe)  
**Sprint:** Fase 01 — Design System

### G3.4 — Analytics de checkout não rastreiam evento `checkout_start`
**Impacto:** O botão de checkout na `CartStickyBar` pode não estar disparando `trackEvent("tickets_checkout_start")`. A análise de funil fica incompleta.  
**Arquivo com gap:** `client/src/components/CartStickyBar.tsx`  
**Sprint:** Fase 03 — Catálogo /ingressos

---

## Prioridade 4 — Gaps de segurança e hardening

### G4.1 — Link de voucher é sequencial (não seguro)
**Impacto:** `transactionId` gerado por `tkt-${Date.now()}-${Math.random()}`. O componente aleatório tem apenas 6 caracteres alfanuméricos, o que torna links previsíveis por força bruta.  
**Arquivo com gap:** `server/services/ticket-payment.service.ts` (linha ~41)  
**Sprint:** Fase 08 — Hardening

### G4.2 — Sem rate limiting nos endpoints críticos
**Impacto:** `POST /api/payments/tickets/create`, `GET /api/payments/tickets/:id/status`, `POST /api/webhooks/tickets` — sem limitação de taxa. Possível abuso/DDoS.  
**Arquivo com gap:** `server/routes.ts`  
**Sprint:** Fase 08 — Hardening

### G4.3 — Sem logging estruturado
**Impacto:** Logs de pagamento são apenas `console.log`. Sem correlationId, sem JSON estruturado, impossível investigar falhas em produção.  
**Arquivo com gap:** Todos os serviços em `server/services/`  
**Sprint:** Fase 08 — Hardening

### G4.4 — Webhook sem validação de assinatura HMAC
**Impacto:** `POST /api/webhook/payment` e `POST /api/webhooks/tickets` não validam origem do payload. Qualquer requisição pode simular uma confirmação de pagamento.  
**Arquivo com gap:** `server/routes.ts` (linhas ~1743 e ~2174)  
**Sprint:** Fase 08 — Hardening

---

## Prioridade 5 — Melhorias de UX e dados

### G5.1 — Catálogo de ingressos hardcoded no frontend
**Impacto:** Os 5 parques em `ticketsBase` dentro de `ingressos.tsx` são dados hardcoded. Para adicionar um novo parque, é necessário editar código e fazer deploy.  
**Arquivo com gap:** `client/src/pages/ingressos.tsx`  
**Sprint:** Fase 06 — Sincronização de Catálogo (Task #15)

### G5.2 — Sem OpenAPI spec
**Impacto:** Não há documentação formal da API REST. Dificultando integração com sistemas externos.  
**Arquivo com gap:** Nenhum (não existe)  
**Sprint:** Fase 06 — OpenAPI (Task #15)

### G5.3 — Busca retorna dados mockados
**Impacto:** `GET /api/search` usa `search-data.ts` com dados fixos. Não busca excursões reais do `persistence.ts`.  
**Arquivo com gap:** `server/search-data.ts`  
**Sprint:** Fase 06 — Sincronização de Catálogo

---

## Resumo por sprint

| Sprint | Gaps endereçados |
|--------|-----------------|
| Sprint 0 (Fase 00) — esta sprint | G2.4 (tipos Zod) |
| Sprint 1 (Fase 01) | G3.3 (token files) |
| Sprint 2 (Fase 02) | G3.4 (analytics checkout) |
| Sprint 3 (Fase 03) | G3.4 (analytics) |
| Sprint 4 (Fase 04) | G1.1 (Combo IA backend) |
| Sprint 5 (Fase 05) | G2.1 (orderStore persistência), G3.1 (demo auto-approve) |
| Sprint 6 (Fase 06) | G1.2 (voucher PDF), G5.1, G5.2 |
| Sprint 7 (Fase 07) | G1.3, G1.4, G2.2, G2.3 |
| Sprint 8 (Fase 08) | G4.1, G4.2, G4.3, G4.4 |
| Backlog | G3.2 (excursões Postgres — grande) |
