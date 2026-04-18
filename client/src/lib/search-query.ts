import type { SearchFilters } from "@/types/search";

export type SearchParams = Record<string, string>;

export function filtersToParams(filters: SearchFilters): SearchParams {
  const params: SearchParams = {};

  if (filters.q) params.q = filters.q;
  if (filters.type && filters.type !== "all") params.type = filters.type;
  if (filters.category) params.category = filters.category;
  if (filters.enterprise) params.enterprise = filters.enterprise;
  if (filters.city) params.city = filters.city;
  if (filters.profile) params.profile = filters.profile;
  if (filters.minPrice !== undefined) params.minPrice = String(filters.minPrice);
  if (filters.maxPrice !== undefined) params.maxPrice = String(filters.maxPrice);
  if (filters.rating !== undefined) params.rating = String(filters.rating);
  if (filters.sort && filters.sort !== "relevance") params.sort = filters.sort;
  if (filters.page && filters.page > 1) params.page = String(filters.page);
  if (filters.limit && filters.limit !== 20) params.limit = String(filters.limit);
  if (filters.comboAvailable !== undefined) params.comboAvailable = String(filters.comboAvailable);
  if (filters.isFeatured !== undefined) params.isFeatured = String(filters.isFeatured);
  if (filters.lat !== undefined) params.lat = String(filters.lat);
  if (filters.lng !== undefined) params.lng = String(filters.lng);
  if (filters.radiusKm !== undefined) params.radiusKm = String(filters.radiusKm);
  if (filters.estado) params.estado = filters.estado;
  if (filters.mes && filters.mes !== "todos") params.mes = filters.mes;

  return params;
}

export function paramsToFilters(params: SearchParams | URLSearchParams): SearchFilters {
  const get = (key: string): string | undefined => {
    if (params instanceof URLSearchParams) return params.get(key) ?? undefined;
    return params[key] || undefined;
  };

  const getAny = (...keys: string[]): string | undefined => {
    for (const k of keys) {
      const v = get(k);
      if (v) return v;
    }
    return undefined;
  };

  const minPriceRaw = parseFloat(getAny("minPrice", "precoMin") ?? "");
  const maxPriceRaw = parseFloat(getAny("maxPrice", "precoMax") ?? "");
  const ratingRaw = parseFloat(get("rating") ?? "");
  const pageRaw = parseInt(get("page") ?? "", 10);
  const limitRaw = parseInt(get("limit") ?? "", 10);
  const latRaw = parseFloat(get("lat") ?? "");
  const lngRaw = parseFloat(get("lng") ?? "");
  const radiusKmRaw = parseFloat(get("radiusKm") ?? "");

  return {
    q: getAny("q", "busca") ?? "",
    type: get("type") as SearchFilters["type"],
    category: getAny("category", "categoria"),
    enterprise: get("enterprise"),
    city: getAny("city", "cidade"),
    profile: get("profile"),
    minPrice: isNaN(minPriceRaw) ? undefined : minPriceRaw,
    maxPrice: isNaN(maxPriceRaw) ? undefined : maxPriceRaw,
    rating: isNaN(ratingRaw) ? undefined : ratingRaw,
    sort: (get("sort") as SearchFilters["sort"]) ?? "relevance",
    page: isNaN(pageRaw) ? 1 : Math.max(1, pageRaw),
    limit: isNaN(limitRaw) ? 20 : Math.min(50, Math.max(1, limitRaw)),
    comboAvailable:
      get("comboAvailable") === "true" ? true : get("comboAvailable") === "false" ? false : undefined,
    isFeatured:
      get("isFeatured") === "true" ? true : get("isFeatured") === "false" ? false : undefined,
    lat: isNaN(latRaw) ? undefined : latRaw,
    lng: isNaN(lngRaw) ? undefined : lngRaw,
    radiusKm: isNaN(radiusKmRaw) ? undefined : radiusKmRaw,
    estado: get("estado"),
    mes: get("mes"),
  };
}

export function buildSearchUrl(basePath: string, filters: SearchFilters): string {
  const params = filtersToParams(filters);
  const qs = new URLSearchParams(params).toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

export function parseWindowSearch(): SearchFilters {
  if (typeof window === "undefined") return {};
  return paramsToFilters(new URLSearchParams(window.location.search));
}

export function hasActiveFilters(filters: SearchFilters): boolean {
  return !!(
    (filters.type && filters.type !== "all") ||
    filters.category ||
    filters.enterprise ||
    filters.city ||
    filters.profile ||
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined ||
    filters.rating !== undefined ||
    filters.comboAvailable !== undefined ||
    filters.isFeatured !== undefined
  );
}

export function clearPriceRange(filters: SearchFilters): SearchFilters {
  const { minPrice: _, maxPrice: __, ...rest } = filters;
  return rest;
}
