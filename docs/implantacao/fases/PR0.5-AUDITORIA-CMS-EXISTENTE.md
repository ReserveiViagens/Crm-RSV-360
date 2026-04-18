# PR 0.5 — Auditoria do CMS Existente

**Branch:** `chore/cms-surface-assessment`  
**Status:** `[x]` concluído  
**Data de conclusão:** 2026-04-01  
**Executor:** RSV360 Agent (Task #16)

---

## Objetivo

Antes de criar qualquer rota ou tabela nova para o módulo admin/website, mapear tudo que já existe no repositório relacionado a CMS, admin website e conteúdo público. Isso elimina o risco de duplicação e define a estratégia arquitetural correta.

---

## Inventário de Superfícies Existentes

### 1. Rotas de Admin Website no Servidor

| O que procurar | Encontrado | Notas |
|----------------|-----------|-------|
| Rotas `/api/admin/website` | NÃO EXISTE | Nenhuma rota admin website no servidor |
| Serviço `admin-website.service.ts` | NÃO EXISTE | `server/services/` não tem arquivo relacionado |
| Qualquer rota de páginas/settings admin | NÃO EXISTE | `server/routes.ts` não contém referências a website, cms ou gerenciamento |

**Serviços existentes em `server/services/`:**
```
accountingService.ts            recommendation.service.ts
bureaucracyService.ts           retry-queue.service.ts
catalog-sync.service.ts         ticket-catalog.ts
gamification-service.ts         ticket-payment.service.ts
humanHandoff.service.ts         voucher-delivery.service.ts
notification.service.ts         voucher-pdf.service.ts
payment.service.ts              weather-service.ts
post-payment-orchestrator.service.ts  whatsapp.service.ts
pricing-engine.ts
```
→ Nenhum serviço relacionado a website, CMS, branding ou media.

**Rotas existentes em `server/routes/`:**
```
weather-routes.ts    (apenas clima)
```
→ Nenhuma rota admin website ou pública de website.

---

### 2. Rotas de Website Público no Servidor

| O que procurar | Encontrado | Notas |
|----------------|-----------|-------|
| Rotas `/api/website/*` | NÃO EXISTE | Verificado em `server/routes.ts` (2727 linhas) |
| `public-website.routes.ts` | NÃO EXISTE | `server/routes/` contém apenas `weather-routes.ts` |
| Qualquer rota pública de conteúdo | NÃO EXISTE | Nenhuma referência a website, cms, branding |

---

### 3. Upload e Storage

| O que procurar | Encontrado | Notas |
|----------------|-----------|-------|
| Middleware multer/upload | NÃO EXISTE | Nenhuma referência em server/ |
| Pasta `uploads/` | NÃO EXISTE | Diretório inexistente no repositório |
| `media-storage.service.ts` | NÃO EXISTE | — |
| Rota estática de arquivos de media | NÃO EXISTE | Nenhum `express.static('uploads')` em routes.ts |

**Branding.tsx tem um botão "Upload" no frontend** (`data-testid="button-upload-logo"`) que não faz nada — sem handler, sem API call, sem estado de arquivo.

---

### 4. Settings e Branding

| O que procurar | Encontrado | Notas |
|----------------|-----------|-------|
| Tabela `website_settings` no schema | NÃO EXISTE | `shared/schema.ts` não contém tabelas website_* |
| `getSettings` / `updateSettings` | NÃO EXISTE | `server/storage.ts` não tem métodos de website |
| `configuracoes-sistema.tsx` | **EXISTE** | Protótipo — React state apenas, sem API, sem localStorage |
| `branding.tsx` | **EXISTE** | Protótipo — React state apenas, sem API, sem localStorage |
| Qualquer referência a logoUrl/branding no servidor | NÃO EXISTE | Verificado em server/routes.ts e server/storage.ts |

**Detalhes de `configuracoes-sistema.tsx`:**
- Localização: `client/src/pages/admin/configuracoes-sistema.tsx`
- Rota registrada: `/admin/configuracoes-sistema` (com `ProtectedRoute roles=["admin"]`)
- Estado armazenado: React `useState` com valores hardcoded
- Campos coletados: `razaoSocial`, `cnpj`, `telefone`, `emailSuporte`, `logoUrl`, `endereco`, `chavePix`, `tipoChavePix`, `taxaMDR`, `taxaISS`, `bancoSplit`, `contaSplit`, `agenciaSplit`, `emailAlertas`, `webhookUrl`, canais e tipos de alerta
- `handleSave`: simula delay de 1200ms e exibe toast — **sem API call**
- `localStorage`: **NÃO usa** — apenas React state

**Detalhes de `branding.tsx`:**
- Localização: `client/src/pages/admin/branding.tsx`
- Rota registrada: `/admin/branding` (com `ProtectedRoute roles=["admin"]`)
- Estado armazenado: React `useState` com valores hardcoded
- Campos coletados: `nomeEmpresa`, `slogan`, `logoUrl`, `corPrimaria`, `corSecundaria`, `corAcento`, `corTexto`, `corFundo`, `fontePrincipal`, templates de WhatsApp e e-mail
- Upload button: renderizado mas sem handler real (não conectado a nenhuma API)
- `handleSave`: simula delay de 1200ms e exibe toast — **sem API call**
- `localStorage`: **NÃO usa** — apenas React state

---

### 5. Tipos Compartilhados

| O que procurar | Encontrado | Notas |
|----------------|-----------|-------|
| `shared/website-types.ts` | NÃO EXISTE | `shared/` contém apenas `schema.ts` e `catalog-groups.ts` |
| Tipos WebsitePage, WebsiteMedia, WebsiteSettings | NÃO EXISTEM | — |
| Tabelas `website_*` no Drizzle schema | NÃO EXISTEM | `shared/schema.ts` tem: users, ticketCatalog, gamificacao* apenas |

**Arquivos em `shared/`:**
```
schema.ts          (users, ticketCatalog, gamificacao*, zod schemas)
catalog-groups.ts  (grupos de catálogo de ingressos)
```

---

### 6. Componentes Admin Website no Frontend

| O que procurar | Encontrado | Notas |
|----------------|-----------|-------|
| `gerenciamento-sistema.tsx` | NÃO EXISTE | A rota admin usa `configuracoes-sistema.tsx` |
| `MediaSelectors.tsx` | NÃO EXISTE | — |
| `MediaActions.tsx` | NÃO EXISTE | — |
| `adminWebsiteApi.ts` | NÃO EXISTE | `client/src/services/` contém apenas: recommendation, search, weather |
| `useAdminWebsite.ts` | NÃO EXISTE | `client/src/hooks/` não tem hooks de website admin |

**Hooks existentes em `client/src/hooks/`:**
```
use-auth.ts   use-mobile.tsx   use-toast.ts
useComboRecommendations.ts   useSearch.ts   useUnifiedSearch.ts
useComboTrigger.ts   useTicketsCart.ts   useWeather.ts
```

**Serviços existentes em `client/src/services/`:**
```
recommendationApi.ts   search-api.ts   weather-api.ts
```

---

## Inventário de localStorage no Módulo Admin/Website

| Chave localStorage | Arquivo | Notas |
|-------------------|---------|-------|
| — | `configuracoes-sistema.tsx` | **NÃO usa localStorage** — React state puro |
| — | `branding.tsx` | **NÃO usa localStorage** — React state puro |

**localStorage no restante do codebase (para referência — fora do escopo do módulo):**
| Chave | Arquivo | O que armazena |
|-------|---------|----------------|
| `rsv360_traveler_profile` | `ai-conversion-elements.tsx` | Perfil do viajante (componente AI) |
| `BEHAVIOR_KEY` | `ai-conversion-elements.tsx` | Dados de comportamento de conversão |
| `reservei-lgpd-consent` | `lgpd-popup.tsx` | Consentimento LGPD |
| `rsv_analytics` | `lib/analytics.ts` | Eventos de analytics |
| `cart-items` / `cart-date` | `lib/cart-store.ts` | Carrinho de ingressos |
| `rsv_user_id` / `rsv_user_name` | `criar-excursao.tsx`, `viagens-grupo.tsx`, `utils/social-commerce.ts` | ID e nome temporário do usuário anônimo |
| `circular-nav-*` | `components/circular-nav.tsx` | Estado da navegação circular |

**Conclusão:** Nenhuma chave de localStorage está relacionada ao módulo admin/website. O módulo PR 0–PR 7 começa do zero nesse aspecto.

---

## Decisão Arquitetural

### Análise

O inventário revelou que o repositório tem:
- **Backend CMS:** ZERO código existente
- **Frontend CMS:** 2 protótipos (`configuracoes-sistema.tsx` + `branding.tsx`) com React state puro — sem API, sem banco, sem localStorage
- **Risco de duplicação:** BAIXO — o backend começa do zero; o frontend tem protótipos que serão migrados

### Decisão: Opção C — Criar paralelo controlado (backend) + Adaptar (frontend)

**[x] Backend (API, banco, storage, types):** **Criar novo** — não há absolutamente nada a adaptar no servidor. Criar `shared/website-types.ts`, tabelas Drizzle, rotas e serviços do zero conforme especificado nos PRs 1–4.

**[x] Frontend (componentes admin):** **Adaptar os protótipos existentes** — `configuracoes-sistema.tsx` e `branding.tsx` serão migrados no PR 5 para consumir a API real. Os campos já coletados (`logoUrl`, `razaoSocial`, `corPrimaria`, etc.) mapeiam para os contratos fechados no PR 0.

**Justificativa:**
1. Backend do zero: não há código server-side a reutilizar — seria reescrever de qualquer forma.
2. Frontend: adaptar `configuracoes-sistema.tsx` e `branding.tsx` é mais seguro do que criar novos arquivos em paralelo, pois as rotas `/admin/configuracoes-sistema` e `/admin/branding` já estão registradas em `App.tsx` e funcionando para os usuários.
3. Não há risco de conflito com outros módulos — o módulo admin/website é completamente isolado.

### Arquivos a reutilizar (frontend)
```
client/src/pages/admin/configuracoes-sistema.tsx   → migrar no PR 5
client/src/pages/admin/branding.tsx                → migrar no PR 5
```

### Arquivos a criar do zero (PRs 1–7)
```
shared/website-types.ts                            → PR 1
server/validators/admin-website.validator.ts       → PR 1
shared/schema.ts (acréscimo: 8 enums + 5 tabelas) → PR 2
server/db/seed-website.ts                          → PR 2
server/services/admin-website.service.ts           → PR 3
server/routes/admin-website.routes.ts              → PR 3
server/services/media-storage.service.ts           → PR 4
client/src/services/adminWebsiteApi.ts             → PR 5
client/src/hooks/useAdminWebsite.ts                → PR 5
client/src/components/admin/MediaSelectors.tsx     → PR 5
client/src/components/admin/MediaActions.tsx       → PR 5
server/routes/public-website.routes.ts             → PR 6
client/src/hooks/useWebsiteSettings.ts             → PR 6
server/middleware/admin-auth.middleware.ts          → PR 7
server/services/audit.service.ts                   → PR 7
tests/e2e/admin-website.spec.ts                    → PR 7
```

### Arquivos a NÃO criar (confirmação de não-duplicação)
- Não criar uma segunda versão de `configuracoes-sistema.tsx` — adaptar a existente
- Não criar uma segunda versão de `branding.tsx` — adaptar a existente ou fundir com `configuracoes-sistema.tsx` no PR 5
- Não criar rotas na pasta `server/routes/` que conflitem com `weather-routes.ts` — o padrão é `app.use('/api/...')` em `server/routes.ts`

---

## Gate do PR 0.5

- [x] Inventário completo das seções 1 a 6 — rotas, storage, settings, tipos, componentes
- [x] Chaves de localStorage mapeadas — nenhuma no módulo admin/website
- [x] Inventário de localStorage do resto do codebase registrado para referência
- [x] Decisão arquitetural tomada: Opção C (backend novo) + Opção A (frontend adaptar)
- [x] Decisão justificada com base no inventário
- [x] Risco de duplicação eliminado — backend começa do zero; frontend adapta existente
- [x] Lista de arquivos a criar vs. reutilizar definida com precisão
- [x] Próximos PRs (1 a 7) podem avançar sem ambiguidade sobre o que adaptar vs criar

---

**Executor:** RSV360 Agent (Task #16)  
**Revisado em:** 2026-04-01  
**Próximo:** PR 1 — `feat/admin-foundation-content-types`  
(Arquivos: `shared/website-types.ts`, `server/validators/admin-website.validator.ts`)
