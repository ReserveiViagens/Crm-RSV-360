# FASE 06 — SUCESSO + VOUCHER PDF ÚNICO

**Status geral:** `[~]` Parcial  
**Branch:** `main`  
**Último commit relacionado:** `fb0fb425`  
**Estimativa:** 4–5 dias úteis

---

## Objetivo

Encerrar a jornada de compra com confirmação forte e voucher único pronto para uso real — legível no celular, QR de alto contraste (errorCorrectionLevel H), ordenação correta e download seguro.

---

## O que já existe

- Página `/ingressos/sucesso` com confirmação, download TXT, suporte WhatsApp, cross-sell de hotéis
- Download TXT (comprovante básico) via `Blob` + `URL.createObjectURL`
- Cross-sell de 3 cards de hotel após a compra

---

## Checklist da fase

### 06.1 — Backend: Rotas de pedido
- [ ] Implementar `GET /api/orders/:id` — dados do pedido
- [ ] Implementar `GET /api/orders/:id/tickets` — itens do pedido
- [ ] Implementar `GET /api/orders/:id/voucher` — retorna PDF (application/pdf)
- [ ] Implementar `GET /api/orders/:id/receipt` — comprovante (opcional, pode ser o voucher)

### 06.2 — Backend: VoucherPdfService
- [ ] Criar `server/services/voucher-pdf.service.ts`
- [ ] Biblioteca de renderização (ex: `@react-pdf/renderer` ou HTML + Puppeteer)
- [ ] Sem `@import` remoto (fontes inline ou base64)
- [ ] QR code com `errorCorrectionLevel: 'H'`, tamanho mínimo 200×200px
- [ ] Ordenação: hotel > parque > add-on
- [ ] Layout retrato, mobile-first (legível em 375px)

### 06.3 — Backend: Template do voucher
- [ ] Criar em `server/templates/voucher/`:
  - [ ] Capa (logo RSV360 + número do pedido)
  - [ ] Item principal (hotel)
  - [ ] Itens secundários (parque + add-ons)
  - [ ] Instruções de uso
  - [ ] QR code de alto contraste

### 06.4 — Frontend: Página /ingressos/sucesso
- [x] Página existe com estrutura básica
- [ ] Reescrever/completar com `SuccessHero`, `OrderSummaryCard`, `VoucherDownloadCard`
- [ ] TanStack Query para buscar dados do pedido via `orderId` da URL
- [ ] Mostrar: itens comprados, total pago, economia do combo (se aplicado)

### 06.5 — Frontend: Componentes de sucesso
- [ ] Criar `SuccessHero` — animação/ícone de confirmação + título forte
- [ ] Criar `OrderSummaryCard` — itens, total, economia
- [ ] Criar `VoucherDownloadCard` — botão de download com estado loading/sucesso/erro
  - [ ] Chama `GET /api/orders/:id/voucher` e força download do PDF

### 06.6 — Gate de validação + docs + push
- [ ] Build + typecheck OK
- [ ] Smoke: fluxo demo → sucesso → baixar PDF → verificar QR legível no celular
- [ ] Confirmar que PDF é legível em 375px
- [ ] Atualizar `01-STATUS-GERAL.md`: Fase 6 → `[x]`
- [ ] Atualizar `02-HANDOFF-ATUAL.md`
- [ ] Commitar com `feat(fase-06): conclui sucesso e voucher PDF único`
- [ ] `git push origin main`

---

## Implementado nesta fase

_(preencher ao concluir)_

---

## Pendências

_(preencher ao concluir)_

---

## Bloqueios

_(nenhum identificado)_

---

## Critério de conclusão

A fase só vira `[x]` quando:
- PDF gerado no backend com layout mobile-first
- QR com `errorCorrectionLevel: 'H'` e tamanho ≥200×200px
- Download funciona no Safari iOS e Chrome Android (testado manualmente)
- Commit + push feitos
