# 02 — HANDOFF ATUAL

**Atualizado em:** 2026-03-27  
**Fase atual:** Sprint 0 — Auditoria + Estrutura-Base (Task #9) — **CONCLUÍDA**  
**Próxima fase:** Sprint 1 — Design System + Layout System (Task #10)

---

## Onde o projeto está agora

Sprint 0 foi concluída com todos os entregáveis:

| Entregável | Status | Arquivo |
|-----------|--------|---------|
| AGENTS.md | `[x]` criado | `AGENTS.md` |
| Plano mestre | `[x]` criado | `docs/implantacao/00-PLANO-MESTRE.md` |
| Status geral | `[x]` atualizado | `docs/implantacao/01-STATUS-GERAL.md` |
| Handoff (este) | `[x]` atualizado | `docs/implantacao/02-HANDOFF-ATUAL.md` |
| Changelog | `[x]` criado | `docs/implantacao/03-CHANGELOG-IMPLEMENTACAO.md` |
| Arquivos de fase | `[x]` 9 arquivos | `docs/implantacao/fases/FASE-00` a `FASE-08` |
| Inventário de rotas | `[x]` criado | `docs/ROUTES_INVENTORY.md` |
| Auditoria de rotas | `[x]` criado | `docs/AUDIT.md` |
| Gaps priorizados | `[x]` criado | `docs/GAPS.md` |
| Tipos Zod | `[x]` adicionados | `shared/schema.ts` (Product, CartItem, OrderCustomer, Order, PaymentMethod, OrderStatus) |

---

## O que foi realizado até aqui (Tasks #1–#9)

- **T1–T7**: Estrutura base — home, landing, shells, admin, NTX modules (KYC, WaaS, Gamificação, Perfil, Convites, Split Pix, Catálogo, Busca, Ranking). Commit: `fb0fb425`
- **T8**: Mapa Leaflet real em `/mapa-caldas-novas`. Commit: `e88e7b23`
- **T18**: Fundação documental — 14 arquivos criados e pushados via GitHub Contents API.
- **T9 (Sprint 0)**: Inventário de rotas, auditoria, gaps, tipos Zod. Commit: `ecdc503`

---

## O que está parcial (pendente nas próximas sprints)

| Item | Status | Sprint alvo |
|------|--------|-------------|
| Token files TS (`client/src/tokens/`) | `[ ]` | Sprint 1 |
| Backend combo engine + PricingEngine | `[ ]` | Sprint 4 |
| Voucher PDF com QR | `[~]` (TXT existe) | Sprint 6 |
| Admin métricas reais | `[~]` (hardcoded) | Sprint 7 |
| Post-payment orchestrator | `[ ]` | Sprint 7 |
| Logging + HMAC + rate limiting | `[ ]` | Sprint 8 |

---

## O que falta (pela ordem do plano)

1. **Sprint 1** — Token files TypeScript em `client/src/tokens/`
2. **Sprint 2** — Padronização de componentes base (PrimaryButton, SecondaryButton, EmptyState)
3. **Sprint 3** — Catálogo `/ingressos` com gate completo
4. **Sprint 4** — Backend combo engine + PricingEngine + API de recomendações
5. **Sprint 5** — Gate completo do checkout Pix (validações + fallback robusto)
6. **Sprint 6** — Voucher PDF com QR + sincronização de catálogo + OpenAPI
7. **Sprint 7** — Admin com dados reais + post-payment orchestrator
8. **Sprint 8** — Hardening (logging, HMAC, rate limit, runbook)

---

## Arquivos alterados em Sprint 0

- `docs/ROUTES_INVENTORY.md` (criado)
- `docs/AUDIT.md` (criado)
- `docs/GAPS.md` (criado)
- `shared/schema.ts` (atualizado — Product, CartItem, Order, PaymentMethod, OrderStatus)
- `docs/implantacao/01-STATUS-GERAL.md` (atualizado)
- `docs/implantacao/02-HANDOFF-ATUAL.md` (este arquivo)

---

## Último commit de produto

`ecdc503` — Sprint 0: Auditoria + Estrutura-Base (Task #9)

---

## Próximo commit recomendado (Sprint 1)

```
feat(fase-01): design system — token files TS + layout system
```

---

## Observações críticas (invariáveis)

- Não alterar hero azul, grid ou badges de `/ingressos`
- Não misturar `id` com `ticketId` no carrinho
- Não mover regra comercial (pricing, desconto) para o frontend
- Ingressos Pix = sem split; Excursões Pix = com split (serviços diferentes)
- Demo credentials: demo@reservei.com.br / demo123 (admin)
