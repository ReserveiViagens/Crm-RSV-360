# CHECKPOINT-ATUAL

## Checkpoint
- Fase atual: Task 16 — Bootstrap local (env-file + build fix + sessão Redis)
- Branch atual: main
- Base branch: main
- Commit mais recente (Git): 321b692 — Merge pull request #8 from ReserveiViagens/test/orders-e2e-flow
- Status local: alterações não commitadas (correção runtime + env + sessão)

## Última validação
- npm run build: ✅ OK (2026-04-17)
- npm run start: [~] pendente validação no browser (erro `createContext`)
- redis-cli ping: ✅ PONG (2026-04-17)

## O que foi concluído nesta rodada
- [~] Removido chunking manual do Vite (corrige `React` undefined → erro `createContext`)
- [~] Scripts (`dev`/`build`/`start`) carregam `.env` via `--env-file=.env`
- [~] Sessão persistente via Redis Store quando `REDIS_URL` está definido

## Próximo passo exato
1. Pare o servidor atual (Ctrl+C) e rode `npm run start`
2. Abra `http://localhost:5000` e faça hard refresh (Ctrl+F5)
3. Confirmar que não aparece mais: `Cannot read properties of undefined (reading 'createContext')`
4. Testar login `demo@reservei.com.br` / `demo123`
5. (Opcional) Confirmar sessão no Redis: `redis-cli keys "rsv360:sess:*"`
