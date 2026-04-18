# RSV360 Layout System - Referencia Rapida

## Familias de Layout

| Familia | Shell | Max Width | Uso |
|---------|-------|-----------|-----|
| A | `PublicPageShell` | 1280px | Home, landing, institucional |
| B | `CatalogPageShell` | 1280px + sidebar 280px | Ingressos, hoteis, listagens |
| C | `AuthPageShell` | 440px | Login, cadastro |
| D | `AppMobileShell` | 480px | Perfil, reservas, app cliente |
| E | `AdminShell` | 1440px + sidebar 256px | Dashboard, CRM, admin |

## Import

```typescript
import {
  PublicPageShell, PublicSection,
  CatalogPageShell, CatalogGrid,
  AuthPageShell,
  AppMobileShell, AppMobileCard,
  AdminShell, AdminPageHeader, AdminCard,
  PageContainer,
  SectionContainer,
} from '@/components/layout-system';
```

## Exemplos Rapidos

### Pagina Publica (A)
```jsx
<PublicPageShell header={<Navbar />} footer={<Footer />}>
  <PublicSection fullWidth variant="primary" spacing="lg">
    <Hero />
  </PublicSection>
  <PublicSection spacing="lg">
    <Features />
  </PublicSection>
</PublicPageShell>
```

### Pagina de Catalogo (B)
```jsx
<CatalogPageShell
  title="Ingressos"
  subtitle="142 resultados"
  sidebar={<Filters />}
>
  <CatalogGrid columns={3}>
    {items.map(item => <Card key={item.id} />)}
  </CatalogGrid>
</CatalogPageShell>
```

### Pagina de Auth (C)
```jsx
<AuthPageShell
  title="Entrar"
  subtitle="Bem-vindo de volta"
  header={<Logo />}
  footer={<Link to="/cadastrar">Criar conta</Link>}
>
  <LoginForm />
</AuthPageShell>
```

### Pagina App Mobile (D)
```jsx
<AppMobileShell
  title="Meu Perfil"
  showBackButton
  onBack={() => navigate(-1)}
  bottomNav={<BottomNav />}
>
  <ProfileContent />
</AppMobileShell>
```

### Pagina Admin (E)
```jsx
<AdminShell
  sidebar={<AdminNav />}
  topBar={<SearchBar />}
  logo={<Logo />}
>
  <AdminPageHeader title="Dashboard" actions={<ExportBtn />} />
  <AdminCard title="Metricas">
    <Grid />
  </AdminCard>
</AdminShell>
```

## Spacing

| Token | Valor | Uso |
|-------|-------|-----|
| `--rsv-space-2` | 8px | Gaps pequenos |
| `--rsv-space-4` | 16px | Padding padrao |
| `--rsv-space-6` | 24px | Gaps medios |
| `--rsv-space-8` | 32px | Padding generoso |
| `--rsv-space-12` | 48px | Entre secoes |
| `--rsv-space-16` | 64px | Secoes grandes |

## Cores Principais

| Token | Cor | Uso |
|-------|-----|-----|
| `--rsv-deep-blue` | #1e3a8a | Brand |
| `--rsv-action-blue` | #2563eb | CTAs |
| `--rsv-graphite` | #111827 | Texto |
| `--rsv-slate-50` | #f8fafc | Backgrounds |
