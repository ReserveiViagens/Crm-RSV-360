# FASE 2 - Component Library (RSV360 Design System)

## Overview

A FASE 2 completa a fundação do Design System com uma biblioteca de 12+ componentes reutilizáveis, totalmente integrados aos Design Tokens da FASE 1.

## ✅ Componentes Entregues

### 1. **DataCard** (`data-card.tsx`)
Card genérico para exibir dados com suporte a imagem, badge e ações.

**Props:**
```tsx
interface DataCardProps {
  title: string;
  description?: string;
  image?: React.ReactNode;
  badge?: React.ReactNode;
  action?: React.ReactNode;
  variant?: 'default' | 'outlined' | 'flat';
  onClick?: () => void;
}
```

**Uso:**
```tsx
<DataCard 
  title="Ingresso Parque X"
  description="Entrada 1 dia"
  badge={<StatusBadge status="success">Disponível</StatusBadge>}
  action={<CTAButton label="Comprar" onClick={handleBuy} />}
  variant="default"
/>
```

**Variantes:**
- `default` - Fundo branco com sombra sutil
- `outlined` - Apenas borda, sem fundo
- `flat` - Fundo cinza, sem sombra

---

### 2. **SearchBar** (`search-bar.tsx`)
Barra de busca com suporte a clear, variantes de tamanho e layout.

**Props:**
```tsx
interface SearchBarProps {
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  onClear?: () => void;
  placeholder?: string;
  variant?: 'default' | 'minimal' | 'elevated';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}
```

**Uso:**
```tsx
const [search, setSearch] = useState('');

<SearchBar 
  value={search}
  onChange={setSearch}
  onSearch={(value) => handleSearch(value)}
  placeholder="Buscar ingressos..."
  size="md"
/>
```

**Variantes:**
- `default` - Borda padrão com focus ring
- `minimal` - Apenas underline
- `elevated` - Fundo cinza com sombra

---

### 3. **FilterChips** (`filter-chips.tsx`)
Chips de filtro com seleção simples ou múltipla.

**Props:**
```tsx
interface FilterChipsProps {
  options: Array<{
    id: string;
    label: string;
    icon?: React.ReactNode;
  }>;
  selected?: string | string[];
  onChange?: (selected: string | string[]) => void;
  multiple?: boolean;
  clearable?: boolean;
  variant?: 'default' | 'filled' | 'outlined';
  size?: 'sm' | 'md' | 'lg';
}
```

**Uso:**
```tsx
const [filters, setFilters] = useState<string[]>([]);

<FilterChips 
  options={[
    { id: 'parques', label: 'Parques' },
    { id: 'shows', label: 'Shows' },
    { id: 'hoteis', label: 'Hotéis' },
  ]}
  selected={filters}
  onChange={setFilters}
  multiple={true}
/>
```

**Variantes:**
- `default` - Background sutil em seleção
- `filled` - Background forte em seleção
- `outlined` - Borda em seleção

---

### 4. **StatusBadge** (`status-badge.tsx`)
Badge para status com ícones automáticos.

**Props:**
```tsx
type StatusType = 'success' | 'error' | 'warning' | 'info' | 'pending';

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'filled' | 'subtle';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}
```

**Uso:**
```tsx
<StatusBadge status="success" label="Confirmado" />
<StatusBadge status="error" label="Cancelado" variant="filled" />
<StatusBadge status="warning" label="Pendente" />
<StatusBadge status="pending" label="Processando" />
```

**Status Disponíveis:**
- `success` - Verde, ícone CheckCircle2
- `error` - Vermelho, ícone XCircle
- `warning` - Amarelo, ícone AlertCircle
- `info` - Azul, ícone Info
- `pending` - Cinza, ícone Clock

---

### 5. **EmptyState** (`empty-state.tsx`)
Estado vazio com ícone, título, descrição e ações.

**Props:**
```tsx
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  secondaryAction?: {...};
  variant?: 'default' | 'compact' | 'centered';
  size?: 'sm' | 'md' | 'lg';
}
```

**Uso:**
```tsx
<EmptyState 
  icon={<Package size={64} />}
  title="Nenhuma reserva encontrada"
  description="Faça sua primeira reserva agora"
  action={{
    label: 'Ver Ingressos',
    href: '/ingressos'
  }}
/>
```

**Variantes:**
- `default` - Padding padrão
- `compact` - Padding reduzido
- `centered` - Centralizado com min-height

---

### 6. **CTAButton** (`cta-button.tsx`)
Botão de Call-to-Action com variantes, tamanhos e estados.

**Props:**
```tsx
interface CTAButtonProps {
  label: string;
  onClick?: () => void;
  href?: string;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode; // Padrão: ChevronRight
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  type?: 'button' | 'submit' | 'reset';
}
```

**Uso:**
```tsx
<CTAButton 
  label="Comprar Agora"
  variant="primary"
  size="lg"
  onClick={handlePurchase}
  fullWidth
/>

<CTAButton 
  label="Saiba Mais"
  variant="secondary"
  href="/about"
/>
```

**Variantes:**
- `primary` - Azul, principal
- `secondary` - Cinza, secundário
- `tertiary` - Apenas borda
- `danger` - Vermelho, ação destrutiva

---

### 7. **CommandBar** (`command-bar.tsx`)
Barra de comandos estilo Cmd+K com navegação por teclado.

**Props:**
```tsx
interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  group?: string;
  shortcut?: string;
  onSelect: () => void;
}

interface CommandBarProps {
  items: CommandItem[];
  placeholder?: string;
  onClose?: () => void;
  open?: boolean;
}
```

**Uso:**
```tsx
const [commandOpen, setCommandOpen] = useState(false);

<CommandBar 
  open={commandOpen}
  onClose={() => setCommandOpen(false)}
  items={[
    {
      id: 'home',
      label: 'Ir para Home',
      group: 'Navegação',
      icon: <Home size={18} />,
      shortcut: '⌘H',
      onSelect: () => navigate('/')
    },
    {
      id: 'buscar',
      label: 'Buscar',
      group: 'Ações',
      icon: <Search size={18} />,
      shortcut: '⌘K',
      onSelect: () => setSearchOpen(true)
    }
  ]}
/>
```

**Funcionalidades:**
- ↑↓ Navegar com setas
- Enter para selecionar
- Esc para fechar
- Suporte a grupos de comandos

---

## 📦 Componentes Herdados de FASE 1

Estes componentes foram criados na FASE 1 e continuam disponíveis:

### **Topbar** (`topbar.tsx`)
Barra de navegação topo com suporte a menu toggle.

### **CollapsibleSidebar** (`collapsible-sidebar.tsx`)
Sidebar retrátil com items aninhados.

### **BottomNavigation** (`bottom-navigation.tsx`)
Navegação inferior, ideal para mobile.

### **PageHeader** (`page-header.tsx`)
Header de página com título, descrição, breadcrumb e ações.

### **SectionHeader** (`section-header.tsx`)
Header de seção com subtítulo e ação opcional.

### **MetricCard** (`metric-card.tsx`)
Card para exibir métricas com mudança percentual.

### **Skeleton** (`skeleton.tsx`)
Skeleton loading genérico para placeholders.

---

## 🎨 Padrão de Design

Todos os componentes seguem estes padrões:

1. **React.forwardRef** - Para acesso direto ao DOM quando necessário
2. **cn() utility** - Para combinar classes Tailwind dinamicamente
3. **Variantes** - Cada componente tem múltiplas variantes visuais
4. **Tamanhos** - Suporte a sm, md, lg (e xl quando aplicável)
5. **Acessibilidade** - ARIA attributes, keyboard navigation
6. **TypeScript** - Props tipados e exportados

---

## 📁 Estrutura de Arquivos

```
client/src/components/
├── ui/
│   ├── index.ts (exporta todos)
│   ├── data-card.tsx
│   ├── search-bar.tsx
│   ├── filter-chips.tsx
│   ├── status-badge.tsx
│   ├── empty-state.tsx
│   ├── cta-button.tsx
│   ├── command-bar.tsx
│   ├── metric-card.tsx
│   ├── topbar.tsx
│   ├── collapsible-sidebar.tsx
│   ├── bottom-navigation.tsx
│   ├── page-header.tsx
│   ├── section-header.tsx
│   ├── skeleton.tsx
│   └── ...
├── layout-system/
│   ├── index.ts
│   ├── PageContainer.tsx
│   ├── SectionContainer.tsx
│   ├── PublicPageShell.tsx
│   ├── CatalogPageShell.tsx
│   ├── AuthPageShell.tsx
│   ├── AppMobileShell.tsx
│   └── AdminShell.tsx
```

---

## 🚀 Próximos Passos (FASE 3+)

- [ ] FASE 3: Migrar páginas existentes para usar Shells + Componentes
- [ ] FASE 4: Adicionar animações e transições
- [ ] FASE 5: Documentação Storybook
- [ ] FASE 6: Testes automatizados

---

## ✨ Benefícios Realizados

**Para Desenvolvedores:**
- ✅ 12 componentes reutilizáveis prontos
- ✅ Reduz código duplicado significativamente
- ✅ Consistência visual garantida
- ✅ Props tipados com TypeScript

**Para Designers:**
- ✅ Variantes predefinidas para cada componente
- ✅ Integração completa com Design Tokens
- ✅ Linguagem visual unificada
- ✅ Fácil de manter e evoluir

**Para Produto:**
- ✅ Desenvolvimento mais rápido de novas features
- ✅ Onboarding de novos devs mais fácil
- ✅ Manutenção centralizada
- ✅ Aparência profissional e consistente

---

**Status:** ✅ FASE 2 COMPLETA  
**Componentes:** 12+ criados e exportados  
**Linha de código:** ~2000 linhas de componentes  
**Próximo:** FASE 3 - Migração de Páginas
