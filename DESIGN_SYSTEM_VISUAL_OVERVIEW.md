# 🎨 Design System — Visual Overview
## Família de Layouts + Design Tokens

---

## 🎯 AS 5 FAMÍLIAS DE LAYOUT

```
┌─────────────────────────────────────────────────────────────────┐
│ FAMÍLIA A: PUBLIC PAGE SHELL — Marketing & Editorial            │
├─────────────────────────────────────────────────────────────────┤
│                          HERO (full-bleed opcional)              │
├─────────────────────────────────────────────────────────────────┤
│                    ┌──────────────────────────┐                  │
│                    │   Conteúdo (max-1280px)  │                  │
│                    │                          │                  │
│                    │  px-4 sm:px-6 lg:px-8    │                  │
│                    └──────────────────────────┘                  │
│                                                                   │
│ Spacing generoso, foco em leitura, conversão                     │
│ Uso: Home, landing, contato, promoções                           │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ FAMÍLIA B: CATALOG PAGE SHELL — Shopping & Discovery             │
├──────────────────────────────┬──────────────────────────────────┤
│  FILTROS                     │  CONTEÚDO PRINCIPAL              │
│  (280px desktop)             │  (grid responsivo)               │
│                              │                                  │
│  • Categorias                │  ┌─────────┐ ┌─────────┐        │
│  • Preço                     │  │ Card    │ │ Card    │        │
│  • Tags                      │  └─────────┘ └─────────┘        │
│  • Avaliações                │  ┌─────────┐ ┌─────────┐        │
│                              │  │ Card    │ │ Card    │        │
│  (Drawer no mobile)          │  └─────────┘ └─────────┘        │
│                              │                                  │
│ Max-width: 1280px, grid 2-4 colunas                             │
│ Uso: Ingressos, hotéis, atrações, excursões                     │
└──────────────────────────────┴──────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ FAMÍLIA C: AUTH PAGE SHELL — Focused Forms                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│                         ┌─────────────────┐                      │
│                         │      LOGO       │                      │
│                         └─────────────────┘                      │
│                                                                   │
│                   TÍTULO DA PÁGINA (h1)                          │
│                   Subtítulo descritivo (p)                       │
│                                                                   │
│                   ┌─────────────────────────┐                    │
│                   │  Formulário             │                    │
│                   │  (email, password, etc) │                    │
│                   │  max-width: 440px       │                    │
│                   └─────────────────────────┘                    │
│                                                                   │
│            Footer: Link para "Cadastre-se" ou similar            │
│                                                                   │
│ Centralizado 100vh, mínima distração, aparência segura           │
│ Uso: Login, cadastro, reset password                             │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ FAMÍLIA D: APP MOBILE SHELL — Premium Mobile Experience          │
├─────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────┐     │
│ │ TOP BAR (56px) — Logo / Título / Actions               │     │
│ └─────────────────────────────────────────────────────────┘     │
│                                                                   │
│ ┌─────────────────────────────────────────────────────────┐     │
│ │                                                         │     │
│ │         MAIN CONTENT (scrollable)                      │     │
│ │         max-width: 480px                              │     │
│ │                                                         │     │
│ │         • Cards                                        │     │
│ │         • Sections                                     │     │
│ │         • Lists                                        │     │
│ │                                                         │     │
│ │                (overflow-y-auto)                       │     │
│ │                                                         │     │
│ └─────────────────────────────────────────────────────────┘     │
│ ┌─────────────────────────────────────────────────────────┐     │
│ │ BOTTOM NAV (64px) — Home, Search, Bookings, Profile    │     │
│ └─────────────────────────────────────────────────────────┘     │
│                                                                   │
│ Mobile-first, safe-area aware, sticky bars                       │
│ Uso: Perfil, reservas, notificações, fidelidade                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ FAMÍLIA E: ADMIN SHELL — B2B Dashboard                          │
├────────────────────────────────────────────────────────────────┤
│ ┌────────────────────────────────────────────────────────────┐ │
│ │ TOPBAR (64px) — Logo, Search, Notifications, Avatar       │ │
│ └────────────────────────────────────────────────────────────┘ │
│ ┌──────────────────┬──────────────────────────────────────────┐ │
│ │ SIDEBAR          │  MAIN CONTENT                            │ │
│ │ (250px/64px)     │  (max-width: 1440px, scrollable)        │ │
│ │                  │                                          │ │
│ │ • Dashboard      │  Grid Layout:                            │ │
│ │ • Users          │  ┌────────┐ ┌────────┐ ┌────────┐      │ │
│ │ • Bookings       │  │Métrica │ │Métrica │ │Métrica │      │ │
│ │ • Financial      │  └────────┘ └────────┘ └────────┘      │ │
│ │ • Reports        │  ┌────────────────────────────────────┐ │ │
│ │ • Settings       │  │        Chart / Table                │ │
│ │                  │  └────────────────────────────────────┘ │ │
│ │ (Retrátil)       │                                          │ │
│ │ (Drawer mobile)  │                                          │ │
│ └──────────────────┴──────────────────────────────────────────┘ │
│                                                                   │
│ Sidebar retrátil, topbar sticky, max 1440px                     │
│ Uso: Dashboard, CRM, financeiro, reports, settings              │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎨 PALETA DE CORES

### Cores Primárias (Brand)
```
Deep Blue         #1E3A8A  ███████  Azul escuro, confiança
Action Blue       #2563EB  ███████  Azul vibrante, CTAs
Graphite          #111827  ███████  Preto com matiz, texto
Slate 50          #F8FAFC  ███████  Branco quase puro, backgrounds
White             #FFFFFF  ███████  Branco puro, superfícies
```

### Escala Neutra (Slate 100-900)
```
Slate 100  #F1F5F9  ███████  Muito claro
Slate 200  #E2E8F0  ███████  Claro (borders padrão)
Slate 300  #CBD5E1  ███████  
Slate 400  #94A3B8  ███████  
Slate 500  #64748B  ███████  Medium (icon desabilitado)
Slate 600  #475569  ███████  Escuro-médio
Slate 700  #334155  ███████  
Slate 800  #1E293B  ███████  Escuro
Slate 900  #0F172A  ███████  Muito escuro
```

### Cores Semânticas
```
Success   #10B981  ███████  Confirmação, positivo
Warning   #F59E0B  ███████  Alerta, atenção
Error     #EF4444  ███████  Erro, crítico
Info      #3B82F6  ███████  Informação
```

---

## 📐 ESCALA DE ESPAÇAMENTO

```
8px  (--space-2)   ▮ Micro spacing (tight)
12px (--space-3)   ▮▮ 
16px (--space-4)   ▮▮▮ Padrão card padding
20px (--space-5)   ▮▮▮▮ Padrão header margin
24px (--space-6)   ▮▮▮▮▮ Padrão section gap
32px (--space-8)   ▮▮▮▮▮▮ Spacing grande
40px (--space-10)  ▮▮▮▮▮▮▮ Spacing heroico
48px (--space-12)  ▮▮▮▮▮▮▮▮ Spacing estrutural
64px (--space-16)  ▮▮▮▮▮▮▮▮▮▮ Gap entre blocos
80px (--space-20)  ▮▮▮▮▮▮▮▮▮▮▮▮ Grande demais
```

---

## 🎭 TIPOGRAFIA

### Hierarquia

```
H1 — 36px, 700 weight, -0.01em tracking
H2 — 28px, 700 weight, -0.01em tracking
H3 — 24px, 600 weight, 0em tracking
H4 — 20px, 600 weight, 0em tracking

Body     — 16px, 400 weight, 1.5 line-height
Small    — 14px, 400 weight, 1.5 line-height
XSmall   — 12px, 400 weight, 1.5 line-height

Label    — 14px, 500 weight (inputs, badges)
```

### Fonte Primária
```
Inter  (sans-serif)  — Moderna, legível, sistema
Georgia (serif)      — Fallback para títulos premium
Monaco (monospace)   — Código, dados técnicos
```

---

## 🌊 SOMBRAS (Premium & Discretas)

```
Shadow XS  0 1px 2px rgba(0,0,0,0.05)        ▬ (muito leve)
Shadow SM  0 1px 3px 0 rgba(0,0,0,0.1)       ▬▬ (padrão card)
Shadow MD  0 4px 6px -1px rgba(0,0,0,0.1)    ▬▬▬ 
Shadow LG  0 10px 15px -3px rgba(0,0,0,0.1)  ▬▬▬▬ (elevated)
Shadow XL  0 20px 25px -5px rgba(0,0,0,0.1)  ▬▬▬▬▬ (modal)
Shadow 2XL 0 25px 50px -12px rgba(0,0,0,0.25) ▬▬▬▬▬▬
```

---

## 🔘 BORDER RADIUS

```
Radius SM   4px    ▮ (inputs pequenos)
Radius MD   8px    ▮▮ (inputs padrão)
Radius LG   12px   ▮▮▮ (buttons, inputs)
Radius XL   16px   ▮▮▮▮ (cards padrão)
Radius 2XL  20px   ▮▮▮▮▮ (cards grandes)
Radius 3XL  24px   ▮▮▮▮▮▮ (hero, premium surfaces)
```

---

## 📊 TOKENS CSS DISPONÍVEIS

### Cores
```css
--color-deep-blue
--color-action-blue
--color-graphite
--color-slate-50 até --color-slate-900
--color-success
--color-warning
--color-error
--color-info
```

### Spacing
```css
--space-2, --space-3, --space-4, --space-5, --space-6
--space-8, --space-10, --space-12, --space-16, --space-20
```

### Layout (Page Widths)
```css
--page-width-public: 1280px
--page-width-catalog: 1280px
--page-width-auth: 440px
--page-width-app-mobile: 480px
--page-width-admin: 1440px

--sidebar-width-catalog: 280px
--sidebar-width-admin: 250px
--sidebar-width-admin-collapsed: 64px
```

### Radius
```css
--radius-sm, --radius-md, --radius-lg
--radius-xl, --radius-2xl, --radius-3xl
```

### Shadows
```css
--shadow-xs, --shadow-sm, --shadow-md
--shadow-lg, --shadow-xl, --shadow-2xl

--shadow-card: var(--shadow-sm)
--shadow-card-hover: var(--shadow-md)
--shadow-elevated: var(--shadow-lg)
```

### Superfícies & Text
```css
--surface-bg, --surface-alt, --surface-elevated, --surface-dim
--text-primary, --text-secondary, --text-tertiary
--text-disabled, --text-inverse
--border-color, --border-color-light, --border-color-dark
```

### Tipografia
```css
--font-sans, --font-serif, --font-mono
--lh-tight, --lh-normal, --lh-relaxed, --lh-loose
--ls-tight, --ls-normal, --ls-relaxed
```

### Transições
```css
--transition-fast: 150ms
--transition-base: 200ms
--transition-slow: 300ms
--easing-ease-*: vários
```

---

## 🎯 PADRÃO DE COMPONENTE

```tsx
interface ComponentProps {
  /** Descrição clara */
  prop?: string;
  className?: string;
}

export const MyComponent = React.forwardRef<
  HTMLDivElement,
  ComponentProps
>(({ prop = 'default', className = '' }, ref) => {
  return (
    <div 
      ref={ref}
      className={`
        /* Espaçamento */
        p-4 gap-4
        
        /* Cores (tokens) */
        bg-white text-slate-900
        border border-slate-200
        
        /* Sombra */
        shadow-sm
        
        /* Radius */
        rounded-xl
        
        /* Estados */
        hover:shadow-md transition-shadow
        
        /* Custom */
        ${className}
      `}
    >
      {/* Conteúdo */}
    </div>
  );
});
```

---

## 📱 BREAKPOINTS PADRÃO

```
Mobile:  0–639px      └─ Drawer, stack vertical
SM:      640–767px    └─ Tablet pequeno
MD:      768–1023px   └─ Tablet
LG:      1024–1279px  └─ Desktop pequeno
XL:      1280–1439px  └─ Desktop padrão
2XL:     1440px+      └─ Desktop grande
```

---

## ✨ EXEMPLO COMPLETO: PÁGINA DE INGRESSOS

```tsx
import { CatalogPageShell, PageContainer, SectionContainer } from '@/components/layout-system';
import { SearchBar, FilterChips } from '@/components/common';

export default function IngressosPage() {
  return (
    <CatalogPageShell
      title="Ingressos"
      sidebar={
        <aside className="space-y-6">
          <SearchBar placeholder="Buscar atração..." />
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Categorias</h3>
            <FilterChips options={categories} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Preço</h3>
            {/* Range slider */}
          </div>
        </aside>
      }
    >
      {/* Grid de ingressos */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {tickets.map(ticket => (
          <div 
            key={ticket.id}
            className="rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <img src={ticket.image} alt={ticket.name} className="rounded-lg mb-3" />
            <h3 className="font-semibold text-slate-900">{ticket.name}</h3>
            <p className="text-sm text-slate-600">{ticket.location}</p>
            <div className="flex items-end justify-between mt-4">
              <div>
                <p className="text-xs text-slate-500">A partir de</p>
                <p className="text-lg font-bold text-action-blue">R$ {ticket.price}</p>
              </div>
              <button className="px-4 py-2 rounded-lg bg-action-blue text-white font-medium hover:bg-deep-blue transition-colors">
                Comprar
              </button>
            </div>
          </div>
        ))}
      </div>
    </CatalogPageShell>
  );
}
```

---

## 🎯 MAPEAMENTO: PÁGINA → SHELL

| Página Existente | Família | Shell a Usar |
|------------------|---------|--------------|
| `/` (home) | A | PublicPageShell |
| `/hoteis` | B | CatalogPageShell |
| `/ingressos` | B | CatalogPageShell |
| `/atracoes` | B | CatalogPageShell |
| `/entrar` | C | AuthPageShell |
| `/cadastrar` | C | AuthPageShell |
| `/perfil` | D | AppMobileShell |
| `/minhas-reservas` | D | AppMobileShell |
| `/configuracoes` | D | AppMobileShell |
| `/admin/dashboard` | E | AdminShell |
| `/admin/crm` | E | AdminShell |
| `/admin/financeiro` | E | AdminShell |

---

**Próximo:** Implementar FASE 2 com componentes reutilizáveis! ✨
