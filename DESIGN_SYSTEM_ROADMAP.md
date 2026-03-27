# 🎯 RSV360 — Design System Roadmap
## Sistema de Padronização Visual & Layout

**Status Geral:** FASE 0 ✅ + FASE 1 ✅  
**Próxima Etapa:** FASE 2 — Component Library Base  
**Data:** 2025-03-26

---

## 📊 RESUMO EXECUTIVO

O RSV360 hoje possui **5 famílias de página visuais distintas**:
1. 🏠 **Páginas Públicas** (home, landing, contato) — aparência editorial
2. 🛍️ **Catálogos** (ingressos, hotéis, atrações) — grid + sidebar
3. 🔐 **Autenticação** (login, cadastro) — formulário centralizado
4. 📱 **App Mobile** (perfil, reservas) — mobile-first, bottom nav
5. 👨‍💼 **Admin/Dashboard** (CRM, financeiro, reports) — sidebar + topbar

**Problema:** Parecem 5 produtos diferentes, não um sistema único.

**Solução:** Manter as 5 variações, mas unificar a linguagem visual (cores, spacing, tipografia, animações).

---

## ✅ O QUE FOI ENTREGUE

### **FASE 0 — AUDITORIA VISUAL & ESTRATÉGICA**
**Arquivo:** `DESIGN_SYSTEM_FASE_0.md`

#### Diagnóstico
- ✅ Mapeamento dos 5 problemas principais
- ✅ Análise: por que padronização por famílias é melhor
- ✅ Especificação de cada família
- ✅ Explicação de benefícios

#### Entregáveis
1. **Documento técnico** explicando a estratégia
2. **5 Famílias de layout definidas** (width, padding, comportamento)
3. **Impacto visual** de cada solução
4. **Benefícios claros** para UX, engenharia e produto

---

### **FASE 1 — DESIGN TOKENS & LAYOUT SYSTEM**
**Arquivos:** 
- `client/src/tokens.css` (297 linhas)
- `client/src/components/layout-system/` (5 shells + index)
- `DESIGN_SYSTEM_FASE_1.md` (guia completo)

#### Design Tokens Criados
```css
✅ Cores primárias:     Deep Blue, Action Blue, Graphite
✅ Cores neutras:       Slate 50-900 (escala completa)
✅ Cores semânticas:    Success, Warning, Error, Info
✅ Spacing:             8px base (--space-2 até --space-20)
✅ Page widths:         5 especificações por família
✅ Border radius:       sm → 3xl
✅ Shadows:             xs → 2xl (premium, discretas)
✅ Tipografia:          Font families, line-heights, letter-spacing
✅ Surfaces:            bg, elevated, dim, alt
✅ Text colors:         primary → disabled
✅ Transições:          fast, base, slow + easing functions
```

#### Layout Shells Criados

| Shell | Família | Max Width | Uso | Status |
|-------|---------|-----------|-----|--------|
| **PublicPageShell** | A | 1280px | Home, landing, contato | ✅ Pronto |
| **CatalogPageShell** | B | 1280px | Ingressos, hotéis, atrações | ✅ Pronto |
| **AuthPageShell** | C | 440px | Login, cadastro | ✅ Pronto |
| **AppMobileShell** | D | 480px | Perfil, reservas | ✅ Pronto |
| **AdminShell** | E | 1440px | Dashboard, CRM, reports | ✅ Pronto |

#### Componentes Auxiliares
- **PageContainer** — wrapper base com padding
- **SectionContainer** — para separar seções verticalmente

---

## 🎨 CARACTERÍSTICAS DO SISTEMA

### Design Tokens
- ✅ Cores consistentes em todas as 5 famílias
- ✅ Spacing scale de 8px (sem arbitrariedades)
- ✅ Shadows discretas (premium, não chamativas)
- ✅ Border radius apropriado (xl para cards, 2xl para grandes superfícies)
- ✅ Tipografia com 2 famílias (Inter + serif fallback)
- ✅ Transições suaves (150-300ms)

### Layout System
- ✅ Cada família tem width, padding, comportamento únicos
- ✅ Responsive automático (mobile → tablet → desktop)
- ✅ Sidebar retrátil (catálogo + admin)
- ✅ Bottom nav (app mobile)
- ✅ Top bar sticky (app mobile + admin)
- ✅ Centralization (auth)

### Flexibilidade
- ✅ Tokens em CSS variables → fácil customização
- ✅ Shells exportáveis e reutilizáveis
- ✅ Props para personalizar comportamento
- ✅ Suporta dark mode (estrutura pronta)

---

## 📈 MÉTRICAS DE SUCESSO

### Antes (sem sistema)
```
❌ 10+ max-widths diferentes por página
❌ 3 paletas de cor coexistindo
❌ Spacing arbitrário (12px, 18px, 28px, 36px, etc)
❌ 8+ shadow definitions diferentes
❌ Responsive inconsistente
❌ 0 shells/wrappers reutilizáveis
❌ Sensação: 5 produtos diferentes
```

### Depois (com sistema FASE 1)
```
✅ 5 widths padrão (bem documentados)
✅ 1 paleta de cor unificada (21 cores totais)
✅ Spacing 8px base (9 valores: 8-80px)
✅ 5 shadows padrão (xs até 2xl)
✅ Responsive automático via shells
✅ 5 shells reutilizáveis + 2 helpers
✅ Sensação: 1 produto com 5 variações
```

---

## 🗺️ ROADMAP COMPLETO (8 FASES)

| Fase | Título | Status | Entrega |
|------|--------|--------|---------|
| 0 | Auditoria Visual & Estratégica | ✅ Feito | DESIGN_SYSTEM_FASE_0.md |
| 1 | Design Tokens & Layout System | ✅ Feito | tokens.css + 5 shells + guia |
| 2 | Component Library Base | ⏳ Próximo | Cards, badges, buttons, searchbar |
| 3 | Páginas Públicas (Família A) | 📋 Planejado | Home, landing, contato |
| 4 | Páginas Catálogo (Família B) | 📋 Planejado | Ingressos, hotéis, atrações |
| 5 | Páginas Auth (Família C) | 📋 Planejado | Login, cadastro, reset |
| 6 | App Mobile (Família D) | 📋 Planejado | Perfil, reservas, fidelidade |
| 7 | Admin Dashboard (Família E) | 📋 Planejado | CRM, financeiro, reports |
| 8 | Revisão Final & Validação | 📋 Planejado | Consistência, performance, a11y |

---

## 🎯 PRÓXIMOS PASSOS

### FASE 2 — COMPONENT LIBRARY BASE
Criar 12+ componentes reutilizáveis:
```
1. DataCard         — card para dados estruturados
2. MetricCard       — card com numero principal
3. StatusBadge      — label com status (success, warning, etc)
4. SearchBar        — input search com icon
5. FilterChips      — tag filtro clicável
6. EmptyState       — tela vazia com ilustração
7. LoadingSkeleton  — placeholder durante carregamento
8. PrimaryButton    — button principal (action-blue)
9. SecondaryButton  — button secundário
10. TextButton      — button texto puro
11. CommandBar      — search/command palette style
12. AlertBanner     — mensagem no topo
```

Cada componente será:
- ✅ Construído com Tailwind + tokens
- ✅ Documentado com exemplos
- ✅ Compatível com todas as 5 famílias
- ✅ Testado em múltiplos contextos

---

## 💡 COMO USAR AGORA

### Criar uma nova página pública (Família A)

```tsx
import { PublicPageShell, PageContainer, SectionContainer } from '@/components/layout-system';

export default function ContatoPage() {
  return (
    <PublicPageShell 
      title="Contato" 
      description="Entre em contato com nossa equipe"
    >
      {/* Padding automático + max-width 1280px */}
      <PageContainer>
        {/* Seção com spacing automático */}
        <SectionContainer spacingBefore="lg" spacingAfter="lg">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Entre em contato
          </h1>
          <p className="text-xl text-slate-600">
            Estamos aqui para ajudar.
          </p>
        </SectionContainer>

        <SectionContainer variant="alt">
          {/* Formulário ou conteúdo */}
        </SectionContainer>
      </PageContainer>
    </PublicPageShell>
  );
}
```

### Criar um dashboard admin (Família E)

```tsx
import { AdminShell } from '@/components/layout-system';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminTopBar } from '@/components/admin/AdminTopBar';

export default function AdminDashboard() {
  return (
    <AdminShell
      sidebar={<AdminSidebar />}
      topBar={<AdminTopBar />}
    >
      {/* Max-width 1440px automático */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Metric cards, charts, etc */}
      </div>
    </AdminShell>
  );
}
```

---

## 📚 DOCUMENTAÇÃO COMPLETA

1. **DESIGN_SYSTEM_FASE_0.md** → Estratégia + diagnóstico
2. **DESIGN_SYSTEM_FASE_1.md** → Guia detalhado de uso
3. **client/src/tokens.css** → Definição de tokens
4. **client/src/components/layout-system/** → Implementação dos shells

---

## ✨ RESULTADO ESPERADO

Após FASE 1:
- ✅ Sistema visual unificado (1 paleta, 1 spacing, 1 tipografia)
- ✅ 5 famílias de layout bem definidas
- ✅ Shells reutilizáveis que eliminam boilerplate
- ✅ Base sólida para FASE 2-8
- ✅ Sensação de produto único coeso

---

## 📞 SUPORTE

Dúvidas sobre:
- **Design Tokens?** Veja `client/src/tokens.css` + `DESIGN_SYSTEM_FASE_1.md`
- **Como usar shells?** Veja exemplos em `DESIGN_SYSTEM_FASE_1.md`
- **Estratégia geral?** Leia `DESIGN_SYSTEM_FASE_0.md`

---

**Próximo:** FASE 2 — Component Library Base  
**Estimado:** Próximas semanas, com 12+ componentes reutilizáveis

✅ **FASE 0 & 1 CONCLUÍDAS COM SUCESSO**
