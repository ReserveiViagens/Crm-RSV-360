import { type ReactNode, type CSSProperties } from "react";

/**
 * PageContainer — centralised width-constraint wrapper.
 *
 * Applies the correct `--page-width-*` CSS variable for each layout family,
 * centres the content, and adds responsive horizontal padding.
 *
 * @example
 * <PageContainer family="public">
 *   <Hero />
 *   <Cards />
 * </PageContainer>
 */

export type LayoutFamily = "public" | "catalog" | "admin" | "app" | "auth" | "full";

const familyToVar: Record<LayoutFamily, string> = {
  public:  "var(--page-width-public)",
  catalog: "var(--page-width-catalog)",
  admin:   "var(--page-width-admin)",
  app:     "var(--page-width-app)",
  auth:    "var(--page-width-auth)",
  full:    "100%",
};

export interface PageContainerProps {
  /** Layout family — controls the max-width token applied */
  family?: LayoutFamily;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Override the rendered HTML tag (default: "div") */
  as?: keyof JSX.IntrinsicElements;
}

export function PageContainer({
  family = "public",
  children,
  className = "",
  style,
  as: Tag = "div",
}: PageContainerProps) {
  return (
    <Tag
      className={className}
      style={{
        maxWidth: familyToVar[family],
        margin: "0 auto",
        width: "100%",
        paddingLeft: "clamp(16px, 4vw, 32px)",
        paddingRight: "clamp(16px, 4vw, 32px)",
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}
