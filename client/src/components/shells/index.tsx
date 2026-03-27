import { type ReactNode } from "react"

/* ============================================================
   RSV360 Design System — Layout Shells v1.0
   5 Famílias: Public | Catalog | Auth | ClientApp | Admin
   ============================================================ */

/* ─── Família A: Public / Marketing ─────────────────────────
   Usada em: landing, home, promoções, contato, quem somos
   Container interno: max-w-[1280px]
   ─────────────────────────────────────────────────────────── */
interface PublicPageShellProps {
  children: ReactNode
  className?: string
}

export function PublicPageShell({ children, className = "" }: PublicPageShellProps) {
  return (
    <div className={`rsv-public-shell min-h-screen bg-white text-gray-900 overflow-x-hidden ${className}`}>
      {children}
    </div>
  )
}

export function PublicContainer({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  )
}

export function PublicSection({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section className={`py-12 sm:py-16 lg:py-20 ${className}`}>
      <PublicContainer>{children}</PublicContainer>
    </section>
  )
}

/* ─── Família B: Catalog / Search / Commerce ─────────────────
   Usada em: ingressos, hotéis, atrações, excursões, catálogo
   Container interno: max-w-[1280px]
   Sidebar desktop / Drawer mobile
   ─────────────────────────────────────────────────────────── */
interface CatalogPageShellProps {
  children: ReactNode
  className?: string
}

export function CatalogPageShell({ children, className = "" }: CatalogPageShellProps) {
  return (
    <div className={`rsv-catalog-shell min-h-screen bg-slate-50 text-gray-900 overflow-x-hidden ${className}`}>
      {children}
    </div>
  )
}

export function CatalogContainer({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  )
}

interface CatalogLayoutProps {
  sidebar?: ReactNode
  children: ReactNode
  className?: string
}

export function CatalogLayout({ sidebar, children, className = "" }: CatalogLayoutProps) {
  return (
    <CatalogContainer className={`py-6 ${className}`}>
      <div className="flex gap-6">
        {sidebar && (
          <aside className="hidden lg:block w-[260px] flex-shrink-0">
            <div className="sticky top-4 space-y-4">
              {sidebar}
            </div>
          </aside>
        )}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </CatalogContainer>
  )
}

/* ─── Família C: Auth ────────────────────────────────────────
   Usada em: login, cadastro, esqueci senha, redefinir senha
   Largura controlada: max-w-[440px]
   Layout centralizado
   ─────────────────────────────────────────────────────────── */
interface AuthPageShellProps {
  children: ReactNode
  className?: string
}

export function AuthPageShell({ children, className = "" }: AuthPageShellProps) {
  return (
    <div
      className={`rsv-auth-shell min-h-screen flex items-center justify-center px-4 py-12 ${className}`}
      style={{
        background: "linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)",
      }}
    >
      <div className="w-full max-w-[440px]">
        {children}
      </div>
    </div>
  )
}

/* ─── Família D: Client App / Mobile-first ──────────────────
   Usada em: perfil, minhas-reservas, notificações, fidelidade
   Largura máxima: max-w-[480px] | centralizado no desktop
   ─────────────────────────────────────────────────────────── */
interface AppMobileShellProps {
  children: ReactNode
  bottomNav?: ReactNode
  header?: ReactNode
  className?: string
}

export function AppMobileShell({ children, bottomNav, header, className = "" }: AppMobileShellProps) {
  return (
    <div
      className={`rsv-app-shell min-h-screen bg-slate-50 ${className}`}
      style={{ paddingBottom: bottomNav ? "72px" : "0" }}
    >
      <div className="mx-auto max-w-[480px] lg:max-w-[520px] w-full">
        {header && (
          <div className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm">
            {header}
          </div>
        )}
        <div className="flex-1">
          {children}
        </div>
      </div>
      {bottomNav && (
        <div
          className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 safe-area-inset-bottom"
          style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
        >
          {bottomNav}
        </div>
      )}
    </div>
  )
}

/* ─── Família E: Admin / Dashboard ──────────────────────────
   Usada em: admin dashboard, CRM, financeiro, WaaS, FNRH
   Shell com sidebar + topbar
   Conteúdo: max-w-[1440px]
   ─────────────────────────────────────────────────────────── */
interface AdminShellProps {
  children: ReactNode
  sidebar?: ReactNode
  topbar?: ReactNode
  sidebarCollapsed?: boolean
  className?: string
}

export function AdminShell({
  children,
  sidebar,
  topbar,
  sidebarCollapsed = false,
  className = "",
}: AdminShellProps) {
  const sidebarWidth = sidebarCollapsed ? "64px" : "240px"

  return (
    <div className={`rsv-admin-shell min-h-screen bg-slate-50 flex ${className}`}>
      {sidebar && (
        <aside
          className="hidden lg:flex flex-col fixed top-0 left-0 h-full z-30 bg-white border-r border-slate-200 transition-all duration-200 overflow-hidden"
          style={{ width: sidebarWidth }}
        >
          {sidebar}
        </aside>
      )}
      <div
        className="flex flex-col flex-1 min-h-screen transition-all duration-200"
        style={{ marginLeft: "0" }}
      >
        {topbar && (
          <header className="sticky top-0 z-20 bg-white border-b border-slate-200 h-14 flex items-center shadow-sm">
            {topbar}
          </header>
        )}
        <main className="flex-1 overflow-auto">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export function AdminContainer({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  )
}

/* ─── Componentes de Seção Universal ────────────────────────
   Reutilizáveis em qualquer família
   ─────────────────────────────────────────────────────────── */
interface PageHeaderProps {
  title: string
  subtitle?: string
  actions?: ReactNode
  badge?: ReactNode
  className?: string
}

export function PageHeader({ title, subtitle, actions, badge, className = "" }: PageHeaderProps) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 ${className}`}>
      <div>
        {badge && <div className="mb-2">{badge}</div>}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-3 flex-shrink-0">{actions}</div>}
    </div>
  )
}

interface SectionHeaderProps {
  title: string
  subtitle?: string
  action?: ReactNode
  className?: string
}

export function SectionHeader({ title, subtitle, action, className = "" }: SectionHeaderProps) {
  return (
    <div className={`flex items-center justify-between mb-4 ${className}`}>
      <div>
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}

/* ─── Cards Padronizados ─────────────────────────────────── */
interface MetricCardProps {
  label: string
  value: string | number
  sub?: string
  icon?: ReactNode
  trend?: { value: number; positive: boolean }
  className?: string
}

export function MetricCard({ label, value, sub, icon, trend, className = "" }: MetricCardProps) {
  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow ${className}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
          {sub && <p className="mt-0.5 text-xs text-slate-400">{sub}</p>}
          {trend && (
            <p
              className={`mt-1 text-xs font-medium ${
                trend.positive ? "text-emerald-600" : "text-red-500"
              }`}
            >
              {trend.positive ? "▲" : "▼"} {Math.abs(trend.value)}%
            </p>
          )}
        </div>
        {icon && (
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}

interface DataCardProps {
  children: ReactNode
  title?: string
  action?: ReactNode
  className?: string
  noPadding?: boolean
}

export function DataCard({ children, title, action, className = "", noPadding = false }: DataCardProps) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-200 shadow-sm ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          {title && <h3 className="text-sm font-semibold text-slate-900">{title}</h3>}
          {action && <div>{action}</div>}
        </div>
      )}
      <div className={noPadding ? "" : "p-5"}>{children}</div>
    </div>
  )
}

/* ─── Status Badge ───────────────────────────────────────── */
type StatusType =
  | "success"
  | "warning"
  | "error"
  | "info"
  | "neutral"
  | "premium"
  | "PAID"
  | "APPROVED"
  | "PENDING"
  | "CANCELLED"
  | "EXPIRED"
  | "FAILED"

const statusConfig: Record<StatusType, { bg: string; text: string; dot: string }> = {
  success: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  warning: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  error: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
  info: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  neutral: { bg: "bg-slate-100", text: "text-slate-600", dot: "bg-slate-400" },
  premium: { bg: "bg-violet-50", text: "text-violet-700", dot: "bg-violet-500" },
  PAID: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  APPROVED: { bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500" },
  PENDING: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-400" },
  CANCELLED: { bg: "bg-slate-100", text: "text-slate-600", dot: "bg-slate-400" },
  EXPIRED: { bg: "bg-orange-50", text: "text-orange-700", dot: "bg-orange-400" },
  FAILED: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
}

interface StatusBadgeProps {
  status: StatusType
  label: string
  showDot?: boolean
  className?: string
}

export function StatusBadge({ status, label, showDot = true, className = "" }: StatusBadgeProps) {
  const cfg = statusConfig[status] ?? statusConfig.neutral
  return (
    <span
      data-testid={`status-badge-${status}`}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text} ${className}`}
    >
      {showDot && <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />}
      {label}
    </span>
  )
}

/* ─── Empty State ────────────────────────────────────────── */
interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export function EmptyState({ icon, title, description, action, className = "" }: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`}>
      {icon && (
        <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4 text-slate-400">
          {icon}
        </div>
      )}
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      {description && <p className="mt-1.5 text-sm text-slate-500 max-w-sm">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

/* ─── Loading Skeleton ───────────────────────────────────── */
interface LoadingSkeletonProps {
  rows?: number
  variant?: "default" | "card"
  className?: string
}

export function LoadingSkeleton({ rows = 3, variant = "default", className = "" }: LoadingSkeletonProps) {
  if (variant === "card") {
    return (
      <div
        className={`grid gap-4 ${className}`}
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}
      >
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="animate-pulse bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
            <div className="h-48 bg-slate-200" />
            <div className="p-4 space-y-3">
              <div className="h-5 bg-slate-200 rounded-lg w-3/4" />
              <div className="h-3 bg-slate-100 rounded-lg w-full" />
              <div className="h-3 bg-slate-100 rounded-lg w-5/6" />
              <div className="flex gap-2 mt-2">
                <div className="h-6 bg-slate-100 rounded-md w-16" />
                <div className="h-6 bg-slate-100 rounded-md w-16" />
              </div>
              <div className="h-10 bg-slate-200 rounded-xl mt-4" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="animate-pulse space-y-2">
          <div className="h-4 bg-slate-200 rounded-lg" style={{ width: `${70 + (i % 3) * 10}%` }} />
          {i === 0 && <div className="h-3 bg-slate-100 rounded-lg w-1/2" />}
        </div>
      ))}
    </div>
  )
}

/* ─── Search Bar ─────────────────────────────────────────── */
interface SearchBarProps {
  placeholder?: string
  value?: string
  onChange?: (v: string) => void
  icon?: ReactNode
  className?: string
}

export function SearchBar({ placeholder = "Buscar...", value, onChange, icon, className = "" }: SearchBarProps) {
  return (
    <div className={`relative ${className}`}>
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
        {icon ? (
          <span className="text-slate-400 w-4 h-4">{icon}</span>
        ) : (
          <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        )}
      </div>
      <input
        type="search"
        className="block w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </div>
  )
}

/* ─── Filter Chips ───────────────────────────────────────── */
interface FilterChipsProps {
  options: { label: string; value: string }[]
  active?: string
  onChange?: (v: string) => void
  className?: string
}

export function FilterChips({ options, active, onChange, className = "" }: FilterChipsProps) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange?.(opt.value)}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
            active === opt.value
              ? "bg-blue-600 text-white border-blue-600 shadow-sm"
              : "bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
