# AGENTS.md — RSV360 (Reservei Viagens)

Leia nesta ordem antes de alterar qualquer coisa neste projeto:

1. `docs/implantacao/01-STATUS-GERAL.md` — qual fase está ativa agora
2. `docs/implantacao/02-HANDOFF-ATUAL.md` — onde parou, o que falta, próximo passo exato
3. `docs/implantacao/fases/FASE-XX-*.md` — checklist detalhado da fase em execução

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
- `docs(implantacao): adiciona plano mestre, status geral e handoff atual`

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
