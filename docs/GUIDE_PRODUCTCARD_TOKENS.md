/** # Guia de Implementação: ProductCard + PriceDisplay + Tokens CSS

## Exemplo 1: Usando ProductCard na Página de Ingressos

```tsx
import { ProductCard, PriceDisplay } from '@/components/ui';

export function IngressosGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[var(--rsv-space-4)]">
      {tickets.map((ticket) => (
        <ProductCard
          key={ticket.id}
          id={ticket.id}
          image={ticket.image}
          imageAlt={ticket.name}
          title={ticket.name}
          description={ticket.description}
          originalPrice={ticket.originalPrice}
          discountedPrice={ticket.price}
          rating={ticket.rating}
          reviewCount={ticket.reviews}
          badge={{
            label: ticket.popular ? 'Popular' : 'Novo',
            variant: ticket.popular ? 'warning' : 'info',
          }}
          verified={ticket.verified}
          isFavorite={favorites.includes(ticket.id)}
          onFavoriteClick={handleFavorite}
          onClick={() => navigate(`/ingressos/${ticket.id}`)}
          aspectRatio="4/3"
        />
      ))}
    </div>
  );
}
```

## Exemplo 2: Usando PriceDisplay Isoladamente

```tsx
import { PriceDisplay } from '@/components/ui';

export function PriceSection() {
  return (
    <div className="flex gap-[var(--rsv-space-8)]">
      {/* Horizontal Layout */}
      <PriceDisplay
        originalPrice={220}
        discountedPrice={189}
        layout="horizontal"
        size="lg"
      />
      
      {/* Vertical Layout */}
      <PriceDisplay
        originalPrice={220}
        discountedPrice={189}
        layout="vertical"
        size="md"
      />
      
      {/* Compact Layout */}
      <PriceDisplay
        originalPrice={220}
        discountedPrice={189}
        layout="compact"
        size="sm"
      />
    </div>
  );
}
```

## Exemplo 3: Migrando de Inline Styles para Tokens

### ❌ Antes (Inline Styles)
```tsx
<div style={{
  padding: '16px',
  gap: '12px',
  backgroundColor: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: '12px',
  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.06)',
}}>
  <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>
    Título do Card
  </h3>
  <p style={{ fontSize: '12px', color: '#64748b' }}>Descrição</p>
</div>
```

### ✅ Depois (Tokens CSS)
```tsx
<div className="
  p-[var(--rsv-space-4)] 
  gap-[var(--rsv-space-3)]
  bg-[var(--rsv-surface-base)]
  border border-[var(--rsv-border-color)]
  rounded-[var(--rsv-radius-lg)]
  shadow-[var(--rsv-shadow-sm)]
">
  <h3 className="text-sm font-semibold text-[var(--rsv-text-primary)]">
    Título do Card
  </h3>
  <p className="text-xs text-[var(--rsv-text-tertiary)]">Descrição</p>
</div>
```

## Tokens CSS - Referência Rápida

### Spacing (Gaps & Paddings)
- `--rsv-space-2`: 8px (tight)
- `--rsv-space-3`: 12px (compact)
- `--rsv-space-4`: 16px (normal)
- `--rsv-space-6`: 24px (relaxed)
- `--rsv-space-8`: 32px (section)

### Colors
- Primária: `--rsv-action-blue` (#2563eb)
- Texto Primário: `--rsv-text-primary`
- Texto Secundário: `--rsv-text-secondary`
- Borders: `--rsv-border-color`

### Shadows
- Card: `--rsv-shadow-card`
- Card Hover: `--rsv-shadow-card-hover`
- Modal: `--rsv-shadow-modal`

### Border Radius
- Small: `--rsv-radius-sm` (4px)
- Medium: `--rsv-radius-md` (8px)
- Large: `--rsv-radius-lg` (12px)
- XL: `--rsv-radius-xl` (16px)

### Duração de Transições
- Fast: `--rsv-duration-fast` (150ms)
- Base: `--rsv-duration-base` (200ms)
- Slow: `--rsv-duration-slow` (300ms)

## Exemplo 4: Grid Responsivo com Tokens

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[var(--rsv-space-4)]">
  {items.map(item => (
    <ProductCard key={item.id} {...item} />
  ))}
</div>
```

## Exemplo 5: Container com Padding Responsivo

```tsx
<div className="
  mx-auto
  max-w-[var(--rsv-page-catalog)]
  px-[var(--rsv-padding-catalog-mobile)]
  sm:px-[var(--rsv-padding-catalog-sm)]
  lg:px-[var(--rsv-padding-catalog-lg)]
">
  {/* Conteúdo */}
</div>
```

## Próximos Passos

1. Migrar pagina_ingressos.tsx para usar ProductCard
2. Migrar home.tsx para usar tokens CSS
3. Migrar hoteis.tsx para usar ProductCard
4. Adicionar Breadcrumbs em fluxos profundos
5. Implementar sidebar collapsível

*/
