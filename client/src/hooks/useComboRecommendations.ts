import { useMutation } from "@tanstack/react-query"
import { fetchComboRecommendations, type ComboCartItem, type RecommendationResponse } from "@/services/recommendationApi"

export type UseComboRecommendationsOptions = {
  onSuccess?: (data: RecommendationResponse) => void
  onError?: (error: Error) => void
}

export function useComboRecommendations(options: UseComboRecommendationsOptions = {}) {
  const mutation = useMutation<RecommendationResponse, Error, { cartItems: ComboCartItem[]; sessionId?: string }>({
    mutationFn: ({ cartItems, sessionId }) =>
      fetchComboRecommendations(cartItems, sessionId, 3),
    onSuccess: options.onSuccess,
    onError: options.onError,
  })

  return {
    fetchRecommendations: mutation.mutate,
    suggestions: mutation.data?.suggestions ?? [],
    sessionId: mutation.data?.sessionId,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset,
  }
}
