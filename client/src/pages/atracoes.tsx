import { useState, useEffect, useMemo } from "react"
import { useSearch } from "wouter"
import { Phone, MapPin, Clock, Star, Heart, Users, Sparkles, Eye, X, BarChart3, Navigation, DollarSign, Waves, Mountain, Baby, HeartHandshake, Landmark, TreePine } from "lucide-react"
import HotelDetailPanel, { HotelDetailData } from "@/components/hotel-detail-panel"
import { HomeHeader } from "@/components/home/HomeHeader"
import { HomeFooter } from "@/components/home/HomeFooter"
import { MobileCTABar } from "@/components/home/MobileCTABar"
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
import { useUnifiedSearch } from "@/hooks/useUnifiedSearch"
import SearchBar from "@/components/search/SearchBar"
import SearchResultsSummary from "@/components/search/SearchResultsSummary"
import SearchEmptyState from "@/components/search/SearchEmptyState"
import { clearPriceRange } from "@/lib/search-query"
import type { SearchFilters, SearchItem } from "@/types/search"
import { CatalogPageShell } from "@/components/layouts/CatalogPageShell"
import SearchFiltersDrawer from "@/components/search/SearchFiltersDrawer"
import { FilterPopover } from "@/components/search/FilterPopover"

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

const MOOD_TO_PROFILE: Record<string, string | undefined> = {
  Todos: undefined,
  Relaxamento: "relaxar",
  Aventura: "aventura",
  "Família": "familia",
  "Romântico": "casal",
  Cultura: undefined,
  Natureza: undefined,
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

const WA_URL = "https://wa.me/5564993197555"

const CATEGORIA_TO_MOOD: Record<string, string> = {
  parques: "Aventura",
  aventura: "Aventura",
  natureza: "Natureza",
  cultura: "Cultura",
  relaxamento: "Relaxamento",
  familia: "Família",
  romantico: "Romântico",
  restaurantes: "Cultura",
  gastronomia: "Cultura",
  historico: "Cultura",
  ecoturismo: "Natureza",
  esportes: "Aventura",
  spa: "Relaxamento",
  trilhas: "Natureza",
  passeios: "Aventura",
}

const MOOD_COLORS: Record<string, { bg: string; text: string; border: string; solid: string }> = {
  Todos:      { bg: "#F3F4F6", text: "#374151", border: "#E5E7EB",  solid: "#374151" },
  Relaxamento:{ bg: "#EFF6FF", text: "#1D4ED8", border: "#BFDBFE",  solid: "#2563EB" },
  Aventura:   { bg: "#FEF2F2", text: "#DC2626", border: "#FECACA",  solid: "#DC2626" },
  "Família":  { bg: "#FFFBEB", text: "#D97706", border: "#FDE68A",  solid: "#D97706" },
  "Romântico":{ bg: "#FDF2F8", text: "#DB2777", border: "#FBCFE8",  solid: "#DB2777" },
  Cultura:    { bg: "#F5F3FF", text: "#7C3AED", border: "#DDD6FE",  solid: "#7C3AED" },
  Natureza:   { bg: "#F0FDF4", text: "#16A34A", border: "#BBF7D0",  solid: "#16A34A" },
}

export default function AtracoesPage() {
  const search = useSearch()
  const params = new URLSearchParams(search)
  const categoriaParam = params.get("categoria") || ""
  const initialMood = CATEGORIA_TO_MOOD[categoriaParam.toLowerCase()] || "Todos"
  const [activeMood, setActiveMood] = useState(initialMood)

  const {
    filters: searchFilters,
    setFilter: setSearchFilter,
    setFilters: setSearchFilters,
    clearAll: clearAllSearch,
    data: searchData,
    isLoading: searchLoading,
  } = useUnifiedSearch({
    syncUrl: true,
    basePath: "/atracoes",
    initialFilters: { type: "park" },
  })

  useEffect(() => {
    const newMood = CATEGORIA_TO_MOOD[categoriaParam.toLowerCase()] || "Todos"
    setActiveMood(newMood)
    const profileVal = MOOD_TO_PROFILE[newMood]
    setSearchFilters({ type: "park", profile: profileVal })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoriaParam])

  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false)
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
  const [aiSlideIdx, setAiSlideIdx] = useState(0)
  const [aiSlideTransition, setAiSlideTransition] = useState(true)
  const [aiSlidePaused, setAiSlidePaused] = useState(false)

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

  const searchItemToAttraction = (item: SearchItem): Attraction => {
    const local = attractions.find(a => a.id === item.id)
    return {
      id: item.id,
      name: item.name,
      description: item.descriptionLong || item.descriptionShort,
      image: item.images[0] || local?.image || "",
      location: `${item.city} - ${item.state}`,
      duration: local?.duration || "Dia inteiro",
      category: local?.category || item.category,
      highlights: item.amenities.length > 0 ? item.amenities : local?.highlights ?? [],
      rating: item.rating,
      price: item.priceFrom > 0 ? item.priceFrom : null,
      free: item.priceFrom === 0,
      distance: local?.distance,
    }
  }

  const apiAttractions = useMemo(() => {
    const results = searchData?.results ?? []
    return results.filter(r => r.type === "park" || r.type === "attraction")
  }, [searchData])

  const filteredAttractions = useMemo(() => {
    const moodsWithoutProfile = new Set(["Cultura", "Natureza"])
    const needsLocalGate = activeMood !== "Todos" && moodsWithoutProfile.has(activeMood)

    if (!needsLocalGate) {
      return apiAttractions
    }
    return apiAttractions.filter((item) => {
      const local = attractions.find(a => a.id === item.id)
      const atCategory = local?.category || item.category
      const moods = categoryToMood[atCategory] || []
      return moods.includes(activeMood)
    })
  }, [apiAttractions, activeMood])

  const hasAnyAtracaoFilter = !!(searchFilters.q || searchFilters.category || searchFilters.minPrice !== undefined || searchFilters.maxPrice !== undefined || searchFilters.profile || searchFilters.enterprise || searchFilters.city)

  const handleRemoveAtracaoFilter = (key: keyof SearchFilters | "priceRange") => {
    if (key === "priceRange") {
      setSearchFilters(clearPriceRange(searchFilters))
    } else {
      const updated: Partial<SearchFilters> = { [key]: undefined }
      setSearchFilters({ ...searchFilters, ...updated })
      if (key === "profile") setActiveMood("Todos")
    }
  }

  const handleClearAtracaoFilters = () => {
    clearAllSearch()
    setSearchFilters({ type: "park" })
    setActiveMood("Todos")
  }

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

  useEffect(() => {
    if (aiSlidePaused || aiRecommended.length <= 1) return
    const interval = setInterval(() => setAiSlideIdx(p => p + 1), 3500)
    return () => clearInterval(interval)
  }, [aiSlidePaused, aiRecommended.length])

  useEffect(() => {
    if (aiSlideIdx > 0 && aiSlideIdx >= aiRecommended.length) {
      const t = setTimeout(() => { setAiSlideTransition(false); setAiSlideIdx(0) }, 420)
      return () => clearTimeout(t)
    }
  }, [aiSlideIdx, aiRecommended.length])

  useEffect(() => {
    if (!aiSlideTransition) {
      const t = setTimeout(() => setAiSlideTransition(true), 50)
      return () => clearTimeout(t)
    }
  }, [aiSlideTransition])

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

          <a
            data-testid={`button-directions-${attraction.id}`}
            href={`${WA_URL}?text=Olá! Tenho interesse em ${attraction.name} e quero mais informações e dicas!`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              padding: "12px 0",
              border: "none",
              borderRadius: 10,
              background: "linear-gradient(135deg, #25D366, #128C7E)",
              color: "#fff",
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              textDecoration: "none",
            }}
          >
            <Phone size={15} />
            Reservar / Consultar via WhatsApp
          </a>
        </div>
      </div>
    )
  }

  const compareAttractions = useMemo(() => {
    return compareList
      .map(id => {
        const fromApi = apiAttractions.find(item => item.id === id)
        if (fromApi) return searchItemToAttraction(fromApi)
        return attractions.find(a => a.id === id) ?? null
      })
      .filter((a): a is Attraction => a !== null)
  }, [compareList, apiAttractions])

  const searchBarSlot = (
    <>
      <div
        style={{ padding: "12px 16px 0", background: "#fff", position: "sticky", top: 64, zIndex: 31 }}
        data-testid="search-bar-atracoes-wrapper"
      >
        <SearchBar
          value={searchFilters.q || ""}
          activeType="park"
          onSearch={(q) => setSearchFilters({ ...searchFilters, q })}
          onTypeChange={() => {}}
          onFiltersOpen={() => {}}
          hasActiveFilters={hasAnyAtracaoFilter}
        />
      </div>
      <div
        data-testid="filter-mood-bar"
        style={{
          background: "#fff",
          borderBottom: "1px solid #E5E7EB",
          padding: "14px 20px",
          display: "flex", gap: 8, overflowX: "auto",
          position: "sticky", top: 118, zIndex: 30,
        }}
      >
        <FilterPopover
          filters={searchFilters}
          facets={searchData?.facets}
          onFiltersChange={setSearchFilters}
          onClearAll={clearAllSearch}
        />
        <button
          className="rsv-catalog-mobile-only"
          data-testid="button-open-filters-mobile"
          onClick={() => setFilterDrawerOpen(true)}
          style={{
            display: "flex", alignItems: "center", gap: 5, flexShrink: 0,
            background: "#EFF6FF", border: "1.5px solid #BFDBFE",
            borderRadius: 999, padding: "7px 12px", color: "#2563EB",
            fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap",
          }}
        >
          ⚙ Filtros
        </button>
        {moodFilters.map((f) => {
          const isActive = activeMood === f.value
          const MoodIcon = moodIcons[f.value]
          const colors = MOOD_COLORS[f.value] || MOOD_COLORS["Todos"]
          return (
            <button
              key={f.value}
              data-testid={`button-mood-${f.value}`}
              onClick={() => {
                setActiveMood(f.value)
                const profileVal = MOOD_TO_PROFILE[f.value]
                setSearchFilters({ ...searchFilters, type: "park", profile: profileVal })
              }}
              style={{
                padding: "7px 14px",
                border: isActive ? `1.5px solid ${colors.solid}` : "1.5px solid #E5E7EB",
                borderRadius: 999,
                background: isActive ? colors.solid : "#F3F4F6",
                color: isActive ? "#fff" : "#6B7280",
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
              {MoodIcon && <MoodIcon size={13} />}
              {f.label}
            </button>
          )
        })}
      </div>
    </>
  )

  return (
    <CatalogPageShell
      header={<HomeHeader />}
      searchBar={searchBarSlot}
      footer={<><HomeFooter /><MobileCTABar /></>}
      mobileDrawer={
        <SearchFiltersDrawer
          open={filterDrawerOpen}
          filters={searchFilters}
          facets={searchData?.facets}
          onClose={() => setFilterDrawerOpen(false)}
          onFiltersChange={setSearchFilters}
          onClearAll={() => { clearAllSearch(); setFilterDrawerOpen(false) }}
        />
      }
    >
      <div
        data-testid="hero-atracoes"
        style={{
          color: "#fff",
          paddingTop: 104,
          paddingBottom: 56,
          paddingLeft: 20,
          paddingRight: 20,
          position: "relative",
          overflow: "hidden",
          backgroundImage: "url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/O-que-fazer-em-Caldas-Novas-alem-dos-parques-.jpg-hggVCc4sV9K9nxiHfEglNOYL1NO3Mr.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(135deg, rgba(15,31,56,0.88) 0%, rgba(6,95,70,0.80) 100%)",
        }} />

        <div style={{ maxWidth: 780, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.25)",
            borderRadius: 20, padding: "6px 14px", marginBottom: 20,
          }}>
            <span style={{
              width: 8, height: 8, borderRadius: "50%", background: "#4ADE80",
              display: "inline-block",
              animation: "pulse 2s infinite",
            }} />
            <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: 0.5 }}>
              🌿 {attractions.length} atrações únicas em Caldas Novas
            </span>
          </div>

          <h1
            data-testid="text-page-title"
            style={{
              fontSize: "clamp(26px, 5vw, 42px)",
              fontWeight: 900,
              margin: "0 0 14px",
              lineHeight: 1.15,
              letterSpacing: -0.5,
            }}
          >
            Descubra as Melhores<br />
            <span style={{ color: "#4ADE80" }}>Atrações de Caldas Novas</span>
          </h1>

          <p style={{ fontSize: 16, opacity: 0.88, margin: "0 0 28px", lineHeight: 1.6, maxWidth: 540 }}>
            Parques termais, natureza exuberante, cultura e muito mais — guia completo com recomendações de IA para cada perfil de viajante.
          </p>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button
              data-testid="button-hero-ver-parques"
              onClick={() => {
                setActiveMood("Aventura")
                setSearchFilters({ type: "park", profile: MOOD_TO_PROFILE["Aventura"] })
              }}
              style={{
                padding: "14px 28px", borderRadius: 12, border: "none",
                background: "#4ADE80", color: "#065F46",
                fontSize: 15, fontWeight: 800, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 8,
              }}
            >
              🎡 Ver parques
            </button>
            <a
              data-testid="button-hero-whatsapp"
              href={`${WA_URL}?text=Olá! Quero informações sobre atrações em Caldas Novas.`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: "14px 28px", borderRadius: 12,
                border: "2px solid rgba(255,255,255,0.4)",
                background: "rgba(255,255,255,0.08)",
                color: "#fff", fontSize: 15, fontWeight: 700,
                cursor: "pointer", textDecoration: "none",
                display: "flex", alignItems: "center", gap: 8,
              }}
            >
              <Phone size={16} />
              Falar com especialista
            </a>
          </div>

          <div style={{
            display: "flex", gap: 24, marginTop: 32, flexWrap: "wrap",
            borderTop: "1px solid rgba(255,255,255,0.15)", paddingTop: 20,
          }}>
            {[
              { icon: "🏞️", value: `${attractions.length}`, label: "atrações cadastradas" },
              { icon: "⭐", value: "4.7", label: "avaliação média" },
              { icon: "💬", value: "Suporte", label: "WhatsApp 24h" },
            ].map((item) => (
              <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 20 }}>{item.icon}</span>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, lineHeight: 1 }}>{item.value}</div>
                  <div style={{ fontSize: 11, opacity: 0.7, marginTop: 2 }}>{item.label}</div>
                </div>
              </div>
            ))}
          </div>
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
        <div
          style={{ overflow: "hidden" }}
          onMouseEnter={() => setAiSlidePaused(true)}
          onMouseLeave={() => setAiSlidePaused(false)}
        >
          <div style={{
            display: "flex",
            gap: 12,
            transform: `translateX(-${aiSlideIdx * 232}px)`,
            transition: aiSlideTransition ? "transform 0.45s ease" : "none",
          }}>
          {[...aiRecommended, aiRecommended[0]].filter(Boolean).map((attraction, idx) => (
            <div
              key={idx}
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

      <div style={{ padding: "16px 16px 0" }}>
        {(hasAnyAtracaoFilter || !!searchFilters.q) ? (
          <SearchResultsSummary
            total={filteredAttractions.length}
            query={searchFilters.q || undefined}
            filters={searchFilters}
            onRemoveFilter={handleRemoveAtracaoFilter}
            onClearAll={handleClearAtracaoFilters}
          />
        ) : (
          activeMood !== "Todos" && (
            <span data-testid="text-filter-result-count" style={{ fontSize: 13, color: "#6B7280" }}>
              Mostrando <strong style={{ color: "#1F2937" }}>{filteredAttractions.length}</strong> atrações para <strong style={{ color: "#059669" }}>{activeMood}</strong>
            </span>
          )
        )}
      </div>

      <div className="rsv-subpage-grid" style={{ padding: "12px 16px 24px" }}>
        {filteredAttractions.map((item) => {
          const attraction = searchItemToAttraction(item)
          return renderAttractionCard(attraction, experienceOfDay === attraction.id)
        })}
      </div>

      {filteredAttractions.length === 0 && !searchLoading && (
        hasAnyAtracaoFilter || !!searchFilters.q ? (
          <SearchEmptyState
            query={searchFilters.q || undefined}
            onClearFilters={handleClearAtracaoFilters}
          />
        ) : (
          <div style={{ textAlign: "center", padding: "40px 16px" }}>
            <Sparkles size={32} style={{ color: "#D1D5DB", marginBottom: 12 }} />
            <p style={{ fontSize: 15, fontWeight: 600, color: "#6B7280" }}>
              Nenhuma atração encontrada para &ldquo;{activeMood}&rdquo;
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
        )
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

      <div
        data-testid="section-roteiro-3-dias"
        style={{
          margin: "0 16px 32px",
          borderRadius: 20,
          overflow: "hidden",
          background: "#fff",
          boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
          border: "1px solid #E5E7EB",
        }}
      >
        <div style={{
          background: "linear-gradient(135deg, #0F1F38, #065F46)",
          padding: "20px 24px",
          color: "#fff",
        }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#4ADE80", letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>
            🗓️ Sugestão de roteiro
          </div>
          <h3 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>
            3 Dias em Caldas Novas
          </h3>
          <p style={{ fontSize: 13, opacity: 0.8, margin: "6px 0 0" }}>
            O roteiro ideal para aproveitar ao máximo
          </p>
        </div>

        <div style={{ padding: "20px 24px" }}>
          {[
            {
              day: "Dia 1",
              color: "#2563EB",
              bg: "#EFF6FF",
              items: [
                { period: "Manhã", icon: "🌅", activity: "Monumento das Águas Termais", detail: "Início histórico · Gratuito" },
                { period: "Tarde", icon: "🌿", activity: "Jardim Japonês", detail: "1–2h · Tranquilo e fotogênico" },
                { period: "Noite", icon: "🌙", activity: "Feira do Luar", detail: "Gastronomia local · Gratuito" },
              ],
            },
            {
              day: "Dia 2",
              color: "#16A34A",
              bg: "#F0FDF4",
              items: [
                { period: "Manhã", icon: "🏊", activity: "Parque Aquático Hot Park", detail: "Dia inteiro · Reserve com antecedência" },
                { period: "Tarde", icon: "🌊", activity: "Lago Corumbá", detail: "Paisagens únicas · Passeio de barco" },
                { period: "Noite", icon: "🍽️", activity: "Restaurantes do centro", detail: "Culinária goiana típica" },
              ],
            },
            {
              day: "Dia 3",
              color: "#7C3AED",
              bg: "#F5F3FF",
              items: [
                { period: "Manhã", icon: "🏛️", activity: "Centro Histórico", detail: "Arquitetura e cultura local" },
                { period: "Tarde", icon: "♨️", activity: "Piscinas Termais do Hotel", detail: "Relaxamento total · Incluso na hospedagem" },
                { period: "Noite", icon: "✨", activity: "Livre para explorar", detail: "Shows e programação noturna" },
              ],
            },
          ].map((dayPlan) => (
            <div key={dayPlan.day} style={{ marginBottom: 20 }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: dayPlan.bg, color: dayPlan.color,
                borderRadius: 8, padding: "4px 12px", marginBottom: 10,
              }}>
                <span style={{ fontSize: 13, fontWeight: 800 }}>{dayPlan.day}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
                {dayPlan.items.map((item) => (
                  <div key={item.period} style={{
                    display: "flex", alignItems: "flex-start", gap: 12,
                    padding: "10px 14px",
                    background: dayPlan.bg, borderRadius: 10,
                    border: `1px solid ${dayPlan.bg === "#EFF6FF" ? "#BFDBFE" : dayPlan.bg === "#F0FDF4" ? "#BBF7D0" : "#DDD6FE"}`,
                  }}>
                    <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>{item.icon}</span>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase" as const, letterSpacing: 0.5 }}>
                        {item.period}
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#1F2937" }}>{item.activity}</div>
                      <div style={{ fontSize: 12, color: "#6B7280" }}>{item.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <a
            data-testid="button-roteiro-whatsapp"
            href={`${WA_URL}?text=Olá! Quero montar um roteiro personalizado de 3 dias em Caldas Novas!`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              padding: "14px 0", borderRadius: 12, border: "none",
              background: "linear-gradient(135deg, #25D366, #128C7E)",
              color: "#fff", fontSize: 14, fontWeight: 800,
              cursor: "pointer", textDecoration: "none", width: "100%",
            }}
          >
            <Phone size={16} />
            Montar meu roteiro personalizado via WhatsApp
          </a>
        </div>
      </div>

      <div style={{ padding: "0 16px 32px" }}>
        <div
          data-testid="section-trust-atracoes"
          style={{
            borderRadius: 16, padding: "24px",
            background: "linear-gradient(135deg, #0F1F38, #1E3A5F)",
            color: "#fff",
          }}
        >
          <h3 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 16px", textAlign: "center" as const }}>
            Por que reservar com a Reservei360?
          </h3>
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 16,
          }}>
            {[
              { emoji: "🏅", title: "Guia local", desc: "Especialistas em Caldas Novas" },
              { emoji: "💬", title: "WhatsApp 24h", desc: "Suporte em tempo real" },
              { emoji: "🎯", title: "IA personalizada", desc: "Roteiros sob medida" },
              { emoji: "🔒", title: "100% seguro", desc: "Pagamento protegido" },
            ].map((item) => (
              <div key={item.title} style={{
                background: "rgba(255,255,255,0.08)", borderRadius: 12,
                padding: "16px 12px", textAlign: "center" as const,
              }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>{item.emoji}</div>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{item.title}</div>
                <div style={{ fontSize: 11, opacity: 0.7 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

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
    </CatalogPageShell>
  )
}
