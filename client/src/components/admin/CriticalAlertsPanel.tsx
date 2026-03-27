import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, CheckCircle, Bell, XCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type Alert = {
  id: string;
  event: string;
  severity: "critical" | "high" | "medium" | "low";
  message: string;
  orderId?: string;
  createdAt: string;
  acknowledged: boolean;
};

const SEVERITY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  critical: { bg: "#FEE2E2", text: "#DC2626", border: "#FECACA" },
  high:     { bg: "#FEF3C7", text: "#D97706", border: "#FDE68A" },
  medium:   { bg: "#EFF6FF", text: "#2563EB", border: "#DBEAFE" },
  low:      { bg: "#F0FDF4", text: "#16A34A", border: "#BBF7D0" },
};

const EVENT_LABELS: Record<string, string> = {
  VOUCHER_PDF_FAILURE: "Falha no PDF do Voucher",
  RECOMMENDATIONS_FAILURE: "Falha nas Recomendações",
  PIX_WEBHOOK_FAILURE: "Falha no Webhook Pix",
  DOUBLE_DELIVERY_FAILURE: "Falha Dupla de Entrega",
  HIGH_LATENCY: "Latência Alta",
};

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
  } catch {
    return iso;
  }
}

export default function CriticalAlertsPanel() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<{ alerts: Alert[] }>({
    queryKey: ["/api/admin/alerts"],
    refetchInterval: 30_000,
  });

  const acknowledgeMutation = useMutation({
    mutationFn: (alertId: string) =>
      apiRequest("POST", `/api/admin/alerts/${alertId}/acknowledge`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/alerts"] });
      toast({ title: "Alerta reconhecido", description: "Alerta marcado como resolvido." });
    },
    onError: () => {
      toast({ title: "Erro", description: "Não foi possível reconhecer o alerta.", variant: "destructive" });
    },
  });

  const alerts = data?.alerts ?? [];

  return (
    <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E5E7EB", padding: 20 }}>
      <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 600, color: "#111827", display: "flex", alignItems: "center", gap: 8 }}>
        <Bell size={18} color="#DC2626" />
        Alertas Críticos
        {alerts.length > 0 && (
          <span style={{ marginLeft: "auto", background: "#FEE2E2", color: "#DC2626", padding: "2px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
            {alerts.length} ativo{alerts.length > 1 ? "s" : ""}
          </span>
        )}
      </h3>

      {isLoading ? (
        <div style={{ height: 60, background: "#F3F4F6", borderRadius: 8 }} />
      ) : alerts.length === 0 ? (
        <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#16A34A", padding: "12px 0" }}>
          <CheckCircle size={18} />
          <span style={{ fontSize: 14 }}>Nenhum alerta ativo. Sistema operando normalmente.</span>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {alerts.map((alert) => {
            const colors = SEVERITY_COLORS[alert.severity] ?? SEVERITY_COLORS.medium;
            return (
              <div
                key={alert.id}
                data-testid={`alert-card-${alert.id}`}
                style={{
                  background: colors.bg,
                  border: `1px solid ${colors.border}`,
                  borderRadius: 8,
                  padding: "12px 14px",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                }}
              >
                <AlertTriangle size={16} color={colors.text} style={{ flexShrink: 0, marginTop: 2 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: colors.text }}>
                      {alert.severity.toUpperCase()}
                    </span>
                    <span style={{ fontSize: 12, color: "#6B7280" }}>
                      {EVENT_LABELS[alert.event] ?? alert.event}
                    </span>
                    <span style={{ marginLeft: "auto", fontSize: 11, color: "#9CA3AF" }}>
                      {formatDate(alert.createdAt)}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: 13, color: "#374151", wordBreak: "break-word" }}>
                    {alert.message}
                  </p>
                  {alert.orderId && (
                    <span style={{ fontSize: 11, color: "#6B7280", fontFamily: "monospace" }}>
                      Pedido: {alert.orderId.slice(0, 24)}…
                    </span>
                  )}
                </div>
                <button
                  onClick={() => acknowledgeMutation.mutate(alert.id)}
                  disabled={acknowledgeMutation.isPending}
                  data-testid={`button-ack-${alert.id}`}
                  title="Reconhecer alerta"
                  style={{
                    flexShrink: 0,
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    color: colors.text,
                    padding: 4,
                    borderRadius: 4,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <XCircle size={16} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
