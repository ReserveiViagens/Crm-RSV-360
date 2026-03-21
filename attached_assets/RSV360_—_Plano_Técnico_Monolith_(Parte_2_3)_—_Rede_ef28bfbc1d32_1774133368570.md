# RSV360 — Plano Técnico Monolith (Parte 2/3) — Redesenho UX + Componentes (React/TSX)

## Como usar este documento (para implementação)

Este monólito corresponde à **Parte 2/3** do plano RSV360: **redesenho da experiência** e **componentização React/TSX**, com foco em:

- organizar a página `/ingressos` em blocos estáveis (sem quebrar restrições da Parte 1)
- corrigir o problema recorrente do carrinho “não aparecer”
- introduzir decisão guiada (Quick Decision + Mini Wizard)

Regras:

1. Tudo aqui deve respeitar as **inegociáveis da Parte 1/3** (hero azul, social proof, combo IA, grid, stepper, etc.).
2. Faça a migração em camadas: primeiro store/hook, depois CartStickyBar, depois grid e wizard.
3. Não quebre `data-testid` e não troque grid por lista.

---

# 0) Sumário da Parte 2/3

1. Objetivo do redesenho
2. Layout proposto (ordem de blocos)
3. Módulos/componentes a implementar
4. Tipos base (interfaces)
5. Store do carrinho (lib/cart-store.ts)
6. Hook `useTicketsCart`
7. `CartStickyBar`
8. `TicketsGrid`
9. `QuickDecisionSection`
10. `MiniWizard`
11. Estrutura completa de arquivos
12. Exemplo `app/page.tsx` (demo)
13. Adaptação para o projeto real (RSV360)
14. Store conectada aos dados reais
15. MiniWizard com dados reais
16. Diagnóstico: por que o carrinho não aparece
17. Checklist final da Parte 2

---

# 1) Objetivo do redesenho

## 1.1 Objetivos explícitos

- Elevar conversão reorganizando a experiência.
- Corrigir o fluxo do carrinho sticky (renderização e sincronização).
- Manter elementos fixos do fluxo real:
    - hero
    - prova social
    - combo IA
    - grid
    - cross-sell
    - barra sticky

## 1.2 Resultado esperado

- A página `/ingressos` vira um “funil” com decisão guiada, mas sem perder o layout/estética mandatórios.

---

# 2) Proposta de novo layout (ordem de blocos)

## 2.1 Blocos do layout

- `HeroSection`
- `SocialProofBar`
- `QuickDecisionSection`
- `MiniWizardEntry`
- `AiComboSection`
- `MainContent` (grid)
- `ComparisonStickyBar`
- `CrossSellSection`
- `CartStickyBar`

## 2.2 Ordem ideal (compatível com Parte 1)

1. Hero
2. Prova social
3. Escolha rápida (QuickDecision)
4. Mini wizard
5. Combo IA
6. Grid
7. Cross-sell
8. Carrinho sticky

Checklist:

- [ ]  Ordem acima respeitada
- [ ]  Combo IA continua antes do grid
- [ ]  Grid permanece grid

---

# 3) Componentes/módulos a implementar

Este volume descreve componentes que podem ser colados e adaptados:

- `QuickDecisionSection.tsx`
- `MiniWizard.tsx`
- `CartStickyBar.tsx`
- `TicketsGrid.tsx`

E a base de estado:

- `lib/cart-store.ts`
- `hooks/useTicketsCart.ts`

---

# 4) Tipos base (interfaces)

```tsx
// types/tickets.ts (ou colado no arquivo que fizer mais sentido)
export type Ticket = {
	id: string
	name: string
	price: number
	discount: number
	popular: boolean | number
	comboEligible: boolean
	tags: string[]
	duration: 'Dia inteiro' | 'Meio dia' | string
}

export type WizardAnswers = {
	people: number
	duration: 'Dia inteiro' | 'Meio dia' | 'Tanto faz'
	priority: 'economia' | 'popularidade' | 'familia'
	wantsCombo: boolean
}

export type WizardComboItem = {
	ticketId: string
	title: string
	unitPrice: number
	quantity: number
}
```

---

# 5) Store do carrinho (lib/cart-store.ts)

## 5.1 Diretriz

- Usar chave **`rsv_tickets_cart`** no localStorage.
- Padronizar item como `ticketId` (não misturar `id` vs `ticketId`).

## 5.2 Implementação proposta

```tsx
// client/src/lib/cart-store.ts
export type CartItem = {
	ticketId: string
	title: string
	quantity: number
	unitPrice: number
}

const KEY = 'rsv_tickets_cart'

export function getCart(): CartItem[] {
	try {
		const raw = localStorage.getItem(KEY)
		return raw ? (JSON.parse(raw) as CartItem[]) : []
	} catch {
		return []
	}
}

export function saveCart(cart: CartItem[]) {
	localStorage.setItem(KEY, JSON.stringify(cart))
}

export function addToCart(item: Omit<CartItem, 'quantity'>, qty: number = 1) {
	const cart = getCart()
	const idx = cart.findIndex((c) => c.ticketId === item.ticketId)
	if (idx >= 0) {
		cart[idx] = { ...cart[idx], quantity: cart[idx].quantity + qty }
	} else {
		cart.push({ ...item, quantity: qty })
	}
	saveCart(cart)
	return cart
}

export function addManyToCart(items: Array<CartItem>) {
	const cart = getCart()
	for (const it of items) {
		const idx = cart.findIndex((c) => c.ticketId === it.ticketId)
		if (idx >= 0) cart[idx] = { ...cart[idx], quantity: cart[idx].quantity + it.quantity }
		else cart.push(it)
	}
	saveCart(cart)
	return cart
}

export function updateQty(ticketId: string, quantity: number) {
	const cart = getCart()
	const next = cart
		.map((c) => (c.ticketId === ticketId ? { ...c, quantity } : c))
		.filter((c) => c.quantity > 0)
	saveCart(next)
	return next
}

export function removeFromCart(ticketId: string) {
	const cart = getCart().filter((c) => c.ticketId !== ticketId)
	saveCart(cart)
	return cart
}

export function clearCart() {
	saveCart([])
	return []
}

export function getCartTotal(cart: CartItem[]) {
	return cart.reduce((sum, it) => sum + it.unitPrice * it.quantity, 0)
}

export function getCartItemQty(cart: CartItem[], ticketId: string) {
	return cart.find((it) => it.ticketId === ticketId)?.quantity ?? 0
}
```

---

# 6) Hook `useTicketsCart`

## 6.1 Responsabilidades

- Ler localStorage no init
- Sincronizar estado React
- Incrementar/atualizar/remover
- Escutar evento `storage` (multi-tab)
- Calcular total com `useMemo`

## 6.2 Implementação

```tsx
// client/src/hooks/useTicketsCart.ts
import { useEffect, useMemo, useState } from 'react'
import {
	CartItem,
	getCart,
	addToCart,
	addManyToCart,
	updateQty,
	removeFromCart,
	getCartTotal,
} from '../lib/cart-store'

export function useTicketsCart() {
	const [cart, setCart] = useState<CartItem[]>([])

	useEffect(() => {
		setCart(getCart())
	}, [])

	useEffect(() => {
		function onStorage(e: StorageEvent) {
			if (e.key === 'rsv_tickets_cart') setCart(getCart())
		}
		window.addEventListener('storage', onStorage)
		return () => window.removeEventListener('storage', onStorage)
	}, [])

	const total = useMemo(() => getCartTotal(cart), [cart])

	function addTicket(input: { ticketId: string; title: string; unitPrice: number }, qty = 1) {
		const next = addToCart(input, qty)
		setCart(next) // IMPORTANTÍSSIMO: atualizar estado React
	}

	function addManyToCartAction(items: CartItem[]) {
		const next = addManyToCart(items)
		setCart(next)
	}

	function updateTicketQty(ticketId: string, quantity: number) {
		const next = updateQty(ticketId, quantity)
		setCart(next)
	}

	function removeTicket(ticketId: string) {
		const next = removeFromCart(ticketId)
		setCart(next)
	}

	return {
		cart,
		total,
		addTicket,
		addManyToCart: addManyToCartAction,
		updateTicketQty,
		removeTicket,
	}
}
```

---

# 7) CartStickyBar

## 7.1 Regras

- Fixo no `bottom: 0`
- `z-index: 200`
- Mostrar total, contagem, resumo e CTA “Ir para pagamento”

## 7.2 Exemplo

```tsx
// client/src/components/CartStickyBar.tsx
import React from 'react'

export function CartStickyBar({ cart, total, onCheckout }: any) {
	if (!cart || cart.length === 0) return null

	const itemsCount = cart.reduce((sum: number, it: any) => sum + it.quantity, 0)

	return (
		<div
			style= position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 200 
			className="bg-white border-t shadow-lg"
			data-testid="cart-sticky"
		>
			<div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
				<div className="flex flex-col">
					<div className="text-sm font-semibold">{itemsCount} item(ns)</div>
					<div className="text-xs text-gray-500 truncate max-w-[60vw]">
						{cart.map((it: any) => `${it.title} x${it.quantity}`).join(' • ')}
					</div>
				</div>

				<div className="flex items-center gap-3">
					<div className="text-sm font-bold">R$ {total.toFixed(2)}</div>
					<button
						className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold"
						onClick={onCheckout}
						data-testid="button-go-checkout"
					>
						Ir para pagamento
					</button>
				</div>
			</div>
		</div>
	)
}
```

---

# 8) TicketsGrid

## 8.1 Responsabilidades

- Manter grid
- Calcular `qty` por `ticketId`
- Alternar entre “Comprar agora” e stepper (Parte 1)

## 8.2 Exemplo

```tsx
// client/src/components/TicketsGrid.tsx
import React, { useMemo } from 'react'

export function TicketsGrid({ tickets, cart, onBuy, onInc, onDec }: any) {
	const qtyById = useMemo(() => {
		const m = new Map<string, number>()
		for (const it of cart) m.set(it.ticketId, it.quantity)
		return m
	}, [cart])

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
			{tickets.map((t: any) => {
				const qty = qtyById.get(t.id) ?? 0
				return (
					<div
						key={t.id}
						className="border rounded-xl p-4"
						data-testid={`card-ticket-${t.id}`}
					>
						<div className="font-bold">{t.name}</div>
						<div className="text-sm text-gray-600">R$ {t.price}</div>

						<div className="mt-3" style= minHeight: 44 >
							{qty === 0 ? (
								<button
									className="w-full bg-green-600 text-white py-2 rounded-lg font-bold"
									onClick={() => onBuy(t)}
									data-testid={`button-buy-${t.id}`}
								>
									Comprar Agora
								</button>
							) : (
								<div className="flex items-center justify-between">
									<button
										className={`px-3 py-2 rounded-lg border ${qty === 1 ? 'text-red-600 border-red-200' : ''}`}
										onClick={() => onDec(t, qty)}
										data-testid={`stepper-dec-${t.id}`}
									>
										{qty === 1 ? '🗑' : '-'}
									</button>

									<div data-testid={`stepper-${t.id}`} className="font-bold">{qty}</div>

									<button
										className="px-3 py-2 rounded-lg border"
										onClick={() => onInc(t, qty)}
										data-testid={`stepper-inc-${t.id}`}
									>
										+
									</button>
								</div>
							)}
						</div>
					</div>
				)
			})}
		</div>
	)
}
```

---

# 9) QuickDecisionSection

## 9.1 Objetivo

Decisão rápida com opções:

- “Melhor custo-benefício”
- “Vou com crianças”
- “Mais popular”
- “Quero combo”

## 9.2 Exemplo

```tsx
// client/src/components/QuickDecisionSection.tsx
import React from 'react'

type Props = {
	onPick: (pick: 'custo' | 'familia' | 'popular' | 'combo') => void
}

export function QuickDecisionSection({ onPick }: Props) {
	return (
		<div className="mt-6">
			<h2 className="font-black text-lg">Escolha rápida</h2>
			<div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
				<button className="border rounded-xl p-3" onClick={() => onPick('custo')} data-testid="quick-custo">Melhor custo-benefício</button>
				<button className="border rounded-xl p-3" onClick={() => onPick('familia')} data-testid="quick-familia">Vou com crianças</button>
				<button className="border rounded-xl p-3" onClick={() => onPick('popular')} data-testid="quick-popular">Mais popular</button>
				<button className="border rounded-xl p-3" onClick={() => onPick('combo')} data-testid="quick-combo">Quero combo</button>
			</div>
		</div>
	)
}
```

---

# 10) Mini Wizard (3 passos)

## 10.1 Passos

1) pessoas + duração

2) prioridade (economia/popularidade/família) + combo sim/não

3) resumo: recomendação + preço original + preço final + economia

## 10.2 Regras e dados reais

- Wizard real usa tickets: hot-park, diroma-acqua-park, lagoa-termas, water-park, kawana-park
- Score considera: `preferredDuration`, `vibe`, popularidade e desconto

## 10.3 Exemplo (skeleton)

```tsx
// client/src/components/MiniWizard.tsx
import React, { useMemo, useState } from 'react'

export function MiniWizard({ tickets, onAddMany }: any) {
	const [step, setStep] = useState(1)
	const [people, setPeople] = useState(2)
	const [duration, setDuration] = useState<'Dia inteiro' | 'Meio dia' | 'Tanto faz'>('Tanto faz')
	const [priority, setPriority] = useState<'economia' | 'popularidade' | 'familia'>('economia')
	const [wantsCombo, setWantsCombo] = useState(true)

	const recommendation = useMemo(() => {
		// placeholder: implementar score real
		const scored = tickets.map((t: any) => {
			const durationScore = duration === 'Tanto faz' ? 0 : (t.duration === duration ? 2 : -1)
			const popularScore = Number(Boolean(t.popular))
			const discountScore = Number(t.discount || 0)
			const base = durationScore + (priority === 'popularidade' ? popularScore : 0) + (priority === 'economia' ? discountScore : 0)
			return { t, score: base }
		})
		scored.sort((a: any, b: any) => b.score - a.score)
		return wantsCombo ? scored.slice(0, 2) : scored.slice(0, 1)
	}, [tickets, duration, priority, wantsCombo])

	function commit() {
		const items = recommendation.map((r: any) => ({
			ticketId: r.t.id,
			title: r.t.name,
			quantity: people,
			unitPrice: r.t.price,
		}))
		onAddMany(items)
	}

	return (
		<div className="mt-6 border rounded-2xl p-4" data-testid="mini-wizard">
			<div className="font-black">Mini Wizard</div>
			<div className="text-sm text-gray-600">Passo {step}/3</div>

			{step === 1 && (
				<div className="mt-4 space-y-3">
					<label className="block">Pessoas</label>
					<input type="number" min={1} value={people} onChange={(e) => setPeople(Number(e.target.value))} className="border rounded p-2 w-full" />
					<label className="block">Duração</label>
					<select value={duration} onChange={(e) => setDuration(e.target.value as any)} className="border rounded p-2 w-full">
						<option>Tanto faz</option>
						<option>Dia inteiro</option>
						<option>Meio dia</option>
					</select>
				</div>
			)}

			{step === 2 && (
				<div className="mt-4 space-y-3">
					<label className="block">Prioridade</label>
					<select value={priority} onChange={(e) => setPriority(e.target.value as any)} className="border rounded p-2 w-full">
						<option value="economia">Economia</option>
						<option value="popularidade">Popularidade</option>
						<option value="familia">Família</option>
					</select>

					<label className="flex items-center gap-2">
						<input type="checkbox" checked={wantsCombo} onChange={(e) => setWantsCombo(e.target.checked)} />
						Quero combo
					</label>
				</div>
			)}

			{step === 3 && (
				<div className="mt-4 space-y-2">
					<div className="font-bold">Recomendação</div>
					<ul className="list-disc ml-5">
						{recommendation.map((r: any) => (
							<li key={r.t.id}>{r.t.name}</li>
						))}
					</ul>
					<button className="mt-3 bg-purple-600 text-white px-4 py-2 rounded-lg font-bold" onClick={commit}>
						Adicionar recomendação ao carrinho
					</button>
				</div>
			)}

			<div className="mt-4 flex justify-between">
				<button className="px-3 py-2 border rounded" disabled={step === 1} onClick={() => setStep((s) => s - 1)}>Voltar</button>
				<button className="px-3 py-2 border rounded" disabled={step === 3} onClick={() => setStep((s) => s + 1)}>Próximo</button>
			</div>
		</div>
	)
}
```

---

# 11) Estrutura completa de arquivos (para colar)

- `client/src/lib/cart-store.ts`
- `client/src/hooks/useTicketsCart.ts`
- `client/src/components/QuickDecisionSection.tsx`
- `client/src/components/MiniWizard.tsx`
- `client/src/components/CartStickyBar.tsx`
- `client/src/components/TicketsGrid.tsx`
- `client/src/app/page.tsx` (apenas demonstrativo)

---

# 12) app/page.tsx (demo)

Objetivo: demonstrar mock de tickets + hero + prova social + quick decision + wizard + combo + grid + cross-sell + sticky.

Regra: no RSV360 real, isso vira `client/src/pages/ingressos.tsx`.

---

# 13) Adaptação ao projeto real (RSV360)

## 13.1 Arquivos reais citados

- `client/src/pages/ingressos.tsx`
- `client/src/lib/cart-store.ts`
- `client/src/lib/analytics.ts`
- Checkout em `/ingressos/checkout`

## 13.2 Preservações mandatórias

- hero azul
- Combo IA
- social proof
- grid
- stepper

---

# 14) Store conectada aos dados reais (padrão RSV360)

Resumo: a versão final da cart-store usa:

- `CartItem: { ticketId, title, quantity, unitPrice }`
- chave `rsv_tickets_cart`
- funções:
    - `getCart`
    - `saveCart`
    - `addToCart`
    - `addManyToCart`
    - `removeFromCart`
    - `updateQty`
    - `clearCart`
    - `getCartTotal`
    - `getCartItemQty`

---

# 15) MiniWizard com dados reais

- Tickets: hot-park, diroma-acqua-park, lagoa-termas, water-park, kawana-park
- Score considera:
    - preferredDuration
    - vibe
    - popularidade
    - desconto

---

# 16) Diagnóstico: motivo provável do carrinho não aparecer

Causas principais citadas:

1. Salvar no localStorage sem atualizar estado React (sticky depende de `cart.length`).
2. Misturar `id` com `ticketId` (qty calculada errado, cart fica incoerente).
3. Depender de `cart.length` enquanto leitura do carrinho ocorre apenas no mount (sem sync após ações).

Correções garantidas por este plano:

- Sempre chamar `setCart(next)` após operações de cart.
- Padronizar `ticketId` em toda a cadeia.
- Escutar `storage` event (multi-tab) e inicializar no mount.

---

# 17) Checklist final da Parte 2/3

- [ ]  Layout reorganizado em blocos (sem quebrar a Parte 1)
- [ ]  cart-store usa `rsv_tickets_cart` e `ticketId`
- [ ]  useTicketsCart atualiza estado React após salvar
- [ ]  CartStickyBar aparece quando cart.length > 0
- [ ]  TicketsGrid mantém grid + stepper (sem mudar altura)
- [ ]  QuickDecisionSection implementada
- [ ]  MiniWizard implementado com 3 passos
- [ ]  Adaptação para `client/src/pages/ingressos.tsx` concluída

---

## Próximo passo

Agora envie a **Parte 3/3** (o conteúdo completo) para eu criar a página “RSV360 — Plano Técnico Monolith (Parte 3/3)”.