# RSV360 — Módulo Gerenciamento do Site: Guia de Deploy

Documentação de referência para implantação, monitoramento e rollback do módulo
Admin/Website (PRs 0–7) em ambiente de produção.

---

## Variáveis de Ambiente

### Obrigatórias

| Variável | Descrição | Exemplo |
|---|---|---|
| `DATABASE_URL` | String de conexão PostgreSQL | `postgresql://user:pass@host/db` |
| `SESSION_SECRET` | Segredo da sessão Express (mín. 32 chars) | `<string aleatória longa>` |
| `MEDIA_UPLOAD_DIR` | Diretório local para uploads de mídia | `./uploads/website` |
| `MEDIA_PUBLIC_URL` | URL pública base para servir mídias | `https://seudominio.com/uploads/website` |

### Opcionais (produção cloud)

| Variável | Descrição |
|---|---|
| `MEDIA_CDN_BASE_URL` | URL base do CDN para mídias (Cloudflare R2, S3, etc.) |
| `AWS_S3_BUCKET` | Nome do bucket S3 para armazenamento de mídia |
| `AWS_S3_REGION` | Região AWS do bucket (ex: `sa-east-1`) |
| `CDN_BASE_URL` | URL pública do CDN configurado na frente do S3 |

---

## Endpoints de Monitoramento

### Públicos (sem autenticação)

| Endpoint | Descrição | Código esperado |
|---|---|---|
| `GET /api/website/settings` | Configurações públicas do site | `200` |
| `GET /api/website/navigation` | Navegação agrupada por seção | `200` |
| `GET /api/website/pages/:slug` | Página publicada por slug | `200` / `404` |

### Admin (requer sessão admin)

| Endpoint | Descrição | Código esperado |
|---|---|---|
| `GET /api/admin/website/pages` | Listagem de páginas | `200` / `401` |
| `GET /api/admin/website/settings` | Configurações completas | `200` / `401` |
| `GET /api/admin/website/audit` | Trilha de auditoria | `200` / `401` |
| `GET /api/admin/website/media` | Listagem de mídias | `200` / `401` |

---

## Smoke Test

Execute antes e após cada deploy:

```bash
BASE_URL=https://seudominio.com ./scripts/smoke-website.sh
```

Saída esperada: todos os checks `PASS`, exit code 0.

---

## Pipeline de Deploy Sugerido

```
1. npm run check            # TypeScript sem erros
2. npm run build            # Build de produção
3. npm run db:push          # Sync de schema (sem migrations destrutivas)
4. Reiniciar serviço
5. ./scripts/smoke-website.sh   # Verificar endpoints
6. npx playwright test      # E2E (se ambiente permitir)
```

### Pré-condições

- `DATABASE_URL` apontando para o banco de produção.
- `MEDIA_UPLOAD_DIR` com permissão de escrita para o processo Node.
- `MEDIA_PUBLIC_URL` configurado com a URL pública correta.

---

## Procedimento de Rollback

1. **Código**: reverter para o commit anterior via Git (`git revert` ou checkout).
2. **Banco**: o schema usa apenas `db:push` (sem migrations numéricas), portanto
   basta reverter o código — colunas extras não causam erros na versão anterior.
3. **Mídias**: arquivos em `MEDIA_UPLOAD_DIR` são persistentes e não são afetados
   pelo rollback de código. Registros órfãos podem ser limpos com `status = orphan`.

---

## Segurança

- Todos os endpoints `/api/admin/website/*` exigem sessão com `role = admin`.
- Rate limits aplicados: upload (30 req/min), deleção (10 req/min) por IP.
- Páginas draft nunca são expostas pela API pública.
- Campos internos (`id`, `logoMediaId`, `heroType`) são omitidos das respostas públicas.

---

## Auditoria

Toda operação de escrita (create, update, delete, publish, unpublish, upload, swap, unlink)
é registrada em `audit_logs` com `actorId`, `actorName`, `diff` e `createdAt`.

Consulta via API:

```
GET /api/admin/website/audit?entity=page&entityId=<id>&limit=50
```
