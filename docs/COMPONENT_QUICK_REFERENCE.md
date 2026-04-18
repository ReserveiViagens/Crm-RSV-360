# Component Quick Reference - FASE 2

## Importação

```tsx
// Importar um componente
import { DataCard, SearchBar, StatusBadge } from '@/components/ui';

// Ou importar todos
import * as UI from '@/components/ui';
```

## Componentes por Categoria

### 🎯 Call-to-Action
**CTAButton** - Botão com variantes
```tsx
<CTAButton label="Comprar" variant="primary" size="lg" onClick={handleClick} />
<CTAButton label="Cancelar" variant="secondary" />
<CTAButton label="Deletar" variant="danger" loading={isLoading} />
```

---

### 📊 Dados e Cards
**DataCard** - Card genérico
```tsx
<DataCard 
  title="Ingresso"
  description="1 dia no parque"
  variant="default"
  onClick={() => {}}
/>
```

**MetricCard** - Card de métrica
```tsx
<MetricCard 
  label="Vendas"
  value={45000}
  unit="R$"
  change={{ value: 12.5, type: 'increase' }}
/>
```

---

### 🔍 Busca e Filtros
**SearchBar** - Barra de busca
```tsx
<SearchBar 
  value={search}
  onChange={setSearch}
  onSearch={handleSearch}
  placeholder="Buscar..."
  size="md"
/>
```

**FilterChips** - Filtros
```tsx
<FilterChips 
  options={[
    { id: '1', label: 'Filtro 1' },
    { id: '2', label: 'Filtro 2' }
  ]}
  selected={selected}
  onChange={setSelected}
  multiple={true}
/>
```

---

### 🏷️ Status e Estados
**StatusBadge** - Badge de status
```tsx
<StatusBadge status="success" label="Confirmado" />
<StatusBadge status="error" label="Erro" variant="filled" />
<StatusBadge status="warning" label="Aviso" size="lg" />
```

**EmptyState** - Estado vazio
```tsx
<EmptyState 
  icon={<PackageIcon />}
  title="Nada encontrado"
  description="Tente novamente"
  action={{ label: 'Voltar', href: '/' }}
/>
```

---

### ⌨️ Navegação e Comando
**CommandBar** - Cmd+K
```tsx
const [open, setOpen] = useState(false);

<CommandBar 
  open={open}
  onClose={() => setOpen(false)}
  items={[...]}
/>
```

---

### 🎨 Layout
**Topbar** - Barra superior
```tsx
<Topbar 
  title="Meu App"
  rightContent={<UserMenu />}
/>
```

**Sidebar** - Barra lateral
```tsx
<CollapsibleSidebar 
  items={navItems}
  onItemClick={handleNav}
/>
```

**PageHeader** - Header de página
```tsx
<PageHeader 
  title="Ingressos"
  description="Veja todos os ingressos"
  action={<FilterButton />}
/>
```

---

## Variantes Rápidas

### Cores de Status
| Status | Cor | Ícone |
|--------|-----|-------|
| success | Verde | ✓ |
| error | Vermelho | ✗ |
| warning | Amarelo | ⚠️ |
| info | Azul | ℹ️ |
| pending | Cinza | ⏱️ |

### Tamanhos Padrão
| Tamanho | Uso |
|---------|-----|
| sm | Elementos compactos |
| md | Padrão (maioria) |
| lg | Destaque |
| xl | Botões principais |

### Variantes Visuais
| Variante | Uso |
|----------|-----|
| primary | Ação principal |
| secondary | Ação secundária |
| tertiary | Ação terciária |
| outlined | Apenas borda |
| flat | Fundo único |

---

## Padrões Comuns

### Formulário com Busca e Filtros
```tsx
export function ProductFilter() {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<string[]>([]);

  return (
    <div className="gap-4 flex flex-col">
      <SearchBar 
        value={search} 
        onChange={setSearch}
        placeholder="Buscar produtos..."
      />
      
      <FilterChips
        options={[...]}
        selected={filters}
        onChange={setFilters}
        multiple
      />
    </div>
  );
}
```

### Lista com Empty State
```tsx
export function OrdersList() {
  const { orders, loading } = useOrders();

  if (loading) return <LoadingSkeleton variant="card" />;
  
  if (orders.length === 0) {
    return (
      <EmptyState 
        title="Nenhum pedido"
        action={{ label: 'Fazer pedido', href: '/shop' }}
      />
    );
  }

  return orders.map(order => (
    <DataCard key={order.id} title={order.name} />
  ));
}
```

### Header com Ação
```tsx
<PageHeader 
  title="Dashboard"
  action={<CTAButton label="Novo" variant="primary" />}
/>
```

---

## Dicas

1. **Sempre use variantes apropriadas** - Não customize inline com classes Tailwind
2. **Aproveite os tamanhos** - Não crie novos, use sm/md/lg/xl
3. **Reutilize componentes** - Crie wrappers se necessário, não replique
4. **Acessibilidade** - Componentes já incluem ARIA, não remova
5. **TypeScript** - Use as interfaces exportadas para melhor DX

---

## Troubleshooting

**Componente não anima?**
→ Verifique se está em elemento com `overflow: hidden`

**Ícone não aparece?**
→ Importe de `lucide-react`

**Props não reconhecido?**
→ Verifique a interface exportada do componente

---

**Última atualização:** FASE 2 Completa  
**Total de componentes:** 12+  
**Linhas de código:** ~2000
