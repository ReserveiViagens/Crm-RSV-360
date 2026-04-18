import { type ReactNode } from "react";

/**
 * PageHeader — Universal page-level heading component.
 *
 * Renders a page title, optional subtitle, optional badge slot, and an
 * optional right-side actions area. Works across all layout families.
 *
 * @example
 * <PageHeader
 *   title="Ingressos"
 *   subtitle="Caldas Novas e Rio Quente"
 *   actions={<Button>Filtrar</Button>}
 * />
 */

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  /** Optional badge/tag rendered above the title */
  badge?: ReactNode;
  /** Optional right-side actions slot */
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  subtitle,
  badge,
  actions,
  className = "",
}: PageHeaderProps) {
  return (
    <div
      className={className}
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: "var(--section-gap-sm, 32px)",
        flexWrap: "wrap",
        marginBottom: "1.5rem",
      }}
    >
      <div>
        {badge && (
          <div style={{ marginBottom: "0.5rem" }}>{badge}</div>
        )}
        <h1
          style={{
            fontSize: "1.75rem",
            fontWeight: 700,
            color: "var(--rsv-graphite, #111827)",
            lineHeight: 1.25,
            margin: 0,
            letterSpacing: "-0.015em",
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            style={{
              marginTop: "0.375rem",
              fontSize: "0.9375rem",
              color: "#6B7280",
              lineHeight: 1.5,
            }}
          >
            {subtitle}
          </p>
        )}
      </div>

      {actions && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            flexShrink: 0,
          }}
        >
          {actions}
        </div>
      )}
    </div>
  );
}
