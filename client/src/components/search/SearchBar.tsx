import { useState, useRef, useEffect } from "react";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { useSearchSuggest } from "@/hooks/useSearch";
import SearchSuggestions from "./SearchSuggestions";
import type { SearchItemType } from "@/types/search";

const TYPE_CHIPS: { label: string; value: SearchItemType | "all" }[] = [
  { label: "Tudo", value: "all" },
  { label: "Parques", value: "park" },
  { label: "Hotéis", value: "hotel" },
  { label: "Destinos", value: "destination" },
  { label: "Combos", value: "combo" },
];

interface SearchBarProps {
  value: string;
  activeType?: SearchItemType | "all";
  onSearch: (q: string) => void;
  onTypeChange: (type: SearchItemType | "all") => void;
  onFiltersOpen: () => void;
  hasActiveFilters?: boolean;
}

export default function SearchBar({ value, activeType = "all", onSearch, onTypeChange, onFiltersOpen, hasActiveFilters }: SearchBarProps) {
  const [inputValue, setInputValue] = useState(value);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: suggestions } = useSearchSuggest(inputValue);

  useEffect(() => { setInputValue(value); }, [value]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setShowSuggestions(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch(inputValue);
      setShowSuggestions(false);
      inputRef.current?.blur();
    }
    if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  const handleClear = () => {
    setInputValue("");
    onSearch("");
    inputRef.current?.focus();
  };

  const handleSuggestionSelect = (name: string) => {
    setInputValue(name);
    onSearch(name);
    setShowSuggestions(false);
  };

  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        background: "#fff", border: "2px solid #E5E7EB",
        borderRadius: 14, padding: "10px 14px",
        boxShadow: showSuggestions ? "0 0 0 3px rgba(37,99,235,0.1)" : "0 2px 8px rgba(0,0,0,0.06)",
        transition: "box-shadow 0.2s, border-color 0.2s",
        borderColor: showSuggestions ? "#2563EB" : "#E5E7EB",
      }}>
        <Search style={{ width: 18, height: 18, color: "#9CA3AF", flexShrink: 0 }} />
        <input
          ref={inputRef}
          data-testid="input-search-main"
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          placeholder="Busque parque, hotel, destino, endereço ou empreendimento"
          style={{
            flex: 1, border: "none", outline: "none",
            fontSize: 14, color: "#1F2937", background: "transparent",
            minWidth: 0,
          }}
        />
        {inputValue && (
          <button
            data-testid="button-search-clear"
            onClick={handleClear}
            style={{ border: "none", background: "none", cursor: "pointer", padding: 2, display: "flex", color: "#9CA3AF" }}
          >
            <X style={{ width: 16, height: 16 }} />
          </button>
        )}
        <div style={{ width: 1, height: 20, background: "#E5E7EB", flexShrink: 0 }} />
        <button
          data-testid="button-search-filters"
          onClick={onFiltersOpen}
          style={{
            border: "none", background: "none", cursor: "pointer",
            display: "flex", alignItems: "center", gap: 4,
            fontSize: 13, fontWeight: 600,
            color: hasActiveFilters ? "#2563EB" : "#6B7280",
            padding: "2px 4px", borderRadius: 6, flexShrink: 0,
          }}
        >
          <SlidersHorizontal style={{ width: 16, height: 16 }} />
          <span style={{ display: "none" }}>Filtros</span>
        </button>
      </div>

      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingTop: 10, paddingBottom: 2, scrollbarWidth: "none" }}>
        {TYPE_CHIPS.map((chip) => {
          const isActive = activeType === chip.value;
          return (
            <button
              key={chip.value}
              data-testid={`chip-type-${chip.value}`}
              onClick={() => onTypeChange(chip.value)}
              style={{
                padding: "6px 14px", borderRadius: 999, flexShrink: 0,
                border: isActive ? "1.5px solid #2563EB" : "1.5px solid #E5E7EB",
                background: isActive ? "#2563EB" : "#F9FAFB",
                color: isActive ? "#fff" : "#6B7280",
                fontSize: 13, fontWeight: isActive ? 700 : 500,
                cursor: "pointer", transition: "all 0.15s",
                whiteSpace: "nowrap",
              }}
            >
              {chip.label}
            </button>
          );
        })}
      </div>

      {showSuggestions && suggestions && (
        <SearchSuggestions
          suggestions={suggestions}
          query={inputValue}
          onSelect={handleSuggestionSelect}
          onClose={() => setShowSuggestions(false)}
        />
      )}
    </div>
  );
}
