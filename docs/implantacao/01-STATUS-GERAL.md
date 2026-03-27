# 01 — STATUS GERAL DA IMPLANTAÇÃO

**Última atualização:** 2026-03-27  
**Branch atual:** `main`  
**Último commit de produto:** `ecdc503` (Sprint 0 — Auditoria + Estrutura-Base concluída)  
**Responsável atual:** Replit Agent  
**Próxima ação recomendada:** Iniciar Sprint 1 — Design System + Layout System (Task #10)

---

## Resumo por fase (plano de sprints)

> **Convenção de status:** `[ ]` = sprint não executado (gate não passou) · `[~]` = código existe parcialmente mas gate nunca foi executado · `[x]` = sprint concluído com gate formal.

| Fase | Nome | Status |
|------|------|--------|
| 00 | Auditoria + Estrutura-Base | `[x]` concluído (Sprint 0 — Task #9) |
| 01 | Design System + Layout System | `[~]` parcial (shells + CSS tokens existem; token files TS e gate pendentes) |
| 02 | Componentes Compartilhados | `[~]` parcial (muitos componentes existem; padronização e gate pendentes) |
| 03 | Catálogo /ingressos com Carrinho | `[~]` parcial (página funcional; gaps em analytics e gate pendentes) |
| 04 | Combo IA — Motor + Pricing + API | `[ ]` não iniciado (frontend hardcoded, sem backend) |
| 05 | Checkout Pix Completo | `[~]` parcial (fluxo existe em demo mode; gate formal pendente) |
| 06 | Sucesso + Voucher PDF Único | `[~]` parcial (sucesso com TXT existe; PDF/QR de alta qualidade e gate pendentes) |
| 07 | Admin Métricas Reais + Pós-Pagamento | `[ ]` não iniciado (métricas hardcoded, sem orchestrator) |
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
| #9 | Sprint 0 — Auditoria + Estrutura-Base | `ecdc503` |

---

## Estado atual detalhado

### O que existe e funciona hoje

- Fluxo `/ingressos → /ingressos/checkout → /ingressos/sucesso` (demo mode)
- Carrinho persistente em localStorage (`cart-store.ts`)
- 5 parques com stepper, badges, Combo IA (hardcoded 15%)
- Mapa Leaflet real com 14 pontos em `/mapa-caldas-novas`
- Admin dashboard com métricas (ainda hardcoded)
- Shells de layout: `PublicPageShell`, `CatalogPageShell`, `AdminShell`, `AppMobileShell`, `AuthPageShell`
- CSS tokens RSV360 em `client/src/index.css`
- WhatsApp WaaS (demo mode), Gamificação (PostgreSQL), KYC biométrico
- Tipos Zod: `Product`, `CartItem`, `OrderCustomer`, `Order`, `PaymentMethod`, `OrderStatus` em `shared/schema.ts`
- Documentação viva: `docs/ROUTES_INVENTORY.md`, `docs/GAPS.md`, `docs/AUDIT.md`

### O que está parcial ou faltando (backlog)

- Token files TypeScript (`client/src/tokens/`) não criados — Sprint 1
- Backend de recomendação (`affinity-map`, `combo-engine`, `PricingEngine`) não implementado — Sprint 4
- Voucher PDF (apenas TXT hoje) — Sprint 6
- Métricas do admin hardcoded (não lê do banco) — Sprint 7
- Post-payment orchestrator ausente — Sprint 7
- Logging estruturado ausente — Sprint 8
- Rate limiting ausente — Sprint 8
- Proteção de voucher por HMAC ausente — Sprint 8

---

## Próximo passo exato

1. Aguardar aprovação do usuário para Task #10 (Sprint 1 — Design System + Layout System)
2. Ao aprovar: executar Sprint 1 seguindo `fases/FASE-01-design-system.md`
3. Ao concluir Sprint 1: atualizar este arquivo + handoff + fazer push
