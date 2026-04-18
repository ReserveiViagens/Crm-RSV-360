import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Send, AlertCircle, CheckCircle, RotateCcw } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type PendingDelivery = {
  orderId: string;
  customerName: string;
  customerEmail: string;
  failedChannels: string[];
  attemptedAt: string;
  retryCount: number;
  lastError: string;
};

type AdminMetrics = {
  summary: {
    vouchersPending: number;
  };
  pendingDeliveries: PendingDelivery[];
};

export default function VoucherDeliveryStatusTable() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery<AdminMetrics>({ queryKey: ["/api/admin/metrics"] });

  const resendMutation = useMutation({
    mutationFn: (orderId: string) =>
      apiRequest("POST", `/api/admin/orders/${orderId}/resend`),
    onSuccess: (_data, orderId) => {
      toast({ title: "Reenvio solicitado", description: `Voucher para pedido ${orderId} reenviado.` });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/metrics"] });
    },
    onError: () => {
      toast({ title: "Erro no reenvio", description: "Não foi possível reenviar o voucher.", variant: "destructive" });
    },
  });

  const pending = data?.pendingDeliveries ?? [];

  return (
    <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E5E7EB", padding: 20 }}>
      <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 600, color: "#111827", display: "flex", alignItems: "center", gap: 8 }}>
        <Send size={18} color="#2563EB" /> Vouchers com Entrega Pendente
        {pending.length > 0 && (
          <span style={{ marginLeft: "auto", background: "#FEE2E2", color: "#DC2626", padding: "2px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
            {pending.length} pendente{pending.length > 1 ? "s" : ""}
          </span>
        )}
      </h3>

      {isLoading ? (
        <div style={{ height: 80, background: "#F3F4F6", borderRadius: 8 }} />
      ) : pending.length === 0 ? (
        <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#16A34A", padding: "16px 0" }}>
          <CheckCircle size={18} />
          <span style={{ fontSize: 14 }}>Nenhuma entrega pendente. Todos os vouchers foram enviados com sucesso.</span>
        </div>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #E5E7EB" }}>
              <th style={{ textAlign: "left", padding: "8px 0", color: "#6B7280", fontWeight: 500 }}>Pedido</th>
              <th style={{ textAlign: "left", padding: "8px 0", color: "#6B7280", fontWeight: 500 }}>Cliente</th>
              <th style={{ textAlign: "left", padding: "8px 0", color: "#6B7280", fontWeight: 500 }}>Canais Falhos</th>
              <th style={{ textAlign: "right", padding: "8px 0", color: "#6B7280", fontWeight: 500 }}>Tentativas</th>
              <th style={{ textAlign: "right", padding: "8px 0", color: "#6B7280", fontWeight: 500 }}>Ação</th>
            </tr>
          </thead>
          <tbody>
            {pending.map((row) => (
              <tr key={row.orderId} style={{ borderBottom: "1px solid #F3F4F6" }} data-testid={`row-delivery-${row.orderId}`}>
                <td style={{ padding: "10px 0", fontFamily: "monospace", fontSize: 12, color: "#374151" }}>
                  {row.orderId.slice(0, 20)}…
                </td>
                <td style={{ padding: "10px 0", color: "#111827" }}>{row.customerName}</td>
                <td style={{ padding: "10px 0" }}>
                  {row.failedChannels.map((ch) => (
                    <span key={ch} style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "#FEE2E2", color: "#DC2626", padding: "2px 8px", borderRadius: 20, fontSize: 11, fontWeight: 600, marginRight: 4 }}>
                      <AlertCircle size={10} /> {ch}
                    </span>
                  ))}
                </td>
                <td style={{ padding: "10px 0", textAlign: "right", color: "#6B7280" }}>{row.retryCount}</td>
                <td style={{ padding: "10px 0", textAlign: "right" }}>
                  <button
                    onClick={() => resendMutation.mutate(row.orderId)}
                    disabled={resendMutation.isPending}
                    data-testid={`button-resend-${row.orderId}`}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 6,
                      background: "#2563EB", color: "#fff", border: "none",
                      padding: "6px 14px", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 600,
                      opacity: resendMutation.isPending ? 0.6 : 1,
                    }}
                  >
                    <RotateCcw size={12} /> Reenviar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
