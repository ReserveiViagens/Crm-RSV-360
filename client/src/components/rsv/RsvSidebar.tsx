import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface RsvNavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  badge?: string | number;
}

export interface RsvNavGroup {
  title?: string;
  items: RsvNavItem[];
}

export interface RsvSidebarProps {
  logo?: React.ReactNode;
  groups?: RsvNavGroup[];
  activeHref?: string;
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
  footer?: React.ReactNode;
  className?: string;
  "data-testid"?: string;
}

export function RsvSidebar({
  logo,
  groups = [],
  activeHref,
  collapsed: controlledCollapsed,
  defaultCollapsed = false,
  onCollapse,
  footer,
  className,
  "data-testid": testId = "rsv-sidebar",
}: RsvSidebarProps) {
  const [internalCollapsed, setInternalCollapsed] = React.useState(defaultCollapsed);
  const collapsed = controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed;

  function handleToggle() {
    const next = !collapsed;
    setInternalCollapsed(next);
    onCollapse?.(next);
  }

  return (
    <aside
      data-testid={testId}
      className={cn(
        "relative flex flex-col h-full bg-[var(--surface-sidebar)] border-r border-border transition-[width] duration-300 ease-in-out overflow-hidden",
        collapsed ? "w-16" : "w-64",
        className
      )}
    >
      {logo && (
        <div
          data-testid={`${testId}-logo`}
          className={cn(
            "flex items-center h-16 border-b border-border px-4 shrink-0",
            collapsed ? "justify-center px-0" : "gap-3"
          )}
        >
          {logo}
        </div>
      )}

      <nav className="flex-1 overflow-y-auto py-4 space-y-6">
        {groups.map((group, gi) => (
          <div key={gi} data-testid={`${testId}-group-${gi}`}>
            {group.title && !collapsed && (
              <p className="px-4 mb-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                {group.title}
              </p>
            )}
            <ul className="space-y-0.5">
              {group.items.map((item, ii) => {
                const isActive = activeHref === item.href;
                return (
                  <li key={ii}>
                    <a
                      href={item.href}
                      data-testid={`${testId}-nav-item-${ii}`}
                      title={collapsed ? item.label : undefined}
                      className={cn(
                        "flex items-center gap-3 mx-2 px-2 py-2 rounded-control text-sm font-medium transition-colors",
                        "hover:bg-accent hover:text-accent-foreground",
                        isActive
                          ? "bg-blue-50 text-blue-700 font-semibold"
                          : "text-foreground/80",
                        collapsed ? "justify-center" : ""
                      )}
                    >
                      {item.icon && (
                        <span className="shrink-0 w-5 h-5 flex items-center justify-center">
                          {item.icon}
                        </span>
                      )}
                      {!collapsed && (
                        <span className="flex-1 truncate">{item.label}</span>
                      )}
                      {!collapsed && item.badge !== undefined && (
                        <span className="ml-auto text-xs bg-blue-600 text-white rounded-full px-1.5 py-0.5 min-w-[20px] text-center leading-none">
                          {item.badge}
                        </span>
                      )}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {footer && !collapsed && (
        <div className="border-t border-border p-4 shrink-0">{footer}</div>
      )}

      <button
        data-testid={`${testId}-toggle`}
        onClick={handleToggle}
        className={cn(
          "absolute top-4 -right-3 z-10",
          "w-6 h-6 rounded-full border border-border bg-[var(--surface-card)] shadow-card",
          "flex items-center justify-center text-muted-foreground",
          "hover:text-foreground transition-colors"
        )}
        aria-label={collapsed ? "Expandir sidebar" : "Recolher sidebar"}
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>
    </aside>
  );
}
