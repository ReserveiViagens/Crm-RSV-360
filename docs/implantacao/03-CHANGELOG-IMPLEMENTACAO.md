# 03-CHANGELOG-IMPLEMENTACAO

## 2026-04-17
### Task 16 — Bootstrap local (env-file + build fix + sessão Redis)
- Removido `manualChunks` do `vite.config.ts` (havia dependência circular entre chunks; `React` ficava `undefined` e o browser quebrava com `createContext`)
- Scripts agora carregam `.env` via `--env-file=.env` (`dev`, `build`, `start`, `db:seed`, `catalog:sync`)
- Sessão persistente via Redis Store quando `REDIS_URL` está definido (`server/index.ts`)
- Ajuste defensivo em contexts do Form (`client/src/components/ui/form.tsx`)
- Status: pendente validar no browser (hard refresh) que o erro `createContext` sumiu

## 2026-03-31
### Task 11 — Pipeline CI com check/build/e2e
- Criado `.github/workflows/ci-e2e.yml` com pipeline completo
- Triggers: push main, pull_request main
- Steps: checkout, setup Node 20, npm ci, playwright install, check, build, e2e
- Upload de relatório Playwright como artefato (30 dias retenção)
- Criado README.md com badge CI e documentação básica
- Validação: PR #8 merged com sucesso
- Commit: 321b692 — Merge pull request #8
- Branch: main

## 2026-03-31
### Task 10 — E2E tests para fluxo de pedidos
- Instalado Playwright com Chromium browser
- Configurado `playwright.config.ts` com webServer e cross-env para Windows
- Criado `tests/e2e/orders-flow.spec.ts` com 3 cenários:
  - PENDING → APPROVED (voucher display)
  - FAILED → retry (carrinho restaurado + prefill buyer data)
  - EXPIRED → retry contextual
- Estabilizados seletores com `data-testid` (input-email, input-firstName, etc.)
- Corrigida navegação checkout `/ingressos-checkout` → `/ingressos/checkout`
- Validação: npm run e2e 3/3 passando
- Commit: cbb9864 — test(orders): adiciona e estabiliza fluxo e2e de pedidos
