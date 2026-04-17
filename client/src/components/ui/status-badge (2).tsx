import { cn } from "@/lib/utils"
import type { OrderStatus } from "@shared/schema"

export type { OrderStatus }

type SemanticStatus = "success" | "warning" | "error" | "info" | "neutral" | "premium"
type StatusBadgeStatus = SemanticStatus | OrderStatus

const statusConfig: Record<StatusBadgeStatus, { bg: string; text: string; dot: string }> = {
  success: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  warning: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  error: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
  info: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  neutral: { bg: "bg-slate-100", text: "text-slate-600", dot: "bg-slate-400" },
  premium: { bg: "bg-violet-50", text: "text-violet-700", dot: "bg-violet-500" },
  PAID: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  APPROVED: { bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500" },
  PENDING: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-400" },
  CANCELLED: { bg: "bg-slate-100", text: "text-slate-600", dot: "bg-slate-400" },
  EXPIRED: { bg: "bg-orange-50", text: "text-orange-700", dot: "bg-orange-400" },
  FAILED: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
}

export interface StatusBadgeProps {
  status: StatusBadgeStatus
  label: string
  showDot?: boolean
  className?: string
  "data-testid": string
}

export function StatusBadge({
  status,
  label,
  showDot = true,
  className,
  "data-testid": testId,
}: StatusBadgeProps) {
  const cfg = statusConfig[status] ?? statusConfig.neutral
  return (
    <span
      data-testid={testId}
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold",
        cfg.bg,
        cfg.text,
        className,
      )}
    >
      {showDot && <span className={cn("w-1.5 h-1.5 rounded-full", cfg.dot)} />}
      {label}
    </span>
  )
}
