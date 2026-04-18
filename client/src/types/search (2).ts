export type SearchItemType = "park" | "hotel" | "destination" | "combo" | "attraction" | "excursion";

export interface SearchItem {
  id: string;
  type: SearchItemType;
  name: string;
  slug: string;
  enterpriseName: string;
  category: string;
  subcategories: string[];
  city: string;
  state: string;
  region: string;
  descriptionShort: string;
  descriptionLong: string;
  tags: string[];
  profiles: string[];
  priceFrom: number;
  rating: number;
  reviewCount: number;
  popularityScore: number;
  isFeatured: boolean;
  comboAvailable: boolean;
  address: string;
  amenities: string[];
  images: string[];
  coordinates?: { lat: number; lng: number };
  score?: number;
  highlights?: Record<string, string>;
}

export interface SearchFilters {
  q?: string;
  type?: SearchItemType | string;
  category?: string;
  enterprise?: string;
  city?: string;
  profile?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  sort?: "relevance" | "price_asc" | "popular" | "rating" | "proximity" | "date";
  page?: number;
  limit?: number;
  comboAvailable?: boolean;
  isFeatured?: boolean;
  lat?: number;
  lng?: number;
  radiusKm?: number;
  estado?: string;
  mes?: string;
}

export interface SearchFacets {
  types: Record<string, number>;
  categories: Record<string, number>;
  enterprises: Record<string, number>;
  cities: Record<string, number>;
  profiles: Record<string, number>;
}

export interface MapMarker {
  id: string;
  name: string;
  type: SearchItemType;
  lat: number;
  lng: number;
  priceFrom: number;
  rating: number;
  image?: string;
  slug: string;
}

export interface SearchResponse {
  results: SearchItem[];
  facets: SearchFacets;
  total: number;
  page: number;
  hasMore: boolean;
  appliedFilters: Omit<SearchFilters, "page" | "limit">;
  queryInfo: { normalizedQuery: string; intent: Record<string, unknown> };
  suggestions: SearchItem[];
  mapMarkers?: MapMarker[];
}

export interface MapCluster {
  id: string;
  lat: number;
  lng: number;
  count: number;
  ids: string[];
}

export interface MapSearchResponse {
  markers: MapMarker[];
  clusters?: MapCluster[];
  total: number;
  bounds?: { north: number; south: number; east: number; west: number };
}
