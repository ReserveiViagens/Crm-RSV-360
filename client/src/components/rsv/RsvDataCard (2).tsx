import * as React from "react";
import { cn } from "@/lib/utils";

export interface RsvDataCardProps {
  title: string;
  description?: string;
  media?: React.ReactNode;
  icon?: React.ReactNode;
  footer?: React.ReactNode;
  actions?: React.ReactNode;
  badge?: React.ReactNode;
  children?: React.ReactNode;
  href?: string;
  className?: string;
  "data-testid"?: string;
}

export function RsvDataCard({
  title,
  description,
  media,
  icon,
  footer,
  actions,
  badge,
  children,
  href,
  className,
  "data-testid": testId = "rsv-data-card",
}: RsvDataCardProps) {
  const Wrapper = href ? "a" : "div";

  return (
    <Wrapper
      data-testid={testId}
      href={href}
      className={cn(
        "flex flex-col rounded-card bg-[var(--surface-card)] shadow-card border border-border overflow-hidden",
        href ? "hover:shadow-elevated transition-shadow cursor-pointer" : "",
        className
      )}
    >
      {media && (
        <div data-testid={`${testId}-media`} className="relative w-full shrink-0">
          {media}
          {badge && (
            <div className="absolute top-3 left-3">
              {badge}
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col flex-1 p-4 gap-2">
        <div className="flex items-start gap-3">
          {icon && (
            <span
              data-testid={`${testId}-icon`}
              className="w-9 h-9 rounded-control bg-blue-50 text-blue-600 flex items-center justify-center shrink-0"
            >
              {icon}
            </span>
          )}
          <div className="min-w-0 flex-1">
            <h3
              data-testid={`${testId}-title`}
              className="text-heading-h4 text-foreground leading-snug"
            >
              {title}
            </h3>
            {description && (
              <p
                data-testid={`${testId}-description`}
                className="mt-0.5 text-sm text-muted-foreground line-clamp-2"
              >
                {description}
              </p>
            )}
          </div>
          {actions && !media && (
            <div
              data-testid={`${testId}-actions`}
              className="shrink-0"
            >
              {actions}
            </div>
          )}
        </div>

        {children && (
          <div data-testid={`${testId}-body`} className="mt-1">
            {children}
          </div>
        )}
      </div>

      {(footer || (actions && media)) && (
        <div
          data-testid={`${testId}-footer`}
          className="px-4 pb-4 pt-0 flex items-center justify-between gap-2"
        >
          {footer}
          {actions && media && (
            <div data-testid={`${testId}-actions`} className="shrink-0 ml-auto">
              {actions}
            </div>
          )}
        </div>
      )}
    </Wrapper>
  );
}
