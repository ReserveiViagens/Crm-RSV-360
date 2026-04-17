import { type ReactNode, type CSSProperties } from "react";

/**
 * SectionContainer — vertical rhythm wrapper.
 *
 * Applies consistent vertical padding between page sections using the
 * shared --section-gap-* CSS custom properties.
 *
 * @example
 * <SectionContainer size="md">
 *   <FeaturedCards />
 * </SectionContainer>
 *
 * // Asymmetric padding
 * <SectionContainer sizeTop="lg" sizeBottom="sm">
 *   <Footer />
 * </SectionContainer>
 */

export type SectionSize = "sm" | "md" | "lg" | "xl" | "none";

const sizeToVar: Record<SectionSize, string> = {
  none: "0px",
  sm:   "var(--section-gap-sm)",
  md:   "var(--section-gap-md)",
  lg:   "var(--section-gap-lg)",
  xl:   "var(--section-gap-xl)",
};

export interface SectionContainerProps {
  /** Symmetric top + bottom padding size (default: "md") */
  size?: SectionSize;
  /** Override top padding only */
  sizeTop?: SectionSize;
  /** Override bottom padding only */
  sizeBottom?: SectionSize;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Override the rendered HTML tag (default: "section") */
  as?: keyof JSX.IntrinsicElements;
}

export function SectionContainer({
  size = "md",
  sizeTop,
  sizeBottom,
  children,
  className = "",
  style,
  as: Tag = "section",
}: SectionContainerProps) {
  const pt = sizeToVar[sizeTop ?? size];
  const pb = sizeToVar[sizeBottom ?? size];

  return (
    <Tag
      className={className}
      style={{
        paddingTop: pt,
        paddingBottom: pb,
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}
