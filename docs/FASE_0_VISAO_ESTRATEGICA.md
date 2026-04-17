# RSV360 Design System - FASE 0: Visao Estrategica

## Resumo Executivo

Este documento apresenta a estrategia de padronizacao visual do ecossistema RSV360.
O objetivo e transformar uma interface fragmentada em um **sistema coeso e premium**,
mantendo a flexibilidade necessaria para diferentes contextos de uso.

---

## 1. Diagnostico: Por Que o Sistema Parece Inconsistente

### Problemas Identificados

| Problema | Impacto | Frequencia |
|----------|---------|------------|
| Larguras arbitrarias | Paginas parecem de produtos diferentes | Alta |
| Spacing inconsistente | Falta de ritmo visual | Alta |
| Falta de page shells | Boilerplate repetido, layouts unicos | Alta |
| Responsividade ad-hoc | Quebras em diferentes dispositivos | Media |
| Cores e sombras variaveis | Identidade visual diluida | Media |

### Sintomas Visuais

```
ANTES (Atual):
+------------------+  +--------+  +------------------------+
|   Home (full)    |  | Login  |  |    Admin Dashboard     |
|   ~1400px        |  | ~320px |  |    ~100%               |
+------------------+  +--------+  +------------------------+
      ^                   ^                   ^
      |                   |                   |
   Muito largo      Muito estreito      Sem limite
```

O usuario percebe **5 produtos diferentes** em vez de 1 sistema unificado.

---

## 2. Solucao: Sistema de 5 Familias

### Por Que NAO Uma Unica Largura?

Uma largura universal (ex: 1200px para tudo) criaria problemas:

- **Login em 1200px**: formulario perdido no espaco
- **Dashboard em 800px**: informacao comprimida demais
- **Catalogo sem sidebar**: perda de filtragem eficiente
- **App mobile em desktop**: experiencia estranha

### A Abordagem Correta: Familias de Layout

Cada **tipo de experiencia** tem necessidades diferentes:

```
DEPOIS (Sistema):

FAMILIA A - Public        FAMILIA C - Auth       FAMILIA E - Admin
+------------------+      +----------+           +------------------+
|   max: 1280px    |      | max:440px|           | max: 1440px      |
|   padding: 32px  |      | centered |           | sidebar: 256px   |
|   editorial      |      | focused  |           | data-dense       |
+------------------+      +----------+           +------------------+

FAMILIA B - Catalog       FAMILIA D - App Mobile
+------------------+      +--------+
| max: 1280px      |      |max:480 |
| sidebar: 280px   |      |mobile  |
| commerce-ready   |      |first   |
+------------------+      +--------+
```

---

## 3. As 5 Familias em Detalhe

### FAMILIA A: Public / Marketing

**Paginas:** Home, landing, promocoes, contato, quem somos, institucional

**Caracteristicas:**
- Max width: **1280px**
- Padding: 16px (mobile) -> 32px (desktop)
- Hero pode ser full-bleed (100vw)
- Spacing generoso entre secoes
- Foco em conversao e leitura

**Por que funciona:**
- Espaco suficiente para imagens e textos grandes
- Nao tao largo que perca o usuario
- Editorial e comercial

```jsx
<PublicPageShell header={<Navbar />} footer={<Footer />}>
  <PublicSection fullWidth variant="primary">
    <Hero />
  </PublicSection>
  <PublicSection>
    <Features />
  </PublicSection>
</PublicPageShell>
```

---

### FAMILIA B: Catalog / Commerce

**Paginas:** Ingressos, hoteis, atracoes, excursoes, listagens

**Caracteristicas:**
- Max width: **1280px**
- Sidebar: **280px** (desktop), drawer (mobile)
- Grid responsivo para cards
- Busca sempre visivel
- Filtros acessiveis

**Por que funciona:**
- Sidebar para filtragem eficiente
- Grid aproveita bem o espaco
- Padrao de e-commerce consolidado

```jsx
<CatalogPageShell
  title="Ingressos"
  subtitle="142 opcoes"
  sidebar={<FiltersSidebar />}
>
  <CatalogGrid columns={3}>
    {products.map(p => <ProductCard key={p.id} {...p} />)}
  </CatalogGrid>
</CatalogPageShell>
```

---

### FAMILIA C: Auth

**Paginas:** Login, cadastro, esqueci senha, redefinir senha

**Caracteristicas:**
- Max width: **440px**
- Centralizado vertical e horizontal
- Min height: 100vh
- Foco total no formulario
- Minimalista

**Por que funciona:**
- Formulario nao se perde no espaco
- Atencao direcionada
- Padrao de SaaS premium

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

---

### FAMILIA D: App Mobile / Client Area

**Paginas:** Perfil, minhas reservas, pagamentos, suporte, fidelidade

**Caracteristicas:**
- Max width: **480px**
- Mobile-first design
- Top bar: **56px**
- Bottom nav: **64px**
- Safe area handling

**Por que funciona:**
- Experiencia de app nativo
- Touch-friendly
- Consistente em qualquer dispositivo

```jsx
<AppMobileShell
  title="Meu Perfil"
  showBackButton
  bottomNav={<BottomNavigation />}
>
  <ProfileContent />
</AppMobileShell>
```

---

### FAMILIA E: Admin / Dashboard

**Paginas:** Dashboard, CRM, financeiro, reports, analytics, settings

**Caracteristicas:**
- Max width: **1440px**
- Sidebar: **256px** (colapsavel para 64px)
- Top bar: **64px**
- Data-dense layouts
- B2B premium

**Por que funciona:**
- Espaco para dados e tabelas
- Navegacao sempre acessivel
- Padrao de SaaS administrativo

```jsx
<AdminShell
  sidebar={<AdminSidebar />}
  topBar={<AdminTopBar />}
>
  <AdminPageHeader title="Dashboard" actions={<ExportButton />} />
  <AdminCard title="Metricas">
    <MetricsGrid />
  </AdminCard>
</AdminShell>
```

---

## 4. Beneficios do Sistema

### Para o Usuario

| Antes | Depois |
|-------|--------|
| "Parece varios sites" | "Tudo faz parte do mesmo produto" |
| Confusao de navegacao | Previsibilidade |
| Layouts quebrados no mobile | Responsivo consistente |

### Para a Engenharia

| Antes | Depois |
|-------|--------|
| CSS duplicado | Shells reutilizaveis |
| Larguras arbitrarias | Tokens padronizados |
| Cada dev inventa layout | Padrao claro |

### Para o Produto

| Antes | Depois |
|-------|--------|
| Dificil manter consistencia | Sistema auto-consistente |
| Reviews visuais longos | Padrao ja aprovado |
| Bugs de layout frequentes | Componentes testados |

---

## 5. Design Tokens Definidos

### Espacamento (Base 8px)

```css
--rsv-space-2: 8px    /* gaps pequenos */
--rsv-space-4: 16px   /* padding padrao */
--rsv-space-6: 24px   /* gaps medios */
--rsv-space-8: 32px   /* padding generoso */
--rsv-space-12: 48px  /* secoes */
--rsv-space-16: 64px  /* secoes grandes */
--rsv-space-20: 80px  /* heroes */
```

### Larguras de Pagina

```css
--rsv-page-public: 1280px
--rsv-page-catalog: 1280px
--rsv-page-auth: 440px
--rsv-page-app: 480px
--rsv-page-admin: 1440px
```

### Cores Principais

```css
--rsv-deep-blue: #1e3a8a     /* brand principal */
--rsv-action-blue: #2563eb   /* CTAs */
--rsv-graphite: #111827      /* texto */
--rsv-slate-50: #f8fafc      /* backgrounds */
```

---

## 6. Arquitetura de Componentes

```
layout-system/
├── index.ts              # exports
├── PageContainer.tsx     # padding wrapper
├── SectionContainer.tsx  # spacing wrapper
├── PublicPageShell.tsx   # Familia A
├── CatalogPageShell.tsx  # Familia B
├── AuthPageShell.tsx     # Familia C
├── AppMobileShell.tsx    # Familia D
└── AdminShell.tsx        # Familia E
```

### Hierarquia de Uso

```
Shell (define familia)
└── SectionContainer (define spacing vertical)
    └── PageContainer (define padding horizontal)
        └── Conteudo
```

---

## 7. Proximos Passos

### FASE 1 (Concluida)
- [x] Design Tokens (tokens.css)
- [x] PageContainer
- [x] SectionContainer
- [x] PublicPageShell
- [x] CatalogPageShell
- [x] AuthPageShell
- [x] AppMobileShell
- [x] AdminShell

### FASE 2 (Proxima)
- [ ] Component Library Base
- [ ] MetricCard, DataCard
- [ ] SearchBar, FilterChips
- [ ] StatusBadge, EmptyState
- [ ] LoadingSkeleton

### FASE 3-7
- [ ] Migrar paginas existentes para os shells
- [ ] Ajustar responsividade
- [ ] Testes de consistencia

---

## 8. Como Usar

### Escolhendo a Familia Correta

```
Pergunta: "Que tipo de pagina estou construindo?"

Marketing/Institucional -> PublicPageShell (A)
Catalogo/Busca/Listagem -> CatalogPageShell (B)
Login/Cadastro -> AuthPageShell (C)
Area do Cliente (mobile) -> AppMobileShell (D)
Admin/Dashboard -> AdminShell (E)
```

### Import Padrao

```typescript
import {
  PublicPageShell,
  CatalogPageShell,
  AuthPageShell,
  AppMobileShell,
  AdminShell,
  PageContainer,
  SectionContainer,
} from '@/components/layout-system';
```

---

## Conclusao

Este sistema transforma o RSV360 de **5 interfaces fragmentadas** em
**1 produto coeso e premium**. A abordagem de familias permite
flexibilidade onde necessario, mantendo consistencia onde importa.

O resultado: usuarios reconhecem o produto, engenheiros trabalham mais
rapido, e o produto escala sem perder identidade.
