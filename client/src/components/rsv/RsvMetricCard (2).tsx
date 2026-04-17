import * as React from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export type RsvMetricTrend = "up" | "down" | "neutral";

export interface RsvMetricCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: RsvMetricTrend;
  trendValue?: string;
  trendLabel?: string;
  color?: "blue" | "green" | "orange" | "red" | "default";
  className?: string;
  "data-testid"?: string;
}

const colorMap: Record<string, { bg: string; icon: string; text: string }> = {
  blue: { bg: "bg-blue-50", icon: "text-blue-600", text: "text-blue-700" },
  green: { bg: "bg-green-50", icon: "text-green-600", text: "text-green-700" },
  orange: { bg: "bg-orange-50", icon: "text-orange-600", text: "text-orange-700" },
  red: { bg: "bg-red-50", icon: "text-red-600", text: "text-red-700" },
  default: { bg: "bg-muted/40", icon: "text-muted-foreground", text: "text-muted-foreground" },
};

const trendConfig: Record<RsvMetricTrend, { icon: React.ReactNode; color: string; label: string }> = {
  up: { icon: <TrendingUp className="w-3 h-3" />, color: "text-green-600", label: "alta" },
  down: { icon: <TrendingDown className="w-3 h-3" />, color: "text-red-600", label: "queda" },
  neutral: { icon: <Minus className="w-3 h-3" />, color: "text-muted-foreground", label: "estável" },
};

export function RsvMetricCard({
  label,
  value,
  icon,
  trend,
  trendValue,
  trendLabel,
  color = "default",
  className,
  "data-testid": testId = "rsv-metric-card",
}: RsvMetricCardProps) {
  const colors = colorMap[color] ?? colorMap.default;
  const trendCfg = trend ? trendConfig[trend] : null;

  return (
    <div
      data-testid={testId}
      className={cn(
        "rounded-card bg-[var(--surface-card)] shadow-card border border-border p-5 flex flex-col gap-3",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <p
          data-testid={`${testId}-label`}
          className="text-sm text-muted-foreground font-medium"
        >
          {label}
        </p>
        {icon && (
          <span
            data-testid={`${testId}-icon`}
            className={cn(
              "w-9 h-9 rounded-control flex items-center justify-center",
              colors.bg,
              colors.icon
            )}
          >
            {icon}
          </span>
        )}
      </div>

      <p
        data-testid={`${testId}-value`}
        className="text-heading-h1 text-foreground font-bold leading-none"
      >
        {value}
      </p>

      {trendCfg && (
        <div
          data-testid={`${testId}-trend`}
          className={cn("flex items-center gap-1 text-xs font-medium", trendCfg.color)}
        >
          {trendCfg.icon}
          {trendValue && <span>{trendValue}</span>}
          <span className="text-muted-foreground font-normal">
            {trendLabel ?? trendCfg.label}
          </span>
        </div>
      )}
    </div>
  );
}
