import * as React from "react";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";

export interface RsvTopbarProps {
  logo?: React.ReactNode;
  title?: string;
  actions?: React.ReactNode;
  onMenuToggle?: () => void;
  showMenuButton?: boolean;
  gradient?: boolean;
  className?: string;
  "data-testid"?: string;
}

export function RsvTopbar({
  logo,
  title,
  actions,
  onMenuToggle,
  showMenuButton = true,
  gradient = true,
  className,
  "data-testid": testId = "rsv-topbar",
}: RsvTopbarProps) {
  return (
    <header
      data-testid={testId}
      className={cn(
        "sticky top-0 z-40 flex items-center gap-3 px-4 h-14 border-b",
        gradient
          ? "border-white/10 text-white"
          : "border-border bg-[var(--surface-sidebar)] text-foreground",
        className
      )}
      style={gradient ? { background: "var(--brand-gradient)" } : undefined}
    >
      {showMenuButton && onMenuToggle && (
        <button
          data-testid={`${testId}-menu-toggle`}
          onClick={onMenuToggle}
          aria-label="Abrir menu"
          className={cn(
            "w-9 h-9 flex items-center justify-center rounded-control shrink-0",
            "hover:bg-white/10 transition-colors"
          )}
        >
          <Menu className="w-5 h-5" />
        </button>
      )}

      {logo && (
        <div data-testid={`${testId}-logo`} className="shrink-0">
          {logo}
        </div>
      )}

      {title && (
        <span
          data-testid={`${testId}-title`}
          className="flex-1 font-semibold text-sm truncate"
        >
          {title}
        </span>
      )}

      {!title && <span className="flex-1" />}

      {actions && (
        <div
          data-testid={`${testId}-actions`}
          className="flex items-center gap-2 shrink-0"
        >
          {actions}
        </div>
      )}
    </header>
  );
}
