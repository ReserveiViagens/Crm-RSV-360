# Estrutura completa da página /ingressos

**Plataforma:** RSV360 — Reservei Viagens  
**Stack:** React 18 + TypeScript + Vite · Express + Node.js · TanStack Query v5 · wouter  
**Data:** Março 2026 · **Versão:** 1.0

---

## 1. Visão geral do fluxo completo

```
/ingressos ──── [Comprar Agora] ──── stepper (- qty +) ──── barra sticky carrinho
                                                                      │
                                                      [Ir para pagamento]
                                                                      │
                                                      /ingressos/checkout
                                                      ├── Passo 1: Form dados (nome/email/CPF/telefone)
                                                      └── Passo 2: QR Code Pix + polling 3s
                                                                      │
                                                               APPROVED
                                                                      │
                                                      /ingressos/sucesso?txn=ID
                                                      ├── Resumo do pedido
                                                      ├── Download comprovante (.txt)
                                                      ├── Suporte WhatsApp
                                                      └── Cross-sell hotéis (3 cards)
```

---

## 2. Arquivos envolvidos

| Arquivo | Tipo | Responsabilidade |
|---|---|---|
| `client/src/pages/ingressos.tsx` | Página (964 linhas) | Catálogo, stepper, carrinho, filtros, combo IA, comparação |
| `client/src/pages/ingressos-checkout.tsx` | Página (445 linhas) | Formulário de dados + QR Pix + polling de status |
| `client/src/pages/ingressos-sucesso.tsx` | Página (255 linhas) | Confirmação, download, cross-sell de hotéis |
| `client/src/lib/cart-store.ts` | Lib | Store do carrinho persistido em localStorage |
| `client/src/lib/analytics.ts` | Lib | Registro de 19 tipos de eventos analytics |
| `server/services/ticket-payment.service.ts` | Serviço | Criação do Pix de ingresso (sem split de comissão) |
| `server/routes.ts` | Backend | 4 rotas da API de ingressos |
| `client/src/App.tsx` | Roteamento | Registra `/ingressos/checkout` e `/ingressos/sucesso` |

---

## 3. Página `/ingressos` — Catálogo completo

### 3.1 Estrutura de seções (ordem de renderização)

```
┌─────────────────────────────────────────────┐
│  HERO (gradiente azul — NUNCA ALTERAR)       │
│  ├── Link voltar (ArrowLeft) + Logo RSV360   │
│  ├── H1: "Ingressos para Parques"            │
│  ├── Subtítulo: "Até 25% OFF + Entrada..."  │
│  ├── Badge countdown vermelho (Timer)        │
│  └── Abas de filtro (5 opções)              │
├─────────────────────────────────────────────┤
│  SocialProofBanner (pageName="ingressos")    │
│  PersonalizedBanner (profile do viajante)   │
├─────────────────────────────────────────────┤
│  COMBO IA (gradiente roxo-pink)             │
│  ├── Cards dos parques sugeridos (2-3)      │
│  ├── Preço original riscado + preço combo   │
│  ├── Badge "-15% IA" (amarelo)             │
│  └── Botão "Quero esse Combo!" → WhatsApp  │
├─────────────────────────────────────────────┤
│  GRID DE CARDS (filteredTickets)            │
│  └── Card por parque (5 parques fixos)      │
│       ├── Imagem + badges sobrepostos       │
│       ├── Nome + local + duração            │
│       ├── Atrações (tags)                   │
│       ├── UrgencyIndicator                  │
│       ├── AnimatedCounter (vendidos hoje)   │
│       ├── Preço atual + preço original      │
│       ├── Botão comparar (BarChart3)        │
│       ├── CTA: Botão ou Stepper             │
│       └── AlsoBoughtSection                 │
├─────────────────────────────────────────────┤
│  CrossSellSection (hotéis)                  │
└─────────────────────────────────────────────┘
│  [FIXED] Barra de carrinho sticky           │  ← quando cart.length > 0
│  [FIXED] Botão WhatsApp flutuante           │  ← quando cart.length === 0
│  [FIXED] Barra comparar                     │  ← quando compareIds.length >= 1
└─────────────────────────────────────────────┘
```

### 3.2 Catálogo de ingressos (dados hardcoded em `ticketsBase`)

| ID | Nome | Preço | Original | Desconto | Local | Duração | Categoria |
|---|---|---|---|---|---|---|---|
| `hot-park` | Ingresso Hot Park | R$189 | R$220 | 14% | Rio Quente - GO | Dia inteiro | parques |
| `diroma-acqua-park` | Ingresso diRoma Acqua Park | R$90 | R$110 | 18% | Caldas Novas - GO | Dia inteiro | parques |
| `lagoa-termas` | Ingresso Lagoa Termas Parque | R$75 | R$95 | 21% | Caldas Novas - GO | Meio dia | natureza |
| `water-park` | Ingresso Water Park | R$120 | R$150 | 20% | Caldas Novas - GO | Dia inteiro | parques |
| `kawana-park` | Ingresso Kawana Park | R$85 | R$110 | 23% | Caldas Novas - GO | Dia inteiro | parques |

**Campo `popular`:** apenas `hot-park = true`

**Campos dinâmicos (atualizados no mount e a cada 8s):**
- `soldToday`: número aleatório inicial (20-60), incrementa com probabilidade 40% a cada 8s
- `availableToday`: número aleatório inicial (5-35), decrementa com probabilidade 30% a cada 8s (mín 1)

**Relações "também comprou" (`alsoBoght`):**

| Ingresso | Relacionados |
|---|---|
| hot-park | diroma-acqua-park, lagoa-termas |
| diroma-acqua-park | kawana-park, water-park |
| lagoa-termas | hot-park, kawana-park |
| water-park | diroma-acqua-park, hot-park |
| kawana-park | lagoa-termas, diroma-acqua-park |

**Tags de perfil IA:**
- hot-park: família, aventura, águas termais
- diroma-acqua-park: família, diversão, ondas
- lagoa-termas: relaxamento, natureza, casal
- water-park: aventura, tecnologia, família
- kawana-park: família, relaxamento, águas termais

### 3.3 Filtros de aba

Constante `FILTERS = ["Todos", "Dia Inteiro", "Meio Dia", "Mais Popular", "Maior Desconto"]`

**Lógica de filtragem (IIFE inline no render):**

```typescript
switch (activeFilter) {
  case "Dia Inteiro":     tickets.filter(t => t.duration === "Dia inteiro")
  case "Meio Dia":        tickets.filter(t => t.duration === "Meio dia")
  case "Mais Popular":    [...tickets].sort((a,b) => (b.popular?1:0) - (a.popular?1:0))
  case "Maior Desconto":  [...tickets].sort((a,b) => (b.discount||0) - (a.discount||0))
  default:                tickets  // "Todos"
}
```

**Estilo da aba ativa:**  
- Cor: `#fff` / Peso: 700  
- `borderBottom: "2px solid #F57C00"` (laranja)  
- `marginBottom: -2` (alinhamento com border do container)  
- `transition: "all 0.2s"`

### 3.4 Estado React — `IngressosPage`

| State | Tipo | Valor inicial | Responsabilidade |
|---|---|---|---|
| `activeFilter` | `string` | `"Todos"` | Aba ativa dos filtros |
| `profile` | `TravelerProfile \| null` | `getTravelerProfile()` | Perfil IA do viajante (localStorage) |
| `compareIds` | `string[]` | `[]` | IDs selecionados para comparação (máx 3) |
| `showCompare` | `boolean` | `false` | Modal de comparação visível |
| `hoveredId` | `string \| null` | `null` | Card com hover ativo (scale + sombra) |
| `timer` | `{minutes, seconds}` | `{47, 23}` | Countdown de urgência no hero |
| `tickets` | `Ticket[]` | `ticketsBase` | Lista com soldToday/availableToday dinâmicos |
| `cart` | `CartItem[]` | `getCart()` (lazy) | Carrinho sincronizado com localStorage |

**Derivados via `useMemo`:**
- `bestValueId` — ingresso com maior `discount / price` → atualiza quando `tickets` muda
- `comboTickets` — top 3 por matchScore (com perfil) ou top 2 por desconto (sem perfil)
- `comboOriginalPrice` — soma dos preços dos combos
- `comboDiscountedPrice` — `Math.round(comboOriginalPrice * 0.85)` (-15%)

**`compareTickets`:** derivado inline — `tickets.filter(t => compareIds.includes(t.id))`

### 3.5 useEffects

| Ordem | Trigger | Ação |
|---|---|---|
| 1 | Mount `[]` | `setProfile(getTravelerProfile())`, inicializa soldToday/availableToday aleatórios, `trackEvent("tickets_page_view")` |
| 2 | Mount `[]` | `setInterval 1000ms` — decrementa timer (MM:SS), reseta a 47:23 quando chega a 00:00 |
| 3 | Mount `[]` | `setInterval 8000ms` — atualiza soldToday (+1 com 40% prob) e availableToday (-1 com 30% prob, mín 1) |

### 3.6 CTA inteligente do card — Botão vs. Stepper

```
getCartItemQty(cart, ticket.id)
  === 0  →  Botão "Comprar Agora" (gradiente azul ou verde para o popular)
  > 0    →  Stepper [ - | qty x Preço | + ]
```

**Regra crítica:** a altura do card NÃO muda ao selecionar. O stepper ocupa o mesmo espaço visual do botão (compensação: `border: "2px solid #22C55E"` vs. padding interno ajustado).

**Comportamento do stepper:**

| Botão | qty | Ação |
|---|---|---|
| `+` | qualquer | `updateQty(id, qty+1)` + `trackEvent("ticket_add_to_cart")` |
| `-` | qty > 1 | `updateQty(id, qty-1)` + ícone `<Minus>` |
| `-` | qty === 1 | `updateQty(id, 0)` (remove) + ícone `<Trash2>` vermelho + `trackEvent("ticket_remove_from_cart")` |

**Ao clicar em "Comprar Agora":**
```typescript
setCart(addToCart({
  ticketId: ticket.id, name: ticket.name,
  unitPrice: ticket.price, originalPrice: ticket.originalPrice,
  discount: ticket.discount, image: ticket.image,
}))
trackEvent("ticket_add_to_cart", { ticketId: ticket.id, quantity: 1 })
```

### 3.7 Badges nos cards

| Badge | Condição | Cor | Posição CSS |
|---|---|---|---|
| MAIS POPULAR | `ticket.popular === true` | `#FACC15` (amarelo) | `position: absolute, top: 12, left: 12` |
| MELHOR CUSTO-BENEFÍCIO | `ticket.id === bestValueId` | `linear-gradient(#22C55E, #16A34A)` (verde) | `position: absolute, top: popular?44:12, left: 12` |
| `-XX% OFF` | Sempre (tem discount) | `#EF4444` (vermelho) texto branco | `position: absolute, bottom: 12, left: 12` |
| Match IA (XX%) | `AIRecommendedBadge` componente | Varia por score | `position: absolute, bottom: 12, right: 12` |

**`bestValueId`** = ingresso com maior `discount / price`:
- hot-park: 14/189 ≈ 0.074
- diroma-acqua-park: 18/90 = 0.200
- lagoa-termas: 21/75 = 0.280 → **ganhador**
- water-park: 20/120 ≈ 0.167
- kawana-park: 23/85 ≈ 0.271

**`AIRecommendedBadge` — cores por score:**
- ≥ 85% → `#22C55E` (verde)
- ≥ 70% → `#2563EB` (azul)
- < 70%  → `#F57C00` (laranja)

### 3.8 Urgência nos cards (`UrgencyIndicator`)

| Condição | Texto | Background | Ícone |
|---|---|---|---|
| `availableToday <= 10` | "Apenas X ingressos restantes hoje!" | `#FEF2F2` (vermelho claro) | `AlertTriangle` vermelho |
| `availableToday > 10` | "X ingressos restantes hoje" | `#FEF3C7` (amarelo claro) | `Zap` laranja |

**Animação de low stock:** `animation: "pulse 2s infinite"` no badge de escassez.

### 3.9 Componente `AnimatedCounter`

```typescript
// Anima de prevTarget até target em ~20 passos com setInterval de 80ms
const step = Math.max(1, Math.floor(diff / 20))
setInterval(() => { current += step; ... }, 80)
```

Usa `useRef(prevTarget)` para animar incrementalmente quando o valor atualiza a cada 8s.

### 3.10 Componente `AlsoBoughtSection`

```
Fundo: linear-gradient(135deg, #EFF6FF, #F0FDF4)
Borda: 1px solid #BFDBFE
borderRadius: 10
```

Cabeçalho com ícone `TrendingUp` + texto "Quem comprou este, também comprou:"

Cada mini-card relacionado:
- Nome do parque (sem prefixo "Ingresso ")
- Preço em verde `#16A34A`
- Badge de desconto vermelho `#EF4444` / fundo `#FEE2E2`

### 3.11 Sistema de comparação

**Seleção:**
- Máximo 3 ingressos simultâneos
- Botão por card: `BarChart3` ícone, cor muda para `#2563EB` quando selecionado
- `toggleCompare(id)`: adiciona se não existe e count < 3, remove se existe

**Barra flutuante (compareIds.length >= 1):**
```
position: fixed · bottom: 80 · left: 50% · transform: translateX(-50%)
zIndex: 100 · background: #1F2937 · color: #fff · borderRadius: 14
padding: "10px 20px" · animation: "slideUp 0.3s ease"
```
- 1 selecionado: "Selecione mais 2"
- 2 selecionados: botão "Comparar Agora" azul
- 3 selecionados: botão "Comparar Agora" + "3/3 selecionados"
- Botão X: limpa toda a seleção (`setCompareIds([])`)

**Modal de comparação (showCompare && compareIds.length >= 2):**
```
position: fixed · inset: 0 · zIndex: 9999
background: rgba(0,0,0,0.6) · backdropFilter: blur(4px)
```
Conteúdo: branco, borderRadius 20, maxWidth 600, maxHeight 90vh, overflow auto

**Colunas da tabela de comparação:**
Preço · Desconto · Localização · Duração · Vendidos Hoje · Restantes Hoje · Match IA · Atrações

**Botões de ação no modal (abaixo da tabela):**
- Um botão por ingresso comparado (`button-compare-buy-{id}`)
- Estilo: `linear-gradient(135deg, #22C55E, #16A34A)`, ícone `ShoppingCart`, exibe o preço formatado
- Ação: `window.open("https://wa.me/5564993197555?text=Olá! Quero comprar o {nome} com desconto especial!")` → abre WhatsApp em nova aba

### 3.12 Combo IA

**Seleção dos ingressos do combo:**
```typescript
// COM perfil: top 3 por matchScore
const scored = tickets.map(t => ({ ...t,
  matchScore: calculateMatchScore(profile, { category: t.category, price: t.price, tags: t.tags })
}))
return [...scored].sort((a,b) => b.matchScore - a.matchScore).slice(0,3)

// SEM perfil: top 2 por desconto
return [...tickets].sort((a,b) => b.discount - a.discount).slice(0,2)
```

**Preço do combo:**
- `comboOriginalPrice` = soma dos `t.price` dos tickets selecionados
- `comboDiscountedPrice` = `Math.round(comboOriginalPrice * 0.85)` → desconto fixo de 15%
- Economia = `comboOriginalPrice - comboDiscountedPrice`

**CTA → WhatsApp:**
```
https://wa.me/5564993197555?text=Olá! Quero o Combo IA: {nomes} com 15% de desconto!
```

### 3.13 Barra sticky de carrinho

Aparece quando `cart.length > 0`, substitui o botão WhatsApp flutuante.

```
position: fixed · bottom: 0 · left: 0 · right: 0 · zIndex: 200
background: #1F2937 · padding: "12px 16px"
display: flex · alignItems: center · justifyContent: space-between
```

**Conteúdo:**
- Esquerda: ícone `ShoppingCart` verde + badge count vermelho + texto "X tipo(s)" em cinza
- Centro: total em verde `#22C55E`
- Direita: botão `linear-gradient(135deg, #22C55E, #16A34A)` → `navigate("/ingressos/checkout")` + `trackEvent("tickets_checkout_start")`

---

## 4. Cores — Paleta completa

### Hero e navegação

| Elemento | Valor |
|---|---|
| Hero gradient | `linear-gradient(135deg, #0891B2 0%, #2563EB 100%)` |
| Countdown badge background | `rgba(220,38,38,0.2)` |
| Countdown texto | `#FCA5A5` |
| Aba ativa underline | `#F57C00` |
| Logo accent "360" | `#F57C00` |

### Cards de ingresso

| Elemento | Cor |
|---|---|
| Fundo | `#fff` |
| Sombra normal | `0 2px 12px rgba(0,0,0,0.08)` |
| Sombra hover | `0 8px 30px rgba(0,0,0,0.15)` |
| Scale hover | `transform: scale(1.01)` |
| Preço atual | `#16A34A` |
| Preço original (riscado) | `#9CA3AF` |
| Badge desconto fundo | `#EF4444` |
| Badge desconto texto | `#fff` |
| Botão popular | `linear-gradient(135deg, #22C55E, #16A34A)` |
| Botão normal | `linear-gradient(135deg, #0891B2, #06B6D4)` |
| Sombra botão popular | `0 4px 12px rgba(34,197,94,0.4)` |
| Sombra botão normal | `0 4px 12px rgba(8,145,178,0.4)` |

### Stepper (estado selecionado)

| Elemento | Cor |
|---|---|
| Borda externa | `2px solid #22C55E` |
| Fundo | `#F0FDF4` |
| Botão `-` (qty > 1) fundo | `#DCFCE7` |
| Botão `-` (qty > 1) texto | `#16A34A` |
| Botão `-` (qty = 1) fundo | `#FEE2E2` |
| Botão `-` (qty = 1) texto | `#EF4444` |
| Botão `+` fundo | `#DCFCE7` |
| Botão `+` texto | `#16A34A` |
| Texto quantidade | `#16A34A` |

### Combo IA

| Elemento | Cor |
|---|---|
| Fundo | `linear-gradient(135deg, #7C3AED, #DB2777)` |
| Decoração círculo 1 | `rgba(255,255,255,0.1)` (top -20, right -20, 100px) |
| Decoração círculo 2 | `rgba(255,255,255,0.05)` (bottom -30, left -30, 80px) |
| Ícone Sparkles | `#FDE68A` |
| Cards internos fundo | `rgba(255,255,255,0.15)` |
| Badge -15% IA fundo | `#FACC15` |
| Badge -15% IA texto | `#000` |
| Badge economia fundo | `rgba(255,255,255,0.2)` |
| Botão CTA fundo | `#fff` |
| Botão CTA texto | `#7C3AED` |

### Barra de carrinho (sticky bottom)

| Elemento | Cor |
|---|---|
| Fundo | `#1F2937` |
| Ícone carrinho | `#22C55E` |
| Badge count | `#EF4444` |
| Subtexto | `#9CA3AF` |
| Total | `#22C55E` |
| Botão CTA | `linear-gradient(135deg, #22C55E, #16A34A)` |

### Barra de comparação (fixed bottom)

| Elemento | Cor |
|---|---|
| Fundo | `#1F2937` |
| Ícone BarChart3 | `#60A5FA` |
| Botão "Comparar Agora" | `#3B82F6` |

---

## 5. Animações

| Animação | Tipo | Duração | Onde |
|---|---|---|---|
| Card hover scale | CSS `transition: "all 0.3s ease"` | 300ms | Cards de ingresso (scale 1.01 + shadow) |
| Aba filtro | CSS `transition: "all 0.2s"` | 200ms | Botões das abas |
| Botão copiar Pix | CSS `transition: "all 0.2s"` | 200ms | `/ingressos/checkout` |
| Barra comparar aparecer | CSS keyframe `slideUp` | 300ms | Barra flutuante de comparação |
| Badge low stock | CSS keyframe `pulse` | 2s infinite | Badge de escassez de ingressos |
| Countdown timer | `setInterval 1000ms` | — | Hero countdown (MM:SS) |
| Atualização soldToday | `setInterval 8000ms` | — | Counter de vendidos/disponíveis |
| AnimatedCounter | `setInterval 80ms` | ~1.6s | Contador de vendidos hoje (20 steps) |
| Loader checkout | CSS keyframe `spin` | 1s infinite | Ícone `Loader2` durante geração Pix |
| Skeleton sucesso | CSS keyframe `pulse` | 2s infinite | Loading na página de sucesso |

**Keyframes definidos:**
```css
@keyframes slideUp { from { transform: translateX(-50%) translateY(20px); opacity: 0; } to { transform: translateX(-50%) translateY(0); opacity: 1; } }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
@keyframes pulse { 0%, 100% { opacity: 1 } 50% { opacity: 0.5 } }
```

---

## 6. Funções auxiliares

### `ingressos.tsx`

```typescript
formatPrice(price: number): string
// Intl.NumberFormat pt-BR currency BRL → "R$ 189,00"

getBestValueId(list: Ticket[]): string
// Itera todos os tickets, retorna o id com maior ratio discount/price

AnimatedCounter({ target: number, suffix: string }): JSX.Element
// Anima de prevTarget até target em steps de max(1, floor(diff/20))
// setInterval 80ms, limpa no cleanup
// useRef(prevTarget) para animação incremental

AlsoBoughtSection({ ticketId: string, allTickets: Ticket[] }): JSX.Element | null
// Busca ticket.alsoBoght[], mapeia para objetos, filtra nulos
// Retorna null se lista vazia
```

### `ingressos-checkout.tsx`

```typescript
formatCpf(v: string): string
// Remove não-dígitos, slice(0,11), aplica máscara "000.000.000-00"

formatPhone(v: string): string
// Remove não-dígitos, slice(0,11), aplica máscara "(00) 00000-0000"

validateForm(): boolean
// nome: mínimo 2 palavras (split(" ").length >= 2)
// email: contém "@"
// cpf: 11 dígitos numéricos (após removeNonDigits)
// phone: mínimo 10 dígitos numéricos
// Seta formErrors e retorna false se houver erros

handleSubmit(): void
// validateForm() → createPaymentMutation.mutate()

handleCopy(): void
// navigator.clipboard.writeText(copyPasteCode)
// setCopied(true) → setTimeout 3000ms → setCopied(false)
// trackEvent("pix_code_copy")
```

### `ingressos-sucesso.tsx`

```typescript
formatPrice(price: number): string
// Mesmo padrão das outras páginas

handleDownload(): void
// Gera texto do comprovante com dados da transação
// new Blob([content], { type: "text/plain" })
// URL.createObjectURL(blob) → a.download = "ingresso-rsv360-{txnId}.txt" → a.click()
// URL.revokeObjectURL(blob)
// trackEvent("ticket_download_click")
```

---

## 7. Biblioteca de carrinho — `cart-store.ts`

**Chave localStorage:** `rsv_tickets_cart`

### Interface `CartItem`

```typescript
interface CartItem {
  ticketId: string;
  name: string;
  unitPrice: number;
  originalPrice?: number;
  discount?: number;
  quantity: number;
  image?: string;
}
```

### Funções exportadas

| Função | Parâmetros | Retorno | Comportamento |
|---|---|---|---|
| `getCart()` | — | `CartItem[]` | Lê localStorage, parse JSON, retorna `[]` em caso de erro |
| `saveCart(items)` | `CartItem[]` | `void` | Serializa e salva em localStorage |
| `addToCart(item)` | `Omit<CartItem, "quantity">` | `CartItem[]` | Se existe: incrementa qty; se não: adiciona com qty=1 |
| `removeFromCart(ticketId)` | `string` | `CartItem[]` | Filtra fora o item, salva e retorna |
| `updateQty(ticketId, qty)` | `string, number` | `CartItem[]` | qty <= 0 → remove; qty > 0 → atualiza |
| `clearCart()` | — | `void` | `localStorage.removeItem(CART_KEY)` |
| `getCartTotal(items)` | `CartItem[]` | `number` | `reduce(sum + unitPrice * quantity, 0)` |
| `getCartItemQty(items, ticketId)` | `CartItem[], string` | `number` | Retorna qty do item ou 0 |

---

## 8. Analytics — `analytics.ts`

**Chave localStorage:** `rsv_analytics`  
**Buffer máximo:** 200 entradas (FIFO — remove as mais antigas)  
**Log dev:** `console.log("[RSV Analytics]", event, properties)` apenas em `import.meta.env.DEV`

### Tipos de eventos rastreados

| Evento | Onde disparado | Propriedades |
|---|---|---|
| `tickets_page_view` | Mount de `/ingressos` | — |
| `ticket_filter_change` | — (tipo definido, não implementado) | — |
| `ticket_card_open` | — (tipo definido, não implementado) | — |
| `ticket_add_to_cart` | Clique "Comprar Agora" ou botão `+` | `ticketId`, `quantity` |
| `ticket_remove_from_cart` | Botão `-` quando qty chega a 0 | `ticketId` |
| `ai_combo_accept` | — (tipo definido, não implementado) | — |
| `ai_combo_dismiss` | — (tipo definido, não implementado) | — |
| `related_hotel_click` | — (tipo definido, não implementado) | — |
| `tickets_checkout_start` | Clique "Ir para pagamento" na barra sticky | `total`, `items` (count) |
| `pix_checkout_view` | Mount de `/ingressos/checkout` | — |
| `pix_code_copy` | Clique no botão copiar código | `transactionId` |
| `pix_qr_visible` | Pix gerado com sucesso (onSuccess mutation) | `transactionId` |
| `pix_payment_confirmed` | Status APPROVED detectado (useEffect) | `transactionId` |
| `pix_payment_expired` | Status EXPIRED detectado (useEffect) | `transactionId` |
| `pix_payment_failed` | Status FAILED detectado (useEffect) | `transactionId` |
| `tickets_success_view` | Mount de `/ingressos/sucesso` | `transactionId` |
| `ticket_download_click` | Clique em "Baixar Ingresso" | `transactionId` |
| `support_whatsapp_click` | Clique suporte WhatsApp | `from: "sucesso"` (em sucesso) ou sem props (em checkout) |
| `related_offer_click` | Clique card hotel relacionado | `hotelName` |

**Estrutura de cada entrada no buffer:**
```json
{ "event": "ticket_add_to_cart", "properties": { "ticketId": "hot-park", "quantity": 1 }, "timestamp": "2026-03-21T12:00:00.000Z" }
```

---

## 9. Página `/ingressos/checkout`

### 9.1 Estado React

| State | Tipo | Valor inicial | Responsabilidade |
|---|---|---|---|
| `cart` | `CartItem[]` | `getCart()` (lazy) | Lido uma vez no mount, imutável no checkout |
| `form` | `FormState` | `{name:"",email:"",cpf:"",phone:""}` | Dados do comprador |
| `formErrors` | `Partial<FormState>` | `{}` | Erros de validação por campo |
| `step` | `"form" \| "pix"` | `"form"` | Passo atual do checkout |
| `paymentData` | `PaymentData \| null` | `null` | Dados do Pix gerado |
| `copied` | `boolean` | `false` | Estado do botão copiar |
| `secondsLeft` | `number` | `1800` (30min) | Countdown em segundos |
| `timerRef` | `RefObject<NodeJS.Timeout>` | `null` | Referência do interval do timer |

### 9.2 Fluxo técnico

```
1. Mount: cart.length === 0 → navigate("/ingressos")
2. Mount: trackEvent("pix_checkout_view")
3. useEffect [step, paymentData]: quando step==="pix", inicia interval 1s para secondsLeft
4. User preenche form com máscaras CPF e telefone (onChange)
5. handleSubmit() → validateForm() → createPaymentMutation.mutate()
6. POST /api/payments/tickets/create
7. onSuccess: setPaymentData() + setStep("pix") + calcular secondsLeft real da expirationDate
8. trackEvent("pix_qr_visible")
9. useQuery polling GET /api/payments/tickets/:id/status (refetchInterval: 3000ms)
10. useEffect [statusData]: APPROVED → clearCart() + navigate("/ingressos/sucesso?txn=ID")
11. useEffect [statusData]: EXPIRED → trackEvent("pix_payment_expired")
12. useEffect [statusData]: FAILED → trackEvent("pix_payment_failed")
```

### 9.3 Visual do stepper (header)

```
[1]  ——linha——  [2]

Círculo 1: sempre branco, texto #2563EB
Linha: #fff (pix) ou rgba(255,255,255,0.3) (form)
Círculo 2: #fff + texto #2563EB (pix) ou rgba(255,255,255,0.3) + texto #fff (form)
```

### 9.4 Mutação de criação de Pix

```typescript
useMutation({
  mutationFn: () => apiRequest("POST", "/api/payments/tickets/create", {
    items: cart.map(c => ({ ticketId, title, quantity, unitPrice })),
    customer: { name, email, cpf (sem máscara), phone (sem máscara) }
  })
})
```

### 9.5 Query de polling de status

```typescript
useQuery({
  queryKey: ["/api/payments/tickets", paymentData?.transactionId, "status"],
  queryFn: () => fetch(`/api/payments/tickets/${id}/status`).then(r => r.json()),
  enabled: !!paymentData && step === "pix" && paymentData?.status !== "APPROVED",
  refetchInterval: 3000,  // 3 segundos
})
```

### 9.6 Banners de status do pagamento

| Status | Background | Borda | Ícone | Texto |
|---|---|---|---|---|
| `PENDING` (não expirado) | `#FFF7ED` | `#FED7AA` | `Clock` laranja + `Loader2` spin | "Aguardando pagamento — expira em MM:SS" |
| `APPROVED` | `#DCFCE7` | `#86EFAC` | `CheckCircle2` verde | "Pagamento confirmado!" |
| `EXPIRED` ou secondsLeft===0 | `#FEF2F2` | `#FECACA` | `XCircle` vermelho | "Pix expirado" + Link voltar |

### 9.7 QR Code e campo de código

- **QR:** `<img src={qrCodeBase64}>` — 180×180px, `border: "3px solid #22C55E"`, `borderRadius: 12`
- **Campo Pix:** `background: #F9FAFB`, `border: 1px solid #E5E7EB`, `borderRadius: 10`
- **Código:** `<code>` com `fontFamily: "monospace"`, `fontSize: 11`, `wordBreak: "break-all"`
- **Botão copiar:**
  - Normal: `background: #22C55E`, texto "Copiar" + ícone `Copy`
  - Copiado: `background: #DCFCE7`, `color: #16A34A`, texto "Copiado!" + ícone `Check`
  - `transition: "all 0.2s"`, reverte em 3000ms

### 9.8 Instruções "Como pagar"

4 passos numerados com badges circulares verdes `#DCFCE7` / `#16A34A`:
1. Abra seu banco ou app de pagamento
2. Escolha pagar via Pix
3. Escaneie o QR Code ou cole o código
4. Confirme e pronto!

---

## 10. Página `/ingressos/sucesso`

### 10.1 Leitura de dados

```typescript
// Parâmetro da URL
const search = useSearch()
const txnId = new URLSearchParams(search).get("txn") ?? ""

// Dados da transação
useQuery({
  queryKey: ["/api/payments/tickets", txnId],
  queryFn: () => fetch(`/api/payments/tickets/${txnId}`).then(r => r.ok ? r.json() : null),
  enabled: !!txnId,
})
```

### 10.2 Hero de sucesso

```
background: linear-gradient(135deg, #16A34A 0%, #22C55E 100%)
padding: "24px 20px 28px" · textAlign: center
Ícone CheckCircle2 (56×56) · margin: "0 auto 12px"
H1: "Pagamento Confirmado!" · fontSize 24 · fontWeight 800
```

### 10.3 Badge de modo demo

```
background: #EFF6FF · border: 1px solid #BFDBFE
borderRadius: 10 · fontSize: 12 · color: #1D4ED8
"Modo demonstração — este é um ingresso de teste"
```

### 10.4 Card de resumo

- Header: ícone `Ticket` azul + "Seus Ingressos"
- Linhas por item: nome + "Nx ingresso" / total à direita (verde)
- Rodapé: "Total pago" / valor em verde `fontSize: 20`
- Box de transação: fundo `#F9FAFB`, texto monospace, exibe apenas primeiros 20 chars do txnId + "..."

### 10.5 Cross-sell de hotéis

3 hotéis hardcoded em `relatedHotels`:

| Hotel | Preço | Badge |
|---|---|---|
| Hotel diRoma Fiori | R$320/noite | -20% |
| Lacqua DiRoma | R$280/noite | TOP |
| Pousada Recanto | R$195/noite | Econômico |

Cada card: `display: flex`, imagem 56×56px, estrela `#FACC15`, badge verde `#DCFCE7` / `#16A34A`.

### 10.6 Download do comprovante

Arquivo gerado: `ingresso-rsv360-{txnId}.txt`

Conteúdo:
```
RSV360 — Reservei Viagens
Ingresso Digital

Transação: {txnId}
Data: {DD/MM/YYYY}
Cliente: {nome}

Itens:
• Nx Nome — R$ XX,XX

Total pago: R$ XX,XX

Apresente este comprovante na entrada do parque.
Dúvidas? WhatsApp: (64) 99319-7555
```

---

## 11. Backend — Rotas da API de ingressos

### `POST /api/payments/tickets/create`

**Body:**
```json
{
  "items": [
    { "ticketId": "string", "title": "string", "quantity": 1, "unitPrice": 189 }
  ],
  "customer": {
    "name": "Nome Completo",
    "email": "email@exemplo.com",
    "cpf": "12345678901",
    "phone": "64993197555"
  }
}
```

**Resposta (201):**
```json
{
  "transactionId": "demo-tkt-1710000000000-abc123",
  "status": "PENDING",
  "qrCodeBase64": "data:image/png;base64,...",
  "copyPasteCode": "00020126...",
  "expirationDate": "2026-03-21T12:30:00.000Z",
  "totalAmount": 189,
  "items": [...],
  "customer": {...},
  "demo": true
}
```

**Armazenamento:** `ticketTransactions.set(transactionId, result)` — Map em memória, sem DB.

### `GET /api/payments/tickets/:id/status`

**Resposta:**
```json
{ "status": "PENDING", "paid": false }
```

**Lógica demo:** verifica `expirationDate` da transação armazenada:
```typescript
if (txn.expirationDate && Date.now() > new Date(txn.expirationDate).getTime()) {
  return res.json({ status: "EXPIRED", paid: false })
}
```

### `GET /api/payments/tickets/:id`

Retorna o objeto completo da transação armazenada no Map.  
Usado pela página `/ingressos/sucesso` para exibir o resumo.

### `POST /api/webhooks/tickets`

**Headers obrigatório:** `x-api-key` (validado contra `WEBHOOK_SECRET` env var)

**Body:**
```json
{ "transactionId": "tkt-...", "status": "paid" }
```

**Mapeamento de status:**
- `paid` ou `approved` → `APPROVED`
- `expired` → `EXPIRED`
- `failed` → `FAILED`
- `cancelled` → `CANCELLED`

### Persistência das transações

```typescript
const ticketTransactions = new Map<string, TicketPaymentResult>()
```

Dados em memória — perdidos ao reiniciar o processo. Adequado para MVP.

---

## 12. Serviço de Pagamento — `ticket-payment.service.ts`

### Detecção de modo

```typescript
const GATEWAY_API_URL = process.env.GATEWAY_API_URL
const GATEWAY_API_KEY = process.env.GATEWAY_API_KEY
const IS_DEMO = !GATEWAY_API_URL || !GATEWAY_API_KEY
```

### Função `createTicketPix`

**Modo demo:** retorna QR code em base64 hardcoded + código Pix sintético:
```
00020126580014br.gov.bcb.pix0136reservei-ingressos-{orderId}...{NOME_UPPERCASE}...CALDAS NOV...6304ABCD
```

**Modo real:** POST para `{GATEWAY_API_URL}/transactions` com:
```json
{
  "items": [{ "id": "ticketId", "title": "...", "quantity": 1, "unit_price": 189 }],
  "customer": { "name": "...", "email": "...", "document": "cpf", "phone": "..." },
  "payment_method": "pix",
  "metadata": { "orderId": "tkt-...", "type": "ingresso" }
}
```

**ID de transação:**
- Demo: `demo-tkt-{timestamp}-{6 chars random base36}`
- Real: ID retornado pelo gateway

**Expiração:** `Date.now() + 30 * 60 * 1000` (30 minutos)

### Função `checkTicketPaymentStatus`

**Demo / transações "demo-*":** sempre retorna `{ status: "PENDING", paid: false }`

**Real:** GET `{GATEWAY_API_URL}/transactions/{transactionId}`:
- `paid` ou `approved` → `{ status: "APPROVED", paid: true }`
- `expired` → `{ status: "EXPIRED", paid: false }`
- qualquer outro → `{ status: "PENDING", paid: false }`

### Diferença crítica: Ingresso vs. Excursão

| Tipo | Serviço | Split de comissão |
|---|---|---|
| **Ingresso** | `ticket-payment.service.ts` → `createTicketPix` | ❌ Sem split — valor integral para Reservei |
| **Excursão** | `payment.service.ts` → `createSplitPaymentPix` | ✅ Com split entre Reservei + Organizador |

---

## 13. `data-testid` — IDs de teste completos

### `/ingressos`

| Elemento | data-testid |
|---|---|
| Link voltar home | `link-back-home` |
| Título da página | `text-page-title` |
| Countdown timer | `text-countdown-timer` |
| Aba "Todos" | `button-filter-todos` |
| Aba "Dia Inteiro" | `button-filter-dia-inteiro` |
| Aba "Meio Dia" | `button-filter-meio-dia` |
| Aba "Mais Popular" | `button-filter-mais-popular` |
| Aba "Maior Desconto" | `button-filter-maior-desconto` |
| Seção Combo IA | `section-combo-ia` |
| Botão Combo IA | `button-combo-ia-buy` |
| Barra de comparação | `bar-compare` |
| Botão "Comparar Agora" | `button-compare-open` |
| Botão limpar comparação | `button-compare-clear` |
| Modal de comparação | `modal-compare` |
| Botão fechar modal | `button-compare-close` |
| Botão comprar via WhatsApp (modal comparação) | `button-compare-buy-{id}` |
| Card do ingresso | `card-ticket-{id}` |
| Badge "Mais Popular" | `badge-popular-{id}` |
| Badge "Melhor Custo" | `badge-best-value-{id}` |
| Nome do ingresso | `text-ticket-name-{id}` |
| Counter vendidos hoje | `text-sold-today-{id}` |
| Preço do ingresso | `text-price-{id}` |
| Urgência low stock | `urgency-low-stock-{id}` |
| Urgência available | `urgency-available-{id}` |
| Botão comparar card | `button-compare-{id}` |
| Botão "Comprar Agora" | `button-buy-{id}` |
| Stepper container | `stepper-{id}` |
| Botão diminuir qty | `button-decrease-{id}` |
| Texto quantidade | `text-qty-{id}` |
| Botão aumentar qty | `button-increase-{id}` |
| Barra sticky carrinho | `bar-cart-summary` |
| Botão ir ao checkout | `button-cart-checkout` |
| Botão WhatsApp flutuante | `link-whatsapp-float` |

### `/ingressos/checkout`

| Elemento | data-testid |
|---|---|
| Link voltar ingressos | `link-back-ingressos` |
| Título do checkout | `text-checkout-title` |
| Card resumo do pedido | `card-order-summary` |
| Linha por item | `row-order-item-{ticketId}` |
| Total do pedido | `text-total-price` |
| Card formulário | `card-customer-form` |
| Input nome | `input-name` |
| Input email | `input-email` |
| Input CPF | `input-cpf` |
| Input telefone | `input-phone` |
| Alerta erro pagamento | `alert-payment-error` |
| Botão gerar Pix | `button-generate-pix` |
| Card pagamento Pix | `card-pix-payment` |
| Banner pagamento confirmado | `banner-payment-approved` |
| Banner Pix expirado | `banner-payment-expired` |
| Banner aguardando | `banner-payment-pending` |
| Badge modo demo | `badge-demo-mode` |
| Container QR Code | `div-qr-code` |
| Campo código Pix | `field-pix-code` |
| Botão copiar código | `button-copy-pix` |
| Countdown Pix | `text-pix-countdown` |
| Link suporte WhatsApp | `link-checkout-support` |

### `/ingressos/sucesso`

| Elemento | data-testid |
|---|---|
| Título sucesso | `text-success-title` |
| Badge modo demo | `badge-demo-success` |
| Card resumo | `card-success-summary` |
| Linha item | `row-success-item-{ticketId}` |
| Total pago | `text-success-total` |
| ID da transação | `text-transaction-id` |
| Botão download | `button-download-ticket` |
| Link WhatsApp suporte | `link-success-whatsapp` |
| Seção hotéis relacionados | `section-related-hotels` |
| Card hotel 0/1/2 | `card-related-hotel-{0,1,2}` |
| Link ver mais ingressos | `link-back-to-tickets` |

---

## 14. Regras de preservação (inegociáveis)

1. **Hero gradiente azul** `#0891B2 → #2563EB` — nunca alterar cor, padding ou estrutura
2. **Grid de cards** — nunca trocar por lista ou carrossel
3. **Badges de desconto e match IA** — nunca remover dos cards
4. **Combo IA** — nunca remover a seção
5. **Social proof / PersonalizedBanner** — nunca remover
6. **Card não muda de altura** ao mostrar stepper vs. botão
7. **Escopo da rota** — sem nenhum elemento de excursão, ônibus, poltrona, organizador
8. **Pix de ingresso** — usar sempre `createTicketPix` (sem split), nunca `createSplitPaymentPix`
9. **Analytics** — toda interação relevante deve chamar `trackEvent` com o tipo correto

---

## 15. Variáveis de ambiente relevantes

| Variável | Presente | Ausente |
|---|---|---|
| `GATEWAY_API_URL` | Modo real: chama gateway externo | Modo demo: QR code falso |
| `GATEWAY_API_KEY` | Modo real: autenticação Bearer | Modo demo: sem autenticação |
| `WEBHOOK_SECRET` | Valida `x-api-key` no webhook | Sem validação (inseguro em produção) |
