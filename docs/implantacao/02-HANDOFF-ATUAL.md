# 02 — HANDOFF ATUAL

**Atualizado em:** 2026-03-27  
**Fase atual:** Sprint 0 — Auditoria + Estrutura-Base (Task #9) — CONCLUÍDA  
**Próxima fase:** Sprint 1 — Design System + Layout System (Task #10)

---

## Onde o projeto parou

Sprint 0 — Auditoria + Estrutura-Base (Task #9) foi concluída.  
O repositório agora tem a fundação documental completa e os tipos Zod canônicos.

Entregáveis desta sprint:
- `AGENTS.md` na raiz (instrução para agentes)
- `docs/implantacao/` com plano mestre, status, handoff, changelog e 9 arquivos de fase
- `docs/ROUTES_INVENTORY.md` — inventário completo de 60+ rotas frontend e 80+ endpoints backend
- `docs/GAPS.md` — 15 gaps priorizados por impacto no fluxo comprável
- `shared/schema.ts` — schemas Zod para `Product`, `CartItem`, `OrderCustomer`, `Order`, `PaymentMethod`, `OrderStatus`

---

## O que foi realizado até aqui (Tasks #1–#8)

- **T1–T7**: Estrutura base completa — home, landing, shells, admin dashboard, NTX modules (KYC, WaaS, Gamificação, Perfil, Convites, Split Pix excursões, Catálogo de excursões, Busca por localização, Ranking de organizadores). Commit: `fb0fb425`
- **T8**: Mapa Leaflet real em `/mapa-caldas-novas` com OSM tiles, 14 pins, toggle Mapa/Lista, polyline de rota IA. Commit: `e88e7b23`

---

## O que está parcial (ponto de vista do novo plano)

| Item | Status | Detalhe |
|------|--------|---------|
| Tipos compartilhados | `[~]` | `shared/schema.ts` existe mas `Product`, `Order`, `PaymentMethod` não formalizados como Zod |
| Token files TS | `[ ]` | `client/src/tokens/` não existe — CSS tokens só em `index.css` |
| Combo IA backend | `[ ]` | Frontend tem hardcoded 15%, sem `affinity-map`, `combo-engine` ou `PricingEngine` no backend |
| Voucher PDF | `[~]` | Página `/ingressos/sucesso` existe com download TXT, mas sem PDF/QR de alta qualidade |
| Admin métricas | `[~]` | Dashboard existe mas dados são hardcoded |
| Post-payment | `[ ]` | Nenhum orchestrator pós-pagamento implementado |
| Documentação formal | `[ ]` | `docs/AUDIT.md`, `ROUTES_INVENTORY.md`, `GAPS.md` não existem |

---

## O que falta (pela ordem do plano)

1. Sprint 0 — Auditoria formal (`AUDIT.md`, `ROUTES_INVENTORY.md`, `GAPS.md`) + tipos Zod
2. Sprint 1 — Token files TypeScript em `client/src/tokens/`
3. Sprint 2 — Padronização de componentes base (PrimaryButton, SecondaryButton, EmptyState)
4. Sprint 3 — Backend combo engine + PricingEngine + API de recomendações
5. Sprint 4 — Gate completo do checkout Pix (validações + fallback robusto)
6. Sprint 5 — Voucher PDF com QR alto contraste
7. Sprint 6 — Sincronização de catálogo + OpenAPI
8. Sprint 7 — Admin com dados reais + post-payment orchestrator
9. Sprint 8 — Hardening (logging, HMAC, rate limit, runbook)

---

## Arquivos alterados por último

- `AGENTS.md` (criado agora)
- `docs/implantacao/00-PLANO-MESTRE.md` (criado agora)
- `docs/implantacao/01-STATUS-GERAL.md` (criado agora)
- `docs/implantacao/02-HANDOFF-ATUAL.md` (este arquivo)
- `docs/implantacao/03-CHANGELOG-IMPLEMENTACAO.md` (criado agora)
- `docs/implantacao/fases/FASE-00-*.md` a `FASE-08-*.md` (criados agora)

---

## Último commit útil de produto

`e88e7b23` — Task #8: Mapa Leaflet Real (Caldas Novas)

---

## Próximo commit recomendado (Sprint 0)

```
feat(fase-00): conclui auditoria, tipos compartilhados e documentação viva
```

Com corpo:
```
- cria docs/AUDIT.md, ROUTES_INVENTORY.md, GAPS.md
- formaliza Product, CartItem, Order, PaymentMethod, OrderStatus em shared/schema.ts
- atualiza STATUS-GERAL (Fase 0 → [x]), HANDOFF-ATUAL (próximo: Sprint 1)
- git push origin main
```

---

## Próximo passo exato para Sprint 0

1. Executar `npm run build` e confirmar 0 erros TypeScript (baseline)
2. Mapear todas as rotas em `client/src/App.tsx` → `docs/ROUTES_INVENTORY.md`
3. Mapear todos os endpoints em `server/routes.ts` → `docs/ROUTES_INVENTORY.md`
4. Gerar `docs/AUDIT.md` com status de cada rota/endpoint
5. Gerar `docs/GAPS.md` com gaps priorizados pelo impacto no fluxo comprável
6. Formalizar em `shared/schema.ts`: `Product`, `CartItem`, `OrderCustomer`, `Order`, `PaymentMethod`, `OrderStatus`
7. Atualizar `01-STATUS-GERAL.md` (Fase 0 → `[x]`)
8. Commitar + push: `docs(fase-00): conclui auditoria e estrutura de documentação viva`

---

## Observações críticas

- Não alterar hero azul, grid ou badges de `/ingressos`
- Não misturar `id` com `ticketId` no carrinho
- Não mover regra comercial (pricing, desconto) para o frontend
- Ingressos Pix = sem split; Excursões Pix = com split (regras diferentes em serviços diferentes)
