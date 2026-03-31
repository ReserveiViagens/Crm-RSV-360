# 03-CHANGELOG-IMPLEMENTACAO

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