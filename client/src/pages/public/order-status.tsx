import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  Loader2,
  RefreshCcw,
  Ticket,
  XCircle,
} from "lucide-react";
import {
  OrderSummaryCard,
  type OrderSummaryData,
} from "@/components/success/OrderSummaryCard";
import { VoucherDownloadCard } from "@/components/success/VoucherDownloadCard";

type PaymentStatus =
  | "PENDING"
  | "APPROVED"
  | "EXPIRED"
  | "FAILED"
  | "CANCELLED";

function formatDate(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

function getOrderIdFromPath(pathname: string) {
  const cleanPath = pathname.split("?")[0];
  const parts = cleanPath.split("/").filter(Boolean);
  return decodeURIComponent(parts[parts.length - 1] ?? "");
}

function normalizeStatus(value?: string): PaymentStatus {
  const normalized = String(value ?? "PENDING").toUpperCase();
  if (
    normalized === "APPROVED" ||
    normalized === "EXPIRED" ||
    normalized === "FAILED" ||
    normalized === "CANCELLED"
  ) {
    return normalized;
  }
  return "PENDING";
}

export default function OrderStatusPage() {
  const [location] = useLocation();
  const orderId = useMemo(() => getOrderIdFromPath(location), [location]);
  const voucherToken = useMemo(() => {
    if (typeof window === "undefined") return undefined;
    const token = new URLSearchParams(window.location.search).get("token");
    return token ?? undefined;
  }, [location]);

  const [order, setOrder] = useState<OrderSummaryData | null>(null);
  const [status, setStatus] = useState<PaymentStatus>("PENDING");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function loadOrder(showLoading = true) {
    if (!orderId) {
      setErrorMsg("Pedido inválido.");
      setLoading(false);
      return;
    }

    try {
      if (showLoading) setLoading(true);
      setErrorMsg("");

      const orderRes = await fetch(`/api/orders/${encodeURIComponent(orderId)}`);
      if (!orderRes.ok) {
        const body = (await orderRes.json().catch(() => ({}))) as {
          message?: string;
        };
        throw new Error(body.message ?? "Pedido não encontrado.");
      }

      const orderData = (await orderRes.json()) as OrderSummaryData;
      setOrder(orderData);
      setStatus(normalizeStatus(orderData.status));

      const statusRes = await fetch(
        `/api/payments/tickets/${encodeURIComponent(orderId)}/status`,
      );

      if (statusRes.ok) {
        const statusData = (await statusRes.json()) as {
          status?: string;
          paid?: boolean;
        };
        const nextStatus = normalizeStatus(statusData.status ?? orderData.status);
        setStatus(nextStatus);
        setOrder((prev) =>
          prev
            ? {
                ...prev,
                status: nextStatus,
              }
            : {
                ...orderData,
                status: nextStatus,
              },
        );
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Erro ao carregar pedido.";
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  }

  async function refreshStatus() {
    if (!orderId) return;

    try {
      setRefreshing(true);

      const statusRes = await fetch(
        `/api/payments/tickets/${encodeURIComponent(orderId)}/status`,
      );

      if (!statusRes.ok) return;

      const statusData = (await statusRes.json()) as {
        status?: string;
        paid?: boolean;
      };

      const nextStatus = normalizeStatus(statusData.status);
      setStatus(nextStatus);
      setOrder((prev) =>
        prev
          ? {
              ...prev,
              status: nextStatus,
            }
          : prev,
      );
    } finally {
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadOrder(true);
  }, [orderId]);

  useEffect(() => {
    if (status !== "PENDING") return;

    const timer = window.setInterval(() => {
      refreshStatus();
    }, 5000);

    return () => window.clearInterval(timer);
  }, [status, orderId]);

  const statusConfig = {
    PENDING: {
      icon: <Clock3 style={{ width: 24, height: 24, color: "#D97706" }} />,
      title: "Aguardando pagamento",
      description:
        "Seu pedido foi criado e estamos aguardando a confirmação do pagamento.",
      bg: "#FFFBEB",
      border: "#FCD34D",
      text: "#92400E",
    },
    APPROVED: {
      icon: <CheckCircle2 style={{ width: 24, height: 24, color: "#16A34A" }} />,
      title: "Pagamento aprovado",
      description:
        "Pagamento confirmado com sucesso. Seu voucher já pode ser baixado.",
      bg: "#F0FDF4",
      border: "#86EFAC",
      text: "#166534",
    },
    EXPIRED: {
      icon: <AlertCircle style={{ width: 24, height: 24, color: "#DC2626" }} />,
      title: "Pagamento expirado",
      description:
        "O prazo do Pix expirou. Gere um novo pedido para concluir a compra.",
      bg: "#FEF2F2",
      border: "#FCA5A5",
      text: "#991B1B",
    },
    FAILED: {
      icon: <XCircle style={{ width: 24, height: 24, color: "#DC2626" }} />,
      title: "Falha no pagamento",
      description:
        "Não foi possível confirmar o pagamento deste pedido.",
      bg: "#FEF2F2",
      border: "#FCA5A5",
      text: "#991B1B",
    },
    CANCELLED: {
      icon: <XCircle style={{ width: 24, height: 24, color: "#6B7280" }} />,
      title: "Pedido cancelado",
      description: "Este pedido foi cancelado e não pode mais ser utilizado.",
      bg: "#F9FAFB",
      border: "#D1D5DB",
      text: "#374151",
    },
  } as const;

  const currentStatus = statusConfig[status];

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#F8FAFC",
          padding: 24,
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            padding: 24,
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <Loader2
            style={{ width: 20, height: 20, animation: "spin 1s linear infinite" }}
          />
          <span style={{ fontSize: 14, fontWeight: 600, color: "#374151" }}>
            Carregando status do pedido...
          </span>
        </div>
      </div>
    );
  }

  if (errorMsg || !order) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#F8FAFC",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 560,
            background: "#fff",
            borderRadius: 16,
            padding: 24,
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 12,
            }}
          >
            <AlertCircle style={{ width: 22, height: 22, color: "#DC2626" }} />
            <h1
              style={{
                fontSize: 20,
                lineHeight: 1.2,
                margin: 0,
                color: "#111827",
              }}
            >
              Não foi possível carregar o pedido
            </h1>
          </div>

          <p style={{ fontSize: 14, color: "#6B7280", marginTop: 0 }}>
            {errorMsg || "Pedido não encontrado."}
          </p>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 16 }}>
            <button
              onClick={() => loadOrder(true)}
              style={{
                border: "none",
                borderRadius: 10,
                padding: "10px 14px",
                background: "#2563EB",
                color: "#fff",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Tentar novamente
            </button>

            <a
              href="/ingressos"
              style={{
                textDecoration: "none",
                borderRadius: 10,
                padding: "10px 14px",
                background: "#E5E7EB",
                color: "#111827",
                fontWeight: 700,
              }}
            >
              Voltar para ingressos
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F8FAFC",
        padding: "32px 16px",
      }}
    >
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <div
          style={{
            background: currentStatus.bg,
            border: `1px solid ${currentStatus.border}`,
            borderRadius: 16,
            padding: 20,
            marginBottom: 16,
            boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
          }}
          data-testid="card-order-status"
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", gap: 12 }}>
              <div>{currentStatus.icon}</div>
              <div>
                <h1
                  style={{
                    fontSize: 22,
                    lineHeight: 1.2,
                    margin: "0 0 6px 0",
                    color: currentStatus.text,
                  }}
                >
                  {currentStatus.title}
                </h1>
                <p
                  style={{
                    margin: 0,
                    fontSize: 14,
                    lineHeight: 1.5,
                    color: currentStatus.text,
                    opacity: 0.92,
                  }}
                >
                  {currentStatus.description}
                </p>
              </div>
            </div>

            {status === "PENDING" && (
              <button
                onClick={refreshStatus}
                disabled={refreshing}
                style={{
                  border: "none",
                  borderRadius: 10,
                  padding: "10px 12px",
                  background: "#fff",
                  color: "#111827",
                  fontWeight: 700,
                  cursor: refreshing ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <RefreshCcw
                  style={{
                    width: 16,
                    height: 16,
                    animation: refreshing ? "spin 1s linear infinite" : "none",
                  }}
                />
                Atualizar status
              </button>
            )}
          </div>

          <div
            style={{
              marginTop: 16,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 12,
            }}
          >
            <div
              style={{
                background: "#fff",
                borderRadius: 12,
                padding: 12,
              }}
            >
              <p style={{ margin: 0, fontSize: 11, color: "#6B7280" }}>Pedido</p>
              <p
                style={{
                  margin: "4px 0 0 0",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#111827",
                  fontFamily: "monospace",
                  wordBreak: "break-all",
                }}
              >
                {order.orderId}
              </p>
            </div>

            <div
              style={{
                background: "#fff",
                borderRadius: 12,
                padding: 12,
              }}
            >
              <p style={{ margin: 0, fontSize: 11, color: "#6B7280" }}>
                Criado em
              </p>
              <p
                style={{
                  margin: "4px 0 0 0",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#111827",
                }}
              >
                {formatDate(order.createdAt)}
              </p>
            </div>

            <div
              style={{
                background: "#fff",
                borderRadius: 12,
                padding: 12,
              }}
            >
              <p style={{ margin: 0, fontSize: 11, color: "#6B7280" }}>
                Expiração
              </p>
              <p
                style={{
                  margin: "4px 0 0 0",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#111827",
                }}
              >
                {formatDate(order.expirationDate)}
              </p>
            </div>
          </div>
        </div>

        <OrderSummaryCard data={{ ...order, status }} />

        {status === "APPROVED" && (
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: 20,
              marginBottom: 16,
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <Ticket style={{ width: 20, height: 20, color: "#2563EB" }} />
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#111827" }}>
                Voucher do pedido
              </h3>
            </div>

            <p style={{ marginTop: 0, marginBottom: 14, fontSize: 13, color: "#6B7280" }}>
              Baixe o voucher em PDF para apresentar no atendimento. Se você recebeu um link com token por e-mail ou WhatsApp, esta página também aceita esse token automaticamente.
            </p>

            <VoucherDownloadCard
              orderId={order.orderId}
              demo={order.demo}
              voucherToken={voucherToken}
            />

            {!voucherToken && (
              <p style={{ margin: "8px 0 0 0", fontSize: 12, color: "#6B7280" }}>
                Se o download não for autorizado, use o link recebido por e-mail ou WhatsApp com o token de acesso.
              </p>
            )}
          </div>
        )}

        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            padding: 20,
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          }}
        >
          <h3 style={{ marginTop: 0, marginBottom: 12, fontSize: 16, color: "#111827" }}>
            Próximos passos
          </h3>

          <ul style={{ margin: 0, paddingLeft: 18, color: "#4B5563", fontSize: 14, lineHeight: 1.6 }}>
            {status === "PENDING" && (
              <>
                <li>Finalize o pagamento para liberar o voucher.</li>
                <li>Esta página atualiza o status automaticamente a cada 5 segundos.</li>
              </>
            )}
            {status === "APPROVED" && (
              <>
                <li>Baixe e salve o voucher em PDF.</li>
                <li>Apresente o voucher na entrada ou no atendimento.</li>
              </>
            )}
            {status === "EXPIRED" && (
              <>
                <li>O pedido expirou e não pode mais ser pago.</li>
                <li>Volte para a página de ingressos para gerar um novo pedido.</li>
              </>
            )}
            {status === "FAILED" && (
              <>
                <li>Houve uma falha na confirmação do pagamento.</li>
                <li>Tente novamente ou entre em contato com o suporte.</li>
              </>
            )}
            {status === "CANCELLED" && (
              <>
                <li>O pedido foi cancelado e não pode ser reutilizado.</li>
                <li>Gere um novo pedido se ainda quiser concluir a compra.</li>
              </>
            )}
          </ul>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 16 }}>
            <a
              href="/ingressos"
              style={{
                textDecoration: "none",
                borderRadius: 10,
                padding: "10px 14px",
                background: "#2563EB",
                color: "#fff",
                fontWeight: 700,
              }}
            >
              Voltar para ingressos
            </a>

            <a
              href="/suporte"
              style={{
                textDecoration: "none",
                borderRadius: 10,
                padding: "10px 14px",
                background: "#E5E7EB",
                color: "#111827",
                fontWeight: 700,
              }}
            >
              Falar com suporte
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}