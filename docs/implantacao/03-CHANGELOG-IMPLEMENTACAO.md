# 03 — CHANGELOG DE IMPLEMENTAÇÃO RSV360

Histórico de implementação por data e commit. Atualizar a cada fase concluída.

---

## 2026-03-27 — Task #9 (Sprint 0): Auditoria + Estrutura-Base

**Commit final:** `8e3e43c`  
**Responsável:** Replit Agent

### Objetivo
Estabelecer a fundação documental viva e formalizar os tipos compartilhados de domínio.

### Entregáveis
- `docs/ROUTES_INVENTORY.md` — inventário de 60+ rotas frontend e 80+ endpoints backend com legenda de fonte de dados
- `docs/AUDIT.md` — auditoria completa de implementação por rota/endpoint (status `[x]`/`[~]`/`[ ]` + coluna Dados)
- `docs/GAPS.md` — 15 gaps priorizados por impacto no fluxo comprável (prioridade 1–5, cada um com sprint alvo)
- `shared/schema.ts` atualizado com:
  - `PaymentMethodSchema` / `PaymentMethod` (PIX | CARTAO | DINHEIRO)
  - `OrderStatusSchema` / `OrderStatus` (PENDING | PAID | APPROVED | CANCELLED | EXPIRED | FAILED)
  - `productSchema` / `Product` / `InsertProduct`
  - `cartItemSchema` / `CartItem`
  - `orderCustomerSchema` / `OrderCustomer`
  - `orderSchema` / `Order` / `InsertOrder`
- `01-STATUS-GERAL.md` — Fase 00 marcada `[x]`, legenda completa com `[!]`/`[-]`, path FASE-01 correto
- `02-HANDOFF-ATUAL.md` — totalmente atualizado para estado pós-Sprint-0, refs de commit normalizadas

### Decisões de design
- `OrderStatus.APPROVED` mantido para compatibilidade com `ticket-payment.service.ts` (gateway usa "approved")
- `productSchema.image` sem `.url()` (catálogo atual usa caminhos relativos de asset)
- `ROUTES_INVENTORY.md` e `AUDIT.md` usam legendas complementares (dados vs. implementação) — ver nota no topo do `ROUTES_INVENTORY.md`

### Gate
- `npx tsc --noEmit` → 0 erros
- Todos os arquivos pushados para GitHub via Contents API (HTTP 200/201)

---

## 2026-03-27 — Task #18: Fundação Documental

**Commits:** Arquivos criados via GitHub Contents API sobre baseline `fb0fb425` (Task #7) + `e88e7b23` (Task #8)  
**Commits locais Replit:** `a537132c` (transição plan→build), `2ac0bce` (docs commit)  
**Responsável:** Replit Agent

### O que foi criado
- `AGENTS.md` na raiz — instrução para todos os agentes
- `docs/implantacao/00-PLANO-MESTRE.md` — plano completo das 9 fases
- `docs/implantacao/01-STATUS-GERAL.md` — painel de status em tempo real
- `docs/implantacao/02-HANDOFF-ATUAL.md` — handoff para continuidade
- `docs/implantacao/03-CHANGELOG-IMPLEMENTACAO.md` — este arquivo
- `docs/implantacao/fases/FASE-00-auditoria.md` a `FASE-08-hardening.md` — checklists detalhados

### Estado do projeto neste momento
- Tasks históricas #1–#8 concluídas (código no repositório)
- Plano de 9 sprints (Fases 0–8) definido e documentado
- Fases 0, 4, 7 e 8: não iniciadas
- Fases 1, 2, 3, 5 e 6: parcialmente implementadas (ver detalhes em `01-STATUS-GERAL.md`)

---

## 2026-03-27 — Tasks #1–#8: Base do Produto (histórico)

**Commits relevantes:**  
- `fb0fb425` — Tasks #1–#7: estrutura base, admin, NTX modules
- `e88e7b23` — Task #8: Mapa Leaflet Real (Caldas Novas)

### Resumo do que foi construído

**Frontend (Tasks #1–#8):**
- Home, landing, shells de layout (5 famílias)
- Admin dashboard com NTX section (WaaS, KYC, Gamificação)
- Fluxo de excursões: wizard 5 passos, landing pública, viagens-grupo com 5 abas
- Social commerce: convites, split Pix, vouchers
- Catálogo de excursões com busca por localização (ViaCEP)
- Perfil por hierarquia (Visitante/Passageiro/Organizador/Admin)
- Página /ingressos: 5 parques, stepper, carrinho localStorage, Combo IA (hardcoded 15%), filtros
- Checkout Pix de ingresso (sem split) → sucesso (download TXT)
- Mapa Leaflet com 14 pins OSM, toggle Mapa/Lista, polyline de rota IA

**Backend:**
- Express REST API (`server/routes.ts`)
- Persistência em memória para excursões, reservas, grupos, social commerce
- PostgreSQL para users e gamificação (Drizzle ORM)
- WebSocket para tempo real (`/ws`)
- WhatsApp WaaS (Evolution API, demo mode)
- Split Pix para excursões, Pix simples para ingressos
- ANTT manifests, FNRH ficha, voucher VIP (PDF)

---

## Template para próximas entradas

```
## YYYY-MM-DD — Sprint N: Nome da Fase

**Commits:** `abcdef1`, `abcdef2`
**Branch:** main
**Responsável:** [Replit Agent / nome]

### O que foi implementado
- item 1
- item 2

### O que está parcial
- item (motivo)

### Gate de passagem
- [x] build OK
- [x] lint OK
- [x] typecheck OK
- [x] smoke OK
- [x] checklist manual OK
```
