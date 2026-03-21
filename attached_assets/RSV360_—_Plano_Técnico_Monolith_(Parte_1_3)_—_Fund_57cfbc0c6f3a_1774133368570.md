# RSV360 — Plano Técnico Monolith (Parte 1/3) — Fundamentos + Arquitetura + Regras

## Como usar este documento (para implementação)

Este monólito é a **fonte de verdade** da Parte 1/3 do plano. Ele foi escrito para ser lido por humanos e também por um agente/LLM dentro do seu ambiente de desenvolvimento.

Regras de leitura/execução:

1. Leia a seção “Restrições inegociáveis” antes de modificar qualquer coisa.
2. Implemente por módulos, na ordem sugerida.
3. Não “refatore por estética”: preserve UI/UX e contratos de rota/IDs.
4. Use os checklists por módulo para validar.

Nota sobre Replit:

- Eu **não consigo** conectar diretamente esta página ao Replit por você.
- Mas esta página foi estruturada para ser **copiada/espelhada** no Replit (README, docs/) ou ser consumida por um agente no seu fluxo (por exemplo, colar como contexto/requirements).

---

# 0) Sumário da Parte 1/3

1. Diretriz mestra
2. Arquitetura e visão geral do fluxo
3. Mapa de arquivos
4. UI/UX — ordem de renderização
5. Regras do card + stepper
6. Combo IA
7. Filtros + badges + urgência
8. Checkout + API + Pix
9. Página de sucesso + comprovante
10. Analytics + QA
11. data-testid obrigatórios
12. Regras de preservação (inegociáveis)
13. Catálogo hardcoded
14. Relações “também comprou”
15. Paleta + animações + estados
16. Checklist final da Parte 1

---

# 1) Diretriz mestra (System Directive)

Você é um desenvolvedor sênior mantendo o ecossistema RSV360. Antes de propor, analisar ou modificar qualquer código relacionado ao fluxo de ingressos, leia o documento integralmente. Ele contém mapeamento da arquitetura, regras de negócio e restrições absolutas. Não faça suposições que contrariem essas diretrizes.

---

# 2) Arquitetura e visão geral do fluxo

## 2.1 Rotas principais

O módulo de ingressos é dividido em 3 rotas:

1. `/ingressos`
    - Catálogo
    - Carrinho
    - Filtros
    - Sugestão via “Combo IA”
2. `/ingressos/checkout`
    - Formulário de dados do cliente
    - Geração de QR Code Pix
    - Polling de pagamento
3. `/ingressos/sucesso?txn=ID`
    - Confirmação
    - Resumo do pedido
    - Download de voucher/comprovante
    - Cross-sell de hotéis

## 2.2 Fluxo de estados (alto nível)

- Usuário navega catálogo → adiciona itens (cart store) → inicia checkout → cria transação Pix → faz polling → sucesso/expiração/falha → página de sucesso + download.

---

# 3) Mapa de arquivos envolvidos

(Conforme o plano)

- `ingressos.tsx`
    - catálogo, stepper, state do carrinho, filtros e Combo IA
- `ingressos-checkout.tsx`
    - formulário, QR Pix e polling
- `ingressos-sucesso.tsx`
    - confirmação, download e cross-sell
- `cart-store.ts`
    - store via localStorage
- `analytics.ts`
    - buffer de eventos
- `ticket-payment.service.ts`
    - criação de Pix com fallback demo
- `routes.ts`
    - rotas REST de pagamentos

---

# 4) UI/UX — ordem estrita de renderização (/ingressos)

## 4.1 Ordem de renderização (não negociar)

1. Hero com **gradiente azul**
2. Logo RSV360
3. H1: “Ingressos para Parques”
4. Badge countdown vermelho
5. Abas de filtro
6. Banners de prova social (Social Proof)
7. “Combo IA” (gradiente roxo-pink)
8. Grid de cards (catálogo)
9. Seção de cross-sell de hotéis

## 4.2 Elementos flutuantes

- Barra de carrinho quando `cart.length > 0`
- Botão WhatsApp quando `cart.length === 0`
- Barra de comparação quando `compareIds.length >= 1`

Checklist UI/UX:

- [ ]  Ordem acima respeitada
- [ ]  Elementos flutuantes aparecem somente nas condições
- [ ]  Grid permanece grid (não virar lista)

---

# 5) Regras do Card e Stepper (catálogo)

## 5.1 Regras

- Quando `qty = 0`: mostrar botão “Comprar Agora”.
- Quando `qty > 0`: mostrar stepper numérico.
- O card **não pode mudar de altura** na transição.
- Botão de subtração vira **lixeira vermelha** quando `qty === 1`.

Checklist card:

- [ ]  “Comprar Agora” em qty=0
- [ ]  Stepper em qty>0
- [ ]  Altura do card estável
- [ ]  Lixeira no qty=1

---

# 6) Combo IA

## 6.1 Regras de seleção

- Com “perfil”: usar `matchScore` para top 3.
- Sem “perfil”: usar **maior desconto** e exibir top 2.

## 6.2 Regras de desconto

- Combo recebe **15% fixos** de desconto sobre o preço somado.

Checklist Combo IA:

- [ ]  Top 3 com perfil (matchScore)
- [ ]  Top 2 sem perfil (maior desconto)
- [ ]  Desconto fixo 15% aplicado ao total

---

# 7) Filtros, badges e urgência

## 7.1 Filtros (abas)

- Todos
- Dia Inteiro
- Meio Dia
- Mais Popular
- Maior Desconto

## 7.2 Urgência / badge de estoque

- Se `availableToday <= 10`:
    - badge “low stock” com fundo vermelho-claro
    - texto de escassez
    - animação pulse
- Se `availableToday > 10`:
    - badge amarelo-claro
    - ícone de raio

Checklist filtros/badges:

- [ ]  Abas existentes e funcionando
- [ ]  Badge low stock <= 10 com pulse
- [ ]  Badge raio > 10

---

# 8) Checkout, API e pagamento (Pix)

## 8.1 Validações do formulário

- Nome: pelo menos **duas palavras**
- Email: contém `@`
- CPF: **11 dígitos** com máscara dinâmica
- Telefone: pelo menos **10 dígitos** com máscara dinâmica

## 8.2 Rotas de pagamento (contrato)

- Criar Pix:
    - `POST /api/payments/tickets/create`
- Consultar status (polling):
    - `GET /api/payments/tickets/:id/status`
    - frequência: **a cada 3000 ms**
- Expiração:
    - **30 minutos**

## 8.3 Modo demo

- Sem variáveis de gateway, o backend roda em **modo demo**.

Checklist checkout/pix:

- [ ]  Validadores aplicados
- [ ]  Criação via POST create
- [ ]  Polling a cada 3000ms
- [ ]  Expiração 30min
- [ ]  Fallback demo sem envs

---

# 9) Sucesso e comprovante

## 9.1 Carregamento da transação

- Página sucesso faz:
    - `GET /api/payments/tickets/:txnId`
    - usando query param `txn`

## 9.2 Download de comprovante

- Botão gera `.txt` via `URL.createObjectURL(blob)` contendo:
    - Cabeçalho RSV360
    - Transação
    - Data
    - Cliente
    - Itens
    - Total pago
    - Instrução: apresentar comprovante na entrada

Checklist sucesso:

- [ ]  Query param txn
- [ ]  GET detalhes transação
- [ ]  Download .txt com campos exigidos

---

# 10) Analytics e QA

## 10.1 Buffer local (localStorage)

- chave: `localStorage['rsv_analytics']`
- eventos:
    - `tickets_page_view`
    - `ticket_add_to_cart`
    - `ticket_remove_from_cart`
    - `tickets_checkout_start`
    - `pix_checkout_view`
    - `pix_qr_visible`
    - `pix_code_copy`
    - `pix_payment_confirmed`
    - `pix_payment_expired`
    - `pix_payment_failed`
    - `tickets_success_view`
    - `ticket_download_click`

Checklist analytics:

- [ ]  Todos os eventos acima registrados
- [ ]  Buffer persistente no localStorage

---

# 11) data-testid obrigatórios

IDs citados como obrigatórios:

- `card-ticket-{id}`
- `button-buy-{id}`
- `stepper-{id}`
- `input-cpf`
- `banner-payment-approved`
- `button-download-ticket`
- (e “outros IDs completos para /ingressos, /checkout e /sucesso” conforme plano)

Checklist testid:

- [ ]  IDs implementados nos componentes
- [ ]  IDs preservados em refactors

---

# 12) Regras de preservação (inegociáveis)

- O gradiente azul do hero **nunca** deve ser alterado.
- O grid **nunca** deve virar lista.
- Badges de desconto e match da IA **nunca** devem ser removidos.
- Combo IA e Social Proof **nunca** podem ser ocultados.
- Card **não pode** mudar de altura ao mostrar o stepper.
- Escopo da rota é estritamente restrito a ingressos.

---

# 13) Catálogo hardcoded

Itens base:

- `hot-park`
- `diroma-acqua-park`
- `lagoa-termas`
- `water-park`
- `kawana-park`

A conversa define para cada item: preços, desconto, local, duração e popularidade.

---

# 14) Relações “também comprou” (cross-sell)

- hot-park → diroma-acqua-park, lagoa-termas
- diroma-acqua-park → kawana-park, water-park
- lagoa-termas → hot-park, kawana-park
- water-park → diroma-acqua-park, hot-park
- kawana-park → lagoa-termas, diroma-acqua-park

---

# 15) Paleta, animações e estados

A especificação inclui valores visuais exatos para:

- hero
- countdown
- underline da aba ativa
- fundo e sombras dos cards
- stepper
- Combo IA
- barra de carrinho
- animações: `slideUp`, `pulse`, `spin` e `counters`

Regra: estes detalhes visuais passam a fazer parte da especificação e não devem ser removidos.

---

# 16) Checklist final da Parte 1/3

- [ ]  Rotas principais mapeadas e respeitadas
- [ ]  Arquivos-chave identificados
- [ ]  Ordem de renderização de /ingressos respeitada
- [ ]  Card/stepper conforme regras (sem mudança de altura)
- [ ]  Combo IA conforme lógica (perfil vs sem perfil) + 15%
- [ ]  Filtros e badges conforme thresholds
- [ ]  Checkout com validações + Pix create/poll/expire + demo fallback
- [ ]  Sucesso com GET txn + download .txt
- [ ]  Analytics buffer com lista completa
- [ ]  data-testid críticos implementados
- [ ]  Regras inegociáveis preservadas
- [ ]  Catálogo hardcoded + “também comprou” implementados

---

## Próximo passo

Envie a **Parte 2/3** (o conteúdo completo) que eu crio a página “RSV360 — Plano Técnico Monolith (Parte 2/3)” e, ao terminar, eu peço a Parte 3/3.