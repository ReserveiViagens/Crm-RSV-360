import { type ReactNode } from "react";

/**
 * AdminShell — Família E
 *
 * Shell for admin dashboard pages.
 *
 * Provides:
 * - Max-width of --page-width-admin (1440px) centred on the viewport
 * - Named slots: topbar (sticky top bar), sidebar (collapsible), main content
 * - Sidebar width is configurable; collapses to 0 when `sidebarOpen` is false
 * - Main content area scrolls independently of the sidebar
 * - Use `sidebarOpen` + `onSidebarToggle` for responsive drawer behaviour
 *
 * @example
 * const [open, setOpen] = useState(true);
 *
 * <AdminShell
 *   topbar={<AdminHeader onMenuToggle={() => setOpen(o => !o)} />}
 *   sidebar={<AdminNav />}
 *   sidebarOpen={open}
 *   onSidebarToggle={() => setOpen(o => !o)}
 * >
 *   <DashboardContent />
 * </AdminShell>
 */

export interface AdminShellProps {
  children: ReactNode;
  /** Sticky top bar / header rendered above the sidebar + content row */
  topbar?: ReactNode;
  /** Left sidebar navigation */
  sidebar?: ReactNode;
  /** Controls sidebar visibility (default: true) */
  sidebarOpen?: boolean;
  /**
   * Callback to toggle the sidebar open/closed state.
   * The shell is intentionally stateless — the parent page owns `sidebarOpen`.
   * Pass the same callback to both the `topbar` component (for the hamburger
   * button) and here (for keyboard/shortcut wiring if needed in the future).
   */
  onSidebarToggle?: () => void;
  /** Sidebar width in pixels when open (default: 256) */
  sidebarWidth?: number;
  background?: string;
  className?: string;
}

export function AdminShell({
  children,
  topbar,
  sidebar,
  sidebarOpen = true,
  onSidebarToggle,
  sidebarWidth = 256,
  background = "var(--surface-page)",
  className = "",
}: AdminShellProps) {
  return (
    <div
      className={className}
      style={{
        minHeight: "100vh",
        background,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {topbar && (
        <div
          style={{
            flexShrink: 0,
            position: "sticky",
            top: 0,
            zIndex: 40,
          }}
        >
          {topbar}
        </div>
      )}

      <div
        style={{
          flex: 1,
          display: "flex",
          minHeight: 0,
          maxWidth: "var(--page-width-admin)",
          margin: "0 auto",
          width: "100%",
        }}
      >
        {sidebar && (
          <aside
            style={{
              width: sidebarOpen ? sidebarWidth : 0,
              flexShrink: 0,
              overflow: "hidden",
              transition: "width 0.2s ease",
              background: "var(--surface-sidebar)",
              borderRight: sidebarOpen ? "1px solid var(--rsv-border-subtle, #E2E8F0)" : "none",
              overflowY: sidebarOpen ? "auto" : "hidden",
            }}
          >
            {sidebar}
          </aside>
        )}

        <main
          style={{
            flex: 1,
            minWidth: 0,
            overflowX: "hidden",
            overflowY: "auto",
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
