import * as React from "react";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  Clock,
} from "lucide-react";

export type RsvStatusVariant = "success" | "warning" | "error" | "info" | "pending";

export interface RsvStatusBadgeProps {
  variant: RsvStatusVariant;
  label: string;
  icon?: React.ReactNode;
  size?: "sm" | "md";
  className?: string;
  "data-testid"?: string;
}

const variantConfig: Record<
  RsvStatusVariant,
  { bg: string; text: string; border: string; defaultIcon: React.ReactNode }
> = {
  success: {
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
    defaultIcon: <CheckCircle2 className="w-3.5 h-3.5" />,
  },
  warning: {
    bg: "bg-orange-50",
    text: "text-orange-700",
    border: "border-orange-200",
    defaultIcon: <AlertTriangle className="w-3.5 h-3.5" />,
  },
  error: {
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
    defaultIcon: <XCircle className="w-3.5 h-3.5" />,
  },
  info: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    defaultIcon: <Info className="w-3.5 h-3.5" />,
  },
  pending: {
    bg: "bg-muted/60",
    text: "text-muted-foreground",
    border: "border-border",
    defaultIcon: <Clock className="w-3.5 h-3.5" />,
  },
};

export function RsvStatusBadge({
  variant,
  label,
  icon,
  size = "md",
  className,
  "data-testid": testId = "rsv-status-badge",
}: RsvStatusBadgeProps) {
  const cfg = variantConfig[variant];

  return (
    <span
      data-testid={testId}
      data-variant={variant}
      className={cn(
        "inline-flex items-center gap-1 rounded-control border font-semibold whitespace-nowrap",
        cfg.bg,
        cfg.text,
        cfg.border,
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs",
        className
      )}
    >
      <span data-testid={`${testId}-icon`} className="shrink-0">
        {icon ?? cfg.defaultIcon}
      </span>
      <span data-testid={`${testId}-label`}>{label}</span>
    </span>
  );
}
