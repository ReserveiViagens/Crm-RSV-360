# AGENTS.md — RSV360 (Reservei Viagens)

Leia nesta ordem antes de alterar qualquer coisa neste projeto:

1. `AGENTS.md` (este arquivo)
2. `PROJECT_STATE.md` — estado atual, invariantes, checklist de entrada
3. `docs/implantacao/README.md` — visão geral da documentação operacional
4. `docs/implantacao/01-STATUS-GERAL.md` — qual fase está ativa agora
5. `docs/implantacao/CHECKPOINT-ATUAL.md` — onde parou na última rodada
6. `docs/implantacao/02-HANDOFF-ATUAL.md` — o que falta, próximo passo exato
7. `docs/implantacao/00-PLANO-MESTRE.md` — plano geral de fases
8. `docs/implantacao/03-CHANGELOG-IMPLEMENTACAO.md` — histórico de mudanças
9. `docs/implantacao/fases/` — checklist detalhado da fase em execução
10. Código real do repositório

---

## REGRA DE CONTINUIDADE ENTRE RODADAS

Sempre que uma rodada for concluída e uma nova tarefa for iniciada, você deve:

1. Reler os arquivos operacionais do repositório na ordem acima
2. Validar no código o que realmente foi concluído
3. Reutilizar o contexto já documentado, sem reiniciar o projeto do zero
4. Incorporar novas tarefas ao plano atual, à fase atual ou a uma nova fase documentada
5. Atualizar `CHECKPOINT-ATUAL.md`, `01-STATUS-GERAL.md`, `02-HANDOFF-ATUAL.md`, a fase correspondente e o changelog quando aplicável
6. Continuar sempre do último passo realmente concluído e validado no código

**Nunca ignore o histórico operacional existente.**  
**Nunca trate novas tarefas como um contexto isolado se elas pertencem ao mesmo projeto.**  
Em caso de dúvida entre reiniciar ou reutilizar contexto, reutilize o contexto documentado e audite o código.

---

## Regras obrigatórias

1. **Não alterar fases `[x]` sem registrar motivo** — se precisar mudar algo já concluído, documente o motivo no `03-CHANGELOG-IMPLEMENTACAO.md` antes de alterar.
2. **Marcar `[~]` quando parcial** — nunca marque `[x]` se a implementação não estiver fim a fim funcionando.
3. **Atualizar status + handoff no mesmo commit do código** — todo commit de código deve atualizar junto `01-STATUS-GERAL.md`, `02-HANDOFF-ATUAL.md` e o arquivo da fase correspondente.
4. **Sempre registrar próximo passo exato** — o `02-HANDOFF-ATUAL.md` deve ter o próximo passo em formato executável (itens numerados, nomes de arquivo concretos).

---

## Convenção de status

```
[x] concluído (fim a fim, gate passado)
[~] implementado parcialmente
[ ] não iniciado
[!] bloqueado (motivo no arquivo da fase)
[-] cancelado / fora de escopo
```

---

## Padrão de commit

```
tipo(fase-XX): ação principal

- o que foi feito
- o que está parcial
- atualiza STATUS-GERAL, HANDOFF-ATUAL e FASE-XX
- próximo passo: ...
```

Exemplos:
- `feat(fase-03): implementa CartStickyBar e conclui catálogo /ingressos`
- `fix(fase-04): corrige trigger do ComboIA após dismiss`
- `docs(handoff): atualiza status da Fase 3 e próximo passo`
- `fix(ux): remove auto-open do TravelerProfileModal em páginas catálogo`

---

## Sequência de fases

| Fase | Nome | Arquivo |
|------|------|---------|
| 00 | Auditoria + Estrutura-Base | `FASE-00-auditoria.md` |
| 01 | Design System + Layout System | `FASE-01-foundation.md` |
| 02 | Componentes Compartilhados | `FASE-02-componentes.md` |
| 03 | Catálogo /ingressos com Carrinho | `FASE-03-ingressos.md` |
| 04 | Combo IA — Motor + Pricing + API | `FASE-04-combo-ia.md` |
| 05 | Checkout Pix Completo | `FASE-05-checkout-pix.md` |
| 06 | Sucesso + Voucher PDF Único | `FASE-06-sucesso-voucher.md` |
| 07 | Admin com Métricas Reais + Pós-Pagamento | `FASE-07-admin-operacao.md` |
| 08 | Hardening, Observabilidade e Segurança | `FASE-08-hardening.md` |

---

## Stack resumida

- **Frontend**: React 18 + TypeScript + Vite + TanStack Query v5 + wouter + shadcn/ui
- **Backend**: Node.js + Express + TypeScript (ESM via tsx)
- **Banco**: PostgreSQL + Drizzle ORM (users em Postgres; excursões/reservas em memória)
- **Repo GitHub**: `ReserveiViagens/Crm-RSV-360` (branch: `main`)
- **Credenciais demo**: `demo@reservei.com.br` / `demo123`

---

## Arquivos críticos a NÃO alterar sem entender bem

- `client/src/pages/ingressos.tsx` — hero azul, grid, Combo IA, badges PRESERVADOS
- `client/src/lib/cart-store.ts` — carrinho localStorage com `ticketId` como chave
- `server/services/ticket-payment.service.ts` — Pix de ingresso (sem split)
- `shared/schema.ts` — tipos compartilhados
- `client/src/components/shells/index.tsx` — 5 shells + componentes base
- `client/src/components/caldas-ai-floating-agent.tsx` — chat abre direto, sem Step 1
- `client/src/components/ai-conversion-elements.tsx` — TravelerProfileModal só por clique explícito

---

## Saída obrigatória antes de codar (nova rodada)

Informar:
- fase atual real
- subfase atual real
- último passo realmente concluído
- itens marcados como concluídos mas ainda parciais
- pendências imediatas
- próximo passo exato
