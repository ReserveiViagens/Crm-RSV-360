import { useState, useEffect, useMemo } from "react"
import { ArrowLeft, Phone, ShoppingCart, Sparkles, BarChart3, X, Check, Timer, ChevronRight, Wand2 } from "lucide-react"
import { Link, useLocation } from "wouter";
import {
  SocialProofBanner,
  calculateMatchScore,
  getTravelerProfile,
  PersonalizedBanner,
  CrossSellSection,
} from "@/components/ai-conversion-elements"
import { useTicketsCart } from "@/hooks/useTicketsCart"
import { trackEvent } from "@/lib/analytics"
import { QuickDecisionSection } from "@/components/QuickDecisionSection"
import { MiniWizard } from "@/components/MiniWizard"
import { CartStickyBar } from "@/components/CartStickyBar"
import { TicketsGrid, type TicketItem } from "@/components/TicketsGrid"

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

function getBestValueId(list: TicketItem[]) {
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

  const { cart, total: cartTotal, addTicket, addManyToCart, updateTicketQty } = useTicketsCart()

  const bestValueId = useMemo(() => getBestValueId(tickets), [tickets])

  const comboTickets = useMemo(() => {
    const scored = tickets.map(t => ({
      ...t,
      matchScore: profile
        ? calculateMatchScore(profile, { category: t.category, price: t.price, tags: t.tags })
        : 0,
    }))
    return profile
      ? [...scored].sort((a, b) => b.matchScore - a.matchScore).slice(0, 3)
      : [...scored].sort((a, b) => b.discount - a.discount).slice(0, 2)
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
  const FAMILY_TAGS = ["família", "familia", "kids", "infantil"]

  const filteredTickets = useMemo(() => {
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

  function handleBuy(ticket: TicketItem) {
    addTicket({
      ticketId: ticket.id,
      name: ticket.name,
      unitPrice: ticket.price,
      originalPrice: ticket.originalPrice,
      discount: ticket.discount,
      image: ticket.image,
    })
    trackEvent("ticket_add_to_cart", { ticketId: ticket.id, quantity: 1 })
  }

  function handleInc(ticket: TicketItem, qty: number) {
    updateTicketQty(ticket.id, qty + 1)
    trackEvent("ticket_add_to_cart", { ticketId: ticket.id, quantity: qty + 1 })
  }

  function handleDec(ticket: TicketItem, qty: number) {
    updateTicketQty(ticket.id, qty - 1)
    if (qty - 1 === 0) trackEvent("ticket_remove_from_cart", { ticketId: ticket.id })
  }

  function handleWizardConfirm(items: Parameters<typeof addManyToCart>[0]) {
    addManyToCart(items)
    setShowWizard(false)
    setActivePick(null)
    trackEvent("wizard_confirm", { items: items.length })
  }

  const toggleCompare = (id: string) => {
    setCompareIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 3 ? [...prev, id] : prev
    )
  }

  const compareTickets = tickets.filter((t) => compareIds.includes(t.id))

  return (
    <div className="rsv-subpage">
      <div
        style={{
          background: "linear-gradient(135deg, #0891B2 0%, #2563EB 100%)",
          color: "#fff",
          padding: "24px 20px 0",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
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
        <h1 style={{ fontSize: 26, fontWeight: 800, margin: "0 0 8px" }} data-testid="text-page-title">Ingressos para Parques</h1>
        <p style={{ fontSize: 14, opacity: 0.9, margin: "0 0 8px" }}>Até 25% OFF + Entrada prioritária</p>

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(220,38,38,0.2)", borderRadius: 10, padding: "6px 14px",
          }}>
            <Timer style={{ width: 14, height: 14, color: "#FCA5A5" }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: "#FCA5A5" }} data-testid="text-countdown-timer">
              Preço especial por mais {String(timer.minutes).padStart(2, "0")}:{String(timer.seconds).padStart(2, "0")}
            </span>
          </div>
          <button
            data-testid="button-help-choose"
            onClick={() => setShowWizard(true)}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "rgba(255,255,255,0.15)", border: "1.5px solid rgba(255,255,255,0.4)",
              borderRadius: 10, padding: "6px 14px", color: "#fff",
              fontSize: 12, fontWeight: 700, cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            <Wand2 style={{ width: 14, height: 14 }} />
            Me ajude a escolher
          </button>
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
              {profile && t.matchScore > 0 && (
                <div style={{
                  marginTop: 4, fontSize: 10, fontWeight: 700,
                  background: "rgba(255,255,255,0.2)", borderRadius: 4,
                  padding: "2px 6px", display: "inline-block",
                }}>
                  {t.matchScore}% match
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

      <TicketsGrid
        tickets={filteredTickets}
        cart={cart}
        bestValueId={bestValueId}
        profile={profile}
        hoveredId={hoveredId}
        compareIds={compareIds}
        onHover={setHoveredId}
        onToggleCompare={toggleCompare}
        onBuy={handleBuy}
        onInc={handleInc}
        onDec={handleDec}
      />

      <div style={{ padding: "0 16px 100px" }}>
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
        onConfirm={handleWizardConfirm}
      />
    </div>
  )
}
