import { useMemo } from "react"
import { ShoppingCart, Minus, Plus, Trash2, MapPin, Clock, TrendingUp, Zap, Users } from "lucide-react"
import { type CartItem, getCartItemQty } from "@/lib/cart-store"
import { type TravelerProfile, AIRecommendedBadge, calculateMatchScore } from "@/components/ai-conversion-elements"

interface TicketItem {
  id: string
  name: string
  description: string
  price: number
  originalPrice: number
  discount: number
  image?: string
  features: string[]
  location: string
  duration: string
  ageGroup?: string
  popular?: boolean
  soldToday?: number
  availableToday?: number
  category: string
  tags: string[]
  alsoBoght?: string[]
}

interface TicketsGridProps {
  tickets: TicketItem[]
  cart: CartItem[]
  bestValueId?: string
  profile?: TravelerProfile | null
  hoveredId?: string | null
  onHover?: (id: string | null) => void
  onBuy: (ticket: TicketItem) => void
  onInc: (ticket: TicketItem, qty: number) => void
  onDec: (ticket: TicketItem, qty: number) => void
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price)
}

function AlsoBoughtMini({ ticket, allTickets, onQuickAdd, cart }: {
  ticket: TicketItem
  allTickets: TicketItem[]
  cart: CartItem[]
  onQuickAdd: (t: TicketItem) => void
}) {
  if (!ticket.alsoBoght || ticket.alsoBoght.length === 0) return null
  const related = ticket.alsoBoght
    .map((id) => allTickets.find((t) => t.id === id))
    .filter(Boolean) as TicketItem[]
  if (related.length === 0) return null

  return (
    <div style={{
      marginTop: 10,
      padding: "10px 12px",
      borderRadius: 10,
      background: "linear-gradient(135deg, #EFF6FF, #F0FDF4)",
      border: "1px solid #BFDBFE",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
        <TrendingUp style={{ width: 13, height: 13, color: "#2563EB" }} />
        <span style={{ fontSize: 11, fontWeight: 700, color: "#1F2937" }}>
          Quem comprou este, também comprou:
        </span>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        {related.map((r) => {
          const rQty = getCartItemQty(cart, r.id)
          return (
            <div key={r.id} style={{
              flex: 1,
              background: "#fff",
              borderRadius: 8,
              padding: "8px 10px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: "#374151", margin: "0 0 4px", lineHeight: 1.3 }}>
                {r.name.replace("Ingresso ", "")}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: "#16A34A" }}>{formatPrice(r.price)}</span>
                <span style={{
                  fontSize: 9, fontWeight: 700, color: "#EF4444",
                  background: "#FEE2E2", padding: "1px 5px", borderRadius: 4,
                }}>-{r.discount}%</span>
              </div>
              <button
                data-testid={`button-quick-add-${r.id}`}
                onClick={() => onQuickAdd(r)}
                style={{
                  width: "100%",
                  padding: "5px 0",
                  border: "none",
                  borderRadius: 6,
                  background: rQty > 0
                    ? "linear-gradient(135deg, #16A34A, #15803D)"
                    : "linear-gradient(135deg, #0891B2, #2563EB)",
                  color: "#fff",
                  fontSize: 10,
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 4,
                }}
              >
                {rQty > 0 ? (
                  <><Users style={{ width: 10, height: 10 }} /> {rQty} no carrinho</>
                ) : (
                  <><ShoppingCart style={{ width: 10, height: 10 }} /> + Adicionar</>
                )}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function TicketsGrid({
  tickets,
  cart,
  bestValueId,
  profile,
  hoveredId,
  onHover,
  onBuy,
  onInc,
  onDec,
}: TicketsGridProps) {
  const qtyById = useMemo(() => {
    const m = new Map<string, number>()
    for (const it of cart) m.set(it.ticketId, it.quantity)
    return m
  }, [cart])

  return (
    <div className="rsv-subpage-grid" style={{ padding: "20px 16px 100px" }}>
      {tickets.map((ticket) => {
        const qty = qtyById.get(ticket.id) ?? 0
        const isBestValue = ticket.id === bestValueId
        const isHovered = hoveredId === ticket.id
        const isLowStock = (ticket.availableToday ?? 0) <= 10

        const matchScore = profile
          ? calculateMatchScore(profile, {
              category: ticket.category,
              price: ticket.price,
              tags: ticket.tags,
            })
          : 0

        return (
          <div
            key={ticket.id}
            data-testid={`card-ticket-${ticket.id}`}
            onMouseEnter={() => onHover?.(ticket.id)}
            onMouseLeave={() => onHover?.(null)}
            style={{
              background: "#fff",
              borderRadius: 16,
              overflow: "hidden",
              boxShadow: isHovered
                ? "0 8px 30px rgba(0,0,0,0.12)"
                : "0 2px 8px rgba(0,0,0,0.06)",
              transition: "box-shadow 0.2s ease",
              border: isBestValue ? "2px solid #22C55E" : "1.5px solid #F3F4F6",
              position: "relative",
            }}
          >
            {ticket.image && (
              <div style={{ position: "relative", height: 140, overflow: "hidden" }}>
                <img
                  src={ticket.image}
                  alt={ticket.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <div style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.4))",
                }} />

                {ticket.popular && (
                  <div
                    data-testid={`badge-popular-${ticket.id}`}
                    style={{
                      position: "absolute",
                      top: isBestValue ? 44 : 12,
                      left: 12,
                      background: "linear-gradient(135deg, #F59E0B, #D97706)",
                      color: "#fff",
                      fontSize: 9,
                      fontWeight: 800,
                      padding: "3px 8px",
                      borderRadius: 20,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    ⭐ MAIS POPULAR
                  </div>
                )}

                {isBestValue && (
                  <div
                    data-testid={`badge-best-value-${ticket.id}`}
                    style={{
                      position: "absolute",
                      top: 12,
                      left: 12,
                      background: "linear-gradient(135deg, #22C55E, #16A34A)",
                      color: "#fff",
                      fontSize: 9,
                      fontWeight: 800,
                      padding: "3px 8px",
                      borderRadius: 20,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    💚 MELHOR CUSTO
                  </div>
                )}

                <div style={{
                  position: "absolute",
                  bottom: 12,
                  left: 12,
                  background: "#EF4444",
                  color: "#fff",
                  fontSize: 10,
                  fontWeight: 800,
                  padding: "3px 8px",
                  borderRadius: 20,
                }}>
                  -{ticket.discount}% OFF
                </div>

                {matchScore > 50 && (
                  <div style={{ position: "absolute", bottom: 12, right: 12 }}>
                    <AIRecommendedBadge matchPercent={matchScore} />
                  </div>
                )}
              </div>
            )}

            <div style={{ padding: "12px 14px" }}>
              <div
                data-testid={`text-ticket-name-${ticket.id}`}
                style={{ fontSize: 14, fontWeight: 800, color: "#111827", marginBottom: 4 }}
              >
                {ticket.name}
              </div>
              <p style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.5, marginBottom: 8 }}>
                {ticket.description.slice(0, 80)}...
              </p>

              <div style={{ display: "flex", gap: 12, marginBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <MapPin style={{ width: 11, height: 11, color: "#9CA3AF" }} />
                  <span style={{ fontSize: 10, color: "#6B7280" }}>{ticket.location}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <Clock style={{ width: 11, height: 11, color: "#9CA3AF" }} />
                  <span style={{ fontSize: 10, color: "#6B7280" }}>{ticket.duration}</span>
                </div>
              </div>

              {ticket.availableToday !== undefined && (
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  marginBottom: 8,
                  padding: "5px 8px",
                  borderRadius: 8,
                  background: isLowStock ? "#FEE2E2" : "#FEFCE8",
                }}>
                  {isLowStock ? (
                    <Zap style={{ width: 11, height: 11, color: "#EF4444" }} className="animate-pulse" />
                  ) : (
                    <Zap style={{ width: 11, height: 11, color: "#D97706" }} />
                  )}
                  <span style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: isLowStock ? "#EF4444" : "#D97706",
                  }}>
                    {isLowStock
                      ? `Apenas ${ticket.availableToday} restam hoje!`
                      : `${ticket.soldToday ?? 0} vendidos hoje`}
                  </span>
                  <span data-testid={`text-sold-today-${ticket.id}`} style={{ display: "none" }}>
                    {ticket.soldToday}
                  </span>
                </div>
              )}

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                    <span style={{ fontSize: 20, fontWeight: 900, color: "#111827" }}>
                      {formatPrice(ticket.price)}
                    </span>
                    <span style={{ fontSize: 12, color: "#9CA3AF", textDecoration: "line-through" }}>
                      {formatPrice(ticket.originalPrice)}
                    </span>
                  </div>
                  <div style={{ fontSize: 10, color: "#6B7280" }}>por pessoa</div>
                </div>
              </div>

              <div style={{ minHeight: 44 }}>
                {qty === 0 ? (
                  <button
                    data-testid={`button-buy-${ticket.id}`}
                    onClick={() => onBuy(ticket)}
                    style={{
                      width: "100%",
                      padding: "11px 0",
                      border: "none",
                      borderRadius: 12,
                      background: "linear-gradient(135deg, #22C55E, #16A34A)",
                      color: "#fff",
                      fontWeight: 800,
                      fontSize: 14,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                    }}
                  >
                    <ShoppingCart style={{ width: 15, height: 15 }} />
                    Comprar Agora
                  </button>
                ) : (
                  <div
                    data-testid={`stepper-${ticket.id}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      background: "#F9FAFB",
                      borderRadius: 12,
                      padding: "4px",
                      border: "1.5px solid #E5E7EB",
                    }}
                  >
                    <button
                      data-testid={`stepper-dec-${ticket.id}`}
                      onClick={() => onDec(ticket, qty)}
                      style={{
                        width: 36,
                        height: 36,
                        border: "none",
                        borderRadius: 9,
                        background: qty === 1 ? "#FEE2E2" : "#fff",
                        color: qty === 1 ? "#EF4444" : "#374151",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                      }}
                    >
                      {qty === 1 ? (
                        <Trash2 style={{ width: 15, height: 15 }} />
                      ) : (
                        <Minus style={{ width: 15, height: 15 }} />
                      )}
                    </button>

                    <span style={{ fontSize: 16, fontWeight: 800, color: "#111827", minWidth: 32, textAlign: "center" }}>
                      {qty}
                    </span>

                    <button
                      data-testid={`stepper-inc-${ticket.id}`}
                      onClick={() => onInc(ticket, qty)}
                      style={{
                        width: 36,
                        height: 36,
                        border: "none",
                        borderRadius: 9,
                        background: "#fff",
                        color: "#374151",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                      }}
                    >
                      <Plus style={{ width: 15, height: 15 }} />
                    </button>
                  </div>
                )}
              </div>

              <AlsoBoughtMini
                ticket={ticket}
                allTickets={tickets}
                cart={cart}
                onQuickAdd={(t) => onBuy(t)}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
