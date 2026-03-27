# 01 — STATUS GERAL DA IMPLANTAÇÃO

**Última atualização:** 2026-03-27  
**Branch atual:** `main`  
**Último commit estável:** `e88e7b23` (Task #8 — Mapa Leaflet Real)  
**Responsável atual:** Replit Agent  
**Próxima ação recomendada:** Iniciar Sprint 0 — Auditoria + Estrutura-Base (Task #9)

---

## Resumo por fase (novo plano de sprints)

> **Convenção de status:** `[ ]` = sprint não executado (gate não passou) · `[~]` = código existe parcialmente mas gate nunca foi executado · `[x]` = sprint concluído com gate formal.  
> Fases 1, 2, 3, 5 e 6 estão `[~]` porque código relacionado foi criado em Tasks #1–#8, mas ainda falta fechar os gaps específicos de cada sprint e executar o gate. Fases 0, 4, 7 e 8 estão `[ ]` porque não há código relevante ainda.

| Fase | Nome | Status |
|------|------|--------|
| 00 | Auditoria + Estrutura-Base | `[ ]` não iniciado |
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

Estas tasks foram concluídas antes do plano de sprints. O código já está no repositório.

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

### O que está parcial ou faltando

- Tipos compartilhados (`Product`, `CartItem`, `Order`, etc.) não formalizados em Zod
- Token files TypeScript (`client/src/tokens/`) não criados
- Backend de recomendação (`affinity-map`, `combo-engine`, `PricingEngine`) não implementado
- Voucher PDF (apenas TXT hoje)
- Métricas do admin hardcoded (não lê do banco)
- Post-payment orchestrator ausente
- Logging estruturado ausente
- Rate limiting ausente
- Proteção de voucher por HMAC ausente
- Documentação formal: `docs/AUDIT.md`, `docs/ROUTES_INVENTORY.md`, `docs/GAPS.md` não existem

---

## Próximo passo exato

1. Aguardar aprovação do usuário para Task #9 (Sprint 0 — Auditoria + Estrutura-Base)
2. Ao aprovar: executar Sprint 0 seguindo `fases/FASE-00-auditoria.md`
3. Ao concluir Sprint 0: atualizar este arquivo + handoff + fazer push
