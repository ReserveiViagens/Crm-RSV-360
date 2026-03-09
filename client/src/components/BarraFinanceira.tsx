import { DollarSign, TrendingUp, Users } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface BarraFinanceiraProps {
  totalArrecadado?: number;
  totalPrevisto?: number;
  valorTotal?: number;
  totalMembros?: number;
  valorPorPessoa?: number;
  onReservar?: () => void;
}

export function BarraFinanceira({
  totalArrecadado = 0,
  totalPrevisto,
  valorTotal,
  totalMembros = 0,
  valorPorPessoa = 0,
  onReservar,
}: BarraFinanceiraProps) {
  const previsto = totalPrevisto ?? valorTotal ?? 0;
  const percentual = previsto > 0 ? Math.min(100, (totalArrecadado / previsto) * 100) : 0;

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
        {totalMembros > 0 && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Users className="w-3 h-3" />
            <span>{totalMembros} membros</span>
          </div>
        )}
      </div>

      {previsto > 0 && (
        <>
          <Progress value={percentual} className="h-2" />
          <div className="flex items-center justify-between text-xs">
            <span className="text-green-600 font-semibold">{formatCurrency(totalArrecadado)} arrecadados</span>
            <span className="text-muted-foreground">de {formatCurrency(previsto)}</span>
          </div>
        </>
      )}

      {(valorPorPessoa > 0 || previsto > 0) && (
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <TrendingUp className="w-3 h-3" />
          {valorPorPessoa > 0 && <span>{formatCurrency(valorPorPessoa)} por pessoa</span>}
          {previsto > 0 && valorPorPessoa > 0 && <span>·</span>}
          {previsto > 0 && <span>Total: {formatCurrency(previsto)}</span>}
        </div>
      )}

      {onReservar && (
        <button
          data-testid="button-reservar"
          onClick={onReservar}
          className="w-full mt-2 py-2 px-4 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          Reservar
        </button>
      )}
    </div>
  );
}
