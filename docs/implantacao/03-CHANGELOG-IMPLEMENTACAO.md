# 03 — CHANGELOG DE IMPLEMENTAÇÃO RSV360

Histórico de implementação por data e commit. Atualizar a cada fase concluída.

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
