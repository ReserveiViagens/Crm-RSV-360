import { ArrowUpDown } from "lucide-react";
import SearchResultCard from "./SearchResultCard";
import SearchResultCardSkeleton from "./SearchResultCardSkeleton";
import type { SearchItem, SearchFilters } from "@/types/search";

const SORT_OPTIONS = [
  { value: "relevance", label: "Relevância" },
  { value: "popular", label: "Mais populares" },
  { value: "rating", label: "Melhor avaliação" },
  { value: "price_asc", label: "Menor preço" },
];

interface SearchResultsGridProps {
  results: SearchItem[];
  total: number;
  isLoading: boolean;
  sort: SearchFilters["sort"];
  onSortChange: (sort: SearchFilters["sort"]) => void;
  onItemSelect?: (item: SearchItem) => void;
}

export default function SearchResultsGrid({ results, total, isLoading, sort, onSortChange, onItemSelect }: SearchResultsGridProps) {
  if (isLoading) {
    return (
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{ height: 16, width: 120, borderRadius: 6, background: "#F3F4F6" }} />
          <div style={{ height: 34, width: 160, borderRadius: 8, background: "#F3F4F6" }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
          {Array.from({ length: 6 }).map((_, i) => <SearchResultCardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: "64px 24px", textAlign: "center",
      }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>🔍</div>
        <div style={{ fontSize: 20, fontWeight: 800, color: "#1F2937", marginBottom: 8 }}>Nenhum resultado encontrado</div>
        <div style={{ fontSize: 14, color: "#9CA3AF", maxWidth: 360, lineHeight: 1.6 }}>
          Tente ajustar os filtros ou buscar por outros termos como "hotel caldas novas" ou "hot park".
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: 16, flexWrap: "wrap", gap: 10,
      }}>
        <div style={{ fontSize: 13, color: "#6B7280" }}>
          <strong style={{ color: "#1F2937" }}>{total.toLocaleString("pt-BR")}</strong> resultado{total !== 1 ? "s" : ""}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <ArrowUpDown style={{ width: 14, height: 14, color: "#9CA3AF" }} />
          <select
            data-testid="select-sort"
            value={sort ?? "relevance"}
            onChange={(e) => onSortChange(e.target.value as SearchFilters["sort"])}
            style={{
              fontSize: 13, fontWeight: 600, color: "#374151",
              border: "1.5px solid #E5E7EB", borderRadius: 8,
              padding: "6px 12px", background: "#F9FAFB",
              cursor: "pointer", outline: "none",
            }}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
        {results.map((item) => (
          <SearchResultCard key={item.id} item={item} onSelect={onItemSelect} />
        ))}
      </div>
    </div>
  );
}
