import SearchResultCard from "@/components/search/SearchResultCard";
import type { SearchItem } from "@/types/search";

interface CatalogProductCardProps {
  item: SearchItem;
  onSelect?: (item: SearchItem) => void;
}

export default function CatalogProductCard({ item, onSelect }: CatalogProductCardProps) {
  return <SearchResultCard item={item} onSelect={onSelect} />;
}
