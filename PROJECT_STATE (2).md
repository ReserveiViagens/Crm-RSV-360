# PROJECT_STATE.md
# ESTADO ATUAL DO PROJETO — RSV360

Leia este arquivo logo após `AGENTS.md`.

---

## REGRA DE REENTRADA OPERACIONAL

Ao iniciar qualquer nova tarefa neste projeto, **não comece do zero**.  
Reutilize sempre o contexto documentado em `CHECKPOINT-ATUAL.md`, `01-STATUS-GERAL.md`, `02-HANDOFF-ATUAL.md` e nos arquivos de fase.  
Se existirem novas tarefas, **integre-as ao plano vigente** antes de implementar.  
A verdade do projeto é o código auditado, não apenas o checklist.

---

## Status rápido

**Fase atual:** Pós-Fase 08 — Ciclo UX/UI concluído  
**Subfase atual:** —  
**Último passo registrado:** Fix TravelerProfileModal auto-open removido de atracoes/hoteis/promocoes/leiloes  
**Próximo passo registrado:** Aguardar nova demanda; próximas frentes: deploy produção, testes E2E, PostgreSQL persistente  
**Último commit relevante:** `9129a72` — Prevent profile modal from opening automatically on page load  
**Branch atual recomendada:** `main`  
**Repositório GitHub:** `ReserveiViagens/Crm-RSV-360`  
**Responsável/ambiente atual:** Replit Agent

---

## Projeto

**Nome:** RSV360 — Plataforma de Reservas Caldas Novas & Rio Quente  
**Stack:** React 18 + TypeScript + Vite + TanStack Query v5 + wouter + shadcn/ui (frontend) / Node.js + Express + TypeScript (backend)  
**Credenciais demo:** `demo@reservei.com.br` / `demo123` (role: admin)

---

## Princípio de verdade

Se houver conflito entre documentação e código, **o código auditado prevalece** e a documentação deve ser corrigida.

---

## Checklist de entrada para nova rodada

- [ ] Li `AGENTS.md`
- [ ] Li `PROJECT_STATE.md`
- [ ] Li `docs/implantacao/README.md`
- [ ] Li `docs/implantacao/00-PLANO-MESTRE.md`
- [ ] Li `docs/implantacao/01-STATUS-GERAL.md`
- [ ] Li `docs/implantacao/CHECKPOINT-ATUAL.md`
- [ ] Li `docs/implantacao/02-HANDOFF-ATUAL.md`
- [ ] Auditei no código o que está marcado como concluído
- [ ] Identifiquei o próximo passo exato

---

## Arquivos críticos a NÃO alterar sem entender bem

- `client/src/pages/ingressos.tsx` — hero azul, grid, Combo IA, badges PRESERVADOS
- `client/src/lib/cart-store.ts` — carrinho localStorage com `ticketId` como chave
- `server/services/ticket-payment.service.ts` — Pix de ingresso (sem split)
- `shared/schema.ts` — tipos compartilhados
- `client/src/components/shells/index.tsx` — 5 shells + componentes base
- `client/src/components/caldas-ai-floating-agent.tsx` — chat abre direto, sem Step 1
- `client/src/components/ai-conversion-elements.tsx` — TravelerProfileModal só por clique

---

## Invariantes que nunca mudam

- Hero azul `/ingressos`: gradiente `#0891B2 → #2563EB`
- Grid nunca vira lista no catálogo de ingressos
- Combo IA nunca removido (`recommendation.service.ts`)
- TravelerProfileModal abre apenas por ação explícita do usuário
- MobileCTABar retorna null (oculta)
- CaldasAiFloatingAgent: botão oculto quando chat está aberto
