import { type ReactNode } from "react";

/**
 * CatalogPageShell — Família B
 *
 * Shell for catalog/search pages:
 * ingressos, excursões, hotéis, busca results.
 *
 * Provides:
 * - Full-viewport background
 * - Named slots: header, searchBar (full-bleed), sidebar, mobileDrawer, footer
 * - On desktop (≥1024px) sidebar is displayed alongside content
 * - On mobile: sidebar is hidden; pass a `mobileDrawer` slot (Sheet/Drawer
 *   component) for the mobile filter drawer. The shell renders it adjacent
 *   to content so it can be triggered from within children.
 *
 * @example
 * const [drawerOpen, setDrawerOpen] = useState(false);
 *
 * <CatalogPageShell
 *   header={<HomeHeader />}
 *   searchBar={<SearchAndFiltersBar />}
 *   sidebar={<IngressosSidebar />}
 *   mobileDrawer={
 *     <FilterDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
 *   }
 *   footer={<HomeFooter />}
 * >
 *   <ProductGrid />
 * </CatalogPageShell>
 */

export interface CatalogPageShellProps {
  children: ReactNode;
  /** Top navigation header */
  header?: ReactNode;
  /** Full-bleed search / filter bar rendered between header and content */
  searchBar?: ReactNode;
  /** Left sidebar — visible on desktop (≥1024px), hidden on mobile */
  sidebar?: ReactNode;
  /** Sidebar width in pixels when visible (default: 280) */
  sidebarWidth?: number;
  /**
   * Mobile-only drawer/sheet component for filters.
   * Rendered inside the shell but outside the layout grid.
   * Open/close state is managed by the parent page.
   */
  mobileDrawer?: ReactNode;
  /** Footer rendered below the catalog content */
  footer?: ReactNode;
  background?: string;
  className?: string;
}

export function CatalogPageShell({
  children,
  header,
  searchBar,
  sidebar,
  sidebarWidth = 280,
  mobileDrawer,
  footer,
  background = "var(--surface-page)",
  className = "",
}: CatalogPageShellProps) {
  return (
    <div
      className={className}
      style={{
        minHeight: "100vh",
        background,
        display: "flex",
        flexDirection: "column",
        width: "100%",
      }}
    >
      {header && <div style={{ flexShrink: 0 }}>{header}</div>}
      {searchBar && (
        <div style={{ flexShrink: 0, width: "100%" }}>{searchBar}</div>
      )}

      <div
        style={{
          flex: 1,
          maxWidth: "var(--page-width-catalog)",
          margin: "0 auto",
          width: "100%",
          paddingLeft: "clamp(16px, 4vw, 32px)",
          paddingRight: "clamp(16px, 4vw, 32px)",
          display: "flex",
          gap: 24,
          alignItems: "flex-start",
        }}
      >
        {sidebar && (
          <aside
            className="rsv-catalog-sidebar"
            style={{
              width: sidebarWidth,
              flexShrink: 0,
              display: "none",
            }}
          >
            {sidebar}
          </aside>
        )}

        <div style={{ flex: 1, minWidth: 0 }}>
          {children}
        </div>
      </div>

      {mobileDrawer && (
        <div className="rsv-catalog-mobile-drawer">
          {mobileDrawer}
        </div>
      )}

      {footer && <div style={{ flexShrink: 0 }}>{footer}</div>}

      <style>{`
        .rsv-catalog-desktop-only { display: none !important; }
        @media (min-width: 1024px) {
          .rsv-catalog-sidebar { display: block !important; }
          .rsv-catalog-mobile-drawer { display: none !important; }
          .rsv-catalog-mobile-only { display: none !important; }
          .rsv-catalog-desktop-only { display: block !important; }
        }
      `}</style>
    </div>
  );
}
