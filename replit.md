# RSV360 - Reservei Viagens

## Overview

RSV360 is a full-stack Brazilian travel booking platform focused on the tourist destinations of Caldas Novas and Rio Quente (Goiás, Brazil). The platform provides:

- Hotel and resort listings with detailed views and photo galleries
- Aquatic park tickets and attraction bookings
- Flash deals and live auction system for travel packages
- Group travel ("excursões") management with passenger lists, seating, and compliance documents
- AI-powered travel assistant (CaldasAI) with personalized recommendations
- Interactive map of Caldas Novas attractions
- Social commerce features: group invites, vouchers, and shared orders
- Admin dashboard with ANTT manifests, FNRH ficha, accounting reports, digital signatures, LGPD management, and fleet management

The app is written in Portuguese (pt-BR) and targets the Brazilian travel market.

---

## User Preferences

Preferred communication style: Simple, everyday language.

---

## System Architecture

### Frontend

- **Framework**: React 18 with TypeScript, bootstrapped via Vite
- **Routing**: `wouter` (lightweight client-side router)
- **State & Data Fetching**: TanStack React Query v5 for server state; local React state for UI
- **UI Components**: shadcn/ui (Radix UI primitives + Tailwind CSS), "new-york" style variant
- **Styling**: Tailwind CSS with CSS custom properties for theming (light/dark mode via `[data-theme]` classes); custom design tokens for colors, borders, shadows
- **Fonts**: Inter, Open Sans, Poppins loaded from Google Fonts
- **Real-time**: WebSocket client (`client/src/lib/socket.ts`) connects to `/ws`, subscribes per excursão ID, handles `estado_grupo`, `pix_expirado`, and `vigilancia` events with auto-reconnect
- **AI/Personalization**: Traveler profile stored in `localStorage` (`rsv360_traveler_profile`); match score calculation; FOMO/urgency messaging logic in `client/src/lib/caldas-ai-regras.ts`
- **Key pages**: Home, Hotels, Excursões (landing pública), Promotions, Flash Deals, Auctions, Tickets, Attractions, CaldasAI, Map, Profile, Group Trips, Create Excursão, Admin Dashboard, and multiple admin sub-pages
- **Wizard de Excursão** (`/criar-excursao/:id`): 5-step wizard with `StepBar` component (Básico → Veículo → Hotel → Roteiro → Revisão). Features: vehicle selection cards (Van/Micro/Ônibus) with auto-suggestion + manual override bug fixed, interactive day map tabs (D1/D2...), pre-populated Caldas Novas catalog (Hot Park, Di Roma, Lago Corumbá, City Tour, etc.) when API is empty, hotel admin/public separation via `?admin=1` query param, completion bar + neuromarketing in review step
- **Excursão em Grupo** (`/viagens-grupo`): 5-tab primary navigation (Início, Roteiro, Planejar, Votar, Chat). Tab content mapping: Início = QR/invite + Resumo de Custos + Economize em Grupo + **Seção PIX checkout** (PaymentCheckout com dados da excursão, comissão 15%); Roteiro = official itinerary cards + Timeline do Planejamento; Planejar = wizard + AI planner + hotel selector + suggestion submission + admin moderation; Votar = hotel voting + roteiro voting; Chat = inline group chat with toggleable AI assistant panel (two-column desktop, stacked mobile). Sticky tab bar with underline indicator. Tab bar uses `data-testid="primary-tab-{0-4}"`. **Wizard de convite**: se URL tem `?convite=CODIGO` e usuário não está logado, exibe card persuasivo com badge "Você foi convidado!", nome/datas da excursão, e botões Login/Cadastro que preservam `?convite=` no redirect. Após login, o código de convite é pré-preenchido automaticamente no input do gate.
- **Landing de Excursão** (`/excursoes/:slug`): Landing page com marketing direto. **Gate de autenticação**: visitantes não-logados veem card com botões Login/Cadastrar em vez do checkout PIX; usuários logados veem o PaymentCheckout normalmente. Redirecionamento pós-login aponta para `/viagens-grupo?excursao=ID`.

### Backend

- **Runtime**: Node.js with Express (TypeScript, ESM modules, run via `tsx`)
- **Entry point**: `server/index.ts` — creates HTTP server, sets up WebSocket, registers routes
- **WebSocket**: `ws` library via `server/socket.ts`; broadcasts real-time events to clients subscribed to a specific excursão
- **In-memory persistence**: `server/persistence.ts` uses a plain JS object (`_db`) as a mutable store. **No database is currently wired up for excursões, reservas, groups, or social commerce** — all stored in-memory and lost on restart
- **Drizzle ORM + PostgreSQL**: Only the `users` table in `shared/schema.ts` is defined for Postgres. `drizzle.config.ts` points to `DATABASE_URL`. Migrations live in `./migrations/`. The storage layer for users uses in-memory `MemStorage` (not Postgres yet)
- **Routes** (`server/routes.ts`): REST API for excursões CRUD, reservas, opcionais, social commerce (groups, memberships, orders, invites, vouchers), bureaucracy documents (ANTT manifest, FNRH, voucher VIP), and accounting reports
- **Services**:
  - `server/services/bureaucracyService.ts` — generates ANTT manifests, FNRH ficha, VIP vouchers
  - `server/services/accountingService.ts` — generates accounting reports
- **Auth header convention**: Actor identity passed via `x-user-id` and `x-user-name` HTTP headers (no session/JWT auth currently implemented for the excursão features)

### Build System

- **Dev**: `tsx server/index.ts` + Vite dev server middleware (HMR)
- **Production build**: Custom `script/build.ts` using esbuild (server bundle → `dist/index.cjs`) + Vite (client bundle → `dist/public`)
- **Path aliases**: `@/*` → `client/src/*`, `@shared/*` → `shared/*`

### Data Flow

1. React pages call `apiRequest()` or TanStack Query hooks → Express REST endpoints
2. Express routes call in-memory store functions (excursões, reservas, groups) or service functions
3. WebSocket broadcasts (`emitEstadoGrupo`, `emitPixExpirado`, `emitVigilancia`) push real-time updates to subscribed clients

---

## External Dependencies

### Database
- **PostgreSQL** via `drizzle-orm` and `pg` driver — configured via `DATABASE_URL` environment variable. Currently only the `users` table schema exists. The rest of the app's data (excursões, reservas, social commerce) is in-memory and would benefit from being migrated to Postgres tables.
- `connect-pg-simple` is included (likely for session storage, but sessions are not yet wired up)

### UI & Component Libraries
- **Radix UI** — full suite of accessible primitives (dialog, select, tabs, accordion, etc.)
- **shadcn/ui** — pre-built component wrappers on top of Radix
- **Lucide React** — icon library
- **react-icons** (`SiWhatsapp` used on quem-somos page)
- **Recharts** — charts in the admin dashboard

### Form & Validation
- **React Hook Form** with `@hookform/resolvers`
- **Zod** for schema validation; `drizzle-zod` for deriving Zod schemas from Drizzle tables

### HTTP & Data
- **TanStack React Query v5** — server state management
- **`date-fns`** — date utilities

### Notifications & Payments
- **`nodemailer`** — email sending (bundled in build allowlist)
- **`stripe`** — payment processing (bundled, but integration code not visible in reviewed files)
- **`xlsx`** — Excel file generation (likely for reports)

### GitHub Integration
- **`@octokit/rest`** — GitHub API client (purpose unclear from visible code; possibly for content/CMS or deployment triggers)

### Replit-Specific
- `@replit/vite-plugin-runtime-error-modal` — shows runtime errors in dev
- `@replit/vite-plugin-cartographer` — Replit-specific dev tooling
- `@replit/vite-plugin-dev-banner` — Replit dev banner
- `@replit/connectors-sdk` — Replit database/service connectors

### Real-time
- **`ws`** — WebSocket server library

### Utilities
- **`nanoid`** / **`uuid`** — ID generation
- **`clsx`** + **`tailwind-merge`** — conditional class utilities

### Environment Variables Required
- `DATABASE_URL` — PostgreSQL connection string (required for Drizzle)
- `EVOLUTION_API_URL` — Evolution API base URL for WhatsApp WaaS (optional, demo mode if absent)
- `EVOLUTION_API_KEY` — Evolution API key (optional, demo mode if absent)
- `EVOLUTION_INSTANCE_NAME` — Evolution API instance name (optional, defaults to "CaldasMaster")
- `GATEWAY_API_URL` — Payment gateway base URL for split Pix (optional, demo mode if absent)
- `GATEWAY_API_KEY` — Payment gateway key (optional, demo mode if absent)
- `RESERVEI_RECIPIENT_ID` — Platform split payment recipient ID
- `ORGANIZER_RECIPIENT_ID` — Organizer split payment recipient ID

---

## NTX Modules (Next Generation — Fase 2026)

Seven new modules implemented as "NTX" phase (commit `cca8dd6b`):

### T001 — KYC Biométrico
- Route: `/kyc`
- `client/src/components/kyc/LGPDAcceptanceModal.tsx` — LGPD scroll-required consent dialog
- `client/src/components/kyc/BiometricCapture.tsx` — webcam face capture (react-webcam), oval overlay
- `client/src/pages/kyc-verificacao.tsx` — full flow: LGPD → Biometria → Sucesso

### T002 — WhatsApp WaaS (Evolution API)
- Route: `/admin/waas`
- `server/services/whatsapp.service.ts` — createExcursionGroup, sendTextToGroup, sendPollToGroup, sendPaymentConfirmation, humanDelay() anti-ban, **createInstance, getInstanceStatus, getQRCode, deleteInstance, fetchAllGroups, handleWebhookEvent**
- `client/src/pages/admin/waas-dashboard.tsx` — **connection card** (QR code / connected badge / demo alert), groups table, create group modal, intervene, send poll
- API: POST /api/waas/criar-grupo, POST /api/waas/:id/mensagem, POST /api/waas/:id/enquete
- **Instance management API** (Evolution API real mode):
  - `POST /api/waas/instancia` — create instance
  - `GET /api/waas/instancia/status` — connection state (open/connecting/close) + phone number
  - `GET /api/waas/instancia/qrcode` — QR code base64 for scanning
  - `DELETE /api/waas/instancia` — disconnect/logout instance
  - `POST /api/waas/webhook` — receive Evolution API events (connection.update, messages.upsert)
  - `GET /api/waas/grupos` — fetch real groups when connected, empty array in demo
- **Demo mode**: works without env vars, returns mock responses
- **Real mode**: dashboard shows QR code for connection (auto-refresh 30s), connected phone number, disconnect button, real groups list

### T003 — Split Pix Payment
- `server/services/payment.service.ts` — createSplitPaymentPix (demo mode if no gateway env vars)
- `client/src/components/checkout/PaymentCheckout.tsx` — QR code, pix copy-paste, 30min countdown, split breakdown
- API: POST /api/pagamento/gerar-pix, POST /api/webhook/payment (webhook)
- Webhook fires sendPaymentConfirmation + emitEstadoGrupo WebSocket event

### T004/T007 — Gamificação do Organizador (dados reais)
- Route: `/organizer/metas`
- `client/src/pages/organizer/gamification-dashboard.tsx` — 3 níveis de meta com badge, progress bars, aviso de meta obrigatória, toast de desbloqueio
- API: GET /api/organizador/:userId/metas (calcula achievedSeats de reservas confirmadas + gamificationExtraSeats), PATCH /api/organizador/metas/:id/resgatar (persiste CLAIMED, rejeita se não atingida)
- Webhook: POST /api/webhook/payment incrementa gamificationExtraSeats a cada transaction.paid
- OrganizerGoal status: LOCKED | UNLOCKED | CLAIMED
- RewardType: CORTESIA | CASHBACK | UPGRADE_DIVERSAO
- Níveis: 1=Kit Conforto (15 vagas), 2=Ingresso Lagoa Termas (10 vagas), 3=Viagem 50% Desconto (30 vagas)

### T005 — Landing Pages Dinâmicas
- Route: `/excursoes/:slug`
- `client/src/pages/excursao-landing.tsx` — hero, FOMO countdown, itinerary D1/D2/D3, testimonials, checkout
- Demo: `/excursoes/caldas-novas-maio`
- API: GET /api/excursoes/landing/:slug, POST /api/analytics/pageview

### T006 — Super-Admin Financeiro + Live Chat Handoff
- Routes: `/admin/super-financeiro`, `/admin/live-chat`
- `client/src/pages/superadmin/financial-dashboard.tsx` — 4 KPI cards + BarChart + LineChart (recharts) + CSV export
- `client/src/pages/superadmin/live-chat.tsx` — group list, chat feed, toggle AI/Humano per group
- `server/services/humanHandoff.service.ts` — pauseAI/resumeAI with WebSocket events
- API: POST /api/handoff/:groupId/pausar, POST /api/handoff/:groupId/retomar

### T008 — Pontos do Passageiro + Minha Jornada RSV + Ranking
- `client/src/pages/minha-jornada.tsx` — route `/minha-jornada`: pontos reais, streak, conquistas, histórico, CTA
- `client/src/pages/ranking-organizadores.tsx` — route `/ranking-organizadores`: pódio top 3, tabela 4-10
- API: GET /api/gamification/pontos, /historico, /conquistas, /ranking-organizadores
- Webhook POST /api/webhook/payment credita 1pt/R$1 em pontosStore[passengerName]
- Perfil (`perfil.tsx`) busca saldo real e navega para /minha-jornada
- Admin sidebar tem link "Ranking" para /ranking-organizadores

### T009 — Busca Dinâmica de Excursões por Localização
- Route: `/catalogo-excursoes`
- `client/src/pages/catalogo-excursoes.tsx` — expanded with 18 mock excursões, location panel (CEP/Cidade/Estado), price/date filters, active chips, CaldasAI empty state
- `client/src/lib/viacep.ts` — ViaCEP API helper (`buscarCEP`, `formatCEP`, `ESTADOS_BR`)
- Excursão interface extended with `cidadeSaida`, `estadoSaida`, `cepSaida`, `parceiroRegional?` fields
- Departure cities: Goiânia, Brasília, Uberlândia, Belo Horizonte, São Paulo, Anápolis, Ribeirão Preto, Campo Grande, Cuiabá
- Location panel "De onde você sai?": 3 tabs (CEP via ViaCEP API with auto-fetch at 8 digits, Cidade free text, Estado dropdown with 27 UFs)
- Fallback "Parceiro regional": when no exact city match but same state, shows trips with amber badge
- Personalized empty state (`data-testid="catalogo-empty"`): message includes filtered city/state, dynamic WhatsApp URL
- Additional filters: price min/max, departure month (Apr–Jul 2026)
- Removable ChipFiltro components for all active filters
- CaldasAI empty state with WhatsApp link + CaldasAI button + clear filters

### T010 — Perfil RSV360 — Hierarquia Completa por Tipo de Usuário
- `client/src/components/protected-route.tsx` — ProtectedRoute component with role-based guards (redirects to /entrar if not logged in, / if wrong role)
- `client/src/pages/perfil.tsx` — rewritten with role hierarchy: Visitante (CTA login), Passageiro (reservas/pontos/notificações), Organizador (criar excursão/metas/ranking), Admin (painel admin/financeiro/LGPD)
- Role badge: dynamic per role (admin=red Shield, LIDER=orange Trophy, user=gold Star, default=Visitante)
- Reservas from API (`GET /api/reservas/minhas`) instead of hardcoded data
- Notifications badge from API (`GET /api/notificacoes`) showing unread count
- 5 new sub-pages:
  - `/minhas-reservas` — `client/src/pages/minhas-reservas.tsx` — reservation list with status badges
  - `/notificacoes` — `client/src/pages/notificacoes.tsx` — notifications with mark-as-read, color-coded by type
  - `/configuracoes` — `client/src/pages/configuracoes.tsx` — profile editing (nome/telefone via `PATCH /api/auth/perfil`), preferences
  - `/programa-fidelidade` — `client/src/pages/programa-fidelidade.tsx` — 4 loyalty tiers (Bronze/Prata/Ouro/Diamante), progress bar
  - `/minhas-avaliacoes` — `client/src/pages/minhas-avaliacoes.tsx` — user reviews with star ratings
- All admin routes wrapped in `<ProtectedRoute roles={["admin"]}>`, organizer routes in `<ProtectedRoute roles={["LIDER", "admin"]}>`
- Backend: `PATCH /api/auth/perfil`, `GET /api/reservas/minhas`, `GET /api/notificacoes`, `PATCH /api/notificacoes/:id/lida`
- Bottom nav updated: Busca → /catalogo-excursoes, Reservas → /minhas-reservas
- All menu links now point to real routes instead of `#`

### Admin Dashboard NTX Section
Sidebar in `admin-dashboard.tsx` has "🚀 NTX — Next Gen" section with links to all new modules.

### Admin Quick Action Pages (commit `0d01097`)
5 operational sub-pages connected to dashboard quick actions:
- `/admin/nova-reserva` — `client/src/pages/admin/nova-reserva.tsx` — booking form with client autocomplete, destination select, payment method
- `/admin/clientes` — `client/src/pages/admin/clientes.tsx` — client table with search/filter/pagination, inline add form, expandable detail
- `/admin/crm` — `client/src/pages/admin/crm.tsx` — split panel: client list + interaction timeline, add new interaction (Ligação/WhatsApp/E-mail/Reunião)
- `/admin/relatorio-mensal` — `client/src/pages/admin/relatorio-mensal.tsx` — month/year selector, 4 KPIs, recharts BarChart, reservations table, CSV export
- `/admin/configuracoes-sistema` — `client/src/pages/admin/configuracoes-sistema.tsx` — 3 tabs (Empresa/Pagamento/Notificações), toggles for notification channels and alert types
All routes protected with `ProtectedRoute roles={["admin"]}`. Dashboard quick actions and sidebar updated to point to real routes.

### Ticket Sales Flow — Ingressos (commit feat/ingressos-checkout-pix)
Full ticket purchase flow implemented without breaking the existing `/ingressos` layout:

**Frontend:**
- `client/src/pages/ingressos.tsx` — enhanced with cart + stepper (button replaced in-place, card height preserved), sticky cart bottom bar with total + checkout CTA, analytics tracking
- `client/src/pages/ingressos-checkout.tsx` — 2-step checkout page: customer form (name/email/CPF/phone with validation) → Pix payment (QR code, copy-paste field, 30-min countdown, TanStack Query polling every 3s, status banners for PENDING/APPROVED/EXPIRED/FAILED), auto-redirect to success on payment confirmation
- `client/src/pages/ingressos-sucesso.tsx` — confirmation page with order summary, download ticket button (TXT comprovante), WhatsApp support button, related hotels cross-sell strip
- `client/src/lib/cart-store.ts` — localStorage-backed cart with addToCart/removeFromCart/updateQty/getCartTotal/getCartItemQty
- `client/src/lib/analytics.ts` — trackEvent() for RSV360 analytics events (localStorage buffer, 200 events max)

**Backend:**
- `server/services/ticket-payment.service.ts` — createTicketPix (no split, full amount to Reservei), checkTicketPaymentStatus, demo mode with mock QR
- `server/routes.ts` — 4 new routes: POST /api/payments/tickets/create, GET /api/payments/tickets/:id/status, GET /api/payments/tickets/:id, POST /api/webhooks/tickets

**App.tsx routes added:** `/ingressos/checkout`, `/ingressos/sucesso`

**Key rules:**
- Pix de ingresso ≠ Pix de excursão (sem split para ingressos)
- Card não muda altura ao mostrar stepper
- Layout do /ingressos preservado integralmente (hero, grid, combo IA, social proof, badges)

### Infraestrutura de Carrinho + Componentes (Task #11)

**cart-store.ts atualizado:**
- `addToCart(item, qty?)`: aceita quantidade opcional (default 1)
- `addManyToCart(items)`: soma quantidades para itens existentes ou insere novos

**Novos arquivos:**
- `client/src/hooks/useTicketsCart.ts` — hook com StorageEvent para multi-aba, expõe `cart`, `total`, `addTicket`, `addManyToCart`, `updateTicketQty`, `removeTicket`
- `client/src/components/CartStickyBar.tsx` — barra sticky (bottom:0, z-index:200), testids: `bar-cart-summary`, `button-go-checkout`
- `client/src/components/QuickDecisionSection.tsx` — 4 atalhos de filtro (custo/família/popular/combo), testids: `quick-custo`, `quick-familia`, `quick-popular`, `quick-combo`
- `client/src/components/MiniWizard.tsx` — modal 3 passos guiados com scoring de tickets e opção de combo 15% OFF
- `client/src/components/TicketsGrid.tsx` — grid componentizado com stepper (`minHeight:44`), badges, AlsoBoughtMini com quick-add

### Documentação Técnica
- `docs/Estrutura-completa-pagina-ingressos.md` — documento técnico completo da página `/ingressos` (fluxo, arquivos, catálogo de 5 parques, filtros, estado React, paleta de cores, animações, funções auxiliares, cart-store, 19 eventos analytics, 4 rotas backend, serviço createTicketPix, todos os data-testids, regras de preservação)