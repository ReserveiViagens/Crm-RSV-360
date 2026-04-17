import { X } from "lucide-react";
import type { SearchFilters } from "@/types/search";

const TYPE_LABEL: Record<string, string> = {
  park: "Parques",
  hotel: "Hotéis",
  destination: "Destinos",
  combo: "Combos",
  attraction: "Atrações",
};

const PROFILE_LABEL: Record<string, string> = {
  familia: "Família",
  casal: "Casal",
  aventura: "Aventura",
  relaxar: "Relaxar",
  premium: "Premium",
  economia: "Econômico",
};

interface ActiveFilterChipProps {
  label: string;
  onRemove: () => void;
}

function ActiveFilterChip({ label, onRemove }: ActiveFilterChipProps) {
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: "#EFF6FF", border: "1px solid #BFDBFE",
      borderRadius: 999, padding: "4px 10px",
      fontSize: 12, fontWeight: 600, color: "#1D4ED8",
    }}>
      {label}
      <button
        onClick={onRemove}
        style={{ border: "none", background: "none", cursor: "pointer", display: "flex", padding: 0, color: "#1D4ED8" }}
      >
        <X style={{ width: 12, height: 12 }} />
      </button>
    </div>
  );
}

interface SearchActiveFiltersProps {
  filters: SearchFilters;
  onRemove: (key: keyof SearchFilters) => void;
  onClearAll: () => void;
}

export default function SearchActiveFilters({ filters, onRemove, onClearAll }: SearchActiveFiltersProps) {
  const chips: { key: keyof SearchFilters; label: string }[] = [];

  if (filters.type) chips.push({ key: "type", label: TYPE_LABEL[filters.type] ?? filters.type });
  if (filters.city) chips.push({ key: "city", label: `📍 ${filters.city}` });
  if (filters.enterprise) chips.push({ key: "enterprise", label: `🏢 ${filters.enterprise}` });
  if (filters.category) chips.push({ key: "category", label: filters.category });
  if (filters.profile) chips.push({ key: "profile", label: PROFILE_LABEL[filters.profile] ?? filters.profile });
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    const label = filters.maxPrice !== undefined
      ? `R$ ${filters.minPrice ?? 0}–${filters.maxPrice}`
      : `A partir de R$ ${filters.minPrice}`;
    chips.push({ key: "minPrice", label });
  }
  if (filters.rating !== undefined) chips.push({ key: "rating", label: `${filters.rating}+ ★` });
  if (filters.comboAvailable) chips.push({ key: "comboAvailable", label: "Combo disponível" });
  if (filters.isFeatured) chips.push({ key: "isFeatured", label: "Mais vendidos" });

  if (chips.length === 0) return null;

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
      {chips.map(({ key, label }) => (
        <ActiveFilterChip
          key={key}
          label={label}
          onRemove={() => onRemove(key)}
        />
      ))}
      <button
        data-testid="button-clear-all-chips"
        onClick={onClearAll}
        style={{
          border: "none", background: "none", cursor: "pointer",
          fontSize: 12, fontWeight: 600, color: "#6B7280",
          textDecoration: "underline", padding: "4px 0",
        }}
      >
        Limpar tudo
      </button>
    </div>
  );
}
