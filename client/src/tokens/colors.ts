/**
 * RSV360 Color Tokens
 *
 * These map to the CSS custom properties defined in index.css under the
 * RSV360 Design System v1.0 section. Use these constants instead of
 * hardcoded hex values to keep the codebase consistent.
 */

export const colors = {
  brand: {
    deepBlue: "#1E3A8A",
    actionBlue: "#2563EB",
    actionBlueDark: "#1D4ED8",
    actionBlueDeep: "#1E40AF",
    heroGradientStart: "#0F2744",
    heroGradientMid: "#1E3A5F",
    heroGradientEnd: "#1D4ED8",
    orange: "#F57C00",
    orangeDark: "#EA580C",
    orangeAccent: "#FBBF24",
  },

  semantic: {
    success: "#22C55E",
    successDark: "#16A34A",
    successBg: "#F0FDF4",
    warning: "#F59E0B",
    warningBg: "#FFFBEB",
    error: "#EF4444",
    errorBg: "#FEF2F2",
    info: "#3B82F6",
    infoBg: "#EFF6FF",
  },

  surface: {
    page: "#F8FAFC",
    card: "#FFFFFF",
    subtle: "#F1F5F9",
    sidebar: "#FFFFFF",
    overlay: "rgba(0,0,0,0.5)",
  },

  border: {
    subtle: "#E2E8F0",
    default: "#CBD5E1",
    strong: "#94A3B8",
  },

  text: {
    primary: "#111827",
    secondary: "#374151",
    muted: "#6B7280",
    faint: "#9CA3AF",
    onDark: "#FFFFFF",
    onDarkMuted: "rgba(255,255,255,0.80)",
    onDarkFaint: "rgba(255,255,255,0.60)",
  },

  neutral: {
    50: "#F8FAFC",
    100: "#F1F5F9",
    200: "#E2E8F0",
    300: "#CBD5E1",
    400: "#94A3B8",
    500: "#64748B",
    600: "#475569",
    700: "#334155",
    800: "#1E293B",
    900: "#0F172A",
  },
} as const;

export type BrandColor = keyof typeof colors.brand;
export type SemanticColor = keyof typeof colors.semantic;
