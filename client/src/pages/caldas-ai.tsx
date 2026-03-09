import { useState, useEffect, useMemo, useRef } from "react"
import { Brain, ArrowLeft, Search, MapPin, Star, Heart, Sparkles, ChevronRight, Eye, Compass, Waves, TreePine, Utensils, Users, Briefcase, GraduationCap, Stethoscope, Palette, Target, TrendingUp, Zap, Check, ThumbsUp, Award, Coffee, Flame, Shield, ChevronDown, MessageCircle } from "lucide-react"
import { Link } from "wouter"
import ChatAgent from "@/components/chat-agent"
import HotelDetailPanel, { type HotelDetailData } from "@/components/hotel-detail-panel"
import { getTravelerProfile, saveTravelerProfile, TravelerProfileModal, calculateMatchScore, type TravelerProfile, BehaviorTracker } from "@/components/ai-conversion-elements"

const CATEGORIES = [
  { id: "todos", label: "Todos" },
  { id: "parques", label: "Parques" },
  { id: "hoteis", label: "Hoteis" },
  { id: "resorts", label: "Resorts" },
  { id: "passeios", label: "Passeios" },
]

const DISCOVERY_CATEGORIES = [
  { id: "parques", label: "Parques Aquaticos", icon: Waves, color: "#2563EB", bg: "#EFF6FF", count: 4 },
  { id: "hoteis", label: "Hoteis & Pousadas", icon: Briefcase, color: "#7C3AED", bg: "#F5F3FF", count: 6 },
  { id: "resorts", label: "Resorts Premium", icon: Star, color: "#F57C00", bg: "#FFF7ED", count: 3 },
  { id: "passeios", label: "Passeios & Tours", icon: Compass, color: "#059669", bg: "#ECFDF5", count: 5 },
  { id: "gastronomia", label: "Gastronomia", icon: Utensils, color: "#DC2626", bg: "#FEF2F2", count: 8 },
  { id: "natureza", label: "Natureza & Trilhas", icon: TreePine, color: "#16A34A", bg: "#F0FDF4", count: 4 },
]

const PROFESSION_SUGGESTIONS: Record<string, string[]> = {
  medico: ["Spa & bem-estar para relaxar apos plantoes", "Resorts com massagem terapeutica", "Hoteis tranquilos e exclusivos", "Aguas termais com propriedades medicinais"],
  professor: ["Parques para curtir as ferias escolares", "Pacotes familia com desconto educador", "Passeios culturais em Caldas Novas", "Programas educativos para criancas"],
  empresario: ["Resorts premium all-inclusive", "Hoteis com espaco coworking", "Experiencias VIP exclusivas", "Jantares executivos com vista panoramica"],
  autonomo: ["Melhores ofertas custo-beneficio", "Pacotes flexiveis sem fidelidade", "Ingressos com desconto especial", "Hospedagens com cancelamento gratis"],
  aposentado: ["Passeios tranquilos e relaxantes", "Hoteis com acessibilidade completa", "Aguas termais terapeuticas", "Roteiros de baixo impacto fisico"],
}

const BUDGET_SUGGESTIONS: Record<string, string[]> = {
  economico: ["Melhores opcoes ate R$ 150", "Parques com entrada gratuita", "Hospedagens com cafe da manha incluso"],
  moderado: ["Pacotes com otimo custo-beneficio", "Resorts com meia pensao", "Combos parque + hotel com desconto"],
  confortavel: ["Resorts com all-inclusive", "Experiencias premium exclusivas", "Suites com vista privilegiada"],
  premium: ["Experiencias VIP personalizadas", "Resorts 5 estrelas com spa", "Transfer privativo e concierge"],
}

const INTEREST_SUGGESTIONS: Record<string, string[]> = {
  parques: ["Melhores toboaguas de Caldas Novas", "Parques com piscina de ondas"],
  spa: ["Spas com aguas termais naturais", "Tratamentos relaxantes para casais"],
  natureza: ["Trilhas ecologicas na regiao", "Cachoeiras proximas a Caldas Novas"],
  gastronomia: ["Restaurantes mais bem avaliados", "Culinaria goiana tipica"],
  cultura: ["Museus e pontos historicos", "Artesanato local de Caldas Novas"],
  esportes: ["Esportes aquaticos radicais", "Academias e centros fitness"],
}

const DESTINATIONS = [
  {
    id: 1,
    name: "Hot Park",
    category: "parques",
    location: "Rio Quente",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hot-park-Jm2Xy9K8RfqL3vN5wT1pA6sD4hB7eC.jpg",
    rating: 4.9,
    reviews: 2341,
    price: 149.90,
    tag: "Mais Popular",
    description: "O maior parque aquatico de aguas quentes naturais do mundo. Diversao garantida para toda a familia.",
    tags: ["familia", "aventura", "parques"],
    matchReasons: ["Parque mais visitado do Brasil", "Ideal para todas as idades", "Aguas termais naturais"],
    professionMatch: { medico: "Relaxe nas aguas termais terapeuticas", professor: "Perfeito para ferias em familia", empresario: "Experiencia VIP disponivel", autonomo: "Melhor preco por diversao", aposentado: "Aguas medicinais naturais" },
  },
  {
    id: 2,
    name: "DiRoma Acqua Park",
    category: "parques",
    location: "Caldas Novas",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/diroma-Kp4Mn7Hs8Qf2Lw6Rv3Jx5Bt1Yd9Gc.jpg",
    rating: 4.8,
    reviews: 1654,
    price: 139.90,
    tag: "Top Avaliado",
    description: "Complexo aquatico com toboaguas radicais, piscinas termais e area kids.",
    tags: ["familia", "aventura", "parques"],
    matchReasons: ["Toboaguas radicais", "Area kids completa", "Excelente avaliacao"],
    professionMatch: { medico: "Desconecte em piscinas relaxantes", professor: "Area kids segura e divertida", empresario: "Infraestrutura premium", autonomo: "Preco acessivel com muita diversao", aposentado: "Piscinas termais tranquilas" },
  },
  {
    id: 3,
    name: "Resort Termas Paradise",
    category: "resorts",
    location: "Caldas Novas",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/termas-paradise-Np6Qr8Ts2Uf4Xv7Zy1Bw3Dc5Eg9Hj.jpg",
    rating: 4.9,
    reviews: 856,
    price: 389.90,
    tag: "Premium",
    description: "Resort all-inclusive com aguas termais, spa completo e gastronomia premiada.",
    tags: ["relaxamento", "casal", "premium", "spa"],
    matchReasons: ["Spa completo incluso", "Gastronomia premiada", "Experiencia premium"],
    professionMatch: { medico: "Spa terapeutico completo incluso", professor: "Descanse com tudo incluso", empresario: "Experiencia exclusiva 5 estrelas", autonomo: "All-inclusive sem preocupacoes", aposentado: "Conforto e tranquilidade total" },
  },
  {
    id: 4,
    name: "Water Park",
    category: "parques",
    location: "Caldas Novas",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/water-park-Lq8Rs2Ut4Wv6Xy9Ab1Cd3Ef5Gh7Ij.jpg",
    rating: 4.7,
    reviews: 1203,
    price: 119.90,
    tag: "Familia",
    description: "Parque aquatico com atracoes para todas as idades e piscinas de ondas.",
    tags: ["familia", "economico", "parques"],
    matchReasons: ["Melhor preco da regiao", "Piscina de ondas", "Ideal para familias"],
    professionMatch: { medico: "Diversao leve e relaxante", professor: "Otimo para criancas de todas idades", empresario: "Diversao para toda a familia", autonomo: "Melhor custo-beneficio da regiao", aposentado: "Atracoes tranquilas disponiveis" },
  },
  {
    id: 5,
    name: "DiRoma Internacional",
    category: "hoteis",
    location: "Caldas Novas",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/diroma-Kp4Mn7Hs8Qf2Lw6Rv3Jx5Bt1Yd9Gc.jpg",
    rating: 4.7,
    reviews: 1987,
    price: 299.90,
    tag: "Melhor Custo-Beneficio",
    description: "Hotel com acesso direto ao parque aquatico, suites confortaveis e pensao completa.",
    tags: ["familia", "custo-beneficio", "parques"],
    matchReasons: ["Acesso ao parque incluso", "Pensao completa", "Otimo custo-beneficio"],
    professionMatch: { medico: "Suites confortaveis para descanso", professor: "Pensao completa inclusa", empresario: "Acesso direto ao parque", autonomo: "Tudo incluso por otimo preco", aposentado: "Conforto com acessibilidade" },
  },
  {
    id: 6,
    name: "Lagoa Quente Flat",
    category: "hoteis",
    location: "Caldas Novas",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/termas-paradise-Np6Qr8Ts2Uf4Xv7Zy1Bw3Dc5Eg9Hj.jpg",
    rating: 4.6,
    reviews: 987,
    price: 259.90,
    tag: "Economico",
    description: "Flat equipado proximo aos principais parques, ideal para familias.",
    tags: ["familia", "economico"],
    matchReasons: ["Proximidade dos parques", "Cozinha completa", "Preco acessivel"],
    professionMatch: { medico: "Cozinha para dietas especiais", professor: "Economia para a familia toda", empresario: "Localizacao estrategica", autonomo: "Melhor preco com cozinha", aposentado: "Conforto de casa longe de casa" },
  },
  {
    id: 7,
    name: "Nautico Praia Clube",
    category: "resorts",
    location: "Caldas Novas",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/water-park-Lq8Rs2Ut4Wv6Xy9Ab1Cd3Ef5Gh7Ij.jpg",
    rating: 4.8,
    reviews: 1456,
    price: 349.90,
    tag: "Resort Club",
    description: "Resort com praia artificial, esportes aquaticos e programacao de lazer completa.",
    tags: ["aventura", "familia", "esportes"],
    matchReasons: ["Praia artificial", "Esportes aquaticos", "Programacao completa"],
    professionMatch: { medico: "Esportes aquaticos para desestressar", professor: "Programacao de lazer completa", empresario: "Infraestrutura de clube", autonomo: "Diversas atracoes por um preco", aposentado: "Praia sem sair de Caldas" },
  },
  {
    id: 8,
    name: "Jardim Japones",
    category: "passeios",
    location: "Caldas Novas",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hot-park-Jm2Xy9K8RfqL3vN5wT1pA6sD4hB7eC.jpg",
    rating: 4.5,
    reviews: 432,
    price: 29.90,
    tag: "Cultural",
    description: "Jardim tematico com paisagismo japones, lago com carpas e area de meditacao.",
    tags: ["cultura", "relaxamento", "natureza"],
    matchReasons: ["Experiencia cultural unica", "Ambiente zen", "Preco acessivel"],
    professionMatch: { medico: "Meditacao e tranquilidade", professor: "Experiencia cultural educativa", empresario: "Momento de paz e reflexao", autonomo: "Passeio acessivel e unico", aposentado: "Caminhada leve e contemplativa" },
  },
]

const DISCOVERY_QUESTIONS = [
  {
    id: "profession",
    title: "Qual sua profissao?",
    subtitle: "Recomendamos experiencias ideais para sua rotina",
    options: [
      { value: "medico", label: "Saude", icon: Stethoscope },
      { value: "professor", label: "Educacao", icon: GraduationCap },
      { value: "empresario", label: "Empresario", icon: Briefcase },
      { value: "autonomo", label: "Autonomo", icon: Palette },
      { value: "aposentado", label: "Aposentado", icon: Users },
    ],
  },
  {
    id: "budget",
    title: "Qual seu orcamento por pessoa?",
    subtitle: "Mostramos opcoes que cabem no seu bolso",
    options: [
      { value: "economico", label: "Ate R$ 500", icon: Target },
      { value: "moderado", label: "R$ 500 - R$ 1.500", icon: TrendingUp },
      { value: "confortavel", label: "R$ 1.500 - R$ 3.000", icon: Star },
      { value: "premium", label: "Acima de R$ 3.000", icon: Zap },
    ],
  },
  {
    id: "interests",
    title: "O que mais te interessa?",
    subtitle: "Selecione quantos quiser",
    options: [
      { value: "parques", label: "Parques Aquaticos", icon: Waves },
      { value: "spa", label: "Spa & Bem-estar", icon: Sparkles },
      { value: "natureza", label: "Natureza", icon: TreePine },
      { value: "gastronomia", label: "Gastronomia", icon: Utensils },
      { value: "cultura", label: "Cultura", icon: Compass },
      { value: "esportes", label: "Esportes", icon: Target },
    ],
  },
]

const TRENDING_SEARCHES = [
  { text: "Parques aquaticos abertos hoje", count: 142 },
  { text: "Resort all-inclusive em Caldas", count: 98 },
  { text: "Melhores restaurantes da regiao", count: 76 },
  { text: "Passeios para casais romanticos", count: 63 },
]

export default function CaldasAIPage() {
  const [activeCategory, setActiveCategory] = useState("todos")
  const [selectedDestination, setSelectedDestination] = useState(DESTINATIONS[0])
  const [searchQuery, setSearchQuery] = useState("")
  const [favorites, setFavorites] = useState<number[]>([])
  const [showAISuggestions, setShowAISuggestions] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [selectedHotel, setSelectedHotel] = useState<HotelDetailData | null>(null)
  const [profile, setProfile] = useState<TravelerProfile | null>(null)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [discoveryStep, setDiscoveryStep] = useState(0)
  const [discoveryActive, setDiscoveryActive] = useState(false)
  const [discoveryAnswers, setDiscoveryAnswers] = useState<Record<string, string | string[]>>({})
  const [discoveryComplete, setDiscoveryComplete] = useState(false)
  const [viewerCounts, setViewerCounts] = useState<Record<number, number>>({})
  const [discoveryResultsVisible, setDiscoveryResultsVisible] = useState(false)
  const [showAllResults, setShowAllResults] = useState(false)
  const [recentActivity, setRecentActivity] = useState("")
  const [categoryAnimated, setCategoryAnimated] = useState(false)
  const categoryRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const saved = getTravelerProfile()
    if (saved) setProfile(saved)
  }, [])

  useEffect(() => {
    const counts: Record<number, number> = {}
    DESTINATIONS.forEach((d) => {
      counts[d.id] = Math.floor(Math.random() * 20) + 5
    })
    setViewerCounts(counts)
    const interval = setInterval(() => {
      setViewerCounts((prev) => {
        const updated = { ...prev }
        const randomId = DESTINATIONS[Math.floor(Math.random() * DESTINATIONS.length)].id
        updated[randomId] = Math.max(3, (updated[randomId] || 10) + Math.floor(Math.random() * 5) - 2)
        return updated
      })
    }, 8000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const NAMES = ["Ana M.", "Carlos S.", "Maria L.", "Joao P.", "Lucia R.", "Pedro H.", "Fernanda C.", "Bruno A.", "Camila T.", "Rafael D."]
    const ACTIONS = ["pesquisou parques em Caldas", "reservou hotel para o feriado", "encontrou resort ideal", "comprou ingressos pelo CaldasAI", "planejou roteiro familiar"]
    const update = () => {
      const name = NAMES[Math.floor(Math.random() * NAMES.length)]
      const action = ACTIONS[Math.floor(Math.random() * ACTIONS.length)]
      const mins = Math.floor(Math.random() * 8) + 1
      setRecentActivity(`${name} ${action} ha ${mins} min`)
    }
    update()
    const interval = setInterval(update, 12000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!categoryRef.current) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setCategoryAnimated(true) },
      { threshold: 0.3 }
    )
    observer.observe(categoryRef.current)
    return () => observer.disconnect()
  }, [])

  const contextualSuggestions = useMemo(() => {
    const suggestions: string[] = []

    if (profile?.profession && PROFESSION_SUGGESTIONS[profile.profession]) {
      suggestions.push(...PROFESSION_SUGGESTIONS[profile.profession].slice(0, 2))
    }

    if (profile?.budget && BUDGET_SUGGESTIONS[profile.budget]) {
      suggestions.push(...BUDGET_SUGGESTIONS[profile.budget].slice(0, 1))
    }

    if (profile?.interests) {
      for (const interest of profile.interests) {
        if (INTEREST_SUGGESTIONS[interest]) {
          suggestions.push(INTEREST_SUGGESTIONS[interest][0])
        }
      }
    }

    if (profile?.tripType) {
      const typeMap: Record<string, string[]> = {
        relaxamento: ["Spas com aguas termais naturais"],
        aventura: ["Parques com toboaguas radicais"],
        familia: ["Parques com area kids completa"],
        romantico: ["Resorts para casais com spa"],
        amigos: ["Parques e festas para turma"],
        negocios: ["Hoteis com wifi rapido e coworking"],
      }
      if (typeMap[profile.tripType]) suggestions.push(...typeMap[profile.tripType])
    }

    if (suggestions.length === 0) {
      return ["Parques para familia com criancas", "Hoteis com melhor custo-beneficio", "Resorts all-inclusive", "Passeios culturais em Caldas Novas", "Piscinas naturais de agua quente"]
    }

    return Array.from(new Set(suggestions)).slice(0, 5)
  }, [profile])

  const destinationsWithScore = useMemo(() => {
    return DESTINATIONS.map((d) => ({
      ...d,
      matchScore: calculateMatchScore(profile, { category: d.category, price: d.price, tags: d.tags }),
    })).sort((a, b) => b.matchScore - a.matchScore)
  }, [profile])

  const filteredDestinations = destinationsWithScore.filter((d) => {
    const matchCategory = activeCategory === "todos" || d.category === activeCategory
    const matchSearch = searchQuery === "" || d.name.toLowerCase().includes(searchQuery.toLowerCase()) || d.location.toLowerCase().includes(searchQuery.toLowerCase()) || d.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchCategory && matchSearch
  })

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id])
  }

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price)

  const tagColor = (tag: string) => {
    const colors: Record<string, string> = {
      "Mais Popular": "#EF4444",
      "Top Avaliado": "#F59E0B",
      "Premium": "#8B5CF6",
      "Familia": "#22C55E",
      "Melhor Custo-Beneficio": "#2563EB",
      "Economico": "#06B6D4",
      "Resort Club": "#EC4899",
      "Cultural": "#14B8A6",
    }
    return colors[tag] || "#6B7280"
  }

  const matchColor = (score: number) => {
    if (score >= 85) return "#22C55E"
    if (score >= 70) return "#2563EB"
    return "#F57C00"
  }

  const handleDiscoverySelect = (questionId: string, value: string) => {
    if (questionId === "interests") {
      setDiscoveryAnswers((prev) => {
        const current = (prev.interests as string[]) || []
        const updated = current.includes(value) ? current.filter((v) => v !== value) : [...current, value]
        return { ...prev, interests: updated }
      })
    } else {
      setDiscoveryAnswers((prev) => ({ ...prev, [questionId]: value }))
    }
  }

  const handleDiscoveryNext = () => {
    if (discoveryStep < DISCOVERY_QUESTIONS.length - 1) {
      setDiscoveryStep((s) => s + 1)
    } else {
      const newProfile: TravelerProfile = {
        tripType: (discoveryAnswers.profession as string) === "aposentado" ? "relaxamento" : "familia",
        budget: (discoveryAnswers.budget as string) || "moderado",
        companions: "casal",
        interests: (discoveryAnswers.interests as string[]) || [],
        profession: discoveryAnswers.profession as string,
      }
      saveTravelerProfile(newProfile)
      setProfile(newProfile)
      setDiscoveryActive(false)
      setDiscoveryComplete(true)
      setTimeout(() => setDiscoveryResultsVisible(true), 300)
    }
  }

  const canProceedDiscovery = () => {
    const q = DISCOVERY_QUESTIONS[discoveryStep]
    if (q.id === "interests") {
      return ((discoveryAnswers.interests as string[]) || []).length > 0
    }
    return !!discoveryAnswers[q.id]
  }

  const topPicks = destinationsWithScore.slice(0, 3)
  const discoveryResults = discoveryComplete ? destinationsWithScore.slice(0, showAllResults ? 8 : 4) : []

  const getPersonalizedReason = (dest: typeof DESTINATIONS[0]) => {
    if (profile?.profession && dest.professionMatch[profile.profession as keyof typeof dest.professionMatch]) {
      return dest.professionMatch[profile.profession as keyof typeof dest.professionMatch]
    }
    return dest.matchReasons[0]
  }

  return (
    <div className="rsv-subpage" style={{ background: "#F8FAFC", minHeight: "100vh" }} data-testid="page-caldas-ai">
      <BehaviorTracker pageName="caldas-ai" category="ai" />

      <div style={{
        background: "linear-gradient(135deg, #1e3a5f 0%, #0D47A1 50%, #2563EB 100%)",
        padding: "16px 20px 24px",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: -40, right: -40, width: 120, height: 120,
          borderRadius: "50%", background: "rgba(255,255,255,0.05)",
        }} />
        <div style={{
          position: "absolute", bottom: -30, left: -30, width: 100, height: 100,
          borderRadius: "50%", background: "rgba(255,255,255,0.03)",
        }} />
        <div style={{
          position: "absolute", top: 60, right: 30, width: 60, height: 60,
          borderRadius: "50%", background: "rgba(255,255,255,0.02)",
        }} />

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, position: "relative", zIndex: 1 }}>
          <Link href="/" style={{ color: "#fff", display: "flex", alignItems: "center" }} data-testid="link-back-home">
            <ArrowLeft size={22} />
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "#fff", fontSize: 20, fontWeight: 800, letterSpacing: 1 }}>RSV</span>
            <span style={{ color: "#F57C00", fontSize: 20, fontWeight: 800 }}>360</span>
            <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: 600, marginLeft: 2 }}>BRAIN</span>
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              background: "rgba(255,255,255,0.15)", display: "flex",
              alignItems: "center", justifyContent: "center",
            }}>
              <Brain size={18} style={{ color: "#fff" }} />
            </div>
          </div>
          <div style={{ width: 22 }} />
        </div>

        <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 13, textAlign: "center", margin: "0 0 6px", position: "relative", zIndex: 1 }}>
          {profile ? `Recomendacoes personalizadas para voce` : "Descubra os melhores destinos com inteligencia artificial"}
        </p>

        {profile && (
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            marginBottom: 10, position: "relative", zIndex: 1,
          }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 4,
              background: "rgba(255,255,255,0.12)", borderRadius: 20,
              padding: "4px 10px",
            }}>
              <Shield size={10} style={{ color: "#22C55E" }} />
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.9)", fontWeight: 600 }}>
                Perfil ativo
              </span>
            </div>
            {profile.profession && (
              <div style={{
                display: "flex", alignItems: "center", gap: 4,
                background: "rgba(255,255,255,0.12)", borderRadius: 20,
                padding: "4px 10px",
              }}>
                <Briefcase size={10} style={{ color: "#F57C00" }} />
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.9)", fontWeight: 600 }}>
                  {profile.profession}
                </span>
              </div>
            )}
          </div>
        )}

        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            background: "rgba(255,255,255,0.95)", borderRadius: 12, padding: "10px 14px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
          }}>
            <Search size={18} style={{ color: "#6B7280", flexShrink: 0 }} />
            <input
              type="text"
              placeholder={profile ? "O que voce procura hoje?" : "Pergunte ao CaldasAI..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowAISuggestions(true)}
              onBlur={() => setTimeout(() => setShowAISuggestions(false), 200)}
              style={{
                border: "none", outline: "none", flex: 1, fontSize: 14,
                background: "transparent", color: "#1F2937",
              }}
              data-testid="input-search"
            />
            <Sparkles size={18} style={{ color: "#F57C00", flexShrink: 0 }} />
          </div>

          {showAISuggestions && (
            <div style={{
              position: "absolute", top: "100%", left: 0, right: 0, marginTop: 4,
              background: "#fff", borderRadius: 12, padding: 8,
              boxShadow: "0 8px 30px rgba(0,0,0,0.15)", zIndex: 10,
            }} data-testid="dropdown-suggestions">
              <div style={{ padding: "6px 10px", fontSize: 11, color: "#9CA3AF", fontWeight: 600, textTransform: "uppercase" as const }}>
                {profile ? `Sugestoes para ${profile.profession || "seu perfil"}` : "Sugestoes do CaldasAI"}
              </div>
              {contextualSuggestions.map((s, i) => (
                <div
                  key={i}
                  onClick={() => { setSearchQuery(s); setShowAISuggestions(false) }}
                  style={{
                    padding: "10px 12px", fontSize: 13, color: "#374151", cursor: "pointer",
                    borderRadius: 8, display: "flex", alignItems: "center", gap: 8,
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#F3F4F6")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  data-testid={`suggestion-item-${i}`}
                >
                  <Sparkles size={14} style={{ color: "#F57C00" }} />
                  {s}
                </div>
              ))}

              {!profile && (
                <>
                  <div style={{ height: 1, background: "#E5E7EB", margin: "6px 0" }} />
                  <div style={{ padding: "6px 10px", fontSize: 11, color: "#9CA3AF", fontWeight: 600, textTransform: "uppercase" as const }}>
                    Buscas populares agora
                  </div>
                  {TRENDING_SEARCHES.slice(0, 3).map((t, i) => (
                    <div
                      key={`trend-${i}`}
                      onClick={() => { setSearchQuery(t.text); setShowAISuggestions(false) }}
                      style={{
                        padding: "8px 12px", fontSize: 12, color: "#6B7280", cursor: "pointer",
                        borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "space-between",
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#F3F4F6")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      data-testid={`trending-item-${i}`}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <Flame size={13} style={{ color: "#EF4444" }} />
                        {t.text}
                      </div>
                      <span style={{ fontSize: 10, color: "#9CA3AF" }}>{t.count} buscas</span>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
        padding: "8px 16px", background: "#FFFBEB", borderBottom: "1px solid #FDE68A",
      }} data-testid="section-social-proof">
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22C55E", animation: "pulse 2s infinite" }} />
        <span style={{ fontSize: 11, color: "#92400E", fontWeight: 500 }}>{recentActivity}</span>
      </div>

      {!profile && !discoveryActive && !discoveryComplete && (
        <div style={{ margin: "16px 16px 0" }} data-testid="section-discovery-cta">
          <div style={{
            background: "linear-gradient(135deg, #7C3AED 0%, #2563EB 100%)",
            borderRadius: 16, padding: "24px 20px", position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", top: -20, right: -20, width: 80, height: 80,
              borderRadius: "50%", background: "rgba(255,255,255,0.08)",
            }} />
            <div style={{
              position: "absolute", bottom: -10, left: 30, width: 50, height: 50,
              borderRadius: "50%", background: "rgba(255,255,255,0.05)",
            }} />
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
              <div style={{
                width: 44, height: 44, borderRadius: "50%",
                background: "rgba(255,255,255,0.15)", display: "flex",
                alignItems: "center", justifyContent: "center",
              }}>
                <Brain size={24} style={{ color: "#fff" }} />
              </div>
              <div>
                <h3 style={{ color: "#fff", fontSize: 17, fontWeight: 800, margin: 0, lineHeight: 1.3 }}>
                  Conte sobre sua viagem ideal
                </h3>
                <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 12, margin: "4px 0 0" }}>
                  Responda 3 perguntas e a IA monta seu roteiro personalizado
                </p>
              </div>
            </div>
            <div style={{
              display: "flex", alignItems: "center", gap: 8, marginBottom: 14,
              flexWrap: "wrap",
            }}>
              {[
                { icon: Target, text: "Perfil profissional" },
                { icon: TrendingUp, text: "Orcamento ideal" },
                { icon: Heart, text: "Seus interesses" },
              ].map((step, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 4,
                  background: "rgba(255,255,255,0.12)", borderRadius: 8,
                  padding: "4px 8px",
                }}>
                  <step.icon size={11} style={{ color: "rgba(255,255,255,0.9)" }} />
                  <span style={{ fontSize: 10, color: "rgba(255,255,255,0.9)", fontWeight: 500 }}>{step.text}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => setDiscoveryActive(true)}
              style={{
                width: "100%", padding: "13px 0", borderRadius: 10, border: "none",
                background: "rgba(255,255,255,0.2)", color: "#fff",
                fontSize: 14, fontWeight: 700, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                backdropFilter: "blur(4px)",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.3)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.2)")}
              data-testid="button-start-discovery"
            >
              <Sparkles size={16} />
              Iniciar Discovery
              <ChevronRight size={16} />
            </button>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, marginTop: 10 }}>
              <Users size={11} style={{ color: "rgba(255,255,255,0.6)" }} />
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.6)" }}>
                +2.340 viajantes ja usaram o Discovery
              </span>
            </div>
          </div>
        </div>
      )}

      {discoveryActive && (
        <div style={{ margin: "16px" }} data-testid="section-discovery-flow">
          <div style={{
            background: "#fff", borderRadius: 16, padding: "24px 20px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          }}>
            <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
              {DISCOVERY_QUESTIONS.map((_, i) => (
                <div key={i} style={{
                  flex: 1, height: 4, borderRadius: 2,
                  background: i <= discoveryStep ? "#2563EB" : "#E5E7EB",
                  transition: "background 0.3s",
                }} />
              ))}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <Sparkles size={18} style={{ color: "#F57C00" }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: "#F57C00", textTransform: "uppercase" as const }}>
                Passo {discoveryStep + 1} de {DISCOVERY_QUESTIONS.length}
              </span>
            </div>

            <h3 style={{ fontSize: 18, fontWeight: 800, color: "#1F2937", margin: "0 0 4px" }}>
              {DISCOVERY_QUESTIONS[discoveryStep].title}
            </h3>
            <p style={{ fontSize: 13, color: "#6B7280", margin: "0 0 16px" }}>
              {DISCOVERY_QUESTIONS[discoveryStep].subtitle}
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {DISCOVERY_QUESTIONS[discoveryStep].options.map((opt) => {
                const qId = DISCOVERY_QUESTIONS[discoveryStep].id
                const isSelected = qId === "interests"
                  ? ((discoveryAnswers.interests as string[]) || []).includes(opt.value)
                  : discoveryAnswers[qId] === opt.value
                const Icon = opt.icon

                return (
                  <button
                    key={opt.value}
                    onClick={() => handleDiscoverySelect(qId, opt.value)}
                    style={{
                      padding: "14px 12px", borderRadius: 12,
                      border: isSelected ? "2px solid #2563EB" : "1px solid #E5E7EB",
                      background: isSelected ? "#EFF6FF" : "#fff",
                      cursor: "pointer", textAlign: "center",
                      transition: "all 0.2s", display: "flex", flexDirection: "column",
                      alignItems: "center", gap: 6,
                    }}
                    data-testid={`discovery-option-${opt.value}`}
                  >
                    <div style={{
                      width: 36, height: 36, borderRadius: "50%",
                      background: isSelected ? "#2563EB" : "#F3F4F6",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "all 0.2s",
                    }}>
                      <Icon size={18} style={{ color: isSelected ? "#fff" : "#6B7280" }} />
                    </div>
                    <span style={{
                      fontSize: 13, fontWeight: isSelected ? 700 : 500,
                      color: isSelected ? "#2563EB" : "#374151",
                    }}>{opt.label}</span>
                    {isSelected && <Check size={14} style={{ color: "#2563EB" }} />}
                  </button>
                )
              })}
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
              {discoveryStep > 0 && (
                <button
                  onClick={() => setDiscoveryStep((s) => s - 1)}
                  style={{
                    flex: 1, padding: "12px 0", borderRadius: 10,
                    border: "1px solid #E5E7EB", background: "#fff",
                    color: "#6B7280", fontSize: 14, fontWeight: 600, cursor: "pointer",
                  }}
                  data-testid="button-discovery-back"
                >
                  Voltar
                </button>
              )}
              <button
                onClick={handleDiscoveryNext}
                disabled={!canProceedDiscovery()}
                style={{
                  flex: 2, padding: "12px 0", borderRadius: 10, border: "none",
                  background: canProceedDiscovery()
                    ? "linear-gradient(135deg, #2563EB, #1D4ED8)"
                    : "#E5E7EB",
                  color: canProceedDiscovery() ? "#fff" : "#9CA3AF",
                  fontSize: 14, fontWeight: 700, cursor: canProceedDiscovery() ? "pointer" : "default",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                }}
                data-testid="button-discovery-next"
              >
                {discoveryStep === DISCOVERY_QUESTIONS.length - 1 ? "Ver Recomendacoes" : "Continuar"}
                <ChevronRight size={16} />
              </button>
            </div>

            <button
              onClick={() => { setDiscoveryActive(false) }}
              style={{
                width: "100%", marginTop: 10, padding: "8px 0", border: "none",
                background: "transparent", color: "#9CA3AF", fontSize: 12,
                cursor: "pointer",
              }}
              data-testid="button-discovery-skip"
            >
              Pular e explorar livremente
            </button>
          </div>
        </div>
      )}

      {discoveryComplete && discoveryResultsVisible && (
        <div style={{ margin: "16px", transition: "opacity 0.5s", opacity: 1 }} data-testid="section-discovery-results">
          <div style={{
            background: "linear-gradient(135deg, #F0FDF4 0%, #EFF6FF 50%, #F5F3FF 100%)",
            borderRadius: 16, padding: "20px", border: "1px solid #BBF7D0",
            marginBottom: 16,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{
                width: 40, height: 40, borderRadius: "50%",
                background: "linear-gradient(135deg, #22C55E, #16A34A)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Check size={22} style={{ color: "#fff" }} />
              </div>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: "#1F2937", margin: 0 }}>
                  Seu roteiro esta pronto!
                </h3>
                <p style={{ fontSize: 12, color: "#6B7280", margin: "2px 0 0" }}>
                  A IA analisou seu perfil e encontrou {destinationsWithScore.length} destinos ideais
                </p>
              </div>
            </div>

            <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
              {profile?.profession && (
                <div style={{
                  display: "flex", alignItems: "center", gap: 4,
                  background: "#fff", borderRadius: 8, padding: "4px 10px",
                  border: "1px solid #E5E7EB",
                }}>
                  <Briefcase size={12} style={{ color: "#7C3AED" }} />
                  <span style={{ fontSize: 11, color: "#374151", fontWeight: 500 }}>{profile.profession}</span>
                </div>
              )}
              {profile?.budget && (
                <div style={{
                  display: "flex", alignItems: "center", gap: 4,
                  background: "#fff", borderRadius: 8, padding: "4px 10px",
                  border: "1px solid #E5E7EB",
                }}>
                  <Target size={12} style={{ color: "#2563EB" }} />
                  <span style={{ fontSize: 11, color: "#374151", fontWeight: 500 }}>{profile.budget}</span>
                </div>
              )}
              {profile?.interests?.slice(0, 3).map((interest, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 4,
                  background: "#fff", borderRadius: 8, padding: "4px 10px",
                  border: "1px solid #E5E7EB",
                }}>
                  <Heart size={12} style={{ color: "#EC4899" }} />
                  <span style={{ fontSize: 11, color: "#374151", fontWeight: 500 }}>{interest}</span>
                </div>
              ))}
            </div>

            <div className="rsv-subpage-grid" style={{ gap: 12 }}>
              {discoveryResults.map((dest, idx) => (
                <div
                  key={dest.id}
                  onClick={() => {
                    setSelectedDestination(dest)
                    setSelectedHotel({
                      id: String(dest.id),
                      title: dest.name,
                      description: dest.description,
                      images: [dest.image],
                      stars: Math.round(dest.rating),
                      location: dest.location,
                      price: dest.price,
                      features: ["Wi-Fi", "Cafe da Manha", "Estacionamento", "Piscinas Termais"],
                      capacity: 4,
                      rating: dest.rating,
                      reviews: dest.reviews,
                    })
                  }}
                  style={{
                    background: "#fff", borderRadius: 14, overflow: "hidden",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.06)", cursor: "pointer",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    border: idx === 0 ? "2px solid #22C55E" : "1px solid #E5E7EB",
                    position: "relative",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.12)" }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.06)" }}
                  data-testid={`discovery-result-card-${dest.id}`}
                >
                  {idx === 0 && (
                    <div style={{
                      position: "absolute", top: 0, left: 0, right: 0, zIndex: 2,
                      background: "linear-gradient(135deg, #22C55E, #16A34A)",
                      padding: "3px 0", textAlign: "center",
                    }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: "#fff", letterSpacing: 0.5, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                        <Award size={10} /> MELHOR MATCH PARA VOCE
                      </span>
                    </div>
                  )}
                  <div style={{
                    width: "100%", height: 110, background: `url(${dest.image}) center/cover`,
                    position: "relative",
                  }}>
                    <div style={{
                      position: "absolute", inset: 0,
                      background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)",
                    }} />
                    <div style={{
                      position: "absolute", top: idx === 0 ? 28 : 8, right: 8,
                      background: matchColor(dest.matchScore), color: "#fff",
                      padding: "4px 10px", borderRadius: 8,
                      fontSize: 12, fontWeight: 800,
                      display: "flex", alignItems: "center", gap: 3,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                    }}>
                      <Sparkles size={11} />
                      {dest.matchScore}%
                    </div>
                    <div style={{
                      position: "absolute", bottom: 8, left: 8, right: 8,
                    }}>
                      <span style={{ color: "#fff", fontSize: 14, fontWeight: 700 }}>{dest.name}</span>
                    </div>
                  </div>
                  <div style={{ padding: "10px 12px" }}>
                    <div style={{
                      display: "flex", alignItems: "center", gap: 4, marginBottom: 6,
                      background: "#EFF6FF", borderRadius: 6, padding: "4px 8px",
                    }}>
                      <ThumbsUp size={11} style={{ color: "#2563EB" }} />
                      <span style={{ fontSize: 11, color: "#2563EB", fontWeight: 600 }}>
                        {getPersonalizedReason(dest)}
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                        <Star size={12} fill="#FBBF24" style={{ color: "#FBBF24" }} />
                        <span style={{ fontSize: 12, fontWeight: 700, color: "#1F2937" }}>{dest.rating}</span>
                        <span style={{ fontSize: 10, color: "#9CA3AF" }}>({dest.reviews})</span>
                      </div>
                      <span style={{ fontSize: 15, fontWeight: 800, color: "#22C55E" }}>
                        {formatPrice(dest.price)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {!showAllResults && destinationsWithScore.length > 4 && (
              <button
                onClick={() => setShowAllResults(true)}
                style={{
                  width: "100%", marginTop: 12, padding: "10px 0", borderRadius: 10,
                  border: "1px solid #BFDBFE", background: "#fff", color: "#2563EB",
                  fontSize: 13, fontWeight: 600, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                }}
                data-testid="button-show-all-results"
              >
                Ver todos os {destinationsWithScore.length} resultados
                <ChevronDown size={14} />
              </button>
            )}
          </div>
        </div>
      )}

      {profile && !discoveryComplete && (
        <div style={{
          margin: "16px 16px 0", padding: "12px 16px", borderRadius: 12,
          background: "linear-gradient(135deg, #EFF6FF, #F0FDF4)",
          border: "1px solid #BFDBFE",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10,
        }} data-testid="section-profile-banner">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Sparkles size={18} style={{ color: "#2563EB", flexShrink: 0 }} />
            <div>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#2563EB" }}>
                IA personalizada ativa
              </span>
              <p style={{ fontSize: 11, color: "#6B7280", margin: "2px 0 0" }}>
                {profile.profession ? `Perfil: ${profile.profession}` : ""} {profile.interests.length > 0 ? `| ${profile.interests.length} interesses` : ""}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowProfileModal(true)}
            style={{
              padding: "6px 12px", borderRadius: 8, border: "1px solid #BFDBFE",
              background: "#fff", color: "#2563EB", fontSize: 11, fontWeight: 600,
              cursor: "pointer", whiteSpace: "nowrap" as const,
            }}
            data-testid="button-edit-profile"
          >
            Editar perfil
          </button>
        </div>
      )}

      {profile && topPicks.length > 0 && !discoveryComplete && (
        <div style={{ padding: "16px 16px 0" }} data-testid="section-top-picks">
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <Target size={16} style={{ color: "#2563EB" }} />
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1F2937", margin: 0 }}>
              Top IA Picks para voce
            </h3>
          </div>
          <div style={{ display: "flex", gap: 12, overflowX: "auto" as const, paddingBottom: 8 }}>
            {topPicks.map((dest) => (
              <div
                key={dest.id}
                onClick={() => {
                  setSelectedDestination(dest)
                  setSelectedHotel({
                    id: String(dest.id),
                    title: dest.name,
                    description: dest.description,
                    images: [dest.image],
                    stars: Math.round(dest.rating),
                    location: dest.location,
                    price: dest.price,
                    features: ["Wi-Fi", "Cafe da Manha", "Estacionamento", "Piscinas Termais"],
                    capacity: 4,
                    rating: dest.rating,
                    reviews: dest.reviews,
                  })
                }}
                style={{
                  minWidth: 220, background: "#fff", borderRadius: 14,
                  overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
                  cursor: "pointer", flexShrink: 0, border: "1px solid #E5E7EB",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.12)" }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.06)" }}
                data-testid={`top-pick-card-${dest.id}`}
              >
                <div style={{
                  width: "100%", height: 100, background: `url(${dest.image}) center/cover`,
                  position: "relative",
                }}>
                  <div style={{
                    position: "absolute", inset: 0,
                    background: "linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 60%)",
                  }} />
                  <div style={{
                    position: "absolute", top: 8, right: 8,
                    background: matchColor(dest.matchScore),
                    color: "#fff", padding: "3px 8px", borderRadius: 8,
                    fontSize: 11, fontWeight: 800,
                    display: "flex", alignItems: "center", gap: 3,
                  }}>
                    <Sparkles size={10} />
                    {dest.matchScore}% match
                  </div>
                </div>
                <div style={{ padding: "10px 12px" }}>
                  <h4 style={{ fontSize: 13, fontWeight: 700, color: "#1F2937", margin: "0 0 4px" }}>
                    {dest.name}
                  </h4>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 4, marginBottom: 6,
                    background: "#F0FDF4", borderRadius: 4, padding: "2px 6px",
                  }}>
                    <ThumbsUp size={9} style={{ color: "#16A34A" }} />
                    <span style={{ fontSize: 10, color: "#16A34A", fontWeight: 500 }}>
                      {getPersonalizedReason(dest)}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 14, fontWeight: 800, color: "#22C55E" }}>
                      {formatPrice(dest.price)}
                    </span>
                    <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                      <Star size={11} fill="#FBBF24" style={{ color: "#FBBF24" }} />
                      <span style={{ fontSize: 11, fontWeight: 700, color: "#374151" }}>{dest.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div ref={categoryRef} style={{ padding: "16px 16px 8px" }} data-testid="section-discover-categories">
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <Compass size={16} style={{ color: "#7C3AED" }} />
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1F2937", margin: 0 }}>
            Descubra por Categoria
          </h3>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          {DISCOVERY_CATEGORIES.map((cat, catIdx) => {
            const Icon = cat.icon
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id === activeCategory ? "todos" : cat.id)}
                style={{
                  padding: "14px 8px", borderRadius: 12,
                  border: activeCategory === cat.id ? `2px solid ${cat.color}` : "1px solid #E5E7EB",
                  background: activeCategory === cat.id ? cat.bg : "#fff",
                  cursor: "pointer", textAlign: "center",
                  transition: "all 0.3s", display: "flex", flexDirection: "column",
                  alignItems: "center", gap: 6,
                  transform: categoryAnimated ? "translateY(0)" : "translateY(10px)",
                  opacity: categoryAnimated ? 1 : 0,
                  transitionDelay: `${catIdx * 80}ms`,
                }}
                data-testid={`category-tile-${cat.id}`}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: activeCategory === cat.id ? cat.color : cat.bg,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.2s",
                }}>
                  <Icon size={18} style={{ color: activeCategory === cat.id ? "#fff" : cat.color }} />
                </div>
                <span style={{
                  fontSize: 11, fontWeight: 600,
                  color: activeCategory === cat.id ? cat.color : "#4B5563",
                  lineHeight: 1.2,
                }}>{cat.label}</span>
                <span style={{ fontSize: 10, color: "#9CA3AF" }}>{cat.count} opcoes</span>
              </button>
            )
          })}
        </div>
      </div>

      <div style={{ padding: "8px 16px 8px", display: "flex", gap: 8, overflowX: "auto" as const }}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            style={{
              padding: "8px 16px", borderRadius: 20, border: "none", cursor: "pointer",
              fontSize: 13, fontWeight: 600, whiteSpace: "nowrap" as const,
              background: activeCategory === cat.id ? "#2563EB" : "#E5E7EB",
              color: activeCategory === cat.id ? "#fff" : "#4B5563",
              transition: "all 0.2s",
            }}
            data-testid={`filter-category-${cat.id}`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div style={{ padding: "12px 16px" }}>
        <div
          style={{
            borderRadius: 16, overflow: "hidden", position: "relative",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          }}
        >
          <div style={{
            width: "100%", height: 220, background: `url(${selectedDestination.image}) center/cover`,
            position: "relative",
          }}>
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)",
            }} />
            <div style={{ position: "absolute", top: 12, left: 12, display: "flex", gap: 6, flexWrap: "wrap" }}>
              <div style={{
                background: tagColor(selectedDestination.tag), color: "#fff",
                padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700,
              }}>
                {selectedDestination.tag}
              </div>
              {profile && (
                <div style={{
                  background: matchColor(destinationsWithScore.find((d) => d.id === selectedDestination.id)?.matchScore || 0),
                  color: "#fff", padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700,
                  display: "flex", alignItems: "center", gap: 4,
                }}>
                  <Sparkles size={10} />
                  {destinationsWithScore.find((d) => d.id === selectedDestination.id)?.matchScore || 0}% match
                </div>
              )}
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); toggleFavorite(selectedDestination.id) }}
              style={{
                position: "absolute", top: 12, right: 12, width: 36, height: 36,
                borderRadius: "50%", border: "none", cursor: "pointer",
                background: "rgba(255,255,255,0.9)", display: "flex",
                alignItems: "center", justifyContent: "center",
              }}
              data-testid="button-toggle-favorite-hero"
            >
              <Heart
                size={18}
                fill={favorites.includes(selectedDestination.id) ? "#EF4444" : "none"}
                style={{ color: favorites.includes(selectedDestination.id) ? "#EF4444" : "#6B7280" }}
              />
            </button>
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "16px 16px 14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <Eye size={14} style={{ color: "rgba(255,255,255,0.8)" }} />
                <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 11 }} data-testid="text-viewers-count">
                  {viewerCounts[selectedDestination.id] || 12} pessoas vendo agora
                </span>
              </div>
              <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 800, margin: 0, lineHeight: 1.2 }} data-testid="text-selected-name">
                {selectedDestination.name}
              </h2>
              <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4, flexWrap: "wrap" }}>
                <MapPin size={13} style={{ color: "rgba(255,255,255,0.8)" }} />
                <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 12 }}>{selectedDestination.location}</span>
                <span style={{ color: "rgba(255,255,255,0.5)", margin: "0 4px" }}>|</span>
                <Star size={13} fill="#FBBF24" style={{ color: "#FBBF24" }} />
                <span style={{ color: "#FBBF24", fontSize: 12, fontWeight: 700 }}>{selectedDestination.rating}</span>
                <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 11 }}>({selectedDestination.reviews})</span>
              </div>
            </div>
          </div>
          <div style={{ background: "#fff", padding: "14px 16px" }}>
            <p style={{ fontSize: 13, color: "#6B7280", margin: "0 0 10px", lineHeight: 1.5 }}>
              {selectedDestination.description}
            </p>
            {profile && (
              <div style={{ marginBottom: 10 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: "#2563EB", display: "flex", alignItems: "center", gap: 4, marginBottom: 6 }}>
                  <Sparkles size={12} /> Por que recomendamos para voce:
                </span>
                <div style={{
                  display: "flex", alignItems: "center", gap: 6,
                  background: "#EFF6FF", borderRadius: 8, padding: "8px 10px",
                  marginBottom: 6,
                }}>
                  <ThumbsUp size={13} style={{ color: "#2563EB" }} />
                  <span style={{ fontSize: 12, color: "#1E40AF", fontWeight: 600 }}>
                    {getPersonalizedReason(selectedDestination as typeof DESTINATIONS[0])}
                  </span>
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {(selectedDestination as typeof DESTINATIONS[0]).matchReasons?.slice(0, 3).map((reason, i) => (
                    <span key={i} style={{
                      fontSize: 11, color: "#374151", background: "#F3F4F6",
                      padding: "3px 8px", borderRadius: 6,
                    }}>
                      {reason}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
              <div>
                <span style={{ fontSize: 11, color: "#9CA3AF" }}>a partir de</span>
                <span style={{ fontSize: 20, fontWeight: 800, color: "#22C55E", marginLeft: 6 }}>
                  {formatPrice(selectedDestination.price)}
                </span>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => setShowChat(true)}
                  style={{
                    background: "transparent", color: "#2563EB", border: "1px solid #BFDBFE",
                    padding: "10px 14px", borderRadius: 10, fontSize: 13, fontWeight: 600,
                    cursor: "pointer", display: "flex", alignItems: "center", gap: 4,
                  }}
                  data-testid="button-ask-ai-hero"
                >
                  <MessageCircle size={14} />
                  Perguntar
                </button>
                <a
                  href={`https://wa.me/5564993197555?text=Oi! Quero saber mais sobre ${selectedDestination.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: "#22C55E", color: "#fff", border: "none",
                    padding: "10px 20px", borderRadius: 10, fontSize: 13, fontWeight: 700,
                    cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
                    textDecoration: "none",
                  }}
                  data-testid="button-reservar-hero"
                >
                  Reservar <ChevronRight size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: "4px 16px 8px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Sparkles size={16} style={{ color: "#F57C00" }} />
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1F2937", margin: 0 }}>
              {profile ? "Recomendados para voce" : "Explore destinos"}
            </h3>
          </div>
          <span style={{ fontSize: 12, color: "#2563EB", fontWeight: 600 }}>
            {filteredDestinations.length} resultados
          </span>
        </div>

        <div className="rsv-subpage-grid">
          {filteredDestinations.map((dest) => (
            <div
              key={dest.id}
              onClick={() => {
                setSelectedDestination(dest)
                setSelectedHotel({
                  id: String(dest.id),
                  title: dest.name,
                  description: dest.description,
                  images: [dest.image],
                  stars: Math.round(dest.rating),
                  location: dest.location,
                  price: dest.price,
                  features: ["Wi-Fi", "Cafe da Manha", "Estacionamento", "Piscinas Termais"],
                  capacity: 4,
                  rating: dest.rating,
                  reviews: dest.reviews,
                })
              }}
              style={{
                background: "#fff", borderRadius: 14, overflow: "hidden",
                boxShadow: "0 2px 10px rgba(0,0,0,0.06)", cursor: "pointer",
                transition: "transform 0.2s, box-shadow 0.2s",
                border: selectedDestination.id === dest.id ? "2px solid #2563EB" : "2px solid transparent",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.12)" }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.06)" }}
              data-testid={`destination-card-${dest.id}`}
            >
              <div style={{
                width: "100%", height: 120, background: `url(${dest.image}) center/cover`,
                position: "relative",
              }}>
                <div style={{ position: "absolute", top: 8, left: 8, display: "flex", gap: 4, flexWrap: "wrap" }}>
                  <div style={{
                    background: tagColor(dest.tag), color: "#fff",
                    padding: "3px 8px", borderRadius: 12, fontSize: 10, fontWeight: 700,
                  }}>
                    {dest.tag}
                  </div>
                  {profile && (
                    <div style={{
                      background: matchColor(dest.matchScore), color: "#fff",
                      padding: "3px 8px", borderRadius: 12, fontSize: 10, fontWeight: 700,
                      display: "flex", alignItems: "center", gap: 2,
                    }}>
                      <Sparkles size={8} />
                      {dest.matchScore}%
                    </div>
                  )}
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); toggleFavorite(dest.id) }}
                  style={{
                    position: "absolute", top: 8, right: 8, width: 28, height: 28,
                    borderRadius: "50%", border: "none", cursor: "pointer",
                    background: "rgba(255,255,255,0.9)", display: "flex",
                    alignItems: "center", justifyContent: "center",
                  }}
                  data-testid={`button-favorite-${dest.id}`}
                >
                  <Heart
                    size={14}
                    fill={favorites.includes(dest.id) ? "#EF4444" : "none"}
                    style={{ color: favorites.includes(dest.id) ? "#EF4444" : "#9CA3AF" }}
                  />
                </button>
              </div>
              <div style={{ padding: "10px 12px" }}>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: "#1F2937", margin: "0 0 4px" }}>
                  {dest.name}
                </h4>
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 4 }}>
                  <MapPin size={11} style={{ color: "#9CA3AF" }} />
                  <span style={{ fontSize: 11, color: "#6B7280" }}>{dest.location}</span>
                </div>
                {profile && (
                  <p style={{ fontSize: 10, color: "#2563EB", margin: "0 0 6px", fontWeight: 500 }}>
                    {getPersonalizedReason(dest)}
                  </p>
                )}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                    <Star size={12} fill="#FBBF24" style={{ color: "#FBBF24" }} />
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#1F2937" }}>{dest.rating}</span>
                    <span style={{ fontSize: 10, color: "#9CA3AF" }}>({dest.reviews})</span>
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 800, color: "#22C55E" }}>
                    {formatPrice(dest.price)}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 6 }}>
                  <Eye size={10} style={{ color: "#9CA3AF" }} />
                  <span style={{ fontSize: 10, color: "#9CA3AF" }}>
                    {viewerCounts[dest.id] || 8} vendo agora
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {!profile && !discoveryActive && (
        <div style={{ padding: "0 16px 16px" }} data-testid="section-profile-cta-bottom">
          <div style={{
            background: "#fff", borderRadius: 14, padding: "16px", border: "1px solid #E5E7EB",
            display: "flex", alignItems: "center", gap: 12,
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: "50%",
              background: "linear-gradient(135deg, #7C3AED, #2563EB)",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <Target size={22} style={{ color: "#fff" }} />
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: "#1F2937", margin: "0 0 2px" }}>
                Quer recomendacoes personalizadas?
              </h4>
              <p style={{ fontSize: 11, color: "#6B7280", margin: 0 }}>
                Crie seu perfil e veja destinos ideais para voce
              </p>
            </div>
            <button
              onClick={() => setShowProfileModal(true)}
              style={{
                padding: "8px 14px", borderRadius: 8, border: "none",
                background: "#2563EB", color: "#fff", fontSize: 12, fontWeight: 700,
                cursor: "pointer", whiteSpace: "nowrap" as const,
              }}
              data-testid="button-create-profile-bottom"
            >
              Criar perfil
            </button>
          </div>
        </div>
      )}

      <div style={{ padding: "8px 16px 16px" }}>
        <div style={{
          background: "linear-gradient(135deg, #1e3a5f 0%, #2563EB 100%)",
          borderRadius: 16, padding: "24px 20px", textAlign: "center" as const,
          position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", top: -20, right: -20, width: 80, height: 80,
            borderRadius: "50%", background: "rgba(255,255,255,0.05)",
          }} />
          <Brain size={32} style={{ color: "#fff", marginBottom: 10 }} />
          <h3 style={{ color: "#fff", fontSize: 17, fontWeight: 800, margin: "0 0 6px" }}>
            CaldasAI - Seu Assistente Inteligente
          </h3>
          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 12, margin: "0 0 16px", lineHeight: 1.5 }}>
            Pergunte qualquer coisa sobre Caldas Novas e Rio Quente. Nossa IA encontra as melhores opcoes para voce!
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => setShowChat(true)}
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                background: "#F57C00", color: "#fff", padding: "12px 24px",
                borderRadius: 10, fontSize: 13, fontWeight: 700, border: "none",
                cursor: "pointer",
              }}
              data-testid="button-open-chat"
            >
              <MessageCircle size={16} />
              Falar com CaldasAI
            </button>
            <a
              href="https://wa.me/5564993197555?text=Oi! Quero ajuda para planejar minha viagem para Caldas Novas"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                background: "rgba(255,255,255,0.15)", color: "#fff", padding: "12px 24px",
                borderRadius: 10, fontSize: 13, fontWeight: 700, border: "none",
                cursor: "pointer", textDecoration: "none",
              }}
              data-testid="link-whatsapp-cta"
            >
              <Coffee size={16} />
              Falar por WhatsApp
            </a>
          </div>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 14,
          }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 4,
              background: "rgba(255,255,255,0.1)", borderRadius: 8, padding: "4px 10px",
            }}>
              <ThumbsUp size={11} style={{ color: "rgba(255,255,255,0.7)" }} />
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.7)" }}>98% satisfacao</span>
            </div>
            <div style={{
              display: "flex", alignItems: "center", gap: 4,
              background: "rgba(255,255,255,0.1)", borderRadius: 8, padding: "4px 10px",
            }}>
              <Users size={11} style={{ color: "rgba(255,255,255,0.7)" }} />
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.7)" }}>+5.000 consultas</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ height: 80 }} />

      {showChat && <ChatAgent defaultOpen={true} onOpenHotelDetail={(hotel) => setSelectedHotel(hotel)} />}

      {selectedHotel && (
        <HotelDetailPanel hotel={selectedHotel} onClose={() => setSelectedHotel(null)} />
      )}

      {showProfileModal && (
        <TravelerProfileModal
          onClose={() => setShowProfileModal(false)}
          onSave={(p) => { setProfile(p); setShowProfileModal(false) }}
        />
      )}
    </div>
  )
}
