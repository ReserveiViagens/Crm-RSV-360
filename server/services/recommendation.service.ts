import { rankCandidates, type CartInput, type CatalogTicket } from "../domain/combo-engine"
import { calculateComboPrice } from "./pricing-engine"

export type RecommendationRequest = {
  cartItems: CartInput[]
  catalog: CatalogTicket[]
  sessionId?: string
  maxSuggestions?: number
  comboDiscountRate?: number
}

export type RecommendationSuggestion = {
  id: string
  name: string
  reason: string
  originalPrice: number
  comboPrice: number
  savings: number
}

export type RecommendationResponse = {
  sessionId: string
  suggestions: RecommendationSuggestion[]
  generatedAt: string
}

const sessionCache = new Map<string, { response: RecommendationResponse; expiresAt: number }>()
const SESSION_TTL_MS = 10 * 60 * 1000

function generateSessionId(): string {
  return `sess_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

function enrichCartItems(cartItems: CartInput[], catalog: CatalogTicket[]): CartInput[] {
  const catalogById = new Map(catalog.map((c) => [c.id, c]))
  return cartItems.map((item) => {
    if (item.category && item.tags && item.tags.length > 0) return item
    const catalogEntry = catalogById.get(item.ticketId)
    if (!catalogEntry) return item
    return {
      ...item,
      category: item.category ?? catalogEntry.category,
      tags: (item.tags && item.tags.length > 0) ? item.tags : catalogEntry.tags,
    }
  })
}

export function getRecommendations(req: RecommendationRequest): RecommendationResponse {
  const sessionId = req.sessionId ?? generateSessionId()

  const cached = sessionCache.get(sessionId)
  if (cached && cached.expiresAt > Date.now()) {
    return cached.response
  }

  const comboDiscountRate = req.comboDiscountRate ?? 0.15
  const enrichedCart = enrichCartItems(req.cartItems, req.catalog)
  const ranked = rankCandidates(enrichedCart, req.catalog, req.maxSuggestions ?? 3)

  const suggestions: RecommendationSuggestion[] = ranked.map(({ candidate, reason }) => {
    const pricing = calculateComboPrice({
      unitPrice: candidate.unitPrice,
      originalPrice: candidate.originalPrice,
      comboDiscountRate,
    })
    return {
      id: candidate.id,
      name: candidate.name,
      reason,
      originalPrice: pricing.originalPrice,
      comboPrice: pricing.comboPrice,
      savings: pricing.savings,
    }
  })

  const response: RecommendationResponse = {
    sessionId,
    suggestions,
    generatedAt: new Date().toISOString(),
  }

  sessionCache.set(sessionId, { response, expiresAt: Date.now() + SESSION_TTL_MS })

  const expiredKeys: string[] = []
  sessionCache.forEach((val, key) => {
    if (val.expiresAt <= Date.now()) expiredKeys.push(key)
  })
  expiredKeys.forEach((key) => sessionCache.delete(key))

  return response
}

export function getSessionRecommendations(sessionId: string): RecommendationResponse | null {
  const cached = sessionCache.get(sessionId)
  if (!cached || cached.expiresAt <= Date.now()) {
    sessionCache.delete(sessionId)
    return null
  }
  return cached.response
}
