# 00 — PLANO MESTRE RSV360

**Versão:** 1.0  
**Data de criação:** 2026-03-27  
**Repositório:** `ReserveiViagens/Crm-RSV-360` (branch: `main`)  
**Status:** Ativo — em execução

> Este documento é quase imutável. Mudanças de escopo exigem registro no `03-CHANGELOG-IMPLEMENTACAO.md`.

---

## Visão geral

RSV360 é uma plataforma brasileira de compra de ingressos e pacotes para os parques aquáticos de Caldas Novas e Rio Quente. O objetivo do plano é tornar o caminho principal **comprável de ponta a ponta**: `/ingressos` → Combo IA → Checkout Pix → Sucesso/Voucher.

---

## Filosofia de execução

- **Uma fase por vez.** Só iniciar a próxima após gate aprovado.
- **Gate obrigatório ao final de cada fase:** build OK + lint OK + typecheck OK + smoke OK + checklist manual OK + docs atualizados + commit + push.
- **Documentação no mesmo commit do código.** Nunca separe.
- **Regras inegociáveis (não alterar sem aprovação explícita):**
  - Hero azul em `/ingressos` (gradient `#0891B2 → #2563EB`)
  - Grid de cards (nunca lista)
  - Combo IA preservado
  - Altura do card estável
  - `data-testid` em todos os elementos interativos

---

## Convenção de status

```
[x] concluído (gate passado)
[~] implementado parcialmente
[ ] não iniciado
[!] bloqueado
[-] cancelado / fora de escopo
```

---

## Sequência obrigatória de execução

### Fase 00 — Auditoria + Estrutura-Base
**Objetivo:** Levantar o estado real, criar documentação viva (`docs/implantacao/`), formalizar tipos compartilhados.  
**Gate:** `npm run build` OK + docs completos + commit + push.  
**Arquivo:** `fases/FASE-00-auditoria.md`

### Fase 01 — Design System + Layout System
**Objetivo:** Criar tokens de cor/espaçamento/tipografia (`client/src/tokens/`) e componentes de layout reutilizáveis, sem redesign.  
**Gate:** Build OK + `/`, `/ingressos`, `/admin/dashboard` sem quebra visual + commit + push.  
**Arquivo:** `fases/FASE-01-foundation.md`

### Fase 02 — Componentes Compartilhados
**Objetivo:** Padronizar biblioteca base: `PrimaryButton`, `SecondaryButton`, `StatusBadge`, `LoadingSkeleton`, `EmptyState`.  
**Gate:** Build OK + todos os componentes com `data-testid` + commit + push.  
**Arquivo:** `fases/FASE-02-componentes.md`

### Fase 03 — Catálogo /ingressos com Carrinho
**Objetivo:** Garantir que o fluxo `/ingressos` está completo: grid, stepper, carrinho persistente, analytics mínimos.  
**Gate:** Smoke completo add → stepper → CartStickyBar → checkout + commit + push.  
**Arquivo:** `fases/FASE-03-ingressos.md`

### Fase 04 — Combo IA — Motor + Pricing + API
**Objetivo:** Transformar Combo IA em motor real com backend de recomendação, `PricingEngine` centralizado e trigger inteligente.  
**Gate:** Wizard abre após add, skip funciona, sem reabertura após dismiss + commit + push.  
**Arquivo:** `fases/FASE-04-combo-ia.md`

### Fase 05 — Checkout Pix Completo
**Objetivo:** Checkout Pix confiável: formulário validado, QR real ou fallback demo, polling de status, redirecionamento para sucesso.  
**Gate:** Fluxo demo completo + fallback sem gateway + commit + push.  
**Arquivo:** `fases/FASE-05-checkout-pix.md`

### Fase 06 — Sucesso + Voucher PDF Único
**Objetivo:** Página de sucesso forte e voucher PDF mobile-first com QR de alto contraste (errorCorrectionLevel H).  
**Gate:** PDF legível em 375px + QR lido no celular + commit + push.  
**Arquivo:** `fases/FASE-06-sucesso-voucher.md`

### Fase 07 — Admin com Métricas Reais + Automação Pós-Pagamento
**Objetivo:** Admin com dados reais e pós-pagamento automatizado via `Promise.allSettled` (falha no canal ≠ reversão da compra).  
**Gate:** Pedido PAID → voucher gerado → delivery pendente no admin + commit + push.  
**Arquivo:** `fases/FASE-07-admin-operacao.md`

### Fase 08 — Hardening, Observabilidade e Segurança
**Objetivo:** Logging estruturado, proteção de voucher (UUID + HMAC), rate limit, filas separadas, runbook.  
**Gate:** Voucher não previsível + 429 em rate limit + falha visível no admin + commit + push.  
**Arquivo:** `fases/FASE-08-hardening.md`

---

## Métricas de sucesso do plano completo

- Fluxo `/ingressos → checkout → sucesso → voucher` 100% funcional em demo mode
- Zero dados hardcoded no admin dashboard
- Voucher PDF legível no celular com QR de alto contraste
- Pedido confirmado nunca depende de sucesso de notificação
- Logs estruturados em todos os serviços críticos
- Link de voucher não previsível (UUID + HMAC)

---

## Arquivos críticos a preservar

| Arquivo | O que preservar |
|---------|----------------|
| `client/src/pages/ingressos.tsx` | Hero azul, grid, Combo IA, badges, altura do card |
| `client/src/lib/cart-store.ts` | Chave `ticketId`, persistência localStorage |
| `server/services/ticket-payment.service.ts` | Pix sem split (ingressos ≠ excursões) |
| `client/src/components/shells/index.tsx` | 5 shells do design system |
| `shared/schema.ts` | Tipos existentes (nunca remover sem motivo) |
