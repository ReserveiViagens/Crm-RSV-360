# PR 0 — Alinhamento de Contratos do Módulo Admin/Website

**Branch:** `docs/admin-website-contract-alignment`  
**Status:** `[x]` concluído  
**Data de conclusão:** 2026-04-01  
**Executor:** RSV360 Agent (Task #15)

---

## Objetivo

Fechar todos os contratos de API antes de escrever qualquer código de produção. Nenhum endpoint, banco ou componente deve ser criado antes deste documento estar completo e o gate verificado.

---

## 1. Validators de Mídia

Os validators Zod de mídia devem incluir obrigatoriamente estes campos de filtro:

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `placement` | `enum(MediaPlacement)` | não | Onde a mídia aparece (hero, card, banner, gallery, avatar, icon, background, misc) |
| `status` | `enum(MediaStatus)` | não | Estado do arquivo (active, archived, orphan) |
| `dateFrom` | `string (ISO date)` | não | Filtro de data de criação — início (formato `YYYY-MM-DD`) |
| `dateTo` | `string (ISO date)` | não | Filtro de data de criação — fim (formato `YYYY-MM-DD`) |
| `pageId` | `uuid` | não | Filtro por página vinculada |
| `search` | `string` | não | Busca full-text por nome de arquivo ou alt text |
| `type` | `enum(MediaType)` | não | Tipo do arquivo (image, video, document) |
| `page` | `number` | não | Número da página de resultados (default: 1) |
| `limit` | `number` | não | Itens por página (default: 20, max: 100) |

**Decisão tomada:** [x] Todos os campos acima são opcionais. O validator rejeita campos extras não listados (Zod `.strict()` ou equivalente).

```typescript
// Validator de query de mídia (resultado esperado em server/validators/admin-website.validator.ts)
const mediaQueryValidator = z.object({
  type:      z.enum(["image", "video", "document"]).optional(),
  status:    z.enum(["active", "archived", "orphan"]).optional(),
  placement: z.enum(["hero","card","banner","gallery","avatar","icon","background","misc"]).optional(),
  pageId:    z.string().uuid().optional(),
  search:    z.string().max(200).optional(),
  dateFrom:  z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  dateTo:    z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  page:      z.coerce.number().int().positive().default(1),
  limit:     z.coerce.number().int().min(1).max(100).default(20),
})
```

---

## 2. Contrato do Payload Admin

### Páginas (WebsitePage)

```typescript
// Request — criar/atualizar página
// POST/PATCH /api/admin/website/pages[/:id]
interface CreatePageRequest {
  title: string           // obrigatório, min 3 chars
  slug: string            // obrigatório, formato kebab-case, único
  section: PageSection    // enum: main | hoteis | parques | combos | ingressos | outros
  content: object         // JSON livre (blocos de conteúdo — sem schema fixo neste PR)
  metaTitle?: string      // máx 70 chars
  metaDescription?: string // máx 160 chars
  bannerMediaId?: string  // UUID referência a website_media (opcional)
  status?: PageStatus     // "draft" | "published" | "archived" — default: "draft"
}

// Response — página completa (admin)
// GET /api/admin/website/pages/:id
interface AdminPageResponse {
  id: string              // UUID
  title: string
  slug: string
  section: PageSection
  content: object
  status: PageStatus
  metaTitle: string | null
  metaDescription: string | null
  bannerMediaId: string | null
  createdAt: string       // ISO datetime (UTC)
  updatedAt: string       // ISO datetime (UTC)
  publishedAt: string | null // null se draft ou archived
}

// Response — lista paginada de páginas
// GET /api/admin/website/pages
interface AdminPageListResponse {
  success: true
  data: AdminPageResponse[]
  meta: { total: number; page: number; limit: number }
}
```

### Settings (WebsiteSettings)

```typescript
// Request — atualizar settings (patch parcial)
// PATCH /api/admin/website/settings
interface UpdateSettingsRequest {
  siteName?: string           // máx 100 chars
  logoMediaId?: string        // UUID referência a website_media
  defaultBannerMediaId?: string // UUID referência a website_media
  primaryColor?: string       // hex (#RRGGBB)
  contactEmail?: string       // email válido
  contactPhone?: string       // string livre (aceita formatações brasileiras)
  socialLinks?: Record<string, string> // { instagram: "url", facebook: "url", ... }
}

// Response — settings completo (admin — inclui IDs)
// GET /api/admin/website/settings
interface AdminSettingsResponse {
  id: number              // sempre 1 (singleton)
  siteName: string
  logoMediaId: string | null
  defaultBannerMediaId: string | null
  primaryColor: string | null
  contactEmail: string | null
  contactPhone: string | null
  socialLinks: Record<string, string> | null
  updatedAt: string       // ISO datetime (UTC)
}
```

### Padrão de resposta unificado

Todos os endpoints admin retornam:
```typescript
// Sucesso
{ success: true; data: T }
// Erro
{ success: false; error: string; code: string }
```

---

## 3. Contrato do Payload Público

### Settings Público (GET /api/website/settings)

A API pública resolve as URLs finais de logo e banner. O frontend público **nunca recebe IDs** — apenas URLs prontas para uso direto em `<img src>` ou CSS.

```typescript
// Response — settings público (SEM IDs de mídia)
interface PublicSettingsResponse {
  siteName: string
  logoUrl: string | null         // URL completa resolvida (ex: "/uploads/website/uuid-logo.png")
  defaultBannerUrl: string | null // URL completa resolvida
  primaryColor: string | null
  contactEmail: string | null
  contactPhone: string | null
  socialLinks: Record<string, string> | null
}
```

**Decisão de branding:** Admin salva `logoMediaId` e `defaultBannerMediaId` (UUIDs). A API pública faz join com `website_media` e devolve `logoUrl` e `defaultBannerUrl` como URLs absolutas resolvidas. Páginas draft nunca aparecem neste endpoint.

### Páginas Públicas (GET /api/website/pages/:slug)

```typescript
// Response — página pública (apenas pages com status = "published")
interface PublicPageResponse {
  id: string
  title: string
  slug: string
  section: PageSection
  content: object
  metaTitle: string | null
  metaDescription: string | null
  bannerUrl: string | null  // URL resolvida (não ID) — null se sem banner
  publishedAt: string       // ISO datetime (UTC)
}
```

### Navegação Pública (GET /api/website/navigation)

```typescript
// Response — navegação agrupada por seção
interface PublicNavigationResponse {
  [section: string]: Array<{ title: string; slug: string }>
}
```

---

## 4. Import Oficial de shared/website-types

Todos os tipos, enums e interfaces do módulo admin/website vivem em um único arquivo compartilhado:

- **Arquivo:** `shared/website-types.ts`
- **Server:** `import { WebsitePage, WebsiteMedia, WebsiteSettings, ... } from '../../shared/website-types'`
- **Client:** `import type { WebsitePage, WebsiteMedia, WebsiteSettings, ... } from '@shared/website-types'`
- **Re-export:** `shared/schema.ts` deve conter `export * from './website-types'`

**Decisão tomada:** [x] Confirmado — um único arquivo `shared/website-types.ts` para todos os tipos do módulo. Nenhum tipo de website espalhado em arquivos ad-hoc.

**Enums obrigatórios que devem constar em `shared/website-types.ts`:**
```typescript
type PageStatus     = "draft" | "published" | "archived"
type PageSection    = "main" | "hoteis" | "parques" | "combos" | "ingressos" | "outros"
type MediaType      = "image" | "video" | "document"
type MediaPlacement = "hero" | "card" | "banner" | "gallery" | "avatar" | "icon" | "background" | "misc"
type MediaStatus    = "active" | "archived" | "orphan"
type AuditAction    = "create" | "update" | "delete" | "publish" | "unpublish" | "upload" | "swap" | "unlink"
type AuditEntity    = "page" | "settings" | "media"
```

**PROTECTED_ROUTES** — slugs que o DELETE deve rejeitar com 403:
```typescript
export const PROTECTED_ROUTES = ["home", "sobre", "contato", "politica-de-privacidade"] as const
```

---

## 5. Storage de Mídia

| Ambiente | Adapter | Localização | Variável de controle |
|----------|---------|-------------|---------------------|
| Desenvolvimento | Disco local (multer) | `uploads/website/` | `MEDIA_STORAGE_ADAPTER=local` (default) |
| Produção | Object Storage + CDN | Bucket remoto | `MEDIA_STORAGE_ADAPTER=s3` ou `r2` |

**Documentado:** O adapter local é **apenas para desenvolvimento**. Em produção, deve ser substituído por object storage configurado via variáveis de ambiente. O código usa interface `IMediaStorageAdapter` para trocar de adapter sem alterar os endpoints.

**Estrutura de nome de arquivo salvo:**
```
uploads/website/{uuid}-{originalname-sanitized}.{ext}
```

**URL pública servida:**
```
/uploads/website/{uuid}-{filename}.{ext}
```

**Variáveis de ambiente a documentar no .env.example (PR 4):**
```
MEDIA_STORAGE_ADAPTER=local
MEDIA_LOCAL_PATH=uploads/website
# Para produção:
# MEDIA_STORAGE_ADAPTER=s3
# MEDIA_S3_BUCKET=
# MEDIA_S3_REGION=
# MEDIA_S3_ACCESS_KEY=
# MEDIA_S3_SECRET_KEY=
# MEDIA_CDN_BASE_URL=
```

---

## 6. Autenticação Admin

**Decisão:** A autenticação admin é **placeholder até o PR 7**. Nos PRs 3–6, as rotas `/api/admin/website` existem sem middleware de auth real.

O hardening completo (`requireAdmin` middleware) é implementado apenas no PR 7 com:
- Verificação de sessão/JWT válida
- Verificação de `user.role === "admin"`
- Resposta 401 para não autenticados, 403 para não admins

**Risco documentado:** Em ambiente de desenvolvimento, qualquer usuário pode acessar as rotas admin dos PRs 3–6. **Não deployar em produção antes do PR 7.**

**Credenciais de teste (desenvolvimento):**
```
email: demo@reservei.com.br
senha: demo123
role: admin
```

---

## Gate do PR 0

- [x] Payload admin fechado — validators de mídia com `placement`, `status`, `dateFrom`, `dateTo`, `pageId`, `search` (seção 1)
- [x] Payload admin fechado — contratos de páginas e settings com todos os campos explícitos (seção 2)
- [x] Payload público fechado — branding: admin salva IDs, API pública devolve `logoUrl`/`defaultBannerUrl` como URLs resolvidas (seção 3)
- [x] Import oficial de `shared/website-types` definido para client e server (seção 4)
- [x] `PROTECTED_ROUTES` definido no contrato (seção 4)
- [x] Storage local `uploads/website/` documentado como adapter de dev — produção usa object storage + CDN (seção 5)
- [x] Autenticação admin declarada como placeholder até o PR 7 (seção 6)
- [x] Padrão de resposta unificado definido (`{ success, data }` ou `{ success, error, code }`)
- [x] Nenhuma fase posterior depende de campo implícito — todos os payloads têm campos nomeados e tipados

---

**Executor:** RSV360 Agent (Task #15)  
**Revisado em:** 2026-04-01  
**Próximo:** PR 0.5 — `docs/implantacao/fases/PR0.5-AUDITORIA-CMS-EXISTENTE.md`
