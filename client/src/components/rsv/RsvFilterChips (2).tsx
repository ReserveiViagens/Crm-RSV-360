import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export interface RsvFilterChip {
  id: string;
  label: string;
  icon?: React.ReactNode;
  count?: number;
}

export interface RsvFilterChipsProps {
  chips: RsvFilterChip[];
  selected?: string[];
  defaultSelected?: string[];
  onSelectionChange?: (selected: string[]) => void;
  multiSelect?: boolean;
  showClearAll?: boolean;
  className?: string;
  "data-testid"?: string;
}

export function RsvFilterChips({
  chips,
  selected: controlledSelected,
  defaultSelected = [],
  onSelectionChange,
  multiSelect = true,
  showClearAll = true,
  className,
  "data-testid": testId = "rsv-filter-chips",
}: RsvFilterChipsProps) {
  const [internalSelected, setInternalSelected] = React.useState<string[]>(defaultSelected);
  const selected = controlledSelected !== undefined ? controlledSelected : internalSelected;

  function toggle(id: string) {
    let next: string[];
    if (multiSelect) {
      next = selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id];
    } else {
      next = selected.includes(id) ? [] : [id];
    }
    setInternalSelected(next);
    onSelectionChange?.(next);
  }

  function clearAll() {
    setInternalSelected([]);
    onSelectionChange?.([]);
  }

  const hasSelection = selected.length > 0;

  return (
    <div
      data-testid={testId}
      className={cn("flex items-center gap-2 overflow-x-auto scrollbar-none py-1", className)}
    >
      {showClearAll && hasSelection && (
        <button
          data-testid={`${testId}-clear-all`}
          onClick={clearAll}
          className="flex items-center gap-1 shrink-0 h-8 px-3 rounded-control text-xs font-medium text-muted-foreground border border-border bg-[var(--surface-card)] hover:bg-accent hover:text-foreground transition-colors"
          aria-label="Limpar filtros"
        >
          <X className="w-3 h-3" />
          Limpar
        </button>
      )}

      {chips.map((chip) => {
        const isActive = selected.includes(chip.id);
        return (
          <button
            key={chip.id}
            data-testid={`${testId}-chip-${chip.id}`}
            onClick={() => toggle(chip.id)}
            aria-pressed={isActive}
            className={cn(
              "flex items-center gap-1.5 shrink-0 h-8 px-3 rounded-control text-xs font-medium",
              "border transition-all",
              isActive
                ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                : "bg-[var(--surface-card)] text-foreground border-border hover:bg-accent"
            )}
          >
            {chip.icon && (
              <span className="w-3.5 h-3.5 flex items-center justify-center">
                {chip.icon}
              </span>
            )}
            {chip.label}
            {chip.count !== undefined && (
              <span
                data-testid={`${testId}-chip-count-${chip.id}`}
                className={cn(
                  "ml-0.5 rounded-full px-1.5 py-0.5 text-[10px] leading-none font-bold",
                  isActive ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
                )}
              >
                {chip.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
