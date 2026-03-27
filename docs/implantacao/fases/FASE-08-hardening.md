# FASE 08 — HARDENING, OBSERVABILIDADE E SEGURANÇA

**Status geral:** `[ ]` Não iniciado  
**Branch:** `main`  
**Último commit relacionado:** —  
**Estimativa:** 4–6 dias úteis

---

## Objetivo

Endurecer a operação antes de escalar: logging estruturado, proteção de voucher (UUID + HMAC), rate limit nos endpoints críticos, separação de filas e runbook básico.

---

## O que já existe

- `server/index.ts` — Express server configurado
- `server/routes.ts` — endpoints principais
- `server/persistence.ts` — in-memory store
- Variáveis de ambiente usadas (sem `.env.example` formal)

---

## Checklist da fase

### 08.1 — Arquivo .env.example
- [ ] Criar `.env.example` na raiz com todas as variáveis de ambiente
- [ ] Comentário explicativo para cada variável
- [ ] Nunca commitar valores reais

### 08.2 — Logger estruturado
- [ ] Criar `server/lib/logger.ts` — produz JSON com campos padrão
  - [ ] Campos: `orderId`, `paymentId`, `customerId`, `level`, `message`, `timestamp`, `correlationId`
- [ ] Integrar em: `ticket-payment.service.ts`, `post-payment-orchestrator.service.ts`, `voucher-pdf.service.ts`
- [ ] Logs de request/response nos endpoints críticos (payment, voucher, recommendations)

### 08.3 — Healthcheck endpoint
- [ ] Criar `server/routes/status.routes.ts`
- [ ] `GET /api/status` — retorna: versão, uptime, status do banco, status das filas
- [ ] Registrar no `server/routes.ts`

### 08.4 — Proteção do voucher
- [ ] Alterar geração de link de voucher para usar UUID v4 (não ID sequencial)
- [ ] Adicionar token HMAC assinado com `VOUCHER_SECRET` (env var)
- [ ] Validar token em `GET /api/orders/:id/voucher`
- [ ] Link permanece acessível mesmo com falha de notificação

### 08.5 — Rate limiting
- [ ] Instalar e configurar `express-rate-limit`
- [ ] Download de voucher: máx 10 req/min por IP
- [ ] Webhook Pix: máx 30 req/min
- [ ] Recomendações: máx 60 req/min
- [ ] Retorna `429 Too Many Requests` com mensagem clara

### 08.6 — Separação de filas
- [ ] Refatorar `retry-queue.service.ts` para filas separadas:
  - [ ] `payment-confirmation-queue` — processamento independente
  - [ ] `voucher-delivery-queue` — processamento independente

### 08.7 — Alertas críticos
- [ ] Criar `server/lib/alerts.ts`
- [ ] Detectar e registrar eventos críticos:
  - [ ] Falha em `generateVoucherPDF`
  - [ ] Falha em `/api/v1/recommendations`
  - [ ] Falha no webhook Pix
  - [ ] Falha dupla de entrega (2 retentativas com falha)
  - [ ] Latência > 5s em pricing ou recomendação
- [ ] Flags visíveis no painel admin

### 08.8 — Runbook básico
- [ ] Criar `docs/runbook.md` com:
  - [ ] Como reverter deploy (rollback de commit)
  - [ ] Como reprocessar fila de entregas com falha
  - [ ] Como invalidar links de voucher comprometidos
  - [ ] Contatos de escalation

### 08.9 — Gate final + fechamento de todos os docs + push
- [ ] Build + typecheck + smoke OK
- [ ] Provar que voucher tem ID não previsível (UUID)
- [ ] Simular falha de entrega → flag visível no admin
- [ ] Verificar rate limit retorna 429 corretamente
- [ ] Atualizar `01-STATUS-GERAL.md`: **TODAS as fases → `[x]`**
- [ ] Atualizar `02-HANDOFF-ATUAL.md`: projeto concluído
- [ ] Atualizar `03-CHANGELOG-IMPLEMENTACAO.md`: entrada final
- [ ] Commitar com `feat(fase-08): conclui hardening, segurança e documentação final do projeto`
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
- Logs estruturados JSON nos serviços críticos
- Link de voucher usa UUID + HMAC (não ID sequencial)
- Rate limit retorna 429 nos endpoints configurados
- Falhas abertas visíveis no painel admin
- `docs/runbook.md` completo
- Todas as fases marcadas `[x]` no `01-STATUS-GERAL.md`
- Commit + push feitos
