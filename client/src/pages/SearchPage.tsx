import { useEffect, useState, useCallback, useRef } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Search, SlidersHorizontal } from "lucide-react";
import SearchBar from "@/components/search/SearchBar";
import { HotelCategoryNav } from "@/components/hotel/HotelCategoryNav";
import { buildSectionTypeNav } from "@/lib/catalogNav";
import SearchFiltersDrawer from "@/components/search/SearchFiltersDrawer";
import { FilterPopover } from "@/components/search/FilterPopover";
import SearchResultsGrid from "@/components/search/SearchResultsGrid";
import SearchActiveFilters from "@/components/search/SearchActiveFilters";
import { useSearch } from "@/hooks/useSearch";
import { filtersToParams, paramsToFilters } from "@/lib/search-query";
import type { SearchFilters, SearchItem, SearchItemType } from "@/types/search";

function getInitialFilters(): SearchFilters {
  const fromUrl = paramsToFilters(new URLSearchParams(window.location.search));
  return { sort: "relevance", page: 1, limit: 20, ...fromUrl };
}

export default function SearchPage() {
  const [, navigate] = useLocation();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [accumulatedResults, setAccumulatedResults] = useState<SearchItem[]>([]);
  const prevFiltersRef = useRef<string>("");

  const { filters, setFilter, setFilters, clearFilters, hasActiveFilters, data, isLoading, isError } = useSearch(getInitialFilters());

  const syncUrl = useCallback((f: SearchFilters) => {
    const params = new URLSearchParams(filtersToParams(f));
    const newUrl = `/busca${params.toString() ? `?${params}` : ""}`;
    window.history.replaceState(null, "", newUrl);
  }, []);

  useEffect(() => { syncUrl(filters); }, [filters, syncUrl]);

  const filterKey = JSON.stringify({ ...filters, page: undefined, limit: undefined });
  useEffect(() => {
    if (filterKey !== prevFiltersRef.current) {
      prevFiltersRef.current = filterKey;
      setAccumulatedResults([]);
    }
  }, [filterKey]);

  useEffect(() => {
    if (data?.results) {
      if (filters.page === 1) {
        setAccumulatedResults(data.results);
      } else {
        setAccumulatedResults((prev) => {
          const existingIds = new Set(prev.map((r) => r.id));
          const newItems = data.results.filter((r) => !existingIds.has(r.id));
          return [...prev, ...newItems];
        });
      }
    }
  }, [data, filters.page]);

  const handleLoadMore = () => {
    const nextPage = (filters.page ?? 1) + 1;
    setFilter("page", nextPage);
  };

  const handleSearch = (q: string) => { setFilter("q", q); };

  const handleTypeChange = (type: SearchItemType | "all") => {
    setFilter("type", type === "all" ? undefined : type);
  };

  const handleFiltersChange = (partial: Partial<SearchFilters>) => {
    setFilters((prev) => ({ ...prev, ...partial, page: 1 }));
  };

  const handleRemoveFilter = (key: keyof SearchFilters) => {
    if (key === "minPrice") {
      setFilters((prev) => ({ ...prev, minPrice: undefined, maxPrice: undefined, page: 1 }));
    } else {
      setFilters((prev) => ({ ...prev, [key]: undefined, page: 1 }));
    }
  };

  const handleClearAll = () => { clearFilters(); };

  const handleItemSelect = (item: SearchItem) => {
    if (item.type === "hotel") navigate("/hoteis");
    else if (item.type === "park" || item.type === "attraction") navigate("/ingressos");
    else if (item.type === "destination") navigate("/mapa-caldas-novas");
    else if (item.type === "combo") navigate("/promocoes");
  };

  const activeType: SearchItemType | "all" = (filters.type as SearchItemType) || "all";
  const displayResults = accumulatedResults.length > 0 ? accumulatedResults : (data?.results ?? []);
  const hasMore = data?.hasMore ?? false;
  const isLoadingMore = isLoading && (filters.page ?? 1) > 1;

  return (
    <div style={{ minHeight: "100vh", background: "#F9FAFB" }}>
      <title>Busca — Reservei360</title>

      <div style={{
        background: "#fff",
        borderBottom: "1px solid #E5E7EB",
        position: "sticky", top: 0, zIndex: 50,
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "12px 20px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <button
              data-testid="button-search-back"
              onClick={() => navigate("/")}
              style={{
                border: "none", background: "#F3F4F6", cursor: "pointer",
                borderRadius: 10, padding: 10, display: "flex", flexShrink: 0,
                marginTop: 2,
              }}
            >
              <ArrowLeft style={{ width: 18, height: 18, color: "#374151" }} />
            </button>
            <div style={{ flex: 1 }}>
              <SearchBar
                value={filters.q ?? ""}
                activeType={activeType}
                onSearch={handleSearch}
                onTypeChange={handleTypeChange}
                onFiltersOpen={() => setMobileDrawerOpen(true)}
                hasActiveFilters={hasActiveFilters}
                hideTypeChips
              />
            </div>
          </div>
        </div>
        <div style={{ borderTop: "1px solid #F3F4F6" }}>
          <HotelCategoryNav
            categories={buildSectionTypeNav("busca")}
            activeFilter=""
            onSelect={(f) => { if (f.href) navigate(f.href) }}
          />
        </div>
      </div>

      <div
        style={{
          maxWidth: 1280, margin: "0 auto", padding: "20px 20px",
          display: "flex", flexDirection: "column", gap: 20,
        }}
      >
        <div style={{ flex: 1, minWidth: 0, width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <div className="rsv-search-desktop-only">
              <FilterPopover
                filters={filters}
                facets={data?.facets}
                onFiltersChange={handleFiltersChange}
                onClearAll={handleClearAll}
              />
            </div>
            <button
              data-testid="button-mobile-open-filters"
              className="rsv-search-mobile-only"
              onClick={() => setMobileDrawerOpen(true)}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "8px 14px", borderRadius: 10,
                border: hasActiveFilters ? "1.5px solid #2563EB" : "1.5px solid #E5E7EB",
                background: hasActiveFilters ? "#EFF6FF" : "#fff",
                color: hasActiveFilters ? "#2563EB" : "#374151",
                fontSize: 13, fontWeight: 600, cursor: "pointer",
              }}
            >
              <SlidersHorizontal style={{ width: 15, height: 15 }} />
              Filtros {hasActiveFilters ? "●" : ""}
            </button>
          </div>
          <style>{`
            .rsv-search-desktop-only { display: none; }
            .rsv-search-mobile-only { display: flex; }
            @media (min-width: 1024px) {
              .rsv-search-desktop-only { display: block; }
              .rsv-search-mobile-only { display: none !important; }
            }
          `}</style>

          {hasActiveFilters && (
            <div style={{ marginBottom: 14 }}>
              <SearchActiveFilters
                filters={filters}
                onRemove={handleRemoveFilter}
                onClearAll={handleClearAll}
              />
            </div>
          )}

          {isError ? (
            <div style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              padding: "64px 24px", textAlign: "center",
            }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>⚠️</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#1F2937", marginBottom: 6 }}>Erro ao buscar</div>
              <div style={{ fontSize: 14, color: "#9CA3AF" }}>Tente novamente em instantes.</div>
            </div>
          ) : (
            <SearchResultsGrid
              results={displayResults}
              total={data?.total ?? 0}
              isLoading={isLoading && (filters.page ?? 1) === 1}
              sort={filters.sort}
              onSortChange={(s) => setFilter("sort", s)}
              onItemSelect={handleItemSelect}
            />
          )}

          {hasMore && !isLoading && !isError && (
            <div style={{ display: "flex", justifyContent: "center", marginTop: 32 }}>
              <button
                data-testid="button-load-more"
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                style={{
                  padding: "12px 32px", borderRadius: 12,
                  border: "1.5px solid #2563EB",
                  background: "#fff", color: "#2563EB",
                  fontWeight: 700, fontSize: 15, cursor: isLoadingMore ? "default" : "pointer",
                  opacity: isLoadingMore ? 0.6 : 1,
                }}
              >
                {isLoadingMore ? "Carregando..." : "Carregar mais resultados"}
              </button>
            </div>
          )}
        </div>
      </div>

      <SearchFiltersDrawer
        open={mobileDrawerOpen}
        filters={filters}
        facets={data?.facets}
        onClose={() => setMobileDrawerOpen(false)}
        onFiltersChange={handleFiltersChange}
        onClearAll={handleClearAll}
      />
    </div>
  );
}

export function SearchPageEmpty() {
  const [, navigate] = useLocation();
  return (
    <div style={{ minHeight: "100vh", background: "#F9FAFB", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, textAlign: "center" }}>
      <Search style={{ width: 56, height: 56, color: "#CBD5E1", marginBottom: 16 }} />
      <div style={{ fontSize: 22, fontWeight: 800, color: "#1F2937", marginBottom: 8 }}>O que você procura?</div>
      <div style={{ fontSize: 14, color: "#9CA3AF", maxWidth: 300, lineHeight: 1.6, marginBottom: 24 }}>
        Busque por parques, hotéis, destinos ou combos em Caldas Novas e Rio Quente.
      </div>
      <button
        onClick={() => navigate("/busca")}
        style={{
          padding: "12px 28px", borderRadius: 12,
          background: "#2563EB", color: "#fff",
          fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer",
        }}
      >
        Explorar destinos
      </button>
    </div>
  );
}
