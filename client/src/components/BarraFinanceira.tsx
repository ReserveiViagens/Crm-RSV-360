import { DollarSign, TrendingUp, Users } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface BarraFinanceiraProps {
  totalArrecadado: number;
  totalPrevisto: number;
  totalMembros: number;
  valorPorPessoa: number;
}

export function BarraFinanceira({
  totalArrecadado,
  totalPrevisto,
  totalMembros,
  valorPorPessoa,
}: BarraFinanceiraProps) {
  const percentual = totalPrevisto > 0 ? Math.min(100, (totalArrecadado / totalPrevisto) * 100) : 0;

  const formatCurrency = (v: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

  return (
    <div
      data-testid="barra-financeira"
      className="bg-card border border-card-border rounded-md p-3 space-y-2"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-sm font-medium">
          <DollarSign className="w-4 h-4 text-green-600" />
          <span>Financeiro do Grupo</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Users className="w-3 h-3" />
          <span>{totalMembros} membros</span>
        </div>
      </div>

      <Progress value={percentual} className="h-2" />

      <div className="flex items-center justify-between text-xs">
        <span className="text-green-600 font-semibold">{formatCurrency(totalArrecadado)} arrecadados</span>
        <span className="text-muted-foreground">de {formatCurrency(totalPrevisto)}</span>
      </div>

      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <TrendingUp className="w-3 h-3" />
        <span>{formatCurrency(valorPorPessoa)} por pessoa</span>
        <span>·</span>
        <span>{percentual.toFixed(0)}% arrecadado</span>
      </div>
    </div>
  );
}
