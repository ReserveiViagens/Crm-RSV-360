import SearchBar from "@/components/search/SearchBar";
import type { SearchFilters, SearchItemType } from "@/types/search";

interface CatalogSharedSearchBarProps {
  filters: SearchFilters;
  activeType?: SearchItemType | "all";
  hasActiveFilters?: boolean;
  onSearch: (q: string) => void;
  onTypeChange?: (type: SearchItemType | "all") => void;
  onFiltersOpen?: () => void;
}

export default function CatalogSharedSearchBar({
  filters,
  activeType = "all",
  hasActiveFilters = false,
  onSearch,
  onTypeChange = () => {},
  onFiltersOpen = () => {},
}: CatalogSharedSearchBarProps) {
  return (
    <div
      style={{
        background: "#fff",
        borderBottom: "1px solid #E5E7EB",
        padding: "12px 16px 0",
        position: "sticky",
        top: 64,
        zIndex: 31,
      }}
    >
      <SearchBar
        value={filters.q || ""}
        activeType={activeType}
        onSearch={onSearch}
        onTypeChange={onTypeChange}
        onFiltersOpen={onFiltersOpen}
        hasActiveFilters={hasActiveFilters}
      />
    </div>
  );
}
