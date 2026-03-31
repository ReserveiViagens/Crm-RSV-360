# 03-CHANGELOG-IMPLEMENTACAO

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
- Branch: test/orders-e2e-flow

## 2026-03-31
### Task 9 — Pré-preencher dados do comprador no retry
- Adicionada `CheckoutCustomerPrefill` type e funções `setCheckoutPrefill()`, `getCheckoutPrefill()`, `clearCheckoutPrefill()` em cart-store.ts
- Atualizado backend `/api/orders/:id` para expor phone e cpf no customer object
- Implementada lógica de prefill em ingressos.tsx (busca dados via `/api/orders/:id` e armazena)
- Pré-preenchimento automático em ingressos-checkout.tsx (campos firstName, lastName, email, phone, cpf)
- Limpeza de prefill após criação de pagamento para evitar persistência
- Validação: npm run check OK, npm run build OK
- Commit: f17e053 — feat(orders): preenche dados do comprador no retry de pedidos
- Branch: main

## 2026-03-31
### Task 8 — Restaurar carrinho do pedido anterior no retry
- Adicionada função `replaceCart()` em cart-store.ts com deduplicação e event dispatch
- Atualizado order-status.tsx com `&restore=1` no query string para EXPIRED/FAILED
- Implementada lógica de restore em ingressos.tsx com 3 states (loading, done, error)
- Adicionado banner contextual com 4 estados (loading, sucesso, erro, info)
- Adicionados ícones AlertCircle e Loader2 ao imports de ingressos.tsx
- Validação: npm run check OK, npm run build OK
- Commit: 7e58d35 — feat(orders): restaura carrinho no retry de pedidos
- Branch: feat/orders-retry-context

## 2026-03-29
- Correção de exports de tipos em componentes UI
- Ajuste de tipagem em SectionContainer
- Ajuste de integração em promocoes.tsx com FilterChips
- Correção da chamada de createSplitPaymentPix
- Validação concluída com npm run check e npm run build