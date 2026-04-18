/**
 * RSV360 Layout Tokens
 *
 * Defines container max-widths, sidebar widths and responsive gutter
 * for each page-layout family. These correspond to the CSS custom
 * properties --page-width-* and the DESIGN_SYSTEM.md contracts.
 *
 * Layout Families
 * ───────────────
 * A — Public   : marketing pages (landing, home, FAQs)
 * B — Catalog  : search/catalog pages (ingressos, excursões, hotéis)
 * C — Auth     : login, cadastro, recuperação de senha
 * D — App      : mobile-first authenticated pages (perfil, reservas)
 * E — Admin    : back-office dashboard (/admin/*)
 */

export const pageWidths = {
  public:  "1280px",
  catalog: "1280px",
  admin:   "1440px",
  app:     "480px",
  auth:    "440px",
} as const;

export const sidebarWidths = {
  catalogDesktop: 280,
  adminDesktop:   256,
  adminCollapsed:  64,
} as const;

export const gutters = {
  mobile:  "16px",
  tablet:  "24px",
  desktop: "32px",
  clamp:   "clamp(16px, 4vw, 32px)",
} as const;

export const breakpoints = {
  sm:   "640px",
  md:   "768px",
  lg:  "1024px",
  xl:  "1280px",
  "2xl": "1536px",
} as const;

export type LayoutFamily = keyof typeof pageWidths;
