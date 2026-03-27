import type { SearchFilters } from "@/types/search";
import { MapPin } from "lucide-react";

interface RouteStop {
  id: string | number;
  name: string;
  lat: number;
  lng: number;
}

interface SearchMapPanelProps {
  filters?: SearchFilters;
  initialBounds?: { north: number; south: number; east: number; west: number };
  onMarkerClick?: (id: string) => void;
  onBoundsChange?: (bounds: { north: number; south: number; east: number; west: number }) => void;
  height?: string;
  className?: string;
  routeStops?: RouteStop[];
  routeColor?: string;
}

export default function SearchMapPanel({ height = "400px", className = "" }: SearchMapPanelProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center bg-blue-50 rounded-xl border border-blue-200 ${className}`}
      style={{ height }}
      data-testid="search-map-panel"
    >
      <MapPin className="w-12 h-12 text-blue-400 mb-3" />
      <p className="text-sm text-blue-600 font-medium">Mapa interativo</p>
      <p className="text-xs text-blue-400 mt-1">Caldas Novas · Rio Quente</p>
    </div>
  );
}
