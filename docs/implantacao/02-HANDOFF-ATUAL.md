# 02 — HANDOFF ATUAL

**Atualizado em:** 2026-03-27  
**Fase atual:** Sprint 2+3 — Componentes Compartilhados + Catálogo /ingressos (Task #11) — **CONCLUÍDA**  
**Próxima fase:** Sprint 4 — Combo IA Motor + Pricing + API (Task #12)

---

## Onde o projeto está agora

Sprint 2+3 foi concluída com todos os entregáveis:

| Entregável | Status | Arquivo |
|-----------|--------|---------|
| PrimaryButton | `[x]` criado | `client/src/components/ui/primary-button.tsx` |
| SecondaryButton | `[x]` criado | `client/src/components/ui/secondary-button.tsx` |
| StatusBadge estendido | `[x]` PAID/APPROVED/PENDING/CANCELLED/EXPIRED/FAILED | `client/src/components/shells/index.tsx` |
| LoadingSkeleton variant="card" | `[x]` criado e integrado | `client/src/components/shells/index.tsx` |
| CartStickyBar safe-area | `[x]` atualizado | `client/src/components/CartStickyBar.tsx` |
| CartStickyBar analytics | `[x]` tickets_checkout_start | `client/src/components/CartStickyBar.tsx` |
| ingressos.tsx skeleton | `[x]` atualizado | `client/src/pages/ingressos.tsx` |
| FASE-02-componentes.md | `[x]` atualizado | `[x]` |
| FASE-03-ingressos.md | `[x]` atualizado | `[x]` |
| 01-STATUS-GERAL.md | `[x]` atualizado | Fases 2+3 → `[x]` |

---

## O que foi realizado até aqui (Tasks #1–#11)

- **T1–T7**: Estrutura base — home, landing, shells, admin, NTX modules. Commit: `fb0fb425`
- **T8**: Mapa Leaflet real em `/mapa-caldas-novas`. Commit: `e88e7b23`
- **T18**: Fundação documental — 14 arquivos criados via GitHub Contents API.
- **T9 (Sprint 0)**: Inventário de rotas, auditoria, gaps, tipos Zod. Chain: `8e3e43c`→`2354ff3`
- **T10 (Sprint 1)**: Token files TS (colors, spacing, layout, typography) + CSS vars. Commit: `5639124`
- **T11 (Sprint 2+3)**: PrimaryButton, SecondaryButton, StatusBadge estendido, LoadingSkeleton card, CartStickyBar melhorado

---

## Componentes criados/atualizados em Sprint 2+3

### Novos (Sprint 2)

```
client/src/components/ui/primary-button.tsx
  - Props: size (sm|md|lg), loading, disabled, data-testid
  - Variantes de tamanho: h-8/h-10/h-12

client/src/components/ui/secondary-button.tsx
  - Props: size (sm|md|lg), loading, disabled, data-testid
  - Variante outline com border-slate-200
```

### Modificados (Sprint 2+3)

```
client/src/components/shells/index.tsx
  - LoadingSkeleton: nova prop variant="card" | "default"
  - StatusBadge: tipos PAID/APPROVED/PENDING/CANCELLED/EXPIRED/FAILED adicionados
  - StatusBadge: data-testid={status-badge-${status}} adicionado

client/src/components/CartStickyBar.tsx
  - paddingBottom com env(safe-area-inset-bottom) para iOS
  - trackEvent("tickets_checkout_start") no clique do CTA

client/src/pages/ingressos.tsx
  - import LoadingSkeleton from @/components/shells
  - skeleton-loading substituído por <LoadingSkeleton variant="card" rows={4} />
```

---

## O que está parcial (pendente nas próximas sprints)

| Item | Status | Sprint alvo |
|------|--------|-------------|
| Backend combo engine + PricingEngine | `[ ]` | Sprint 4 |
| Voucher PDF com QR | `[~]` (TXT existe) | Sprint 6 |
| Admin métricas reais | `[~]` (hardcoded) | Sprint 7 |
| Post-payment orchestrator | `[ ]` | Sprint 7 |
| Logging + HMAC + rate limiting | `[ ]` | Sprint 8 |

---

## O que falta (pela ordem do plano)

1. **Sprint 4** — Backend combo engine + PricingEngine + API de recomendações
2. **Sprint 5** — Gate completo do checkout Pix (validações + fallback robusto)
3. **Sprint 6** — Voucher PDF com QR + sincronização de catálogo + OpenAPI
4. **Sprint 7** — Admin com dados reais + post-payment orchestrator
5. **Sprint 8** — Hardening (logging, HMAC, rate limit, runbook)

---

## Observações críticas (invariáveis)

- Não alterar hero azul, grid ou badges de `/ingressos`
- Não misturar `id` com `ticketId` no carrinho
- Não mover regra comercial (pricing, desconto) para o frontend
- Ingressos Pix = sem split; Excursões Pix = com split (serviços diferentes)
- Demo credentials: demo@reservei.com.br / demo123 (admin)
