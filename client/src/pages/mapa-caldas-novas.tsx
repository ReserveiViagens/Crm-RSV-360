import { useState, useEffect, useMemo, useRef, useCallback } from "react"
import { Search, MapPin, Star, Zap, Gavel, X, Filter, Navigation, Route, Sparkles, ChevronRight, Hotel, Waves, Utensils, Landmark, SlidersHorizontal, Users, Heart, Mountain, Clock, Phone } from "lucide-react"
import { getTravelerProfile, TravelerProfile, calculateMatchScore, AIRecommendedBadge, SocialProofBanner } from "@/components/ai-conversion-elements"
import { HomeHeader } from "@/components/home/HomeHeader"
import { HomeFooter } from "@/components/home/HomeFooter"
import { MobileCTABar } from "@/components/home/MobileCTABar"
import { CatalogPageShell } from "@/components/layouts/CatalogPageShell"
import SearchFiltersSidebar from "@/components/search/SearchFiltersSidebar"
import SearchFiltersDrawer from "@/components/search/SearchFiltersDrawer"
import type { SearchFilters } from "@/types/search"
import { fetchPlacesAutocomplete, fetchSuggest } from "@/services/search-api"
import type { MapMarker } from "@/types/search"

type PinType = "hotel" | "parque" | "restaurante" | "atracao" | "flash" | "leilao"

interface LocalPin {
  id: number
  name: string
  lat: number
  lng: number
  price: number
  type: PinType
  rating: number
  description: string
  amenities: string[]
  distance: number
  image?: string
  tags?: string[]
  category?: string
  reviewCount: number
  viewers?: number
}

const PINS: LocalPin[] = [
  { id: 1, name: "Resort Termas Paradise", lat: -17.7267, lng: -48.6250, price: 1199, type: "hotel", rating: 4.9, description: "Resort premium com piscinas termais naturais e spa completo.", amenities: ["Piscina Termal", "Spa", "Wi-Fi", "Café da manhã"], distance: 1.2, tags: ["família", "relaxamento", "casal"], category: "hotel", reviewCount: 342 },
  { id: 2, name: "Hot Park", lat: -17.7680, lng: -48.7340, price: 149.90, type: "parque", rating: 4.9, description: "Maior parque aquático de águas quentes do mundo.", amenities: ["Toboáguas", "Praia Artificial", "Restaurante"], distance: 3.5, tags: ["família", "aventura"], category: "parques", reviewCount: 1287 },
  { id: 3, name: "DiRoma Internacional", lat: -17.7350, lng: -48.6300, price: 899, type: "hotel", rating: 4.7, description: "Hotel com acesso direto às águas termais e lazer completo.", amenities: ["Piscina Aquecida", "Restaurante", "Kids Club"], distance: 0.8, tags: ["família", "casal"], category: "hotel", reviewCount: 567 },
  { id: 4, name: "Water Park", lat: -17.7410, lng: -48.6180, price: 119.90, type: "parque", rating: 4.7, description: "Diversão garantida com toboáguas radicais e piscinas de ondas.", amenities: ["Toboáguas", "Piscina de Ondas", "Lanchonete"], distance: 2.1, tags: ["família", "aventura"], category: "parques", reviewCount: 823 },
  { id: 5, name: "Lagoa Quente Flat", lat: -17.7520, lng: -48.6100, price: 449, type: "hotel", rating: 4.6, description: "Flat confortável próximo ao Hot Park com acesso fácil.", amenities: ["Cozinha", "Piscina", "Estacionamento"], distance: 2.8, tags: ["família", "econômico"], category: "hotel", reviewCount: 198 },
  { id: 6, name: "Náutico Praia Clube", lat: -17.7300, lng: -48.6400, price: 89.90, type: "parque", rating: 4.5, description: "Clube aquático com ambiente familiar e águas termais.", amenities: ["Piscinas", "Quadras", "Restaurante"], distance: 1.5, tags: ["família"], category: "parques", reviewCount: 456 },
  { id: 7, name: "Oferta Relâmpago - Resort Premium", lat: -17.7190, lng: -48.6350, price: 569, type: "flash", rating: 4.8, description: "Promoção exclusiva com até 50% de desconto no resort.", amenities: ["All-Inclusive", "Spa", "Transfer"], distance: 1.9, tags: ["casal", "relaxamento"], category: "hotel", reviewCount: 89 },
  { id: 8, name: "Leilão - Pacote VIP", lat: -17.7450, lng: -48.6450, price: 750, type: "leilao", rating: 4.9, description: "Pacote VIP com experiências exclusivas em Caldas Novas.", amenities: ["Tour Privado", "Jantar Especial", "Transfer VIP"], distance: 2.3, tags: ["casal", "premium"], category: "hotel", reviewCount: 34 },
  { id: 9, name: "Restaurante Sabor Goiano", lat: -17.7330, lng: -48.6220, price: 75, type: "restaurante", rating: 4.6, description: "Culinária típica goiana com ingredientes frescos da região.", amenities: ["Comida Regional", "Ar Condicionado", "Estacionamento"], distance: 0.5, tags: ["gastronomia"], category: "gastronomia", reviewCount: 287 },
  { id: 10, name: "Churrascaria Fogo de Chão", lat: -17.7280, lng: -48.6150, price: 129, type: "restaurante", rating: 4.8, description: "Rodízio premium de carnes nobres e saladas gourmet.", amenities: ["Rodízio", "Buffet", "Sobremesa"], distance: 1.0, tags: ["gastronomia", "premium"], category: "gastronomia", reviewCount: 412 },
  { id: 11, name: "Serra de Caldas", lat: -17.7600, lng: -48.6500, price: 0, type: "atracao", rating: 4.5, description: "Trilha ecológica com vista panorâmica de Caldas Novas.", amenities: ["Trilha", "Mirante", "Natureza"], distance: 5.2, tags: ["aventura", "natureza"], category: "natureza", reviewCount: 178 },
  { id: 12, name: "Jardim Japonês", lat: -17.7210, lng: -48.6280, price: 25, type: "atracao", rating: 4.3, description: "Espaço zen com lagos, pontes e jardins orientais.", amenities: ["Jardim", "Lago", "Fotos"], distance: 1.7, tags: ["relaxamento", "casal", "cultura"], category: "natureza", reviewCount: 134 },
  { id: 13, name: "Feira do Luar", lat: -17.7240, lng: -48.6380, price: 0, type: "atracao", rating: 4.4, description: "Feira noturna com artesanato, comidas típicas e shows ao vivo.", amenities: ["Artesanato", "Gastronomia", "Shows"], distance: 0.9, tags: ["cultura", "gastronomia", "família"], category: "natureza", reviewCount: 523 },
  { id: 14, name: "Restaurante Peixe na Brasa", lat: -17.7380, lng: -48.6330, price: 95, type: "restaurante", rating: 4.5, description: "Especializado em peixes de água doce e frutos do cerrado.", amenities: ["Peixe Fresco", "Vista Lago", "Música ao Vivo"], distance: 1.3, tags: ["gastronomia", "casal"], category: "gastronomia", reviewCount: 198 },
]

const CATEGORIES: { key: PinType | "all"; label: string; color: string; icon: typeof Hotel }[] = [
  { key: "all", label: "Todos", color: "#6B7280", icon: Filter },
  { key: "hotel", label: "Hotéis", color: "#2563EB", icon: Hotel },
  { key: "parque", label: "Parques", color: "#22C55E", icon: Waves },
  { key: "restaurante", label: "Restaurantes", color: "#EF4444", icon: Utensils },
  { key: "atracao", label: "Atrações", color: "#8B5CF6", icon: Landmark },
  { key: "flash", label: "Ofertas", color: "#F57C00", icon: Zap },
  { key: "leilao", label: "Leilões", color: "#7C3AED", icon: Gavel },
]

interface AIRoute {
  id: string
  name: string
  icon: typeof Users
  color: string
  description: string
  stops: number[]
  duration: string
  matchType: string
}

const AI_ROUTES: AIRoute[] = [
  { id: "familia", name: "Roteiro Família", icon: Users, color: "#2563EB", description: "Diversão para todas as idades com parques e restaurantes family-friendly.", stops: [2, 4, 6, 9, 5], duration: "2 dias", matchType: "familia" },
  { id: "aventura", name: "Roteiro Aventura", icon: Mountain, color: "#22C55E", description: "Trilhas, esportes aquáticos e experiências radicais.", stops: [11, 2, 4, 10, 13], duration: "2 dias", matchType: "aventura" },
  { id: "romantico", name: "Roteiro Romântico", icon: Heart, color: "#EC4899", description: "Experiências a dois: spa, jantar especial e paisagens.", stops: [1, 12, 14, 7, 3], duration: "3 dias", matchType: "romantico" },
]

const DISTANCE_OPTIONS = [
  { value: 0, label: "Todos" },
  { value: 1, label: "1 km" },
  { value: 2, label: "2 km" },
  { value: 3, label: "3 km" },
  { value: 5, label: "5 km" },
]

const PIN_TYPE_TO_CATEGORY: Record<PinType, string> = {
  hotel: "hotel",
  parque: "parques",
  restaurante: "gastronomia",
  atracao: "natureza",
  flash: "hotel",
  leilao: "hotel",
}

const CALDAS_DEFAULT_BOUNDS = {
  northLat: -17.700,
  southLat: -17.780,
  eastLng: -48.580,
  westLng: -48.760,
}

function parseUrlParams() {
  if (typeof window === "undefined") {
    return { q: "", category: "all" as PinType | "all", radiusKm: 0, bounds: CALDAS_DEFAULT_BOUNDS }
  }
  const sp = new URLSearchParams(window.location.search)
  const rawCat = sp.get("category") ?? "all"
  const cat = CATEGORIES.find(c => c.key === rawCat)?.key ?? "all"
  const northLat = parseFloat(sp.get("northLat") ?? "") || CALDAS_DEFAULT_BOUNDS.northLat
  const southLat = parseFloat(sp.get("southLat") ?? "") || CALDAS_DEFAULT_BOUNDS.southLat
  const eastLng = parseFloat(sp.get("eastLng") ?? "") || CALDAS_DEFAULT_BOUNDS.eastLng
  const westLng = parseFloat(sp.get("westLng") ?? "") || CALDAS_DEFAULT_BOUNDS.westLng
  return {
    q: sp.get("q") ?? "",
    category: cat as PinType | "all",
    radiusKm: parseFloat(sp.get("radiusKm") ?? "") || 0,
    bounds: { northLat, southLat, eastLng, westLng },
  }
}

export default function MapaCaldas() {
  const initial = parseUrlParams()
  const [selectedPin, setSelectedPin] = useState<LocalPin | null>(null)
  const [activeCategory, setActiveCategory] = useState<PinType | "all">(initial.category)
  const [maxDistance, setMaxDistance] = useState(initial.radiusKm)
  const [searchQuery, setSearchQuery] = useState(initial.q)
  const [mapBounds, setMapBounds] = useState(initial.bounds)
  const [showSearch, setShowSearch] = useState(!!initial.q)
  const [showFilters, setShowFilters] = useState(false)
  const [activeRoute, setActiveRoute] = useState<AIRoute | null>(null)
  const [profile, setProfile] = useState<TravelerProfile | null>(null)
  const [showRoutePanel, setShowRoutePanel] = useState(false)
  const [viewerCounts, setViewerCounts] = useState<Record<number, number>>({})
  const [routeSlideIdx, setRouteSlideIdx] = useState(0)
  const [routeSlideTransition, setRouteSlideTransition] = useState(true)
  const [routeSlidePaused, setRouteSlidePaused] = useState(false)
  const [placeSuggestions, setPlaceSuggestions] = useState<Array<{ placeId: string; description: string; mainText: string }>>([])
  const [showPlaceSuggestions, setShowPlaceSuggestions] = useState(false)
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false)
  const [sidebarFilters, setSidebarFilters] = useState<SearchFilters>({ type: "park" })

  const hasAnyFilter = !!(searchQuery.trim() || activeCategory !== "all" || maxDistance > 0)

  const panelFilters = useMemo(() => ({
    q: searchQuery || undefined,
    category: activeCategory !== "all" ? PIN_TYPE_TO_CATEGORY[activeCategory as PinType] : undefined,
    radiusKm: maxDistance > 0 ? maxDistance : undefined,
    lat: maxDistance > 0 ? -17.7340 : undefined,
    lng: maxDistance > 0 ? -48.6280 : undefined,
    northLat: mapBounds.northLat,
    southLat: mapBounds.southLat,
    eastLng: mapBounds.eastLng,
    westLng: mapBounds.westLng,
  }), [searchQuery, activeCategory, maxDistance, mapBounds])

  useEffect(() => {
    if (typeof window === "undefined") return
    const sp = new URLSearchParams()
    if (searchQuery) sp.set("q", searchQuery)
    if (activeCategory !== "all") sp.set("category", activeCategory)
    if (maxDistance > 0) sp.set("radiusKm", String(maxDistance))
    sp.set("northLat", String(mapBounds.northLat))
    sp.set("southLat", String(mapBounds.southLat))
    sp.set("eastLng", String(mapBounds.eastLng))
    sp.set("westLng", String(mapBounds.westLng))
    const qs = sp.toString()
    window.history.replaceState(null, "", qs ? `/mapa-caldas-novas?${qs}` : "/mapa-caldas-novas")
  }, [searchQuery, activeCategory, maxDistance, mapBounds])

  useEffect(() => {
    if (routeSlidePaused || AI_ROUTES.length <= 1) return
    const interval = setInterval(() => setRouteSlideIdx(p => p + 1), 3500)
    return () => clearInterval(interval)
  }, [routeSlidePaused])

  useEffect(() => {
    if (routeSlideIdx > 0 && routeSlideIdx >= AI_ROUTES.length) {
      const t = setTimeout(() => { setRouteSlideTransition(false); setRouteSlideIdx(0) }, 420)
      return () => clearTimeout(t)
    }
  }, [routeSlideIdx])

  useEffect(() => {
    if (!routeSlideTransition) {
      const t = setTimeout(() => setRouteSlideTransition(true), 50)
      return () => clearTimeout(t)
    }
  }, [routeSlideTransition])

  useEffect(() => {
    const p = getTravelerProfile()
    setProfile(p)
  }, [])

  useEffect(() => {
    const counts: Record<number, number> = {}
    PINS.forEach(pin => { counts[pin.id] = Math.floor(Math.random() * 20) + 3 })
    setViewerCounts(counts)
    const interval = setInterval(() => {
      setViewerCounts(prev => {
        const next = { ...prev }
        const randomId = PINS[Math.floor(Math.random() * PINS.length)].id
        next[randomId] = Math.max(2, (next[randomId] || 5) + Math.floor(Math.random() * 5) - 2)
        return next
      })
    }, 8000)
    return () => clearInterval(interval)
  }, [])

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const handleSearchChange = (val: string) => {
    setSearchQuery(val)
    setShowPlaceSuggestions(false)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (val.trim().length >= 2) {
      debounceRef.current = setTimeout(async () => {
        const viewportLat = (mapBounds.northLat + mapBounds.southLat) / 2
        const viewportLng = (mapBounds.eastLng + mapBounds.westLng) / 2
        let suggestions: Array<{ placeId: string; description: string; mainText: string }> = []

        try {
          const placesResult = await fetchPlacesAutocomplete(val, viewportLat, viewportLng)
          suggestions = placesResult.suggestions
        } catch {}

        if (suggestions.length === 0) {
          try {
            const internalResult = await fetchSuggest(val)
            const all = [
              ...internalResult.names,
              ...internalResult.enterprises,
              ...internalResult.destinations,
              ...internalResult.featured,
            ]
            suggestions = all.slice(0, 5).map(item => ({
              placeId: String(item.id),
              description: item.city ? `${item.name}, ${item.city}` : item.name,
              mainText: item.name,
            }))
          } catch {}
        }

        if (suggestions.length > 0) {
          setPlaceSuggestions(suggestions)
          setShowPlaceSuggestions(true)
        }
      }, 400)
    }
  }

  const handlePlaceSelect = (suggestion: { placeId: string; description: string; mainText: string }) => {
    setSearchQuery(suggestion.mainText || suggestion.description)
    setShowPlaceSuggestions(false)
  }

  const handleBoundsChange = useCallback((bounds: { northLat: number; southLat: number; eastLng: number; westLng: number }) => {
    setMapBounds(bounds)
  }, [])

  const handleMarkerClick = useCallback((marker: MapMarker) => {
    const byId = PINS.find(p => String(p.id) === String(marker.id))
    const byName = PINS.find(p => p.name.toLowerCase() === marker.name.toLowerCase())
    const pin = byId ?? byName
    if (pin) {
      setSelectedPin(pin)
    } else {
      setSelectedPin({
        id: typeof marker.id === "number" ? marker.id : 0,
        name: marker.name,
        lat: marker.lat,
        lng: marker.lng,
        price: marker.priceFrom,
        type: (marker.type === "park" ? "parque" : marker.type === "hotel" ? "hotel" : marker.type === "attraction" ? "atracao" : "hotel") as PinType,
        rating: marker.rating,
        description: "",
        amenities: [],
        distance: 0,
        reviewCount: 0,
      })
    }
  }, [])

  const routeStops = useMemo(() => {
    if (!activeRoute) return undefined
    return activeRoute.stops
      .map((stopId, i) => {
        const pin = PINS.find(p => p.id === stopId)
        if (!pin) return null
        return { lat: pin.lat, lng: pin.lng, name: pin.name, index: i, color: activeRoute.color }
      })
      .filter(Boolean) as Array<{ lat: number; lng: number; name: string; index: number; color: string }>
  }, [activeRoute])

  const handleClearFilters = () => {
    setSearchQuery("")
    setActiveCategory("all")
    setMaxDistance(0)
    setActiveRoute(null)
    setShowRoutePanel(false)
    setPlaceSuggestions([])
    setShowPlaceSuggestions(false)
    setMapBounds(CALDAS_DEFAULT_BOUNDS)
  }

  const formatPrice = (p: number) =>
    p === 0 ? "Gratuito" : new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(p)

  const getColor = (type: PinType) => CATEGORIES.find(c => c.key === type)?.color || "#6B7280"

  const getIcon = (type: PinType) => {
    switch (type) {
      case "hotel": return <Hotel style={{ width: 12, height: 12, color: "#fff" }} />
      case "parque": return <Waves style={{ width: 12, height: 12, color: "#fff" }} />
      case "flash": return <Zap style={{ width: 12, height: 12, color: "#fff" }} />
      case "leilao": return <Gavel style={{ width: 12, height: 12, color: "#fff" }} />
      case "restaurante": return <Utensils style={{ width: 12, height: 12, color: "#fff" }} />
      case "atracao": return <Landmark style={{ width: 12, height: 12, color: "#fff" }} />
      default: return <MapPin style={{ width: 12, height: 12, color: "#fff" }} />
    }
  }

  const profileHighlightIds = useMemo(() => {
    if (!profile) return new Set<number>()
    const ids = new Set<number>()
    PINS.forEach(pin => {
      const score = calculateMatchScore(profile, { category: pin.category, price: pin.price, tags: pin.tags })
      if (score >= 80) ids.add(pin.id)
    })
    return ids
  }, [profile])

  const suggestedRoute = useMemo(() => {
    if (!profile) return null
    return AI_ROUTES.find(r => r.matchType === profile.tripType) || AI_ROUTES[0]
  }, [profile])

  const filteredPins = useMemo(() => {
    return PINS.filter(pin => {
      if (activeCategory !== "all" && pin.type !== activeCategory) return false
      if (maxDistance > 0 && pin.distance > maxDistance) return false
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        if (!pin.name.toLowerCase().includes(q) && !pin.description.toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [activeCategory, maxDistance, searchQuery])

  const nearbyPins = useMemo(() => [...PINS].sort((a, b) => a.distance - b.distance).slice(0, 5), [])

  useEffect(() => {
    if (sidebarFilters.q !== undefined) setSearchQuery(sidebarFilters.q)
  }, [sidebarFilters.q])

  useEffect(() => {
    if (sidebarFilters.category !== undefined) {
      const pinType = Object.entries(PIN_TYPE_TO_CATEGORY).find(
        ([, cat]) => cat === sidebarFilters.category
      )?.[0] as PinType | undefined
      setActiveCategory(pinType || "all")
    }
  }, [sidebarFilters.category])

  const searchBarSlot = (
    <div style={{
      display: "flex", gap: 8, padding: "10px 16px", overflowX: "auto",
      background: "#fff", borderBottom: "1px solid #E5E7EB",
      position: "sticky", top: 64, zIndex: 30,
    }}>
      <button
        className="rsv-catalog-mobile-only"
        data-testid="button-open-filters"
        onClick={() => setFilterDrawerOpen(true)}
        style={{
          display: "flex", alignItems: "center", gap: 5, flexShrink: 0,
          background: "#EFF6FF", border: "1.5px solid #BFDBFE",
          borderRadius: 999, padding: "6px 12px", color: "#2563EB",
          fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap",
        }}
      >
        ⚙ Filtros
      </button>
      {CATEGORIES.map((cat) => {
        const isActive = activeCategory === cat.key && !activeRoute
        const Icon = cat.icon
        return (
          <button
            key={cat.key}
            data-testid={`button-category-${cat.key}`}
            onClick={() => { setActiveCategory(cat.key as PinType | "all"); setActiveRoute(null) }}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "6px 14px", borderRadius: 20,
              border: isActive ? `2px solid ${cat.color}` : "1px solid #E5E7EB",
              background: isActive ? `${cat.color}15` : "#fff",
              cursor: "pointer", whiteSpace: "nowrap",
              fontSize: 13, fontWeight: isActive ? 700 : 500,
              color: isActive ? cat.color : "#6B7280",
              transition: "all 0.2s",
            }}
          >
            <Icon style={{ width: 14, height: 14 }} />
            {cat.label}
          </button>
        )
      })}
    </div>
  )

  return (
    <CatalogPageShell
      header={<HomeHeader />}
      searchBar={searchBarSlot}
      footer={<><HomeFooter /><MobileCTABar /></>}
      sidebar={
        <SearchFiltersSidebar
          filters={sidebarFilters}
          onFiltersChange={(f) => setSidebarFilters((prev) => ({ ...prev, ...f }))}
          onClearAll={() => setSidebarFilters({ type: "park" })}
        />
      }
      mobileDrawer={
        <SearchFiltersDrawer
          open={filterDrawerOpen}
          filters={sidebarFilters}
          onClose={() => setFilterDrawerOpen(false)}
          onFiltersChange={(f) => setSidebarFilters((prev) => ({ ...prev, ...f }))}
          onClearAll={() => { setSidebarFilters({ type: "park" }); setFilterDrawerOpen(false) }}
        />
      }
    >
      <div data-testid="page-mapa" style={{ height: 64 }} />

      <div style={{
        background: "linear-gradient(135deg, #1E3A5F 0%, #1565C0 60%, #0D47A1 100%)",
        padding: "28px 20px 24px", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 130, height: 130, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
        <div style={{ position: "absolute", bottom: -30, left: -30, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.03)" }} />

        <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "rgba(245,124,0,0.2)", border: "1px solid rgba(245,124,0,0.4)",
            borderRadius: 20, padding: "5px 14px", marginBottom: 12,
          }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#F57C00", animation: "pulse 2s infinite" }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: "#F57C00", letterSpacing: 0.5 }}>MAPA INTERATIVO</span>
          </div>

          <h1 style={{ color: "#fff", fontSize: 21, fontWeight: 900, margin: "0 0 8px", lineHeight: 1.25 }}>
            Explore Caldas Novas no Mapa Interativo
          </h1>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, margin: "0 0 6px", lineHeight: 1.5 }}>
            Toque nos pins para ver detalhes, rotas e reservar
          </p>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 12, margin: "0 0 18px" }}>
            Hotéis, parques, restaurantes e muito mais em um só lugar
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", marginBottom: 18 }}>
            {CATEGORIES.filter(c => c.key !== "all").map(cat => {
              const Icon = cat.icon
              return (
                <div key={cat.key} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: 6, background: `${cat.color}25`,
                    border: `1px solid ${cat.color}60`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Icon style={{ width: 11, height: 11, color: cat.color }} />
                  </div>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.85)", fontWeight: 500 }}>{cat.label}</span>
                </div>
              )
            })}
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
            <button
              data-testid="button-toggle-search"
              onClick={() => setShowSearch(!showSearch)}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "8px 16px", borderRadius: 20,
                background: showSearch ? "#F57C00" : "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.25)",
                color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              <Search style={{ width: 14, height: 14 }} />
              Buscar
            </button>
            <button
              data-testid="button-toggle-filters"
              onClick={() => setShowFilters(!showFilters)}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "8px 16px", borderRadius: 20,
                background: showFilters ? "#F57C00" : "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.25)",
                color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              <SlidersHorizontal style={{ width: 14, height: 14 }} />
              Filtros
              {hasAnyFilter && (
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#F57C00", border: "1.5px solid #fff", flexShrink: 0 }} />
              )}
            </button>
            {hasAnyFilter && (
              <button
                data-testid="button-clear-map-filters"
                onClick={handleClearFilters}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "8px 16px", borderRadius: 20,
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.25)",
                  color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer",
                }}
              >
                <X style={{ width: 14, height: 14 }} />
                Limpar
              </button>
            )}
          </div>
        </div>
      </div>

      {showSearch && (
        <div style={{ padding: "8px 16px", background: "#fff", borderBottom: "1px solid #E5E7EB", position: "relative", zIndex: 20 }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "#F3F4F6", borderRadius: 10, padding: "8px 12px",
          }}>
            <Search style={{ width: 16, height: 16, color: "#9CA3AF" }} />
            <input
              data-testid="input-search"
              type="text"
              placeholder="Buscar hotéis, parques, lugares em Caldas Novas..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              onFocus={() => { if (placeSuggestions.length > 0) setShowPlaceSuggestions(true) }}
              onBlur={() => setTimeout(() => setShowPlaceSuggestions(false), 150)}
              style={{
                flex: 1, border: "none", background: "transparent",
                fontSize: 14, color: "#1F2937", outline: "none",
              }}
            />
            {searchQuery && (
              <button
                data-testid="button-clear-search"
                onClick={() => { setSearchQuery(""); setPlaceSuggestions([]); setShowPlaceSuggestions(false) }}
                style={{ border: "none", background: "transparent", cursor: "pointer", display: "flex" }}
              >
                <X style={{ width: 16, height: 16, color: "#9CA3AF" }} />
              </button>
            )}
          </div>
          {showPlaceSuggestions && placeSuggestions.length > 0 && (
            <div style={{
              position: "absolute", top: "100%", left: 16, right: 16,
              background: "#fff", borderRadius: 10, border: "1px solid #E5E7EB",
              boxShadow: "0 4px 16px rgba(0,0,0,0.1)", zIndex: 30,
            }}>
              {placeSuggestions.map((s) => (
                <button
                  key={s.placeId}
                  data-testid={`place-suggestion-${s.placeId}`}
                  onMouseDown={() => handlePlaceSelect(s)}
                  style={{
                    width: "100%", padding: "10px 14px", border: "none",
                    background: "transparent", textAlign: "left", cursor: "pointer",
                    borderBottom: "1px solid #F3F4F6",
                    display: "flex", alignItems: "center", gap: 8,
                  }}
                >
                  <MapPin style={{ width: 14, height: 14, color: "#2563EB", flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#1F2937" }}>{s.mainText}</div>
                    <div style={{ fontSize: 11, color: "#9CA3AF" }}>{s.description}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {showFilters && (
        <div style={{ padding: "12px 16px", background: "#fff", borderBottom: "1px solid #E5E7EB" }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 6, display: "block" }}>
            Raio de distância
          </span>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {DISTANCE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                data-testid={`button-distance-${opt.value}`}
                onClick={() => setMaxDistance(opt.value)}
                style={{
                  padding: "5px 12px", borderRadius: 8,
                  border: maxDistance === opt.value ? "2px solid #2563EB" : "1px solid #E5E7EB",
                  background: maxDistance === opt.value ? "#EFF6FF" : "#fff",
                  cursor: "pointer", fontSize: 12, fontWeight: maxDistance === opt.value ? 700 : 500,
                  color: maxDistance === opt.value ? "#2563EB" : "#6B7280",
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {profile && suggestedRoute && !activeRoute && (
        <div
          data-testid="banner-ai-route-suggestion"
          style={{
            margin: "12px 16px 0", padding: "12px 16px", borderRadius: 12,
            background: "linear-gradient(135deg, #EFF6FF, #FDF4FF)",
            border: "1px solid #C4B5FD",
            display: "flex", alignItems: "center", gap: 10, cursor: "pointer",
          }}
          onClick={() => { setActiveRoute(suggestedRoute); setShowRoutePanel(true) }}
        >
          <Sparkles style={{ width: 20, height: 20, color: "#7C3AED", flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#7C3AED" }}>
              IA recomenda: {suggestedRoute.name}
            </span>
            <p style={{ fontSize: 11, color: "#6B7280", margin: "2px 0 0" }}>
              {suggestedRoute.description}
            </p>
          </div>
          <ChevronRight style={{ width: 16, height: 16, color: "#7C3AED", flexShrink: 0 }} />
        </div>
      )}

      <div style={{ position: "relative", height: "55vh", background: "#E8F0FE", overflow: "hidden" }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(135deg, #E8F0FE 0%, #D1E3FC 50%, #E8F0FE 100%)",
        }}>
          <div style={{
            position: "absolute", top: "15%", left: "10%", width: "80%", height: "70%",
            border: "1px solid rgba(37,99,235,0.15)", borderRadius: 8,
            background: "rgba(37,99,235,0.03)",
          }}>
            <span style={{
              position: "absolute", bottom: -20, right: 10,
              fontSize: 11, color: "#9CA3AF", fontStyle: "italic",
            }}>Caldas Novas, GO</span>
          </div>

          {activeRoute && (
            <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 0, pointerEvents: "none" }}>
              {activeRoute.stops.map((stopId, i) => {
                if (i === 0) return null
                const prevPin = PINS.find(p => p.id === activeRoute.stops[i - 1])
                const currPin = PINS.find(p => p.id === stopId)
                if (!prevPin || !currPin) return null
                const getPos = (pin: LocalPin) => {
                  const x = ((pin.lng + 48.75) / 0.2) * 100
                  const y = ((pin.lat + 17.7) / 0.1) * 100
                  return {
                    x: Math.max(10, Math.min(90, 50 + (x - 50) * 0.8)),
                    y: Math.max(10, Math.min(90, 50 + (y - 50) * 0.8)),
                  }
                }
                const p1 = getPos(prevPin)
                const p2 = getPos(currPin)
                return (
                  <line
                    key={`route-${i}`}
                    x1={`${p1.x}%`} y1={`${p1.y}%`}
                    x2={`${p2.x}%`} y2={`${p2.y}%`}
                    stroke={activeRoute.color}
                    strokeWidth="3"
                    strokeDasharray="8 4"
                    opacity={0.6}
                  />
                )
              })}
            </svg>
          )}
        </div>

        {filteredPins.map((pin) => {
          const x = ((pin.lng + 48.75) / 0.2) * 100
          const y = ((pin.lat + 17.7) / 0.1) * 100
          const clampX = Math.max(10, Math.min(90, 50 + (x - 50) * 0.8))
          const clampY = Math.max(10, Math.min(90, 50 + (y - 50) * 0.8))
          const isHighlighted = profileHighlightIds.has(pin.id)
          const isRouteStop = activeRoute?.stops.includes(pin.id)
          const routeIndex = activeRoute ? activeRoute.stops.indexOf(pin.id) + 1 : 0

          return (
            <button
              key={pin.id}
              data-testid={`pin-${pin.id}`}
              onClick={() => setSelectedPin(pin)}
              style={{
                position: "absolute", left: `${clampX}%`, top: `${clampY}%`,
                transform: "translate(-50%, -100%)", border: "none", cursor: "pointer",
                background: "transparent", zIndex: selectedPin?.id === pin.id ? 10 : isHighlighted ? 5 : 1,
              }}
            >
              <div style={{
                background: getColor(pin.type), color: "#fff",
                padding: "4px 10px", borderRadius: 8,
                fontSize: 12, fontWeight: 700, whiteSpace: "nowrap",
                boxShadow: isHighlighted
                  ? `0 0 0 3px ${getColor(pin.type)}40, 0 2px 8px rgba(0,0,0,0.2)`
                  : "0 2px 8px rgba(0,0,0,0.2)",
                display: "flex", alignItems: "center", gap: 4,
                transform: selectedPin?.id === pin.id ? "scale(1.15)" : "scale(1)",
                transition: "transform 0.2s",
                position: "relative",
              }}>
                {isRouteStop && (
                  <span style={{
                    position: "absolute", top: -8, left: -8,
                    width: 18, height: 18, borderRadius: "50%",
                    background: activeRoute!.color, color: "#fff",
                    fontSize: 10, fontWeight: 800,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    border: "2px solid #fff",
                  }}>{routeIndex}</span>
                )}
                {getIcon(pin.type)}
                {formatPrice(pin.price)}
              </div>
              <div style={{
                width: 0, height: 0, margin: "0 auto",
                borderLeft: "6px solid transparent", borderRight: "6px solid transparent",
                borderTop: `6px solid ${getColor(pin.type)}`,
              }} />
              {isHighlighted && !activeRoute && (
                <div style={{
                  position: "absolute", top: -10, right: -10,
                  width: 16, height: 16, borderRadius: "50%",
                  background: "#F57C00", border: "2px solid #fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Sparkles style={{ width: 8, height: 8, color: "#fff" }} />
                </div>
              )}
            </button>
          )
        })}

        <div style={{
          position: "absolute", bottom: 12, left: 12, right: 12,
          display: "flex", justifyContent: "space-between", alignItems: "flex-end",
        }}>
          <div style={{
            background: "rgba(255,255,255,0.95)", borderRadius: 10, padding: "8px 12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)", display: "flex", alignItems: "center", gap: 6,
          }}>
            <MapPin style={{ width: 12, height: 12, color: "#2563EB" }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>{filteredPins.length} pontos</span>
          </div>
        </div>
      </div>

      {activeRoute && showRoutePanel && (
        <div data-testid="panel-route-detail" style={{
          margin: "12px 16px", padding: 16, borderRadius: 14,
          background: "#fff", border: `1px solid ${activeRoute.color}30`,
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 12 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1F2937", margin: 0 }}>{activeRoute.name}</h3>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Clock style={{ width: 12, height: 12, color: "#9CA3AF" }} />
              <span style={{ fontSize: 12, color: "#6B7280" }}>{activeRoute.duration}</span>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {activeRoute.stops.map((stopId, i) => {
              const pin = PINS.find(p => p.id === stopId)
              if (!pin) return null
              return (
                <div
                  key={stopId}
                  data-testid={`route-stop-${i}`}
                  onClick={() => setSelectedPin(pin)}
                  style={{
                    display: "flex", alignItems: "center", gap: 10, cursor: "pointer",
                    padding: "8px 10px", borderRadius: 10,
                    background: selectedPin?.id === pin.id ? "#EFF6FF" : "transparent",
                    transition: "background 0.2s",
                  }}
                >
                  <div style={{ width: 24, height: 24, borderRadius: "50%", background: activeRoute.color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, flexShrink: 0 }}>{i + 1}</div>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#1F2937" }}>{pin.name}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 11, color: "#6B7280" }}>{pin.distance} km</span>
                      <Star style={{ width: 10, height: 10, fill: "#FBBF24", color: "#FBBF24" }} />
                      <span style={{ fontSize: 11, color: "#6B7280" }}>{pin.rating}</span>
                    </div>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#22C55E" }}>{formatPrice(pin.price)}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div style={{ padding: "0 16px 8px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Route style={{ width: 18, height: 18, color: "#2563EB" }} />
            <h2 data-testid="text-routes-title" style={{ fontSize: 16, fontWeight: 700, color: "#1F2937", margin: 0 }}>Rotas Sugeridas pela IA</h2>
          </div>
          {activeRoute && (
            <button
              data-testid="button-clear-route"
              onClick={() => { setActiveRoute(null); setShowRoutePanel(false) }}
              style={{ padding: "4px 12px", borderRadius: 8, border: "1px solid #E5E7EB", background: "#fff", cursor: "pointer", fontSize: 12, color: "#6B7280" }}
            >
              Limpar rota
            </button>
          )}
        </div>

        <div
          style={{ overflow: "hidden" }}
          onMouseEnter={() => setRouteSlidePaused(true)}
          onMouseLeave={() => setRouteSlidePaused(false)}
        >
          <div style={{
            display: "flex", gap: 10,
            transform: `translateX(-${routeSlideIdx * 190}px)`,
            transition: routeSlideTransition ? "transform 0.45s ease" : "none",
          }}>
            {[...AI_ROUTES, AI_ROUTES[0]].map((route, slidePos) => {
              const isActive = activeRoute?.id === route.id
              const Icon = route.icon
              const isMatch = profile?.tripType === route.matchType
              return (
                <button
                  key={slidePos}
                  data-testid={`button-route-${route.id}`}
                  onClick={() => { setActiveRoute(isActive ? null : route); setShowRoutePanel(!isActive) }}
                  style={{
                    minWidth: 180, padding: "14px 16px", borderRadius: 14,
                    border: isActive ? `2px solid ${route.color}` : "1px solid #E5E7EB",
                    background: isActive ? `${route.color}10` : "#fff",
                    cursor: "pointer", textAlign: "left", flexShrink: 0,
                    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                    transition: "all 0.2s", position: "relative",
                  }}
                >
                  {isMatch && (
                    <div style={{ position: "absolute", top: 8, right: 8, display: "flex", alignItems: "center", gap: 3, background: "#F57C0020", borderRadius: 6, padding: "2px 6px" }}>
                      <Sparkles style={{ width: 10, height: 10, color: "#F57C00" }} />
                      <span style={{ fontSize: 9, fontWeight: 700, color: "#F57C00" }}>Seu Perfil</span>
                    </div>
                  )}
                  <div style={{ width: 36, height: 36, borderRadius: 10, marginBottom: 8, background: `${route.color}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon style={{ width: 18, height: 18, color: route.color }} />
                  </div>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1F2937", margin: "0 0 4px" }}>{route.name}</h3>
                  <p style={{ fontSize: 11, color: "#6B7280", margin: "0 0 6px", lineHeight: 1.3 }}>{route.description}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: route.color }}>{route.stops.length} paradas</span>
                    <span style={{ fontSize: 11, color: "#9CA3AF" }}>{route.duration}</span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <SocialProofBanner viewers={undefined} pageName="o mapa" />

      <div style={{ padding: "16px 16px 8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <Navigation style={{ width: 16, height: 16, color: "#2563EB" }} />
          <h2 data-testid="text-nearby-title" style={{ fontSize: 16, fontWeight: 700, color: "#1F2937", margin: 0 }}>Perto de Você</h2>
        </div>
        <div className="rsv-subpage-grid">
          {nearbyPins.map((pin) => {
            const matchScore = calculateMatchScore(profile, { category: pin.category, price: pin.price, tags: pin.tags })
            return (
              <div
                key={pin.id}
                data-testid={`card-nearby-${pin.id}`}
                onClick={() => setSelectedPin(pin)}
                style={{
                  background: "#fff", borderRadius: 12, padding: 12, marginBottom: 8,
                  boxShadow: "0 1px 4px rgba(0,0,0,0.06)", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 12,
                  border: profileHighlightIds.has(pin.id) ? "1px solid #C4B5FD" : "1px solid transparent",
                  transition: "all 0.2s",
                }}
              >
                <div style={{ width: 56, height: 56, borderRadius: 12, flexShrink: 0, background: `linear-gradient(135deg, ${getColor(pin.type)}90, ${getColor(pin.type)})`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                  <MapPin style={{ width: 18, height: 18, color: "rgba(255,255,255,0.7)" }} />
                  {profileHighlightIds.has(pin.id) && (
                    <div style={{ position: "absolute", top: -4, right: -4, width: 14, height: 14, borderRadius: "50%", background: "#F57C00", border: "2px solid #fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Sparkles style={{ width: 7, height: 7, color: "#fff" }} />
                    </div>
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ fontSize: 13, fontWeight: 700, color: "#1F2937", margin: "0 0 2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{pin.name}</h3>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                      <Star style={{ width: 10, height: 10, fill: "#FBBF24", color: "#FBBF24" }} />
                      <span style={{ fontSize: 11, color: "#6B7280" }}>{pin.rating}</span>
                    </div>
                    <span style={{ fontSize: 11, color: "#9CA3AF" }}>{pin.distance} km</span>
                    {profile && <AIRecommendedBadge matchPercent={matchScore} />}
                  </div>
                  {viewerCounts[pin.id] && (
                    <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                      <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#22C55E" }} />
                      <span style={{ fontSize: 10, color: "#9CA3AF" }}>{viewerCounts[pin.id]} vendo agora</span>
                    </div>
                  )}
                </div>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#22C55E", flexShrink: 0 }}>{formatPrice(pin.price)}</span>
              </div>
            )
          })}
        </div>
      </div>

      {selectedPin && (
        <div
          data-testid="panel-pin-detail"
          style={{
            position: "fixed", bottom: 0, left: 0, right: 0,
            maxWidth: 480, margin: "0 auto",
            background: "#fff", borderRadius: "16px 16px 0 0",
            boxShadow: "0 -4px 20px rgba(0,0,0,0.15)", padding: 20, zIndex: 50,
            animation: "slideInFromBottom 0.3s ease-out",
          }}
        >
          <button
            data-testid="button-close-detail"
            onClick={() => setSelectedPin(null)}
            style={{ position: "absolute", top: 12, right: 12, width: 32, height: 32, borderRadius: "50%", border: "none", background: "#F3F4F6", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <X style={{ width: 16, height: 16, color: "#6B7280" }} />
          </button>

          <div style={{ display: "flex", gap: 14 }}>
            <div style={{ width: 90, height: 70, borderRadius: 12, overflow: "hidden", flexShrink: 0, background: `linear-gradient(135deg, ${getColor(selectedPin.type)}80, ${getColor(selectedPin.type)})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <MapPin style={{ width: 24, height: 24, color: "rgba(255,255,255,0.4)" }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1F2937", margin: "0 0 4px" }}>{selectedPin.name}</h3>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                  <Star style={{ width: 12, height: 12, fill: "#FBBF24", color: "#FBBF24" }} />
                  <span style={{ fontSize: 12, fontWeight: 600 }}>{selectedPin.rating}</span>
                </div>
                <span style={{ fontSize: 11, color: "#9CA3AF" }}>({selectedPin.reviewCount} avaliações)</span>
                <span style={{ fontSize: 11, color: "#9CA3AF" }}>{selectedPin.distance} km</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#22C55E" }}>{formatPrice(selectedPin.price)}</div>
                {profile && (
                  <AIRecommendedBadge matchPercent={calculateMatchScore(profile, { category: selectedPin.category, price: selectedPin.price, tags: selectedPin.tags })} />
                )}
              </div>
            </div>
          </div>

          <p style={{ fontSize: 13, color: "#6B7280", margin: "12px 0", lineHeight: 1.5 }}>{selectedPin.description}</p>

          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
            {selectedPin.amenities.map((amenity) => (
              <span key={amenity} style={{ fontSize: 11, color: "#374151", background: "#F3F4F6", padding: "4px 10px", borderRadius: 6, fontWeight: 500 }}>
                {amenity}
              </span>
            ))}
          </div>

          {viewerCounts[selectedPin.id] && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12, padding: "6px 10px", borderRadius: 8, background: "#FFFBEB", border: "1px solid #FDE68A" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22C55E", animation: "pulse 2s infinite" }} />
              <span style={{ fontSize: 11, fontWeight: 600, color: "#92400E" }}>{viewerCounts[selectedPin.id]} pessoas vendo agora</span>
            </div>
          )}

          <div style={{ display: "flex", gap: 8 }}>
            <a
              data-testid="button-reserve"
              href={`https://wa.me/5564993197555?text=Olá! Tenho interesse em ${selectedPin.name}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ flex: 1, padding: "12px 0", borderRadius: 10, border: "none", background: "#2563EB", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", textAlign: "center", textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
            >
              <Phone style={{ width: 14, height: 14 }} />
              Reservar
            </a>
            <button
              data-testid="button-view-on-map"
              onClick={() => { setSelectedPin(null); setTimeout(() => setSelectedPin(selectedPin), 100) }}
              style={{ padding: "12px 16px", borderRadius: 10, border: "1px solid #E5E7EB", background: "#fff", fontSize: 14, fontWeight: 600, color: "#374151", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
            >
              <MapPin style={{ width: 14, height: 14 }} />
              No Mapa
            </button>
          </div>
        </div>
      )}
    </CatalogPageShell>
  )
}
