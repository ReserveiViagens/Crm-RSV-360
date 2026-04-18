export type TicketCategory =
  | "parques"
  | "cabanas"
  | "transporte"
  | "natureza"
  | "combos"
  | "other"

export type AffinityEntry = {
  category: TicketCategory
  affinities: { category: TicketCategory; weight: number }[]
}

export const AFFINITY_MAP: AffinityEntry[] = [
  {
    category: "parques",
    affinities: [
      { category: "cabanas", weight: 0.85 },
      { category: "transporte", weight: 0.70 },
      { category: "combos", weight: 0.90 },
      { category: "natureza", weight: 0.60 },
    ],
  },
  {
    category: "cabanas",
    affinities: [
      { category: "parques", weight: 0.90 },
      { category: "transporte", weight: 0.65 },
      { category: "combos", weight: 0.75 },
    ],
  },
  {
    category: "transporte",
    affinities: [
      { category: "parques", weight: 0.80 },
      { category: "cabanas", weight: 0.65 },
      { category: "combos", weight: 0.70 },
    ],
  },
  {
    category: "natureza",
    affinities: [
      { category: "parques", weight: 0.70 },
      { category: "cabanas", weight: 0.60 },
      { category: "combos", weight: 0.65 },
    ],
  },
  {
    category: "combos",
    affinities: [
      { category: "parques", weight: 0.75 },
      { category: "cabanas", weight: 0.80 },
      { category: "transporte", weight: 0.70 },
    ],
  },
]

export function getAffinityWeight(
  cartCategory: TicketCategory,
  suggestionCategory: TicketCategory,
): number {
  const entry = AFFINITY_MAP.find((e) => e.category === cartCategory)
  if (!entry) return 0
  return entry.affinities.find((a) => a.category === suggestionCategory)?.weight ?? 0
}

export function normalizeCategory(raw: string | undefined): TicketCategory {
  if (!raw) return "other"
  const lower = raw.toLowerCase()
  if (lower === "parques") return "parques"
  if (lower === "cabanas") return "cabanas"
  if (lower === "transporte") return "transporte"
  if (lower === "natureza") return "natureza"
  if (lower === "combos") return "combos"
  return "other"
}
