# 02 — HANDOFF ATUAL

**Atualizado em:** 2026-03-27  
**Fase atual:** Sprint 1 — Design System + Layout System (Task #10) — **CONCLUÍDA**  
**Próxima fase:** Sprint 2 — Componentes Compartilhados (Task #11)

---

## Onde o projeto está agora

Sprint 1 foi concluída com todos os entregáveis:

| Entregável | Status | Arquivo |
|-----------|--------|---------|
| Token de cores | `[x]` criado | `client/src/tokens/colors.ts` |
| Token de espaçamento | `[x]` criado | `client/src/tokens/spacing.ts` |
| Token de layout | `[x]` criado | `client/src/tokens/layout.ts` |
| Token de tipografia | `[x]` criado | `client/src/tokens/typography.ts` |
| Barrel export | `[x]` criado | `client/src/tokens/index.ts` |
| CSS custom props | `[x]` adicionados | `client/src/index.css` (`--page-width-*`, `--surface-*`, `--section-gap-*`) |
| Shells auditados | `[x]` confirmados | `client/src/components/layouts/` (5 shells + PageContainer + SectionContainer) |
| `01-STATUS-GERAL.md` | `[x]` atualizado | Fase 1 → `[x]` |
| `FASE-01-foundation.md` | `[x]` atualizado | Checklist marcado como completo |

---

## O que foi realizado até aqui (Tasks #1–#10)

- **T1–T7**: Estrutura base — home, landing, shells, admin, NTX modules. Commit: `fb0fb425`
- **T8**: Mapa Leaflet real em `/mapa-caldas-novas`. Commit: `e88e7b23`
- **T18**: Fundação documental — 14 arquivos criados via GitHub Contents API.
- **T9 (Sprint 0)**: Inventário de rotas, auditoria, gaps, tipos Zod. Chain: `8e3e43c`→`2354ff3`
- **T10 (Sprint 1)**: Token files TS (colors, spacing, layout, typography) + CSS vars (--page-width-*, --surface-*, --section-gap-*)

---

## Arquitetura de tokens após Sprint 1

```
client/src/tokens/
  colors.ts      — brand, semantic, surface, border, text, neutral palette
  spacing.ts     — scale rem 0–32 + sectionGap (sm/md/lg/xl)
  layout.ts      — pageWidths, sidebarWidths, gutters, breakpoints
  typography.ts  — fontSizes, fontWeights, lineHeights, letterSpacings, headings, body
  index.ts       — barrel re-export
```

CSS custom properties adicionadas em `index.css`:
- `--page-width-{public|catalog|admin|app|auth}` — usadas pelos shells
- `--section-gap-{sm|md|lg|xl}` — usadas pelo SectionContainer
- `--surface-{page|card|sidebar|subtle|overlay}` — aliases dos --rsv-surface-*

---

## O que está parcial (pendente nas próximas sprints)

| Item | Status | Sprint alvo |
|------|--------|-------------|
| Padronização de componentes base | `[~]` parcial | Sprint 2 |
| Backend combo engine + PricingEngine | `[ ]` | Sprint 4 |
| Voucher PDF com QR | `[~]` (TXT existe) | Sprint 6 |
| Admin métricas reais | `[~]` (hardcoded) | Sprint 7 |
| Post-payment orchestrator | `[ ]` | Sprint 7 |
| Logging + HMAC + rate limiting | `[ ]` | Sprint 8 |

---

## O que falta (pela ordem do plano)

1. **Sprint 2** — Padronização de componentes base (PrimaryButton, SecondaryButton, EmptyState)
2. **Sprint 3** — Catálogo `/ingressos` com gate completo
3. **Sprint 4** — Backend combo engine + PricingEngine + API de recomendações
4. **Sprint 5** — Gate completo do checkout Pix (validações + fallback robusto)
5. **Sprint 6** — Voucher PDF com QR + sincronização de catálogo + OpenAPI
6. **Sprint 7** — Admin com dados reais + post-payment orchestrator
7. **Sprint 8** — Hardening (logging, HMAC, rate limit, runbook)

---

## Arquivos alterados em Sprint 1

- `client/src/tokens/colors.ts` (criado)
- `client/src/tokens/spacing.ts` (criado)
- `client/src/tokens/layout.ts` (criado)
- `client/src/tokens/typography.ts` (criado)
- `client/src/tokens/index.ts` (criado)
- `client/src/index.css` (atualizado — vars --page-width-*, --surface-*, --section-gap-*)
- `docs/implantacao/01-STATUS-GERAL.md` (atualizado)
- `docs/implantacao/02-HANDOFF-ATUAL.md` (este arquivo)
- `docs/implantacao/fases/FASE-01-foundation.md` (atualizado)

---

## Próximo commit recomendado (Sprint 2)

```
feat(fase-02): componentes compartilhados — PrimaryButton, SecondaryButton, EmptyState
```

---

## Observações críticas (invariáveis)

- Não alterar hero azul, grid ou badges de `/ingressos`
- Não misturar `id` com `ticketId` no carrinho
- Não mover regra comercial (pricing, desconto) para o frontend
- Ingressos Pix = sem split; Excursões Pix = com split (serviços diferentes)
- Demo credentials: demo@reservei.com.br / demo123 (admin)
