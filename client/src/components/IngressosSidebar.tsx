import { useState, useEffect } from "react"
import { MapPin, Calendar, ShoppingCart, ArrowRight, ChevronUp, ChevronDown, ChevronDown as ChevronBounce } from "lucide-react"
import { type CartItem } from "@/lib/cart-store"
import { CATEGORY_SECTIONS } from "@/components/CategoryAccordion"

interface IngressosSidebarProps {
  cart: CartItem[]
  total: number
  selectedDate: Date | null
  onCheckout: () => void
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price)
}

function formatDate(date: Date | null): string {
  if (!date) return "Selecione uma data"
  return date.toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })
}

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 768)
  useEffect(() => {
    const handler = () => setIsDesktop(window.innerWidth >= 768)
    window.addEventListener("resize", handler)
    return () => window.removeEventListener("resize", handler)
  }, [])
  return isDesktop
}

const PARK_NAME = "Caldas Novas / Rio Quente - GO"

const TEASER_SECTIONS = CATEGORY_SECTIONS.slice(1)

function scrollToSection(sectionId: string) {
  const el = document.getElementById(`section-${sectionId}`)
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" })
  }
}

function SidebarTeasers() {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  return (
    <>
      <style>{`
        @keyframes rsv-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(4px); }
        }
        .rsv-teaser-chevron {
          animation: rsv-bounce 1.4s ease-in-out infinite;
        }
      `}</style>

      <div style={{ marginTop: 12 }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 8, marginBottom: 10, padding: "0 2px",
        }}>
          <div style={{ flex: 1, height: 1, background: "#E5E7EB" }} />
          <span style={{
            fontSize: 10, fontWeight: 700, color: "#9CA3AF",
            letterSpacing: 0.8, textTransform: "uppercase", whiteSpace: "nowrap",
          }}>
            Explore também
          </span>
          <div style={{ flex: 1, height: 1, background: "#E5E7EB" }} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {TEASER_SECTIONS.map((section) => {
            const isHovered = hoveredId === section.id
            return (
              <button
                key={section.id}
                type="button"
                data-testid={`teaser-card-${section.id}`}
                onClick={() => scrollToSection(section.id)}
                onMouseEnter={() => setHoveredId(section.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 12px",
                  background: isHovered ? section.bgColor : "#FAFAFA",
                  border: `1px solid ${isHovered ? section.color + "50" : "#E5E7EB"}`,
                  borderLeft: `3px solid ${section.color}`,
                  borderRadius: 10,
                  cursor: "pointer",
                  textAlign: "left",
                  width: "100%",
                  boxShadow: isHovered
                    ? `0 4px 16px rgba(0,0,0,0.10), 0 0 0 1px ${section.color}20`
                    : "0 1px 3px rgba(0,0,0,0.04)",
                  transform: isHovered ? "translateY(-1px)" : "translateY(0)",
                  transition: "all 0.18s ease",
                }}
              >
                <span style={{ fontSize: 18, lineHeight: 1, flexShrink: 0 }}>{section.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 12, fontWeight: 700,
                    color: isHovered ? section.color : "#1F2937",
                    lineHeight: 1.2, marginBottom: 2,
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                    transition: "color 0.18s",
                  }}>
                    {section.title}
                  </div>
                  <div style={{
                    fontSize: 10, color: "#6B7280", lineHeight: 1.3,
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                  }}>
                    {section.subtitle}
                  </div>
                </div>
                <div style={{
                  display: "flex", flexDirection: "column", alignItems: "center",
                  gap: 1, flexShrink: 0,
                }}>
                  <span style={{ fontSize: 9, fontWeight: 700, color: section.color, letterSpacing: 0.3, whiteSpace: "nowrap" }}>
                    Ver mais
                  </span>
                  <ChevronBounce
                    className="rsv-teaser-chevron"
                    style={{ width: 14, height: 14, color: section.color }}
                  />
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </>
  )
}

function SidebarContent({ cart, total, selectedDate, onCheckout }: IngressosSidebarProps) {
  const itemsCount = cart.reduce((sum, it) => sum + it.quantity, 0)

  return (
    <div style={{
      background: "#fff",
      borderRadius: 16,
      boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
      overflow: "hidden",
      border: "1px solid #E5E7EB",
    }}>
      <div style={{
        background: "linear-gradient(135deg, #0891B2 0%, #2563EB 100%)",
        padding: "16px 18px",
        color: "#fff",
      }}>
        <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 0.3, opacity: 0.85, marginBottom: 2 }}>
          Resumo da Compra
        </div>
        <div style={{ fontSize: 11, opacity: 0.7 }}>
          {itemsCount} {itemsCount === 1 ? "ingresso" : "ingressos"} selecionado{itemsCount !== 1 ? "s" : ""}
        </div>
      </div>

      <div style={{ padding: "14px 16px" }}>
        <div style={{
          display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10,
          padding: "10px 12px", background: "#F0FDF4", borderRadius: 10, border: "1px solid #DCFCE7",
        }}>
          <MapPin style={{ width: 16, height: 16, color: "#16A34A", flexShrink: 0, marginTop: 1 }} />
          <div>
            <div style={{ fontSize: 10, fontWeight: 600, color: "#16A34A", marginBottom: 1 }}>SEU DESTINO</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#15803D" }}>{PARK_NAME}</div>
          </div>
        </div>

        <div style={{
          display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 14,
          padding: "10px 12px",
          background: selectedDate ? "#EFF6FF" : "#F9FAFB",
          borderRadius: 10,
          border: `1px solid ${selectedDate ? "#BFDBFE" : "#E5E7EB"}`,
        }}>
          <Calendar style={{ width: 16, height: 16, color: selectedDate ? "#2563EB" : "#9CA3AF", flexShrink: 0, marginTop: 1 }} />
          <div>
            <div style={{ fontSize: 10, fontWeight: 600, color: selectedDate ? "#2563EB" : "#9CA3AF", marginBottom: 1 }}>DATA DA VISITA</div>
            <div style={{ fontSize: 12, fontWeight: selectedDate ? 700 : 500, color: selectedDate ? "#1D4ED8" : "#9CA3AF", textTransform: "capitalize" }}>
              {formatDate(selectedDate)}
            </div>
          </div>
        </div>

        {cart.length === 0 ? (
          <div style={{ textAlign: "center", padding: "20px 0", color: "#9CA3AF" }}>
            <ShoppingCart style={{ width: 32, height: 32, margin: "0 auto 8px", opacity: 0.4 }} />
            <p style={{ fontSize: 13, margin: 0 }}>Nenhum ingresso adicionado</p>
            <p style={{ fontSize: 11, margin: "4px 0 0", opacity: 0.7 }}>Escolha seus ingressos ao lado</p>
          </div>
        ) : (
          <>
            <div style={{ borderTop: "1px solid #F3F4F6", paddingTop: 10, marginBottom: 10 }}>
              {cart.map((item) => (
                <div key={item.ticketId} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "6px 0", borderBottom: "1px solid #F9FAFB",
                }} data-testid={`sidebar-item-${item.ticketId}`}>
                  <div style={{ flex: 1, minWidth: 0, marginRight: 8 }}>
                    <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: "#1F2937", lineHeight: 1.3 }}>{item.name}</p>
                    <p style={{ margin: 0, fontSize: 11, color: "#6B7280" }}>{item.quantity}x {formatPrice(item.unitPrice)}</p>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#16A34A", flexShrink: 0 }}>
                    {formatPrice(item.unitPrice * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "10px 12px", background: "#F9FAFB", borderRadius: 10, marginBottom: 14,
            }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#374151" }}>Subtotal</span>
              <span style={{ fontSize: 18, fontWeight: 800, color: "#16A34A" }} data-testid="sidebar-total">
                {formatPrice(total)}
              </span>
            </div>

            <button
              data-testid="sidebar-checkout-btn"
              onClick={onCheckout}
              style={{
                width: "100%", padding: "13px 0", border: "none", borderRadius: 12,
                background: "linear-gradient(135deg, #22C55E, #16A34A)",
                color: "#fff", fontSize: 15, fontWeight: 800, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                boxShadow: "0 4px 14px rgba(34,197,94,0.35)",
                transition: "opacity 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.92")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Ir para pagamento
              <ArrowRight style={{ width: 16, height: 16 }} />
            </button>

            <p style={{ margin: "8px 0 0", fontSize: 10, color: "#9CA3AF", textAlign: "center" }}>
              Pagamento 100% seguro • Pix instantâneo
            </p>
          </>
        )}
      </div>
    </div>
  )
}

export function IngressosSidebar(props: IngressosSidebarProps) {
  const isDesktop = useIsDesktop()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { cart, total, onCheckout } = props

  if (isDesktop) {
    return (
      <div style={{ position: "sticky", top: 20 }}>
        <SidebarContent {...props} />
        <SidebarTeasers />
      </div>
    )
  }

  const itemsCount = cart.reduce((sum, it) => sum + it.quantity, 0)

  if (cart.length === 0) return null

  return (
    <>
      <div
        style={{
          position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 210,
        }}
      >
        {mobileOpen && (
          <div
            style={{
              position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
              zIndex: 205,
            }}
            onClick={() => setMobileOpen(false)}
          />
        )}

        <div style={{
          background: "#fff",
          borderRadius: mobileOpen ? "20px 20px 0 0" : "0",
          boxShadow: "0 -4px 24px rgba(0,0,0,0.12)",
          zIndex: 210,
          position: "relative",
          maxHeight: mobileOpen ? "80vh" : "auto",
          overflow: mobileOpen ? "auto" : "visible",
        }}>
          <button
            data-testid="mobile-sidebar-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              width: "100%", padding: "12px 16px", border: "none",
              background: "linear-gradient(135deg, #0891B2, #2563EB)",
              color: "#fff", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              borderRadius: mobileOpen ? "20px 20px 0 0" : "0",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 28, height: 28, borderRadius: 8, background: "rgba(255,255,255,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <ShoppingCart style={{ width: 14, height: 14 }} />
              </div>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>
                  {itemsCount} {itemsCount === 1 ? "ingresso" : "ingressos"} • {formatPrice(total)}
                </div>
                <div style={{ fontSize: 10, opacity: 0.75 }}>
                  {mobileOpen ? "Fechar resumo" : "Ver resumo da compra"}
                </div>
              </div>
            </div>
            {mobileOpen
              ? <ChevronDown style={{ width: 18, height: 18 }} />
              : <ChevronUp style={{ width: 18, height: 18 }} />
            }
          </button>

          {mobileOpen && (
            <div style={{ padding: "0 0 16px" }}>
              <SidebarContent {...props} />
              <div style={{ padding: "0 16px" }}>
                <button
                  data-testid="mobile-sidebar-checkout"
                  onClick={() => { setMobileOpen(false); onCheckout() }}
                  style={{
                    width: "100%", padding: "14px 0", border: "none", borderRadius: 12,
                    background: "linear-gradient(135deg, #22C55E, #16A34A)",
                    color: "#fff", fontSize: 16, fontWeight: 800, cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  }}
                >
                  Ir para pagamento
                  <ArrowRight style={{ width: 16, height: 16 }} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div style={{ height: 60 }} />
    </>
  )
}
