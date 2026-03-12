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
- **Excursão em Grupo** (`/viagens-grupo`): 5-tab primary navigation (Início, Roteiro, Planejar, Votar, Chat). Tab content mapping: Início = QR/invite + Resumo de Custos + Economize em Grupo; Roteiro = official itinerary cards + Timeline do Planejamento; Planejar = wizard + AI planner + hotel selector + suggestion submission + admin moderation; Votar = hotel voting + roteiro voting; Chat = inline group chat with toggleable AI assistant panel (two-column desktop, stacked mobile). Sticky tab bar with underline indicator. Tab bar uses `data-testid="primary-tab-{0-4}"`

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
- `server/services/whatsapp.service.ts` — createExcursionGroup, sendTextToGroup, sendPollToGroup, sendPaymentConfirmation, humanDelay() anti-ban
- `client/src/pages/admin/waas-dashboard.tsx` — groups table, create group modal, intervene, send poll
- API: POST /api/waas/criar-grupo, POST /api/waas/:id/mensagem, POST /api/waas/:id/enquete
- **Demo mode**: works without env vars, returns mock responses

### T003 — Split Pix Payment
- `server/services/payment.service.ts` — createSplitPaymentPix (demo mode if no gateway env vars)
- `client/src/components/checkout/PaymentCheckout.tsx` — QR code, pix copy-paste, 30min countdown, split breakdown
- API: POST /api/pagamento/gerar-pix, POST /api/webhook/payment (webhook)
- Webhook fires sendPaymentConfirmation + emitEstadoGrupo WebSocket event

### T004 — Gamificação do Organizador
- Route: `/organizer/metas`
- `client/src/pages/organizer/gamification-dashboard.tsx` — goal cards, progress bars, "Resgatar" button
- API: GET /api/organizador/:userId/metas, PATCH /api/organizador/metas/:id/resgatar
- OrganizerGoal status: LOCKED | UNLOCKED | CLAIMED

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

### Admin Dashboard NTX Section
Sidebar in `admin-dashboard.tsx` has "🚀 NTX — Next Gen" section with links to all new modules.