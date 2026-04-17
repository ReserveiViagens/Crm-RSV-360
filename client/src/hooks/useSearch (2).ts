import { useState, useCallback, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchSearch, fetchSuggest } from "@/services/search-api";
import type { SearchFilters, SearchResponse, SearchItem } from "@/types/search";

export function useSearch(initialFilters: SearchFilters = {}) {
  const [filters, setFilters] = useState<SearchFilters>(initialFilters);

  const setFilter = useCallback(<K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      ...(key !== "page" ? { page: 1 } : {}),
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(prev => ({ q: prev.q, type: prev.type, page: 1 }));
  }, []);

  const hasActiveFilters = Object.entries(filters).some(([key, val]) => {
    if (["q", "type", "page", "limit", "sort"].includes(key)) return false;
    return val !== undefined && val !== null && val !== "";
  });

  const { data, isLoading, isError } = useQuery<SearchResponse>({
    queryKey: ["/api/search", filters],
    queryFn: () => fetchSearch(filters),
    staleTime: 1000 * 30,
  });

  return {
    filters,
    setFilter,
    setFilters,
    clearFilters,
    hasActiveFilters,
    data,
    isLoading,
    isError,
  };
}

export function useSearchSuggest(q: string, debounceMs = 300) {
  const [debouncedQ, setDebouncedQ] = useState(q);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setDebouncedQ(q), debounceMs);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [q, debounceMs]);

  return useQuery<{
    names: SearchItem[];
    enterprises: SearchItem[];
    destinations: SearchItem[];
    featured: SearchItem[];
  }>({
    queryKey: ["/api/search/suggest", debouncedQ],
    queryFn: () => fetchSuggest(debouncedQ),
    enabled: debouncedQ.length >= 1,
    staleTime: 30000,
  });
}
