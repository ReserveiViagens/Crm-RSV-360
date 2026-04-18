import * as React from "react";
import { cn } from "@/lib/utils";

export interface RsvBottomNavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

export interface RsvBottomNavProps {
  items: RsvBottomNavItem[];
  activeHref?: string;
  height?: number;
  className?: string;
  "data-testid"?: string;
}

export function RsvBottomNav({
  items,
  activeHref,
  height = 64,
  className,
  "data-testid": testId = "rsv-bottom-nav",
}: RsvBottomNavProps) {
  return (
    <nav
      data-testid={testId}
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40",
        "bg-[var(--surface-card)] border-t border-border",
        "flex items-center",
        className
      )}
      style={{
        height,
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      {items.map((item, i) => {
        const isActive = activeHref === item.href;
        return (
          <a
            key={i}
            href={item.href}
            data-testid={`${testId}-item-${i}`}
            className={cn(
              "relative flex flex-col items-center justify-center flex-1 gap-1 py-2 text-[10px] font-medium transition-colors",
              isActive ? "text-blue-600" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <span className="relative w-5 h-5 flex items-center justify-center">
              {item.icon}
              {item.badge !== undefined && item.badge > 0 && (
                <span
                  data-testid={`${testId}-badge-${i}`}
                  className="absolute -top-1 -right-1.5 min-w-[16px] h-4 bg-blue-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5 leading-none"
                >
                  {item.badge > 99 ? "99+" : item.badge}
                </span>
              )}
            </span>
            <span className="truncate max-w-full px-1">{item.label}</span>
            {isActive && (
              <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-blue-600 rounded-full" />
            )}
          </a>
        );
      })}
    </nav>
  );
}
