import { useState, useEffect, useRef, useMemo } from "react"
import { ShoppingCart, Minus, Plus, Trash2, MapPin, Clock, TrendingUp, Zap, Users, BarChart3, Check, Flame, AlertTriangle } from "lucide-react"
import { type CartItem, getCartItemQty } from "@/lib/cart-store"
import { type TravelerProfile, AIRecommendedBadge, calculateMatchScore } from "@/components/ai-conversion-elements"

export interface TicketItem {
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
  categorySection?: string
  ticketCategory?: "ingressos" | "morador" | "meia-entrada"
  tags: string[]
  alsoBoght?: string[]
  documentRequired?: string
  enterprise?: string
  enterprises?: string[]
  destinationCity?: string
  parkSlots?: { id: string; name: string; emoji: string; city: string; color: string }[]
}

interface TicketsGridProps {
  tickets: TicketItem[]
  cart: CartItem[]
  bestValueId?: string
  profile?: TravelerProfile | null
  hoveredId?: string | null
  compareIds?: string[]
  onHover?: (id: string | null) => void
  onToggleCompare?: (id: string) => void
  onBuy: (ticket: TicketItem) => void
  onInc: (ticket: TicketItem, qty: number) => void
  onDec: (ticket: TicketItem, qty: number) => void
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price)
}

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const prevTarget = useRef(0)

  useEffect(() => {
    if (target <= 0) return
    const start = prevTarget.current
    prevTarget.current = target
    let current = start
    const diff = target - start
    if (diff <= 0) {
      setCount(target)
      return
    }
    const step = Math.max(1, Math.floor(diff / 20))
    const interval = setInterval(() => {
      current += step
      if (current >= target) {
        current = target
        clearInterval(interval)
      }
      setCount(current)
    }, 80)
    return () => clearInterval(interval)
  }, [target])

  return (
    <span ref={ref} style={{ fontVariantNumeric: "tabular-nums" }}>
      {count} {suffix}
    </span>
  )
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
  compareIds = [],
  onHover,
  onToggleCompare,
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
    <div 
      className="rsv-grid-cards"
      style={{ 
        padding: "var(--rsv-space-5) var(--rsv-space-4) 100px",
        gap: "var(--rsv-card-gap-md)",
      }}
    >
      {tickets.map((ticket) => {
        const qty = qtyById.get(ticket.id) ?? 0
        const isBestValue = ticket.id === bestValueId
        const isHovered = hoveredId === ticket.id
        const isComparing = compareIds.includes(ticket.id)
        const isLowStock = (ticket.availableToday ?? 0) > 0 && (ticket.availableToday ?? 99) <= 10

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
              background: "var(--rsv-surface-base)",
              borderRadius: "var(--rsv-radius-xl)",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              boxShadow: isHovered
                ? "var(--rsv-shadow-lg)"
                : "var(--rsv-shadow-card)",
              transform: isHovered ? "scale(1.02)" : "scale(1)",
              transition: `all var(--rsv-duration-base) var(--rsv-ease-default)`,
              border: isComparing 
                ? "2px solid var(--rsv-info)" 
                : ticket.popular 
                  ? "2px solid var(--rsv-warning)" 
                  : "1px solid var(--rsv-border-color)",
              position: "relative",
            }}
          >
            <div style={{ position: "relative" }}>
              {ticket.popular && (
                <div
                  data-testid={`badge-popular-${ticket.id}`}
                  style={{
                    position: "absolute", top: 0, left: 0, right: 0,
                    background: "#FACC15", color: "#000", textAlign: "center",
                    padding: "4px 0", fontSize: 12, fontWeight: 700, zIndex: 2,
                  }}
                >
                  MAIS POPULAR
                </div>
              )}
              {isBestValue && (
                <div
                  data-testid={`badge-best-value-${ticket.id}`}
                  style={{
                    position: "absolute", top: ticket.popular ? 28 : 0, left: 0, right: 0,
                    background: "linear-gradient(135deg, #22C55E, #16A34A)", color: "#fff",
                    textAlign: "center", padding: "4px 0", fontSize: 12, fontWeight: 700, zIndex: 2,
                  }}
                >
                  MELHOR CUSTO-BENEFICIO
                </div>
              )}
              <div style={{
                position: "absolute",
                top: (ticket.popular ? 28 : 0) + (isBestValue ? 28 : 0) + 10,
                left: 10, background: "#EF4444", color: "#fff",
                fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 8, zIndex: 2,
              }}>
                -{ticket.discount}% OFF
              </div>
              <div style={{
                position: "absolute",
                top: (ticket.popular ? 28 : 0) + (isBestValue ? 28 : 0) + 10,
                right: 10, zIndex: 2,
              }}>
                <AIRecommendedBadge matchPercent={matchScore} />
              </div>
              {ticket.image && (
                <img
                  src={ticket.image}
                  alt={ticket.name}
                  style={{ 
                    width: "100%", 
                    aspectRatio: "var(--rsv-ratio-landscape)",
                    objectFit: "cover", 
                    display: "block" 
                  }}
                />
              )}
            </div>

            <div style={{ padding: "var(--rsv-card-padding-md)", display: "flex", flexDirection: "column", flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                <h3
                  style={{ 
                    fontSize: "var(--rsv-text-lg)", 
                    fontWeight: "var(--rsv-font-bold)", 
                    margin: 0,
                    color: "var(--rsv-text-primary)"
                  }}
                  data-testid={`text-ticket-name-${ticket.id}`}
                >
                  {ticket.name}
                </h3>
                {onToggleCompare && (
                  <button
                    onClick={() => onToggleCompare(ticket.id)}
                    data-testid={`button-compare-${ticket.id}`}
                    style={{
                      background: isComparing ? "#3B82F6" : "#F3F4F6",
                      border: "none", borderRadius: 6, padding: "4px 8px",
                      cursor: "pointer", display: "flex", alignItems: "center", gap: 4,
                      fontSize: 11, fontWeight: 600,
                      color: isComparing ? "#fff" : "#6B7280",
                      transition: "all 0.2s",
                    }}
                  >
                    {isComparing ? <Check style={{ width: 12, height: 12 }} /> : <BarChart3 style={{ width: 12, height: 12 }} />}
                    {isComparing ? "Selecionado" : "Comparar"}
                  </button>
                )}
              </div>

              <p style={{ 
                fontSize: "var(--rsv-text-sm)", 
                color: "var(--rsv-text-secondary)", 
                margin: "0 0 var(--rsv-space-3)", 
                lineHeight: "var(--rsv-leading-normal)" 
              }}>
                {ticket.description}
              </p>

              {(ticket.soldToday ?? 0) > 0 && (
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                  <Flame style={{ width: 13, height: 13, color: "#EF4444" }} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#EF4444" }} data-testid={`text-sold-today-${ticket.id}`}>
                    <AnimatedCounter target={ticket.soldToday ?? 0} suffix="ingressos vendidos hoje" />
                  </span>
                </div>
              )}

              {ticket.availableToday !== undefined && ticket.availableToday > 0 && isLowStock && (
                <div style={{
                  display: "flex", alignItems: "center", gap: 6, marginBottom: 10,
                  background: "#FEF2F2", borderRadius: 8, padding: "6px 10px",
                  border: "1px solid #FECACA",
                  animation: "pulse 2s infinite",
                }} data-testid={`urgency-low-stock-${ticket.id}`}>
                  <AlertTriangle style={{ width: 13, height: 13, color: "#DC2626" }} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#DC2626" }}>
                    Apenas {ticket.availableToday} ingressos restantes hoje!
                  </span>
                </div>
              )}

              {ticket.availableToday !== undefined && ticket.availableToday > 0 && !isLowStock && (
                <div style={{
                  display: "flex", alignItems: "center", gap: 6, marginBottom: 10,
                  background: "#FEF3C7", borderRadius: 8, padding: "6px 10px",
                  border: "1px solid #FDE68A",
                }} data-testid={`urgency-available-${ticket.id}`}>
                  <Zap style={{ width: 13, height: 13, color: "#D97706" }} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#92400E" }}>
                    {ticket.availableToday} ingressos restantes hoje
                  </span>
                </div>
              )}

              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, fontSize: 12, color: "#6B7280", marginBottom: 10 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <MapPin style={{ width: 14, height: 14, color: "#3B82F6" }} />
                  {ticket.location}
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <Clock style={{ width: 14, height: 14, color: "#22C55E" }} />
                  {ticket.duration}
                </span>
                {ticket.ageGroup && (
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <Users style={{ width: 14, height: 14, color: "#A855F7" }} />
                    {ticket.ageGroup}
                  </span>
                )}
              </div>

              {ticket.features && ticket.features.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--rsv-space-2)", marginBottom: "var(--rsv-space-3)" }}>
                  {ticket.features.slice(0, 4).map((f) => (
                    <span
                      key={f}
                      style={{
                        background: "var(--rsv-surface-alt)", 
                        borderRadius: "var(--rsv-radius-sm)",
                        padding: "var(--rsv-space-1) var(--rsv-space-3)", 
                        fontSize: "var(--rsv-text-xs)", 
                        color: "var(--rsv-text-secondary)",
                      }}
                    >
                      {f}
                    </span>
                  ))}
                  {ticket.features.length > 4 && (
                    <span style={{
                      fontSize: "var(--rsv-text-xs)",
                      color: "var(--rsv-text-tertiary)",
                      padding: "var(--rsv-space-1) var(--rsv-space-2)",
                    }}>
                      +{ticket.features.length - 4} mais
                    </span>
                  )}
                </div>
              )}

              <AlsoBoughtMini
                ticket={ticket}
                allTickets={tickets}
                cart={cart}
                onQuickAdd={(t) => onBuy(t)}
              />

              <div style={{ marginTop: "auto", paddingTop: "var(--rsv-space-3)" }}>
                <div style={{ marginBottom: "var(--rsv-space-3)" }}>
                  {ticket.originalPrice && (
                    <span style={{ 
                      fontSize: "var(--rsv-text-sm)", 
                      color: "var(--rsv-text-muted)", 
                      textDecoration: "line-through", 
                      marginRight: "var(--rsv-space-2)" 
                    }}>
                      {formatPrice(ticket.originalPrice)}
                    </span>
                  )}
                  <span
                    style={{ 
                      fontSize: "var(--rsv-text-2xl)", 
                      fontWeight: "var(--rsv-font-bold)", 
                      color: "var(--rsv-success-dark)" 
                    }}
                    data-testid={`text-price-${ticket.id}`}
                  >
                    {formatPrice(ticket.price)}
                  </span>
                  <span style={{ 
                    fontSize: "var(--rsv-text-xs)", 
                    color: "var(--rsv-text-muted)", 
                    marginLeft: "var(--rsv-space-1)" 
                  }}>por pessoa</span>
                </div>

                <div style={{ minHeight: 44 }}>
                  {qty === 0 ? (
                    <button
                      data-testid={`button-buy-${ticket.id}`}
                      onClick={() => onBuy(ticket)}
                      style={{
                        width: "100%", 
                        padding: "var(--rsv-space-4) 0", 
                        border: "none", 
                        borderRadius: "var(--rsv-radius-lg)",
                        color: "var(--rsv-white)", 
                        fontSize: "var(--rsv-text-base)", 
                        fontWeight: "var(--rsv-font-bold)", 
                        cursor: "pointer",
                        background: ticket.popular
                          ? "linear-gradient(135deg, var(--rsv-success), var(--rsv-success-dark))"
                          : "linear-gradient(135deg, var(--rsv-info), var(--rsv-action-blue))",
                        display: "flex", 
                        alignItems: "center", 
                        justifyContent: "center", 
                        gap: "var(--rsv-space-2)",
                        boxShadow: "var(--rsv-shadow-md)",
                        transition: `all var(--rsv-duration-base) var(--rsv-ease-default)`,
                      }}
                    >
                      <ShoppingCart style={{ width: 18, height: 18 }} />
                      Comprar Agora
                    </button>
                  ) : (
                    <div
                      data-testid={`stepper-${ticket.id}`}
                      style={{
                        width: "100%", 
                        display: "flex", 
                        alignItems: "center",
                        justifyContent: "space-between", 
                        borderRadius: "var(--rsv-radius-lg)",
                        border: "2px solid var(--rsv-success)", 
                        padding: "var(--rsv-space-3) var(--rsv-space-3)",
                        background: "var(--rsv-success-light)",
                      }}
                    >
                      <button
                        data-testid={`button-decrease-${ticket.id}`}
                        onClick={() => onDec(ticket, qty)}
                        style={{
                          width: 34, height: 34, borderRadius: 8, border: "none",
                          background: qty === 1 ? "#FEE2E2" : "#DCFCE7",
                          color: qty === 1 ? "#EF4444" : "#16A34A",
                          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                        }}
                      >
                        {qty === 1 ? <Trash2 style={{ width: 15, height: 15 }} /> : <Minus style={{ width: 15, height: 15 }} />}
                      </button>
                      <span
                        style={{ fontSize: 16, fontWeight: 800, color: "#16A34A" }}
                        data-testid={`text-qty-${ticket.id}`}
                      >
                        {qty}x — {formatPrice(ticket.price * qty)}
                      </span>
                      <button
                        data-testid={`button-increase-${ticket.id}`}
                        onClick={() => onInc(ticket, qty)}
                        style={{
                          width: 34, height: 34, borderRadius: 8, border: "none",
                          background: "#DCFCE7", color: "#16A34A",
                          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                        }}
                      >
                        <Plus style={{ width: 15, height: 15 }} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
