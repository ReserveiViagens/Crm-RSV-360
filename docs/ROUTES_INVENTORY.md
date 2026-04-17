# ROUTES INVENTORY — RSV360

**Atualizado em:** 2026-03-27  
**Fonte:** `client/src/App.tsx` (frontend) + `server/routes.ts` + `server/routes/weather-routes.ts`

> **Nota sobre legenda:**  
> Neste arquivo, o campo **Status** dos endpoints backend indica a **fonte de dados / modo de operação**:
> `[R]` real (Postgres/serviço externo) · `[D]` demo mode (fallback sem env vars) · `[I]` in-memory persistence.ts · `[M]` mockado.  
> Para o **status de implementação** (se o código existe e está funcional), consulte `docs/AUDIT.md`.  
> Um endpoint marcado `[D]` está completamente implementado — apenas opera em modo demo quando as variáveis de ambiente do gateway não estão configuradas.

---

## 1. Rotas Frontend (wouter — `client/src/App.tsx`)

### Públicas — Marketing/Landing

| Rota | Componente | Status |
|------|-----------|--------|
| `/` | `LandingPage` | `[x]` implementado |
| `/home` | `Home` | `[x]` implementado |
| `/quem-somos` | `QuemSomos` | `[x]` implementado |
| `/contato` | `Contato` | `[x]` implementado |
| `/politica-de-privacidade` | `PoliticaPrivacidade` | `[x]` implementado |
| `/suporte` | `Suporte` | `[x]` implementado |
| `/pagamentos` | `Pagamentos` | `[x]` implementado |

### Públicas — Catálogo/Commerce

| Rota | Componente | Status |
|------|-----------|--------|
| `/ingressos` | `Ingressos` | `[x]` implementado |
| `/ingressos/checkout` | `IngressosCheckout` | `[x]` implementado |
| `/ingressos/sucesso` | `IngressosSucesso` | `[~]` parcial (sem PDF voucher) |
| `/hoteis` | `Hoteis` | `[x]` implementado |
| `/hoteis/:id` | `Hoteis` | `[x]` implementado |
| `/excursoes` | `Excursoes` | `[x]` implementado |
| `/excursoes/:slug` | `ExcursaoLanding` | `[x]` implementado |
| `/catalogo-excursoes` | `CatalogoExcursoes` | `[x]` implementado |
| `/atracoes` | `Atracoes` | `[x]` implementado |
| `/promocoes` | `Promocoes` | `[x]` implementado |
| `/flash-deals` | `FlashDeals` | `[x]` implementado |
| `/leiloes` | `Leiloes` | `[x]` implementado |
| `/busca` | `SearchPage` | `[x]` implementado |

### Públicas — Ferramentas/AI

| Rota | Componente | Status |
|------|-----------|--------|
| `/caldas-ai` | `CaldasAI` | `[x]` implementado |
| `/mapa-caldas-novas` | `MapaCaldas` | `[x]` implementado (Leaflet real) |
| `/mapa` | `MapaCaldas` | `[x]` alias |

### Públicas — Cliente/App Mobile

| Rota | Componente | Status |
|------|-----------|--------|
| `/perfil` | `Perfil` | `[x]` implementado |
| `/minhas-reservas` | `MinhasReservas` | `[~]` parcial (dados mockados) |
| `/notificacoes` | `Notificacoes` | `[~]` parcial (dados mockados) |
| `/configuracoes` | `Configuracoes` | `[x]` implementado |
| `/programa-fidelidade` | `ProgramaFidelidade` | `[x]` implementado |
| `/minhas-avaliacoes` | `MinhasAvaliacoes` | `[x]` implementado |
| `/minha-jornada` | `MinhaJornada` | `[x]` implementado (Postgres) |
| `/ranking-organizadores` | `RankingOrganizadores` | `[x]` implementado (Postgres) |
| `/viagens-grupo` | `ViagensGrupo` | `[x]` implementado |
| `/viagens-grupo/:id` | `ViagensGrupo` | `[x]` implementado |

### Protegidas — Organizador (LIDER/admin)

| Rota | Componente | Status |
|------|-----------|--------|
| `/criar-excursao` | `CriarExcursao` | `[x]` implementado |
| `/criar-excursao/:id` | `CriarExcursao` | `[x]` implementado |
| `/organizer/metas` | `GamificationDashboard` | `[x]` implementado |
| `/metas` | `GamificationDashboard` | `[x]` alias |

### Protegidas — Admin

| Rota | Componente | Status |
|------|-----------|--------|
| `/admin` | `AdminDashboard` | `[~]` parcial (métricas hardcoded) |
| `/admin/dashboard` | `AdminDashboard` | `[~]` alias |
| `/dashboard` | `AdminDashboard` | `[~]` alias |
| `/admin/fnrh` | `AdminFnrh` | `[x]` implementado |
| `/admin/assinatura-digital` | `AssinaturaDigital` | `[x]` implementado |
| `/admin/financeiro` | `Financeiro` | `[x]` implementado |
| `/admin/integracoes` | `Integracoes` | `[x]` implementado |
| `/admin/cadastur` | `CadasturPage` | `[x]` implementado |
| `/admin/lgpd` | `LGPDDashboard` | `[x]` implementado |
| `/admin/relatorios-ads` | `RelatoriosAds` | `[x]` implementado |
| `/admin/seguro-viagem` | `SeguroViagem` | `[x]` implementado |
| `/admin/seguranca-embarque` | `SegurancaEmbarque` | `[x]` implementado |
| `/admin/contratos` | `ContratosExcursao` | `[x]` implementado |
| `/admin/frota-antt` | `FrotaANTT` | `[x]` implementado |
| `/admin/frota` | `FrotaANTT` | `[x]` alias |
| `/admin/nova-reserva` | `AdminNovaReserva` | `[x]` implementado |
| `/admin/clientes` | `AdminClientes` | `[x]` implementado |
| `/admin/crm` | `AdminCRM` | `[x]` implementado |
| `/admin/relatorio-mensal` | `AdminRelatorioMensal` | `[x]` implementado |
| `/admin/configuracoes-sistema` | `AdminConfiguracoesSistema` | `[x]` implementado |
| `/admin/branding` | `AdminBranding` | `[x]` implementado |
| `/admin/mapa` | `AdminMapa` | `[x]` implementado |
| `/admin/permissoes` | `AdminPermissoes` | `[x]` implementado |
| `/admin/excursoes` | `ViagensGrupo` | `[x]` alias |
| `/admin/passageiros` | `ViagensGrupo` | `[x]` alias |
| `/admin/waas` | `WaaSDashboard` | `[x]` implementado |
| `/waas` | `WaaSDashboard` | `[x]` alias |
| `/admin/super-financeiro` | `FinancialDashboard` | `[x]` implementado |
| `/super-financeiro` | `FinancialDashboard` | `[x]` alias |
| `/admin/live-chat` | `LiveChat` | `[x]` implementado |
| `/live-chat` | `LiveChat` | `[x]` alias |

### Auth

| Rota | Componente | Status |
|------|-----------|--------|
| `/entrar` | `Entrar` | `[x]` implementado |
| `/login` | `Entrar` | `[x]` alias |
| `/cadastrar` | `Cadastrar` | `[x]` implementado |
| `/kyc` | `KYCVerificacao` | `[x]` implementado |

---

## 2. Endpoints Backend (Express — `server/routes.ts` + `server/routes/weather-routes.ts`)

**Legenda de status:**
- `[R]` dados reais (Postgres ou serviço externo)
- `[D]` demo mode (fallback quando env vars ausentes)
- `[M]` mockado em memória (seeded, hardcoded)
- `[I]` in-memory via `server/persistence.ts` (persiste em `data/db.json`, perde no restart)

### Auth

| Método | Endpoint | Status | Observações |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | `[R]` | Cria usuário em Postgres |
| POST | `/api/auth/login` | `[R]` | Lê de Postgres |
| POST | `/api/auth/logout` | `[R]` | Destroi sessão |
| GET | `/api/auth/me` | `[R]` | Lê de Postgres |
| POST | `/api/auth/selfie` | `[R]` | Atualiza fotoUrl |
| POST | `/api/auth/tornar-lider` | `[R]` | Promove role para LIDER |
| PATCH | `/api/auth/perfil` | `[R]` | Atualiza nome/telefone |
| GET | `/api/auth/google/status` | `[R]` | Retorna se OAuth Google está configurado |
| GET | `/api/auth/google` | `[D]` | Redireciona para Google (se configurado) |
| GET | `/api/auth/google/callback` | `[D]` | Callback OAuth Google |

### Reservas e Notificações do Passageiro

| Método | Endpoint | Status | Observações |
|--------|----------|--------|-------------|
| GET | `/api/reservas/minhas` | `[M]` | Seeded por userId — dados fixos, sem banco |
| GET | `/api/notificacoes` | `[M]` | Seeded por userId — dados fixos, sem banco |
| PATCH | `/api/notificacoes/:id/lida` | `[M]` | In-memory (notificacaoStore) |

### Demo

| Método | Endpoint | Status | Observações |
|--------|----------|--------|-------------|
| GET | `/api/demo/info` | `[R]` | Retorna DEMO_EXCURSAO_ID e DEMO_INVITE_CODE |

### Excursões CRUD

| Método | Endpoint | Status | Observações |
|--------|----------|--------|-------------|
| GET | `/api/opcionais` | `[I]` | Lista opcionais (server/opcionais.ts) |
| GET | `/api/excursoes` | `[I]` | Lista excursões (server/excursoes.ts) |
| GET | `/api/excursoes/catalogo` | `[I]` | Catálogo filtrado por search-data.ts |
| GET | `/api/excursoes/:id` | `[I]` | Busca excursão por ID |
| POST | `/api/excursoes` | `[I]` | Cria excursão |
| DELETE | `/api/excursoes/:id` | `[I]` | Remove excursão |
| PATCH | `/api/excursoes/:id` | `[I]` | Atualiza excursão |
| POST | `/api/excursoes/:id/clonar` | `[I]` | Clona excursão |
| GET | `/api/excursoes/landing/:slug` | `[I]` | Landing pública por slug |

### Excursões — Reservas

| Método | Endpoint | Status | Observações |
|--------|----------|--------|-------------|
| GET | `/api/excursoes/:id/reservas` | `[I]` | Lista reservas da excursão |
| POST | `/api/excursoes/:id/reservas` | `[I]` | Cria reserva |
| GET | `/api/excursoes/:id/stats` | `[I]` | Estatísticas da excursão |
| GET | `/api/excursoes/:id/pode-reservar-veiculo` | `[I]` | Verifica disponibilidade veículo |
| POST | `/api/excursoes/:id/reservar-veiculo` | `[I]` | Reserva veículo |

### Excursões — Grupo e Convites

| Método | Endpoint | Status | Observações |
|--------|----------|--------|-------------|
| POST | `/api/excursoes/:id/invites` | `[I]` | Cria convite |
| POST | `/api/invites/validate` | `[I]` | Valida código de convite |
| GET | `/api/invites/:code` | `[I]` | Busca convite por código |
| POST | `/api/invites/join` | `[I]` | Entra no grupo via convite |
| POST | `/api/excursoes/:id/solicitar-participacao` | `[I]` | Solicita participação |
| POST | `/api/excursoes/:id/creator-setup` | `[I]` | Setup inicial do criador |
| GET | `/api/excursoes/:id/me-role` | `[I]` | Role do usuário logado |
| POST | `/api/excursoes/:id/estado-grupo` | `[I]` | Atualiza estado + WebSocket broadcast |
| PATCH | `/api/excursoes/:id/orders/:userId` | `[I]` | Atualiza ordem |
| GET | `/api/excursoes/:id/solicitacoes` | `[I]` | Lista solicitações |
| GET | `/api/excursoes/:id/solicitacoes/resumo` | `[I]` | Resumo de solicitações |
| PATCH | `/api/excursoes/:id/solicitacoes/:userId` | `[I]` | Aprova/rejeita solicitação |

### Excursões — Roteiro

| Método | Endpoint | Status | Observações |
|--------|----------|--------|-------------|
| GET | `/api/excursoes/:id/roteiro` | `[I]` | Roteiro oficial |
| PATCH | `/api/excursoes/:id/roteiro` | `[I]` | Atualiza roteiro |
| GET | `/api/excursoes/:id/catalogo-roteiro` | `[I]` | Catálogo de cards do roteiro |
| POST | `/api/excursoes/:id/catalogo-roteiro/:categoria` | `[I]` | Adiciona card ao catálogo |
| PATCH | `/api/excursoes/:id/catalogo-roteiro/:categoria/:itemId` | `[I]` | Atualiza card |
| GET | `/api/excursoes/:id/sugestoes-roteiro` | `[I]` | Sugestões de passageiros |
| PATCH | `/api/excursoes/:id/sugestoes-roteiro/:sugestaoId` | `[I]` | Modera sugestão |
| GET | `/api/excursoes/:id/votacao-roteiro` | `[I]` | Resultados da votação |
| POST | `/api/excursoes/:id/votacao-roteiro` | `[I]` | Registra voto |

### Excursões — Alertas

| Método | Endpoint | Status | Observações |
|--------|----------|--------|-------------|
| POST | `/api/excursoes/:id/alertas/pix-expirado` | `[I]` | Emite WebSocket pix_expirado |
| POST | `/api/excursoes/:id/alertas/vigilancia` | `[I]` | Emite WebSocket vigilancia |

### Burocracia / Documentos

| Método | Endpoint | Status | Observações |
|--------|----------|--------|-------------|
| GET | `/api/excursoes/:id/manifesto-antt` | `[R]` | Gera PDF ANTT (bureaucracyService) |
| GET | `/api/excursoes/:id/fnrh` | `[R]` | Gera FNRH (bureaucracyService) |
| GET | `/api/excursoes/:id/relatorio-contabil` | `[R]` | Gera relatório (accountingService) |
| GET | `/api/excursoes/:id/voucher/:passageiroIndex` | `[R]` | Gera voucher VIP do passageiro |

### Busca

| Método | Endpoint | Status | Observações |
|--------|----------|--------|-------------|
| GET | `/api/search` | `[M]` | Busca em search-data.ts |
| GET | `/api/search/suggest` | `[M]` | Sugestões de busca |
| GET | `/api/search/suggestions` | `[M]` | Alias |
| GET | `/api/search/places` | `[M]` | Lugares hardcoded |

### Admin

| Método | Endpoint | Status | Observações |
|--------|----------|--------|-------------|
| GET | `/api/admin/stats/:excursaoId` | `[I]` | Stats de excursão |
| GET | `/api/admin/solicitacoes/resumo` | `[I]` | Resumo global de solicitações |

### WhatsApp / WaaS

| Método | Endpoint | Status | Observações |
|--------|----------|--------|-------------|
| GET | `/api/waas/status` | `[D]` | Status da instância WaaS |
| POST | `/api/waas/instancia` | `[D]` | Cria instância Evolution API |
| GET | `/api/waas/instancia/status` | `[D]` | Estado de conexão (open/close) |
| GET | `/api/waas/instancia/qrcode` | `[D]` | QR code para scan |
| DELETE | `/api/waas/instancia` | `[D]` | Desconecta instância |
| POST | `/api/waas/webhook` | `[D]` | Recebe eventos Evolution API |
| GET | `/api/waas/grupos` | `[D]` | Lista grupos reais (se conectado) |
| POST | `/api/waas/criar-grupo` | `[D]` | Cria grupo no WhatsApp |
| POST | `/api/waas/:excursaoId/mensagem` | `[D]` | Envia texto ao grupo |
| POST | `/api/waas/:excursaoId/enquete` | `[D]` | Envia enquete ao grupo |
| GET | `/api/waas/:excursaoId/status` | `[I]` | Status WaaS da excursão |

### Pagamento Pix — Excursões (com split)

| Método | Endpoint | Status | Observações |
|--------|----------|--------|-------------|
| POST | `/api/pagamento/gerar-pix` | `[D]` | Cria Pix com split (15% organizador) |
| GET | `/api/pagamento/status/:transactionId` | `[D]` | Consulta status do Pix |
| POST | `/api/webhook/payment` | `[D]` | Webhook de confirmação + WebSocket |

### Pagamento Pix — Ingressos (sem split)

| Método | Endpoint | Status | Observações |
|--------|----------|--------|-------------|
| POST | `/api/payments/tickets/create` | `[D]` | Cria Pix sem split |
| GET | `/api/payments/tickets/:id/status` | `[D]` | Consulta status |
| GET | `/api/payments/tickets/:id` | `[D]` | Dados da transação (in-memory) |
| POST | `/api/webhooks/tickets` | `[D]` | Webhook de confirmação de ingresso |

### Live Chat / Handoff

| Método | Endpoint | Status | Observações |
|--------|----------|--------|-------------|
| POST | `/api/handoff/:groupId/pausar` | `[I]` | Pausa IA para o grupo |
| POST | `/api/handoff/:groupId/retomar` | `[I]` | Retoma IA |
| GET | `/api/handoff/pausados` | `[I]` | Lista grupos com IA pausada |

### Metas do Organizador

| Método | Endpoint | Status | Observações |
|--------|----------|--------|-------------|
| GET | `/api/organizador/:userId/metas` | `[I]` | Metas de gamificação do organizador |
| PATCH | `/api/organizador/metas/:id/resgatar` | `[I]` | Resgata recompensa da meta |

### Gamificação (Postgres)

| Método | Endpoint | Status | Observações |
|--------|----------|--------|-------------|
| GET | `/api/gamification/pontos` | `[R]` | Saldo real do Postgres |
| GET | `/api/gamification/historico` | `[R]` | Últimos 50 eventos (Postgres) |
| GET | `/api/gamification/conquistas` | `[R]` | Status desbloqueado/bloqueado (Postgres) |
| GET | `/api/gamification/ranking-organizadores` | `[R]` | Ranking real (Postgres) |

### Analytics

| Método | Endpoint | Status | Observações |
|--------|----------|--------|-------------|
| POST | `/api/analytics/pageview` | `[I]` | Registra pageview em memória |

### Atividades Wizard

| Método | Endpoint | Status | Observações |
|--------|----------|--------|-------------|
| GET | `/api/atividades-wizard` | `[I]` | Lista atividades |
| POST | `/api/atividades-wizard` | `[I]` | Cria atividade (admin only) |
| PATCH | `/api/atividades-wizard/:id` | `[I]` | Atualiza atividade (admin only) |
| DELETE | `/api/atividades-wizard/:id` | `[I]` | Remove atividade (admin only) |

### Clima

| Método | Endpoint | Status | Observações |
|--------|----------|--------|-------------|
| GET | `/api/weather` | `[R]` | Clima por cidade (Open-Meteo + cache) |
| GET | `/api/weather/by-coords` | `[R]` | Clima por coordenadas (Open-Meteo + cache) |
| POST | `/internal/weather/warmup` | `[R]` | Pré-aquece cache de clima |

---

## 3. WebSocket (`/ws`)

| Evento enviado pelo cliente | Descrição |
|------|-----------|
| `subscribe` com `excursaoId` | Assina atualizações em tempo real de uma excursão |

| Evento emitido pelo servidor | Descrição |
|------|-----------|
| `estado_grupo` | Atualização do estado do grupo |
| `pix_expirado` | Pix expirou para uma excursão |
| `vigilancia` | Alerta de vigilância |

---

## 4. Resumo de cobertura

| Categoria | Total | Real `[R]` | In-memory `[I]` | Demo `[D]` | Mockado `[M]` |
|-----------|-------|-----------|----------------|-----------|--------------|
| Auth | 10 | 7 | 0 | 3 | 0 |
| Reservas/Notificações | 3 | 0 | 0 | 0 | 3 |
| Excursões | ~35 | 4 (docs/PDF) | ~31 | 0 | 0 |
| Busca | 4 | 0 | 0 | 0 | 4 |
| WaaS/WhatsApp | 10 | 0 | 1 | 9 | 0 |
| Pagamentos Excursão | 3 | 0 | 0 | 3 | 0 |
| Pagamentos Ingresso | 4 | 0 | 0 | 4 | 0 |
| Gamificação | 4 | 4 | 0 | 0 | 0 |
| Clima | 3 | 3 | 0 | 0 | 0 |
| Outros | ~10 | 0 | ~10 | 0 | 0 |
