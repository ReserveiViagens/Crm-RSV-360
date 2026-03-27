import { Star, MapPin, Waves, Hotel, Package2, Building2, Tag, ChevronRight } from "lucide-react";
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

interface SearchResultCardProps {
  item: SearchItem;
  onSelect?: (item: SearchItem) => void;
}

export default function SearchResultCard({ item, onSelect }: SearchResultCardProps) {
  const Icon = TYPE_ICON[item.type] ?? Building2;
  const color = TYPE_COLOR[item.type] ?? "#6B7280";
  const label = TYPE_LABEL[item.type] ?? item.type;

  const imgSrc = item.images?.[0] ?? "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80";

  return (
    <div
      data-testid={`card-result-${item.id}`}
      onClick={() => onSelect?.(item)}
      style={{
        display: "flex", flexDirection: "column",
        background: "#fff", borderRadius: 16,
        border: "1.5px solid #F3F4F6",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        overflow: "hidden", cursor: "pointer",
        transition: "box-shadow 0.18s, transform 0.18s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)";
        (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)";
        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
      }}
    >
      <div style={{ position: "relative", aspectRatio: "16/9", overflow: "hidden" }}>
        <img
          src={imgSrc}
          alt={item.name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div style={{
          position: "absolute", top: 10, left: 10,
          background: `${color}E6`, borderRadius: 8,
          padding: "3px 8px", display: "flex", alignItems: "center", gap: 4,
        }}>
          <Icon style={{ width: 12, height: 12, color: "#fff" }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>{label}</span>
        </div>
        {item.isFeatured && (
          <div style={{
            position: "absolute", top: 10, right: 10,
            background: "#FBBF24", borderRadius: 8,
            padding: "3px 8px", fontSize: 11, fontWeight: 700, color: "#92400E",
          }}>
            ⭐ Destaque
          </div>
        )}
        {item.comboAvailable && (
          <div style={{
            position: "absolute", bottom: 10, left: 10,
            background: "rgba(0,0,0,0.6)", borderRadius: 8,
            padding: "3px 8px", display: "flex", alignItems: "center", gap: 4,
          }}>
            <Tag style={{ width: 11, height: 11, color: "#34D399" }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: "#34D399" }}>Combo disponível</span>
          </div>
        )}
      </div>

      <div style={{ padding: "12px 14px", flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: "#1F2937", lineHeight: 1.3 }}>{item.name}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <MapPin style={{ width: 12, height: 12, color: "#9CA3AF" }} />
          <span style={{ fontSize: 12, color: "#9CA3AF" }}>{item.city}, {item.state}</span>
        </div>
        <div style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.5, marginTop: 2 }}>
          {item.descriptionShort}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto", paddingTop: 10, borderTop: "1px solid #F3F4F6" }}>
          <div>
            {item.priceFrom > 0 ? (
              <div>
                <span style={{ fontSize: 11, color: "#9CA3AF" }}>A partir de </span>
                <span style={{ fontSize: 16, fontWeight: 800, color: "#1F2937" }}>
                  R$ {item.priceFrom.toLocaleString("pt-BR")}
                </span>
                <span style={{ fontSize: 11, color: "#9CA3AF" }}>/pessoa</span>
              </div>
            ) : (
              <span style={{ fontSize: 12, color: "#059669", fontWeight: 600 }}>Consultar disponibilidade</span>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Star style={{ width: 13, height: 13, color: "#FBBF24", fill: "#FBBF24" }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: "#1F2937" }}>{item.rating.toFixed(1)}</span>
            <span style={{ fontSize: 11, color: "#9CA3AF" }}>({item.reviewCount.toLocaleString("pt-BR")})</span>
          </div>
        </div>
      </div>

      <div style={{
        padding: "10px 14px", background: "#F9FAFB",
        borderTop: "1px solid #F3F4F6",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
      }}>
        <span style={{ fontSize: 13, fontWeight: 700, color }}>Ver detalhes</span>
        <ChevronRight style={{ width: 14, height: 14, color }} />
      </div>
    </div>
  );
}
