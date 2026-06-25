/** URL relativa no S1 que inicia handoff SSO → Marketing Lab (:3000). */
export function getMarketingLabHandoffUrl(returnPath = "/lab"): string {
  const safeReturn = returnPath.startsWith("/") ? returnPath : "/lab";
  return `/api/auth/lab-handoff?return=${encodeURIComponent(safeReturn)}`;
}

export const MARKETING_LAB_PUBLIC_URL =
  import.meta.env.VITE_MARKETING_LAB_URL || "http://localhost:3000";
