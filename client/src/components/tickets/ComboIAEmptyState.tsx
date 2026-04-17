import { Sparkles } from "lucide-react"

export function ComboIAEmptyState() {
  return (
    <div
      className="flex flex-col items-center justify-center py-8 text-center"
      data-testid="combo-ia-empty-state"
    >
      <Sparkles className="w-10 h-10 text-muted-foreground mb-3 opacity-50" />
      <p className="text-sm text-muted-foreground font-medium">
        Nenhuma sugestão disponível agora
      </p>
      <p className="text-xs text-muted-foreground mt-1 opacity-75">
        Continue explorando nossos ingressos
      </p>
    </div>
  )
}
