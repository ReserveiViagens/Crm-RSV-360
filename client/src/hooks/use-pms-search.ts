import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { pmsClient } from "@/lib/pms-client";
import type { PMSResponse } from "@/lib/pms-client";

// Types for search (adjust based on actual PMS API response)
export interface SearchFilters {
  q?: string;
  type?: string;
  location?: string;
  category?: string;
  priceMin?: number;
  priceMax?: number;
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
  offset?: number;
}

export interface SearchResult {
  id: string;
  type: 'excursion' | 'property' | 'park' | 'attraction' | 'accommodation';
  name: string;
  description: string;
  location: string;
  price?: number;
  rating?: number;
  images?: string[];
  category?: string;
  score: number;
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  filters: SearchFilters;
  took: number;
}

export function usePMSSearch(filters: SearchFilters) {
  return useQuery<PMSResponse<SearchResponse>>({
    queryKey: ["pms-search", filters],
    queryFn: () => pmsClient.search(filters),
    enabled: !!filters.q || !!filters.type,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}