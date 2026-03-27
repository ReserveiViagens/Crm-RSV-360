# AUDIT — RSV360

**Auditoria em:** 2026-03-27  
**Baseada em:** `client/src/App.tsx`, `server/routes.ts`, `server/routes/weather-routes.ts`

**Legenda:**
- `[x]` implementado e funcional
- `[~]` parcial (código existe, gaps identificados)
- `[ ]` não implementado
- `[D]` demo mode (fallback sem env vars)
- `[I]` in-memory / persistence.ts (perde no restart)
- `[M]` mockado (dados hardcoded/seeded)
- `[R]` dados reais (Postgres ou serviço externo)

---

## 1. Rotas Frontend (wouter)

### Marketing / Landing

| Rota | Status | Observação |
|------|--------|-----------|
| `/` | `[x]` | LandingPage completa |
| `/home` | `[x]` | Home alternativa |
| `/quem-somos` | `[x]` | — |
| `/contato` | `[x]` | — |
| `/politica-de-privacidade` | `[x]` | — |
| `/suporte` | `[x]` | — |
| `/pagamentos` | `[x]` | — |

### Catálogo / Commerce

| Rota | Status | Observação |
|------|--------|-----------|
| `/ingressos` | `[x]` | Catálogo com 5 parques hardcoded, Combo IA frontend |
| `/ingressos/checkout` | `[x]` | Formulário + QR Pix + polling (demo mode) |
| `/ingressos/sucesso` | `[~]` | Download TXT existe; falta PDF/QR de alta qualidade |
| `/hoteis` | `[x]` | — |
| `/hoteis/:id` | `[x]` | — |
| `/excursoes` | `[x]` | — |
| `/excursoes/:slug` | `[x]` | Landing pública por slug |
| `/catalogo-excursoes` | `[x]` | — |
| `/atracoes` | `[x]` | — |
| `/promocoes` | `[x]` | — |
| `/flash-deals` | `[x]` | — |
| `/leiloes` | `[x]` | — |
| `/busca` | `[x]` | Resultados mockados de `search-data.ts` |

### Ferramentas / AI

| Rota | Status | Observação |
|------|--------|-----------|
| `/caldas-ai` | `[x]` | — |
| `/mapa-caldas-novas` | `[x]` | Leaflet real + OSM tiles (Task #8) |
| `/mapa` | `[x]` | Alias |

### Cliente / App Mobile

| Rota | Status | Observação |
|------|--------|-----------|
| `/perfil` | `[x]` | — |
| `/minhas-reservas` | `[~]` | Dados mockados (API retorna seeded) |
| `/notificacoes` | `[~]` | Dados mockados (API retorna seeded) |
| `/configuracoes` | `[x]` | — |
| `/programa-fidelidade` | `[x]` | — |
| `/minhas-avaliacoes` | `[x]` | — |
| `/minha-jornada` | `[x]` | Postgres real |
| `/ranking-organizadores` | `[x]` | Postgres real |
| `/viagens-grupo` | `[x]` | — |
| `/viagens-grupo/:id` | `[x]` | — |

### Organizador (LIDER)

| Rota | Status | Observação |
|------|--------|-----------|
| `/criar-excursao` | `[x]` | — |
| `/criar-excursao/:id` | `[x]` | — |
| `/organizer/metas` | `[x]` | — |
| `/metas` | `[x]` | Alias |

### Admin

| Rota | Status | Observação |
|------|--------|-----------|
| `/admin` | `[~]` | KPIs hardcoded |
| `/admin/dashboard` | `[~]` | Alias |
| `/dashboard` | `[~]` | Alias |
| `/admin/fnrh` | `[x]` | — |
| `/admin/assinatura-digital` | `[x]` | — |
| `/admin/financeiro` | `[x]` | — |
| `/admin/integracoes` | `[x]` | — |
| `/admin/cadastur` | `[x]` | — |
| `/admin/lgpd` | `[x]` | — |
| `/admin/relatorios-ads` | `[x]` | — |
| `/admin/seguro-viagem` | `[x]` | — |
| `/admin/seguranca-embarque` | `[x]` | — |
| `/admin/contratos` | `[x]` | — |
| `/admin/frota-antt` | `[x]` | — |
| `/admin/frota` | `[x]` | Alias |
| `/admin/nova-reserva` | `[x]` | — |
| `/admin/clientes` | `[x]` | — |
| `/admin/crm` | `[x]` | — |
| `/admin/relatorio-mensal` | `[x]` | — |
| `/admin/configuracoes-sistema` | `[x]` | — |
| `/admin/branding` | `[x]` | — |
| `/admin/mapa` | `[x]` | — |
| `/admin/permissoes` | `[x]` | — |
| `/admin/waas` | `[x]` | — |
| `/waas` | `[x]` | Alias |
| `/admin/super-financeiro` | `[x]` | — |
| `/super-financeiro` | `[x]` | Alias |
| `/admin/live-chat` | `[x]` | — |
| `/live-chat` | `[x]` | Alias |

### Auth

| Rota | Status | Observação |
|------|--------|-----------|
| `/entrar` | `[x]` | — |
| `/login` | `[x]` | Alias |
| `/cadastrar` | `[x]` | — |
| `/kyc` | `[x]` | — |

---

## 2. Endpoints Backend

### Auth

| Método | Endpoint | Status | Dados |
|--------|----------|--------|-------|
| POST | `/api/auth/register` | `[x]` | `[R]` Postgres |
| POST | `/api/auth/login` | `[x]` | `[R]` Postgres |
| POST | `/api/auth/logout` | `[x]` | `[R]` session |
| GET | `/api/auth/me` | `[x]` | `[R]` Postgres |
| POST | `/api/auth/selfie` | `[x]` | `[R]` Postgres |
| POST | `/api/auth/tornar-lider` | `[x]` | `[R]` Postgres |
| PATCH | `/api/auth/perfil` | `[x]` | `[R]` Postgres |
| GET | `/api/auth/google/status` | `[x]` | `[R]` env check |
| GET | `/api/auth/google` | `[D]` | OAuth (se configurado) |
| GET | `/api/auth/google/callback` | `[D]` | OAuth callback |

### Reservas e Notificações

| Método | Endpoint | Status | Dados |
|--------|----------|--------|-------|
| GET | `/api/reservas/minhas` | `[~]` | `[M]` seeded por userId — não lê banco |
| GET | `/api/notificacoes` | `[~]` | `[M]` seeded por userId — não lê banco |
| PATCH | `/api/notificacoes/:id/lida` | `[~]` | `[M]` in-memory (notificacaoStore) |

### Excursões CRUD

| Método | Endpoint | Status | Dados |
|--------|----------|--------|-------|
| GET | `/api/opcionais` | `[x]` | `[I]` persistence.ts |
| GET | `/api/excursoes` | `[x]` | `[I]` persistence.ts |
| GET | `/api/excursoes/catalogo` | `[x]` | `[I]` + search-data.ts |
| GET | `/api/excursoes/:id` | `[x]` | `[I]` |
| POST | `/api/excursoes` | `[x]` | `[I]` |
| DELETE | `/api/excursoes/:id` | `[x]` | `[I]` |
| PATCH | `/api/excursoes/:id` | `[x]` | `[I]` |
| POST | `/api/excursoes/:id/clonar` | `[x]` | `[I]` |
| GET | `/api/excursoes/landing/:slug` | `[x]` | `[I]` |

### Excursões — Reservas e Stats

| Método | Endpoint | Status | Dados |
|--------|----------|--------|-------|
| GET | `/api/excursoes/:id/reservas` | `[x]` | `[I]` |
| POST | `/api/excursoes/:id/reservas` | `[x]` | `[I]` |
| GET | `/api/excursoes/:id/stats` | `[x]` | `[I]` |
| GET | `/api/excursoes/:id/pode-reservar-veiculo` | `[x]` | `[I]` |
| POST | `/api/excursoes/:id/reservar-veiculo` | `[x]` | `[I]` |

### Excursões — Grupo, Convites e Participação

| Método | Endpoint | Status | Dados |
|--------|----------|--------|-------|
| POST | `/api/excursoes/:id/invites` | `[x]` | `[I]` |
| POST | `/api/invites/validate` | `[x]` | `[I]` |
| GET | `/api/invites/:code` | `[x]` | `[I]` |
| POST | `/api/invites/join` | `[x]` | `[I]` |
| POST | `/api/excursoes/:id/solicitar-participacao` | `[x]` | `[I]` |
| POST | `/api/excursoes/:id/creator-setup` | `[x]` | `[I]` |
| GET | `/api/excursoes/:id/me-role` | `[x]` | `[I]` |
| POST | `/api/excursoes/:id/estado-grupo` | `[x]` | `[I]` + WebSocket |
| PATCH | `/api/excursoes/:id/orders/:userId` | `[x]` | `[I]` |
| GET | `/api/excursoes/:id/solicitacoes` | `[x]` | `[I]` |
| GET | `/api/excursoes/:id/solicitacoes/resumo` | `[x]` | `[I]` |
| PATCH | `/api/excursoes/:id/solicitacoes/:userId` | `[x]` | `[I]` |

### Excursões — Roteiro

| Método | Endpoint | Status | Dados |
|--------|----------|--------|-------|
| GET | `/api/excursoes/:id/roteiro` | `[x]` | `[I]` |
| PATCH | `/api/excursoes/:id/roteiro` | `[x]` | `[I]` |
| GET | `/api/excursoes/:id/catalogo-roteiro` | `[x]` | `[I]` |
| POST | `/api/excursoes/:id/catalogo-roteiro/:categoria` | `[x]` | `[I]` |
| PATCH | `/api/excursoes/:id/catalogo-roteiro/:categoria/:itemId` | `[x]` | `[I]` |
| GET | `/api/excursoes/:id/sugestoes-roteiro` | `[x]` | `[I]` |
| PATCH | `/api/excursoes/:id/sugestoes-roteiro/:sugestaoId` | `[x]` | `[I]` |
| GET | `/api/excursoes/:id/votacao-roteiro` | `[x]` | `[I]` |
| POST | `/api/excursoes/:id/votacao-roteiro` | `[x]` | `[I]` |

### Excursões — Alertas

| Método | Endpoint | Status | Dados |
|--------|----------|--------|-------|
| POST | `/api/excursoes/:id/alertas/pix-expirado` | `[x]` | `[I]` + WebSocket |
| POST | `/api/excursoes/:id/alertas/vigilancia` | `[x]` | `[I]` + WebSocket |

### Burocracia / Documentos

| Método | Endpoint | Status | Dados |
|--------|----------|--------|-------|
| GET | `/api/excursoes/:id/manifesto-antt` | `[x]` | `[R]` PDF gerado |
| GET | `/api/excursoes/:id/fnrh` | `[x]` | `[R]` PDF gerado |
| GET | `/api/excursoes/:id/relatorio-contabil` | `[x]` | `[R]` PDF gerado |
| GET | `/api/excursoes/:id/voucher/:passageiroIndex` | `[x]` | `[R]` PDF gerado |

### Busca

| Método | Endpoint | Status | Dados |
|--------|----------|--------|-------|
| GET | `/api/search` | `[~]` | `[M]` search-data.ts (não busca excursões reais) |
| GET | `/api/search/suggest` | `[~]` | `[M]` |
| GET | `/api/search/suggestions` | `[~]` | `[M]` alias |
| GET | `/api/search/places` | `[~]` | `[M]` hardcoded |

### Admin

| Método | Endpoint | Status | Dados |
|--------|----------|--------|-------|
| GET | `/api/admin/stats/:excursaoId` | `[x]` | `[I]` |
| GET | `/api/admin/solicitacoes/resumo` | `[x]` | `[I]` |
| GET | `/api/demo/info` | `[x]` | `[R]` env vars |

### WhatsApp / WaaS

| Método | Endpoint | Status | Dados |
|--------|----------|--------|-------|
| GET | `/api/waas/status` | `[x]` | `[D]` Evolution API |
| POST | `/api/waas/instancia` | `[x]` | `[D]` Evolution API |
| GET | `/api/waas/instancia/status` | `[x]` | `[D]` Evolution API |
| GET | `/api/waas/instancia/qrcode` | `[x]` | `[D]` Evolution API |
| DELETE | `/api/waas/instancia` | `[x]` | `[D]` Evolution API |
| POST | `/api/waas/webhook` | `[x]` | `[D]` Evolution API |
| GET | `/api/waas/grupos` | `[x]` | `[D]` Evolution API |
| POST | `/api/waas/criar-grupo` | `[x]` | `[D]` Evolution API |
| POST | `/api/waas/:excursaoId/mensagem` | `[x]` | `[D]` Evolution API |
| POST | `/api/waas/:excursaoId/enquete` | `[x]` | `[D]` Evolution API |
| GET | `/api/waas/:excursaoId/status` | `[x]` | `[I]` |

### Pagamento Pix — Excursões (com split)

| Método | Endpoint | Status | Dados |
|--------|----------|--------|-------|
| POST | `/api/pagamento/gerar-pix` | `[x]` | `[D]` gateway externo / split 15% |
| GET | `/api/pagamento/status/:transactionId` | `[x]` | `[D]` gateway externo |
| POST | `/api/webhook/payment` | `[x]` | `[D]` sem HMAC (gap G4.4) |

### Pagamento Pix — Ingressos (sem split)

| Método | Endpoint | Status | Dados |
|--------|----------|--------|-------|
| POST | `/api/payments/tickets/create` | `[x]` | `[D]` gateway externo |
| GET | `/api/payments/tickets/:id/status` | `[~]` | `[D]` sempre PENDING em demo (gap G3.1) |
| GET | `/api/payments/tickets/:id` | `[~]` | `[D]` in-memory (perde no restart, gap G2.1) |
| POST | `/api/webhooks/tickets` | `[x]` | `[D]` sem HMAC (gap G4.4) |

### Handoff / Live Chat

| Método | Endpoint | Status | Dados |
|--------|----------|--------|-------|
| POST | `/api/handoff/:groupId/pausar` | `[x]` | `[I]` |
| POST | `/api/handoff/:groupId/retomar` | `[x]` | `[I]` |
| GET | `/api/handoff/pausados` | `[x]` | `[I]` |

### Metas do Organizador

| Método | Endpoint | Status | Dados |
|--------|----------|--------|-------|
| GET | `/api/organizador/:userId/metas` | `[x]` | `[I]` |
| PATCH | `/api/organizador/metas/:id/resgatar` | `[x]` | `[I]` |

### Gamificação (Postgres)

| Método | Endpoint | Status | Dados |
|--------|----------|--------|-------|
| GET | `/api/gamification/pontos` | `[x]` | `[R]` Postgres |
| GET | `/api/gamification/historico` | `[x]` | `[R]` Postgres |
| GET | `/api/gamification/conquistas` | `[x]` | `[R]` Postgres |
| GET | `/api/gamification/ranking-organizadores` | `[x]` | `[R]` Postgres |

### Analytics

| Método | Endpoint | Status | Dados |
|--------|----------|--------|-------|
| POST | `/api/analytics/pageview` | `[x]` | `[I]` in-memory |

### Atividades Wizard

| Método | Endpoint | Status | Dados |
|--------|----------|--------|-------|
| GET | `/api/atividades-wizard` | `[x]` | `[I]` |
| POST | `/api/atividades-wizard` | `[x]` | `[I]` admin only |
| PATCH | `/api/atividades-wizard/:id` | `[x]` | `[I]` admin only |
| DELETE | `/api/atividades-wizard/:id` | `[x]` | `[I]` admin only |

### Clima

| Método | Endpoint | Status | Dados |
|--------|----------|--------|-------|
| GET | `/api/weather` | `[x]` | `[R]` Open-Meteo + cache |
| GET | `/api/weather/by-coords` | `[x]` | `[R]` Open-Meteo + cache |
| POST | `/internal/weather/warmup` | `[x]` | `[R]` pré-aquece cache |

---

## 3. Resumo executivo

| Categoria | Total | `[x]` | `[~]` | `[ ]` |
|-----------|-------|-------|-------|-------|
| Rotas frontend | 60+ | 56 | 4 | 0 |
| Endpoints backend | 80+ | 69 | 11 | 0 |

**Rotas frontend parciais (`[~]`):**
- `/ingressos/sucesso` — download TXT existe, falta PDF
- `/minhas-reservas` — dados mockados
- `/notificacoes` — dados mockados
- `/admin` (e aliases) — KPIs hardcoded

**Endpoints parciais (`[~]`) mais críticos:**
- `GET /api/reservas/minhas` — não lê banco
- `GET /api/notificacoes` — não lê banco
- `GET /api/payments/tickets/:id/status` — sempre PENDING em demo
- `GET /api/payments/tickets/:id` — in-memory (perde no restart)
- Todos `GET /api/search*` — não busca dados reais
