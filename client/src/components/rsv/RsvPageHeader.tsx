import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronRight, Home } from "lucide-react";

export interface RsvBreadcrumbItem {
  label: string;
  href?: string;
}

export interface RsvPageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: RsvBreadcrumbItem[];
  actions?: React.ReactNode;
  className?: string;
  "data-testid"?: string;
}

export function RsvPageHeader({
  title,
  subtitle,
  breadcrumbs,
  actions,
  className,
  "data-testid": testId = "rsv-page-header",
}: RsvPageHeaderProps) {
  return (
    <div
      data-testid={testId}
      className={cn("flex flex-col gap-1 py-4", className)}
    >
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav
          data-testid={`${testId}-breadcrumbs`}
          aria-label="Breadcrumb"
          className="flex items-center gap-1 text-xs text-muted-foreground mb-1"
        >
          <Home className="w-3 h-3" />
          {breadcrumbs.map((crumb, i) => (
            <React.Fragment key={i}>
              <ChevronRight className="w-3 h-3 opacity-50" />
              {crumb.href && i < breadcrumbs.length - 1 ? (
                <a
                  href={crumb.href}
                  data-testid={`${testId}-breadcrumb-${i}`}
                  className="hover:text-foreground transition-colors"
                >
                  {crumb.label}
                </a>
              ) : (
                <span
                  data-testid={`${testId}-breadcrumb-${i}`}
                  className={i === breadcrumbs.length - 1 ? "text-foreground font-medium" : ""}
                >
                  {crumb.label}
                </span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1
            data-testid={`${testId}-title`}
            className="text-heading-h1 text-foreground truncate"
          >
            {title}
          </h1>
          {subtitle && (
            <p
              data-testid={`${testId}-subtitle`}
              className="mt-1 text-sm text-muted-foreground"
            >
              {subtitle}
            </p>
          )}
        </div>

        {actions && (
          <div
            data-testid={`${testId}-actions`}
            className="flex items-center gap-2 shrink-0 pt-0.5"
          >
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
