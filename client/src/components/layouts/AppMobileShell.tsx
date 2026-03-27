import { type ReactNode } from "react";

/**
 * AppMobileShell — Família D
 *
 * Shell for authenticated mobile-first app pages:
 * perfil, minhas-reservas, pagamentos, minha-jornada, notificações.
 *
 * Provides:
 * - App-width cap via --page-width-app (480px) centred on the viewport
 * - Optional top header slot
 * - Optional fixed bottom navigation bar slot with safe-area inset support
 * - Content area scrolls independently; bottom nav stays pinned
 * - `padding-bottom` on content area automatically accounts for bottom nav
 *   height + `env(safe-area-inset-bottom)` so content is never obscured
 *   on notched devices (iOS, Android with gesture nav)
 *
 * @example
 * <AppMobileShell
 *   header={<AppTopBar title="Perfil" />}
 *   bottomNav={<BottomTabBar />}
 * >
 *   <ProfileContent />
 * </AppMobileShell>
 */

export interface AppMobileShellProps {
  children: ReactNode;
  /** Optional top app bar / header */
  header?: ReactNode;
  /** Optional fixed bottom navigation component */
  bottomNav?: ReactNode;
  /**
   * Base pixel height of the bottom nav (default: 60px).
   * `env(safe-area-inset-bottom)` is automatically added on top of this value,
   * so content is never hidden on notched/gesture-nav devices.
   */
  bottomNavHeight?: number;
  background?: string;
  className?: string;
}

export function AppMobileShell({
  children,
  header,
  bottomNav,
  bottomNavHeight = 60,
  background = "var(--surface-page)",
  className = "",
}: AppMobileShellProps) {
  return (
    <div
      className={className}
      style={{
        maxWidth: "var(--page-width-app)",
        margin: "0 auto",
        minHeight: "100dvh",
        background,
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {header && (
        <div style={{ flexShrink: 0 }}>{header}</div>
      )}

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          WebkitOverflowScrolling: "touch",
          paddingBottom: bottomNav
            ? `calc(${bottomNavHeight}px + env(safe-area-inset-bottom, 0px))`
            : 0,
        }}
      >
        {children}
      </div>

      {bottomNav && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "100%",
            maxWidth: "var(--page-width-app)",
            zIndex: 30,
            paddingBottom: "env(safe-area-inset-bottom, 0px)",
            background: "inherit",
          }}
        >
          {bottomNav}
        </div>
      )}
    </div>
  );
}
