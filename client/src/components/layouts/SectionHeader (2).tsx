import { type ReactNode } from "react";

/**
 * SectionHeader — Universal section-level heading component.
 *
 * Renders a section title, optional subtitle, and an optional right-side
 * action link or button. Use inside `SectionContainer` for consistent rhythm.
 *
 * @example
 * <SectionHeader
 *   title="Ingressos em destaque"
 *   subtitle="Os mais vendidos hoje"
 *   action={<Link href="/ingressos">Ver todos</Link>}
 * />
 */

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  /** Optional right-side action (link, button, etc.) */
  action?: ReactNode;
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  action,
  className = "",
}: SectionHeaderProps) {
  return (
    <div
      className={className}
      style={{
        display: "flex",
        alignItems: subtitle ? "flex-start" : "center",
        justifyContent: "space-between",
        gap: "0.75rem",
        marginBottom: "1rem",
        flexWrap: "wrap",
      }}
    >
      <div>
        <h2
          style={{
            fontSize: "1.125rem",
            fontWeight: 600,
            color: "var(--rsv-graphite, #111827)",
            lineHeight: 1.4,
            margin: 0,
          }}
        >
          {title}
        </h2>
        {subtitle && (
          <p
            style={{
              marginTop: "0.1875rem",
              fontSize: "0.875rem",
              color: "#6B7280",
              lineHeight: 1.5,
            }}
          >
            {subtitle}
          </p>
        )}
      </div>

      {action && (
        <div style={{ flexShrink: 0 }}>{action}</div>
      )}
    </div>
  );
}
