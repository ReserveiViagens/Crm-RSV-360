import SearchResultsGrid from "@/components/search/SearchResultsGrid";
import type { SearchItem, SearchFilters } from "@/types/search";

interface CatalogGridProps {
  results: SearchItem[];
  total: number;
  isLoading: boolean;
  sort?: SearchFilters["sort"];
  onSortChange?: (sort: SearchFilters["sort"]) => void;
  onItemSelect?: (item: SearchItem) => void;
}

export default function CatalogGrid({
  results,
  total,
  isLoading,
  sort = "relevance",
  onSortChange = () => {},
  onItemSelect,
}: CatalogGridProps) {
  return (
    <SearchResultsGrid
      results={results}
      total={total}
      isLoading={isLoading}
      sort={sort}
      onSortChange={onSortChange}
      onItemSelect={onItemSelect}
    />
  );
}
