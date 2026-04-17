# Reservei360 — Design System: Fundação Layout

## 1. Current State Audit (FASE 0 Diagnosis)

### Problem Statement

As of FASE 0, the Reservei360 codebase has 40+ pages with **no shared layout system**.
Every page defines its own widths, paddings, and shells entirely via inline `style` props.
This causes:

| Problem | Impact |
|---------|--------|
| No canonical page widths — each page guesses independently | Inconsistent max-width across pages (1200px vs 1400px vs 480px vs none) |
| No spacing rhythm tokens — every section uses arbitrary `padding` | Visual rhythm breaks between pages; copy-paste errors accumulate |
| No reusable shell components — page structure duplicated verbatim | Adding a nav link requires editing 20+ files; header/footer drift |
| No surface / colour tokens for layout — hardcoded HEX everywhere | Dark mode / theming impossible without mass search-and-replace |

### Page-Type Problem Audit

| Page file | Family | Current max-width | Problem |
|-----------|--------|------------------|---------|
| `landing.tsx` | A — Public | none (full bleed sections) | No global shell; sections set their own widths ad-hoc |
| `HomeHeader.tsx` | A — Public | 1200px (inline) | Differs from 1280px contract |
| `ingressos.tsx` | B — Catalog | 1400px (.rsv-container) | .rsv-container token is 1400px, new contract is 1280px |
| `catalogo-excursoes.tsx` | B — Catalog | 1400px (.rsv-container) | Same as above |
| `hoteis.tsx` | B — Catalog | 1400px (.rsv-container) | Same as above |
| `entrar.tsx` | C — Auth | 440px (inline style) | Correct width but no shell, title/back-link duplicated |
| `cadastrar.tsx` | C — Auth | 440px (inline style) | Correct width but no shell |
| `perfil.tsx` | D — App | 480px (.rsv-subpage) | Closest to spec; bottom nav not in shell slot |
| `minhas-reservas.tsx` | D — App | 480px (.rsv-subpage) | Same |
| `pagamentos.tsx` | D — App | 480px (.rsv-subpage) | Same |
| `admin-dashboard.tsx` | E — Admin | none + inline sidebar | No max-width; sidebar layout inline in JSX |
| `admin-financeiro.tsx` | E — Admin | none | Same |
| All other admin/* | E — Admin | varies | Each page re-implements the sidebar pattern |

### Existing `.rsv-*` Class Issues

- `.rsv-container` uses `max-width: 1400px` — **new contract: 1280px for public/catalog**
- `.rsv-subpage` uses responsive breakpoints (480→720→960→1200px) — **D family should be fixed at 480px**
- No section gap classes exist — rhythm is fully ad-hoc
- No surface colour classes exist — all HEX is hardcoded

---

## 2. Layout Families & Shell Contracts

| Family | Shell | Max-width token | Max-width | Pages |
|--------|-------|----------------|-----------|-------|
| A — Public | `PublicPageShell` | `--page-w-public` | 1280px | landing, home, FAQs, about, blog |
| B — Catalog | `CatalogPageShell` | `--page-w-catalog` | 1280px | ingressos, excursões, hotéis, busca |
| C — Auth | `AuthPageShell` | `--page-w-auth` | 440px | entrar, cadastrar, recuperar-senha, verificar |
| D — App/Mobile | `AppMobileShell` | `--page-w-app` | 480px | perfil, minhas-reservas, pagamentos, minha-jornada |
| E — Admin | `AdminShell` | `--page-w-admin` | 1440px | /admin/* dashboard, financeiro, crm, etc. |

---

## 3. CSS Custom Properties (index.css)

### Page-Width Tokens

```css
--page-width-public:  1280px;
--page-width-catalog: 1280px;
--page-width-admin:   1440px;
--page-width-app:     480px;
--page-width-auth:    440px;
```

### Section Rhythm Tokens

```css
--section-gap-sm: 32px;
--section-gap-md: 48px;
--section-gap-lg: 64px;
--section-gap-xl: 96px;
```

### Surface Tokens

```css
--surface-page:    #F9FAFB;   /* page / viewport background */
--surface-card:    #FFFFFF;   /* card, panel, well */
--surface-sidebar: #FFFFFF;   /* admin sidebar */
--surface-overlay: rgba(0,0,0,0.5); /* modal/drawer backdrop */
```

---

## 4. Tailwind Utility Extensions (tailwind.config.ts)

### Max-Width Utilities

```
max-w-page-public   → 1280px
max-w-page-catalog  → 1280px
max-w-page-admin    → 1440px
max-w-page-app      → 480px
max-w-page-auth     → 440px
```

### Section Gap Spacing Utilities (py-*/pt-*/pb-*)

```
py-gap-section-sm   → 32px
py-gap-section-md   → 48px
py-gap-section-lg   → 64px
py-gap-section-xl   → 96px
```

### Border Radius Utilities

```
rounded-card    → 1rem   (16px) — product/hotel/excursão cards
rounded-control → .75rem (12px) — inputs, buttons, pills
rounded-premium → 1.5rem (24px) — modals, premium panels
```

### Shadow Utilities

```
shadow-card     → 0 2px 12px rgba(0,0,0,0.08)
shadow-elevated → 0 4px 24px rgba(0,0,0,0.12)
shadow-overlay  → 0 8px 40px rgba(0,0,0,0.18)
```

### Typography Heading Scale

```
text-heading-h1 → 32px / line-height 1.2 / weight 700
text-heading-h2 → 24px / line-height 1.3 / weight 700
text-heading-h3 → 20px / line-height 1.4 / weight 600
text-heading-h4 → 17px / line-height 1.4 / weight 600
text-heading-h5 → 14px / line-height 1.5 / weight 600
```

---

## 5. Layout Component API

### `PageContainer`

Centralised width-constraint wrapper.

```tsx
import { PageContainer, type LayoutFamily } from "@/components/layouts";

<PageContainer family="public">   {/* max-w-page-public, centred, responsive px */}
  <Hero />
  <Cards />
</PageContainer>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `family` | `LayoutFamily` | `"public"` | Controls max-width token |
| `children` | `ReactNode` | — | Content |
| `as` | HTML tag | `"div"` | Rendered element |
| `className` | `string` | `""` | Extra classes |
| `style` | `CSSProperties` | — | Inline overrides |

`LayoutFamily` values: `"public" | "catalog" | "admin" | "app" | "auth" | "full"`

---

### `SectionContainer`

Vertical rhythm wrapper using the section gap tokens.

```tsx
import { SectionContainer } from "@/components/layouts";

<SectionContainer size="md">
  <FeaturedCards />
</SectionContainer>

// Asymmetric
<SectionContainer sizeTop="lg" sizeBottom="sm">
  <Footer />
</SectionContainer>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `SectionSize` | `"md"` | Symmetric top + bottom padding |
| `sizeTop` | `SectionSize` | — | Override top padding only |
| `sizeBottom` | `SectionSize` | — | Override bottom padding only |
| `as` | HTML tag | `"section"` | Rendered element |
| `children` | `ReactNode` | — | Content |
| `className` | `string` | `""` | Extra classes |
| `style` | `CSSProperties` | — | Inline overrides |

`SectionSize` values: `"sm" | "md" | "lg" | "xl" | "none"`

---

### `PublicPageShell` — Família A

```tsx
<PublicPageShell
  header={<HomeHeader />}
  heroSlot={<HeroSection />}
  footer={<HomeFooter />}
>
  <main>
    <PageContainer family="public">
      <SectionContainer size="lg"><FeaturedDeals /></SectionContainer>
      <SectionContainer size="md"><Testimonials /></SectionContainer>
    </PageContainer>
  </main>
</PublicPageShell>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `header` | `ReactNode` | — | Sticky top nav header |
| `heroSlot` | `ReactNode` | — | Full-bleed hero above children |
| `footer` | `ReactNode` | — | Footer below children |
| `background` | `string` | `var(--surface-page)` | Page background |
| `children` | `ReactNode` | — | Main content |

---

### `CatalogPageShell` — Família B

```tsx
<CatalogPageShell
  header={<HomeHeader />}
  searchBar={<SearchAndFiltersBar />}
  sidebar={<IngressosSidebar />}
  footer={<HomeFooter />}
>
  <TicketsGrid />
</CatalogPageShell>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `header` | `ReactNode` | — | Top navigation |
| `searchBar` | `ReactNode` | — | Full-bleed search/filter bar |
| `sidebar` | `ReactNode` | — | Left sidebar (hidden < 1024px) |
| `sidebarWidth` | `number` | `280` | Sidebar width in px |
| `footer` | `ReactNode` | — | Page footer |
| `background` | `string` | `var(--surface-page)` | Page background |
| `children` | `ReactNode` | — | Catalog grid / results |

---

### `AuthPageShell` — Família C

```tsx
<AuthPageShell
  title="Entrar na sua conta"
  subtitle="Bem-vindo de volta ao Reservei360"
  backHref="/"
>
  <LoginForm />
</AuthPageShell>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | — | Page heading above form |
| `subtitle` | `string` | — | Subtitle below title |
| `backHref` | `string` | — | If set, renders a back-link |
| `backLabel` | `string` | `"Voltar"` | Back link text |
| `background` | `string` | `var(--surface-page)` | Page background |
| `children` | `ReactNode` | — | Form card content |

---

### `AppMobileShell` — Família D

```tsx
<AppMobileShell
  header={<AppTopBar title="Perfil" />}
  bottomNav={<BottomTabBar />}
  bottomNavHeight={80}
>
  <ProfileContent />
</AppMobileShell>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `header` | `ReactNode` | — | Optional top app bar |
| `bottomNav` | `ReactNode` | — | Fixed bottom navigation bar |
| `bottomNavHeight` | `number` | `80` | Height reserved for bottom nav |
| `background` | `string` | `var(--surface-page)` | Page background |
| `children` | `ReactNode` | — | Scrollable page content |

---

### `AdminShell` — Família E

```tsx
const [open, setOpen] = useState(true);

<AdminShell
  topbar={<AdminHeader onMenuToggle={() => setOpen(o => !o)} />}
  sidebar={<AdminNav />}
  sidebarOpen={open}
  onSidebarToggle={() => setOpen(o => !o)}
>
  <DashboardContent />
</AdminShell>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `topbar` | `ReactNode` | — | Sticky top bar / header |
| `sidebar` | `ReactNode` | — | Left sidebar nav |
| `sidebarOpen` | `boolean` | `true` | Sidebar visibility |
| `onSidebarToggle` | `() => void` | — | Hamburger toggle callback |
| `sidebarWidth` | `number` | `256` | Sidebar width when open |
| `background` | `string` | `var(--surface-page)` | Page background |
| `children` | `ReactNode` | — | Main content area |

---

## 6. Brand Colours

| Name | Hex | Tailwind equivalent | Usage |
|------|-----|---------------------|-------|
| Deep Blue | `#1E3A5F` | — | Header gradients |
| Deep Blue (Tailwind) | `#1E3A8A` | `blue-900` | Text, secondary brand |
| Action Blue | `#2563EB` | `blue-600` | CTAs, links, active state |
| Orange | `#F57C00` | `orange-600` | Highlights, logo accent, prices |
| Success Green | `#22C55E` | `green-500` | Confirmations, status OK |
| Error Red | `#EF4444` | `red-500` | Errors, cancel badges |

---

## 7. RSV Component Library (FASE 2)

All components live in `client/src/components/rsv/` and are imported from `@/components/rsv`.
Every component accepts `className` for extension and `data-testid` for testing.

### Navigation

| Component | File | Purpose |
|-----------|------|---------|
| `RsvSidebar` | `RsvSidebar.tsx` | Collapsible sidebar with logo, nav groups, active-link highlight, toggle button |
| `RsvTopbar` | `RsvTopbar.tsx` | Brand gradient header with logo, title, actions slot, hamburger toggle |
| `RsvBottomNav` | `RsvBottomNav.tsx` | Fixed mobile tab bar with icon + label, active indicator, badge, safe-area inset |

### Page Chrome

| Component | File | Purpose |
|-----------|------|---------|
| `RsvPageHeader` | `RsvPageHeader.tsx` | Page title + optional breadcrumb + optional right-side actions |
| `RsvSectionHeader` | `RsvSectionHeader.tsx` | Section title + optional subtitle + optional action link |

### Cards

| Component | File | Purpose |
|-----------|------|---------|
| `RsvMetricCard` | `RsvMetricCard.tsx` | KPI card: icon, label, value, optional trend delta + colour |
| `RsvDataCard` | `RsvDataCard.tsx` | General content card: media, icon, title, body slot, footer |

### Input / Filtering

| Component | File | Purpose |
|-----------|------|---------|
| `RsvSearchBar` | `RsvSearchBar.tsx` | Search input with icon, clear button, loading spinner, onSearch |
| `RsvFilterChips` | `RsvFilterChips.tsx` | Horizontal scrollable pill toggles, single or multi-select |

### Feedback

| Component | File | Purpose |
|-----------|------|---------|
| `RsvStatusBadge` | `RsvStatusBadge.tsx` | Semantic pill: success/warning/error/info/pending with Lucide icon |
| `RsvEmptyState` | `RsvEmptyState.tsx` | Zero-state: icon, title, description, primary/secondary actions |
| `RsvLoadingSkeleton` | `RsvLoadingSkeleton.tsx` | Pulse skeletons: card / metric / text-line / avatar / list-item variants |

### Actions

| Component | File | Purpose |
|-----------|------|---------|
| `RsvCtaPrimary` | `RsvCtaPrimary.tsx` | Gradient blue button with loading state, icon slot, size variants |
| `RsvCtaSecondary` | `RsvCtaSecondary.tsx` | Outline/ghost blue button with loading state and icon slot |
| `RsvCommandBar` | `RsvCommandBar.tsx` | Cmd+K palette wrapping Shadcn `command.tsx` with categorised groups |

### Identity

| Component | File | Purpose |
|-----------|------|---------|
| `RsvAvatar` | `RsvAvatar.tsx` | User avatar with image, initials fallback, icon fallback, badge slot, xs/sm/md/lg/xl sizes |
| `RsvAvatarGroup` | `RsvAvatar.tsx` | Stacked avatar row with overflow count, shares `RsvAvatar` |

#### Quick usage example

```tsx
import {
  RsvPageHeader, RsvMetricCard, RsvSearchBar, RsvFilterChips,
  RsvStatusBadge, RsvCtaPrimary, RsvCommandBar, useRsvCommandBar,
  RsvAvatar, RsvAvatarGroup,
} from "@/components/rsv";

// Command bar controlled via hook (Cmd+K / Ctrl+K opens automatically)
const { open, setOpen } = useRsvCommandBar();

<RsvCommandBar open={open} onOpenChange={setOpen} groups={[...]} />
<RsvPageHeader title="Dashboard" breadcrumbs={[{ label: "Home", href: "/" }, { label: "Admin" }]} />
<RsvMetricCard label="Receita" value="R$ 48.500" icon={<DollarSign />} trend="up" trendValue="+12%" color="green" />
<RsvSearchBar placeholder="Buscar reservas..." onSearch={(q) => search(q)} />
<RsvFilterChips chips={[{ id: "hotel", label: "Hotéis", count: 12 }]} onSelectionChange={setFilters} />
<RsvStatusBadge variant="success" label="Confirmado" />
<RsvCtaPrimary loading={isPending} fullWidth>Confirmar reserva</RsvCtaPrimary>
<RsvAvatar name="João Silva" size="md" />
<RsvAvatarGroup avatars={users} max={4} />
```

---

## 8. Migration Plan

**FASE 0** (done): CSS tokens, Tailwind extensions, design documentation.  
**FASE 1** (done): Shell components + PageContainer/SectionContainer.  
**FASE 2** (done): RSV360 base component library (16 components in `@/components/rsv`).  
**FASE 3** (future): Migrate Família C (auth pages) — smallest scope, isolated.  
**FASE 4** (future): Migrate Família D (app/mobile pages — .rsv-subpage → AppMobileShell).  
**FASE 5** (future): Migrate Família E (admin pages — inline sidebar → AdminShell).  
**FASE 6** (future): Migrate Família A+B (public/catalog pages — biggest scope).

### Rules for New Pages

1. Choose the correct family from the table in section 2.
2. Import the shell from `@/components/layouts`.
3. Use `PageContainer family="..."` inside the shell for content width.
4. Use `SectionContainer size="..."` between major sections for rhythm.
5. Use RSV components from `@/components/rsv` for all recurring UI elements.
6. Do **not** use inline `maxWidth` style props for page-level widths.
