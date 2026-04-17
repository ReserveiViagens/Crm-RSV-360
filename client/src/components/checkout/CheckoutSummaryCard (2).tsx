function formatPrice(price: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price)
}

interface SummaryLineItem {
  ticketId: string
  name?: string
  title?: string
  quantity: number
  unitPrice: number
}

interface CheckoutSummaryCardProps {
  items: SummaryLineItem[]
  totalAmount: number
  originalTotal: number
  totalSavings: number
  isCombo: boolean
  cupom?: string
}

export function CheckoutSummaryCard({
  items,
  totalAmount,
  originalTotal,
  totalSavings,
  isCombo,
  cupom,
}: CheckoutSummaryCardProps) {
  return (
    <div style={{
      background: "#F9FAFB", borderRadius: 12, padding: 14, marginBottom: 16,
      border: "1px solid #E5E7EB",
    }} data-testid="card-checkout-summary">
      {items.map((item) => (
        <div key={item.ticketId} style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
          <span style={{ fontSize: 12, color: "#6B7280" }}>{item.name ?? item.title} × {item.quantity}</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>
            {formatPrice(item.unitPrice * item.quantity)}
          </span>
        </div>
      ))}

      {isCombo && totalSavings > 0 && (
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
          <span style={{ fontSize: 12, color: "#16A34A", fontWeight: 600 }}>Desconto Combo IA (15%)</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#16A34A" }} data-testid="text-combo-savings">
            -{formatPrice(totalSavings)}
          </span>
        </div>
      )}

      {cupom && (
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
          <span style={{ fontSize: 13, color: "#16A34A" }}>Cupom {cupom}</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#16A34A" }}>—</span>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #E5E7EB", paddingTop: 8, marginTop: 4 }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: "#1F2937" }}>Total</span>
        <span style={{ fontSize: 20, fontWeight: 800, color: "#16A34A" }} data-testid="text-total-price">
          {formatPrice(totalAmount)}
        </span>
      </div>
    </div>
  )
}
