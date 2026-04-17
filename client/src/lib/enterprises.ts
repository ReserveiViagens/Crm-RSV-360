export type DestinationCity = "rio-quente" | "caldas-novas" | "multi-destino"
export type EnterpriseId =
  | "hot-park"
  | "diroma"
  | "lagoa-termas"
  | "kawana"
  | "combos"
  | "transporte"
  | "cabanas"

export interface DestinationCityDef {
  id: DestinationCity
  label: string
  emoji: string
  description: string
  color: string
}

export const DESTINATION_CITIES: DestinationCityDef[] = [
  { id: "rio-quente", label: "Rio Quente", emoji: "🌊", description: "Hot Park — águas quentes + meia-entrada", color: "#0891B2" },
  { id: "caldas-novas", label: "Caldas Novas", emoji: "♨️", description: "diRoma, Lagoa Termas e Kawana Park + meia-entrada", color: "#7C3AED" },
  { id: "multi-destino", label: "Multi-Destino", emoji: "✈️", description: "Combos, transporte e cabanas exclusivas", color: "#D97706" },
]

export interface EnterpriseDef {
  id: EnterpriseId
  city: DestinationCity
  name: string
  emoji: string
  description: string
  color: string
  bgColor: string
}

export const ENTERPRISE_CONFIG: EnterpriseDef[] = [
  { id: "hot-park", city: "rio-quente", name: "Hot Park", emoji: "🌊", description: "O maior parque de águas quentes da América do Sul", color: "#0891B2", bgColor: "#F0F9FF" },
  { id: "diroma", city: "caldas-novas", name: "diRoma Acqua Park", emoji: "🏊", description: "Toboáguas emocionantes e piscina de ondas em Caldas Novas", color: "#7C3AED", bgColor: "#F5F3FF" },
  { id: "lagoa-termas", city: "caldas-novas", name: "Lagoa Termas Parques", emoji: "🌿", description: "Águas termais naturais em meio à natureza exuberante", color: "#16A34A", bgColor: "#F0FDF4" },
  { id: "kawana", city: "caldas-novas", name: "Kawana Park", emoji: "⚡", description: "O parque mais radical do Centro-Oeste", color: "#D97706", bgColor: "#FFFBEB" },
  { id: "combos", city: "multi-destino", name: "Combos Multi-Parque", emoji: "✨", description: "Combine parques e economize até 25%", color: "#DC2626", bgColor: "#FEF2F2" },
  { id: "transporte", city: "multi-destino", name: "Transporte Promocional", emoji: "🚌", description: "Ida e volta de Goiânia ou Brasília com conforto garantido", color: "#6366F1", bgColor: "#EEF2FF" },
  { id: "cabanas", city: "multi-destino", name: "Cabanas & Espaços Exclusivos", emoji: "🏕️", description: "Área privativa com serviço premium no Aqua Park", color: "#059669", bgColor: "#ECFDF5" },
]
