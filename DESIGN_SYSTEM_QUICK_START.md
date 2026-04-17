# ⚡ Design System — Quick Start Guide
## Como começar a usar AGORA

---

## 📥 INSTALAÇÃO

### 1. Importar Design Tokens
Adicione em seu `index.tsx` ou no `App.tsx` (já pronto):

```tsx
// client/src/main.tsx
import './tokens.css'  // ← Já importado automaticamente
```

A partir daqui, todos os tokens CSS estão disponíveis globalmente:
```css
var(--color-deep-blue)
var(--space-4)
var(--page-width-public)
/* etc */
```

### 2. Importar Shells

```tsx
import { 
  PublicPageShell,
  CatalogPageShell, 
  AuthPageShell, 
  AppMobileShell, 
  AdminShell,
  PageContainer,
  SectionContainer 
} from '@/components/layout-system';
```

---

## 🎯 PADRÃO DE USO POR FAMÍLIA

### **Família A: Páginas Públicas**
```tsx
import { PublicPageShell, PageContainer, SectionContainer } from '@/components/layout-system';

export default function MyPublicPage() {
  return (
    <PublicPageShell title="Página Pública">
      <PageContainer>
        <SectionContainer spacingBefore="lg">
          <h1>Título</h1>
        </SectionContainer>
      </PageContainer>
    </PublicPageShell>
  );
}
```

**Use para:** Home, landing, contato, promoções, quem somos  
**Max width:** 1280px  
**Padding:** 16px mobile → 32px desktop  

---

### **Família B: Catálogos & Busca**
```tsx
import { CatalogPageShell } from '@/components/layout-system';

export default function CatalogPage() {
  return (
    <CatalogPageShell 
      title="Produtos"
      sidebar={<Filters />}
      showSidebarByDefault={true}
    >
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Grid de cards */}
      </div>
    </CatalogPageShell>
  );
}
```

**Use para:** Ingressos, hotéis, atrações, excursões  
**Max width:** 1280px  
**Sidebar:** 280px desktop, drawer mobile  
**Automático:** Toggle sidebar, responsive grid

---

### **Família C: Autenticação**
```tsx
import { AuthPageShell } from '@/components/layout-system';

export default function LoginPage() {
  return (
    <AuthPageShell
      title="Entrar"
      subtitle="Acesse sua conta"
      footer={<span>Novo? <Link href="/cadastrar">Cadastre-se</Link></span>}
    >
      <form className="space-y-4">
        <Input type="email" placeholder="Email" />
        <Input type="password" placeholder="Senha" />
        <Button>Entrar</Button>
      </form>
    </AuthPageShell>
  );
}
```

**Use para:** Login, cadastro, reset password  
**Max width:** 440px  
**Layout:** Centralizado 100vh  
**Aparência:** Minimalista e segura

---

### **Família D: App Mobile**
```tsx
import { AppMobileShell } from '@/components/layout-system';

export default function ProfilePage() {
  return (
    <AppMobileShell
      topBar={<TopBar title="Perfil" />}
      bottomNav={<BottomNav />}
      withBottomNav={true}
    >
      {/* Conteúdo do app */}
      <div className="space-y-4">
        <UserCard />
        <ReservationsList />
      </div>
    </AppMobileShell>
  );
}
```

**Use para:** Perfil, reservas, notificações, fidelidade  
**Max width:** 480px  
**Layout:** Mobile-first com top + bottom nav  
**Automático:** Safe area, sticky bars, scroll

---

### **Família E: Admin Dashboard**
```tsx
import { AdminShell } from '@/components/layout-system';

export default function AdminPage() {
  return (
    <AdminShell
      topBar={<AdminBar />}
      sidebar={<AdminNav />}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard title="Total" value="1,234" />
        <MetricCard title="Hoje" value="42" />
        <MetricCard title="Taxa" value="98.5%" />
      </div>
    </AdminShell>
  );
}
```

**Use para:** Dashboards, CRM, financeiro, reports  
**Max width:** 1440px  
**Layout:** Sidebar retrátil + topbar  
**Automático:** Toggle menu, responsive layout

---

## 🎨 USANDO DESIGN TOKENS

### Cores

```tsx
// Primárias
<div className="bg-blue-600 text-white">         {/* Action Blue */}
<div className="bg-slate-900 text-white">       {/* Graphite */}

// Usar directives em CSS custom
<div style={{ 
  color: 'var(--text-primary)',
  backgroundColor: 'var(--surface-alt)'
}}>

// Ou classes Tailwind com custom colors
<div className="text-slate-900 bg-slate-50">
```

### Espaçamento

```tsx
{/* Padding */}
<div className="p-4">          {/* 16px — var(--space-4) */}
<div className="px-4 py-6">    {/* 16px h, 24px v — var(--space-4/6) */}

{/* Gap entre items */}
<div className="flex gap-4">   {/* 16px gap */}
<div className="grid gap-6">   {/* 24px gap */}

{/* Margin */}
<div className="mb-8">         {/* 32px bottom — var(--space-8) */}
```

### Border Radius

```tsx
{/* Cards padrão */}
<div className="rounded-xl">   {/* 16px — var(--radius-xl) */}

{/* Superfícies grandes */}
<div className="rounded-2xl">  {/* 20px — var(--radius-2xl) */}

{/* Inputs e botões */}
<input className="rounded-lg"> {/* 12px — var(--radius-lg) */}
```

### Sombras

```tsx
{/* Card padrão */}
<div className="shadow-sm">    {/* var(--shadow-card) */}

{/* Elevated */}
<div className="shadow-lg">    {/* var(--shadow-lg) */}

{/* Hover */}
<div className="hover:shadow-md transition-shadow">
```

### Tipografia

```tsx
{/* Headings */}
<h1 className="text-4xl font-bold">    {/* 36px, 700 weight */}
<h2 className="text-2xl font-bold">    {/* 24px, 700 weight */}
<h3 className="text-xl font-semibold"> {/* 20px, 600 weight */}

{/* Body */}
<p className="text-base font-normal">  {/* 16px, 400 weight */}
<p className="text-sm text-slate-600"> {/* 14px, secondary */}

{/* Fonts */}
<div className="font-sans">   {/* Inter */}
<div className="font-serif">  {/* Georgia */}
<div className="font-mono">   {/* Monaco */}
```

---

## 📋 CHECKLIST PARA NOVA PÁGINA

- [ ] Escolher família correta (A-E)
- [ ] Importar shell apropriado
- [ ] Envolver com shell
- [ ] Adicionar PageContainer se necessário
- [ ] Usar SectionContainer para seções
- [ ] Aplicar tokens CSS (não cores hardcoded)
- [ ] Testar responsiveness (mobile, tablet, desktop)
- [ ] Verificar accessibility (alt text, aria, labels)
- [ ] Revisar spacing (consistente com escala 8px)

---

## ⚠️ ANTI-PADRÕES

### ❌ Não faça isso:

```tsx
// ❌ Inline styles com cores hardcoded
<div style={{ maxWidth: '1200px', padding: '20px', color: '#111827' }}>

// ❌ Arbitrary values sem token
<div className="max-w-[1300px] px-[18px]">

// ❌ Múltiplas shells aninhadas
<PublicPageShell>
  <AuthPageShell>
    <AdminShell>  {/* ERRADO! */}
    </AdminShell>
  </AuthPageShell>
</PublicPageShell>

// ❌ Spacing inconsistente
<div className="mb-5 mt-11 p-7">  {/* Não segue escala */}

// ❌ Cores inline
<div style={{ backgroundColor: '#1e3a8a' }}>  {/* Use token */}
```

### ✅ Faça assim:

```tsx
// ✅ Usar shell + PageContainer
<PublicPageShell>
  <PageContainer>
    {/* Conteúdo */}
  </PageContainer>
</PublicPageShell>

// ✅ Classes Tailwind com escala
<div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">

// ✅ Tokens CSS para cores
<div style={{ color: 'var(--text-primary)' }}>

// ✅ Spacing na escala (var(--space-*))
<div className="p-4 mb-6 gap-4">  {/* 16px, 24px, 16px */}
```

---

## 🔧 CUSTOMIZAÇÕES COMUNS

### Mudar cor primária globalmente

Editar `client/src/tokens.css`:
```css
:root {
  --color-action-blue: #3b82f6;  {/* Novo azul */}
}
```

Todos os botões primários mudam automaticamente.

### Adicionar cor semântica

```css
/* Em tokens.css */
:root {
  --color-premium: #f59e0b;  {/* Amarelo para premium */}
}

/* Em componente */
<div style={{ color: 'var(--color-premium)' }}>Premium</div>
```

### Aumentar spacing global

```css
/* Em tokens.css */
:root {
  --space-4: 20px;  {/* Era 16px, agora 20px */}
}
```

Todos os componentes com `p-4` e `gap-4` ficam maiores.

---

## 🧪 TESTANDO NO NAVEGADOR

### Abrir DevTools
```
F12 ou Cmd+Shift+I
```

### Inspecionar tokens
```
Selecionar elemento
Computed → Procurar por "--space" ou "--color"
Ver valores das variáveis CSS
```

### Testar responsiveness
```
Ctrl+Shift+M (Windows/Linux)
Cmd+Shift+M (Mac)
Alternar entre mobile/tablet/desktop
```

---

## 📚 REFERÊNCIAS RÁPIDAS

| Quando usar | Shell | Max Width |
|-------------|-------|-----------|
| Home, landing, contato | `PublicPageShell` | 1280px |
| Ingressos, hotéis, catálogos | `CatalogPageShell` | 1280px + sidebar |
| Login, cadastro, reset | `AuthPageShell` | 440px |
| Perfil, reservas, app | `AppMobileShell` | 480px |
| Dashboard, admin, CRM | `AdminShell` | 1440px + sidebar |

---

## 🆘 TROUBLESHOOTING

### "Tokens não estão sendo aplicados"
✅ Verificar: `client/src/main.tsx` importa `tokens.css`?

### "Cores estão estranhas"
✅ Verificar: Está usando `var(--color-*)`?  
✅ Ou classes Tailwind dos tokens?

### "Sidebar não aparece"
✅ Verificar: Está usando `CatalogPageShell` ou `AdminShell`?  
✅ Verificar: Passou `sidebar={...}` como prop?

### "Layout não responsivo"
✅ Verificar: Página está envolvida em shell?  
✅ Verificar: Classes responsivas no lugar certo (`md:`, `lg:`)?

---

## 🚀 PRÓXIMAS FASES

- **FASE 2:** Component Library (DataCard, Badge, Button, etc)
- **FASE 3-7:** Migrar páginas existentes para novo sistema
- **FASE 8:** Validação final de consistência

---

**Pronto para começar? Escolha uma página e migre para o novo sistema!** ✨
