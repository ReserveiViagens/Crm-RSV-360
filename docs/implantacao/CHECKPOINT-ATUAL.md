# CHECKPOINT-ATUAL

## Checkpoint
- Fase atual: Task 16 — Bootstrap local (env-file + build fix + sessão Redis)
- Branch atual: main
- Base branch: main
- Commit mais recente (Git): 321b692 — Merge pull request #8 from ReserveiViagens/test/orders-e2e-flow
- Status local: alterações não commitadas (bootstrap local + Pix demo + docs/runbook)

## Última validação
- npm run check: ✅ OK (2026-04-18)
- npm run build: ✅ OK (2026-04-18)
- npm run dev: ✅ OK (2026-04-18)
- redis-cli ping: ✅ PONG (2026-04-18)

## O que foi concluído nesta rodada
- [~] Removido chunking manual do Vite (corrige `React` undefined → erro `createContext`)
- [~] Scripts (`dev`/`build`/`start`) carregam `.env` via `--env-file=.env`
- [~] Sessão persistente via Redis Store quando `REDIS_URL` está definido (client `redis`)
- [~] Pix demo: QR Code válido + botão "Confirmar pagamento (demo)" na tela `/pedido/:id`
- [~] Runbook local criado: `docs/implantacao/RUNBOOK-LOCAL.md`

## Próximo passo exato
1. Pare o servidor atual (Ctrl+C) e rode `npm run dev`
2. Abra `http://127.0.0.1:5000/entrar` (evite `localhost` se der `ERR_CONNECTION_REFUSED`)
3. Logue `demo@reservei.com.br` / `demo123`
4. Vá em `/ingressos` → adicione item → `/ingressos/checkout` → gerar Pix
5. Na tela `/pedido/:id`, clique "Confirmar pagamento (demo)" e baixe o voucher PDF
