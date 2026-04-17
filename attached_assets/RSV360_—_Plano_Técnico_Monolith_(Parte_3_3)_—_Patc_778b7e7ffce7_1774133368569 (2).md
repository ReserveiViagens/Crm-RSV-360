# RSV360 — Plano Técnico Monolith (Parte 3/3) — Patches cirúrgicos + Checklist + QA manual

## Como usar este documento (para implementação)

Esta é a **Parte 3/3** do plano RSV360: o pacote operacional final com **patches cirúrgicos**, **ordem segura de aplicação**, e **QA manual copiável**.

Regras:

1. Aplique patches por blocos semânticos (imports → state → helpers → callbacks → UI).
2. Preserve as inegráveis das Partes 1 e 2 (hero azul, social proof, combo IA, grid, stepper, data-testids).
3. Tudo que toca carrinho deve: (a) escrever no store e (b) atualizar o state React imediatamente.

---

# 0) Sumário da Parte 3/3

1. Objetivo
2. Patch: Página real conectada ao projeto (ingressos.tsx)
3. Tabela de tickets reais
4. Handlers centralizados do carrinho (helpers)
5. Patch de imports
6. Patch de state
7. Patch de sincronização (syncCart)
8. Botão “Me ajude a escolher”
9. Troca de callbacks diretas (Comprar/Stepper)
10. AlsoBought com quick add
11. Inserção do MiniWizard
12. Substituição da barra sticky antiga
13. Controle do WhatsApp flutuante
14. Diff literal adicional: cart-store.ts
15. Compatibilidade do patch
16. Checklist final de aplicação (ordem segura)
17. QA manual (copiável)
18. Planilha de QA (QA-001 a QA-026)

---

# 1) Objetivo

- Integrar `/client/src/pages/ingressos.tsx` com dados reais do RSV360.
- Aplicar correções pontuais para o carrinho sticky.
- Garantir callbacks consistentes e sincronização React + localStorage.
- Entregar checklist e roteiro de QA manual para validação.

---

# 2) Patch: página real conectada ao projeto (ingressos.tsx)

## 2.1 Dependências citadas no patch

A versão patchada da página conecta:

- `wouter`
- `analytics`
- `cart-store`
- Combo IA real
- `compareIds`
- `ticketsBase` reais
- `alsoBought`
- filtro ativo

Objetivo: refletir o estado real do projeto sem quebrar UX da Parte 1.

---

# 3) Tabela de tickets reais (base)

Tickets (IDs) fixos do plano:

- hot-park
- diroma-acqua-park
- lagoa-termas
- water-park
- kawana-park

Campos citados:

- `price`
- `originalPrice`
- `discount`
- `local`
- `duration`
- `categoria`
- `soldToday`
- `availableToday`
- relacionamentos `alsoBought`

---

# 4) Handlers centralizados do carrinho (padrão)

## 4.1 Funções recomendadas

- `syncCart()`
- `handleBuy(ticket)`
- `handleIncrease(ticket, qty)`
- `handleDecrease(ticket, qty)`
- `handleRemove(ticketId)`
- `handleWizardConfirm(items)`

Regra: todas devem **escrever no store** e depois **atualizar state React**.

---

# 5) Patch para imports (bloco 1)

O patch inclui imports de:

- `MiniWizard`
- `CartStickyBar`
- `addManyToCart`
- `CartItem` (type)

Diretriz: aplicar por blocos semânticos.

Exemplo (adaptar caminhos reais):

```tsx
import { useLocation } from 'wouter'
import { track } from '../lib/analytics'
import {
	getCart,
	addToCart,
	addManyToCart,
	updateQty,
	removeFromCart,
	getCartTotal,
	type CartItem,
} from '../lib/cart-store'

import { MiniWizard } from '../components/MiniWizard'
import { CartStickyBar } from '../components/CartStickyBar'
```

---

# 6) Patch de state (bloco 2)

Garantir estados:

- `compareIds`
- `showCompare`
- `hoveredId`
- `showWizard`
- `timer`
- `tickets`
- `cart: CartItem[]` inicializado com `getCart()`

Exemplo:

```tsx
const [compareIds, setCompareIds] = useState<string[]>([])
const [showCompare, setShowCompare] = useState(false)
const [hoveredId, setHoveredId] = useState<string | null>(null)
const [showWizard, setShowWizard] = useState(false)
const [timer, setTimer] = useState<number>(0)

const [tickets, setTickets] = useState<any[]>(ticketsBase)
const [cart, setCart] = useState<CartItem[]>(() => getCart())
```

---

# 7) Patch para helpers de sincronização (bloco 3)

Centralizar mudanças:

- `syncCart`
- `handleBuy`
- `handleIncrease`
- `handleDecrease`
- `handleRemove`
- `handleWizardConfirm`

Exemplo:

```tsx
function syncCart() {
	setCart(getCart())
}

function handleBuy(ticket: any) {
	addToCart({ ticketId: ticket.id, title: ticket.name, unitPrice: ticket.price }, 1)
	syncCart()
	track('ticket_add_to_cart', { ticketId: ticket.id })
}

function handleIncrease(ticket: any, qty: number) {
	updateQty(ticket.id, qty + 1)
	syncCart()
}

function handleDecrease(ticket: any, qty: number) {
	if (qty <= 1) {
		removeFromCart(ticket.id)
	} else {
		updateQty(ticket.id, qty - 1)
	}
	syncCart()
}

function handleRemove(ticketId: string) {
	removeFromCart(ticketId)
	syncCart()
}

function handleWizardConfirm(items: CartItem[]) {
	addManyToCart(items)
	syncCart()
	setShowWizard(false)
}
```

---

# 8) Botão “Me ajude a escolher”

- Deve ficar junto das abas do hero.
- Apenas abre o wizard.
- Não remove nenhum filtro existente.

Exemplo:

```tsx
<button
	className="ml-auto bg-white/20 text-white px-3 py-2 rounded-lg font-bold"
	onClick={() => setShowWizard(true)}
	data-testid="button-help-choose"
>
	Me ajude a escolher
</button>
```

---

# 9) Troca de callbacks diretas

- “Comprar Agora” → `handleBuy(ticket)`
- diminuir → `handleDecrease(ticket, qty)`
- aumentar → `handleIncrease(ticket, qty)`

Checklist:

- [ ]  Nenhum componente chama store diretamente (só handlers)
- [ ]  Qty sempre deriva de `cart` atual

---

# 10) AlsoBought com quick add

Diretriz:

- seção “Quem comprou este também levou” aceita `onQuickAdd`.
- relacionados viram botões de adição rápida.

Exemplo (conceitual):

```tsx
<AlsoBought
	ticketId={ticket.id}
	relatedIds={ticket.alsoBought}
	onQuickAdd={(id) => {
		const t = tickets.find((x) => x.id === id)
		if (t) handleBuy(t)
	}}
/>
```

---

# 11) Inserção do MiniWizard

Regra:

- Renderizar antes dos flutuantes.
- Props: `open`, `tickets`, `profile`, `onClose`, `onConfirm`.

Exemplo:

```tsx
<MiniWizard
	open={showWizard}
	tickets={tickets}
	profile={selectedProfile}
	onClose={() => setShowWizard(false)}
	onConfirm={handleWizardConfirm}
/>
```

---

# 12) Substituição da barra sticky antiga

- Trocar bloco antigo pela versão corrigida.
- Preservar: `data-testid='bar-cart-summary'`, CTA checkout, cálculo total.

Exemplo:

```tsx
<CartStickyBar
	cart={cart}
	total={getCartTotal(cart)}
	onCheckout={() => setLocation('/ingressos/checkout')}
	data-testid="bar-cart-summary"
/>
```

---

# 13) Controle do WhatsApp flutuante

Regra final:

- WhatsApp só aparece quando `cart.length === 0`.
- Quando carrinho tem itens, WhatsApp some e sticky assume.

Checklist:

- [ ]  cart vazio → WhatsApp visível
- [ ]  cart > 0 → WhatsApp oculto
- [ ]  cart > 0 → sticky visível

---

# 14) Diff literal adicional — cart-store.ts

Mudanças descritas:

- `addToCart` aceita quantity opcional
- soma qty no item existente
- inclui `addManyToCart(items)`

(Se você já aplicou a store da Parte 2/3, esta seção vira apenas verificação de compatibilidade.)

---

# 15) Compatibilidade com patch da página

Após o patch:

- chamadas como `addToCart({ ... }, 1)` funcionam
- `addManyToCart(items)` funciona

Checklist:

- [ ]  Sem mistura de id vs ticketId
- [ ]  Sticky depende de state React atualizado

---

# 16) Checklist final de aplicação (ordem segura)

Ordem segura citada:

1. Atualizar `cart-store.ts`
2. Atualizar `ingressos.tsx`
3. Revisar compatibilidade com Express + Vite + React + wouter
4. Rodar projeto
5. Testar:
    - compra simples
    - stepper
    - mini wizard
    - persistência
    - checkout
    - analytics
    - regressão visual

---

# 17) QA manual (copiável)

## 17.1 Ambiente

- Browser: Chrome (latest)
- Mobile: iPhone/Android (responsivo)
- Estado inicial: limpar localStorage (`rsv_tickets_cart`, `rsv_analytics`)

## 17.2 Pré-condições

- Página `/ingressos` acessível.
- Tickets base renderizados.

## 17.3 Casos

### QA — Carga inicial

Passos:

1. Abrir `/ingressos`.
2. Verificar hero, social proof, combo, grid, cross-sell.

Resultado esperado:

- Ordem e elementos conforme Parte 1.

### QA — Compra simples

Passos:

1. Clicar “Comprar Agora” em um card.

Resultado esperado:

- Stepper aparece sem mudar altura.
- Barra sticky aparece.
- WhatsApp flutuante some.

### QA — Stepper

Passos:

1. Aumentar qty.
2. Diminuir qty.
3. Quando qty==1, botão dec vira lixeira.

Resultado esperado:

- Qty atualiza corretamente.
- Lixeira no qty==1.

### QA — Persistência

Passos:

1. Adicionar 2 itens.
2. Recarregar página.

Resultado esperado:

- Carrinho permanece.
- Sticky aparece.

### QA — Mini Wizard

Passos:

1. Clicar “Me ajude a escolher”.
2. Completar 3 passos.
3. Confirmar.

Resultado esperado:

- Itens entram no carrinho.
- Sticky atualiza imediatamente.

### QA — Checkout

Passos:

1. Clicar “Ir para pagamento”.

Resultado esperado:

- Navega para `/ingressos/checkout`.

### QA — Analytics

Passos:

1. Realizar add/remove.
2. Abrir devtools e inspecionar `localStorage['rsv_analytics']`.

Resultado esperado:

- Eventos registrados conforme Parte 1.

### QA — Regressão visual

Resultado esperado:

- Gradiente hero azul preservado.
- Grid não vira lista.
- Combo IA e social proof não ocultados.

---

# 18) Planilha de QA (QA-001 a QA-026)

A conversa menciona uma planilha com casos QA-001…QA-026 cobrindo:

- Página e estrutura
- Carrinho
- localStorage
- wizard
- persistência
- checkout
- analytics
- responsividade

(Quando você me enviar o conteúdo completo/linhas QA-001…QA-026, eu converto para checklist final dentro desta página.)

[FIM DA PARTE 3/3]