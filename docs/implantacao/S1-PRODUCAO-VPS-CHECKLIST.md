# Checklist — S1 (Crm-RSV-360) produção / VPS

**Data:** 2026-07-16  
**Motivo:** incidente local OOM (exit 134 / `JavaScript heap out of memory`) após ~2h36 em `npm run dev` (heap ~19 MB → ~3,95 GB).  
**Escopo:** operação e paridade de build — sem mudança de código neste documento.

---

## 0) Não negociável

| # | Item | OK |
|---|------|----|
| 0.1 | **Nunca** rodar `npm run dev` / `tsx` / Vite HMR na VPS | ☐ |
| 0.2 | Artefato = `npm run build` + `npm start` (ou `node dist/...` equivalente) | ☐ |
| 0.3 | Mesmo commit/SHA validado no CI (ou tag de release) — **não** deploy a partir de working tree suja | ☐ |
| 0.4 | Smoke D2.1 / health do S1 (e, se coexistência, smoke S2) **contra o artefato de produção** antes do cutover | ☐ |

---

## 1) Paridade de build (lição do health.js vs health.ts)

O episódio D2.1 mostrou Docker local servindo shape diferente do CI porque havia **dois handlers** e builds diferentes.

| # | Item | OK |
|---|------|----|
| 1.1 | Build na VPS usa o **mesmo** `Dockerfile` / script de build do CI (ou documenta desvio) | ☐ |
| 1.2 | Confirmar que não há arquivos sombra (`.js` + `.ts` na mesma rota) no commit de release | ☐ |
| 1.3 | Após deploy: `curl -sS https://<host>/health` (ou rota canônica) e validar JSON esperado | ☐ |
| 1.4 | Registrar SHA deployado + hora + quem aprovou (changelog operacional) | ☐ |

---

## 2) Runtime e memória (anti-OOM)

Evidência do crash local:

```
FATAL ERROR: Ineffective mark-compacts near heap limit
Allocation failed - JavaScript heap out of memory
exit_code: 134
```

| # | Item | OK |
|---|------|----|
| 2.1 | Process manager: **PM2** ou **systemd** com `Restart=always` (ou `on-failure`) | ☐ |
| 2.2 | Limite de memória com restart controlado (ex.: PM2 `max_memory_restart: 800M` — ajustar à VPS) | ☐ |
| 2.3 | **Não** “resolver” só com `--max-old-space-size` sem investigar retenção | ☐ |
| 2.4 | Alertar se o processo reiniciar > N vezes / hora | ☐ |
| 2.5 | VPS com RAM adequada ao RSS real de produção (dev chegou a ~4 GB RSS — prod deve ser menor, mas planejar headroom) | ☐ |

### Exemplo PM2 (referência — ajustar paths)

```bash
# Após build
pm2 start dist/index.cjs --name s1-crm --max-memory-restart 800M
pm2 save
```

---

## 3) Logs (heap + LGPD)

| # | Item | OK |
|---|------|----|
| 3.1 | Em produção: **não** logar body completo de `/api/search` (nem payloads grandes de clima/busca) | ☐ |
| 3.2 | Logs: status, latência, `request_id` — sem PII/lista completa de resultados | ☐ |
| 3.3 | Rotação de logs (disk) e retenção definida | ☐ |
| 3.4 | Follow-up código: mini-PR no S1 para silenciar dump de body em prod (fila separada, pós merges S2) | ☐ |

---

## 4) Integração S1 ↔ S2

| # | Item | OK |
|---|------|----|
| 4.1 | `RSV360_BACKEND_URL` aponta para backend S2 interno/HTTPS correto (não `localhost` de outra máquina) | ☐ |
| 4.2 | `SSO_BFF_SECRET` idêntico ao S2 (secret manager / env da VPS — nunca commit) | ☐ |
| 4.3 | Cookies/sessão: HTTPS + flags adequadas em prod (`Secure`, `HttpOnly`, `SameSite`) | ☐ |
| 4.4 | Health S1 + health S2 monitorados (uptime) | ☐ |

---

## 5) Pré-deploy smoke (artefato de produção)

Rodar **depois** do `build`/`start` (ou container) na staging/VPS, não contra `dev`:

```bash
curl -sS -o /dev/null -w "%{http_code}\n" http://127.0.0.1:5000/health
# Esperado: 200

# Se coexistência com S2 no mesmo host/rede:
curl -sS -o /dev/null -w "%{http_code}\n" http://127.0.0.1:3002/api/v1/orcamentos/health
```

| # | Item | OK |
|---|------|----|
| 5.1 | `/health` (S1) = 200 | ☐ |
| 5.2 | Login smoke (credencial de staging, sem PII em log) | ☐ |
| 5.3 | Uma rota B2C crítica (ex. `/hoteis`) = 200 | ☐ |
| 5.4 | Proxy/SSO para S2 (se ativo) smoke mínimo | ☐ |

---

## 6) Observabilidade mínima pós-go-live

| # | Item | OK |
|---|------|----|
| 6.1 | Métrica ou log de RSS/heap (ou restart count PM2) | ☐ |
| 6.2 | Alerta disco (lição CI “No space left on device”) | ☐ |
| 6.3 | Runbook de rollback: voltar tag/SHA anterior + restart | ☐ |

---

## Referências

- Incidente OOM local: log terminal S1 ~2026-07-16 (heap monitor interno `[heap]`).
- Dívida S2: apertar assert D2.1 canônico após estabilizar main (#96).
- Mini-PR futuro S1: não logar body de `/api/search` em produção.
