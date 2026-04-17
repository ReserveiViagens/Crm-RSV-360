import type { SearchItemType } from "@/types/search";

export interface TypeChip {
  label: string;
  value: SearchItemType | "all";
  icon?: string;
}

export const TYPE_CHIPS: TypeChip[] = [
  { label: "Tudo", value: "all" },
  { label: "Parques", value: "park" },
  { label: "Hotéis", value: "hotel" },
  { label: "Destinos", value: "destination" },
  { label: "Combos", value: "combo" },
  { label: "Atrações", value: "attraction" },
  { label: "Excursões", value: "excursion" },
];

export const TYPE_LABELS: Record<string, string> = {
  park: "Parque",
  hotel: "Hotel",
  destination: "Destino",
  combo: "Combo",
  attraction: "Atração",
  excursion: "Excursão",
  all: "Tudo",
};

export const PROFILE_LABELS: Record<string, string> = {
  familia: "Família",
  casal: "Casal",
  aventura: "Aventura",
  relaxar: "Relaxar",
  premium: "Premium",
  economia: "Econômico",
};

export const PROFILES = [
  { value: "familia", label: "Família" },
  { value: "casal", label: "Casal" },
  { value: "aventura", label: "Aventura" },
  { value: "relaxar", label: "Relaxar" },
  { value: "premium", label: "Premium" },
  { value: "economia", label: "Econômico" },
];

export const SORT_OPTIONS = [
  { value: "relevance", label: "Mais relevantes" },
  { value: "popular", label: "Mais populares" },
  { value: "rating", label: "Melhor avaliação" },
  { value: "price_asc", label: "Menor preço" },
  { value: "date", label: "Data de partida" },
  { value: "proximity", label: "Mais próximos" },
];

export const CITIES = ["Caldas Novas", "Rio Quente"];

export const CATEGORY_LABELS: Record<string, string> = {
  "Parque Aquático": "Parque Aquático",
  Thermas: "Thermas",
  "Resort 5 Estrelas": "Resort 5★",
  "Resort 4 Estrelas": "Resort 4★",
  "Hotel 4 Estrelas": "Hotel 4★",
  "Destino Termal": "Destino Termal",
  "Pacote Família": "Pacote Família",
  "Pacote Premium": "Pacote Premium",
};

export const SYNONYMS_FRONTEND: Record<string, string[]> = {
  parque: ["aquático", "water park", "thermas"],
  hotel: ["resort", "hospedagem", "pousada"],
  familia: ["kids", "criança", "infantil"],
  barato: ["econômico", "acessível", "promoção"],
  aventura: ["radical", "adrenalina"],
  relaxar: ["spa", "descanso", "tranquilo"],
};

export const DEFAULT_SEARCH_PLACEHOLDER = "Busque parque, hotel, destino ou empreendimento";
