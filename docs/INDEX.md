# RSV360 Design System - Documentação Completa

## 📚 Índice de Documentação

### Fase 0 - Auditoria e Estratégia
**Arquivo:** `FASE_0_VISAO_ESTRATEGICA.md`
- Diagnóstico dos problemas atuais
- Estratégia de 5 famílias de layout
- Por que não usar 1 largura universal
- Benefícios para UX, engenharia e produto

**Leia primeiro se:** Você é novo no projeto ou quer entender a estratégia global.

---

### Fase 1 - Design Tokens e Layout System
**Arquivos:** 
- `FASE_1_DESIGN_SYSTEM.md` - Guia completo
- `LAYOUT_SYSTEM_QUICK_REF.md` - Referência rápida

**Conteúdo:**
- Design Tokens (cores, spacing, tipografia, etc)
- 7 componentes de layout base
- 5 Page Shells (um para cada família)
- Como usar cada shell

**Leia se:** Você vai criar uma nova página ou customizar layouts.

---

### Fase 2 - Component Library
**Arquivos:**
- `FASE_2_COMPONENT_LIBRARY.md` - Documentação completa
- `COMPONENT_QUICK_REFERENCE.md` - Referência rápida

**Conteúdo:**
- 7 novos componentes (DataCard, SearchBar, FilterChips, etc)
- Props e exemplos de cada componente
- Variantes visuais
- Padrões comuns de uso

**Leia se:** Você vai usar componentes UI reutilizáveis.

---

## 🗂️ Estrutura de Arquivos

```
client/src/
├── tokens.css                    # Design Tokens (cores, spacing, etc)
├── components/
│   ├── layout-system/            # FASE 1 - Layout Shells
│   │   ├── PageContainer.tsx
│   │   ├── SectionContainer.tsx
│   │   ├── PublicPageShell.tsx    # Família A - Home, landing
│   │   ├── CatalogPageShell.tsx   # Família B - Ingressos, hotéis
│   │   ├── AuthPageShell.tsx      # Família C - Login, cadastro
│   │   ├── AppMobileShell.tsx     # Família D - Perfil, reservas
│   │   └── AdminShell.tsx         # Família E - Dashboard, CRM
│   │
│   └── ui/                       # FASE 2 - Component Library
│       ├── data-card.tsx
│       ├── search-bar.tsx
│       ├── filter-chips.tsx
│       ├── status-badge.tsx
│       ├── empty-state.tsx
│       ├── cta-button.tsx
│       ├── command-bar.tsx
│       ├── metric-card.tsx
│       ├── topbar.tsx
│       ├── collapsible-sidebar.tsx
│       ├── bottom-navigation.tsx
│       ├── page-header.tsx
│       ├── section-header.tsx
│       ├── skeleton.tsx
│       └── index.ts               # Exports todos os componentes

docs/
├── INDEX.md                       # Este arquivo
├── FASE_0_VISAO_ESTRATEGICA.md
├── FASE_1_DESIGN_SYSTEM.md
├── FASE_2_COMPONENT_LIBRARY.md
├── LAYOUT_SYSTEM_QUICK_REF.md
└── COMPONENT_QUICK_REFERENCE.md
```

---

## 🚀 Quick Start

### 1. Criar Uma Nova Página

```tsx
import { PublicPageShell, PageHeader, DataCard, CTAButton } from '@/components';

export function MyPage() {
  return (
    <PublicPageShell>
      <PageHeader 
        title="Minha Página"
        description="Descrição"
      />
      
      <div className="grid grid-cols-3 gap-4">
        <DataCard 
          title="Card 1"
          action={<CTAButton label="Ver" />}
        />
      </div>
    </PublicPageShell>
  );
}
```

### 2. Adicionar Busca e Filtros

```tsx
import { SearchBar, FilterChips } from '@/components/ui';

const [search, setSearch] = useState('');
const [filters, setFilters] = useState<string[]>([]);

<SearchBar value={search} onChange={setSearch} />
<FilterChips 
  options={[...]}
  selected={filters}
  onChange={setFilters}
  multiple
/>
```

### 3. Mostrar Status e Estados

```tsx
import { StatusBadge, EmptyState } from '@/components/ui';

{items.length === 0 ? (
  <EmptyState 
    title="Nenhum item"
    action={{ label: 'Criar', href: '/novo' }}
  />
) : (
  items.map(item => (
    <StatusBadge key={item.id} status={item.status} />
  ))
)}
```

---

## 5 Famílias de Layout

| Família | Uso | Shell | Max-Width | Características |
|---------|-----|-------|-----------|-----------------|
| **A - Public** | Home, landing, institucional | `PublicPageShell` | 1280px | Editorial, generosa, nav header+footer |
| **B - Catalog** | Ingressos, hotéis, listagens | `CatalogPageShell` | 1280px + 280px sidebar | Grid responsivo, sidebar retrátil |
| **C - Auth** | Login, cadastro, reset | `AuthPageShell` | 440px | Minimalista, centralizado |
| **D - App Mobile** | Perfil, reservas, minhas compras | `AppMobileShell` | 480px | Mobile-first, top+bottom nav |
| **E - Admin** | Dashboard, CRM, gestão | `AdminShell` | 1440px | B2B premium, sidebar retrátil |

---

## 12+ Componentes Disponíveis

### Layout & Navigation (5)
- `Topbar` - Barra superior
- `CollapsibleSidebar` - Barra lateral retrátil
- `BottomNavigation` - Nav inferior (mobile)
- `PageHeader` - Header de página
- `SectionHeader` - Header de seção

### Cards & Dados (2)
- `DataCard` - Card genérico
- `MetricCard` - Card de métrica

### Search & Filters (2)
- `SearchBar` - Barra de busca
- `FilterChips` - Chips de filtro

### Status & Feedback (3)
- `StatusBadge` - Badge de status
- `EmptyState` - Estado vazio
- `Skeleton` - Loading placeholder

### Buttons & Interaction (3)
- `CTAButton` - Botão CTA
- `CommandBar` - Cmd+K palette
- `ConfirmDialog` - Confirmação

---

## Design Tokens Disponíveis

### Cores (21)
```css
--color-primary-500: #f97316;      /* Laranja RSV */
--color-primary-600: #ea580c;
--color-slate-50: #f8fafc;         /* Neutras */
--color-slate-900: #0f172a;
/* ... e mais 17 cores */
```

### Spacing (14)
```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-4: 1rem;      /* 16px */
--space-6: 1.5rem;    /* 24px */
/* ... até --space-20 */
```

### Tipografia
```css
--font-size-xs: 0.75rem;
--font-size-sm: 0.875rem;
--font-size-base: 1rem;
/* ... tamanhos até 4xl */
```

---

## Padrões Comuns

### Página com Lista Vazia
```tsx
<CatalogPageShell
  sidebar={<Filters />}
>
  {items.length === 0 ? (
    <EmptyState title="Nenhum resultado" />
  ) : (
    <div className="grid gap-4">
      {items.map(item => (
        <DataCard key={item.id} {...item} />
      ))}
    </div>
  )}
</CatalogPageShell>
```

### Admin Dashboard
```tsx
<AdminShell title="Dashboard">
  <div className="grid grid-cols-4 gap-4">
    <MetricCard label="Total" value={1234} />
    <MetricCard label="Hoje" value={56} />
    <MetricCard label="Pendentes" value={12} />
  </div>
  
  <SectionHeader title="Atividades Recentes" />
  {/* Chart ou tabela */}
</AdminShell>
```

### Mobile App
```tsx
<AppMobileShell title="Meu Perfil">
  <SearchBar placeholder="Buscar..." />
  <FilterChips options={filters} />
  {/* Cards */}
</AppMobileShell>
```

---

## 🎓 Guias Recomendados

**Novo no projeto?**
1. Leia `FASE_0_VISAO_ESTRATEGICA.md` (5 min)
2. Leia `LAYOUT_SYSTEM_QUICK_REF.md` (5 min)
3. Leia `COMPONENT_QUICK_REFERENCE.md` (10 min)

**Criando uma página?**
1. Escolha a Família certa (FASE 0)
2. Importe o Shell apropriado (FASE 1)
3. Use componentes reutilizáveis (FASE 2)

**Customizando design?**
1. Consulte `tokens.css` para cores e spacing
2. Não customise inline, use as variantes dos componentes
3. Se precisar de algo novo, crie um componente reutilizável

---

## 📞 Suporte

**Dúvida sobre qual shell usar?**
→ Veja a tabela de "5 Famílias de Layout" acima

**Qual componente usar?**
→ Veja "12+ Componentes Disponíveis"

**Como customizar cores?**
→ Edite `client/src/tokens.css`

**Componente está feio?**
→ Verifique se está usando a variante correta

---

## 🔄 Evolução do Design System

```
FASE 0: Auditoria & Estratégia (✅ Completa)
│
├─→ FASE 1: Design Tokens & Layout System (✅ Completa)
│   └─→ Tokens definidos
│   └─→ 5 Shells criados
│
├─→ FASE 2: Component Library (✅ Completa)
│   └─→ 12 componentes criados
│   └─→ Documentação completa
│
├─→ FASE 3: Migrar Páginas Existentes (⏳ Próximo)
│   └─→ Atualizar home.tsx
│   └─→ Atualizar ingressos.tsx
│   └─→ Atualizar perfil.tsx
│   └─→ etc.
│
├─→ FASE 4: Animações & Transições
├─→ FASE 5: Documentação Storybook
└─→ FASE 6: Testes Automatizados
```

---

**Versão:** 2.0 (FASE 0, 1, 2 Completas)  
**Atualizado:** Março 2026  
**Mantido por:** Time de Design & Engenharia  
**Status:** 🟢 Production Ready
