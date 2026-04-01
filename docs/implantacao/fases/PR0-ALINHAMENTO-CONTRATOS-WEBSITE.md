# PR 0 — Alinhamento de Contratos do Módulo Admin/Website

**Branch:** `docs/admin-website-contract-alignment`  
**Status:** `[ ]` não iniciado  
**Data de conclusão:** —

---

## Objetivo

Fechar todos os contratos de API antes de escrever qualquer código de produção. Nenhum endpoint, banco ou componente deve ser criado antes deste documento estar completo e o gate verificado.

---

## 1. Validators de Mídia

Os validators Zod de mídia devem incluir obrigatoriamente estes campos de filtro:

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `placement` | `enum(MediaPlacement)` | Onde a mídia aparece (hero, card, banner, etc.) |
| `status` | `enum(MediaStatus)` | Estado do arquivo (active, archived, orphan) |
| `dateFrom` | `string (ISO date)` | Filtro de data de criação — início |
| `dateTo` | `string (ISO date)` | Filtro de data de criação — fim |
| `pageId` | `uuid (opcional)` | Filtro por página vinculada |
| `search` | `string (opcional)` | Busca por nome/alt text |

**Decisão tomada:** `[ ]` _preencher após análise_

```
// Resultado esperado do validator de query de mídia:
{
  type?: MediaType
  status?: MediaStatus
  placement?: MediaPlacement
  pageId?: string (UUID)
  search?: string
  dateFrom?: string
  dateTo?: string
  page?: number
  limit?: number
}
```

---

## 2. Contrato do Payload Admin

### Páginas (WebsitePage)

```typescript
// Request — criar/atualizar página
{
  title: string           // obrigatório, min 3 chars
  slug: string            // obrigatório, formato kebab-case
  section: PageSection    // enum: main, hoteis, parques, combos, etc.
  content: object         // JSON livre (blocos de conteúdo)
  metaTitle?: string
  metaDescription?: string
  bannerMediaId?: string  // UUID referência a website_media
  status?: PageStatus     // draft | published | archived
}

// Response — página completa
{
  id: string              // UUID
  title: string
  slug: string
  section: PageSection
  content: object
  status: PageStatus
  metaTitle?: string
  metaDescription?: string
  bannerMediaId?: string
  createdAt: string       // ISO datetime
  updatedAt: string       // ISO datetime
  publishedAt?: string    // ISO datetime, null se draft
}
```

### Settings (WebsiteSettings)

```typescript
// Request — atualizar settings (patch parcial)
{
  siteName?: string
  logoMediaId?: string         // UUID referência a website_media
  defaultBannerMediaId?: string // UUID referência a website_media
  primaryColor?: string        // hex
  contactEmail?: string
  contactPhone?: string
  socialLinks?: Record<string, string>
}

// Response — settings completo (admin)
{
  id: number              // sempre 1 (singleton)
  siteName: string
  logoMediaId?: string
  defaultBannerMediaId?: string
  primaryColor?: string
  contactEmail?: string
  contactPhone?: string
  socialLinks?: Record<string, string>
  updatedAt: string
}
```

---

## 3. Contrato do Payload Público

### Settings Público (GET /api/website/settings)

A API pública resolve as URLs finais de logo e banner. O frontend público nunca recebe IDs — apenas URLs prontas para uso.

```typescript
// Response — settings público (SEM IDs de mídia)
{
  siteName: string
  logoUrl?: string              // URL completa resolvida (ex: /uploads/website/logo.png)
  defaultBannerUrl?: string     // URL completa resolvida
  primaryColor?: string
  contactEmail?: string
  contactPhone?: string
  socialLinks?: Record<string, string>
}
```

**Decisão de branding:** Admin salva `logoMediaId` e `defaultBannerMediaId` (UUIDs). A API pública faz join com `website_media` e devolve `logoUrl` e `defaultBannerUrl` como URLs absolutas.

### Páginas Públicas (GET /api/website/pages/:slug)

```typescript
// Response — página pública
{
  id: string
  title: string
  slug: string
  section: PageSection
  content: object
  metaTitle?: string
  metaDescription?: string
  bannerUrl?: string            // URL resolvida (não ID)
  publishedAt: string
}
```

---

## 4. Import Oficial de shared/website-types

- **Server:** `import { WebsitePage, WebsiteMedia, WebsiteSettings, ... } from '../../shared/website-types'`
- **Client:** `import type { WebsitePage, WebsiteMedia, WebsiteSettings, ... } from '@shared/website-types'`
- O arquivo `shared/schema.ts` deve re-exportar: `export * from './website-types'`

**Decisão tomada:** `[ ]` _confirmar após auditoria PR 0.5_

---

## 5. Storage de Mídia

| Ambiente | Adapter | Localização |
|----------|---------|-------------|
| Desenvolvimento | Disco local (multer) | `uploads/website/` |
| Produção | Object Storage + CDN | Configurado via `MEDIA_STORAGE_ADAPTER=s3` ou similar |

**Documentado:** O adapter local é **apenas para desenvolvimento**. Em produção, deve ser substituído por object storage (AWS S3, Cloudflare R2, etc.) configurado via variáveis de ambiente.

---

## 6. Autenticação Admin

**Decisão:** A autenticação admin é **placeholder até o PR 7**. Nos PRs 3-6, as rotas `/api/admin/website` existem mas sem middleware de auth real. O hardening (middleware `requireAdmin`) é implementado somente no PR 7.

**Risco documentado:** Em ambiente de desenvolvimento, qualquer usuário pode acessar as rotas admin. Não deployar em produção antes do PR 7.

---

## Gate do PR 0

- [ ] Payload admin fechado (seções 2 e 3 preenchidas)
- [ ] Payload público fechado (seção 3 preenchida)
- [ ] Contrato de branding definido (admin salva IDs, público devolve URLs)
- [ ] Import oficial definido (seção 4)
- [ ] Storage documentado como adapter de dev (seção 5)
- [ ] Autenticação declarada como placeholder até PR 7 (seção 6)
- [ ] Nenhuma fase posterior depende de campo implícito

---

**Executor:** _preencher_  
**Revisado em:** _preencher_  
**Próximo:** PR 0.5 — `docs/implantacao/fases/PR0.5-AUDITORIA-CMS-EXISTENTE.md`
