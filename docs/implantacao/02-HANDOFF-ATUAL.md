# 02 — HANDOFF ATUAL

**Atualizado em:** 2026-03-27  
**Fase atual:** Sprint 6b — Sincronização de Catálogo + OpenAPI (Task #15) — **CONCLUÍDA**  
**Próxima fase:** Sprint 7 — Admin Métricas Reais + Pós-Pagamento

---

## Onde o projeto está agora

Sprint 6b (Task #15) foi concluída com os entregáveis de sincronização de catálogo e OpenAPI:

| Entregável | Status | Arquivo |
|-----------|--------|---------|
| `shared/catalog-groups.ts` | `[x]` 5 grupos normalizados + mapeamento de IDs | `shared/catalog-groups.ts` |
| `server/utils/slug.ts` | `[x]` `generateSlug()` sem acentos/espaços | `server/utils/slug.ts` |
| `scripts/sync-catalog.ts` | `[x]` upsert idempotente (sem duplicatas em rerun) | `scripts/sync-catalog.ts` |
| `server/db/seed.ts` | `[x]` 15 entradas demo (5 grupos, ≥2 hotel + 1 parque/grupo), basePrice real por item | `server/db/seed.ts` |
| `docs/openapi/recommendations.yaml` | `[x]` OpenAPI 3.0 — catalog, recommendations, search | `docs/openapi/recommendations.yaml` |

---

Sprint 6 (Task #14) já havia sido concluída com todos os entregáveis críticos:

| Entregável | Status | Arquivo |
|-----------|--------|---------|
| `GET /api/orders/:id` | `[x]` dados do pedido | `server/routes.ts` |
| `GET /api/orders/:id/voucher` | `[x]` PDF binary, Content-Disposition: attachment | `server/routes.ts` |
| `VoucherPdfService` (pdfkit + qrcode) | `[x]` QR H, 240×240, ordenação hotel>parque>addon | `server/services/voucher-pdf.service.ts` |
| SuccessHero | `[x]` gradiente verde, nome do cliente, WhatsApp | `client/src/pages/ingressos-sucesso.tsx` |
| OrderSummaryCard | `[x]` itens, combo savings, total, nº pedido | `client/src/pages/ingressos-sucesso.tsx` |
| VoucherDownloadCard | `[x]` estados idle/loading/success/error, PDF download | `client/src/pages/ingressos-sucesso.tsx` |
| Analytics events | `[x]` 3 novos eventos: voucher_pdf_download_* | `client/src/lib/analytics.ts` |
| Gate TypeScript | `[x]` npx tsc --noEmit → 0 erros | — |
| Gate smoke test | `[x]` HTTP 200 application/pdf 9391 bytes, %PDF-1.3 | — |

---

## O que foi realizado até aqui (Tasks #1–#14)

- **T1–T7**: Estrutura base — home, landing, shells, admin, NTX modules. Commit: `fb0fb425`
- **T8**: Mapa Leaflet real em `/mapa-caldas-novas`. Commit: `e88e7b23`
- **T18**: Fundação documental — 14 arquivos criados via GitHub Contents API.
- **T9 (Sprint 0)**: Inventário de rotas, auditoria, gaps, tipos Zod. Chain: `8e3e43c`→`2354ff3`
- **T10 (Sprint 1)**: Token files TS (colors, spacing, layout, typography) + CSS vars. Commit: `5639124`
- **T11 (Sprint 2+3)**: PrimaryButton, SecondaryButton, StatusBadge (ui/), TicketsGrid loading/empty, cart-store hardened
- **T12 (Sprint 4)**: Combo IA — PricingEngine, RecommendationService, AffinityMap, API de recomendações
- **T13 (Sprint 5)**: Checkout Pix Completo — react-hook-form, zodResolver, 5 componentes checkout/, ticket-catalog.ts (24 IDs), backend pricing server-side, UnknownTicketError, orderId redirect
- **T14 (Sprint 6)**: Sucesso + Voucher PDF — pdfkit + qrcode, GET /api/orders/:id e /voucher, SuccessHero + OrderSummaryCard + VoucherDownloadCard
- **T15 (Sprint 6b)**: Sincronização de Catálogo + OpenAPI — `shared/catalog-groups.ts` (5 grupos), `server/utils/slug.ts`, `scripts/sync-catalog.ts` (upsert idempotente), `server/db/seed.ts`, `docs/openapi/recommendations.yaml`

---

## Arquitetura do fluxo de compra completo

```
/ingressos
  → Catálogo em grid, stepper de quantidade, Combo IA
  → CartStickyBar (mobile) / IngressosSidebar (desktop)

/ingressos/checkout?step=email|dados|pagamento
  → react-hook-form + zodResolver
  → POST /api/payments/tickets/create (server-side pricing, ticket-catalog.ts)
  → Pix: QR Code, copia-e-cola, countdown, polling
  → Redirect: /ingressos/sucesso?orderId=

/ingressos/sucesso?orderId=
  → GET /api/orders/:id (TanStack Query)
  → SuccessHero (verde, nome, WhatsApp)
  → OrderSummaryCard (itens, combo, total)
  → VoucherDownloadCard → GET /api/orders/:id/voucher → PDF binary
```

---

## Observações críticas (invariáveis)

- Não alterar hero azul, grid ou badges de `/ingressos`
- Não misturar `id` com `ticketId` no carrinho
- Não mover regra comercial (pricing, desconto) para o frontend
- Ingressos Pix = sem split; Excursões Pix = com split (serviços diferentes)
- Demo credentials: demo@reservei.com.br / demo123 (admin)
- `ticketTransactions` Map é a fonte de verdade para pedidos de ingressos em memória

---

## O que está parcial (pendente nas próximas sprints)

| Item | Status | Fase alvo |
|------|--------|-----------|
| Admin métricas reais | `[~]` (hardcoded) | Sprint 7 |
| Post-payment orchestrator | `[ ]` | Sprint 7 |
| Envio de voucher por e-mail | `[ ]` | Sprint 7 |
| Logging estruturado | `[ ]` | Sprint 8 |
| HMAC de voucher | `[ ]` | Sprint 8 |
| Rate limiting | `[ ]` | Sprint 8 |
| QR validação online | `[ ]` | Sprint 8 |
