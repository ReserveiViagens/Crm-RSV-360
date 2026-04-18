import { MapPin, Building2, Hotel, Package2, Waves } from "lucide-react";
import type { SearchItem, SearchItemType } from "@/types/search";

const TYPE_ICON: Record<SearchItemType | string, React.ComponentType<{ style?: React.CSSProperties }>> = {
  park: Waves,
  hotel: Hotel,
  destination: MapPin,
  combo: Package2,
  attraction: Building2,
};

const TYPE_LABEL: Record<SearchItemType | string, string> = {
  park: "Parque",
  hotel: "Hotel",
  destination: "Destino",
  combo: "Combo",
  attraction: "Atração",
};

const TYPE_COLOR: Record<SearchItemType | string, string> = {
  park: "#2563EB",
  hotel: "#7C3AED",
  destination: "#059669",
  combo: "#F57C00",
  attraction: "#DC2626",
};

function highlightText(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  const words = query.toLowerCase().split(" ").filter((w) => w.length >= 2);
  if (!words.length) return text;
  const pattern = new RegExp(`(${words.join("|")})`, "gi");
  const parts = text.split(pattern);
  return parts.map((part, i) => {
    const isMatch = words.some((w) => part.toLowerCase() === w.toLowerCase());
    return isMatch
      ? <mark key={i} style={{ background: "#FEF08A", borderRadius: 2, fontWeight: 700 }}>{part}</mark>
      : part;
  });
}

interface SuggestionItemProps {
  item: SearchItem;
  query: string;
  onSelect: (name: string) => void;
}

function SuggestionItem({ item, query, onSelect }: SuggestionItemProps) {
  const Icon = TYPE_ICON[item.type] ?? Building2;
  const color = TYPE_COLOR[item.type] ?? "#6B7280";
  const label = TYPE_LABEL[item.type] ?? item.type;

  return (
    <button
      data-testid={`suggestion-item-${item.id}`}
      onClick={() => onSelect(item.name)}
      style={{
        width: "100%", textAlign: "left",
        display: "flex", alignItems: "center", gap: 10,
        padding: "8px 12px", border: "none",
        background: "transparent", cursor: "pointer",
        borderRadius: 8, transition: "background 0.1s",
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#F3F4F6"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
    >
      <div style={{
        width: 32, height: 32, borderRadius: 8, flexShrink: 0,
        background: `${color}15`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Icon style={{ width: 15, height: 15, color }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#1F2937", lineHeight: 1.3 }}>
          {highlightText(item.name, query)}
        </div>
        <div style={{ fontSize: 11, color: "#9CA3AF" }}>
          {item.city}{item.enterpriseName ? ` · ${item.enterpriseName}` : ""}
        </div>
      </div>
      <span style={{
        fontSize: 10, fontWeight: 600, color,
        background: `${color}15`, padding: "2px 7px", borderRadius: 999, flexShrink: 0,
      }}>
        {label}
      </span>
    </button>
  );
}

interface SearchSuggestionsProps {
  suggestions: { names: SearchItem[]; enterprises: SearchItem[]; destinations: SearchItem[]; featured: SearchItem[] };
  query: string;
  onSelect: (name: string) => void;
  onClose: () => void;
}

function SuggestionGroup({ title, items, query, onSelect }: { title: string; items: SearchItem[]; query: string; onSelect: (name: string) => void }) {
  if (items.length === 0) return null;
  return (
    <div>
      <div style={{ fontSize: 10, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em", padding: "6px 14px 2px" }}>
        {title}
      </div>
      {items.map((item) => (
        <SuggestionItem key={item.id} item={item} query={query} onSelect={onSelect} />
      ))}
    </div>
  );
}

export default function SearchSuggestions({ suggestions, query, onSelect }: SearchSuggestionsProps) {
  const { names, enterprises, destinations, featured } = suggestions;

  const parks = names.filter((i) => i.type === "park");
  const hotels = names.filter((i) => i.type === "hotel");
  const combos = names.filter((i) => i.type === "combo");
  const others = names.filter((i) => !["park", "hotel", "combo"].includes(i.type));

  const hasResults = names.length > 0 || destinations.length > 0 || enterprises.length > 0;

  if (!hasResults && !query) return null;

  return (
    <div style={{
      position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0,
      background: "#fff", borderRadius: 12,
      border: "1.5px solid #E5E7EB",
      boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
      zIndex: 100, overflow: "hidden", maxHeight: 420, overflowY: "auto",
    }}>
      {!hasResults && query && (
        <div style={{ padding: "10px 14px" }}>
          <p style={{ fontSize: 13, color: "#9CA3AF", margin: 0 }}>
            Nenhuma sugestão para "<strong>{query}</strong>". Pressione Enter para buscar.
          </p>
          {featured.length > 0 && (
            <>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 10, marginBottom: 4 }}>
                Em destaque
              </div>
              {featured.map((item) => (
                <SuggestionItem key={item.id} item={item} query="" onSelect={onSelect} />
              ))}
            </>
          )}
        </div>
      )}

      {hasResults && (
        <div style={{ padding: "6px 0" }}>
          <SuggestionGroup title="Destinos" items={destinations} query={query} onSelect={onSelect} />
          <SuggestionGroup title="Empreendimentos" items={enterprises.filter((i) => !destinations.find((d) => d.id === i.id)).slice(0, 3)} query={query} onSelect={onSelect} />
          <SuggestionGroup title="Parques" items={parks} query={query} onSelect={onSelect} />
          <SuggestionGroup title="Hotéis" items={hotels} query={query} onSelect={onSelect} />
          <SuggestionGroup title="Combos" items={combos} query={query} onSelect={onSelect} />
          <SuggestionGroup title="Outros" items={others} query={query} onSelect={onSelect} />
        </div>
      )}
    </div>
  );
}
