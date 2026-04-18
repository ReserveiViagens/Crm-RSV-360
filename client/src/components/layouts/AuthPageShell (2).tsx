import { type ReactNode } from "react";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

/**
 * AuthPageShell — Família C
 *
 * Shell for authentication pages:
 * login, cadastro, recuperação de senha, verificação.
 *
 * Provides:
 * - Vertically centred single-column layout
 * - Optional title, subtitle and back link
 * - Content width constrained to --page-width-auth (440px)
 *
 * @example
 * <AuthPageShell
 *   title="Entrar na sua conta"
 *   subtitle="Bem-vindo de volta ao Reservei360"
 *   backHref="/"
 * >
 *   <LoginForm />
 * </AuthPageShell>
 */

export interface AuthPageShellProps {
  children: ReactNode;
  /** Page heading displayed above the form card */
  title?: string;
  /** Subtitle / descriptor below the title */
  subtitle?: string;
  /** If set, renders a back-navigation link at the top */
  backHref?: string;
  /** Label for the back link (default: "Voltar") */
  backLabel?: string;
  background?: string;
  className?: string;
}

export function AuthPageShell({
  children,
  title,
  subtitle,
  backHref,
  backLabel = "Voltar",
  background,
  className = "",
}: AuthPageShellProps) {
  const bgStyle = background
    ? { background }
    : {
        background:
          "linear-gradient(160deg, #EFF6FF 0%, #F9FAFB 50%, #FFF7ED 100%)",
      };

  return (
    <div
      className={className}
      style={{
        minHeight: "100vh",
        ...bgStyle,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(16px, 4vw, 40px) clamp(16px, 4vw, 24px)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "var(--page-width-auth)",
        }}
      >
        {backHref && (
          <Link
            href={backHref}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              color: "#6B7280",
              fontSize: 14,
              fontWeight: 500,
              textDecoration: "none",
              marginBottom: 24,
            }}
          >
            <ArrowLeft style={{ width: 16, height: 16 }} />
            {backLabel}
          </Link>
        )}

        {(title || subtitle) && (
          <div style={{ marginBottom: 24 }}>
            {title && (
              <h1
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  color: "#111827",
                  margin: "0 0 6px",
                }}
              >
                {title}
              </h1>
            )}
            {subtitle && (
              <p style={{ fontSize: 14, color: "#6B7280", margin: 0 }}>
                {subtitle}
              </p>
            )}
          </div>
        )}

        {children}
      </div>
    </div>
  );
}
