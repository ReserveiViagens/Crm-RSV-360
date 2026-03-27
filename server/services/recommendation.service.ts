import { rankSuggestions, type CartInput, type CatalogTicket } from "../domain/combo-engine"
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

export function getRecommendations(req: RecommendationRequest): RecommendationResponse {
  const sessionId = req.sessionId ?? generateSessionId()

  const cached = sessionCache.get(sessionId)
  if (cached && cached.expiresAt > Date.now()) {
    return cached.response
  }

  const rawSuggestions = rankSuggestions(req.cartItems, req.catalog, {
    maxSuggestions: req.maxSuggestions ?? 3,
    comboDiscountRate: req.comboDiscountRate ?? 0.15,
  })

  const suggestions: RecommendationSuggestion[] = rawSuggestions.map((s) => {
    const catalogItem = req.catalog.find((c) => c.id === s.id)
    const pricing = calculateComboPrice({
      unitPrice: catalogItem?.unitPrice ?? s.comboPrice / (1 - (req.comboDiscountRate ?? 0.15)),
      originalPrice: catalogItem?.originalPrice,
      comboDiscountRate: req.comboDiscountRate ?? 0.15,
    })
    return {
      id: s.id,
      name: s.name,
      reason: s.reason,
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
