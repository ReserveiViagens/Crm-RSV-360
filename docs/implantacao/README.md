# README — Documentação Operacional de Implantação RSV360

Esta pasta centraliza o plano, o status, o handoff, o changelog e as fases da implantação do projeto RSV360.

---

## Estrutura

| Arquivo | Função |
|---------|--------|
| `00-PLANO-MESTRE.md` | Plano geral com todas as fases e critérios de passagem |
| `01-STATUS-GERAL.md` | Status atual de cada fase e cada task de agente |
| `02-HANDOFF-ATUAL.md` | Onde parou, o que foi feito, o que falta, próximo passo exato |
| `03-CHANGELOG-IMPLEMENTACAO.md` | Histórico completo de mudanças por data e commit |
| `CHECKPOINT-ATUAL.md` | Checkpoint da rodada atual — sobrescrever a cada nova rodada |
| `fases/` | Checklists detalhados por fase (FASE-00 a FASE-08) |

---

## Ordem de leitura para agentes

1. `/AGENTS.md`
2. `/PROJECT_STATE.md`
3. `README.md` (este arquivo)
4. `01-STATUS-GERAL.md`
5. `CHECKPOINT-ATUAL.md`
6. `02-HANDOFF-ATUAL.md`
7. `00-PLANO-MESTRE.md`
8. `03-CHANGELOG-IMPLEMENTACAO.md`
9. `fases/` (fase correspondente ao trabalho atual)
10. Código real do repositório

---

## Convenção de status

| Símbolo | Significado |
|---------|-------------|
| `[x]` | Concluído (fim a fim, gate passado) |
| `[~]` | Implementado parcialmente |
| `[ ]` | Não iniciado |
| `[!]` | Bloqueado (motivo no arquivo da fase) |
| `[-]` | Cancelado / fora de escopo |

---

## Regra de continuidade entre rodadas

Ao encerrar uma rodada e iniciar uma nova tarefa, o agente **nunca reinicia o projeto do zero**. Ele deve:

1. Reler os arquivos operacionais na ordem acima
2. Auditar no código o que está marcado como concluído
3. Reutilizar o contexto já documentado
4. Incorporar novas tarefas ao plano vigente
5. Atualizar `CHECKPOINT-ATUAL.md`, `01-STATUS-GERAL.md`, `02-HANDOFF-ATUAL.md` e o changelog

---

## Regra de verdade

A documentação orienta, mas **a verdade depende do código auditado**:
- build funcionando
- integração real
- fluxo ponta a ponta validado

Se houver conflito entre documentação e código, o código auditado prevalece e a documentação deve ser corrigida.
