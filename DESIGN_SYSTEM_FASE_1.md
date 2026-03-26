# 🎨 DESIGN TOKENS & LAYOUT SYSTEM — FASE 1
## Sistema de Padronização RSV360

**Status:** ✅ Tokens & Shells Implementados  
**Data:** 2025-03-26  
**Objetivo:** Criar base sólida para as 5 famílias de layout

---

## 📁 ARQUIVOS CRIADOS

### 1. **Design Tokens (`client/src/tokens.css`)**
Arquivo CSS com todas as variáveis do sistema:
- ✅ Cores primárias (Deep Blue, Action Blue, Graphite)
- ✅ Escalas de spacing (8px base)
- ✅ Page widths por família
- ✅ Border radius, shadows, tipografia
- ✅ Superfícies, backgrounds, text colors
- ✅ Transições e animações

**Como usar:**
```css
/* Em qualquer componente */
background-color: var(--surface-bg);
color: var(--text-primary);
padding: var(--space-4);
max-width: var(--page-width-public);
```

### 2. **Layout Shells (`client/src/components/layout-system/`)**

#### **PageContainer**
Wrapper base para todas as páginas
```tsx
import { PageContainer } from '@/components/layout-system';

<PageContainer padded={true}>
  {/* Conteúdo com padding consistente */}
</PageContainer>
```

#### **SectionContainer**
Para separar seções verticalmente
```tsx
import { SectionContainer } from '@/components/layout-system';

<SectionContainer 
  spacingBefore="md" 
  spacingAfter="lg"
  variant="alt"
>
  {/* Seção com spacing automático */}
</SectionContainer>
```

---

## 🎯 AS 5 SHELLS PRINCIPAIS

### **1. PublicPageShell — Família A**
Para páginas públicas e de marketing.

```tsx
import { PublicPageShell } from '@/components/layout-system';

export default function HomePage() {
  return (
    <PublicPageShell title="Home" description="Bem-vindo ao RSV360">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        {/* Conteúdo com max-width 1280px */}
        {/* Pode ter hero full-bleed antes deste container */}
      </div>
    </PublicPageShell>
  );
}
```

**Quando usar:**
- Home
- Landing pages
- Promoções
- Contato
- Quem somos
- Páginas institucionais

**Especificação:**
```
Max Width: 1280px
Padding: 16px mobile → 32px desktop
Espaçamento: Generoso, editorial
Hero: Pode ser full-bleed
```

---

### **2. CatalogPageShell — Família B**
Para catálogos, buscas e ecommerce.

```tsx
import { CatalogPageShell } from '@/components/layout-system';

export default function IngressosPage() {
  return (
    <CatalogPageShell
      title="Ingressos"
      sidebar={<Filters />}
      showSidebarByDefault={true}
    >
      {/* Grid de produtos/cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map(item => <ProductCard key={item.id} {...item} />)}
      </div>
    </CatalogPageShell>
  );
}
```

**Quando usar:**
- Ingressos
- Hotéis
- Atrações
- Excursões
- Catálogos em geral
- Mapas/listagem

**Especificação:**
```
Max Width: 1280px
Sidebar: 280px desktop, drawer mobile
Busca/Filtros: Sempre bem visíveis
Grid: 2-4 colunas responsiva
Aparência: Premium, organizado
```

**Recursos automáticos:**
- ✅ Sidebar retrátil
- ✅ Toggle button no mobile
- ✅ Backdrop quando sidebar aberta
- ✅ Sticky title/header
- ✅ Responsive automático

---

### **3. AuthPageShell — Família C**
Para autenticação e formulários críticos.

```tsx
import { AuthPageShell } from '@/components/layout-system';

export default function LoginPage() {
  return (
    <AuthPageShell
      title="Entrar na sua conta"
      subtitle="Acesse sua conta RSV360"
      header={<Logo />}
      footer={
        <p>
          Não tem conta? <Link href="/cadastrar">Cadastre-se agora</Link>
        </p>
      }
    >
      {/* Formulário de login */}
      <form className="space-y-4">
        {/* campos */}
      </form>
    </AuthPageShell>
  );
}
```

**Quando usar:**
- Login
- Cadastro
- Reset de senha
- Verificação de email
- Confirmar 2FA

**Especificação:**
```
Max Width: 440px (formulário)
Layout: Centralizado 100vh
Fundo: Limpo, gradiente suave
Foco: Total no form
Distração: Mínima
```

**Recursos automáticos:**
- ✅ Centralização vertical e horizontal
- ✅ Padding responsivo
- ✅ Card branco com border
- ✅ Title + subtitle
- ✅ Header (logo) + footer (links)

---

### **4. AppMobileShell — Família D**
Para aplicações mobile-first (perfil, reservas, etc).

```tsx
import { AppMobileShell } from '@/components/layout-system';

export default function PerfilPage() {
  return (
    <AppMobileShell
      topBar={<TopBar />}
      bottomNav={<BottomNavigation />}
      withBottomNav={true}
    >
      {/* Conteúdo do perfil */}
      <div className="space-y-4">
        {/* cards, sections, etc */}
      </div>
    </AppMobileShell>
  );
}
```

**Quando usar:**
- Perfil do usuário
- Minhas reservas
- Pagamentos
- Notificações
- Fidelidade
- Painel do cliente

**Especificação:**
```
Max Width: 480px
Mobile: Full width
Desktop: Centralizado
Top Bar: 56px, sticky
Bottom Nav: 64px, sticky com safe-area
Sensação: App mobile premium
```

**Recursos automáticos:**
- ✅ Top bar sticky
- ✅ Bottom nav com padding bottom
- ✅ Safe area handling
- ✅ Scroll independente
- ✅ Max width 480px

---

### **5. AdminShell — Família E**
Para painéis administrativos e dashboards.

```tsx
import { AdminShell } from '@/components/layout-system';

export default function AdminDashboard() {
  return (
    <AdminShell
      topBar={<AdminTopBar />}
      sidebar={<AdminSidebar />}
      sidebarCollapsedMobile={true}
    >
      {/* Dashboard content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Metric cards, charts, tables */}
      </div>
    </AdminShell>
  );
}
```

**Quando usar:**
- Dashboard principal
- CRM
- Financeiro
- Reports/Analytics
- Branding
- Maps
- Permissions
- Billing

**Especificação:**
```
Max Width: 1440px (conteúdo)
Sidebar: 250px normal, 64px collapsed
Top Bar: 64px, sticky
Layout: Flex, sidebar + content
Aparência: B2B premium
```

**Recursos automáticos:**
- ✅ Sidebar retrátil (mobile → desktop)
- ✅ Top bar sticky
- ✅ Toggle menu button
- ✅ Backdrop mobile
- ✅ Scroll content independente

---

## 🎨 PALETA DE CORES DISPONÍVEL

```css
/* Primárias */
--color-deep-blue: #1e3a8a
--color-action-blue: #2563eb
--color-graphite: #111827
--color-slate-50: #f8fafc
--color-white: #ffffff

/* Neutras (Slate 100-900) */
--color-slate-100: #f1f5f9
--color-slate-200: #e2e8f0
--color-slate-300: #cbd5e1
--color-slate-400: #94a3b8
--color-slate-500: #64748b
--color-slate-600: #475569
--color-slate-700: #334155
--color-slate-800: #1e293b
--color-slate-900: #0f172a

/* Semânticas */
--color-success: #10b981
--color-warning: #f59e0b
--color-error: #ef4444
--color-info: #3b82f6
```

---

## 📐 ESCALAS DE SPACING & SIZING

```css
/* Spacing (8px base) */
--space-2: 8px
--space-3: 12px
--space-4: 16px   /* padrão card padding */
--space-5: 20px   /* padrão header margin */
--space-6: 24px   /* padrão section gap */
--space-8: 32px   /* spacing grande */
--space-10: 40px  /* spacing heroico */
--space-12: 48px  /* spacing estrutural */
--space-16: 64px  /* gap blocos grandes */

/* Input & Button Heights */
--input-height-sm: 32px
--input-height-md: 40px
--input-height-lg: 48px

/* Border Radius */
--radius-sm: 4px
--radius-md: 8px
--radius-lg: 12px
--radius-xl: 16px
--radius-2xl: 20px
--radius-3xl: 24px
```

---

## 🎭 VARIANTES DE SURFACE

```css
/* Backgrounds */
--surface-bg: white (light) / dark-900 (dark)
--surface-alt: slate-50 (light) / slate-900 (dark)
--surface-elevated: white com shadow
--surface-dim: slate-100 para areas desabilitadas
```

---

## 🔤 TIPOGRAFIA

```css
--font-sans: 'Inter', system-ui
--font-serif: Georgia
--font-mono: 'Monaco'

/* Line Heights */
--lh-tight: 1.25
--lh-normal: 1.5
--lh-relaxed: 1.625
--lh-loose: 1.75

/* Letter Spacing */
--ls-tight: -0.01em
--ls-normal: 0
--ls-relaxed: 0.01em
```

---

## 🌊 TRANSIÇÕES & ANIMAÇÕES

```css
--transition-fast: 150ms ease-in-out
--transition-base: 200ms ease-in-out
--transition-slow: 300ms ease-in-out

/* Easing functions */
--easing-ease-in: ease-in
--easing-ease-out: ease-out
--easing-ease-in-out: ease-in-out
--easing-ease-quad: cubic-bezier(0.25, 0.46, 0.45, 0.94)
--easing-ease-cubic: cubic-bezier(0.25, 0.1, 0.25, 1)
```

---

## 📋 CHECKLIST DE IMPLEMENTAÇÃO

Ao criar uma nova página, siga:

```tsx
// 1. Importar o shell apropriado
import { PublicPageShell } from '@/components/layout-system';

// 2. Usar o shell como wrapper principal
export default function MeuaPagina() {
  return (
    <PublicPageShell title="Título">
      {/* 3. Usar PageContainer dentro se necessário */}
      <PageContainer>
        {/* 4. Usar SectionContainer para seções */}
        <SectionContainer spacingBefore="md" spacingAfter="lg">
          {/* Conteúdo */}
        </SectionContainer>
      </PageContainer>
    </PublicPageShell>
  );
}
```

**Verificação:**
- ✅ Shell apropriado para o tipo de página?
- ✅ Max width + padding consistentes?
- ✅ Spacing entre seções padronizado?
- ✅ Cores usando tokens CSS?
- ✅ Tipografia com font-sans/mono/serif?
- ✅ Responsive testado em 3 breakpoints?

---

## 🚀 PRÓXIMOS PASSOS

### FASE 2 — COMPONENT LIBRARY
Criar componentes base reutilizáveis:
- DataCard
- MetricCard
- StatusBadge
- SearchBar
- FilterChips
- EmptyState
- LoadingSkeleton
- Button variants
- CommandBar

### FASE 3-7 — MIGRAÇÃO PÁGINAS
Migrar cada família de páginas para o novo sistema:
- Páginas públicas (home, landing, contato)
- Páginas de catálogo (ingressos, hotéis, atrações)
- Páginas de auth (login, cadastro)
- App mobile (perfil, reservas, fidelidade)
- Admin (dashboards, reports, CRM)

### FASE 8 — REVISÃO FINAL
- Consistência visual
- Performance
- Accessibility
- Mobile responsiveness

---

## 📚 REFERÊNCIAS

- Design Tokens: `client/src/tokens.css`
- Shells: `client/src/components/layout-system/`
- Fase 0 (Auditoria): `DESIGN_SYSTEM_FASE_0.md`

---

**Status:** ✅ FASE 1 Concluída  
**Próxima:** FASE 2 — Component Library Base
