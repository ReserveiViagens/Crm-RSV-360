import { ArrowUpDown } from "lucide-react";
import { SORT_OPTIONS } from "@/constants/search-taxonomy";
import type { SearchFilters } from "@/types/search";

interface SearchSortProps {
  value: SearchFilters["sort"];
  onChange: (sort: SearchFilters["sort"]) => void;
  showProximity?: boolean;
}

export default function SearchSort({ value = "relevance", onChange, showProximity = false }: SearchSortProps) {
  const options = showProximity
    ? SORT_OPTIONS
    : SORT_OPTIONS.filter((o) => o.value !== "proximity");

  return (
    <div
      data-testid="search-sort"
      style={{ display: "flex", alignItems: "center", gap: 6 }}
    >
      <ArrowUpDown style={{ width: 15, height: 15, color: "#6B7280", flexShrink: 0 }} />
      <select
        data-testid="select-sort"
        value={value ?? "relevance"}
        onChange={(e) => onChange(e.target.value as SearchFilters["sort"])}
        style={{
          border: "1.5px solid #E5E7EB",
          borderRadius: 8,
          padding: "5px 10px",
          fontSize: 13,
          color: "#374151",
          fontWeight: 500,
          background: "#fff",
          cursor: "pointer",
          outline: "none",
        }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
