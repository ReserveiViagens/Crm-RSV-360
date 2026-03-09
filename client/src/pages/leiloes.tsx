import { useState, useEffect, useCallback, useRef } from "react"
import { Gavel, Clock, ArrowLeft, Star, MapPin, TrendingUp, Users, Flame, X, Plus, Minus, Bell, ChevronRight, Sparkles, Zap, Pause, Play } from "lucide-react"
import { Link } from "wouter";
import {
  SocialProofBanner,
  AIRecommendedBadge,
  calculateMatchScore,
  getTravelerProfile,
  UrgencyIndicator,
  CrossSellSection,
  PersonalizedBanner,
  LiveCountdown,
  TravelerProfileModal,
  TravelerProfile,
} from "@/components/ai-conversion-elements"

const NOMES = ["Ana", "Carlos", "Maria", "João", "Lucia", "Pedro", "Fernanda", "Bruno", "Camila", "Rafael", "Juliana", "Marcos", "Beatriz", "Thiago", "Larissa", "Diego", "Amanda", "Gustavo"]

const LEILOES_INITIAL = [
  {
    id: 1,
    title: "Resort Termas Paradise",
    location: "Caldas Novas",
    category: "hotel",
    startPrice: 500,
    currentBid: 750,
    totalBids: 23,
    bidders: 8,
    timeLeftSeconds: 272,
    endingSoon: true,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/termas-paradise-Np6Qr8Ts2Uf4Xv7Zy1Bw3Dc5Eg9Hj.jpg",
    lastBids: [
      { name: "Ana", value: 750, timestamp: Date.now() - 5000 },
      { name: "Carlos", value: 740, timestamp: Date.now() - 15000 },
      { name: "Maria", value: 720, timestamp: Date.now() - 30000 },
    ],
    rating: 4.9,
    tags: ["spa", "família", "parques"],
    description: "3 noites com café da manhã + acesso ao parque aquático",
  },
  {
    id: 2,
    title: "Hot Park VIP - Fim de Semana",
    location: "Rio Quente",
    category: "parques",
    startPrice: 300,
    currentBid: 480,
    totalBids: 15,
    bidders: 5,
    timeLeftSeconds: 8100,
    endingSoon: false,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hot-park-Jm2Xy9K8RfqL3vN5wT1pA6sD4hB7eC.jpg",
    lastBids: [
      { name: "João", value: 480, timestamp: Date.now() - 8000 },
      { name: "Maria", value: 460, timestamp: Date.now() - 20000 },
    ],
    rating: 4.8,
    tags: ["parques", "aventura", "família"],
    description: "2 dias de ingresso VIP com acesso prioritário",
  },
  {
    id: 3,
    title: "Pacote Caldas Premium - 5 Noites",
    location: "Caldas Novas",
    category: "pacote",
    startPrice: 1200,
    currentBid: 1650,
    totalBids: 31,
    bidders: 12,
    timeLeftSeconds: 23400,
    endingSoon: false,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/diroma-Kp4Mn7Hs8Qf2Lw6Rv3Jx5Bt1Yd9Gc.jpg",
    lastBids: [
      { name: "Pedro", value: 1650, timestamp: Date.now() - 3000 },
      { name: "Lucia", value: 1600, timestamp: Date.now() - 12000 },
    ],
    rating: 4.9,
    tags: ["spa", "casal", "gastronomia"],
    description: "5 noites all inclusive no Diroma Resort",
  },
  {
    id: 4,
    title: "Pousada Recanto das Águas",
    location: "Caldas Novas",
    category: "hotel",
    startPrice: 250,
    currentBid: 380,
    totalBids: 9,
    bidders: 4,
    timeLeftSeconds: 5400,
    endingSoon: false,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/termas-paradise-Np6Qr8Ts2Uf4Xv7Zy1Bw3Dc5Eg9Hj.jpg",
    lastBids: [
      { name: "Fernanda", value: 380, timestamp: Date.now() - 10000 },
      { name: "Bruno", value: 360, timestamp: Date.now() - 25000 },
    ],
    rating: 4.6,
    tags: ["natureza", "relaxamento"],
    description: "2 noites com piscina natural aquecida",
  },
  {
    id: 5,
    title: "Pacote Aventura Rio Quente",
    location: "Rio Quente",
    category: "pacote",
    startPrice: 800,
    currentBid: 1100,
    totalBids: 18,
    bidders: 7,
    timeLeftSeconds: 900,
    endingSoon: true,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hot-park-Jm2Xy9K8RfqL3vN5wT1pA6sD4hB7eC.jpg",
    lastBids: [
      { name: "Gustavo", value: 1100, timestamp: Date.now() - 2000 },
      { name: "Amanda", value: 1080, timestamp: Date.now() - 7000 },
    ],
    rating: 4.7,
    tags: ["aventura", "parques", "amigos"],
    description: "3 noites + Hot Park + tirolesa + rafting",
  },
  {
    id: 6,
    title: "Spa Day Luxo - Casal",
    location: "Caldas Novas",
    category: "experiencia",
    startPrice: 200,
    currentBid: 310,
    totalBids: 12,
    bidders: 6,
    timeLeftSeconds: 14400,
    endingSoon: false,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/diroma-Kp4Mn7Hs8Qf2Lw6Rv3Jx5Bt1Yd9Gc.jpg",
    lastBids: [
      { name: "Camila", value: 310, timestamp: Date.now() - 6000 },
      { name: "Rafael", value: 290, timestamp: Date.now() - 18000 },
    ],
    rating: 5.0,
    tags: ["spa", "casal", "relaxamento"],
    description: "Dia completo de spa para casal com massagem e almoço",
  },
]

function formatSecondsToTime(totalSeconds: number) {
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  return { h, m, s, display: `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}` }
}

function getHeatColor(totalBids: number): { color: string; label: string; percent: number } {
  if (totalBids >= 25) return { color: "#DC2626", label: "Muito Quente", percent: 95 }
  if (totalBids >= 18) return { color: "#EA580C", label: "Quente", percent: 75 }
  if (totalBids >= 12) return { color: "#F59E0B", label: "Aquecendo", percent: 55 }
  if (totalBids >= 6) return { color: "#84CC16", label: "Morno", percent: 35 }
  return { color: "#22C55E", label: "Iniciando", percent: 15 }
}

export default function LeiloesPage() {
  const [leiloes, setLeiloes] = useState(LEILOES_INITIAL)
  const [activeFilter, setActiveFilter] = useState("Todos")
  const [toasts, setToasts] = useState<{ id: number; name: string; value: number; leilaoTitle: string }[]>([])
  const [bidModal, setBidModal] = useState<{ leilaoId: number; currentBid: number; title: string } | null>(null)
  const [customBidAmount, setCustomBidAmount] = useState(0)
  const [onlineCompetitors, setOnlineCompetitors] = useState(47)
  const [profile, setProfile] = useState<TravelerProfile | null>(null)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [toastsPaused, setToastsPaused] = useState(false)
  const toastIdRef = useRef(0)

  const formatPrice = (p: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(p)

  useEffect(() => {
    const p = getTravelerProfile()
    setProfile(p)
    if (!p) {
      const timer = setTimeout(() => setShowProfileModal(true), 3000)
      return () => clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setLeiloes(prev => prev.map(l => ({
        ...l,
        timeLeftSeconds: Math.max(0, l.timeLeftSeconds - 1),
        endingSoon: l.timeLeftSeconds <= 600,
      })))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineCompetitors(prev => {
        const change = Math.floor(Math.random() * 5) - 2
        return Math.max(30, Math.min(80, prev + change))
      })
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const scheduleNext = () => {
      const delay = 8000 + Math.random() * 7000
      return setTimeout(() => {
        if (!toastsPaused) {
          setLeiloes(prev => {
            const activeLeiloes = prev.filter(l => l.timeLeftSeconds > 0)
            if (activeLeiloes.length === 0) return prev
            const randomIndex = Math.floor(Math.random() * activeLeiloes.length)
            const targetId = activeLeiloes[randomIndex].id

            return prev.map(l => {
              if (l.id !== targetId) return l
              const increment = [5, 10, 15, 20, 25][Math.floor(Math.random() * 5)]
              const newBid = l.currentBid + increment
              const bidderName = NOMES[Math.floor(Math.random() * NOMES.length)]

              toastIdRef.current += 1
              const tid = toastIdRef.current
              setToasts(prev => [...prev.slice(-2), { id: tid, name: bidderName, value: newBid, leilaoTitle: l.title }])
              setTimeout(() => setToasts(prev => prev.filter(t => t.id !== tid)), 6000)

              return {
                ...l,
                currentBid: newBid,
                totalBids: l.totalBids + 1,
                bidders: Math.random() > 0.7 ? l.bidders + 1 : l.bidders,
                lastBids: [
                  { name: bidderName, value: newBid, timestamp: Date.now() },
                  ...l.lastBids.slice(0, 4),
                ],
              }
            })
          })
        }
        timerRef = scheduleNext()
      }, delay)
    }
    let timerRef = scheduleNext()
    return () => clearTimeout(timerRef)
  }, [toastsPaused])

  const handleBid = (leilaoId: number, amount: number) => {
    setLeiloes(prev => prev.map(l => {
      if (l.id !== leilaoId) return l
      return {
        ...l,
        currentBid: amount,
        totalBids: l.totalBids + 1,
        lastBids: [
          { name: "Você", value: amount, timestamp: Date.now() },
          ...l.lastBids.slice(0, 4),
        ],
      }
    }))
    setBidModal(null)

    const whatsappMessage = encodeURIComponent(`Olá! Quero confirmar meu lance de ${formatPrice(amount)} no leilão RSV360!`)
    window.open(`https://wa.me/5564993197555?text=${whatsappMessage}`, "_blank")
  }

  const filtered = leiloes.filter((l) => {
    if (activeFilter === "Encerrando") return l.endingSoon
    if (activeFilter === "Hotéis") return l.category === "hotel"
    if (activeFilter === "Pacotes") return l.category === "pacote"
    return true
  })

  const sortedByMatch = [...filtered].sort((a, b) => {
    const scoreA = calculateMatchScore(profile, { category: a.category, price: a.currentBid, tags: a.tags })
    const scoreB = calculateMatchScore(profile, { category: b.category, price: b.currentBid, tags: b.tags })
    return scoreB - scoreA
  })

  const crossSellItems = [
    { name: "Hot Park - Ingresso", price: 189, image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hot-park-Jm2Xy9K8RfqL3vN5wT1pA6sD4hB7eC.jpg", link: "/ingressos", badge: "-30%" },
    { name: "Hotel Diroma Fiori", price: 459, image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/diroma-Kp4Mn7Hs8Qf2Lw6Rv3Jx5Bt1Yd9Gc.jpg", link: "/hoteis", badge: "Popular" },
    { name: "Passeio Termas", price: 89, image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/termas-paradise-Np6Qr8Ts2Uf4Xv7Zy1Bw3Dc5Eg9Hj.jpg", link: "/atracoes" },
  ]

  return (
    <div style={{ background: "#0F172A", minHeight: "100vh", position: "relative" }}>
      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes slideOutRight { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }
        @keyframes fadeInUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes heatPulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(220,38,38,0.3); } 50% { box-shadow: 0 0 12px 4px rgba(220,38,38,0.15); } }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        @keyframes bidFlash { 0% { background: rgba(34,197,94,0.3); } 100% { background: transparent; } }
      `}</style>

      <div style={{ position: "fixed", top: 80, right: 16, zIndex: 10000, display: "flex", flexDirection: "column", gap: 8 }}>
        <button
          data-testid="button-toggle-toasts"
          onClick={() => setToastsPaused(p => !p)}
          style={{
            width: 36, height: 36, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.2)",
            background: "rgba(30,58,95,0.9)", backdropFilter: "blur(8px)",
            color: "#fff", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            alignSelf: "flex-end",
          }}
        >
          {toastsPaused
            ? <Play style={{ width: 14, height: 14, color: "#4ADE80" }} />
            : <Pause style={{ width: 14, height: 14, color: "#F59E0B" }} />
          }
        </button>
        {toasts.map((toast, i) => (
          <div key={toast.id} style={{
            background: "linear-gradient(135deg, #1E3A5F, #2563EB)",
            color: "#fff", padding: "12px 16px", borderRadius: 12,
            boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
            animation: "slideInRight 0.4s ease-out",
            display: "flex", alignItems: "center", gap: 10,
            maxWidth: 320, fontSize: 13, fontWeight: 600,
            border: "1px solid rgba(255,255,255,0.15)",
          }}>
            <Bell style={{ width: 16, height: 16, color: "#F59E0B", flexShrink: 0 }} />
            <span>{toast.name} deu lance de <strong style={{ color: "#22C55E" }}>{formatPrice(toast.value)}</strong></span>
          </div>
        ))}
      </div>

      <div style={{
        background: "linear-gradient(135deg, #0F172A 0%, #1E3A5F 50%, #2563EB 100%)",
        padding: "16px 16px 24px", color: "#fff", position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: -50, right: -50, width: 200, height: 200,
          borderRadius: "50%", background: "rgba(245,124,0,0.1)", filter: "blur(40px)",
        }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Link href="/" data-testid="link-back-home" style={{ color: "#fff", display: "flex" }}>
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
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 4, background: "rgba(220,38,38,0.2)",
              padding: "4px 10px", borderRadius: 20, border: "1px solid rgba(220,38,38,0.3)",
            }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#DC2626", animation: "pulse 1.5s infinite" }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: "#FCA5A5" }}>AO VIVO</span>
            </div>
          </div>
        </div>

        <h1 style={{ fontSize: 28, fontWeight: 900, margin: "0 0 4px", position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 10 }}>
          <Gavel style={{ width: 26, height: 26 }} />
          Leilão Ao Vivo
        </h1>
        <p style={{ fontSize: 13, opacity: 0.85, margin: "0 0 8px", position: "relative", zIndex: 1 }}>
          Dê lances e garanta os melhores preços em hotéis e pacotes!
        </p>

        <div style={{
          display: "flex", alignItems: "center", gap: 8, marginBottom: 16,
          background: "rgba(255,255,255,0.08)", borderRadius: 10, padding: "8px 12px",
          border: "1px solid rgba(255,255,255,0.1)", position: "relative", zIndex: 1,
        }}>
          <Users style={{ width: 16, height: 16, color: "#F59E0B" }} />
          <span data-testid="text-online-competitors" style={{ fontSize: 13, fontWeight: 700, color: "#FDE68A" }}>
            {onlineCompetitors} competidores online agora
          </span>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22C55E", animation: "pulse 1.5s infinite", marginLeft: "auto" }} />
        </div>

        <div style={{ display: "flex", gap: 0, borderBottom: "2px solid rgba(255,255,255,0.15)", position: "relative", zIndex: 1 }}>
          {["Todos", "Encerrando", "Hotéis", "Pacotes"].map((tab) => (
            <button
              key={tab}
              data-testid={`button-filter-${tab.toLowerCase()}`}
              onClick={() => setActiveFilter(tab)}
              style={{
                flex: 1, maxWidth: 120, padding: "10px 0", border: "none", background: "transparent",
                color: activeFilter === tab ? "#fff" : "rgba(255,255,255,0.5)",
                fontSize: 13, fontWeight: activeFilter === tab ? 700 : 500,
                cursor: "pointer", position: "relative",
                borderBottom: activeFilter === tab ? "2px solid #F57C00" : "2px solid transparent",
                marginBottom: -2, transition: "all 0.2s", whiteSpace: "nowrap",
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <SocialProofBanner viewers={onlineCompetitors} pageName="leilões" />
      <PersonalizedBanner profile={profile} />

      {profile && (
        <div data-testid="section-ia-recommends" style={{ padding: "16px 16px 0" }}>
          <div style={{
            background: "linear-gradient(135deg, rgba(37,99,235,0.15), rgba(124,58,237,0.1))",
            border: "1px solid rgba(37,99,235,0.25)",
            borderRadius: 16, padding: 16, marginBottom: 8,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <Sparkles style={{ width: 18, height: 18, color: "#F59E0B" }} />
              <h2 style={{ fontSize: 16, fontWeight: 800, color: "#fff", margin: 0 }}>
                IA Recomenda Para Você
              </h2>
            </div>
            <p style={{ fontSize: 12, color: "#94A3B8", margin: "0 0 12px" }}>
              Baseado no seu perfil de viajante
            </p>
            <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 4 }}>
              {sortedByMatch.slice(0, 3).map((leilao) => {
                const score = calculateMatchScore(profile, { category: leilao.category, price: leilao.currentBid, tags: leilao.tags })
                return (
                  <div
                    key={`rec-${leilao.id}`}
                    data-testid={`card-ia-recommend-${leilao.id}`}
                    style={{
                      minWidth: 200, background: "#1E293B", borderRadius: 12,
                      overflow: "hidden", flexShrink: 0,
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <div style={{ height: 80, position: "relative" }}>
                      <img src={leilao.image} alt={leilao.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      <div style={{ position: "absolute", top: 6, left: 6 }}>
                        <AIRecommendedBadge matchPercent={score} />
                      </div>
                    </div>
                    <div style={{ padding: "8px 10px" }}>
                      <p style={{ fontSize: 12, fontWeight: 700, color: "#fff", margin: "0 0 4px", lineHeight: 1.3 }}>
                        {leilao.title}
                      </p>
                      <span style={{ fontSize: 14, fontWeight: 800, color: "#4ADE80" }}>
                        {formatPrice(leilao.currentBid)}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      <div style={{ padding: "16px 16px 24px", display: "grid", gap: 20 }}>
        {sortedByMatch.map((leilao, idx) => {
          const time = formatSecondsToTime(leilao.timeLeftSeconds)
          const heat = getHeatColor(leilao.totalBids)
          const matchScore = calculateMatchScore(profile, { category: leilao.category, price: leilao.currentBid, tags: leilao.tags })
          const isHovered = hoveredCard === leilao.id
          const isEnding = leilao.timeLeftSeconds <= 600
          const isFinished = leilao.timeLeftSeconds <= 0
          const savings = ((1 - leilao.currentBid / (leilao.startPrice * 3)) * 100).toFixed(0)

          return (
            <div
              key={leilao.id}
              data-testid={`card-leilao-${leilao.id}`}
              onMouseEnter={() => setHoveredCard(leilao.id)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                background: "#1E293B",
                borderRadius: 20,
                overflow: "hidden",
                boxShadow: isHovered
                  ? "0 12px 40px rgba(37,99,235,0.25), 0 0 0 1px rgba(37,99,235,0.3)"
                  : "0 4px 16px rgba(0,0,0,0.3)",
                transform: isHovered ? "translateY(-4px)" : "translateY(0)",
                transition: "all 0.3s ease",
                animation: `fadeInUp 0.6s ease-out ${idx * 0.15}s both`,
                border: isEnding ? "1px solid rgba(220,38,38,0.4)" : "1px solid rgba(255,255,255,0.06)",
                ...(isEnding ? { animation: `fadeInUp 0.6s ease-out ${idx * 0.15}s both, heatPulse 2s infinite` } : {}),
              }}
            >
              <div style={{ height: 180, position: "relative", overflow: "hidden" }}>
                <img
                  src={leilao.image}
                  alt={leilao.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s", transform: isHovered ? "scale(1.08)" : "scale(1)" }}
                />
                <div style={{
                  position: "absolute", inset: 0,
                  background: "linear-gradient(to top, rgba(15,23,42,0.95) 0%, rgba(15,23,42,0.3) 50%, transparent 100%)",
                }} />

                {isEnding && !isFinished && (
                  <div style={{
                    position: "absolute", top: 0, left: 0, right: 0,
                    background: "linear-gradient(90deg, #DC2626, #B91C1C)",
                    color: "#fff", padding: "6px 0", textAlign: "center", fontSize: 12, fontWeight: 700,
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                    animation: "pulse 1.5s infinite",
                  }}>
                    <Clock style={{ width: 14, height: 14 }} />
                    ENCERRANDO EM BREVE!
                  </div>
                )}

                {isFinished && (
                  <div style={{
                    position: "absolute", inset: 0, background: "rgba(0,0,0,0.7)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <span style={{ fontSize: 20, fontWeight: 900, color: "#fff", textTransform: "uppercase" }}>
                      Encerrado
                    </span>
                  </div>
                )}

                <div style={{ position: "absolute", top: 12, left: 12, display: "flex", gap: 6, flexWrap: "wrap" }}>
                  <AIRecommendedBadge matchPercent={matchScore} />
                  {Number(savings) > 50 && (
                    <div style={{
                      display: "inline-flex", alignItems: "center", gap: 4,
                      background: "rgba(34,197,94,0.2)", border: "1px solid rgba(34,197,94,0.4)",
                      borderRadius: 8, padding: "3px 8px",
                    }}>
                      <Zap style={{ width: 12, height: 12, color: "#22C55E" }} />
                      <span style={{ fontSize: 11, fontWeight: 700, color: "#22C55E" }}>-{savings}%</span>
                    </div>
                  )}
                </div>

                <div style={{ position: "absolute", top: 12, right: 12 }}>
                  <div style={{
                    background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)",
                    borderRadius: 8, padding: "4px 8px", display: "flex", alignItems: "center", gap: 4,
                  }}>
                    <Star style={{ width: 12, height: 12, color: "#F59E0B", fill: "#F59E0B" }} />
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>{leilao.rating}</span>
                  </div>
                </div>

                <div style={{ position: "absolute", bottom: 12, left: 12, right: 12 }}>
                  <h2 style={{ fontSize: 18, fontWeight: 800, color: "#fff", margin: "0 0 2px", textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>
                    {leilao.title}
                  </h2>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <MapPin style={{ width: 12, height: 12, color: "#94A3B8" }} />
                    <span style={{ fontSize: 12, color: "#94A3B8" }}>{leilao.location}</span>
                    <span style={{ fontSize: 11, color: "#64748B", marginLeft: 8 }}>{leilao.description}</span>
                  </div>
                </div>
              </div>

              <div style={{ padding: "16px 16px 4px" }}>
                <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                  <div style={{
                    flex: 1, background: isEnding ? "rgba(220,38,38,0.1)" : "rgba(37,99,235,0.1)",
                    borderRadius: 12, padding: "10px 12px", textAlign: "center",
                    border: `1px solid ${isEnding ? "rgba(220,38,38,0.2)" : "rgba(37,99,235,0.2)"}`,
                  }}>
                    <div style={{
                      fontSize: 24, fontWeight: 900, fontFamily: "monospace",
                      color: isEnding ? "#FCA5A5" : "#93C5FD",
                      letterSpacing: 2,
                      animation: isEnding ? "pulse 1s infinite" : "none",
                    }}>
                      {isFinished ? "00:00:00" : time.display}
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 600, color: isEnding ? "#FCA5A5" : "#64748B" }}>
                      {isFinished ? "ENCERRADO" : isEnding ? "ACABA EM BREVE" : "restante"}
                    </span>
                  </div>

                  <div style={{
                    flex: 1, background: "rgba(34,197,94,0.1)",
                    borderRadius: 12, padding: "10px 12px", textAlign: "center",
                    border: "1px solid rgba(34,197,94,0.2)",
                  }}>
                    <p style={{ fontSize: 11, color: "#64748B", margin: "0 0 2px" }}>Lance Atual</p>
                    <div data-testid={`text-current-bid-${leilao.id}`} style={{ fontSize: 22, fontWeight: 900, color: "#4ADE80" }}>
                      {formatPrice(leilao.currentBid)}
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <Flame style={{ width: 14, height: 14, color: heat.color }} />
                      <span style={{ fontSize: 11, fontWeight: 700, color: heat.color }}>{heat.label}</span>
                    </div>
                    <span style={{ fontSize: 11, color: "#64748B" }}>{leilao.totalBids} lances</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 3, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                    <div style={{
                      height: "100%", borderRadius: 3, width: `${heat.percent}%`,
                      background: `linear-gradient(90deg, #22C55E, ${heat.color})`,
                      transition: "width 0.5s ease, background 0.5s ease",
                    }} />
                  </div>
                </div>

                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 16,
                  marginBottom: 12, fontSize: 12, color: "#64748B",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <TrendingUp style={{ width: 14, height: 14, color: "#3B82F6" }} />
                    {leilao.totalBids} lances
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <Users style={{ width: 14, height: 14, color: "#8B5CF6" }} />
                    {leilao.bidders} competidores
                  </div>
                </div>

                <div style={{ marginBottom: 12, maxHeight: 80, overflow: "hidden" }}>
                  <p style={{ margin: "0 0 6px", fontWeight: 700, fontSize: 12, color: "#94A3B8" }}>Últimos Lances:</p>
                  {leilao.lastBids.slice(0, 3).map((bid, i) => (
                    <div key={i} style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      padding: "3px 8px", borderRadius: 6, marginBottom: 2, fontSize: 12,
                      background: i === 0 ? "rgba(34,197,94,0.08)" : "transparent",
                      color: "#94A3B8",
                    }}>
                      <span style={{ fontWeight: i === 0 ? 700 : 400, color: i === 0 ? "#4ADE80" : "#94A3B8" }}>
                        {bid.name}
                      </span>
                      <span style={{ fontWeight: 700, color: i === 0 ? "#4ADE80" : "#94A3B8" }}>
                        {formatPrice(bid.value)}
                      </span>
                    </div>
                  ))}
                </div>

                {!isFinished && (
                  <button
                    data-testid={`button-bid-${leilao.id}`}
                    onClick={() => {
                      setBidModal({ leilaoId: leilao.id, currentBid: leilao.currentBid, title: leilao.title })
                      setCustomBidAmount(leilao.currentBid + 10)
                    }}
                    style={{
                      width: "100%", padding: "14px 0", borderRadius: 12, border: "none",
                      background: "linear-gradient(135deg, #22C55E, #16A34A)",
                      color: "#fff", fontSize: 16, fontWeight: 800, cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      boxShadow: "0 6px 20px rgba(34,197,94,0.3)",
                      transition: "all 0.2s",
                      transform: isHovered ? "scale(1.02)" : "scale(1)",
                    }}
                  >
                    <Gavel style={{ width: 18, height: 18 }} />
                    DAR LANCE
                  </button>
                )}

                <UrgencyIndicator roomsLeft={Math.max(1, 5 - Math.floor(leilao.totalBids / 8))} />
              </div>
            </div>
          )
        })}
      </div>

      <CrossSellSection title="Enquanto espera, veja também..." items={crossSellItems} />

      <div style={{ height: 100 }} />

      {bidModal && (
        <div
          onClick={() => setBidModal(null)}
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)",
            display: "flex", alignItems: "flex-end", justifyContent: "center",
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: "#1E293B", borderRadius: "20px 20px 0 0",
              width: "100%", maxWidth: 480, padding: "24px 20px 32px",
              animation: "fadeInUp 0.3s ease-out",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: "#fff", margin: "0 0 4px" }}>
                  Dar Lance
                </h3>
                <p style={{ fontSize: 13, color: "#94A3B8", margin: 0 }}>{bidModal.title}</p>
              </div>
              <button
                data-testid="button-close-bid-modal"
                onClick={() => setBidModal(null)}
                style={{
                  width: 36, height: 36, borderRadius: "50%", border: "none",
                  background: "rgba(255,255,255,0.1)", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                <X style={{ width: 18, height: 18, color: "#94A3B8" }} />
              </button>
            </div>

            <div style={{
              background: "rgba(34,197,94,0.1)", borderRadius: 12, padding: 16,
              textAlign: "center", marginBottom: 16, border: "1px solid rgba(34,197,94,0.2)",
            }}>
              <p style={{ fontSize: 12, color: "#94A3B8", margin: "0 0 4px" }}>Lance atual</p>
              <span style={{ fontSize: 28, fontWeight: 900, color: "#4ADE80" }}>
                {formatPrice(bidModal.currentBid)}
              </span>
            </div>

            <p style={{ fontSize: 13, fontWeight: 700, color: "#94A3B8", margin: "0 0 10px" }}>
              Incrementos sugeridos:
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8, marginBottom: 16 }}>
              {[10, 25, 50, 100].map(inc => (
                <button
                  key={inc}
                  data-testid={`button-increment-${inc}`}
                  onClick={() => setCustomBidAmount(bidModal.currentBid + inc)}
                  style={{
                    padding: "10px 0", borderRadius: 10,
                    border: customBidAmount === bidModal.currentBid + inc
                      ? "2px solid #2563EB"
                      : "1px solid rgba(255,255,255,0.1)",
                    background: customBidAmount === bidModal.currentBid + inc
                      ? "rgba(37,99,235,0.15)"
                      : "rgba(255,255,255,0.05)",
                    color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  +R${inc}
                </button>
              ))}
            </div>

            <div style={{
              display: "flex", alignItems: "center", gap: 12, marginBottom: 20,
              background: "rgba(255,255,255,0.05)", borderRadius: 12, padding: "8px 12px",
              border: "1px solid rgba(255,255,255,0.1)",
            }}>
              <button
                data-testid="button-bid-decrease"
                onClick={() => setCustomBidAmount(prev => Math.max(bidModal.currentBid + 5, prev - 5))}
                style={{
                  width: 36, height: 36, borderRadius: 8, border: "none",
                  background: "rgba(255,255,255,0.1)", color: "#fff", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                <Minus style={{ width: 16, height: 16 }} />
              </button>
              <div style={{ flex: 1, textAlign: "center" }}>
                <span style={{ fontSize: 11, color: "#64748B" }}>Seu lance</span>
                <div style={{ fontSize: 24, fontWeight: 900, color: "#fff" }}>
                  {formatPrice(customBidAmount)}
                </div>
              </div>
              <button
                data-testid="button-bid-increase"
                onClick={() => setCustomBidAmount(prev => prev + 5)}
                style={{
                  width: 36, height: 36, borderRadius: 8, border: "none",
                  background: "rgba(255,255,255,0.1)", color: "#fff", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                <Plus style={{ width: 16, height: 16 }} />
              </button>
            </div>

            <button
              data-testid="button-confirm-bid"
              onClick={() => handleBid(bidModal.leilaoId, customBidAmount)}
              style={{
                width: "100%", padding: "16px 0", borderRadius: 12, border: "none",
                background: "linear-gradient(135deg, #22C55E, #16A34A)",
                color: "#fff", fontSize: 17, fontWeight: 800, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                boxShadow: "0 6px 20px rgba(34,197,94,0.4)",
              }}
            >
              <Gavel style={{ width: 20, height: 20 }} />
              CONFIRMAR LANCE DE {formatPrice(customBidAmount)}
            </button>

            <p style={{ fontSize: 11, color: "#64748B", textAlign: "center", marginTop: 10 }}>
              Ao confirmar, você será redirecionado ao WhatsApp para finalizar
            </p>
          </div>
        </div>
      )}

      {showProfileModal && (
        <TravelerProfileModal
          onClose={() => setShowProfileModal(false)}
          onSave={(p) => setProfile(p)}
        />
      )}
    </div>
  )
}
