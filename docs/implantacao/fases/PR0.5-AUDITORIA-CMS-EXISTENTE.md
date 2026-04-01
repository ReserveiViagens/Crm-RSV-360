# PR 0.5 — Auditoria do CMS Existente

**Branch:** `chore/cms-surface-assessment`  
**Status:** `[ ]` não iniciado  
**Data de conclusão:** —

---

## Objetivo

Antes de criar qualquer rota ou tabela nova para o módulo admin/website, mapear tudo que já existe no repositório relacionado a CMS, admin website e conteúdo público. Isso elimina o risco de duplicação e define a estratégia arquitetural correta.

---

## Instruções de Auditoria

Para cada item abaixo, preencha a coluna "Encontrado" com o caminho do arquivo ou "NÃO EXISTE":

### 1. Rotas de Admin Website

| O que procurar | Encontrado | Notas |
|----------------|-----------|-------|
| Rotas `/api/admin/website` | | |
| Serviço `admin-website.service.ts` | | |
| Qualquer rota de páginas/settings admin | | |

### 2. Rotas de Website Público

| O que procurar | Encontrado | Notas |
|----------------|-----------|-------|
| Rotas `/api/website/*` | | |
| `public-website.routes.ts` | | |
| Qualquer rota pública de conteúdo | | |

### 3. Upload e Storage

| O que procurar | Encontrado | Notas |
|----------------|-----------|-------|
| Middleware multer/upload | | |
| Pasta `uploads/` | | |
| `media-storage.service.ts` | | |
| Rota estática de arquivos | | |

### 4. Settings e Branding

| O que procurar | Encontrado | Notas |
|----------------|-----------|-------|
| Tabela `website_settings` no schema | | |
| `getSettings` / `updateSettings` em qualquer serviço | | |
| `configuracoes-sistema.tsx` (localStorage) | | |
| Qualquer referência a logoUrl/branding | | |

### 5. Tipos Compartilhados

| O que procurar | Encontrado | Notas |
|----------------|-----------|-------|
| `shared/website-types.ts` | | |
| Tipos WebsitePage, WebsiteMedia em `shared/schema.ts` | | |
| Tabelas `website_*` no Drizzle schema | | |

### 6. Componentes Admin Website

| O que procurar | Encontrado | Notas |
|----------------|-----------|-------|
| `client/src/pages/admin/gerenciamento-sistema.tsx` | | |
| `MediaSelectors.tsx` / `MediaActions.tsx` | | |
| `adminWebsiteApi.ts` | | |
| `useAdminWebsite.ts` | | |

---

## Inventário de localStorage no Módulo

Listar todas as chaves de `localStorage` usadas pelo módulo admin/website:

| Chave | Arquivo | O que armazena |
|-------|---------|----------------|
| | | |
| | | |
| | | |

**Referência:** As 3 chaves que o PR 5 deve remover completamente são:
1. _preencher após auditoria_
2. _preencher após auditoria_
3. _preencher após auditoria_

---

## Decisão Arquitetural

Após completar o inventário acima, selecionar UMA das opções:

### Opção A — Adaptar o existente
**Quando usar:** Já existe infraestrutura CMS compatível que pode ser estendida sem quebrar outros módulos.  
**Risco:** Possível conflito com funcionalidades existentes.

### Opção B — Substituir
**Quando usar:** Existe código CMS mas está desatualizado ou incompatível com o novo contrato (Matriz Final).  
**Risco:** Perda de código existente; verificar se algo depende do que será removido.

### Opção C — Criar paralelo controlado
**Quando usar:** Existe código CMS mas serve outro propósito; o novo módulo precisa coexistir.  
**Risco:** Duplicação controlada; exige documentação clara dos dois sistemas.

---

**Decisão tomada:** `[ ]` Opção A — Adaptar  `[ ]` Opção B — Substituir  `[ ]` Opção C — Paralelo

**Justificativa:**
```
_preencher após análise_
```

**Arquivos que serão reaproveitados (se Opção A ou C):**
```
_preencher_
```

**Arquivos que serão removidos (se Opção B):**
```
_preencher_
```

---

## Gate do PR 0.5

- [ ] Inventário completo das seções 1 a 6 acima
- [ ] Lista de chaves de `localStorage` levantada
- [ ] Decisão arquitetural tomada (A, B ou C)
- [ ] Decisão justificada com base no inventário
- [ ] Risco de duplicação eliminado antes de qualquer API nova
- [ ] Próximos PRs (1 a 7) podem avançar sem ambiguidade sobre o que adaptar vs criar

---

**Executor:** _preencher_  
**Revisado em:** _preencher_  
**Próximo:** PR 1 — `feat/admin-foundation-content-types`  
(Arquivo de referência: `shared/website-types.ts`, `server/validators/admin-website.validator.ts`)
