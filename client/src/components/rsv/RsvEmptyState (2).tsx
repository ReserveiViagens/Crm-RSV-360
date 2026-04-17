import * as React from "react";
import { cn } from "@/lib/utils";
import { SearchX } from "lucide-react";

export interface RsvEmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  primaryAction?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
  "data-testid"?: string;
}

export function RsvEmptyState({
  icon,
  title,
  description,
  primaryAction,
  secondaryAction,
  size = "md",
  className,
  "data-testid": testId = "rsv-empty-state",
}: RsvEmptyStateProps) {
  const sizeMap = {
    sm: { iconWrap: "w-12 h-12", iconInner: "w-6 h-6", title: "text-heading-h4", desc: "text-xs" },
    md: { iconWrap: "w-16 h-16", iconInner: "w-8 h-8", title: "text-heading-h3", desc: "text-sm" },
    lg: { iconWrap: "w-20 h-20", iconInner: "w-10 h-10", title: "text-heading-h2", desc: "text-base" },
  };
  const s = sizeMap[size];

  return (
    <div
      data-testid={testId}
      className={cn(
        "flex flex-col items-center justify-center text-center py-12 px-6 gap-4",
        className
      )}
    >
      <div
        data-testid={`${testId}-icon`}
        className={cn(
          s.iconWrap,
          "rounded-premium bg-muted/50 flex items-center justify-center text-muted-foreground"
        )}
      >
        <span className={s.iconInner}>
          {icon ?? <SearchX className="w-full h-full" />}
        </span>
      </div>

      <div className="max-w-xs">
        <p
          data-testid={`${testId}-title`}
          className={cn(s.title, "text-foreground font-semibold")}
        >
          {title}
        </p>
        {description && (
          <p
            data-testid={`${testId}-description`}
            className={cn(s.desc, "mt-1.5 text-muted-foreground leading-relaxed")}
          >
            {description}
          </p>
        )}
      </div>

      {(primaryAction || secondaryAction) && (
        <div
          data-testid={`${testId}-actions`}
          className="flex flex-col sm:flex-row items-center gap-2 mt-2"
        >
          {primaryAction}
          {secondaryAction}
        </div>
      )}
    </div>
  );
}
