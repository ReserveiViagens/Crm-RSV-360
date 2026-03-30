import { Ticket } from "lucide-react";

function formatPrice(price: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);
}

export interface OrderSummaryItem {
  ticketId: string;
  title: string;
  quantity: number;
  unitPrice: number;
}

export interface OrderSummaryData {
  orderId: string;
  status: string;
  totalAmount: number;
  originalTotal: number;
  totalSavings: number;
  isCombo: boolean;
  items: OrderSummaryItem[];
  customer: { name: string; email: string };
  createdAt: string;
  expirationDate?: string;
  demo?: boolean;
}

interface OrderSummaryCardProps {
  data: OrderSummaryData;
}

export function OrderSummaryCard({ data }: OrderSummaryCardProps) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      }}
      data-testid="card-success-summary"
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 14,
          flexWrap: "wrap",
        }}
      >
        <Ticket style={{ width: 20, height: 20, color: "#2563EB" }} />
        <h3
          style={{
            fontSize: 15,
            fontWeight: 700,
            margin: 0,
            color: "#1F2937",
          }}
        >
          Seus ingressos
        </h3>

        {data.isCombo && (
          <span
            style={{
              background: "#DCFCE7",
              color: "#16A34A",
              fontSize: 10,
              fontWeight: 700,
              padding: "2px 6px",
              borderRadius: 4,
            }}
          >
            COMBO IA
          </span>
        )}
      </div>

      {data.items.map((item) => (
        <div
          key={item.ticketId}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "8px 0",
            borderBottom: "1px solid #F3F4F6",
            gap: 12,
          }}
          data-testid={`row-success-item-${item.ticketId}`}
        >
          <div>
            <p
              style={{
                margin: 0,
                fontSize: 13,
                fontWeight: 600,
                color: "#1F2937",
              }}
            >
              {item.title}
            </p>
            <p style={{ margin: 0, fontSize: 12, color: "#6B7280" }}>
              {item.quantity}× ingresso
            </p>
          </div>

          <span
            style={{ fontSize: 14, fontWeight: 700, color: "#16A34A" }}
          >
            {formatPrice(item.unitPrice * item.quantity)}
          </span>
        </div>
      ))}

      {data.isCombo && data.totalSavings > 0 && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "8px 0",
            borderBottom: "1px solid #F3F4F6",
          }}
        >
          <span
            style={{ fontSize: 13, color: "#16A34A", fontWeight: 600 }}
          >
            Desconto Combo IA
          </span>
          <span
            style={{ fontSize: 13, fontWeight: 700, color: "#16A34A" }}
            data-testid="text-success-savings"
          >
            -{formatPrice(data.totalSavings)}
          </span>
        </div>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: 12,
        }}
      >
        <span style={{ fontSize: 14, fontWeight: 700, color: "#374151" }}>
          Total pago
        </span>
        <span
          style={{ fontSize: 20, fontWeight: 800, color: "#16A34A" }}
          data-testid="text-success-total"
        >
          {formatPrice(data.totalAmount)}
        </span>
      </div>

      <div
        style={{
          marginTop: 12,
          padding: "10px 12px",
          background: "#F9FAFB",
          borderRadius: 10,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <span style={{ fontSize: 11, color: "#6B7280" }}>Nº do pedido</span>
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: "#374151",
            fontFamily: "monospace",
            wordBreak: "break-all",
          }}
          data-testid="text-order-id"
        >
          {data.orderId}
        </span>
      </div>
    </div>
  );
}