# FASE 01 — DESIGN SYSTEM + LAYOUT SYSTEM

**Status geral:** `[x]` Concluído — Task #10 (Sprint 1)  
**Branch:** `main`  
**Concluído em:** 2026-03-27

---

## Objetivo

Criar tokens TypeScript de cor/espaçamento/tipografia e componentes de layout reutilizáveis. Shells de layout já existiam — esta fase completou o que faltava e formalizou os tokens.

---

## O que já existia (pré-Sprint 1)

- 5 shells em `client/src/components/layouts/` (`PublicPageShell`, `CatalogPageShell`, `AdminShell`, `AppMobileShell`, `AuthPageShell`)
- `PageContainer` e `SectionContainer` em `client/src/components/layouts/`
- Tokens CSS RSV360 em `client/src/index.css` (variáveis `--rsv-*`)
- `PageHeader`, `SectionHeader`, `MetricCard`, `DataCard`, `StatusBadge`, `EmptyState`, `LoadingSkeleton` em `shells/index.tsx` (legado)
- `DESIGN_SYSTEM.md` — documentação de contratos e famílias

---

## O que foi feito nesta sprint

### Tokens TypeScript criados

| Arquivo | Conteúdo |
|---------|----------|
| `client/src/tokens/colors.ts` | brand, semantic, surface, border, text, neutral palette |
| `client/src/tokens/spacing.ts` | escala rem 0–32 + sectionGap (sm/md/lg/xl) |
| `client/src/tokens/layout.ts` | pageWidths, sidebarWidths, gutters, breakpoints por família |
| `client/src/tokens/typography.ts` | fontSizes, fontWeights, lineHeights, letterSpacings, heading/body presets |
| `client/src/tokens/index.ts` | barrel re-export |

### CSS custom properties adicionadas (`index.css`)

```css
/* Page widths — usados pelos shells e PageContainer */
--page-width-public:  1280px;
--page-width-catalog: 1280px;
--page-width-admin:   1440px;
--page-width-app:     480px;
--page-width-auth:    440px;

/* Section rhythm — usados pelo SectionContainer */
--section-gap-sm:  32px;
--section-gap-md:  48px;
--section-gap-lg:  64px;
--section-gap-xl:  96px;

/* Surface aliases — usados pelos shells */
--surface-page:    #F8FAFC;
--surface-card:    #FFFFFF;
--surface-sidebar: #FFFFFF;
--surface-subtle:  #F1F5F9;
--surface-overlay: rgba(0,0,0,0.5);
```

### Shells auditados

Os 5 shells em `client/src/components/layouts/` já referenciavam `var(--page-width-*)` e `var(--surface-*)` corretamente. As vars faltantes foram adicionadas ao `index.css` para fechar o gap.

---

## Checklist da fase

### 01.1 — Tokens TypeScript
- [x] Criar `client/src/tokens/colors.ts`
- [x] Criar `client/src/tokens/spacing.ts`
- [x] Criar `client/src/tokens/layout.ts`
- [x] Criar `client/src/tokens/typography.ts`

### 01.2 — Componentes de layout
- [x] `PageContainer` existe em `client/src/components/layouts/`
- [x] `SectionContainer` existe em `client/src/components/layouts/`

### 01.3 — Auditoria dos shells existentes
- [x] Shells referenciam `var(--page-width-*)` e `var(--surface-*)` corretamente
- [x] CSS vars necessárias adicionadas ao `index.css`

### 01.4 — Gate de validação + docs + push
- [x] `npx tsc --noEmit` → 0 erros
- [x] `npm run build` → 0 erros (2590 modules, build OK)
- [x] Atualizar `01-STATUS-GERAL.md`: Fase 1 → `[x]`
- [x] Atualizar `02-HANDOFF-ATUAL.md`: próximo passo = Sprint 2
- [x] Atualizar este arquivo
- [x] Commit + push para GitHub

---

## Implementado nesta fase

- `client/src/tokens/` — 5 arquivos TypeScript (colors, spacing, layout, typography, index)
- `client/src/index.css` — adicionados `--page-width-*`, `--section-gap-*`, `--surface-*` aliases

---

## Pendências

Nenhuma. Todos os critérios de conclusão foram atendidos.

---

## Bloqueios

Nenhum.

---

## Critério de conclusão

✅ Arquivos `client/src/tokens/colors.ts`, `spacing.ts`, `layout.ts`, `typography.ts` existem  
✅ CSS vars `--page-width-*`, `--section-gap-*`, `--surface-*` definidas no `:root`  
✅ `PageContainer` e `SectionContainer` existem em `client/src/components/layouts/`  
✅ `npx tsc --noEmit` → 0 erros  
✅ `npm run build` passa sem erros  
✅ Docs atualizados e commit + push feitos
