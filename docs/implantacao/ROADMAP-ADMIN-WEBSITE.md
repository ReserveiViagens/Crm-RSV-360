# ROADMAP — Módulo Admin/Website (Gerenciamento do Sistema)

**Projeto:** RSV360  
**Repositório:** `ReserveiViagens/Crm-RSV-360` (branch: `main`)  
**Objetivo:** Transformar o módulo `/admin/gerenciamento-sistema` de protótipo com `localStorage` em sistema de produção com API real, banco PostgreSQL (Drizzle), storage de mídia, API pública e hardening.  
**Documento base:** Matriz Final + Ordem Corrigida de PRs (Versão Definitiva)

---

## Como retomar este trabalho

1. Abra este arquivo e identifique qual PR tem status `[ ]` ou `[~]`
2. Leia o arquivo de fase correspondente em `docs/implantacao/fases/`
3. Execute os passos do PR respeitando o gate antes de avançar
4. Ao concluir cada gate, marque `[x]` no item abaixo e registre a data

**Regra de ouro:** Nunca avance sem o gate do PR atual totalmente verde.

---

## Status por PR

| PR | Branch | Objetivo | Status | Concluído em |
|----|--------|----------|--------|--------------|
| PR 0 | `docs/admin-website-contract-alignment` | Alinhar contratos antes de codar | `[x]` | 2026-04-01 |
| PR 0.5 | `chore/cms-surface-assessment` | Auditar e decidir reuso do CMS existente | `[x]` | 2026-04-01 |
| PR 1 | `feat/admin-foundation-content-types` | Tipos compartilhados + validators | `[ ]` | — |
| PR 2 | `feat/admin-content-db-schema` | Banco + migrations + seed | `[ ]` | — |
| PR 3 | `feat/admin-content-api-core` | API admin core: páginas + settings | `[ ]` | — |
| PR 4 | `feat/admin-content-api-media-storage` | API de mídia + upload + storage | `[ ]` | — |
| PR 5 | `feat/admin-content-frontend-integration` | Frontend admin conectado à API | `[ ]` | — |
| PR 6 | `feat/public-website-content-consumption` | API pública + consumo no site | `[ ]` | — |
| PR 7 | `chore/admin-website-hardening` | Segurança, auditoria, produção | `[ ]` | — |

**Convenção:**
```
[x] concluído (gate passado)
[~] implementado parcialmente
[ ] não iniciado
[!] bloqueado
```

---

## PR 0 — Alinhamento de Contratos

**Branch:** `docs/admin-website-contract-alignment`  
**Arquivo:** `docs/implantacao/fases/PR0-ALINHAMENTO-CONTRATOS-WEBSITE.md`

### Gate
- [x] Payload admin fechado (validators de mídia com `placement`, `status`, `dateFrom`, `dateTo`, `pageId`, `search`)
- [x] Payload público fechado (branding: admin salva IDs, API pública devolve URLs resolvidas)
- [x] Import oficial de `shared/website-types` definido para client e server
- [x] Storage local `uploads/website` documentado como adapter de dev
- [x] Autenticação admin declarada como placeholder até PR 7
- [x] Nenhuma fase posterior depende de campo implícito

### Arquivos criados/modificados
- `docs/implantacao/fases/PR0-ALINHAMENTO-CONTRATOS-WEBSITE.md`

---

## PR 0.5 — Auditoria do CMS Existente

**Branch:** `chore/cms-surface-assessment`  
**Arquivo:** `docs/implantacao/fases/PR0.5-AUDITORIA-CMS-EXISTENTE.md`

### Gate
- [x] Inventário completo de superfícies CMS/admin/website existentes no repositório
- [x] Decisão arquitetural tomada: adaptar / substituir / criar paralelo controlado
- [x] Decisão justificada no documento
- [x] Risco de duplicação eliminado antes de qualquer API nova

### Arquivos criados/modificados
- `docs/implantacao/fases/PR0.5-AUDITORIA-CMS-EXISTENTE.md`

---

## PR 1 — Tipos Compartilhados e Validators

**Branch:** `feat/admin-foundation-content-types`  
**Dependência:** PR 0.5

### Gate
- [ ] `shared/website-types.ts` criado com enums, entidades, DTOs, filtros, responses e `PROTECTED_ROUTES`
- [ ] `shared/schema.ts` exporta `* from './website-types'`
- [ ] `server/validators/admin-website.validator.ts` criado com todos os validators Zod
- [ ] Validators de mídia incluem `placement`, `status`, `dateFrom`, `dateTo`, `pageId`, `search`
- [ ] `npm run build` passa sem erros
- [ ] Client e server usam o mesmo contrato (sem campos fora do shared)

### Arquivos criados/modificados
- `shared/website-types.ts` _(novo)_
- `shared/schema.ts` _(atualizado)_
- `server/validators/admin-website.validator.ts` _(novo)_

---

## PR 2 — Banco de Dados Drizzle

**Branch:** `feat/admin-content-db-schema`  
**Dependência:** PR 1

### Gate
- [ ] 8 enums criados: `page_status`, `media_type`, `media_placement`, `media_status`, `audit_action`, `audit_entity`, `settings_key`, `page_section`
- [ ] 5 tabelas criadas: `website_pages`, `website_media`, `website_settings`, `website_page_versions`, `audit_logs`
- [ ] `website_media` tem colunas: `placement`, `pageId`, `createdAt`, `updatedAt`
- [ ] `website_settings` é singleton (uma única linha)
- [ ] `website_page_versions` guarda snapshot antes da publicação
- [ ] Migration aplicada sem erro (`npm run db:push`)
- [ ] `server/db/seed-website.ts` criado e idempotente (roda 2x sem duplicar)
- [ ] Seed integrado em `server/db/seed.ts`
- [ ] Banco tem: pelo menos 5 páginas de exemplo + 1 settings padrão

### Arquivos criados/modificados
- `shared/schema.ts` _(atualizado: 8 enums + 5 tabelas)_
- `server/db/seed-website.ts` _(novo)_
- `server/db/seed.ts` _(atualizado)_

---

## PR 3 — API Admin Core: Páginas + Settings

**Branch:** `feat/admin-content-api-core`  
**Dependência:** PR 2

> **Atenção:** Settings entra AQUI. Não criar PR separado para settings.

### Gate
- [ ] `listPages`, `getPageById`, `createPage`, `updatePage`, `deletePage` funcionais
- [ ] `publishPage` / `unpublishPage` funcionais (cria snapshot em `website_page_versions`)
- [ ] `getSettings` / `updateSettings` funcionais
- [ ] Delete respeita `PROTECTED_ROUTES` (retorna 403)
- [ ] Auditoria básica gravada em `audit_logs`
- [ ] Resposta padronizada: `{ success: true, data }` ou `{ success: false, error, code }`
- [ ] `app.use('/api/admin/website', adminWebsiteRoutes)` registrado em `server/routes.ts`

### Arquivos criados/modificados
- `server/services/admin-website.service.ts` _(novo)_
- `server/routes/admin-website.routes.ts` _(novo)_
- `server/routes.ts` _(atualizado)_

---

## PR 4 — API de Mídia, Upload e Storage

**Branch:** `feat/admin-content-api-media-storage`  
**Dependência:** PR 3

### Gate
- [ ] Upload real funciona (binário salvo em `uploads/website/`)
- [ ] Metadados persistem no banco (`website_media`)
- [ ] `GET /api/admin/website/media` aceita filtros: `type`, `status`, `pageId`, `placement`, `search`, `dateFrom`, `dateTo`
- [ ] `swap` troca o binário mantendo metadados e histórico
- [ ] `unlink` remove vínculo sem apagar arquivo
- [ ] `DELETE` suporta `?force=true`
- [ ] `/uploads/website` servido como rota estática
- [ ] `.env.example` atualizado com variáveis de storage
- [ ] `.gitignore` inclui `uploads/website/*`

### Arquivos criados/modificados
- `server/services/media-storage.service.ts` _(novo)_
- `server/routes/admin-website.routes.ts` _(atualizado: +6 endpoints de mídia)_
- `.env.example` _(atualizado)_
- `.gitignore` _(atualizado)_
- `uploads/website/.gitkeep` _(novo)_

---

## PR 5 — Frontend Admin Conectado à API

**Branch:** `feat/admin-content-frontend-integration`  
**Dependência:** PR 4

> **Regra crítica:** Após este PR, `localStorage` não pode mais existir em NENHUMA parte do módulo admin de website.

### Gate
- [ ] `client/src/services/adminWebsiteApi.ts` criado sem nenhum `localStorage`
- [ ] Hooks criados: `useAdminPages`, `useAdminSettings`, `useAdminMedia`
- [ ] `gerenciamento-sistema.tsx` (ou arquivo admin existente) sem dependência de `localStorage` ou `safeReadStorage`
- [ ] `MediaSelectors.tsx` criado com: `PageRouteSelector`, `MediaTypeSelector`, `MediaStatusSelector`, `MediaPlacementSelector`, `MediaFilterBar`
- [ ] `MediaActions.tsx` criado com: `SwapMediaButton`, `UnlinkMediaButton`, `DeleteMediaButton`, `MediaActionBar`
- [ ] Refresh mantém dados (vêm do banco)
- [ ] Duas sessões admin abertas simultaneamente veem o mesmo estado

### Arquivos criados/modificados
- `client/src/services/adminWebsiteApi.ts` _(novo)_
- `client/src/hooks/useAdminWebsite.ts` _(novo)_
- `client/src/pages/admin/gerenciamento-sistema.tsx` _(novo ou atualizado)_
- `client/src/components/admin/MediaSelectors.tsx` _(novo)_
- `client/src/components/admin/MediaActions.tsx` _(novo)_

---

## PR 6 — API Pública e Consumo no Site

**Branch:** `feat/public-website-content-consumption`  
**Dependência:** PR 5

### Gate
- [ ] `GET /api/website/pages/:slug` funciona (apenas páginas `published`)
- [ ] `GET /api/website/navigation` funciona (agrupado por seção)
- [ ] `GET /api/website/settings` devolve `logoUrl` e `defaultBannerUrl` como URLs resolvidas (não IDs)
- [ ] Páginas draft nunca vazam para a API pública
- [ ] `app.use('/api/website', publicWebsiteRoutes)` registrado em `server/routes.ts`
- [ ] Hook `useWebsiteSettings()` criado e funcional
- [ ] Hook `useWebsiteNavigation()` criado e funcional

### Arquivos criados/modificados
- `server/routes/public-website.routes.ts` _(novo)_
- `server/routes.ts` _(atualizado)_
- `client/src/hooks/useWebsiteSettings.ts` _(novo)_

---

## PR 7 — Hardening: Segurança, Auditoria e Produção

**Branch:** `chore/admin-website-hardening`  
**Dependência:** PR 6

### Gate (Final)
- [ ] Middleware `requireAdmin` aplicado em todas as rotas admin
- [ ] `app.use('/api/admin/website', requireAdmin, adminWebsiteRoutes)` configurado
- [ ] Serviço de auditoria: `writeAudit` e `getAuditLogs` funcionais
- [ ] `GET /api/admin/website/audit` funcional com paginação
- [ ] Rate limit aplicado em upload e deleções
- [ ] Error handler global do módulo implementado
- [ ] `tests/e2e/admin-website.spec.ts` com smoke + E2E passando
- [ ] `.env.example` documentado com todas as variáveis do módulo
- [ ] Módulo pronto para produção inicial

### Arquivos criados/modificados
- `server/middleware/admin-auth.middleware.ts` _(novo)_
- `server/services/audit.service.ts` _(novo)_
- `server/routes/admin-website.routes.ts` _(atualizado: +rate limit +error handler +/audit)_
- `server/routes.ts` _(atualizado)_
- `tests/e2e/admin-website.spec.ts` _(novo)_
- `.env.example` _(atualizado)_

---

## Hierarquia de documentos

Se houver conflito entre documentos, siga esta ordem de prioridade:

1. **Matriz Final** (vence sempre)
2. **Este ROADMAP** (regras gerais e mapa de arquivos)
3. **Sub-páginas de fase** (referência técnica — ajuste pela Matriz se conflitar)
4. **Backlog antigo PR 0-8** (OBSOLETO — não usar)

---

## Regras permanentes

- Ordem fixa: PR 0 → PR 0.5 → PR 1 → PR 2 → PR 3 → PR 4 → PR 5 → PR 6 → PR 7
- `npm run build` antes de cada commit
- Seed deve ser idempotente
- Preserve contratos existentes — não altere shapes de API de outros módulos
- Use os caminhos exatos listados acima. Não renomeie pastas.
- Não duplique lógica. Se já existe, estenda.
- Settings NÃO tem PR separado — fica inteiramente no PR 3.
- Não crie rotas novas sem antes passar pelo PR 0.5.
- Se já existir CMS compatível no repositório, prefira adaptar.
- Após o PR 5, `localStorage` não pode mais existir no módulo.
- A API pública devolve URLs resolvidas (não IDs) para `logoUrl` e `defaultBannerUrl`.
