import { SearchX } from "lucide-react";
import type { SearchItem } from "@/types/search";

interface SearchEmptyStateProps {
  query?: string;
  suggestions?: SearchItem[];
  onSuggestionClick?: (name: string) => void;
  onClearFilters?: () => void;
}

export default function SearchEmptyState({ query, suggestions, onSuggestionClick, onClearFilters }: SearchEmptyStateProps) {
  return (
    <div
      data-testid="search-empty-state"
      style={{
        textAlign: "center",
        padding: "48px 24px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
      }}
    >
      <SearchX style={{ width: 48, height: 48, color: "#D1D5DB" }} />
      <div>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: 0 }}>
          {query ? `Nenhum resultado para "${query}"` : "Nenhum resultado encontrado"}
        </h3>
        <p style={{ fontSize: 14, color: "#6B7280", marginTop: 8, marginBottom: 0 }}>
          Tente ajustar os filtros ou buscar com outros termos.
        </p>
      </div>

      {onClearFilters && (
        <button
          data-testid="button-empty-clear-filters"
          onClick={onClearFilters}
          style={{
            padding: "8px 20px",
            borderRadius: 8,
            border: "1.5px solid #2563EB",
            background: "#fff",
            color: "#2563EB",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Limpar filtros
        </button>
      )}

      {suggestions && suggestions.length > 0 && (
        <div style={{ width: "100%", maxWidth: 400 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 12 }}>
            Você pode gostar de:
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {suggestions.map((item) => (
              <button
                key={item.id}
                data-testid={`suggestion-item-${item.id}`}
                onClick={() => onSuggestionClick?.(item.name)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 14px",
                  border: "1px solid #E5E7EB",
                  borderRadius: 10,
                  background: "#F9FAFB",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "background 0.15s",
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 600, color: "#1F2937" }}>{item.name}</span>
                <span style={{ fontSize: 12, color: "#6B7280" }}>
                  {item.priceFrom > 0 ? `A partir de R$ ${item.priceFrom}` : "Destino"}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
