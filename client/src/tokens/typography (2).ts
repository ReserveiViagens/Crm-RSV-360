/**
 * RSV360 Typography Tokens
 *
 * Maps to the --rsv-text-* CSS custom properties and the heading scale
 * documented in DESIGN_SYSTEM.md. Use these in inline styles or as
 * reference when writing Tailwind class names.
 */

export const fontSizes = {
  xs:   "0.75rem",   /* 12px */
  sm:   "0.875rem",  /* 14px */
  base: "1rem",      /* 16px */
  lg:   "1.125rem",  /* 18px */
  xl:   "1.25rem",   /* 20px */
  "2xl": "1.5rem",   /* 24px */
  "3xl": "1.875rem", /* 30px */
  "4xl": "2.25rem",  /* 36px */
  "5xl": "3rem",     /* 48px */
} as const;

export const fontWeights = {
  regular:   400,
  medium:    500,
  semibold:  600,
  bold:      700,
  extrabold: 800,
  black:     900,
} as const;

export const lineHeights = {
  tight:    1.15,
  snug:     1.3,
  normal:   1.5,
  relaxed:  1.65,
  loose:    2,
} as const;

export const letterSpacings = {
  tight:  "-0.025em",
  normal: "0em",
  wide:   "0.025em",
  wider:  "0.05em",
  widest: "0.1em",
} as const;

/**
 * Heading presets matching the DESIGN_SYSTEM.md typography scale.
 * Each preset is ready to spread into an inline `style` prop.
 */
export const headings = {
  h1: { fontSize: fontSizes["4xl"],  fontWeight: fontWeights.bold,     lineHeight: 1.2 },
  h2: { fontSize: fontSizes["2xl"],  fontWeight: fontWeights.bold,     lineHeight: 1.3 },
  h3: { fontSize: fontSizes.xl,      fontWeight: fontWeights.semibold,  lineHeight: 1.4 },
  h4: { fontSize: "1.0625rem",       fontWeight: fontWeights.semibold,  lineHeight: 1.4 },
  h5: { fontSize: fontSizes.sm,      fontWeight: fontWeights.semibold,  lineHeight: 1.5 },
} as const;

export const body = {
  large:  { fontSize: fontSizes.lg,   lineHeight: lineHeights.relaxed },
  base:   { fontSize: fontSizes.base, lineHeight: lineHeights.normal  },
  small:  { fontSize: fontSizes.sm,   lineHeight: lineHeights.normal  },
  xsmall: { fontSize: fontSizes.xs,   lineHeight: lineHeights.normal  },
} as const;
