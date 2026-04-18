# RUNBOOK LOCAL — RSV360

Este guia serve para subir o RSV360 localmente (Windows/macOS/Linux) com Postgres e Redis opcionais, e ter um checklist rapido de troubleshooting.

## Pre-requisitos

- Node.js: recomendado Node 20 LTS (o repo pode funcionar em versoes mais novas, mas CI normalmente mira 20).
- NPM (ou pnpm/yarn, mas os scripts aqui assumem npm).
- Postgres: recomendado para o modulo de admin/website (Drizzle).
- Redis (opcional, recomendado): persistencia de sessao quando `REDIS_URL` estiver configurado.

## Setup (passo a passo)

1. Dependencias:
   - `npm install`

2. Variaveis:
   - Copie `.env.example` para `.env`
   - Ajuste pelo menos:
     - `DATABASE_URL`
     - `SESSION_SECRET`
     - `VOUCHER_SECRET`
     - `REDIS_URL` (se usar Redis)

3. Banco (Postgres):
   - Garanta que o banco do `DATABASE_URL` existe.
   - Aplique schema/migrations:
     - `npm run db:push`
   - Seed (opcional):
     - `npm run db:seed`

4. Validacao rapida (antes de rodar):
   - `npm run check`
   - `npm run build`

5. Subir o app:
   - Dev: `npm run dev`
   - Producao local (apos build): `npm run start`
   - URL: `http://localhost:5000`

## Smoke checklist (manual)

1. Healthcheck:
   - Abra `http://localhost:5000/api/status` e confirme `ok: true`

2. Login:
   - UI: `http://localhost:5000/entrar`
   - Demo: `demo@reservei.com.br` / `demo123`

3. Fluxo Ingressos:
   - `/ingressos` -> adicionar item -> ir para `/ingressos/checkout`
   - Concluir Pix (demo) -> ir para `/ingressos/sucesso`
   - Baixar voucher PDF

## Troubleshooting (comum)

- `DATABASE_URL, ensure the database is provisioned`
  - Causa: `DATABASE_URL` ausente/errada ao rodar comandos do Drizzle.
  - Fix: confirme `DATABASE_URL` no `.env` e que o Postgres esta acessivel.

- Postgres nao conecta (timeout / refused)
  - Causa: Postgres parado, porta errada, credenciais erradas, banco nao existe.
  - Fix: valide o `DATABASE_URL` e crie o banco. Exemplo:
    - `postgresql://postgres:postgres@localhost:5432/rsv360_crm`

- Redis nao conecta (quando `REDIS_URL` configurado)
  - Sintoma: erros de conexao no start.
  - Fix:
    - Se nao quiser Redis: remova `REDIS_URL` do `.env` (o app cai para MemoryStore).
    - Se quiser Redis: suba o Redis e confirme `REDIS_URL=redis://127.0.0.1:6379`.

- Browser em branco / erro de React (`createContext`)
  - Fix rapido: hard refresh (Ctrl+F5) e rode `npm run build` para confirmar bundle ok.

- Voucher retorna 401/403
  - 401: falta `token` e nao e sessao admin.
  - 403: token invalido.
  - Fix: use o link de voucher com `?token=...` ou teste via admin logado.

## Variaveis importantes (resumo)

- `PORT`: porta do servidor (padrao 5000).
- `DATABASE_URL`: Postgres (Drizzle).
- `SESSION_SECRET`: assinatura de sessao (nao usar default em prod).
- `SESSION_COOKIE_SECURE`: `true` em prod atras de HTTPS.
- `REDIS_URL`: habilita sessao persistente em Redis.
- `VOUCHER_SECRET`: HMAC para token de voucher (obrigatorio em prod).
- `GATEWAY_API_URL`/`GATEWAY_API_KEY`: se ausentes, pagamentos rodam em modo demo.

