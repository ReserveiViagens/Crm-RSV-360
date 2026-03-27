export type ComboCartItem = {
  ticketId: string
  name: string
  unitPrice: number
  originalPrice?: number
  discount?: number
  quantity: number
  category?: string
  tags?: string[]
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

export async function fetchComboRecommendations(
  cartItems: ComboCartItem[],
  sessionId?: string,
  maxSuggestions = 3,
): Promise<RecommendationResponse> {
  const res = await fetch("/api/recommendations/combo", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cartItems, sessionId, maxSuggestions }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message ?? `Erro ${res.status}`)
  }
  return res.json()
}

export async function fetchSessionRecommendations(
  sessionId: string,
): Promise<RecommendationResponse> {
  const res = await fetch(`/api/recommendations/cart/${encodeURIComponent(sessionId)}`)
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message ?? `Erro ${res.status}`)
  }
  return res.json()
}
