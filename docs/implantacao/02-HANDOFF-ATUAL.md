# 02 — HANDOFF ATUAL

**Atualizado em:** 2026-03-27  
**Fase atual:** Sprint 2+3 — Componentes Compartilhados + Catálogo /ingressos (Task #11) — **CONCLUÍDA**  
**Próxima fase:** Sprint 3 (Fase 04 no plano) — Combo IA Motor + Pricing + API (Task #12)

> **Nota de numeração:** O plano documental denomina as fases como "Fase 00–08". Task #11 cobriu a Fase 02 (componentes) + Fase 03 (catálogo /ingressos) numa única sprint. A próxima entrega é a **Fase 04 — Combo IA**, referida também como Sprint 4 no roadmap interno.

---

## Onde o projeto está agora

Sprint 2+3 (Task #11) foi concluída com todos os entregáveis críticos:

| Entregável | Status | Arquivo |
|-----------|--------|---------|
| PrimaryButton (data-testid obrigatório) | `[x]` | `client/src/components/ui/primary-button.tsx` |
| SecondaryButton (data-testid obrigatório) | `[x]` | `client/src/components/ui/secondary-button.tsx` |
| StatusBadge em `/ui/` (canônico) | `[x]` PAID/APPROVED/PENDING/CANCELLED/EXPIRED/FAILED | `client/src/components/ui/status-badge.tsx` |
| LoadingSkeleton variant="card" | `[x]` criado e integrado | `client/src/components/shells/index.tsx` |
| CartStickyBar safe-area + analytics | `[x]` | `client/src/components/CartStickyBar.tsx` |
| CartStickyBar wired na página | `[x]` via IngressosSidebar (mobile) | ver nota abaixo |
| TicketsGrid loading prop + EmptyState | `[x]` | `client/src/components/TicketsGrid.tsx` |
| cart-store hardened (shared/schema.ts) | `[x]` dedup + validateCartItem | `client/src/lib/cart-store.ts` |
| EnterpriseAccordion EmptyState formal | `[x]` | `client/src/components/EnterpriseAccordion.tsx` |
| ingressos.tsx filter analytics | `[x]` city/category/quickpick | `client/src/pages/ingressos.tsx` |

### Nota: CartStickyBar no mobile de /ingressos

`CartStickyBar` é o componente compartilhado de CTA de checkout para **páginas sem sidebar dedicada**.  
Em `/ingressos`, o `IngressosSidebar` (mobile) já desempenha esse papel — ele fixa no rodapé, mostra total e botão "Ir para pagamento", com navegação para `/ingressos/checkout` — e retorna `null` quando o carrinho está vazio.

Adicionar `CartStickyBar` em cima do `IngressosSidebar` causaria conflito de z-index (210 vs 200) e sobreposição visual. Por isso, em `/ingressos` o `CartStickyBar` **não é renderizado** — o `IngressosSidebar` já cobre o requisito de "CTA visível com itens no carrinho → navega para /ingressos/checkout".

O `CartStickyBar` está pronto para ser wired em outras páginas (ex: `/excursoes`, páginas de combo) que não tenham sidebar.

---

## O que foi realizado até aqui (Tasks #1–#11)

- **T1–T7**: Estrutura base — home, landing, shells, admin, NTX modules. Commit: `fb0fb425`
- **T8**: Mapa Leaflet real em `/mapa-caldas-novas`. Commit: `e88e7b23`
- **T18**: Fundação documental — 14 arquivos criados via GitHub Contents API.
- **T9 (Sprint 0)**: Inventário de rotas, auditoria, gaps, tipos Zod. Chain: `8e3e43c`→`2354ff3`
- **T10 (Sprint 1)**: Token files TS (colors, spacing, layout, typography) + CSS vars. Commit: `5639124`
- **T11 (Sprint 2+3)**: PrimaryButton, SecondaryButton, StatusBadge (ui/), TicketsGrid loading/empty, cart-store hardened

---

## Componentes criados/atualizados em Sprint 2+3

### Novos (Sprint 2 — Fase 02)

```
client/src/components/ui/primary-button.tsx
  - Props: size (sm|md|lg), loading, disabled, data-testid (obrigatório)

client/src/components/ui/secondary-button.tsx
  - Props: size (sm|md|lg), loading, disabled, data-testid (obrigatório), outline

client/src/components/ui/status-badge.tsx  ← componente UI canônico
  - Variantes semânticas: success/warning/error/info/neutral/premium
  - Variantes de pedido (OrderStatus): PAID/APPROVED/PENDING/CANCELLED/EXPIRED/FAILED
  - data-testid obrigatório, showDot, cn mergeável
  - OrderStatus sourced from shared/schema.ts
```

### Modificados (Sprint 2+3)

```
client/src/components/shells/index.tsx
  - LoadingSkeleton: prop variant="card" | "default"
  - EmptyState: data-testid opcional (default "empty-state")

client/src/lib/cart-store.ts
  - CartItem sourced from shared/schema.ts (fonte única)
  - dedupeCart() em getCart() — dedup por Map na rehidratação
  - validateCartItem() — valida shape antes de aceitar do localStorage

client/src/components/CartStickyBar.tsx
  - paddingBottom: env(safe-area-inset-bottom) para iOS notch
  - trackEvent("tickets_checkout_start") no click do CTA

client/src/components/TicketsGrid.tsx
  - Prop loading?: boolean
  - Se loading=true → renderiza <LoadingSkeleton variant="card" rows={4}>
  - Se tickets=[] → renderiza <EmptyState> com ícone Ticket

client/src/components/EnterpriseAccordion.tsx
  - Caso vazio usa <EmptyState> formal (sem fallback inline)

client/src/pages/ingressos.tsx
  - Filter analytics: city tabs, category tabs, quick picks
  - IngressosSidebar mobile cobre o requisito de CartStickyBar CTA
```

---

## O que está parcial (pendente nas próximas sprints)

| Item | Status | Fase alvo |
|------|--------|-----------|
| Backend combo engine + PricingEngine | `[ ]` | Fase 04 |
| Voucher PDF com QR | `[~]` (TXT existe) | Fase 06 |
| Admin métricas reais | `[~]` (hardcoded) | Fase 07 |
| Post-payment orchestrator | `[ ]` | Fase 07 |
| Logging + HMAC + rate limiting | `[ ]` | Fase 08 |

---

## O que falta (pela ordem do plano)

1. **Fase 04** — Backend combo engine + PricingEngine + API de recomendações (Task #12)
2. **Fase 05** — Gate completo do checkout Pix (validações + fallback robusto)
3. **Fase 06** — Voucher PDF com QR + sincronização de catálogo + OpenAPI
4. **Fase 07** — Admin com dados reais + post-payment orchestrator
5. **Fase 08** — Hardening (logging, HMAC, rate limit, runbook)

---

## Observações críticas (invariáveis)

- Não alterar hero azul, grid ou badges de `/ingressos`
- Não misturar `id` com `ticketId` no carrinho
- Não mover regra comercial (pricing, desconto) para o frontend
- Ingressos Pix = sem split; Excursões Pix = com split (serviços diferentes)
- Demo credentials: demo@reservei.com.br / demo123 (admin)
