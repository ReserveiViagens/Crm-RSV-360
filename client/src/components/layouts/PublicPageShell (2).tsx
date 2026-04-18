import { type ReactNode } from "react";

/**
 * PublicPageShell — Família A
 *
 * Shell for public-facing marketing pages:
 * landing, home, FAQs, about, blog posts.
 *
 * Provides:
 * - Full-viewport background
 * - Named slots: header, heroSlot (full-bleed), footer
 * - `children` are automatically wrapped in a 1280px-constrained content
 *   container with responsive horizontal padding
 *
 * The heroSlot renders full-bleed (no width constraint) and is intended for
 * gradient/image hero banners. Children are always width-capped at 1280px.
 *
 * @example
 * <PublicPageShell
 *   header={<HomeHeader />}
 *   footer={<HomeFooter />}
 *   heroSlot={<HeroSection />}
 * >
 *   <SectionContainer size="lg"><FeaturedDeals /></SectionContainer>
 *   <SectionContainer size="md"><Testimonials /></SectionContainer>
 * </PublicPageShell>
 */

export interface PublicPageShellProps {
  children: ReactNode;
  /** Sticky/fixed top navigation header */
  header?: ReactNode;
  /** Full-bleed hero section rendered above children (no width constraint) */
  heroSlot?: ReactNode;
  /** Footer rendered below the width-constrained content area */
  footer?: ReactNode;
  background?: string;
  className?: string;
}

export function PublicPageShell({
  children,
  header,
  heroSlot,
  footer,
  background = "var(--surface-page)",
  className = "",
}: PublicPageShellProps) {
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

      {heroSlot && (
        <div style={{ flexShrink: 0, width: "100%" }}>{heroSlot}</div>
      )}

      <div
        style={{
          flex: 1,
          maxWidth: "var(--page-width-public)",
          margin: "0 auto",
          width: "100%",
          paddingLeft: "clamp(16px, 4vw, 32px)",
          paddingRight: "clamp(16px, 4vw, 32px)",
        }}
      >
        {children}
      </div>

      {footer && <div style={{ flexShrink: 0 }}>{footer}</div>}
    </div>
  );
}
