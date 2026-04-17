import { X, SlidersHorizontal, ChevronDown, ChevronUp } from "lucide-react";
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
    <div style={{ borderBottom: "1px solid #F3F4F6", paddingBottom: 16, marginBottom: 16 }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
          border: "none", background: "none", cursor: "pointer",
          fontSize: 13, fontWeight: 700, color: "#374151", padding: "0 0 8px",
        }}
      >
        {title}
        {open ? <ChevronUp style={{ width: 14, height: 14, color: "#9CA3AF" }} /> : <ChevronDown style={{ width: 14, height: 14, color: "#9CA3AF" }} />}
      </button>
      {open && children}
    </div>
  );
}

function FacetToggleGroup({
  items,
  active,
  onToggle,
  color = "#2563EB",
  bg = "#EFF6FF",
  testPrefix,
}: {
  items: [string, number][];
  active: string | undefined;
  onToggle: (val: string) => void;
  color?: string;
  bg?: string;
  testPrefix: string;
}) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {items.map(([val, count]) => (
        <button
          key={val}
          data-testid={`${testPrefix}-${val}`}
          onClick={() => onToggle(val)}
          style={{
            padding: "5px 12px", borderRadius: 999, cursor: "pointer",
            border: active === val ? `1.5px solid ${color}` : "1.5px solid #E5E7EB",
            background: active === val ? bg : "#F9FAFB",
            color: active === val ? color : "#6B7280",
            fontSize: 12, fontWeight: active === val ? 700 : 500,
            display: "flex", alignItems: "center", gap: 5,
          }}
        >
          {val}
          <span style={{
            fontSize: 10, fontWeight: 700,
            background: active === val ? `${color}20` : "#E5E7EB",
            color: active === val ? color : "#9CA3AF",
            borderRadius: 999, padding: "1px 5px",
          }}>
            {count}
          </span>
        </button>
      ))}
    </div>
  );
}

interface SearchFiltersDrawerProps {
  open: boolean;
  filters: SearchFilters;
  facets?: SearchFacets;
  onClose: () => void;
  onFiltersChange: (filters: Partial<SearchFilters>) => void;
  onClearAll: () => void;
}

export default function SearchFiltersDrawer({ open, filters, facets, onClose, onFiltersChange, onClearAll }: SearchFiltersDrawerProps) {
  if (!open) return null;

  const toggle = <K extends keyof SearchFilters>(key: K, val: SearchFilters[K]) => {
    onFiltersChange({ [key]: filters[key] === val ? undefined : val });
  };

  const activePriceRange = PRICE_RANGES.find((r) => r.min === filters.minPrice && r.max === filters.maxPrice);

  const enterpriseEntries = facets?.enterprises ? Object.entries(facets.enterprises).sort((a, b) => b[1] - a[1]) : [];
  const categoryEntries = facets?.categories ? Object.entries(facets.categories).sort((a, b) => b[1] - a[1]) : [];

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)",
          zIndex: 200, backdropFilter: "blur(2px)",
        }}
      />
      <div style={{
        position: "fixed", right: 0, top: 0, bottom: 0, width: "min(400px, 100vw)",
        background: "#fff", zIndex: 201, overflowY: "auto",
        boxShadow: "-4px 0 24px rgba(0,0,0,0.12)",
        display: "flex", flexDirection: "column",
      }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "16px 20px", borderBottom: "1px solid #E5E7EB",
          position: "sticky", top: 0, background: "#fff", zIndex: 1,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <SlidersHorizontal style={{ width: 18, height: 18, color: "#1F2937" }} />
            <span style={{ fontSize: 16, fontWeight: 800, color: "#1F2937" }}>Filtros</span>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button
              data-testid="button-clear-all-filters"
              onClick={onClearAll}
              style={{ border: "none", background: "none", cursor: "pointer", fontSize: 13, color: "#2563EB", fontWeight: 600 }}
            >
              Limpar tudo
            </button>
            <button
              data-testid="button-close-filters"
              onClick={onClose}
              style={{ border: "none", background: "#F3F4F6", cursor: "pointer", borderRadius: 8, padding: 6, display: "flex" }}
            >
              <X style={{ width: 16, height: 16, color: "#6B7280" }} />
            </button>
          </div>
        </div>

        <div style={{ padding: "16px 20px", flex: 1 }}>
          <FilterSection title="Cidade / Região">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {CITIES.map((c) => (
                <button
                  key={c}
                  data-testid={`filter-city-${c}`}
                  onClick={() => toggle("city", c)}
                  style={{
                    padding: "6px 14px", borderRadius: 999, cursor: "pointer",
                    border: filters.city === c ? "1.5px solid #2563EB" : "1.5px solid #E5E7EB",
                    background: filters.city === c ? "#EFF6FF" : "#F9FAFB",
                    color: filters.city === c ? "#2563EB" : "#6B7280",
                    fontSize: 13, fontWeight: filters.city === c ? 700 : 500,
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
          </FilterSection>

          {enterpriseEntries.length > 0 && (
            <FilterSection title="Empreendimento">
              <FacetToggleGroup
                items={enterpriseEntries}
                active={filters.enterprise}
                onToggle={(val) => toggle("enterprise", val)}
                color="#7C3AED"
                bg="#F5F3FF"
                testPrefix="filter-enterprise"
              />
            </FilterSection>
          )}

          {categoryEntries.length > 0 && (
            <FilterSection title="Categoria" defaultOpen={false}>
              <FacetToggleGroup
                items={categoryEntries}
                active={filters.category}
                onToggle={(val) => toggle("category", val)}
                color="#059669"
                bg="#F0FDF4"
                testPrefix="filter-category"
              />
            </FilterSection>
          )}

          <FilterSection title="Perfil da viagem">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {PROFILES.map((p) => (
                <button
                  key={p.value}
                  data-testid={`filter-profile-${p.value}`}
                  onClick={() => toggle("profile", p.value)}
                  style={{
                    padding: "6px 14px", borderRadius: 999, cursor: "pointer",
                    border: filters.profile === p.value ? "1.5px solid #7C3AED" : "1.5px solid #E5E7EB",
                    background: filters.profile === p.value ? "#F5F3FF" : "#F9FAFB",
                    color: filters.profile === p.value ? "#7C3AED" : "#6B7280",
                    fontSize: 13, fontWeight: filters.profile === p.value ? 700 : 500,
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Faixa de preço">
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {PRICE_RANGES.map((range) => {
                const isActive = activePriceRange === range;
                return (
                  <button
                    key={range.label}
                    data-testid={`filter-price-${range.label}`}
                    onClick={() => {
                      if (isActive) {
                        onFiltersChange({ minPrice: undefined, maxPrice: undefined });
                      } else {
                        onFiltersChange({ minPrice: range.min, maxPrice: range.max });
                      }
                    }}
                    style={{
                      display: "flex", alignItems: "center", gap: 10,
                      padding: "8px 12px", borderRadius: 8,
                      border: isActive ? "1.5px solid #059669" : "1.5px solid #E5E7EB",
                      background: isActive ? "#F0FDF4" : "#F9FAFB",
                      color: isActive ? "#065F46" : "#6B7280",
                      fontSize: 13, fontWeight: isActive ? 700 : 500,
                      cursor: "pointer", textAlign: "left",
                    }}
                  >
                    <div style={{
                      width: 16, height: 16, borderRadius: "50%",
                      border: `2px solid ${isActive ? "#059669" : "#D1D5DB"}`,
                      background: isActive ? "#059669" : "transparent",
                      flexShrink: 0,
                    }} />
                    {range.label}
                  </button>
                );
              })}
            </div>
          </FilterSection>

          <FilterSection title="Avaliação mínima">
            <div style={{ display: "flex", gap: 8 }}>
              {RATINGS.map((r) => (
                <button
                  key={r.value}
                  data-testid={`filter-rating-${r.value}`}
                  onClick={() => toggle("rating", r.value)}
                  style={{
                    padding: "6px 12px", borderRadius: 8, cursor: "pointer",
                    border: filters.rating === r.value ? "1.5px solid #F59E0B" : "1.5px solid #E5E7EB",
                    background: filters.rating === r.value ? "#FFFBEB" : "#F9FAFB",
                    color: filters.rating === r.value ? "#92400E" : "#6B7280",
                    fontSize: 13, fontWeight: filters.rating === r.value ? 700 : 500,
                  }}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Outros filtros" defaultOpen={false}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { key: "comboAvailable" as const, label: "Combo disponível" },
                { key: "isFeatured" as const, label: "Mais vendidos" },
              ].map(({ key, label }) => (
                <label
                  key={key}
                  data-testid={`filter-toggle-${key}`}
                  style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
                >
                  <input
                    type="checkbox"
                    checked={filters[key] === true}
                    onChange={(e) => onFiltersChange({ [key]: e.target.checked ? true : undefined })}
                    style={{ width: 16, height: 16, accentColor: "#2563EB" }}
                  />
                  <span style={{ fontSize: 13, color: "#374151", fontWeight: 500 }}>{label}</span>
                </label>
              ))}
            </div>
          </FilterSection>
        </div>

        <div style={{
          padding: "14px 20px", borderTop: "1px solid #E5E7EB",
          position: "sticky", bottom: 0, background: "#fff",
        }}>
          <button
            data-testid="button-apply-filters"
            onClick={onClose}
            style={{
              width: "100%", padding: "13px", borderRadius: 12,
              background: "linear-gradient(135deg, #2563EB, #1D4ED8)",
              color: "#fff", fontWeight: 700, fontSize: 15,
              border: "none", cursor: "pointer",
            }}
          >
            Ver resultados
          </button>
        </div>
      </div>
    </>
  );
}
