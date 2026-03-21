import { ShoppingCart, ArrowRight } from "lucide-react"
import { type CartItem } from "@/lib/cart-store"

interface CartStickyBarProps {
  cart: CartItem[]
  total: number
  onCheckout: () => void
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price)
}

export function CartStickyBar({ cart, total, onCheckout }: CartStickyBarProps) {
  if (!cart || cart.length === 0) return null

  const itemsCount = cart.reduce((sum, it) => sum + it.quantity, 0)
  const summary = cart.map((it) => `${it.name} x${it.quantity}`).join(" • ")

  return (
    <div
      data-testid="bar-cart-summary"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 200,
        background: "linear-gradient(135deg, #0891B2, #2563EB)",
        boxShadow: "0 -4px 20px rgba(0,0,0,0.15)",
        padding: "12px 16px",
      }}
    >
      <div
        style={{
          maxWidth: 600,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            background: "rgba(255,255,255,0.2)",
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <ShoppingCart style={{ width: 18, height: 18, color: "#fff" }} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>
            {itemsCount} {itemsCount === 1 ? "ingresso" : "ingressos"}
          </div>
          <div
            style={{
              fontSize: 10,
              color: "rgba(255,255,255,0.75)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {summary}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.75)" }}>Total</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#fff" }}>
              {formatPrice(total)}
            </div>
          </div>

          <button
            data-testid="button-go-checkout"
            onClick={onCheckout}
            style={{
              background: "#fff",
              color: "#0891B2",
              border: "none",
              borderRadius: 10,
              padding: "10px 16px",
              fontWeight: 800,
              fontSize: 13,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
              whiteSpace: "nowrap",
            }}
          >
            Pagar
            <ArrowRight style={{ width: 14, height: 14 }} />
          </button>
        </div>
      </div>
    </div>
  )
}
