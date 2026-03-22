import { useState, useMemo } from "react"
import { ChevronDown, ChevronUp, ShoppingCart, Minus, Plus, Trash2, Info, ChevronRight, MapPin, Clock, Users, Flame, AlertTriangle, Zap } from "lucide-react"
import { type CartItem, getCartItemQty } from "@/lib/cart-store"
import { type TicketItem } from "@/components/TicketsGrid"
import { trackEvent } from "@/lib/analytics"

interface CategorySectionDef {
  id: string
  title: string
  subtitle: string
  icon: string
  color: string
  bgColor: string
  cabana?: boolean
  grid?: boolean
}

export const CATEGORY_SECTIONS: CategorySectionDef[] = [
  {
    id: "ingresso-1-dia",
    title: "Ingresso 1 Dia",
    subtitle: "Acesso completo por um dia inteiro",
    icon: "🎟️",
    color: "#0891B2",
    bgColor: "#F0F9FF",
  },
  {
    id: "transporte",
    title: "Transporte Promocional",
    subtitle: "Ida e volta com conforto garantido",
    icon: "🚌",
    color: "#7C3AED",
    bgColor: "#F5F3FF",
  },
  {
    id: "combos",
    title: "Combos",
    subtitle: "Combine parques e economize até 25%",
    icon: "✨",
    color: "#D97706",
    bgColor: "#FFFBEB",
  },
  {
    id: "especiais",
    title: "Ingressos Especiais",
    subtitle: "Experiências exclusivas e premium",
    icon: "⭐",
    color: "#DC2626",
    bgColor: "#FEF2F2",
    grid: true,
  },
  {
    id: "cabanas",
    title: "Espaço Cabanas no Aqua Park",
    subtitle: "Reserve sua área exclusiva com conforto total",
    icon: "🏕️",
    color: "#16A34A",
    bgColor: "#F0FDF4",
    cabana: true,
    grid: true,
  },
]

function formatPrice(price: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price)
}

function TicketRowCard({
  ticket,
  cart,
  onBuy,
  onInc,
  onDec,
  cabana,
  priceMultiplier,
}: {
  ticket: TicketItem
  cart: CartItem[]
  onBuy: (t: TicketItem) => void
  onInc: (t: TicketItem, qty: number) => void
  onDec: (t: TicketItem, qty: number) => void
  cabana?: boolean
  priceMultiplier: number
}) {
  const [expanded, setExpanded] = useState(false)
  const qty = getCartItemQty(cart, ticket.id)
  const adjPrice = Math.round(ticket.price * priceMultiplier)
  const adjOriginal = Math.round(ticket.originalPrice * priceMultiplier)
  const isLowStock = (ticket.availableToday ?? 0) > 0 && (ticket.availableToday ?? 99) <= 10

  return (
    <div
      data-testid={`card-ticket-${ticket.id}`}
      style={{
        background: cabana ? "linear-gradient(135deg, #ECFDF5, #F0FDF4)" : "#fff",
        border: cabana ? "1.5px solid #BBF7D0" : "1px solid #F3F4F6",
        borderRadius: 14,
        overflow: "hidden",
        transition: "box-shadow 0.2s",
        boxShadow: qty > 0 ? "0 0 0 2px #22C55E" : "0 1px 6px rgba(0,0,0,0.06)",
      }}
    >
      <div style={{ display: "flex", gap: 0 }}>
        {ticket.image && (
          <img
            src={ticket.image}
            alt={ticket.name}
            style={{
              width: 88, minHeight: 100, objectFit: "cover", flexShrink: 0,
              borderRadius: "14px 0 0 0",
            }}
          />
        )}
        <div style={{ flex: 1, padding: "12px 14px", minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              {ticket.popular && (
                <span style={{
                  display: "inline-block", fontSize: 9, fontWeight: 800,
                  background: "#FACC15", color: "#000",
                  padding: "1px 6px", borderRadius: 4, marginBottom: 4,
                  textTransform: "uppercase",
                }}>
                  Mais popular
                </span>
              )}
              <h3
                style={{ fontSize: 14, fontWeight: 700, margin: "0 0 3px", color: "#111827", lineHeight: 1.3 }}
                data-testid={`text-ticket-name-${ticket.id}`}
              >
                {ticket.name}
              </h3>
              <p style={{ fontSize: 12, color: "#6B7280", margin: "0 0 6px", lineHeight: 1.4 }}>
                {ticket.description}
              </p>
            </div>
          </div>

          {(ticket.soldToday ?? 0) > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 4 }}>
              <Flame style={{ width: 11, height: 11, color: "#EF4444" }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: "#EF4444" }} data-testid={`text-sold-today-${ticket.id}`}>
                {ticket.soldToday} vendidos hoje
              </span>
            </div>
          )}

          {isLowStock && (
            <div style={{
              display: "flex", alignItems: "center", gap: 4, marginBottom: 6,
              background: "#FEF2F2", borderRadius: 6, padding: "4px 8px",
              border: "1px solid #FECACA",
            }} data-testid={`urgency-low-stock-${ticket.id}`}>
              <AlertTriangle style={{ width: 11, height: 11, color: "#DC2626" }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: "#DC2626" }}>
                Apenas {ticket.availableToday} restantes!
              </span>
            </div>
          )}

          {!isLowStock && (ticket.availableToday ?? 0) > 0 && (
            <div style={{
              display: "flex", alignItems: "center", gap: 4, marginBottom: 6,
            }} data-testid={`urgency-available-${ticket.id}`}>
              <Zap style={{ width: 11, height: 11, color: "#D97706" }} />
              <span style={{ fontSize: 11, color: "#92400E" }}>
                {ticket.availableToday} disponíveis hoje
              </span>
            </div>
          )}

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, fontSize: 11, color: "#6B7280", marginBottom: 8 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
              <MapPin style={{ width: 11, height: 11, color: "#3B82F6" }} />
              {ticket.location}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
              <Clock style={{ width: 11, height: 11, color: "#22C55E" }} />
              {ticket.duration}
            </span>
            {ticket.ageGroup && (
              <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
                <Users style={{ width: 11, height: 11, color: "#A855F7" }} />
                {ticket.ageGroup}
              </span>
            )}
          </div>

          {expanded && ticket.features.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
              {ticket.features.map((f) => (
                <span key={f} style={{
                  background: "#F3F4F6", borderRadius: 5,
                  padding: "3px 8px", fontSize: 10, color: "#374151",
                }}>
                  {f}
                </span>
              ))}
            </div>
          )}

          <button
            data-testid={`button-saiba-mais-${ticket.id}`}
            onClick={() => setExpanded(e => !e)}
            style={{
              background: "none", border: "none", padding: 0, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 3,
              fontSize: 11, fontWeight: 600, color: "#0891B2",
              marginBottom: 8,
            }}
          >
            <Info style={{ width: 11, height: 11 }} />
            {expanded ? "Ver menos" : "Saiba mais"}
            {expanded
              ? <ChevronUp style={{ width: 11, height: 11 }} />
              : <ChevronRight style={{ width: 11, height: 11 }} />}
          </button>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                {adjOriginal !== adjPrice && (
                  <span style={{ fontSize: 12, color: "#9CA3AF", textDecoration: "line-through" }}>
                    {formatPrice(adjOriginal)}
                  </span>
                )}
                <span
                  style={{ fontSize: 20, fontWeight: 800, color: "#16A34A" }}
                  data-testid={`text-price-${ticket.id}`}
                >
                  {formatPrice(adjPrice)}
                </span>
                <span style={{ fontSize: 11, color: "#9CA3AF" }}>por pessoa</span>
              </div>
              <span style={{
                fontSize: 10, fontWeight: 700, color: "#EF4444",
                background: "#FEE2E2", padding: "2px 6px", borderRadius: 4,
              }}>
                -{ticket.discount}% OFF
              </span>
            </div>

            <div>
              {qty === 0 ? (
                <button
                  data-testid={`button-buy-${ticket.id}`}
                  onClick={() => onBuy(ticket)}
                  style={{
                    padding: "10px 18px", border: "none", borderRadius: 10,
                    background: cabana
                      ? "linear-gradient(135deg, #16A34A, #15803D)"
                      : ticket.popular
                      ? "linear-gradient(135deg, #22C55E, #16A34A)"
                      : "linear-gradient(135deg, #0891B2, #2563EB)",
                    color: "#fff", fontSize: 13, fontWeight: 800, cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 6,
                    boxShadow: "0 3px 10px rgba(0,0,0,0.15)",
                  }}
                >
                  <ShoppingCart style={{ width: 14, height: 14 }} />
                  Adicionar
                </button>
              ) : (
                <div
                  data-testid={`stepper-${ticket.id}`}
                  style={{
                    display: "flex", alignItems: "center", gap: 6,
                    border: "2px solid #22C55E", borderRadius: 10,
                    background: "#F0FDF4", padding: "6px 10px",
                  }}
                >
                  <button
                    data-testid={`button-decrease-${ticket.id}`}
                    onClick={() => onDec(ticket, qty)}
                    style={{
                      width: 28, height: 28, border: "none", borderRadius: 6,
                      background: qty === 1 ? "#FEE2E2" : "#DCFCE7",
                      color: qty === 1 ? "#EF4444" : "#16A34A",
                      cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                  >
                    {qty === 1 ? <Trash2 style={{ width: 12, height: 12 }} /> : <Minus style={{ width: 12, height: 12 }} />}
                  </button>
                  <span
                    style={{ fontSize: 13, fontWeight: 800, color: "#16A34A", minWidth: 40, textAlign: "center" }}
                    data-testid={`text-qty-${ticket.id}`}
                  >
                    {qty}x
                  </span>
                  <button
                    data-testid={`button-increase-${ticket.id}`}
                    onClick={() => onInc(ticket, qty)}
                    style={{
                      width: 28, height: 28, border: "none", borderRadius: 6,
                      background: "#DCFCE7", color: "#16A34A",
                      cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                  >
                    <Plus style={{ width: 12, height: 12 }} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function TicketGridCard({
  ticket,
  cart,
  onBuy,
  onInc,
  onDec,
  cabana,
  priceMultiplier,
}: {
  ticket: TicketItem
  cart: CartItem[]
  onBuy: (t: TicketItem) => void
  onInc: (t: TicketItem, qty: number) => void
  onDec: (t: TicketItem, qty: number) => void
  cabana?: boolean
  priceMultiplier: number
}) {
  const qty = getCartItemQty(cart, ticket.id)
  const adjPrice = Math.round(ticket.price * priceMultiplier)
  const adjOriginal = Math.round(ticket.originalPrice * priceMultiplier)

  return (
    <div
      data-testid={`card-ticket-${ticket.id}`}
      style={{
        background: cabana ? "linear-gradient(135deg, #ECFDF5, #F0FDF4)" : "#fff",
        border: cabana ? "1.5px solid #BBF7D0" : "1px solid #F3F4F6",
        borderRadius: 14,
        overflow: "hidden",
        display: "flex", flexDirection: "column",
        boxShadow: qty > 0 ? "0 0 0 2px #22C55E" : "0 1px 6px rgba(0,0,0,0.06)",
        transition: "box-shadow 0.2s",
      }}
    >
      {ticket.image && (
        <img
          src={ticket.image}
          alt={ticket.name}
          style={{ width: "100%", height: 120, objectFit: "cover" }}
        />
      )}
      <div style={{ padding: "12px 14px", flex: 1, display: "flex", flexDirection: "column" }}>
        {ticket.popular && (
          <span style={{
            display: "inline-block", fontSize: 9, fontWeight: 800,
            background: "#FACC15", color: "#000",
            padding: "1px 6px", borderRadius: 4, marginBottom: 4,
            textTransform: "uppercase",
          }}>
            Mais popular
          </span>
        )}
        <h3
          style={{ fontSize: 13, fontWeight: 700, margin: "0 0 4px", color: "#111827", lineHeight: 1.3 }}
          data-testid={`text-ticket-name-${ticket.id}`}
        >
          {ticket.name}
        </h3>
        <p style={{ fontSize: 11, color: "#6B7280", margin: "0 0 8px", lineHeight: 1.4, flex: 1 }}>
          {ticket.description}
        </p>

        <div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 4 }}>
            {adjOriginal !== adjPrice && (
              <span style={{ fontSize: 11, color: "#9CA3AF", textDecoration: "line-through" }}>
                {formatPrice(adjOriginal)}
              </span>
            )}
            <span
              style={{ fontSize: 18, fontWeight: 800, color: "#16A34A" }}
              data-testid={`text-price-${ticket.id}`}
            >
              {formatPrice(adjPrice)}
            </span>
          </div>
          <span style={{ fontSize: 9, color: "#9CA3AF" }}>por pessoa</span>

          <div style={{ marginTop: 10 }}>
            {qty === 0 ? (
              <button
                data-testid={`button-buy-${ticket.id}`}
                onClick={() => onBuy(ticket)}
                style={{
                  width: "100%", padding: "9px 0", border: "none", borderRadius: 9,
                  background: cabana
                    ? "linear-gradient(135deg, #16A34A, #15803D)"
                    : "linear-gradient(135deg, #0891B2, #2563EB)",
                  color: "#fff", fontSize: 12, fontWeight: 800, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                }}
              >
                <ShoppingCart style={{ width: 13, height: 13 }} />
                Reservar
              </button>
            ) : (
              <div
                data-testid={`stepper-${ticket.id}`}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  border: "2px solid #22C55E", borderRadius: 9, background: "#F0FDF4", padding: "6px 8px",
                }}
              >
                <button
                  data-testid={`button-decrease-${ticket.id}`}
                  onClick={() => onDec(ticket, qty)}
                  style={{
                    width: 26, height: 26, border: "none", borderRadius: 5,
                    background: qty === 1 ? "#FEE2E2" : "#DCFCE7",
                    color: qty === 1 ? "#EF4444" : "#16A34A",
                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  {qty === 1 ? <Trash2 style={{ width: 11, height: 11 }} /> : <Minus style={{ width: 11, height: 11 }} />}
                </button>
                <span
                  style={{ fontSize: 13, fontWeight: 800, color: "#16A34A" }}
                  data-testid={`text-qty-${ticket.id}`}
                >
                  {qty}x
                </span>
                <button
                  data-testid={`button-increase-${ticket.id}`}
                  onClick={() => onInc(ticket, qty)}
                  style={{
                    width: 26, height: 26, border: "none", borderRadius: 5,
                    background: "#DCFCE7", color: "#16A34A",
                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  <Plus style={{ width: 11, height: 11 }} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

interface CategoryAccordionProps {
  tickets: TicketItem[]
  cart: CartItem[]
  onBuy: (t: TicketItem) => void
  onInc: (t: TicketItem, qty: number) => void
  onDec: (t: TicketItem, qty: number) => void
  priceMultiplier: number
}

export function CategoryAccordion({
  tickets,
  cart,
  onBuy,
  onInc,
  onDec,
  priceMultiplier,
}: CategoryAccordionProps) {
  const [openSections, setOpenSections] = useState<Set<string>>(
    new Set(["ingresso-1-dia"])
  )

  function toggleSection(id: string) {
    setOpenSections((prev) => {
      const next = new Set(prev)
      const expanded = !next.has(id)
      if (!expanded) next.delete(id)
      else next.add(id)
      trackEvent("category_expand", { sectionId: id, expanded })
      return next
    })
  }

  const ticketsBySection = useMemo(() => {
    const map = new Map<string, TicketItem[]>()
    for (const s of CATEGORY_SECTIONS) map.set(s.id, [])
    for (const t of tickets) {
      const key = (t as TicketItem & { categorySection?: string }).categorySection ?? "ingresso-1-dia"
      if (map.has(key)) map.get(key)!.push(t)
      else if (map.has("ingresso-1-dia")) map.get("ingresso-1-dia")!.push(t)
    }
    return map
  }, [tickets])

  function getCartCountForSection(sectionId: string): number {
    const sectionTickets = ticketsBySection.get(sectionId) ?? []
    return sectionTickets.reduce((sum, t) => sum + getCartItemQty(cart, t.id), 0)
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: "0 16px 100px" }}>
      {CATEGORY_SECTIONS.map((section) => {
        const sectionTickets = ticketsBySection.get(section.id) ?? []
        if (sectionTickets.length === 0) return null
        const isOpen = openSections.has(section.id)
        const cartCount = getCartCountForSection(section.id)

        return (
          <div
            key={section.id}
            data-testid={`section-category-${section.id}`}
            style={{
              background: isOpen ? section.bgColor : "#fff",
              borderRadius: 14,
              border: `1.5px solid ${isOpen ? section.color + "40" : "#E5E7EB"}`,
              overflow: "hidden",
              transition: "all 0.2s",
            }}
          >
            <button
              data-testid={`button-accordion-${section.id}`}
              onClick={() => toggleSection(section.id)}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 12,
                padding: "14px 16px", background: "transparent",
                border: "none", cursor: "pointer", textAlign: "left",
              }}
            >
              <span style={{ fontSize: 20, lineHeight: 1 }}>{section.icon}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#111827" }}>
                  {section.title}
                </div>
                <div style={{ fontSize: 11, color: "#6B7280", marginTop: 1 }}>
                  {section.subtitle}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                {cartCount > 0 && (
                  <span
                    data-testid={`badge-cart-count-${section.id}`}
                    style={{
                      background: "#22C55E", color: "#fff",
                      fontSize: 11, fontWeight: 800,
                      padding: "3px 8px", borderRadius: 10,
                      minWidth: 22, textAlign: "center",
                    }}
                  >
                    {cartCount}
                  </span>
                )}
                <div style={{
                  width: 28, height: 28, borderRadius: 8,
                  background: isOpen ? section.color : "#F3F4F6",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {isOpen
                    ? <ChevronUp style={{ width: 15, height: 15, color: "#fff" }} />
                    : <ChevronDown style={{ width: 15, height: 15, color: "#6B7280" }} />}
                </div>
              </div>
            </button>

            {isOpen && (
              <div style={{ padding: "0 12px 14px" }}>
                {section.grid ? (
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
                    gap: 10,
                  }}>
                    {sectionTickets.map((ticket) => (
                      <TicketGridCard
                        key={ticket.id}
                        ticket={ticket}
                        cart={cart}
                        onBuy={onBuy}
                        onInc={onInc}
                        onDec={onDec}
                        cabana={section.cabana}
                        priceMultiplier={priceMultiplier}
                      />
                    ))}
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {sectionTickets.map((ticket) => (
                      <TicketRowCard
                        key={ticket.id}
                        ticket={ticket}
                        cart={cart}
                        onBuy={onBuy}
                        onInc={onInc}
                        onDec={onDec}
                        cabana={section.cabana}
                        priceMultiplier={priceMultiplier}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
