import * as React from "react";
import { cn } from "@/lib/utils";

export interface RsvSectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  as?: "h2" | "h3" | "h4";
  className?: string;
  "data-testid"?: string;
}

export function RsvSectionHeader({
  title,
  subtitle,
  action,
  as: Heading = "h2",
  className,
  "data-testid": testId = "rsv-section-header",
}: RsvSectionHeaderProps) {
  const headingClass =
    Heading === "h2"
      ? "text-heading-h2"
      : Heading === "h3"
      ? "text-heading-h3"
      : "text-heading-h4";

  return (
    <div
      data-testid={testId}
      className={cn("flex items-start justify-between gap-4", className)}
    >
      <div className="min-w-0">
        <Heading
          data-testid={`${testId}-title`}
          className={cn(headingClass, "text-foreground")}
        >
          {title}
        </Heading>
        {subtitle && (
          <p
            data-testid={`${testId}-subtitle`}
            className="mt-1 text-sm text-muted-foreground"
          >
            {subtitle}
          </p>
        )}
      </div>
      {action && (
        <div
          data-testid={`${testId}-action`}
          className="shrink-0 self-center"
        >
          {action}
        </div>
      )}
    </div>
  );
}
