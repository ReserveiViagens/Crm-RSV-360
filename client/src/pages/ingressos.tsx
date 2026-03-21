import { useState, useEffect, useMemo, useRef } from "react"
import { ArrowLeft, Phone, MapPin, Clock, Users, ShoppingCart, Sparkles, BarChart3, X, Check, Timer, Flame, Tag, AlertTriangle, TrendingUp, Zap, Minus, Plus, ChevronRight, Trash2 } from "lucide-react"
import { Link, useLocation } from "wouter";
import {
  SocialProofBanner,
  AIRecommendedBadge,
  calculateMatchScore,
  getTravelerProfile,
  PersonalizedBanner,
  UrgencyIndicator,
  CrossSellSection,
} from "@/components/ai-conversion-elements"
import {
  addToCart,
  updateQty,
  getCartItemQty,
  type CartItem,
} from "@/lib/cart-store"
import { useTicketsCart } from "@/hooks/useTicketsCart"
import { trackEvent } from "@/lib/analytics"
import { QuickDecisionSection } from "@/components/QuickDecisionSection"
import { MiniWizard } from "@/components/MiniWizard"
import { CartStickyBar } from "@/components/CartStickyBar"

type QuickPick = "custo" | "familia" | "popular" | "combo"

const ticketsBase = [
  {
    id: "hot-park",
    name: "Ingresso Hot Park",
    description: "Aventura e relaxamento no maior parque de águas quentes da América do Sul! Toboáguas emocionantes e piscinas termais naturais.",
    price: 189,
    originalPrice: 220,
    discount: 14,
    image: "/images/lagoa-termas-parque.jpeg",
    features: ["Toboáguas radicais", "Piscinas termais", "Rio lento", "Área infantil", "Restaurantes"],
    location: "Rio Quente - GO",
    duration: "Dia inteiro",
    ageGroup: "Todas as idades",
    popular: true,
    soldToday: 0,
    availableToday: 0,
    category: "parques",
    tags: ["família", "aventura", "águas termais"],
    alsoBoght: ["diroma-acqua-park", "lagoa-termas"],
  },
  {
    id: "diroma-acqua-park",
    name: "Ingresso diRoma Acqua Park",
    description: "Diversão aquática para todas as idades com toboáguas emocionantes e piscinas de ondas incríveis.",
    price: 90,
    originalPrice: 110,
    discount: 18,
    image: "/images/diroma-acqua-park.jpeg",
    features: ["Toboáguas variados", "Piscina de ondas", "Área kids", "Bar molhado", "Espreguiçadeiras"],
    location: "Caldas Novas - GO",
    duration: "Dia inteiro",
    ageGroup: "Todas as idades",
    soldToday: 0,
    availableToday: 0,
    category: "parques",
    tags: ["família", "diversão", "ondas"],
    alsoBoght: ["kawana-park", "water-park"],
  },
  {
    id: "lagoa-termas",
    name: "Ingresso Lagoa Termas Parque",
    description: "Relaxe nas águas termais da Lagoa Quente e aproveite a natureza exuberante em um ambiente único.",
    price: 75,
    originalPrice: 95,
    discount: 21,
    image: "/images/hot-park.jpeg",
    features: ["Águas termais naturais", "Trilhas ecológicas", "Área de descanso", "Lanchonete", "Estacionamento"],
    location: "Caldas Novas - GO",
    duration: "Meio dia",
    ageGroup: "Todas as idades",
    soldToday: 0,
    availableToday: 0,
    category: "natureza",
    tags: ["relaxamento", "natureza", "casal"],
    alsoBoght: ["hot-park", "kawana-park"],
  },
  {
    id: "water-park",
    name: "Ingresso Water Park",
    description: "Parque aquático moderno com as mais novas atrações e tecnologia de ponta para diversão garantida.",
    price: 120,
    originalPrice: 150,
    discount: 20,
    image: "/images/water-park.jpeg",
    features: ["Toboáguas modernos", "Piscina com ondas", "Tirolesa aquática", "Área gourmet", "Wi-Fi gratuito"],
    location: "Caldas Novas - GO",
    duration: "Dia inteiro",
    ageGroup: "Todas as idades",
    soldToday: 0,
    availableToday: 0,
    category: "parques",
    tags: ["aventura", "tecnologia", "família"],
    alsoBoght: ["diroma-acqua-park", "hot-park"],
  },
  {
    id: "kawana-park",
    name: "Ingresso Kawana Park",
    description: "Parque aquático familiar com piscinas termais naturais, toboáguas emocionantes e área de lazer completa. Diversão garantida em águas quentinhas!",
    price: 85,
    originalPrice: 110,
    discount: 23,
    image: "/images/kawana-park.jpeg",
    features: ["Piscinas termais naturais", "Toboáguas familiares", "Área infantil aquática", "Bar e restaurante", "Deck para relaxamento"],
    location: "Caldas Novas - GO",
    duration: "Dia inteiro",
    ageGroup: "Todas as idades",
    soldToday: 0,
    availableToday: 0,
    category: "parques",
    tags: ["família", "relaxamento", "águas termais"],
    alsoBoght: ["lagoa-termas", "diroma-acqua-park"],
  },
]

function formatPrice(price: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price)
}

function getBestValueId(list: typeof ticketsBase) {
  let bestId = list[0].id
  let bestRatio = 0
  list.forEach((t) => {
    const ratio = t.discount / t.price
    if (ratio > bestRatio) {
      bestRatio = ratio
      bestId = t.id
    }
  })
  return bestId
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

function AlsoBoughtSection({ ticketId, allTickets }: { ticketId: string; allTickets: typeof ticketsBase }) {
  const ticket = allTickets.find(t => t.id === ticketId)
  if (!ticket || !ticket.alsoBoght || ticket.alsoBoght.length === 0) return null

  const recommended = ticket.alsoBoght
    .map(id => allTickets.find(t => t.id === id))
    .filter(Boolean) as typeof ticketsBase

  if (recommended.length === 0) return null

  return (
    <div style={{
      marginTop: 10, padding: "10px 12px", borderRadius: 10,
      background: "linear-gradient(135deg, #EFF6FF, #F0FDF4)",
      border: "1px solid #BFDBFE",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
        <TrendingUp style={{ width: 13, height: 13, color: "#2563EB" }} />
        <span style={{ fontSize: 11, fontWeight: 700, color: "#1F2937" }}>
          Quem comprou este, tambem comprou:
        </span>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        {recommended.map(r => (
          <div key={r.id} style={{
            flex: 1, background: "#fff", borderRadius: 8, padding: "8px 10px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: "#374151", margin: "0 0 4px", lineHeight: 1.3 }}>
              {r.name.replace("Ingresso ", "")}
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: "#16A34A" }}>{formatPrice(r.price)}</span>
              <span style={{
                fontSize: 9, fontWeight: 700, color: "#EF4444",
                background: "#FEE2E2", padding: "1px 5px", borderRadius: 4,
              }}>-{r.discount}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function IngressosPage() {
  const [, navigate] = useLocation()
  const [activeFilter, setActiveFilter] = useState("Todos")
  const [activePick, setActivePick] = useState<QuickPick | null>(null)
  const [showWizard, setShowWizard] = useState(false)
  const [profile, setProfile] = useState(getTravelerProfile())
  const [compareIds, setCompareIds] = useState<string[]>([])
  const [showCompare, setShowCompare] = useState(false)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [timer, setTimer] = useState({ minutes: 47, seconds: 23 })
  const [tickets, setTickets] = useState(ticketsBase)

  const { cart, total: cartTotal, addManyToCart, updateTicketQty } = useTicketsCart()

  const bestValueId = useMemo(() => getBestValueId(tickets), [tickets])

  const comboTickets = useMemo(() => {
    if (profile) {
      const scored = tickets.map(t => ({
        ...t,
        matchScore: calculateMatchScore(profile, { category: t.category, price: t.price, tags: t.tags }),
      }))
      const sorted = [...scored].sort((a, b) => b.matchScore - a.matchScore)
      return [sorted[0], sorted[1], sorted[2]].filter(Boolean)
    }
    const sorted = [...tickets].sort((a, b) => b.discount - a.discount)
    return [sorted[0], sorted[1]]
  }, [tickets, profile])

  const comboOriginalPrice = comboTickets.reduce((sum, t) => sum + t.price, 0)
  const comboDiscountedPrice = Math.round(comboOriginalPrice * 0.85)

  useEffect(() => {
    setProfile(getTravelerProfile())
    setTickets(ticketsBase.map((t) => ({
      ...t,
      soldToday: Math.floor(Math.random() * 40) + 20,
      availableToday: Math.floor(Math.random() * 30) + 5,
    })))
    trackEvent("tickets_page_view")
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 }
        if (prev.minutes > 0) return { minutes: prev.minutes - 1, seconds: 59 }
        return { minutes: 47, seconds: 23 }
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setTickets(prev => prev.map(t => ({
        ...t,
        soldToday: t.soldToday + (Math.random() > 0.6 ? 1 : 0),
        availableToday: Math.max(1, t.availableToday - (Math.random() > 0.7 ? 1 : 0)),
      })))
    }, 8000)
    return () => clearInterval(interval)
  }, [])

  const FILTERS = ["Todos", "Dia Inteiro", "Meio Dia", "Mais Popular", "Maior Desconto"]

  const filteredTickets = useMemo(() => {
    const FAMILY_TAGS = ["família", "familia", "kids", "infantil"]
    let base = (() => {
      switch (activeFilter) {
        case "Dia Inteiro": return tickets.filter((t) => t.duration === "Dia inteiro")
        case "Meio Dia": return tickets.filter((t) => t.duration === "Meio dia")
        case "Mais Popular": return [...tickets].sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0))
        case "Maior Desconto": return [...tickets].sort((a, b) => (b.discount || 0) - (a.discount || 0))
        default: return tickets
      }
    })()

    switch (activePick) {
      case "custo":
        return [...base].sort((a, b) => (b.discount / b.price) - (a.discount / a.price))
      case "familia":
        return [...base].sort((a, b) => {
          const aFam = a.tags.some(t => FAMILY_TAGS.some(f => t.toLowerCase().includes(f))) ? 1 : 0
          const bFam = b.tags.some(t => FAMILY_TAGS.some(f => t.toLowerCase().includes(f))) ? 1 : 0
          return bFam - aFam
        })
      case "popular":
        return [...base].sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0))
      default:
        return base
    }
  }, [tickets, activeFilter, activePick])

  function handleQuickPick(pick: QuickPick) {
    if (pick === "combo") {
      setActivePick("combo")
      setShowWizard(true)
    } else {
      setActivePick(prev => prev === pick ? null : pick)
    }
  }

  const toggleCompare = (id: string) => {
    setCompareIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 3 ? [...prev, id] : prev
    )
  }

  const compareTickets = tickets.filter((t) => compareIds.includes(t.id))

  function handleCartBuy(ticket: typeof ticketsBase[0]) {
    const updated = addToCart({
      ticketId: ticket.id,
      name: ticket.name,
      unitPrice: ticket.price,
      originalPrice: ticket.originalPrice,
      discount: ticket.discount,
      image: ticket.image,
    })
    trackEvent("ticket_add_to_cart", { ticketId: ticket.id, quantity: 1 })
    return updated
  }

  return (
    <div className="rsv-subpage">
      <div
        style={{
          background: "linear-gradient(135deg, #0891B2 0%, #2563EB 100%)",
          color: "#fff",
          padding: "24px 20px 0",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Link href="/" style={{ color: "#fff", display: "flex", alignItems: "center" }} data-testid="link-back-home">
              <ArrowLeft style={{ width: 22, height: 22 }} />
            </Link>
            <div style={{
              width: 40, height: 40, borderRadius: "50%",
              border: "2px solid #fff", display: "flex", alignItems: "center", justifyContent: "center",
              background: "rgba(255,255,255,0.1)", fontSize: 9, fontWeight: 900, letterSpacing: -0.5,
            }}>
              <span>RSV<span style={{ color: "#F57C00" }}>360</span></span>
            </div>
            <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: -0.5 }}>Reservei Viagens</span>
          </div>
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 800, margin: "0 0 8px" }} data-testid="text-page-title">Ingressos para Parques</h1>
        <p style={{ fontSize: 14, opacity: 0.9, margin: "0 0 8px" }}>Até 25% OFF + Entrada prioritária</p>

        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "rgba(220,38,38,0.2)", borderRadius: 10, padding: "6px 14px",
          marginBottom: 14,
        }}>
          <Timer style={{ width: 14, height: 14, color: "#FCA5A5" }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: "#FCA5A5" }} data-testid="text-countdown-timer">
            Preço especial por mais {String(timer.minutes).padStart(2, "0")}:{String(timer.seconds).padStart(2, "0")}
          </span>
        </div>

        <div style={{ display: "flex", gap: 0, borderBottom: "2px solid rgba(255,255,255,0.15)" }}>
          {FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              data-testid={`button-filter-${filter.toLowerCase().replace(/ /g, "-")}`}
              style={{
                flex: 1, maxWidth: 120, padding: "10px 0", border: "none", background: "transparent",
                color: activeFilter === filter ? "#fff" : "rgba(255,255,255,0.6)",
                fontSize: 13, fontWeight: activeFilter === filter ? 700 : 500,
                cursor: "pointer", position: "relative",
                borderBottom: activeFilter === filter ? "2px solid #F57C00" : "2px solid transparent",
                marginBottom: -2, transition: "all 0.2s", whiteSpace: "nowrap",
              }}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <SocialProofBanner pageName="ingressos" />
      <PersonalizedBanner profile={profile} />

      <QuickDecisionSection onPick={handleQuickPick} activePick={activePick === "combo" ? null : activePick} />

      <div style={{
        margin: "16px 16px 0", padding: 20, borderRadius: 16,
        background: "linear-gradient(135deg, #7C3AED, #DB2777)",
        color: "#fff", position: "relative", overflow: "hidden",
      }} data-testid="section-combo-ia">
        <div style={{
          position: "absolute", top: -20, right: -20, width: 100, height: 100,
          borderRadius: "50%", background: "rgba(255,255,255,0.1)",
        }} />
        <div style={{
          position: "absolute", bottom: -30, left: -30, width: 80, height: 80,
          borderRadius: "50%", background: "rgba(255,255,255,0.05)",
        }} />
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <Sparkles style={{ width: 20, height: 20, color: "#FDE68A" }} />
          <span style={{ fontSize: 14, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.5 }}>
            Combo IA — Sugestão Inteligente
          </span>
        </div>
        <p style={{ fontSize: 13, margin: "0 0 12px", opacity: 0.9 }}>
          {profile
            ? `Baseado no seu perfil, a IA selecionou ${comboTickets.length} parques ideais para você:`
            : "A IA analisou os parques e sugere a melhor combinação para você:"}
        </p>
        <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
          {comboTickets.map((t) => (
            <div key={t.id} style={{
              flex: 1, minWidth: 100, background: "rgba(255,255,255,0.15)",
              borderRadius: 10, padding: "10px 12px",
            }}>
              <p style={{ fontSize: 13, fontWeight: 700, margin: "0 0 4px" }}>{t.name}</p>
              <span style={{ fontSize: 12, opacity: 0.8 }}>{formatPrice(t.price)}</span>
              {profile && 'matchScore' in t && (
                <div style={{
                  marginTop: 4, fontSize: 10, fontWeight: 700,
                  background: "rgba(255,255,255,0.2)", borderRadius: 4,
                  padding: "2px 6px", display: "inline-block",
                }}>
                  {(t as any).matchScore}% match
                </div>
              )}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14, flexWrap: "wrap" }}>
          <span style={{ fontSize: 14, textDecoration: "line-through", opacity: 0.6 }}>
            {formatPrice(comboOriginalPrice)}
          </span>
          <span style={{ fontSize: 24, fontWeight: 800 }}>
            {formatPrice(comboDiscountedPrice)}
          </span>
          <span style={{
            background: "#FACC15", color: "#000", fontSize: 11, fontWeight: 800,
            padding: "3px 8px", borderRadius: 6,
          }}>
            -15% IA
          </span>
          <span style={{
            background: "rgba(255,255,255,0.2)", fontSize: 11, fontWeight: 600,
            padding: "3px 8px", borderRadius: 6,
          }}>
            Economia de {formatPrice(comboOriginalPrice - comboDiscountedPrice)}
          </span>
        </div>
        <button
          data-testid="button-combo-ia-buy"
          onClick={() =>
            window.open(
              `https://wa.me/5564993197555?text=Olá! Quero o Combo IA: ${comboTickets.map(t => t.name).join(" + ")} com 15% de desconto!`,
              "_blank"
            )
          }
          style={{
            width: "100%", padding: "13px 0", border: "none", borderRadius: 10,
            background: "#fff", color: "#7C3AED", fontSize: 15, fontWeight: 800,
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}
        >
          <ShoppingCart style={{ width: 18, height: 18 }} />
          Quero esse Combo!
        </button>
      </div>

      {compareIds.length >= 1 && (
        <div style={{
          position: "fixed", bottom: 80, left: "50%", transform: "translateX(-50%)",
          zIndex: 100, background: "#1F2937", color: "#fff", borderRadius: 14,
          padding: "10px 20px", display: "flex", alignItems: "center", gap: 12,
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
          animation: "slideUp 0.3s ease",
        }} data-testid="bar-compare">
          <BarChart3 style={{ width: 18, height: 18, color: "#60A5FA" }} />
          <span style={{ fontSize: 13, fontWeight: 600 }}>{compareIds.length}/3 selecionados</span>
          {compareIds.length >= 2 ? (
            <button
              onClick={() => setShowCompare(true)}
              data-testid="button-compare-open"
              style={{
                background: "#3B82F6", color: "#fff", border: "none", borderRadius: 8,
                padding: "8px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer",
              }}
            >
              Comparar Agora
            </button>
          ) : (
            <span style={{ fontSize: 12, color: "#9CA3AF" }}>Selecione mais {2 - compareIds.length}</span>
          )}
          <button
            onClick={() => setCompareIds([])}
            data-testid="button-compare-clear"
            style={{
              background: "transparent", color: "#9CA3AF", border: "none",
              cursor: "pointer", padding: 4,
            }}
          >
            <X style={{ width: 16, height: 16 }} />
          </button>
        </div>
      )}

      {showCompare && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 9999,
          background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
        }} onClick={() => setShowCompare(false)} data-testid="modal-compare">
          <div onClick={(e) => e.stopPropagation()} style={{
            background: "#fff", borderRadius: 20, width: "100%", maxWidth: 600,
            maxHeight: "90vh", overflow: "auto", padding: 24,
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
                <BarChart3 style={{ width: 22, height: 22, color: "#2563EB" }} />
                Comparar Ingressos
              </h2>
              <button onClick={() => setShowCompare(false)} data-testid="button-compare-close" style={{
                width: 32, height: 32, borderRadius: "50%", border: "none",
                background: "#F3F4F6", cursor: "pointer", display: "flex",
                alignItems: "center", justifyContent: "center",
              }}>
                <X style={{ width: 16, height: 16, color: "#6B7280" }} />
              </button>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #E5E7EB" }}>
                    <th style={{ textAlign: "left", padding: "8px 12px", color: "#6B7280", fontWeight: 600 }}>Característica</th>
                    {compareTickets.map((t) => (
                      <th key={t.id} style={{ textAlign: "center", padding: "8px 12px", fontWeight: 700, color: "#1F2937" }}>
                        {t.name.replace("Ingresso ", "")}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: "1px solid #F3F4F6" }}>
                    <td style={{ padding: "10px 12px", fontWeight: 600, color: "#374151" }}>Preço</td>
                    {compareTickets.map((t) => (
                      <td key={t.id} style={{ textAlign: "center", padding: "10px 12px", fontWeight: 700, color: "#16A34A" }}>
                        {formatPrice(t.price)}
                      </td>
                    ))}
                  </tr>
                  <tr style={{ borderBottom: "1px solid #F3F4F6" }}>
                    <td style={{ padding: "10px 12px", fontWeight: 600, color: "#374151" }}>Desconto</td>
                    {compareTickets.map((t) => (
                      <td key={t.id} style={{ textAlign: "center", padding: "10px 12px", fontWeight: 700, color: "#EF4444" }}>
                        -{t.discount}%
                      </td>
                    ))}
                  </tr>
                  <tr style={{ borderBottom: "1px solid #F3F4F6" }}>
                    <td style={{ padding: "10px 12px", fontWeight: 600, color: "#374151" }}>Localização</td>
                    {compareTickets.map((t) => (
                      <td key={t.id} style={{ textAlign: "center", padding: "10px 12px", color: "#6B7280" }}>
                        {t.location}
                      </td>
                    ))}
                  </tr>
                  <tr style={{ borderBottom: "1px solid #F3F4F6" }}>
                    <td style={{ padding: "10px 12px", fontWeight: 600, color: "#374151" }}>Duração</td>
                    {compareTickets.map((t) => (
                      <td key={t.id} style={{ textAlign: "center", padding: "10px 12px", color: "#6B7280" }}>
                        {t.duration}
                      </td>
                    ))}
                  </tr>
                  <tr style={{ borderBottom: "1px solid #F3F4F6" }}>
                    <td style={{ padding: "10px 12px", fontWeight: 600, color: "#374151" }}>Vendidos Hoje</td>
                    {compareTickets.map((t) => (
                      <td key={t.id} style={{ textAlign: "center", padding: "10px 12px", fontWeight: 700, color: "#EF4444" }}>
                        {t.soldToday}
                      </td>
                    ))}
                  </tr>
                  <tr style={{ borderBottom: "1px solid #F3F4F6" }}>
                    <td style={{ padding: "10px 12px", fontWeight: 600, color: "#374151" }}>Restantes Hoje</td>
                    {compareTickets.map((t) => (
                      <td key={t.id} style={{
                        textAlign: "center", padding: "10px 12px", fontWeight: 700,
                        color: t.availableToday <= 10 ? "#EF4444" : "#6B7280",
                      }}>
                        {t.availableToday}
                      </td>
                    ))}
                  </tr>
                  <tr style={{ borderBottom: "1px solid #F3F4F6" }}>
                    <td style={{ padding: "10px 12px", fontWeight: 600, color: "#374151" }}>Match IA</td>
                    {compareTickets.map((t) => {
                      const ms = calculateMatchScore(profile, { category: t.category, price: t.price, tags: t.tags })
                      const msColor = ms >= 85 ? "#22C55E" : ms >= 70 ? "#2563EB" : "#F57C00"
                      return (
                        <td key={t.id} style={{ textAlign: "center", padding: "10px 12px", fontWeight: 700, color: msColor }}>
                          {ms}%
                        </td>
                      )
                    })}
                  </tr>
                  <tr>
                    <td style={{ padding: "10px 12px", fontWeight: 600, color: "#374151" }}>Atrações</td>
                    {compareTickets.map((t) => (
                      <td key={t.id} style={{ textAlign: "center", padding: "10px 12px", color: "#6B7280", fontSize: 12 }}>
                        {t.features.join(", ")}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              {compareTickets.map((t) => (
                <button
                  key={t.id}
                  data-testid={`button-compare-buy-${t.id}`}
                  onClick={() =>
                    window.open(
                      `https://wa.me/5564993197555?text=Olá! Quero comprar o ${t.name} com desconto especial!`,
                      "_blank"
                    )
                  }
                  style={{
                    flex: 1, padding: "12px 0", border: "none", borderRadius: 10,
                    background: "linear-gradient(135deg, #22C55E, #16A34A)", color: "#fff",
                    fontSize: 13, fontWeight: 700, cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  }}
                >
                  <ShoppingCart style={{ width: 14, height: 14 }} />
                  {formatPrice(t.price)}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="rsv-subpage-grid" style={{ padding: "20px 16px 100px" }}>
        {filteredTickets.map((ticket) => {
          const matchScore = calculateMatchScore(profile, {
            category: ticket.category,
            price: ticket.price,
            tags: ticket.tags,
          })
          const isBestValue = ticket.id === bestValueId
          const isHovered = hoveredId === ticket.id
          const isComparing = compareIds.includes(ticket.id)
          const isLowStock = ticket.availableToday <= 10
          const qty = getCartItemQty(cart, ticket.id)

          return (
            <div
              key={ticket.id}
              data-testid={`card-ticket-${ticket.id}`}
              onMouseEnter={() => setHoveredId(ticket.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                background: "#fff",
                borderRadius: 16,
                boxShadow: isHovered ? "0 8px 30px rgba(0,0,0,0.15)" : "0 2px 12px rgba(0,0,0,0.08)",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                border: isComparing ? "2px solid #3B82F6" : ticket.popular ? "2px solid #FACC15" : "none",
                transform: isHovered ? "scale(1.02)" : "scale(1)",
                transition: "all 0.3s ease",
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
                <div
                  style={{
                    position: "absolute",
                    top: (ticket.popular ? 28 : 0) + (isBestValue ? 28 : 0) + 10,
                    left: 10, background: "#EF4444", color: "#fff",
                    fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 8, zIndex: 2,
                  }}
                >
                  -{ticket.discount}% OFF
                </div>
                <div style={{
                  position: "absolute",
                  top: (ticket.popular ? 28 : 0) + (isBestValue ? 28 : 0) + 10,
                  right: 10, zIndex: 2,
                }}>
                  <AIRecommendedBadge matchPercent={matchScore} />
                </div>
                <img
                  src={ticket.image}
                  alt={ticket.name}
                  style={{ width: "100%", height: 200, objectFit: "cover", display: "block" }}
                />
              </div>

              <div style={{ padding: 16, display: "flex", flexDirection: "column", flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0 }} data-testid={`text-ticket-name-${ticket.id}`}>{ticket.name}</h3>
                  <button
                    onClick={() => toggleCompare(ticket.id)}
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
                </div>

                <p style={{ fontSize: 13, color: "#6B7280", margin: "0 0 10px", lineHeight: 1.5 }}>{ticket.description}</p>

                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                  <Flame style={{ width: 13, height: 13, color: "#EF4444" }} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#EF4444" }} data-testid={`text-sold-today-${ticket.id}`}>
                    <AnimatedCounter target={ticket.soldToday} suffix="ingressos vendidos hoje" />
                  </span>
                </div>

                {isLowStock && (
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

                {!isLowStock && (
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
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <Users style={{ width: 14, height: 14, color: "#A855F7" }} />
                    {ticket.ageGroup}
                  </span>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
                  {ticket.features.map((f) => (
                    <span
                      key={f}
                      style={{
                        background: "#F3F4F6", borderRadius: 6,
                        padding: "4px 10px", fontSize: 11, color: "#374151",
                      }}
                    >
                      {f}
                    </span>
                  ))}
                </div>

                <AlsoBoughtSection ticketId={ticket.id} allTickets={tickets} />

                <div style={{ marginTop: "auto", paddingTop: 10 }}>
                  <div style={{ marginBottom: 12 }}>
                    {ticket.originalPrice && (
                      <span style={{ fontSize: 14, color: "#9CA3AF", textDecoration: "line-through", marginRight: 8 }}>
                        {formatPrice(ticket.originalPrice)}
                      </span>
                    )}
                    <span style={{ fontSize: 26, fontWeight: 700, color: "#16A34A" }} data-testid={`text-price-${ticket.id}`}>{formatPrice(ticket.price)}</span>
                    <span style={{ fontSize: 12, color: "#9CA3AF", marginLeft: 4 }}>por pessoa</span>
                  </div>

                  <div style={{ minHeight: 44 }}>
                    {qty > 0 ? (
                      <div
                        data-testid={`stepper-${ticket.id}`}
                        style={{
                          width: "100%", display: "flex", alignItems: "center",
                          justifyContent: "space-between", borderRadius: 12,
                          border: "2px solid #22C55E", padding: "9px 12px",
                          background: "#F0FDF4",
                        }}
                      >
                        <button
                          data-testid={`button-decrease-${ticket.id}`}
                          onClick={() => {
                            updateTicketQty(ticket.id, qty - 1)
                            if (qty - 1 === 0) trackEvent("ticket_remove_from_cart", { ticketId: ticket.id })
                          }}
                          style={{
                            width: 34, height: 34, borderRadius: 8, border: "none",
                            background: qty === 1 ? "#FEE2E2" : "#DCFCE7",
                            color: qty === 1 ? "#EF4444" : "#16A34A",
                            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                          }}
                        >
                          {qty === 1 ? <Trash2 style={{ width: 15, height: 15 }} /> : <Minus style={{ width: 15, height: 15 }} />}
                        </button>
                        <span style={{ fontSize: 16, fontWeight: 800, color: "#16A34A" }} data-testid={`text-qty-${ticket.id}`}>
                          {qty}x — {formatPrice(ticket.price * qty)}
                        </span>
                        <button
                          data-testid={`button-increase-${ticket.id}`}
                          onClick={() => {
                            updateTicketQty(ticket.id, qty + 1)
                            trackEvent("ticket_add_to_cart", { ticketId: ticket.id, quantity: qty + 1 })
                          }}
                          style={{
                            width: 34, height: 34, borderRadius: 8, border: "none",
                            background: "#DCFCE7", color: "#16A34A",
                            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                          }}
                        >
                          <Plus style={{ width: 15, height: 15 }} />
                        </button>
                      </div>
                    ) : (
                      <button
                        data-testid={`button-buy-${ticket.id}`}
                        onClick={() => {
                          handleCartBuy(ticket)
                        }}
                        style={{
                          width: "100%", padding: "14px 0", border: "none", borderRadius: 12,
                          color: "#fff", fontSize: 16, fontWeight: 800, cursor: "pointer",
                          background: ticket.popular
                            ? "linear-gradient(135deg, #22C55E, #16A34A)"
                            : "linear-gradient(135deg, #0891B2, #06B6D4)",
                          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                          boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
                          transition: "all 0.2s",
                        }}
                      >
                        <ShoppingCart style={{ width: 18, height: 18 }} />
                        Comprar Agora
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}

        <div style={{ gridColumn: "1 / -1" }}>
          <CrossSellSection
            title="Quem comprou ingressos tambem reservou:"
            items={[
              { name: "Hotel diRoma Fiori", price: 320, link: "/hoteis", badge: "-20%", image: "/images/diroma-acqua-park.jpeg" },
              { name: "Lacqua DiRoma", price: 280, link: "/hoteis", badge: "TOP", image: "/images/hot-park.jpeg" },
              { name: "Pousada Recanto", price: 195, link: "/hoteis", badge: "Econômico" },
              { name: "Resort Náutico", price: 450, link: "/hoteis", badge: "Premium" },
            ]}
          />
        </div>
      </div>

      {cart.length === 0 && (
        <a
          href="https://wa.me/5564993197555?text=Olá! Gostaria de informações sobre ingressos para parques."
          target="_blank"
          rel="noopener noreferrer"
          data-testid="link-whatsapp-float"
          style={{
            position: "fixed", bottom: 80, right: 16,
            width: 56, height: 56, background: "#22C55E", borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 14px rgba(0,0,0,0.2)", zIndex: 50,
          }}
        >
          <Phone style={{ width: 26, height: 26, color: "#fff" }} />
        </a>
      )}

      <CartStickyBar
        cart={cart}
        total={cartTotal}
        onCheckout={() => {
          trackEvent("tickets_checkout_start", { total: cartTotal, items: cart.length })
          navigate("/ingressos/checkout")
        }}
      />

      <MiniWizard
        open={showWizard}
        tickets={tickets.map(t => ({
          id: t.id,
          name: t.name,
          price: t.price,
          originalPrice: t.originalPrice,
          discount: t.discount,
          duration: t.duration,
          popular: t.popular,
          category: t.category,
          tags: t.tags,
          image: t.image,
        }))}
        profile={profile}
        onClose={() => {
          setShowWizard(false)
          setActivePick(null)
        }}
        onConfirm={(items) => {
          addManyToCart(items)
          setShowWizard(false)
          setActivePick(null)
          trackEvent("wizard_confirm", { items: items.length })
        }}
      />
    </div>
  )
}
