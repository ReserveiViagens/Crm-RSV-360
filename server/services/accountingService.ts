export interface RelatorioContabil {
  excursaoId: string;
  periodo: { inicio: string; fim: string };
  totalRecebido: number;
  totalPendente: number;
  totalPassageiros: number;
  totalCancelamentos: number;
  itens: Array<{
    passageiroId: string;
    passageiroNome: string;
    valorTotal: number;
    valorPago: number;
    status: "pago" | "pendente" | "cancelado";
  }>;
  geradoEm: string;
}

export function gerarRelatorioContabil(
  excursaoId: string,
  inicio: string,
  fim: string,
  dados: Array<{
    passageiroId: string;
    passageiroNome: string;
    valorTotal: number;
    valorPago: number;
    status: "pago" | "pendente" | "cancelado";
  }>
): RelatorioContabil {
  const totalRecebido = dados.reduce((sum, d) => sum + (d.status === "pago" ? d.valorPago : 0), 0);
  const totalPendente = dados.reduce((sum, d) => sum + (d.status === "pendente" ? d.valorTotal - d.valorPago : 0), 0);
  const totalCancelamentos = dados.filter((d) => d.status === "cancelado").length;

  return {
    excursaoId,
    periodo: { inicio, fim },
    totalRecebido,
    totalPendente,
    totalPassageiros: dados.length,
    totalCancelamentos,
    itens: dados,
    geradoEm: new Date().toISOString(),
  };
}
