import { X } from "lucide-react";
import type { SearchFilters } from "@/types/search";
import { TYPE_LABELS, PROFILE_LABELS } from "@/constants/search-taxonomy";

interface SearchResultsSummaryProps {
  total: number;
  query?: string;
  filters: SearchFilters;
  isLoading?: boolean;
  onRemoveFilter: (key: keyof SearchFilters | "priceRange") => void;
  onClearAll: () => void;
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        background: "#EFF6FF",
        border: "1px solid #BFDBFE",
        borderRadius: 999,
        padding: "3px 10px",
        fontSize: 12,
        fontWeight: 600,
        color: "#1D4ED8",
      }}
    >
      {label}
      <button
        onClick={onRemove}
        data-testid={`remove-filter-${label}`}
        style={{ border: "none", background: "none", cursor: "pointer", display: "flex", padding: 0, color: "#1D4ED8" }}
      >
        <X style={{ width: 11, height: 11 }} />
      </button>
    </span>
  );
}

export default function SearchResultsSummary({
  total,
  query,
  filters,
  isLoading,
  onRemoveFilter,
  onClearAll,
}: SearchResultsSummaryProps) {
  type ChipKey = keyof SearchFilters | "priceRange";
  const chips: { key: ChipKey; label: string }[] = [];

  if (filters.type) chips.push({ key: "type", label: TYPE_LABELS[filters.type] ?? filters.type });
  if (filters.city) chips.push({ key: "city", label: filters.city });
  if (filters.enterprise) chips.push({ key: "enterprise", label: filters.enterprise });
  if (filters.category) chips.push({ key: "category", label: filters.category });
  if (filters.profile) chips.push({ key: "profile", label: PROFILE_LABELS[filters.profile] ?? filters.profile });
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    const label =
      filters.maxPrice !== undefined
        ? `R$ ${filters.minPrice ?? 0}–${filters.maxPrice}`
        : `A partir de R$ ${filters.minPrice}`;
    chips.push({ key: "priceRange", label });
  }
  if (filters.rating !== undefined) chips.push({ key: "rating", label: `${filters.rating}+ ★` });
  if (filters.comboAvailable) chips.push({ key: "comboAvailable", label: "Combo disponível" });
  if (filters.isFeatured) chips.push({ key: "isFeatured", label: "Mais vendidos" });

  return (
    <div
      data-testid="search-results-summary"
      style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}
    >
      <span style={{ fontSize: 14, color: "#374151", fontWeight: 500 }}>
        {isLoading ? (
          "Buscando..."
        ) : (
          <>
            <strong style={{ color: "#111827" }}>{total}</strong>{" "}
            resultado{total !== 1 ? "s" : ""}
            {query ? (
              <>
                {" "}para <strong style={{ color: "#2563EB" }}>"{query}"</strong>
              </>
            ) : null}
          </>
        )}
      </span>

      {chips.map(({ key, label }) => (
        <FilterChip
          key={key}
          label={label}
          onRemove={() => onRemoveFilter(key)}
        />
      ))}

      {chips.length > 0 && (
        <button
          data-testid="button-clear-all-summary"
          onClick={onClearAll}
          style={{
            border: "none",
            background: "none",
            cursor: "pointer",
            fontSize: 12,
            fontWeight: 600,
            color: "#6B7280",
            textDecoration: "underline",
            padding: 0,
          }}
        >
          Limpar filtros
        </button>
      )}
    </div>
  );
}
