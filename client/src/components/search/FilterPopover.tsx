import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FilterPanelContent, countActiveFilters } from "./SearchFiltersSidebar";
import type { SearchFilters, SearchFacets } from "@/types/search";

export interface FilterPopoverProps {
  filters: SearchFilters;
  facets?: SearchFacets;
  onFiltersChange: (filters: Partial<SearchFilters>) => void;
  onClearAll: () => void;
  align?: "start" | "center" | "end";
}

export function FilterPopover({
  filters,
  facets,
  onFiltersChange,
  onClearAll,
  align = "start",
}: FilterPopoverProps) {
  const [open, setOpen] = useState(false);
  const activeCount = countActiveFilters(filters);
  const hasActive = activeCount > 0;

  function handleClearAll() {
    onClearAll();
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          data-testid="button-open-filters-desktop"
          style={{
            display: "flex", alignItems: "center", gap: 6, flexShrink: 0,
            background: hasActive ? "#EFF6FF" : "#F3F4F6",
            border: hasActive ? "1.5px solid #2563EB" : "1.5px solid #E5E7EB",
            borderRadius: 999, padding: "7px 14px",
            color: hasActive ? "#2563EB" : "#6B7280",
            fontSize: 13, fontWeight: hasActive ? 700 : 600,
            cursor: "pointer", whiteSpace: "nowrap",
            transition: "all 0.15s",
          }}
        >
          <SlidersHorizontal style={{ width: 14, height: 14 }} />
          Filtros
          {hasActive && (
            <span
              data-testid="filter-active-badge"
              style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                width: 18, height: 18, borderRadius: "50%",
                background: "#2563EB", color: "#fff",
                fontSize: 10, fontWeight: 800, lineHeight: 1,
                marginLeft: 2,
              }}
            >
              {activeCount}
            </span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent
        align={align}
        sideOffset={8}
        style={{
          width: 280,
          padding: "16px 16px 0",
          maxHeight: "72vh",
          overflowY: "auto",
          borderRadius: 14,
          boxShadow: "0 8px 32px rgba(0,0,0,0.13)",
          border: "1.5px solid #E5E7EB",
          background: "#fff",
          zIndex: 200,
        }}
      >
        <FilterPanelContent
          filters={filters}
          facets={facets}
          onFiltersChange={onFiltersChange}
          onClearAll={handleClearAll}
        />

        <div style={{
          position: "sticky", bottom: 0,
          background: "#fff",
          padding: "12px 0 14px",
          borderTop: "1px solid #F3F4F6",
          marginTop: 4,
        }}>
          <button
            data-testid="button-apply-filters"
            onClick={() => setOpen(false)}
            style={{
              width: "100%", padding: "10px 0",
              background: "linear-gradient(135deg, #2563EB, #1D4ED8)",
              color: "#fff", fontWeight: 700, fontSize: 14,
              borderRadius: 10, border: "none", cursor: "pointer",
              boxShadow: "0 2px 8px rgba(37,99,235,0.3)",
            }}
          >
            {hasActive ? `Ver resultados (${activeCount} filtro${activeCount > 1 ? "s" : ""})` : "Aplicar filtros"}
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
