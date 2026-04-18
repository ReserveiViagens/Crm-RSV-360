import { useQuery } from "@tanstack/react-query"
import { fetchComboRecommendations, type ComboCartItem, type RecommendationResponse } from "@/services/recommendationApi"

export type UseComboRecommendationsOptions = {
  cartItems: ComboCartItem[]
  enabled?: boolean
}

export function useComboRecommendations({ cartItems, enabled = true }: UseComboRecommendationsOptions) {
  const cartKey = cartItems.map((i) => `${i.ticketId}:${i.quantity}:${i.unitPrice}`).join(",")

  const query = useQuery<RecommendationResponse, Error>({
    queryKey: ["/api/recommendations/combo", cartKey],
    queryFn: () => fetchComboRecommendations(cartItems, undefined, 3),
    enabled: enabled && cartItems.length > 0,
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    retry: 1,
  })

  return {
    suggestions: query.data?.suggestions ?? [],
    sessionId: query.data?.sessionId,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  }
}
