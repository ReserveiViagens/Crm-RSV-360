import type { SearchFilters, SearchResponse, SearchItem } from "@/types/search";

function buildParams(filters: SearchFilters): URLSearchParams {
  const params = new URLSearchParams();
  for (const [key, val] of Object.entries(filters)) {
    if (val !== undefined && val !== null && val !== "") {
      params.set(key, String(val));
    }
  }
  return params;
}

export async function fetchSearch(filters: SearchFilters): Promise<SearchResponse> {
  const params = buildParams(filters);
  const res = await fetch(`/api/search?${params}`);
  if (!res.ok) throw new Error("Erro ao buscar resultados");
  return res.json();
}

export async function fetchSearchSuggestions(q: string): Promise<SearchItem[]> {
  if (!q || q.length < 2) return [];
  const res = await fetch(`/api/search/suggestions?q=${encodeURIComponent(q)}`);
  if (!res.ok) return [];
  return res.json();
}

export interface SuggestResponse {
  names: SearchItem[];
  enterprises: SearchItem[];
  destinations: SearchItem[];
  featured: SearchItem[];
}

export async function fetchSuggest(q: string): Promise<SuggestResponse> {
  const empty: SuggestResponse = { names: [], enterprises: [], destinations: [], featured: [] };
  if (!q || q.length < 1) return empty;
  try {
    const res = await fetch(`/api/search/suggest?q=${encodeURIComponent(q)}`);
    if (!res.ok) return empty;
    return res.json();
  } catch {
    return empty;
  }
}

export interface PlaceAutocomplete {
  id: string;
  label: string;
  description: string;
  type: "city" | "region" | "park" | "hotel";
}

export async function fetchPlacesAutocomplete(q: string): Promise<PlaceAutocomplete[]> {
  if (!q || q.length < 2) return [];
  try {
    const res = await fetch(`/api/search/places?q=${encodeURIComponent(q)}`);
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}
