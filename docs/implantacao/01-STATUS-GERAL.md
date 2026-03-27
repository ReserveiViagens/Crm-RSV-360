# 01 — STATUS GERAL DA IMPLANTAÇÃO

**Última atualização:** 2026-03-27  
**Branch atual:** `main`  
**Responsável atual:** Replit Agent  
**Próxima ação recomendada:** Sprint 8 — Hardening, Observabilidade e Segurança

---

## Resumo por fase (plano de sprints)

> **Convenção de status:** `[ ]` = sprint não executado (gate não passou) · `[~]` = código existe parcialmente mas gate nunca foi executado · `[x]` = sprint concluído com gate formal · `[!]` = bloqueado por dependência externa · `[-]` = cancelado/descartado.

| Fase | Nome | Status |
|------|------|--------|
| 00 | Auditoria + Estrutura-Base | `[x]` concluído (Sprint 0 — Task #9) |
| 01 | Design System + Layout System | `[x]` concluído (Sprint 1 — Task #10) |
| 02 | Componentes Compartilhados | `[x]` concluído (Sprint 2+3 — Task #11) |
| 03 | Catálogo /ingressos com Carrinho | `[x]` concluído (Sprint 2+3 — Task #11) |
| 04 | Combo IA — Motor + Pricing + API | `[x]` concluído (Sprint 4 — Task #12) |
| 05 | Checkout Pix Completo | `[x]` concluído (Sprint 5 — Task #13) |
| 06 | Sucesso + Voucher PDF Único | `[x]` concluído (Sprint 6 — Task #14) |
| 06b | Sincronização de Catálogo + OpenAPI | `[x]` concluído (Sprint 6b — Task #15) |
| 07 | Admin Métricas Reais + Pós-Pagamento | `[x]` concluído (commit `f6320ea`) |
| 07c | Módulo de Clima Open-Meteo | `[x]` concluído (implementado em paralelo) |
| 08 | Hardening, Observabilidade e Segurança | `[ ]` não iniciado |

---

## Contexto — Tasks históricas já concluídas (antes do novo plano)

| Task | Descrição | Commit |
|------|-----------|--------|
| #1 | Estrutura inicial do projeto, home, landing, shells | — |
| #2 | Admin dashboard + NTX modules (KYC, WaaS, Gamificação) | — |
| #3 | Fluxo de excursões (wizard, landing, viagens-grupo) | — |
| #4 | Social commerce, convites, split Pix excursões | — |
| #5 | Catálogo de excursões, busca por localização, ViaCEP | — |
| #6 | Perfil por hierarquia de usuário, notificações, configurações | — |
| #7 | Páginas admin adicionais, relógio de operação, CRM | `fb0fb425` |
| #8 | Mapa Leaflet real (SearchMapPanel + OSM tiles) | `e88e7b23` |
| #18 | Fundação documental — 14 arquivos de documentação operacional | `2ac0bce` |
| #9 | Sprint 0 — Auditoria + Estrutura-Base | ver chain `8e3e43c`→`2354ff3` |
| #10 | Sprint 1 — Design System + Layout System | `5639124` |
| #11 | Sprint 2+3 — Componentes + Catálogo /ingressos | ver push atual |
| #12 | Sprint 4 — Combo IA | ver push atual |
| #13 | Sprint 5 — Checkout Pix Completo | ver push atual |
| #14 | Sprint 6 — Sucesso + Voucher PDF Único | ver push atual |
| #15 | Sprint 6b — Sincronização de Catálogo + OpenAPI | ver push atual |
| #16 | Sprint 7 — Admin Métricas Reais + Pós-Pagamento | `f6320ea` |
| #17 | Módulo de Clima Open-Meteo (paralelo) | ver codebase |

---

## Estado atual detalhado

### O que existe e funciona hoje

- Fluxo `/ingressos → /ingressos/checkout → /ingressos/sucesso` (demo mode completo)
- Voucher PDF gerado no backend (pdfkit + qrcode), QR errorCorrectionLevel H, 240×240px
- `GET /api/orders/:id` — dados do pedido
- `GET /api/orders/:id/voucher` — PDF binary com `Content-Disposition: attachment`
- `SuccessHero` + `OrderSummaryCard` + `VoucherDownloadCard` (estados idle/loading/success/error)
- Carrinho persistente em localStorage (`cart-store.ts`) + reidratação no mount + multi-aba (StorageEvent)
- `PrimaryButton`, `SecondaryButton` em `client/src/components/ui/` (size sm/md/lg, loading, disabled, data-testid)
- `StatusBadge` estendido com PAID/APPROVED/PENDING/CANCELLED/EXPIRED/FAILED
- `LoadingSkeleton variant="card"` integrado em `/ingressos`
- `CartStickyBar` com safe-area-inset + `tickets_checkout_start` analytics
- Grid de ingressos com stepper, badges, Combo IA (15% via PricingEngine)
- Mapa Leaflet real com 14 pontos em `/mapa-caldas-novas`
- Admin dashboard com métricas reais via `GET /api/admin/metrics`
- Shells de layout: `PublicPageShell`, `CatalogPageShell`, `AdminShell`, `AppMobileShell`, `AuthPageShell`
- CSS tokens RSV360 em `client/src/index.css` + design tokens TypeScript em `client/src/tokens/`
- WhatsApp WaaS (demo mode), Gamificação (PostgreSQL), KYC biométrico
- Tipos Zod: `Product`, `CartItem`, `OrderCustomer`, `Order`, `PaymentMethod`, `OrderStatus` em `shared/schema.ts`
- Backend pricing server-side: `ticket-catalog.ts` (24 IDs), `PricingEngine`, `UnknownTicketError`
- Checkout: react-hook-form + zodResolver, 5 componentes standalone em `client/src/components/checkout/`
- Polling de status Pix para em terminais via `isTerminal()`
- **[Fase 07]** `post-payment-orchestrator.service.ts` — `Promise.allSettled` para geração de voucher + entrega
- **[Fase 07]** `notification.service.ts` — envio por WhatsApp e e-mail (demo/SMTP)
- **[Fase 07]** `voucher-delivery.service.ts` — entrega + enqueue de pendências
- **[Fase 07]** `retry-queue.service.ts` — fila em memória de entregas pendentes
- **[Fase 07]** `GET /api/admin/metrics` — métricas reais do orderStore
- **[Fase 07]** `POST /api/admin/orders/:id/resend` — reenvio manual pelo admin
- **[Fase 07c]** Módulo de clima Open-Meteo: `server/providers/open-meteo-provider.ts`, `server/services/weather-service.ts`, `server/lib/weather-cache.ts`, `server/utils/weather-normalizer.ts`, `server/utils/weather-validators.ts`, `server/utils/weather-code-map.ts`
- **[Fase 07c]** `GET /api/weather` + `GET /api/weather/by-coords` + `POST /internal/weather/warmup`
- **[Fase 07c]** Frontend: `WeatherCard.tsx`, `useWeather.ts`, `weather-api.ts`, `WeatherPreviewSection.tsx`

### O que está pendente (Fase 08)

- Logging estruturado JSON ausente
- Rate limiting ausente
- Proteção de voucher por HMAC ausente (link usa ID sequencial)
- `.env.example` ausente
- Healthcheck `GET /api/status` ausente
- Separação de filas por tipo ausente
- Alertas críticos no admin ausentes
- `docs/runbook.md` ausente

---

## Próximo passo exato

1. Iniciar Sprint 8 — Hardening, Observabilidade e Segurança (Task #3 — Replit Agent)
