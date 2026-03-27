import SearchResultsGrid from "@/components/search/SearchResultsGrid";
import type { SearchItem } from "@/types/search";

interface CatalogGridProps {
  items: SearchItem[];
  isLoading?: boolean;
  onSelect?: (item: SearchItem) => void;
  columns?: 1 | 2 | 3;
}

export default function CatalogGrid({ items, isLoading, onSelect, columns }: CatalogGridProps) {
  return (
    <SearchResultsGrid
      items={items}
      isLoading={isLoading}
      onSelect={onSelect}
      columns={columns}
    />
  );
}
