import type { SearchItemType } from "@/types/search";
import { TYPE_CHIPS } from "@/constants/search-taxonomy";

interface SearchChipsProps {
  activeType?: SearchItemType | "all";
  onTypeChange: (type: SearchItemType | "all") => void;
  showMap?: boolean;
  mapActive?: boolean;
  onMapToggle?: () => void;
}

export default function SearchChips({
  activeType = "all",
  onTypeChange,
  showMap = false,
  mapActive = false,
  onMapToggle,
}: SearchChipsProps) {
  return (
    <div
      data-testid="search-chips"
      style={{
        display: "flex",
        gap: 8,
        overflowX: "auto",
        paddingBottom: 2,
        scrollbarWidth: "none",
      }}
    >
      {TYPE_CHIPS.map((chip) => {
        const isActive = activeType === chip.value;
        return (
          <button
            key={chip.value}
            data-testid={`chip-type-${chip.value}`}
            onClick={() => onTypeChange(chip.value as SearchItemType | "all")}
            style={{
              padding: "6px 14px",
              borderRadius: 999,
              flexShrink: 0,
              border: isActive ? "1.5px solid #2563EB" : "1.5px solid #E5E7EB",
              background: isActive ? "#2563EB" : "#F9FAFB",
              color: isActive ? "#fff" : "#6B7280",
              fontSize: 13,
              fontWeight: isActive ? 700 : 500,
              cursor: "pointer",
              transition: "all 0.15s",
              whiteSpace: "nowrap",
            }}
          >
            {chip.label}
          </button>
        );
      })}
      {showMap && onMapToggle && (
        <button
          data-testid="chip-toggle-map"
          onClick={onMapToggle}
          style={{
            padding: "6px 14px",
            borderRadius: 999,
            flexShrink: 0,
            border: mapActive ? "1.5px solid #2563EB" : "1.5px solid #E5E7EB",
            background: mapActive ? "#2563EB" : "#F9FAFB",
            color: mapActive ? "#fff" : "#6B7280",
            fontSize: 13,
            fontWeight: mapActive ? 700 : 500,
            cursor: "pointer",
            transition: "all 0.15s",
            whiteSpace: "nowrap",
          }}
        >
          No mapa
        </button>
      )}
    </div>
  );
}
