import { useState, useEffect, useMemo } from "react"
import { ArrowLeft, Phone, MapPin, Clock, Star, Heart, Users, Sparkles, Eye, X, BarChart3, Navigation, DollarSign, Waves, Mountain, Baby, HeartHandshake, Landmark, TreePine } from "lucide-react"
import { Link } from "wouter";
import HotelDetailPanel, { HotelDetailData } from "@/components/hotel-detail-panel"
import {
  SocialProofBanner,
  AIRecommendedBadge,
  calculateMatchScore,
  getTravelerProfile,
  PersonalizedBanner,
  CrossSellSection,
  TravelerProfileModal,
  TravelerProfile,
} from "@/components/ai-conversion-elements"

interface Attraction {
  id: string
  name: string
  description: string
  image: string
  location: string
  duration: string
  category: string
  highlights: string[]
  rating: number
  price?: number | null
  free?: boolean
  distance?: string
}

const categoryColors: Record<string, string> = {
  Natureza: "#16A34A",
  Aventura: "#2563EB",
  "Histórico": "#D97706",
  Cultural: "#7C3AED",
  Ecoturismo: "#059669",
}

const moodIcons: Record<string, typeof Sparkles> = {
  Relaxamento: Waves,
  Aventura: Mountain,
  "Família": Baby,
  "Romântico": HeartHandshake,
  Cultura: Landmark,
  Natureza: TreePine,
}

const moodFilters = [
  { label: "Todos", value: "Todos" },
  { label: "Relaxamento", value: "Relaxamento" },
  { label: "Aventura", value: "Aventura" },
  { label: "Família", value: "Família" },
  { label: "Romântico", value: "Romântico" },
  { label: "Cultura", value: "Cultura" },
  { label: "Natureza", value: "Natureza" },
]

const categoryToMood: Record<string, string[]> = {
  Natureza: ["Relaxamento", "Natureza", "Família", "Romântico"],
  Aventura: ["Aventura"],
  "Histórico": ["Cultura", "Romântico"],
  Cultural: ["Cultura", "Família", "Romântico"],
  Ecoturismo: ["Aventura", "Natureza"],
}

const attractions: Attraction[] = [
  {
    id: "jardim-japones",
    name: "Jardim Japonês",
    description:
      "Um refúgio de paz e beleza oriental, ideal para contemplação, meditação e fotografias únicas em meio à natureza exuberante.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/images.jfif-qEh8dMMyYkqDeGxaBMbhqplQXVSpEU.jpeg",
    location: "Centro de Caldas Novas",
    duration: "1-2 horas",
    category: "Natureza",
    highlights: ["Arquitetura japonesa", "Lagos ornamentais", "Pontes tradicionais", "Área de meditação"],
    rating: 4.8,
    price: 10,
    distance: "2,5 km",
  },
  {
    id: "lago-corumba",
    name: "Lago Corumbá",
    description:
      "Passeios de barco, jet ski e uma bela vista para relaxar e se divertir. Perfeito para esportes aquáticos e contemplação.",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/97cea591709031183bf3c175de4d26c4.jpg-hDxD6ZNoJL0WRJF9sZC84493RoYy4A.jpeg",
    location: "Caldas Novas - GO",
    duration: "Meio dia",
    category: "Aventura",
    highlights: ["Passeios de barco", "Jet ski", "Pesca esportiva", "Vista panorâmica"],
    rating: 4.6,
    price: null,
    distance: "12 km",
  },
  {
    id: "monumento-aguas",
    name: "Monumento das Águas",
    description: "Visite o cartão postal de Caldas Novas, símbolo das águas termais e marco histórico da cidade.",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/monumento-as-aguas.jpg-23Ox7hDb2v9O7MvysJbMC402VHtIJ2.jpeg",
    location: "Centro Histórico",
    duration: "30 minutos",
    category: "Histórico",
    highlights: ["Marco histórico", "Fonte termal", "Área para fotos", "Centro da cidade"],
    rating: 4.4,
    free: true,
    distance: "1,2 km",
  },
  {
    id: "feira-hippie",
    name: "Feira do Luar",
    description:
      "Feira noturna com artesanato local, gastronomia típica e apresentações culturais. Experiência autêntica de Caldas Novas.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/unnamed.jpg-kMID5PSp6hxQkx36Qp540D7NUs1N9Y.jpeg",
    location: "Praça Central",
    duration: "2-3 horas",
    category: "Cultural",
    highlights: ["Artesanato local", "Gastronomia típica", "Música ao vivo", "Produtos regionais"],
    rating: 4.7,
    free: true,
    distance: "0,8 km",
  },
  {
    id: "parque-estadual",
    name: "Parque Estadual da Serra de Caldas",
    description:
      "Trilhas ecológicas, cachoeiras naturais e vista panorâmica da região. Ideal para ecoturismo e aventura.",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Entrada-do-PESCAN-Parque-da-Serra-de-Caldas.jpg-1dCOLwSaVTKLgUQ35R0f6eVwQ20xhX.jpeg",
    location: "Serra de Caldas Novas",
    duration: "Dia inteiro",
    category: "Ecoturismo",
    highlights: ["Trilhas ecológicas", "Cachoeiras", "Vista panorâmica", "Flora e fauna"],
    rating: 4.9,
    price: null,
    distance: "18 km",
  },
  {
    id: "centro-historico",
    name: "Centro Histórico",
    description: "Passeio pela história de Caldas Novas, com arquitetura colonial preservada e museus locais.",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/O-que-fazer-em-Caldas-Novas-alem-dos-parques-.jpg-hggVCc4sV9K9nxiHfEglNOYL1NO3Mr.jpeg",
    location: "Centro de Caldas Novas",
    duration: "2-3 horas",
    category: "Histórico",
    highlights: ["Arquitetura colonial", "Museu local", "Igreja histórica", "Casarões antigos"],
    rating: 4.3,
    free: true,
    distance: "1,0 km",
  },
]

export default function AtracoesPage() {
  const [activeMood, setActiveMood] = useState("Todos")
  const [selectedAttraction, setSelectedAttraction] = useState<HotelDetailData | null>(null)
  const [profile, setProfile] = useState<TravelerProfile | null>(null)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [compareList, setCompareList] = useState<string[]>([])
  const [showCompare, setShowCompare] = useState(false)
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const [visitorsMap, setVisitorsMap] = useState<Record<string, number>>({})
  const [weeklyVisitorsMap, setWeeklyVisitorsMap] = useState<Record<string, number>>({})
  const [experienceOfDay, setExperienceOfDay] = useState<string>("")

  useEffect(() => {
    const saved = getTravelerProfile()
    setProfile(saved)
    if (!saved) {
      const timer = setTimeout(() => setShowProfileModal(true), 3000)
      return () => clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    const map: Record<string, number> = {}
    const weeklyMap: Record<string, number> = {}
    attractions.forEach((a) => {
      map[a.id] = Math.floor(Math.random() * 30) + 5
      weeklyMap[a.id] = Math.floor(Math.random() * 300) + 80
    })
    setVisitorsMap(map)
    setWeeklyVisitorsMap(weeklyMap)
    setExperienceOfDay(attractions[Math.floor(Math.random() * attractions.length)].id)
  }, [])

  const filteredAttractions = useMemo(() => {
    if (activeMood === "Todos") return attractions
    return attractions.filter((a) => {
      const moods = categoryToMood[a.category] || []
      return moods.includes(activeMood)
    })
  }, [activeMood])

  const matchScores = useMemo(() => {
    const scores: Record<string, number> = {}
    attractions.forEach((a) => {
      scores[a.id] = calculateMatchScore(profile, {
        category: a.category.toLowerCase(),
        price: a.price || undefined,
        tags: a.highlights,
      })
    })
    return scores
  }, [profile])

  const aiRecommended = useMemo(() => {
    const sorted = [...attractions].sort((a, b) => (matchScores[b.id] || 0) - (matchScores[a.id] || 0))
    return sorted.slice(0, 3)
  }, [matchScores])

  const profileReasonMap: Record<string, string> = useMemo(() => {
    if (!profile) return {}
    const reasons: Record<string, string> = {}
    const tripLabels: Record<string, string> = {
      relaxamento: "relaxamento", aventura: "aventura", familia: "família",
      romantico: "viagem romântica", amigos: "viagem com amigos", negocios: "negócios",
    }
    attractions.forEach((a) => {
      const parts: string[] = []
      if (profile.tripType === "relaxamento" && (a.category === "Natureza" || a.category === "Cultural")) {
        parts.push(`Ideal para ${tripLabels[profile.tripType]}`)
      } else if (profile.tripType === "aventura" && (a.category === "Aventura" || a.category === "Ecoturismo")) {
        parts.push(`Perfeito para ${tripLabels[profile.tripType]}`)
      } else if (profile.tripType === "familia" && (a.category === "Cultural" || a.category === "Natureza")) {
        parts.push("Atividade familiar")
      } else if (profile.tripType === "romantico" && (a.category === "Natureza" || a.category === "Cultural" || a.category === "Histórico")) {
        parts.push(`Experiência romântica`)
      }
      if (a.free && profile.budget === "economico") parts.push("Gratuito!")
      if (profile.interests.includes("natureza") && a.category === "Natureza") parts.push("Combina com seus interesses")
      if (profile.interests.includes("cultura") && (a.category === "Cultural" || a.category === "Histórico")) parts.push("Combina com seus interesses")
      reasons[a.id] = parts.length > 0 ? parts[0] : "Recomendado pela IA"
    })
    return reasons
  }, [profile])

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setFavorites((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleCompare = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setCompareList((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id)
      if (prev.length >= 3) return [prev[1], prev[2], id].slice(-3)
      return [...prev, id]
    })
  }

  const openDetail = (attraction: Attraction) => {
    setSelectedAttraction({
      id: attraction.id,
      title: attraction.name,
      description: attraction.description,
      images: [attraction.image],
      stars: Math.round(attraction.rating),
      location: attraction.location,
      price: attraction.price || 0,
      features: attraction.highlights,
      capacity: 10,
      rating: attraction.rating,
      reviews: Math.floor(attraction.rating * 100),
      type: "passeio",
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price)
  }

  const renderStars = (rating: number) => {
    const full = Math.floor(rating)
    return (
      <span style={{ display: "flex", alignItems: "center", gap: 2 }}>
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            size={16}
            style={{
              fill: i < full ? "#FACC15" : "none",
              color: i < full ? "#FACC15" : "#D1D5DB",
            }}
          />
        ))}
        <span style={{ fontSize: 13, color: "#6B7280", marginLeft: 4 }}>({rating})</span>
      </span>
    )
  }

  const renderAttractionCard = (attraction: Attraction, isSpecial?: boolean) => {
    const catColor = categoryColors[attraction.category] || "#6B7280"
    const isHovered = hoveredCard === attraction.id
    const isFav = favorites.has(attraction.id)
    const isComparing = compareList.includes(attraction.id)
    const isExpOfDay = experienceOfDay === attraction.id && isSpecial

    return (
      <div
        key={attraction.id}
        data-testid={`card-attraction-${attraction.id}`}
        onClick={() => openDetail(attraction)}
        onMouseEnter={() => setHoveredCard(attraction.id)}
        onMouseLeave={() => setHoveredCard(null)}
        style={{
          background: isExpOfDay
            ? "linear-gradient(135deg, #fff 0%, #FEF3C7 100%)"
            : "#fff",
          borderRadius: 16,
          boxShadow: isHovered
            ? "0 8px 30px rgba(0,0,0,0.15)"
            : "0 2px 12px rgba(0,0,0,0.08)",
          overflow: "hidden",
          cursor: "pointer",
          transition: "transform 0.25s ease, box-shadow 0.25s ease",
          transform: isHovered ? "scale(1.03)" : "scale(1)",
          border: isExpOfDay ? "2px solid #F59E0B" : isComparing ? "2px solid #2563EB" : "none",
          position: "relative" as const,
        }}
      >
        <div style={{ position: "relative" }}>
          <img
            src={attraction.image}
            alt={attraction.name}
            style={{ width: "100%", height: 200, objectFit: "cover", display: "block" }}
          />

          {isHovered && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                padding: 14,
                transition: "opacity 0.3s",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <Star size={14} style={{ fill: "#FACC15", color: "#FACC15" }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{attraction.rating}</span>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.8)" }}>
                  ({Math.floor(attraction.rating * 100)} avaliações)
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                {attraction.distance && (
                  <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#fff" }}>
                    <Navigation size={12} />
                    {attraction.distance}
                  </span>
                )}
                <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#fff" }}>
                  <DollarSign size={12} />
                  {attraction.free ? "Gratuito" : attraction.price != null ? formatPrice(attraction.price) : "Consultar"}
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#fff" }}>
                  <Clock size={12} />
                  {attraction.duration}
                </span>
              </div>
            </div>
          )}

          <span
            data-testid={`badge-category-${attraction.id}`}
            style={{
              position: "absolute",
              top: 10,
              left: 10,
              background: catColor,
              color: "#fff",
              fontSize: 11,
              fontWeight: 700,
              padding: "4px 10px",
              borderRadius: 8,
            }}
          >
            {attraction.category}
          </span>

          {isExpOfDay && (
            <span
              data-testid={`badge-experience-day-${attraction.id}`}
              style={{
                position: "absolute",
                top: 10,
                left: attraction.free ? 10 : "auto",
                right: attraction.free ? "auto" : 10,
                ...(attraction.free ? { top: 38 } : {}),
                background: "linear-gradient(135deg, #F59E0B, #EA580C)",
                color: "#fff",
                fontSize: 10,
                fontWeight: 800,
                padding: "4px 10px",
                borderRadius: 8,
                letterSpacing: 0.5,
              }}
            >
              <Star size={10} style={{ display: "inline", verticalAlign: "middle", marginRight: 3, fill: "#fff", color: "#fff" }} />
              EXPERIÊNCIA DO DIA
            </span>
          )}

          {attraction.free && (
            <span
              data-testid={`badge-free-${attraction.id}`}
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                background: "#16A34A",
                color: "#fff",
                fontSize: 11,
                fontWeight: 700,
                padding: "4px 10px",
                borderRadius: 8,
              }}
            >
              GRÁTIS
            </span>
          )}

          <button
            data-testid={`button-favorite-${attraction.id}`}
            onClick={(e) => toggleFavorite(attraction.id, e)}
            style={{
              position: "absolute",
              bottom: 10,
              right: 10,
              width: 36,
              height: 36,
              borderRadius: "50%",
              border: "none",
              background: "rgba(255,255,255,0.9)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "transform 0.2s",
              transform: isFav ? "scale(1.15)" : "scale(1)",
            }}
          >
            <Heart
              size={18}
              style={{
                fill: isFav ? "#EF4444" : "none",
                color: isFav ? "#EF4444" : "#6B7280",
                transition: "all 0.2s",
              }}
            />
          </button>

          <button
            data-testid={`button-compare-${attraction.id}`}
            onClick={(e) => toggleCompare(attraction.id, e)}
            style={{
              position: "absolute",
              bottom: 10,
              right: 52,
              width: 36,
              height: 36,
              borderRadius: "50%",
              border: isComparing ? "2px solid #2563EB" : "none",
              background: isComparing ? "#EFF6FF" : "rgba(255,255,255,0.9)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <BarChart3
              size={16}
              style={{ color: isComparing ? "#2563EB" : "#6B7280" }}
            />
          </button>
        </div>

        <div style={{ padding: 16 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6, gap: 8 }}>
            <h3 data-testid={`text-name-${attraction.id}`} style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>{attraction.name}</h3>
            <AIRecommendedBadge matchPercent={matchScores[attraction.id] || 75} />
          </div>

          {renderStars(attraction.rating)}

          {profile && profileReasonMap[attraction.id] && (
            <div
              data-testid={`text-ai-reason-${attraction.id}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginTop: 8,
                padding: "5px 10px",
                background: "linear-gradient(135deg, #EFF6FF, #F0FDF4)",
                borderRadius: 8,
                border: "1px solid #BFDBFE",
              }}
            >
              <Sparkles size={12} style={{ color: "#2563EB", flexShrink: 0 }} />
              <span style={{ fontSize: 11, fontWeight: 600, color: "#1E40AF" }}>
                {profileReasonMap[attraction.id]}
              </span>
            </div>
          )}

          <p style={{ fontSize: 13, color: "#6B7280", margin: "8px 0 12px", lineHeight: 1.5 }}>
            {attraction.description}
          </p>

          <div style={{ display: "flex", gap: 16, marginBottom: 10, fontSize: 13, color: "#6B7280", flexWrap: "wrap" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <MapPin size={14} style={{ color: "#16A34A" }} />
              {attraction.location}
            </span>
            {attraction.distance && (
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <Navigation size={14} style={{ color: "#6366F1" }} />
                {attraction.distance}
              </span>
            )}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginBottom: 10,
              padding: "6px 10px",
              background: "#EFF6FF",
              borderRadius: 8,
              width: "fit-content",
            }}
          >
            <Clock size={16} style={{ color: "#2563EB" }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: "#1E40AF" }}>
              {attraction.duration}
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Eye size={13} style={{ color: "#D97706" }} />
              <span data-testid={`text-visitors-today-${attraction.id}`} style={{ fontSize: 11, color: "#92400E", fontWeight: 600 }}>
                {visitorsMap[attraction.id] || 12} visitantes hoje
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Users size={13} style={{ color: "#7C3AED" }} />
              <span data-testid={`text-visitors-week-${attraction.id}`} style={{ fontSize: 11, color: "#5B21B6", fontWeight: 600 }}>
                {weeklyVisitorsMap[attraction.id] || 120} visitaram esta semana
              </span>
            </div>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
            {attraction.highlights.map((h) => (
              <span
                key={h}
                style={{
                  fontSize: 11,
                  background: "#F3F4F6",
                  color: "#374151",
                  padding: "3px 8px",
                  borderRadius: 6,
                }}
              >
                {h}
              </span>
            ))}
          </div>

          <div data-testid={`text-price-${attraction.id}`} style={{ marginBottom: 12 }}>
            {attraction.free ? (
              <span style={{ fontSize: 18, fontWeight: 700, color: "#16A34A" }}>GRATUITO</span>
            ) : attraction.price != null ? (
              <span style={{ fontSize: 18, fontWeight: 700, color: "#16A34A" }}>
                {formatPrice(attraction.price)}
              </span>
            ) : (
              <span style={{ fontSize: 15, fontWeight: 700, color: "#2563EB" }}>Ver disponibilidade</span>
            )}
          </div>

          <button
            data-testid={`button-directions-${attraction.id}`}
            onClick={(e) => {
              e.stopPropagation()
              window.open(
                `https://wa.me/5564993197555?text=Olá! Quero informações sobre ${attraction.name} e como chegar lá!`,
                "_blank",
              )
            }}
            style={{
              width: "100%",
              padding: "12px 0",
              border: "none",
              borderRadius: 10,
              background: "linear-gradient(135deg, #16A34A, #059669)",
              color: "#fff",
              fontSize: 15,
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}
          >
            <MapPin size={16} />
            Como Chegar + Dicas
          </button>
        </div>
      </div>
    )
  }

  const compareAttractions = compareList.map((id) => attractions.find((a) => a.id === id)).filter(Boolean) as Attraction[]

  return (
    <div className="rsv-subpage">
      <div
        style={{
          background: "linear-gradient(135deg, #16A34A 0%, #059669 100%)",
          color: "#fff",
          padding: "24px 20px 20px",
          borderRadius: "0 0 24px 24px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Link href="/" data-testid="link-back-home" style={{ color: "#fff", display: "flex", alignItems: "center" }}>
              <ArrowLeft size={22} />
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
        <h1 data-testid="text-page-title" style={{ fontSize: 26, fontWeight: 800, margin: "0 0 8px" }}>Atrações Turísticas</h1>
        <p style={{ fontSize: 14, opacity: 0.9, margin: 0 }}>Explore o melhor de Caldas Novas com IA</p>

        <div data-testid="filter-mood-bar" style={{ display: "flex", gap: 8, overflowX: "auto", marginTop: 16, paddingBottom: 4 }}>
          {moodFilters.map((f) => {
            const isActive = activeMood === f.value
            const MoodIcon = moodIcons[f.value]
            return (
              <button
                key={f.value}
                data-testid={`button-mood-${f.value}`}
                onClick={() => setActiveMood(f.value)}
                style={{
                  padding: "8px 16px",
                  border: "none",
                  borderRadius: 20,
                  background: isActive ? "#fff" : "rgba(255,255,255,0.15)",
                  color: isActive ? "#059669" : "rgba(255,255,255,0.8)",
                  fontSize: 13,
                  fontWeight: isActive ? 700 : 500,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.2s",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                {MoodIcon && <MoodIcon size={14} />}
                {f.label}
              </button>
            )
          })}
        </div>
      </div>

      <SocialProofBanner pageName="atrações" />

      <PersonalizedBanner profile={profile} />

      {!profile && (
        <div
          data-testid="button-personalize-cta"
          onClick={() => setShowProfileModal(true)}
          style={{
            margin: "12px 16px 0",
            padding: "12px 16px",
            borderRadius: 12,
            background: "linear-gradient(135deg, #2563EB, #7C3AED)",
            color: "#fff",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Sparkles style={{ width: 20, height: 20, flexShrink: 0 }} />
          <div>
            <span style={{ fontSize: 13, fontWeight: 700 }}>Responda 4 perguntas e descubra atrações ideais para você</span>
            <p style={{ fontSize: 11, opacity: 0.9, margin: "2px 0 0" }}>
              Nossa IA personaliza recomendações baseado no seu perfil de viajante
            </p>
          </div>
        </div>
      )}

      <div data-testid="section-ai-picks" style={{ margin: "20px 16px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <Sparkles style={{ width: 20, height: 20, color: "#F57C00" }} />
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "#1F2937", margin: 0 }}>
            {profile ? "Top IA Picks para Você" : "Roteiro IA Personalizado"}
          </h2>
        </div>
        <p style={{ fontSize: 13, color: "#6B7280", margin: "0 0 12px" }}>
          {profile
            ? `Selecionado com base no seu perfil de ${profile.tripType === "familia" ? "família" : profile.tripType === "romantico" ? "viagem romântica" : profile.tripType === "aventura" ? "aventura" : "viajante"}`
            : "Top atrações recomendadas para você"}
        </p>
        <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 8 }}>
          {aiRecommended.map((attraction, idx) => (
            <div
              key={attraction.id}
              data-testid={`card-ai-pick-${attraction.id}`}
              onClick={() => openDetail(attraction)}
              style={{
                minWidth: 220,
                borderRadius: 14,
                overflow: "hidden",
                background: "#fff",
                boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
                border: "1px solid #E5E7EB",
                cursor: "pointer",
                flexShrink: 0,
                position: "relative" as const,
              }}
            >
              <div style={{ position: "relative" }}>
                <img
                  src={attraction.image}
                  alt={attraction.name}
                  style={{ width: "100%", height: 120, objectFit: "cover", display: "block" }}
                />
                <div style={{
                  position: "absolute", top: 6, left: 6,
                  background: "linear-gradient(135deg, #F57C00, #E65100)",
                  color: "#fff", fontSize: 10, fontWeight: 800,
                  padding: "3px 8px", borderRadius: 6,
                }}>
                  #{idx + 1} IA Pick
                </div>
                <div style={{ position: "absolute", top: 6, right: 6 }}>
                  <AIRecommendedBadge matchPercent={matchScores[attraction.id] || 75} />
                </div>
              </div>
              <div style={{ padding: "10px 12px" }}>
                <h4 style={{ fontSize: 14, fontWeight: 700, margin: "0 0 4px", color: "#1F2937" }}>
                  {attraction.name}
                </h4>
                <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#6B7280" }}>
                  <Clock size={12} style={{ color: "#2563EB" }} />
                  {attraction.duration}
                </div>
                {profile && profileReasonMap[attraction.id] && (
                  <div style={{
                    marginTop: 6,
                    fontSize: 10,
                    fontWeight: 600,
                    color: "#7C3AED",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}>
                    <Sparkles size={10} style={{ color: "#7C3AED" }} />
                    {profileReasonMap[attraction.id]}
                  </div>
                )}
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 6, fontSize: 12 }}>
                  <span style={{ fontWeight: 700, color: attraction.free ? "#16A34A" : "#2563EB" }}>
                    {attraction.free ? "Gratuito" : attraction.price != null ? formatPrice(attraction.price) : "Consultar"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {compareList.length > 0 && (
        <div
          data-testid="section-compare-bar"
          style={{
            margin: "16px 16px 0",
            padding: "10px 14px",
            borderRadius: 12,
            background: "#EFF6FF",
            border: "1px solid #BFDBFE",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 8,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <BarChart3 size={16} style={{ color: "#2563EB" }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: "#1E40AF" }}>
              {compareList.length}/3 selecionadas para comparar
            </span>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {compareList.length >= 2 && (
              <button
                data-testid="button-open-compare"
                onClick={() => setShowCompare(true)}
                style={{
                  padding: "6px 14px",
                  borderRadius: 8,
                  border: "none",
                  background: "#2563EB",
                  color: "#fff",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Comparar
              </button>
            )}
            <button
              data-testid="button-clear-compare"
              onClick={() => setCompareList([])}
              style={{
                padding: "6px 14px",
                borderRadius: 8,
                border: "1px solid #BFDBFE",
                background: "#fff",
                color: "#2563EB",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Limpar
            </button>
          </div>
        </div>
      )}

      <div data-testid="text-filter-result-count" style={{ padding: "16px 16px 0", fontSize: 13, color: "#6B7280" }}>
        {activeMood !== "Todos" && (
          <span>
            Mostrando <strong style={{ color: "#1F2937" }}>{filteredAttractions.length}</strong> atrações para <strong style={{ color: "#059669" }}>{activeMood}</strong>
          </span>
        )}
      </div>

      <div className="rsv-subpage-grid" style={{ padding: "12px 16px 24px" }}>
        {filteredAttractions.map((attraction) =>
          renderAttractionCard(attraction, experienceOfDay === attraction.id)
        )}
      </div>

      {filteredAttractions.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px 16px" }}>
          <Sparkles size={32} style={{ color: "#D1D5DB", marginBottom: 12 }} />
          <p style={{ fontSize: 15, fontWeight: 600, color: "#6B7280" }}>
            Nenhuma atração encontrada para "{activeMood}"
          </p>
          <button
            data-testid="button-clear-filter"
            onClick={() => setActiveMood("Todos")}
            style={{
              marginTop: 12,
              padding: "8px 20px",
              borderRadius: 8,
              border: "none",
              background: "#2563EB",
              color: "#fff",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Ver todas as atrações
          </button>
        </div>
      )}

      <div
        style={{
          margin: "0 16px 24px",
          padding: 24,
          borderRadius: 16,
          background: "linear-gradient(135deg, #F59E0B, #EA580C)",
          color: "#fff",
          textAlign: "center",
        }}
      >
        <h3 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 8px", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <MapPin size={22} />
          Roteiro Personalizado!
        </h3>
        <p style={{ fontSize: 14, margin: "0 0 16px", opacity: 0.95 }}>
          Nossos guias locais criam o roteiro perfeito para você conhecer o melhor de Caldas Novas
        </p>
        <button
          data-testid="button-create-itinerary"
          onClick={() =>
            window.open(
              "https://wa.me/5564993197555?text=Olá! Quero um roteiro personalizado para conhecer as atrações de Caldas Novas!",
              "_blank",
            )
          }
          style={{
            padding: "12px 32px",
            border: "none",
            borderRadius: 10,
            background: "#fff",
            color: "#D97706",
            fontSize: 15,
            fontWeight: 700,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <Navigation size={16} />
          Criar Meu Roteiro
        </button>
      </div>

      <CrossSellSection
        title="Combine com hospedagem"
        items={[
          { name: "Hotel Privé Thermas", price: 289, link: "/hoteis", badge: "Popular" },
          { name: "Lacqua DiRoma", price: 349, link: "/hoteis", badge: "-25%" },
          { name: "Pousada do Sol", price: 159, link: "/hoteis" },
          { name: "Hotel Giardino", price: 199, link: "/hoteis" },
        ]}
      />

      <a
        data-testid="link-whatsapp-float"
        href="https://wa.me/5564993197555?text=Olá! Gostaria de informações sobre as atrações turísticas de Caldas Novas."
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: "fixed",
          bottom: 80,
          right: 16,
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "#16A34A",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          zIndex: 50,
        }}
      >
        <Phone size={26} style={{ color: "#fff" }} />
      </a>

      {selectedAttraction && (
        <HotelDetailPanel hotel={selectedAttraction} onClose={() => setSelectedAttraction(null)} />
      )}

      {showProfileModal && (
        <TravelerProfileModal
          onClose={() => setShowProfileModal(false)}
          onSave={(p) => {
            setProfile(p)
            setShowProfileModal(false)
          }}
        />
      )}

      {showCompare && compareAttractions.length >= 2 && (
        <div
          data-testid="modal-compare"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9998,
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
          onClick={() => setShowCompare(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: 20,
              width: "100%",
              maxWidth: compareAttractions.length === 3 ? 800 : 600,
              maxHeight: "90vh",
              overflow: "auto",
              position: "relative",
            }}
          >
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "16px 20px", borderBottom: "1px solid #E5E7EB", gap: 8,
            }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: "#1F2937" }}>
                Comparador de Atrações
              </h3>
              <button
                data-testid="button-close-compare"
                onClick={() => setShowCompare(false)}
                style={{
                  width: 32, height: 32, borderRadius: "50%", border: "none",
                  background: "#F3F4F6", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                <X size={16} style={{ color: "#6B7280" }} />
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: `repeat(${compareAttractions.length}, 1fr)`, gap: 0 }}>
              {compareAttractions.map((a, idx) => (
                <div key={a.id} data-testid={`compare-column-${a.id}`} style={{ padding: 16, borderRight: idx < compareAttractions.length - 1 ? "1px solid #E5E7EB" : "none" }}>
                  <img
                    src={a.image}
                    alt={a.name}
                    style={{ width: "100%", height: 120, objectFit: "cover", borderRadius: 10, marginBottom: 10 }}
                  />
                  <h4 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 6px", color: "#1F2937" }}>{a.name}</h4>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 6 }}>
                    <AIRecommendedBadge matchPercent={matchScores[a.id] || 75} />
                  </div>

                  <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 4, display: "flex", alignItems: "center", gap: 4 }}>
                    <Star size={12} style={{ fill: "#FACC15", color: "#FACC15" }} />
                    {a.rating}
                  </div>

                  <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 4, display: "flex", alignItems: "center", gap: 4 }}>
                    <MapPin size={12} style={{ color: "#16A34A" }} />
                    {a.location}
                  </div>

                  {a.distance && (
                    <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 4, display: "flex", alignItems: "center", gap: 4 }}>
                      <Navigation size={12} style={{ color: "#6366F1" }} />
                      {a.distance}
                    </div>
                  )}

                  <div style={{ fontSize: 12, color: "#1E40AF", marginBottom: 4, display: "flex", alignItems: "center", gap: 4, fontWeight: 600 }}>
                    <Clock size={12} style={{ color: "#2563EB" }} />
                    {a.duration}
                  </div>

                  <div style={{ fontSize: 12, color: "#374151", marginBottom: 4 }}>
                    <span style={{ fontWeight: 700 }}>Categoria:</span> {a.category}
                  </div>

                  <div style={{ fontSize: 12, color: "#374151", marginBottom: 8 }}>
                    <span style={{ fontWeight: 700 }}>Visitantes/semana:</span> {weeklyVisitorsMap[a.id] || 120}
                  </div>

                  <div style={{ fontSize: 14, fontWeight: 700, color: a.free ? "#16A34A" : "#2563EB", marginBottom: 8 }}>
                    {a.free ? "GRATUITO" : a.price != null ? formatPrice(a.price) : "Consultar"}
                  </div>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                    {a.highlights.map((h) => (
                      <span
                        key={h}
                        style={{
                          fontSize: 10,
                          background: "#F3F4F6",
                          color: "#374151",
                          padding: "2px 6px",
                          borderRadius: 4,
                        }}
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ padding: "12px 20px 16px", borderTop: "1px solid #E5E7EB", textAlign: "center" }}>
              <button
                data-testid="button-close-comparison"
                onClick={() => {
                  setShowCompare(false)
                  setCompareList([])
                }}
                style={{
                  padding: "10px 24px",
                  borderRadius: 10,
                  border: "none",
                  background: "linear-gradient(135deg, #16A34A, #059669)",
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Fechar Comparação
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
