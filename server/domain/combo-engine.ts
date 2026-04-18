import { getAffinityWeight, normalizeCategory } from "./affinity-map"

export type CartInput = {
  ticketId: string
  name: string
  unitPrice: number
  originalPrice?: number
  discount?: number
  quantity: number
  category?: string
  tags?: string[]
}

export type CatalogTicket = {
  id: string
  name: string
  unitPrice: number
  originalPrice?: number
  discount?: number
  category?: string
  tags?: string[]
  popular?: boolean
}

export type RankedCandidate = {
  candidate: CatalogTicket
  score: number
  reason: string
}

function buildCartContext(cartItems: CartInput[]) {
  const categories = cartItems.map((i) => normalizeCategory(i.category))
  const tags = cartItems.flatMap((i) => i.tags ?? []).map((t) => t.toLowerCase())
  const hasFamily = tags.some((t) => ["família", "familia", "kids", "criança", "infantil"].includes(t))
  const hasTransport = categories.includes("transporte")
  const hasCabana = categories.includes("cabanas")
  const cartIds = new Set(cartItems.map((i) => i.ticketId))
  return { categories, tags, hasFamily, hasTransport, hasCabana, cartIds }
}

function scoreCandidate(
  candidate: CatalogTicket,
  cartContext: ReturnType<typeof buildCartContext>,
): { score: number; reason: string } {
  let score = 0
  let reason = ""

  const candidateCategory = normalizeCategory(candidate.category)
  const candidateTags = (candidate.tags ?? []).map((t) => t.toLowerCase())

  for (const cartCategory of cartContext.categories) {
    const w = getAffinityWeight(cartCategory, candidateCategory)
    score += w
  }

  if (candidate.popular) {
    score += 0.3
    reason = "Muito pedido por outros viajantes"
  }

  if (cartContext.hasFamily) {
    const isFamily = candidateTags.some((t) => ["família", "familia", "kids", "criança", "infantil"].includes(t))
    if (isFamily) {
      score += 0.5
      reason = "Ideal para quem viaja com crianças"
    }
  }

  if (!cartContext.hasTransport && candidateCategory === "transporte") {
    score += 0.4
    reason = "Complete sua viagem com transporte incluso"
  }

  if (!cartContext.hasCabana && candidateCategory === "cabanas") {
    score += 0.35
    reason = "Tenha uma área exclusiva no parque"
  }

  if (candidateCategory === "combos") {
    score += 0.45
    reason = "Economize combinando mais parques"
  }

  const discountBonus = ((candidate.discount ?? 0) / 100) * 0.5
  score += discountBonus

  if (!reason) {
    reason = "Complementa perfeitamente seus ingressos"
  }

  return { score, reason }
}

export function rankCandidates(
  cartItems: CartInput[],
  catalog: CatalogTicket[],
  maxSuggestions = 3,
): RankedCandidate[] {
  const cartContext = buildCartContext(cartItems)
  const candidates = catalog.filter((t) => !cartContext.cartIds.has(t.id))

  const scored = candidates.map((c) => {
    const { score, reason } = scoreCandidate(c, cartContext)
    return { candidate: c, score, reason }
  })

  scored.sort((a, b) => b.score - a.score)
  return scored.slice(0, maxSuggestions)
}
