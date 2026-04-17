import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Sparkles } from "lucide-react"
import type { RecommendationSuggestion } from "@/services/recommendationApi"

type SuggestionCardProps = {
  suggestion: RecommendationSuggestion
  onAdd: (suggestion: RecommendationSuggestion) => void
  isAdding?: boolean
}

function formatBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(value)
}

export function SuggestionCard({ suggestion, onAdd, isAdding }: SuggestionCardProps) {
  const savingsPct = Math.round(
    ((suggestion.originalPrice - suggestion.comboPrice) / suggestion.originalPrice) * 100,
  )

  return (
    <div
      className="flex flex-col gap-3 rounded-xl border border-blue-100 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
      data-testid={`suggestion-card-${suggestion.id}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p
            className="font-semibold text-sm text-gray-900 leading-tight truncate"
            data-testid={`suggestion-name-${suggestion.id}`}
          >
            {suggestion.name}
          </p>
          <div className="flex items-center gap-1 mt-1">
            <Sparkles className="w-3 h-3 text-blue-500 flex-shrink-0" />
            <p
              className="text-xs text-blue-600 leading-tight"
              data-testid={`suggestion-reason-${suggestion.id}`}
            >
              {suggestion.reason}
            </p>
          </div>
        </div>
        <Badge
          className="bg-green-100 text-green-700 text-xs font-bold flex-shrink-0 border-0"
          data-testid={`suggestion-savings-badge-${suggestion.id}`}
        >
          -{savingsPct}%
        </Badge>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span
            className="text-xs text-gray-400 line-through"
            data-testid={`suggestion-original-price-${suggestion.id}`}
          >
            {formatBRL(suggestion.originalPrice)}
          </span>
          <span
            className="text-base font-bold text-blue-700"
            data-testid={`suggestion-combo-price-${suggestion.id}`}
          >
            {formatBRL(suggestion.comboPrice)}
          </span>
          <span
            className="text-xs text-green-600 font-medium"
            data-testid={`suggestion-savings-amount-${suggestion.id}`}
          >
            Economia de {formatBRL(suggestion.savings)}
          </span>
        </div>

        <Button
          size="sm"
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs flex items-center gap-1.5"
          onClick={() => onAdd(suggestion)}
          disabled={isAdding}
          data-testid={`suggestion-add-btn-${suggestion.id}`}
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          {isAdding ? "Adicionando…" : "Adicionar"}
        </Button>
      </div>
    </div>
  )
}
