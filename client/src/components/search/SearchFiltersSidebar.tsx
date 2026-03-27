import { SlidersHorizontal, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import type { SearchFilters, SearchFacets } from "@/types/search";

const PROFILES = [
  { value: "familia", label: "Família" },
  { value: "casal", label: "Casal" },
  { value: "aventura", label: "Aventura" },
  { value: "relaxar", label: "Relaxar" },
  { value: "premium", label: "Premium" },
  { value: "economia", label: "Econômico" },
];

const CITIES = ["Caldas Novas", "Rio Quente"];
const RATINGS = [{ value: 4.5, label: "4.5+ ★" }, { value: 4.0, label: "4.0+ ★" }, { value: 3.5, label: "3.5+ ★" }];
const PRICE_RANGES = [
  { label: "Até R$ 200", min: 0, max: 200 },
  { label: "R$ 200–500", min: 200, max: 500 },
  { label: "R$ 500–1000", min: 500, max: 1000 },
  { label: "Acima de R$ 1000", min: 1000, max: undefined },
];

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function FilterSection({ title, children, defaultOpen = true }: FilterSectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ borderBottom: "1px solid #F3F4F6", paddingBottom: 14, marginBottom: 14 }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
          border: "none", background: "none", cursor: "pointer",
          fontSize: 12, fontWeight: 700, color: "#374151", padding: "0 0 8px",
          textTransform: "uppercase", letterSpacing: "0.04em",
        }}
      >
        {title}
        {open
          ? <ChevronUp style={{ width: 13, height: 13, color: "#9CA3AF" }} />
          : <ChevronDown style={{ width: 13, height: 13, color: "#9CA3AF" }} />}
      </button>
      {open && children}
    </div>
  );
}

interface SearchFiltersSidebarProps {
  filters: SearchFilters;
  facets?: SearchFacets;
  onFiltersChange: (filters: Partial<SearchFilters>) => void;
  onClearAll: () => void;
}

export default function SearchFiltersSidebar({ filters, facets, onFiltersChange, onClearAll }: SearchFiltersSidebarProps) {
  const toggle = <K extends keyof SearchFilters>(key: K, val: SearchFilters[K]) => {
    onFiltersChange({ [key]: filters[key] === val ? undefined : val });
  };

  const activePriceRange = PRICE_RANGES.find((r) => r.min === filters.minPrice && r.max === filters.maxPrice);

  const enterpriseEntries = facets?.enterprises
    ? Object.entries(facets.enterprises).sort((a, b) => b[1] - a[1]).slice(0, 10)
    : [];
  const categoryEntries = facets?.categories
    ? Object.entries(facets.categories).sort((a, b) => b[1] - a[1]).slice(0, 8)
    : [];

  const hasActive = !!(
    filters.type || filters.city || filters.enterprise || filters.category ||
    filters.profile || filters.minPrice !== undefined || filters.maxPrice !== undefined ||
    filters.rating !== undefined || filters.comboAvailable || filters.isFeatured
  );

  return (
    <aside style={{
      width: 240, flexShrink: 0,
      background: "#fff", borderRadius: 14,
      border: "1.5px solid #E5E7EB",
      padding: "16px 16px",
      alignSelf: "flex-start",
      position: "sticky", top: 84,
      maxHeight: "calc(100vh - 104px)",
      overflowY: "auto",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <SlidersHorizontal style={{ width: 15, height: 15, color: "#6B7280" }} />
          <span style={{ fontSize: 14, fontWeight: 800, color: "#1F2937" }}>Filtros</span>
        </div>
        {hasActive && (
          <button
            data-testid="button-clear-all-sidebar"
            onClick={onClearAll}
            style={{ border: "none", background: "none", cursor: "pointer", fontSize: 11, color: "#2563EB", fontWeight: 700 }}
          >
            Limpar tudo
          </button>
        )}
      </div>

      <FilterSection title="Cidade / Região">
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {CITIES.map((c) => (
            <label
              key={c}
              data-testid={`sidebar-city-${c}`}
              style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}
            >
              <input
                type="radio"
                name="city"
                checked={filters.city === c}
                onChange={() => toggle("city", c)}
                style={{ width: 14, height: 14, accentColor: "#2563EB" }}
              />
              <span style={{ fontSize: 13, color: "#374151", fontWeight: filters.city === c ? 700 : 400 }}>{c}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {enterpriseEntries.length > 0 && (
        <FilterSection title="Empreendimento">
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {enterpriseEntries.map(([val, count]) => (
              <label
                key={val}
                data-testid={`sidebar-enterprise-${val}`}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input
                    type="radio"
                    name="enterprise"
                    checked={filters.enterprise === val}
                    onChange={() => toggle("enterprise", val)}
                    style={{ width: 14, height: 14, accentColor: "#7C3AED" }}
                  />
                  <span style={{ fontSize: 12, color: "#374151", fontWeight: filters.enterprise === val ? 700 : 400 }}>{val}</span>
                </div>
                <span style={{ fontSize: 10, color: "#9CA3AF", background: "#F3F4F6", borderRadius: 999, padding: "1px 5px" }}>
                  {count}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>
      )}

      {categoryEntries.length > 0 && (
        <FilterSection title="Categoria" defaultOpen={false}>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {categoryEntries.map(([val, count]) => (
              <label
                key={val}
                data-testid={`sidebar-category-${val}`}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input
                    type="radio"
                    name="category"
                    checked={filters.category === val}
                    onChange={() => toggle("category", val)}
                    style={{ width: 14, height: 14, accentColor: "#059669" }}
                  />
                  <span style={{ fontSize: 12, color: "#374151", fontWeight: filters.category === val ? 700 : 400 }}>{val}</span>
                </div>
                <span style={{ fontSize: 10, color: "#9CA3AF", background: "#F3F4F6", borderRadius: 999, padding: "1px 5px" }}>
                  {count}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>
      )}

      <FilterSection title="Perfil da viagem">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
          {PROFILES.map((p) => (
            <button
              key={p.value}
              data-testid={`sidebar-profile-${p.value}`}
              onClick={() => toggle("profile", p.value)}
              style={{
                padding: "4px 10px", borderRadius: 999, cursor: "pointer",
                border: filters.profile === p.value ? "1.5px solid #7C3AED" : "1.5px solid #E5E7EB",
                background: filters.profile === p.value ? "#F5F3FF" : "#F9FAFB",
                color: filters.profile === p.value ? "#7C3AED" : "#6B7280",
                fontSize: 11, fontWeight: filters.profile === p.value ? 700 : 500,
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Faixa de preço">
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          {PRICE_RANGES.map((range) => {
            const isActive = activePriceRange === range;
            return (
              <label
                key={range.label}
                data-testid={`sidebar-price-${range.label}`}
                style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}
              >
                <input
                  type="radio"
                  name="price"
                  checked={isActive}
                  onChange={() => {
                    if (isActive) onFiltersChange({ minPrice: undefined, maxPrice: undefined });
                    else onFiltersChange({ minPrice: range.min, maxPrice: range.max });
                  }}
                  style={{ width: 14, height: 14, accentColor: "#059669" }}
                />
                <span style={{ fontSize: 12, color: "#374151", fontWeight: isActive ? 700 : 400 }}>{range.label}</span>
              </label>
            );
          })}
        </div>
      </FilterSection>

      <FilterSection title="Avaliação mínima">
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          {RATINGS.map((r) => (
            <label
              key={r.value}
              data-testid={`sidebar-rating-${r.value}`}
              style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}
            >
              <input
                type="radio"
                name="rating"
                checked={filters.rating === r.value}
                onChange={() => toggle("rating", r.value)}
                style={{ width: 14, height: 14, accentColor: "#F59E0B" }}
              />
              <span style={{ fontSize: 12, color: "#374151", fontWeight: filters.rating === r.value ? 700 : 400 }}>{r.label}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Outros" defaultOpen={false}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { key: "comboAvailable" as const, label: "Combo disponível" },
            { key: "isFeatured" as const, label: "Mais vendidos" },
          ].map(({ key, label }) => (
            <label
              key={key}
              data-testid={`sidebar-toggle-${key}`}
              style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}
            >
              <input
                type="checkbox"
                checked={filters[key] === true}
                onChange={(e) => onFiltersChange({ [key]: e.target.checked ? true : undefined })}
                style={{ width: 14, height: 14, accentColor: "#2563EB" }}
              />
              <span style={{ fontSize: 12, color: "#374151", fontWeight: 400 }}>{label}</span>
            </label>
          ))}
        </div>
      </FilterSection>
    </aside>
  );
}
