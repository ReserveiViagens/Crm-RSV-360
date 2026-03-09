import { useState, useEffect, useCallback, useMemo } from "react"
import { ArrowLeft, Phone, Clock, Copy, Check, Tag, Users, Sparkles, Flame, Gift, Filter, Hotel, Waves, Ticket, Percent, TrendingUp, Heart, ShoppingCart, Timer } from "lucide-react"
import { Link } from "wouter";
import {
  SocialProofBanner,
  AIRecommendedBadge,
  calculateMatchScore,
  getTravelerProfile,
  PersonalizedBanner,
  CrossSellSection,
  TravelerProfileModal,
  type TravelerProfile,
} from "@/components/ai-conversion-elements"

const TAG_COLORS: Record<string, { bg: string; color: string }> = {
  "Família": { bg: "#DBEAFE", color: "#1D4ED8" },
  "Casal": { bg: "#FCE7F3", color: "#BE185D" },
  "Melhor Idade": { bg: "#F3E8FF", color: "#7C3AED" },
  "Aventura": { bg: "#FEF3C7", color: "#92400E" },
  "Relaxamento": { bg: "#D1FAE5", color: "#065F46" },
  "Romântico": { bg: "#FDE8E8", color: "#B91C1C" },
}

const PROMO_TAGS: Record<string, string[]> = {
  "promoferias-20off": ["Família", "Aventura"],
  "ilhas-lago-package": ["Casal", "Relaxamento"],
  "melhor-idade": ["Melhor Idade", "Relaxamento"],
  "fim-semana-dourado": ["Casal", "Aventura"],
  "familia-completa": ["Família", "Aventura"],
  "lua-de-mel": ["Romântico", "Casal", "Relaxamento"],
  "ingresso-hot-park": ["Família", "Aventura"],
  "ingresso-nautico": ["Casal", "Aventura"],
}

const PEOPLE_COUNT: Record<string, number> = {
  "promoferias-20off": 347,
  "ilhas-lago-package": 512,
  "melhor-idade": 189,
  "fim-semana-dourado": 278,
  "familia-completa": 403,
  "lua-de-mel": 156,
  "ingresso-hot-park": 623,
  "ingresso-nautico": 284,
}

const COUPON_USAGE_TODAY: Record<string, number> = {
  "promoferias-20off": 42,
  "ilhas-lago-package": 67,
  "melhor-idade": 18,
  "fim-semana-dourado": 31,
  "familia-completa": 55,
  "lua-de-mel": 23,
  "ingresso-hot-park": 78,
  "ingresso-nautico": 34,
}

const PROMO_COUNTDOWNS: Record<string, { hours: number; minutes: number; seconds: number }> = {
  "promoferias-20off": { hours: 5, minutes: 32, seconds: 14 },
  "ilhas-lago-package": { hours: 12, minutes: 15, seconds: 45 },
  "melhor-idade": { hours: 23, minutes: 45, seconds: 30 },
  "fim-semana-dourado": { hours: 8, minutes: 10, seconds: 22 },
  "familia-completa": { hours: 18, minutes: 55, seconds: 8 },
  "lua-de-mel": { hours: 47, minutes: 20, seconds: 50 },
  "ingresso-hot-park": { hours: 14, minutes: 30, seconds: 0 },
  "ingresso-nautico": { hours: 3, minutes: 45, seconds: 12 },
}

const MATCH_REASONS: Record<string, Record<string, string[]>> = {
  relaxamento: {
    "ilhas-lago-package": ["Combina com seu perfil de Relaxamento", "Spa incluso ideal para você"],
    "melhor-idade": ["Piscinas termais para relaxar", "Ambiente tranquilo"],
    "lua-de-mel": ["Spa para casal perfeito", "Ambiente romântico e relaxante"],
  },
  familia: {
    "promoferias-20off": ["Ideal para toda a família", "Parque aquático incluso"],
    "familia-completa": ["Kids club para as crianças", "Quarto família disponível"],
    "fim-semana-dourado": ["Diversão garantida no fim de semana", "Atividades para todos"],
  },
  romantico: {
    "lua-de-mel": ["Suíte romântica perfeita para vocês", "Jantar à luz de velas"],
    "ilhas-lago-package": ["Resort sofisticado para casais", "Spa relaxante"],
    "fim-semana-dourado": ["Escapada romântica perfeita", "Late check-out"],
  },
  aventura: {
    "promoferias-20off": ["Parque aquático com adrenalina", "Diversão garantida"],
    "fim-semana-dourado": ["Atividades radicais no hotel", "Aventura no fim de semana"],
    "familia-completa": ["Atividades familiares radicais", "Parque aquático incluso"],
    "ingresso-hot-park": ["Hot Park com toboaguas radicais", "Adrenalina garantida"],
    "ingresso-nautico": ["Esportes aquaticos no Nautico", "Aventura na agua"],
  },
}

function IndividualCountdown({ initial }: { initial: { hours: number; minutes: number; seconds: number } }) {
  const [time, setTime] = useState(initial)

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 }
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
        return prev
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const isUrgent = time.hours < 6
  const totalSeconds = time.hours * 3600 + time.minutes * 60 + time.seconds

  if (totalSeconds <= 0) {
    return (
      <div style={{
        display: "flex", alignItems: "center", gap: 6,
        padding: "6px 10px", borderRadius: 8,
        background: "#FEE2E2", border: "1px solid #FECACA",
      }}>
        <Timer style={{ width: 13, height: 13, color: "#DC2626" }} />
        <span style={{ fontSize: 12, fontWeight: 700, color: "#DC2626" }}>Oferta expirada</span>
      </div>
    )
  }

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 6,
      padding: "6px 10px", borderRadius: 8,
      background: isUrgent ? "#FEF2F2" : "#FFF7ED",
      border: `1px solid ${isUrgent ? "#FECACA" : "#FDE68A"}`,
      animation: isUrgent ? "countdownPulse 2s infinite" : "none",
    }}>
      <Timer style={{ width: 13, height: 13, color: isUrgent ? "#DC2626" : "#D97706" }} />
      <span style={{
        fontSize: 12, fontWeight: 800, color: isUrgent ? "#DC2626" : "#92400E",
        fontVariantNumeric: "tabular-nums",
      }}>
        {String(time.hours).padStart(2, "0")}:{String(time.minutes).padStart(2, "0")}:{String(time.seconds).padStart(2, "0")}
      </span>
      {isUrgent && (
        <span style={{ fontSize: 10, fontWeight: 700, color: "#DC2626" }}>ACABA LOGO</span>
      )}
    </div>
  )
}

function CouponUsageToday({ count }: { count: number }) {
  const [displayed, setDisplayed] = useState(count)

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setDisplayed((prev) => prev + 1)
      }
    }, 8000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 6,
      fontSize: 11, color: "#6B7280",
    }}>
      <ShoppingCart style={{ width: 13, height: 13, color: "#9CA3AF" }} />
      <span><strong style={{ color: "#22C55E" }}>{displayed}</strong> pessoas usaram este cupom hoje</span>
    </div>
  )
}

type FilterType = "Todas" | "Hotel" | "Parque" | "Ingresso" | ">30%" | ">50%" | ">70%" | "IA Recomenda"

export default function PromocoesPage() {
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 45, seconds: 30 })
  const [activeFilter, setActiveFilter] = useState<FilterType>("Todas")
  const [profile, setProfile] = useState<TravelerProfile | null>(null)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  useEffect(() => {
    const p = getTravelerProfile()
    setProfile(p)
    if (!p) {
      const timer = setTimeout(() => setShowProfileModal(true), 3000)
      return () => clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 }
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
        return prev
      })
    }, 1000)
    return () => clearInterval(countdown)
  }, [])

  const copyCode = useCallback((id: string) => {
    navigator.clipboard.writeText("CALDAS15")
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }, [])

  const promotions = [
    {
      id: "promoferias-20off",
      title: "PROMOFÉRIAS Hotel + Parque Aquático",
      description: "Sinta a magia de Caldas Novas! Pacote completo com hotel 4 estrelas + acesso a parque aquático com estacionamento gratuito incluso.",
      price: 149,
      originalPrice: 186,
      image: "/images/promoferias-parque-aquatico.jpeg",
      discount: 35,
      badge: "PROMOFÉRIAS",
      validUntil: "31/01/2025",
      includes: ["Hotel 4 estrelas", "Parque aquático", "Estacionamento Gratuito", "Wi-Fi grátis"],
      highlight: true,
      category: "parques",
      type: "hotel" as const as "hotel" | "parque" | "ingresso",
    },
    {
      id: "ilhas-lago-package",
      title: "Ilhas do Lago Resort + Parque Aquático",
      description: "Hospedagem sofisticada no Ilhas do Lago com acesso a parque aquático e spa relaxante.",
      price: 320,
      originalPrice: 380,
      image: "/images/ilhas-do-lago-resort.jpg",
      discount: 40,
      badge: "Mais Vendido",
      validUntil: "15/02/2025",
      includes: ["Resort 5 estrelas", "Spa incluso", "Parque aquático", "Área de relaxamento"],
      category: "relaxamento",
      type: "hotel" as const,
    },
    {
      id: "melhor-idade",
      title: "Pacote Melhor Idade Caldas Novas",
      description: "Condições especiais para grupos da melhor idade com atividades adaptadas e acompanhamento especializado.",
      price: 210,
      originalPrice: 260,
      image: "/images/melhor-idade-caldas-novas.jpeg",
      discount: 55,
      badge: "Melhor Idade",
      validUntil: "28/02/2025",
      includes: ["Momentos de lazer e convivência", "Atividades recreativas adaptadas", "Tratamento em Piscinas termais", "Hospedagem em hotel com estrutura adaptada"],
      category: "relaxamento",
      type: "hotel" as const,
    },
    {
      id: "fim-semana-dourado",
      title: "Pacote Fim de Semana Dourado",
      description: "Hotel + Parque com condições imperdíveis para sua escapada de fim de semana perfeita!",
      price: 299,
      originalPrice: 370,
      image: "/images/fim-de-semana-dourado.jpeg",
      discount: 45,
      badge: "Fim de Semana",
      validUntil: "Ver disponibilidade grátis",
      includes: ["Diárias a partir", "Parque aquático", "Atividades grátis oferecidas pelo hotel", "Late check-out"],
      category: "parques",
      type: "parque" as const,
    },
    {
      id: "familia-completa",
      title: "Pacote Família Completa",
      description: "Diversão garantida para toda família com crianças até 12 anos grátis e atividades especiais.",
      price: 450,
      originalPrice: 580,
      image: "/images/pacote-familia-completa.jpeg",
      discount: 60,
      badge: "Família",
      validUntil: "31/03/2025",
      includes: ["Entrada no parque aquático", "Kids club", "Atividades familiares", "Quarto família"],
      category: "parques",
      type: "parque" as const,
    },
    {
      id: "lua-de-mel",
      title: "Pacote Lua de Mel",
      description: "Celebre o amor em Caldas Novas! Suíte romântica com decoração especial, jantar à luz de velas e spa para casal.",
      price: 890,
      originalPrice: 1200,
      image: "/images/ilhas-do-lago-resort.jpg",
      discount: 75,
      badge: "Romântico",
      validUntil: "30/06/2025",
      includes: ["Suíte decorada", "Jantar romântico", "Spa para casal", "Late check-out", "Espumante de boas-vindas"],
      category: "relaxamento",
      type: "hotel" as const,
    },
    {
      id: "ingresso-hot-park",
      title: "Ingresso Hot Park + Lagoa Quente",
      description: "Combo de ingressos para os dois maiores parques de Caldas Novas com desconto especial e acesso o dia inteiro.",
      price: 129,
      originalPrice: 198,
      image: "/images/promoferias-parque-aquatico.jpeg",
      discount: 35,
      badge: "Combo Ingressos",
      validUntil: "28/02/2025",
      includes: ["Ingresso Hot Park", "Ingresso Lagoa Quente", "Acesso dia inteiro", "Estacionamento incluso"],
      category: "parques",
      type: "ingresso" as const,
    },
    {
      id: "ingresso-nautico",
      title: "Ingresso Nautico Praia Club VIP",
      description: "Acesso VIP ao Nautico Praia Club com area exclusiva, drinks e almoco incluso no valor.",
      price: 89,
      originalPrice: 150,
      image: "/images/fim-de-semana-dourado.jpeg",
      discount: 41,
      badge: "VIP",
      validUntil: "15/03/2025",
      includes: ["Acesso VIP", "Area exclusiva", "Drink de boas-vindas", "Almoco incluso"],
      category: "parques",
      type: "ingresso" as const,
    },
  ]

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price)

  const getMatchScore = (promo: typeof promotions[0]) =>
    calculateMatchScore(profile, { category: promo.category, price: promo.price, tags: PROMO_TAGS[promo.id] || [] })

  const scoredPromotions = useMemo(() =>
    promotions.map((p) => ({ ...p, matchScore: getMatchScore(p) })),
    [profile]
  )

  const topRecommended = useMemo(() =>
    [...scoredPromotions].sort((a, b) => b.matchScore - a.matchScore).slice(0, 3),
    [scoredPromotions]
  )

  const getMatchReasons = (promoId: string): string[] => {
    if (!profile) return []
    const reasons = MATCH_REASONS[profile.tripType]?.[promoId] || []
    const generic: string[] = []
    if (profile.budget === "economico" && promotions.find(p => p.id === promoId)?.price && promotions.find(p => p.id === promoId)!.price < 300) {
      generic.push("Dentro do seu orçamento")
    }
    if (profile.budget === "premium" && promotions.find(p => p.id === promoId)?.price && promotions.find(p => p.id === promoId)!.price > 500) {
      generic.push("Experiência premium")
    }
    if (profile.companions === "familia_criancas" && PROMO_TAGS[promoId]?.includes("Família")) {
      generic.push("Perfeito para crianças")
    }
    if (profile.companions === "casal" && (PROMO_TAGS[promoId]?.includes("Casal") || PROMO_TAGS[promoId]?.includes("Romântico"))) {
      generic.push("Ideal para casais")
    }
    return [...reasons, ...generic].slice(0, 3)
  }

  const filteredPromotions = useMemo(() => {
    switch (activeFilter) {
      case "Hotel": return scoredPromotions.filter((p) => p.type === "hotel")
      case "Parque": return scoredPromotions.filter((p) => p.type === "parque")
      case "Ingresso": return scoredPromotions.filter((p) => p.type === "ingresso")
      case ">30%": return scoredPromotions.filter((p) => p.discount > 30)
      case ">50%": return scoredPromotions.filter((p) => p.discount > 50)
      case ">70%": return scoredPromotions.filter((p) => p.discount > 70)
      case "IA Recomenda": return [...scoredPromotions].sort((a, b) => b.matchScore - a.matchScore)
      default: return scoredPromotions
    }
  }, [activeFilter, scoredPromotions])

  const highSalesIds = ["ilhas-lago-package", "familia-completa"]

  const filters: { label: string; value: FilterType; icon: typeof Hotel }[] = [
    { label: "Todas", value: "Todas", icon: Filter },
    { label: "Hotel", value: "Hotel", icon: Hotel },
    { label: "Parque", value: "Parque", icon: Waves },
    { label: "Ingresso", value: "Ingresso", icon: Ticket },
    { label: ">30%", value: ">30%", icon: Percent },
    { label: ">50%", value: ">50%", icon: Percent },
    { label: ">70%", value: ">70%", icon: Percent },
    { label: "IA", value: "IA Recomenda", icon: Sparkles },
  ]

  const renderPromoCard = (promo: typeof scoredPromotions[0], isRecommended?: boolean) => {
    const tags = PROMO_TAGS[promo.id] || []
    const couponUsage = COUPON_USAGE_TODAY[promo.id] || 15
    const isAlmostGone = highSalesIds.includes(promo.id)
    const savings = promo.originalPrice - promo.price
    const isHovered = hoveredId === promo.id
    const matchReasons = getMatchReasons(promo.id)
    const promoCountdown = PROMO_COUNTDOWNS[promo.id] || { hours: 23, minutes: 59, seconds: 59 }

    return (
      <div
        key={promo.id}
        data-testid={`card-promo-${promo.id}`}
        onMouseEnter={() => setHoveredId(promo.id)}
        onMouseLeave={() => setHoveredId(null)}
        style={{
          background: isRecommended ? "linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)" : "#fff",
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: isHovered ? "0 8px 32px rgba(0,0,0,0.16)" : "0 2px 12px rgba(0,0,0,0.08)",
          border: isRecommended ? "2px solid #F59E0B" : promo.highlight ? "3px solid #FBBF24" : "1px solid #f0f0f0",
          transform: isHovered ? "translateY(-4px)" : "translateY(0)",
          transition: "all 0.3s ease",
        }}
      >
        <div style={{ position: "relative" }}>
          <img
            src={promo.image}
            alt={promo.title}
            style={{ width: "100%", height: 200, objectFit: "cover", display: "block" }}
          />
          <span style={{
            position: "absolute", top: 10, left: 10,
            background: "#DC2626", color: "#fff",
            fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 8,
          }}>
            -{promo.discount}% OFF
          </span>
          <span style={{
            position: "absolute", top: 10, right: 10,
            background: promo.badge === "Romântico" ? "#BE185D" : "#F57C00",
            color: "#fff", fontSize: 11, fontWeight: 700,
            padding: "4px 10px", borderRadius: 8,
          }}>
            {promo.badge}
          </span>
          {isAlmostGone && (
            <span style={{
              position: "absolute", bottom: 10, left: 10,
              background: "#DC2626", color: "#fff",
              fontSize: 11, fontWeight: 800, padding: "4px 12px", borderRadius: 8,
              animation: "blink 1s infinite",
              display: "flex", alignItems: "center", gap: 4,
            }}>
              <Flame style={{ width: 12, height: 12 }} /> QUASE ESGOTADO
            </span>
          )}
          {isRecommended && (
            <div style={{
              position: "absolute", bottom: 10, right: 10,
              background: "linear-gradient(135deg, #F59E0B, #D97706)",
              color: "#fff", fontSize: 10, fontWeight: 800,
              padding: "4px 10px", borderRadius: 8,
              display: "flex", alignItems: "center", gap: 4,
            }}>
              <Sparkles style={{ width: 12, height: 12 }} /> RECOMENDADO P/ VOCE
            </div>
          )}
        </div>

        <div style={{ padding: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
            <AIRecommendedBadge matchPercent={promo.matchScore} />
            {tags.map((tag) => {
              const c = TAG_COLORS[tag] || { bg: "#F3F4F6", color: "#374151" }
              return (
                <span key={tag} style={{
                  fontSize: 10, fontWeight: 700, padding: "3px 8px",
                  borderRadius: 6, background: c.bg, color: c.color,
                  display: "inline-flex", alignItems: "center", gap: 3,
                }}>
                  <Tag style={{ width: 10, height: 10 }} /> {tag}
                </span>
              )
            })}
          </div>

          {isRecommended && matchReasons.length > 0 && (
            <div style={{
              background: "linear-gradient(135deg, #FFFBEB, #FEF3C7)",
              borderRadius: 10, padding: "8px 12px", marginBottom: 10,
              border: "1px solid #FDE68A",
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#D97706", marginBottom: 4, display: "flex", alignItems: "center", gap: 4 }}>
                <Heart style={{ width: 12, height: 12 }} /> Por que combina com você:
              </div>
              {matchReasons.map((reason, i) => (
                <div key={i} style={{ fontSize: 11, color: "#92400E", display: "flex", alignItems: "center", gap: 4, marginBottom: 2 }}>
                  <Check style={{ width: 10, height: 10, color: "#22C55E" }} /> {reason}
                </div>
              ))}
            </div>
          )}

          <h3 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 6px", color: "#1a1a1a" }}>{promo.title}</h3>
          <p style={{ fontSize: 13, color: "#666", margin: "0 0 10px", lineHeight: 1.5 }}>{promo.description}</p>

          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 6,
              fontSize: 11, color: "#6B7280",
            }}>
              <Users style={{ width: 13, height: 13, color: "#9CA3AF" }} />
              <span>{PEOPLE_COUNT[promo.id] || 200} pessoas aproveitaram</span>
            </div>
            <CouponUsageToday count={couponUsage} />
          </div>

          <IndividualCountdown initial={promoCountdown} />

          <div style={{ marginBottom: 12, marginTop: 10 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#16A34A", marginBottom: 6, display: "flex", alignItems: "center", gap: 4 }}>
              <Check style={{ width: 14, height: 14 }} /> O que esta incluso:
            </div>
            {promo.includes.map((item) => (
              <div key={item} style={{ fontSize: 12, color: "#555", display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                <span style={{ color: "#22C55E", fontSize: 10 }}><Check style={{ width: 10, height: 10 }} /></span> {item}
              </div>
            ))}
          </div>

          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            fontSize: 12, color: "#888", marginBottom: 12,
          }}>
            <Clock style={{ width: 14, height: 14 }} />
            <span>Válido até: {promo.validUntil}</span>
          </div>

          <div
            data-testid={`coupon-section-${promo.id}`}
            style={{
              background: copiedId === promo.id ? "#F0FDF4" : "#FFFBEB",
              border: copiedId === promo.id ? "1px solid #86EFAC" : "1px dashed #F59E0B",
              borderRadius: 10,
              padding: "10px 12px", marginBottom: 12,
              display: "flex", alignItems: "center", justifyContent: "space-between",
              transition: "all 0.3s ease",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Gift style={{ width: 14, height: 14, color: copiedId === promo.id ? "#22C55E" : "#D97706" }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: copiedId === promo.id ? "#166534" : "#92400E" }}>
                Código: <span style={{ fontWeight: 800, letterSpacing: 1 }}>CALDAS15</span>
              </span>
            </div>
            <button
              data-testid={`button-copy-coupon-${promo.id}`}
              onClick={() => copyCode(promo.id)}
              style={{
                display: "flex", alignItems: "center", gap: 4,
                background: copiedId === promo.id ? "#22C55E" : "#F59E0B",
                color: "#fff", border: "none", borderRadius: 6,
                padding: "6px 14px", fontSize: 12, fontWeight: 700,
                cursor: "pointer", transition: "all 0.3s ease",
                transform: copiedId === promo.id ? "scale(1.05)" : "scale(1)",
              }}
            >
              {copiedId === promo.id ? (
                <><Check style={{ width: 14, height: 14 }} /> Copiado!</>
              ) : (
                <><Copy style={{ width: 14, height: 14 }} /> Copiar Código</>
              )}
            </button>
          </div>

          <div style={{ borderTop: "1px solid #eee", paddingTop: 12 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <div>
                <span style={{ fontSize: 14, color: "#aaa", textDecoration: "line-through", marginRight: 6 }}>
                  {formatPrice(promo.originalPrice)}
                </span>
                <div style={{ fontSize: 24, fontWeight: 800, color: "#22C55E" }}>{formatPrice(promo.price)}</div>
                <span style={{ fontSize: 11, color: "#999" }}>
                  {promo.id === "promoferias-20off" ? "por pessoa" : "diárias a partir de"}
                </span>
              </div>
              <div style={{
                background: "linear-gradient(135deg, #FEF2F2, #FEE2E2)",
                borderRadius: 10, padding: "8px 12px", textAlign: "center",
                border: "1px solid #FECACA",
              }}>
                <div style={{ fontSize: 10, color: "#999" }}>Voce economiza</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#DC2626" }}>
                  {formatPrice(savings)}
                </div>
              </div>
            </div>

            <a
              data-testid={`button-reserve-${promo.id}`}
              href={`https://wa.me/5564993197555?text=Olá! Quero aproveitar a promoção ${promo.title} com ${promo.discount}% de desconto! Código: CALDAS15`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                width: "100%", padding: "12px 0",
                background: "linear-gradient(135deg, #22C55E 0%, #16A34A 100%)",
                color: "#fff", fontSize: 15, fontWeight: 700, border: "none",
                borderRadius: 12, textAlign: "center", textDecoration: "none",
                cursor: "pointer", boxSizing: "border-box",
              }}
            >
              <Phone style={{ width: 16, height: 16 }} /> Aproveitar {promo.discount}% OFF
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="rsv-subpage">
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes countdownPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div style={{
        background: "linear-gradient(135deg, #F57C00 0%, #DC2626 100%)",
        color: "#fff", padding: "24px 20px 0",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Link href="/" data-testid="link-back-home" style={{ color: "#fff", display: "flex", alignItems: "center" }}>
              <ArrowLeft style={{ width: 22, height: 22 }} />
            </Link>
            <div style={{
              width: 40, height: 40, borderRadius: "50%",
              border: "2px solid #fff", display: "flex", alignItems: "center", justifyContent: "center",
              background: "rgba(255,255,255,0.1)", fontSize: 9, fontWeight: 900, letterSpacing: -0.5,
            }}>
              <span>RSV<span style={{ color: "#FDE68A" }}>360</span></span>
            </div>
            <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: -0.5 }}>Reservei Viagens</span>
          </div>
        </div>
        <h1 data-testid="text-page-title" style={{ fontSize: 26, fontWeight: 800, margin: "0 0 8px" }}>Promocoes Especiais</h1>

        <div style={{
          background: "rgba(0,0,0,0.2)", borderRadius: 16,
          padding: "16px 18px", textAlign: "center", marginBottom: 16,
          border: "1px solid rgba(255,255,255,0.15)",
        }}>
          <div style={{
            fontSize: 14, fontWeight: 700, marginBottom: 10,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          }}>
            <Flame style={{ width: 16, height: 16, color: "#FDE68A" }} /> Oferta Relampago — Acaba em:
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
            {[
              { val: timeLeft.hours, label: "Horas" },
              { val: timeLeft.minutes, label: "Min" },
              { val: timeLeft.seconds, label: "Seg" },
            ].map((t) => (
              <div key={t.label} style={{
                background: "rgba(255,255,255,0.15)", borderRadius: 12,
                padding: "10px 16px", minWidth: 60, textAlign: "center",
                backdropFilter: "blur(4px)",
                border: "1px solid rgba(255,255,255,0.2)",
                animation: t.label === "Seg" ? "countdownPulse 1s infinite" : "none",
              }}>
                <div style={{ fontSize: 26, fontWeight: 900, fontVariantNumeric: "tabular-nums" }}>
                  {t.val.toString().padStart(2, "0")}
                </div>
                <div style={{ fontSize: 10, opacity: 0.8, fontWeight: 600 }}>{t.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{
          display: "flex", gap: 6, overflowX: "auto", paddingBottom: 12,
          borderBottom: "2px solid rgba(255,255,255,0.15)",
        }}>
          {filters.map((f) => {
            const Icon = f.icon
            const isActive = activeFilter === f.value
            return (
              <button
                key={f.value}
                data-testid={`button-filter-${f.value}`}
                onClick={() => setActiveFilter(f.value)}
                style={{
                  display: "flex", alignItems: "center", gap: 4,
                  padding: "8px 14px", border: "none",
                  background: isActive ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.08)",
                  color: isActive ? "#fff" : "rgba(255,255,255,0.7)",
                  fontSize: 12, fontWeight: isActive ? 700 : 500,
                  cursor: "pointer", borderRadius: 8,
                  transition: "all 0.2s", whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                <Icon style={{ width: 13, height: 13 }} />
                {f.label}
              </button>
            )
          })}
        </div>
      </div>

      <SocialProofBanner pageName="promocoes" />
      <PersonalizedBanner profile={profile} />

      {profile && topRecommended.length > 0 && (
        <div data-testid="section-profile-recommendations" style={{ padding: "20px 16px 0" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 8, marginBottom: 6,
          }}>
            <Sparkles style={{ width: 20, height: 20, color: "#D97706" }} />
            <h2 style={{
              fontSize: 17, fontWeight: 800, margin: 0,
              background: "linear-gradient(90deg, #D97706, #B45309)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              PARA SEU PERFIL — RECOMENDADOS PELA IA
            </h2>
          </div>
          <p style={{ fontSize: 12, color: "#6B7280", margin: "0 0 14px" }}>
            Selecionamos estas promocoes especialmente para o seu perfil de viajante
          </p>
          <div style={{ display: "grid", gap: 16 }}>
            {topRecommended.map((promo) => renderPromoCard(promo, true))}
          </div>
        </div>
      )}

      {!profile && (
        <div style={{
          margin: "16px 16px 0", padding: "20px", borderRadius: 16,
          background: "linear-gradient(135deg, #EFF6FF, #F0FDF4)",
          border: "1px solid #BFDBFE", textAlign: "center",
        }}>
          <Sparkles style={{ width: 28, height: 28, color: "#2563EB", margin: "0 auto 10px" }} />
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1F2937", margin: "0 0 6px" }}>
            Descubra promocoes perfeitas para voce
          </h3>
          <p style={{ fontSize: 13, color: "#6B7280", margin: "0 0 14px" }}>
            Responda 4 perguntas rapidas e a IA vai selecionar as melhores ofertas para seu perfil
          </p>
          <button
            data-testid="button-open-profile-modal"
            onClick={() => setShowProfileModal(true)}
            style={{
              padding: "10px 24px", borderRadius: 10, border: "none",
              background: "linear-gradient(135deg, #2563EB, #1D4ED8)",
              color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer",
            }}
          >
            Personalizar Minhas Ofertas
          </button>
        </div>
      )}

      <div className="rsv-subpage-grid" style={{ padding: "20px 16px 24px" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 8, marginBottom: 4,
          gridColumn: "1 / -1", flexWrap: "wrap",
        }}>
          <h2 data-testid="text-filter-title" style={{ fontSize: 17, fontWeight: 800, margin: 0, color: "#1F2937" }}>
            {activeFilter === "Todas" ? "Todas as Promocoes" : activeFilter === "IA Recomenda" ? "Ordenado por IA" : activeFilter}
          </h2>
          <span style={{
            fontSize: 12, fontWeight: 600, color: "#6B7280",
            background: "#F3F4F6", padding: "2px 8px", borderRadius: 6,
          }}>
            {filteredPromotions.length} {filteredPromotions.length === 1 ? "oferta" : "ofertas"}
          </span>
          {activeFilter === "IA Recomenda" && (
            <span style={{
              fontSize: 11, fontWeight: 600, color: "#D97706",
              background: "#FFFBEB", padding: "2px 8px", borderRadius: 6,
              display: "inline-flex", alignItems: "center", gap: 3,
            }}>
              <TrendingUp style={{ width: 11, height: 11 }} /> Melhor match primeiro
            </span>
          )}
        </div>
        {filteredPromotions.map((promo) => renderPromoCard(promo))}
      </div>

      <CrossSellSection
        title="Complete sua viagem"
        items={[
          { name: "Ingresso Hot Park", price: 89, link: "/ingressos", badge: "Popular" },
          { name: "Day Use Lagoa Quente", price: 120, link: "/ingressos", badge: "-15%" },
          { name: "Passeio Serra de Caldas", price: 65, link: "/atracoes" },
          { name: "Transfer Aeroporto", price: 45, link: "/contato", badge: "Novo" },
        ]}
      />

      {profile && (
        <CrossSellSection
          title="Complementos para seu perfil"
          items={
            profile.tripType === "familia"
              ? [
                  { name: "Kids Park Aquatico", price: 55, link: "/ingressos", badge: "Familia" },
                  { name: "Buffet Infantil", price: 39, link: "/atracoes" },
                  { name: "Foto Profissional", price: 79, link: "/contato", badge: "Novo" },
                  { name: "Passeio Ecologico", price: 45, link: "/atracoes" },
                ]
              : profile.tripType === "romantico"
              ? [
                  { name: "Jantar Romantico", price: 189, link: "/atracoes", badge: "Top" },
                  { name: "Spa para Casal", price: 250, link: "/ingressos" },
                  { name: "Passeio de Barco", price: 120, link: "/atracoes", badge: "Novo" },
                  { name: "Suite Decorada Upgrade", price: 150, link: "/contato" },
                ]
              : [
                  { name: "City Tour Caldas", price: 65, link: "/atracoes" },
                  { name: "Ingresso Parque Aquatico", price: 89, link: "/ingressos", badge: "Popular" },
                  { name: "Gastronomia Local", price: 95, link: "/atracoes", badge: "Novo" },
                  { name: "Transfer + Guia", price: 75, link: "/contato" },
                ]
          }
        />
      )}

      <div style={{ padding: "0 16px 24px" }}>
        <div style={{
          background: "linear-gradient(135deg, #7C3AED 0%, #DB2777 100%)",
          borderRadius: 16, padding: 24, textAlign: "center", color: "#fff",
        }}>
          <h3 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 10px", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <Gift style={{ width: 22, height: 22 }} /> Promocao Exclusiva WhatsApp!
          </h3>
          <p style={{ fontSize: 14, margin: "0 0 16px", opacity: 0.9 }}>
            Fale conosco agora e ganhe 5% de desconto adicional em qualquer pacote!
          </p>
          <a
            data-testid="link-whatsapp-extra-discount"
            href="https://wa.me/5564993197555?text=Olá! Quero o desconto adicional de 5% nas promoções!"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "#fff", color: "#7C3AED",
              fontWeight: 700, fontSize: 15, padding: "12px 28px",
              borderRadius: 12, textDecoration: "none",
            }}
          >
            <Phone style={{ width: 16, height: 16 }} /> Ganhar Desconto Extra
          </a>
        </div>
      </div>

      <div style={{ textAlign: "center", padding: "0 16px 80px" }}>
        <Link href="/" data-testid="link-back-bottom" style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          color: "#666", fontSize: 14, textDecoration: "none",
        }}>
          <ArrowLeft style={{ width: 16, height: 16 }} /> Voltar ao Inicio
        </Link>
      </div>

      <a
        data-testid="button-whatsapp-float"
        href="https://wa.me/5564993197555?text=Olá! Gostaria de informações sobre as promoções especiais."
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: "fixed", bottom: 80, right: 16,
          width: 56, height: 56, background: "#22C55E",
          borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 16px rgba(34,197,94,0.4)", zIndex: 50,
        }}
      >
        <Phone style={{ width: 24, height: 24, color: "#fff" }} />
      </a>

      {showProfileModal && (
        <TravelerProfileModal
          onClose={() => setShowProfileModal(false)}
          onSave={(p) => {
            setProfile(p)
            setShowProfileModal(false)
          }}
        />
      )}
    </div>
  )
}
