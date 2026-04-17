import { useState, useCallback, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { fetchSearch, fetchSuggest } from "@/services/search-api";
import { filtersToParams, paramsToFilters, hasActiveFilters } from "@/lib/search-query";
import type { SearchFilters, SearchResponse, SearchItem } from "@/types/search";

const ALL_FILTER_KEYS = new Set([
  "q", "busca",
  "type",
  "category", "categoria",
  "enterprise",
  "city", "cidade",
  "profile", "perfil",
  "minPrice", "precoMin",
  "maxPrice", "precoMax",
  "rating",
  "sort",
  "page",
  "limit",
  "comboAvailable",
  "isFeatured",
  "lat", "lng", "radiusKm",
  "estado",
  "mes",
]);

export interface UseUnifiedSearchOptions {
  syncUrl?: boolean;
  initialFilters?: SearchFilters;
  basePath?: string;
}

export function useUnifiedSearch(options: UseUnifiedSearchOptions = {}) {
  const { syncUrl = false, initialFilters = {}, basePath } = options;
  const [, navigate] = useLocation();

  const getInitial = (): SearchFilters => {
    const base: SearchFilters = { sort: "relevance", page: 1, limit: 20, ...initialFilters };
    if (syncUrl && typeof window !== "undefined") {
      const fromUrl = paramsToFilters(new URLSearchParams(window.location.search));
      return { ...base, ...fromUrl };
    }
    return base;
  };

  const [filters, setFilters] = useState<SearchFilters>(getInitial);

  useEffect(() => {
    if (!syncUrl) return;
    const filterParams = filtersToParams(filters);
    const current = new URLSearchParams(window.location.search);
    const preserved = new URLSearchParams();
    current.forEach((value, key) => {
      if (!ALL_FILTER_KEYS.has(key)) preserved.set(key, value);
    });
    Object.entries(filterParams).forEach(([k, v]) => preserved.set(k, v));
    const qs = preserved.toString();
    const path = basePath ?? window.location.pathname;
    const newUrl = qs ? `${path}?${qs}` : path;
    window.history.replaceState(null, "", newUrl);
  }, [filters, syncUrl, basePath]);

  const setFilter = useCallback(<K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: key !== "page" ? 1 : (value as number),
    }));
  }, []);

  const setFiltersPartial = useCallback((partial: Partial<SearchFilters>) => {
    setFilters((prev) => ({ ...prev, ...partial, page: 1 }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters((prev) => ({ q: prev.q, sort: "relevance", page: 1, limit: prev.limit ?? 20 }));
  }, []);

  const clearAll = useCallback(() => {
    setFilters({ sort: "relevance", page: 1, limit: 20 });
  }, []);

  const applyPreset = useCallback((preset: Partial<SearchFilters>) => {
    setFilters((prev) => ({ ...prev, ...preset, page: 1 }));
  }, []);

  const redirectSearch = useCallback((targetPath: string, overrides?: Partial<SearchFilters>) => {
    const merged = { ...filters, ...overrides };
    const params = filtersToParams(merged);
    const qs = new URLSearchParams(params).toString();
    navigate(qs ? `${targetPath}?${qs}` : targetPath);
  }, [filters, navigate]);

  const query = useQuery<SearchResponse>({
    queryKey: ["/api/search", filters],
    queryFn: () => fetchSearch(filters),
    staleTime: 30000,
  });

  return {
    filters,
    setFilter,
    setFilters: setFiltersPartial,
    setFiltersRaw: setFilters,
    clearFilters,
    clearAll,
    applyPreset,
    redirectSearch,
    hasActiveFilters: hasActiveFilters(filters),
    ...query,
  };
}

export function useUnifiedSuggest(q: string, debounceMs = 300) {
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
