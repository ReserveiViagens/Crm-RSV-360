import { useState, useEffect, useCallback, useRef } from "react"
import { Zap, Clock, ArrowLeft, Star, MapPin, ChevronRight, Phone, Eye, ShoppingCart, Sparkles, TrendingUp, Check, AlertTriangle } from "lucide-react"
import { Link } from "wouter";
import {
  SocialProofBanner,
  AIRecommendedBadge,
  calculateMatchScore,
  getTravelerProfile,
  UrgencyIndicator,
  CrossSellSection,
  TravelerProfile,
} from "@/components/ai-conversion-elements"

const FLASH_DEALS = [
  {
    id: 1,
    title: "Resort Termas Paradise",
    location: "Caldas Novas",
    originalPrice: 1899,
    price: 569,
    discount: 70,
    soldPercent: 92,
    timeLeft: "02:32:18",
    roomsLeft: 2,
    rating: 4.9,
    reviews: 856,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/termas-paradise-Np6Qr8Ts2Uf4Xv7Zy1Bw3Dc5Eg9Hj.jpg",
    category: "natureza",
    tags: ["família", "spa", "piscinas termais"],
  },
  {
    id: 2,
    title: "Hot Park - Passe Família",
    location: "Rio Quente",
    originalPrice: 799,
    price: 349,
    discount: 56,
    soldPercent: 75,
    timeLeft: "06:45:33",
    roomsLeft: 5,
    rating: 4.8,
    reviews: 2341,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hot-park-Jm2Xy9K8RfqL3vN5wT1pA6sD4hB7eC.jpg",
    category: "parques",
    tags: ["família", "aventura", "parque aquático"],
  },
  {
    id: 3,
    title: "DiRoma Internacional",
    location: "Caldas Novas",
    originalPrice: 1299,
    price: 649,
    discount: 50,
    soldPercent: 62,
    timeLeft: "12:15:45",
    roomsLeft: 8,
    rating: 4.7,
    reviews: 1654,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/diroma-Kp4Mn7Hs8Qf2Lw6Rv3Jx5Bt1Yd9Gc.jpg",
    category: "natureza",
    tags: ["casal", "spa", "resort"],
  },
  {
    id: 4,
    title: "Lagoa Quente Flat",
    location: "Caldas Novas",
    originalPrice: 989,
    price: 449,
    discount: 55,
    soldPercent: 45,
    timeLeft: "23:00:00",
    roomsLeft: 12,
    rating: 4.6,
    reviews: 987,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/water-park-Lq8Rs2Ut4Wv6Xy9Ab1Cd3Ef5Gh7Ij.jpg",
    category: "natureza",
    tags: ["família", "econômico", "flat"],
  },
  {
    id: 5,
    title: "Pousada do Rio Quente",
    location: "Rio Quente",
    originalPrice: 1450,
    price: 580,
    discount: 60,
    soldPercent: 88,
    timeLeft: "03:20:10",
    roomsLeft: 3,
    rating: 4.8,
    reviews: 1122,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/termas-paradise-Np6Qr8Ts2Uf4Xv7Zy1Bw3Dc5Eg9Hj.jpg",
    category: "natureza",
    tags: ["casal", "romântico", "spa"],
  },
  {
    id: 6,
    title: "Náutico Praia Clube",
    location: "Caldas Novas",
    originalPrice: 1199,
    price: 479,
    discount: 60,
    soldPercent: 70,
    timeLeft: "08:50:25",
    roomsLeft: 6,
    rating: 4.5,
    reviews: 743,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hot-park-Jm2Xy9K8RfqL3vN5wT1pA6sD4hB7eC.jpg",
    category: "parques",
    tags: ["família", "amigos", "esportes"],
  },
]

const FILTERS = ["Todas", "Maior Desconto", "Acabando", "Menor Preço", "IA Recomenda"]

const NAMES = ["Ana", "Carlos", "Maria", "João", "Lucia", "Pedro", "Fernanda", "Bruno", "Camila", "Rafael", "Beatriz", "Marcos"]
const CITIES = ["São Paulo", "Goiânia", "Brasília", "BH", "Uberlândia", "Cuiabá", "Campo Grande", "Ribeirão Preto", "Anápolis"]

function parseTimeLeft(tl: string): number {
  const parts = tl.split(":").map(Number)
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2]
  if (parts.length === 2) return parts[0] * 3600 + parts[1] * 60
  return 0
}

function formatSeconds(s: number): string {
  if (s <= 0) return "00:00:00"
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`
}

interface ConfettiParticle {
  id: number
  x: number
  y: number
  color: string
  size: number
  rotation: number
  velocityX: number
  velocityY: number
}

function ConfettiOverlay({ active, onComplete }: { active: boolean; onComplete: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<ConfettiParticle[]>([])
  const animFrameRef = useRef<number>(0)

  useEffect(() => {
    if (!active || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const colors = ["#DC2626", "#22C55E", "#2563EB", "#F59E0B", "#8B5CF6", "#EC4899", "#FDE68A"]
    const particles: ConfettiParticle[] = []

    for (let i = 0; i < 80; i++) {
      particles.push({
        id: i,
        x: canvas.width / 2 + (Math.random() - 0.5) * 200,
        y: canvas.height / 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        rotation: Math.random() * 360,
        velocityX: (Math.random() - 0.5) * 16,
        velocityY: Math.random() * -18 - 4,
      })
    }
    particlesRef.current = particles

    let frame = 0
    const maxFrames = 90

    const animate = () => {
      frame++
      if (frame > maxFrames) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        onComplete()
        return
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const gravity = 0.4

      particles.forEach(p => {
        p.x += p.velocityX
        p.y += p.velocityY
        p.velocityY += gravity
        p.velocityX *= 0.98
        p.rotation += p.velocityX * 2

        const opacity = Math.max(0, 1 - frame / maxFrames)
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate((p.rotation * Math.PI) / 180)
        ctx.globalAlpha = opacity
        ctx.fillStyle = p.color
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6)
        ctx.restore()
      })

      animFrameRef.current = requestAnimationFrame(animate)
    }

    animFrameRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animFrameRef.current)
  }, [active, onComplete])

  if (!active) return null

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        pointerEvents: "none",
      }}
    />
  )
}

function ReservationFeedback({ dealTitle, visible, onDone }: { dealTitle: string; visible: boolean; onDone: () => void }) {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onDone, 2200)
      return () => clearTimeout(timer)
    }
  }, [visible, onDone])

  if (!visible) return null

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9998,
      display: "flex", alignItems: "center", justifyContent: "center",
      pointerEvents: "none",
    }}>
      <div style={{
        background: "#fff", borderRadius: 20, padding: "28px 36px",
        boxShadow: "0 12px 40px rgba(0,0,0,0.25)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
        animation: "feedbackPopIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: "50%",
          background: "linear-gradient(135deg, #22C55E, #16A34A)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Check style={{ width: 28, height: 28, color: "#fff" }} />
        </div>
        <span style={{ fontSize: 18, fontWeight: 800, color: "#1F2937" }}>Reserva Iniciada!</span>
        <span style={{ fontSize: 13, color: "#6B7280", textAlign: "center", maxWidth: 220 }}>
          Redirecionando para o WhatsApp para confirmar {dealTitle}
        </span>
      </div>
    </div>
  )
}

export default function FlashDealsPage() {
  const [timers, setTimers] = useState<Record<number, number>>({})
  const [globalTimer, setGlobalTimer] = useState(4 * 3600 + 27 * 60 + 33)
  const [activeFilter, setActiveFilter] = useState("Todas")
  const [animatedBars, setAnimatedBars] = useState(false)
  const [profile, setProfile] = useState<TravelerProfile | null>(null)
  const [matchScores, setMatchScores] = useState<Record<number, number>>({})
  const [viewerCounts, setViewerCounts] = useState<Record<number, number>>({})
  const [notification, setNotification] = useState<string | null>(null)
  const [notificationVisible, setNotificationVisible] = useState(false)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [confettiActive, setConfettiActive] = useState(false)
  const [feedbackDeal, setFeedbackDeal] = useState<{ title: string; url: string } | null>(null)
  const [feedbackVisible, setFeedbackVisible] = useState(false)

  useEffect(() => {
    const initial: Record<number, number> = {}
    FLASH_DEALS.forEach(d => { initial[d.id] = parseTimeLeft(d.timeLeft) })
    setTimers(initial)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setTimers(prev => {
        const next = { ...prev }
        Object.keys(next).forEach(k => {
          const key = Number(k)
          if (next[key] > 0) next[key] = next[key] - 1
        })
        return next
      })
      setGlobalTimer(prev => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedBars(true), 300)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const p = getTravelerProfile()
    setProfile(p)
    const scores: Record<number, number> = {}
    FLASH_DEALS.forEach(d => {
      scores[d.id] = calculateMatchScore(p, { category: d.category, price: d.price, tags: d.tags })
    })
    setMatchScores(scores)
  }, [])

  useEffect(() => {
    const initial: Record<number, number> = {}
    FLASH_DEALS.forEach(d => { initial[d.id] = Math.floor(Math.random() * 20) + 5 })
    setViewerCounts(initial)
    const interval = setInterval(() => {
      setViewerCounts(prev => {
        const next = { ...prev }
        const dealId = FLASH_DEALS[Math.floor(Math.random() * FLASH_DEALS.length)].id
        next[dealId] = Math.max(3, (next[dealId] || 10) + Math.floor(Math.random() * 5) - 2)
        return next
      })
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const showNotification = () => {
      const name = NAMES[Math.floor(Math.random() * NAMES.length)]
      const city = CITIES[Math.floor(Math.random() * CITIES.length)]
      const deal = FLASH_DEALS[Math.floor(Math.random() * FLASH_DEALS.length)]
      setNotification(`${name} de ${city} acabou de comprar ${deal.title}!`)
      setNotificationVisible(true)
      setTimeout(() => setNotificationVisible(false), 4000)
    }
    const timeout = setTimeout(showNotification, 3000)
    const interval = setInterval(showNotification, 12000)
    return () => { clearTimeout(timeout); clearInterval(interval) }
  }, [])

  const formatPrice = (p: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(p)

  const getFilteredDeals = useCallback(() => {
    switch (activeFilter) {
      case "Maior Desconto":
        return [...FLASH_DEALS].sort((a, b) => b.discount - a.discount)
      case "Acabando":
        return [...FLASH_DEALS].sort((a, b) => a.roomsLeft - b.roomsLeft)
      case "Menor Preço":
        return [...FLASH_DEALS].sort((a, b) => a.price - b.price)
      case "IA Recomenda":
        return [...FLASH_DEALS].sort((a, b) => (matchScores[b.id] || 0) - (matchScores[a.id] || 0))
      default:
        return FLASH_DEALS
    }
  }, [activeFilter, matchScores])

  const filteredDeals = getFilteredDeals()

  const topIADeals = [...FLASH_DEALS]
    .sort((a, b) => (matchScores[b.id] || 0) - (matchScores[a.id] || 0))
    .slice(0, 3)

  const handleReserveClick = (deal: typeof FLASH_DEALS[0], e: React.MouseEvent) => {
    e.preventDefault()
    const url = `https://wa.me/5564993197555?text=Ol%C3%A1!%20Quero%20reservar%20${encodeURIComponent(deal.title)}%20com%20${deal.discount}%25%20de%20desconto!`
    setFeedbackDeal({ title: deal.title, url })
    setConfettiActive(true)
    setFeedbackVisible(true)
  }

  const handleFeedbackDone = useCallback(() => {
    setFeedbackVisible(false)
    if (feedbackDeal) {
      window.open(feedbackDeal.url, "_blank", "noopener,noreferrer")
    }
    setFeedbackDeal(null)
  }, [feedbackDeal])

  const crossSellItems = [
    { name: "Ingresso Hot Park", price: 189, link: "/ingressos", badge: "-30%" },
    { name: "Passeio Lago Corumbá", price: 89, link: "/atracoes", badge: "Novo" },
    { name: "Tour Gastronômico", price: 149, link: "/atracoes", badge: "Popular" },
    { name: "Day Use Spa", price: 129, link: "/hoteis", badge: "-25%" },
  ]

  return (
    <div className="rsv-subpage" style={{ background: "#F9FAFB", minHeight: "100vh", paddingBottom: 0 }}>
      <ConfettiOverlay active={confettiActive} onComplete={() => setConfettiActive(false)} />
      <ReservationFeedback
        dealTitle={feedbackDeal?.title || ""}
        visible={feedbackVisible}
        onDone={handleFeedbackDone}
      />

      <div style={{
        background: "linear-gradient(135deg, #DC2626 0%, #F57C00 100%)",
        padding: "16px 16px 24px", color: "#fff",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Link href="/" style={{ color: "#fff", display: "flex" }} data-testid="link-back-home">
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
          <Zap style={{ width: 28, height: 28 }} />
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 900, margin: "0 0 4px" }} data-testid="text-page-title">
          <Zap style={{ width: 22, height: 22, display: "inline", verticalAlign: "middle", marginRight: 4 }} />
          Ofertas Relâmpago
        </h1>
        <p style={{ fontSize: 13, opacity: 0.9, margin: "0 0 14px" }}>
          Ofertas por tempo limitado com descontos de até 70%!
        </p>
        <div style={{
          display: "flex", alignItems: "center", gap: 12,
          background: globalTimer < 3600 ? "rgba(220,38,38,0.35)" : "rgba(0,0,0,0.25)",
          borderRadius: 14, padding: "14px 18px",
          backdropFilter: "blur(4px)",
          animation: globalTimer < 3600 ? "globalCountdownPulse 2s ease-in-out infinite" : "none",
          border: globalTimer < 3600 ? "1px solid rgba(255,255,255,0.2)" : "1px solid transparent",
          transition: "background 0.5s ease, border 0.5s ease",
        }} data-testid="countdown-global">
          <Clock style={{ width: 20, height: 20, flexShrink: 0 }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <span style={{ fontSize: 11, fontWeight: 600, opacity: 0.85, textTransform: "uppercase", letterSpacing: 0.5 }}>
              {globalTimer < 3600 ? "Encerrando em breve!" : "Próxima rodada em"}
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {formatSeconds(globalTimer).split(":").map((segment, idx) => (
                <span key={idx} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{
                    fontSize: 26, fontWeight: 900, fontVariantNumeric: "tabular-nums",
                    letterSpacing: 1, background: "rgba(255,255,255,0.15)",
                    borderRadius: 8, padding: "2px 8px", minWidth: 42, textAlign: "center",
                    display: "inline-block",
                  }}>
                    {segment}
                  </span>
                  {idx < 2 && <span style={{ fontSize: 22, fontWeight: 900, opacity: 0.7 }}>:</span>}
                </span>
              ))}
            </div>
          </div>
          {globalTimer < 3600 && (
            <AlertTriangle style={{ width: 18, height: 18, color: "#FDE68A", flexShrink: 0, marginLeft: "auto" }} />
          )}
        </div>
      </div>

      <div style={{
        display: "flex", gap: 0, padding: "0 16px",
        background: "#fff",
        borderBottom: "2px solid #E5E7EB",
        overflowX: "auto",
      }}>
        {FILTERS.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            data-testid={`button-filter-${filter.toLowerCase().replace(/\s/g, "-")}`}
            style={{
              flex: "0 0 auto", padding: "12px 14px", border: "none",
              fontSize: 13, fontWeight: activeFilter === filter ? 700 : 500,
              cursor: "pointer", background: "transparent",
              color: activeFilter === filter ? "#DC2626" : "#6B7280",
              borderBottom: activeFilter === filter ? "2px solid #DC2626" : "2px solid transparent",
              marginBottom: -2, transition: "all 0.2s", whiteSpace: "nowrap",
              display: "flex", alignItems: "center", gap: 4,
            }}
          >
            {filter === "IA Recomenda" && <Sparkles style={{ width: 12, height: 12 }} />}
            {filter}
          </button>
        ))}
      </div>

      <SocialProofBanner pageName="ofertas relâmpago" />

      {profile && (
        <div style={{
          margin: "16px 16px 0", padding: "20px", borderRadius: 16,
          background: "linear-gradient(135deg, #1E3A5F 0%, #2563EB 100%)",
          color: "#fff", position: "relative", overflow: "hidden",
        }} data-testid="section-ai-hero">
          <div style={{
            position: "absolute", top: -20, right: -20, width: 100, height: 100,
            borderRadius: "50%", background: "rgba(255,255,255,0.08)",
          }} />
          <div style={{
            position: "absolute", bottom: -30, left: -30, width: 80, height: 80,
            borderRadius: "50%", background: "rgba(255,255,255,0.05)",
          }} />
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, position: "relative" }}>
            <Sparkles style={{ width: 20, height: 20, color: "#FDE68A" }} />
            <span style={{ fontSize: 14, fontWeight: 800, color: "#FDE68A", letterSpacing: 0.5 }}>
              OFERTAS SELECIONADAS PARA VOCÊ
            </span>
          </div>
          <p style={{ fontSize: 13, opacity: 0.85, margin: "0 0 16px", lineHeight: 1.5, position: "relative" }}>
            Baseado no seu perfil, a IA encontrou ofertas com alto match para você
          </p>
          <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4, position: "relative" }}>
            {topIADeals.map(deal => {
              const score = matchScores[deal.id] || 75
              return (
                <div key={deal.id} style={{
                  minWidth: 150, background: "rgba(255,255,255,0.12)", borderRadius: 12,
                  padding: 12, flexShrink: 0, backdropFilter: "blur(4px)",
                  border: "1px solid rgba(255,255,255,0.15)",
                }} data-testid={`card-ai-pick-${deal.id}`}>
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: 4, marginBottom: 8,
                    background: score >= 85 ? "rgba(34,197,94,0.3)" : "rgba(37,99,235,0.3)",
                    borderRadius: 6, padding: "3px 8px",
                  }}>
                    <Sparkles style={{ width: 10, height: 10 }} />
                    <span style={{ fontSize: 11, fontWeight: 700 }}>{score}% match</span>
                  </div>
                  <p style={{ fontSize: 13, fontWeight: 700, margin: "0 0 4px", lineHeight: 1.3 }}>{deal.title}</p>
                  <span style={{ fontSize: 16, fontWeight: 900, color: "#86EFAC" }}>
                    {formatPrice(deal.price)}
                  </span>
                  <span style={{ fontSize: 11, opacity: 0.7, display: "block", marginTop: 2 }}>
                    -{deal.discount}% OFF
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {!profile && (
        <div style={{
          margin: "16px 16px 0", padding: "20px", borderRadius: 16,
          background: "linear-gradient(135deg, #EFF6FF, #F5F3FF)",
          border: "1px solid #C4B5FD", position: "relative", overflow: "hidden",
        }} data-testid="section-no-profile-cta">
          <div style={{
            position: "absolute", top: -15, right: -15, width: 70, height: 70,
            borderRadius: "50%", background: "rgba(124,58,237,0.06)",
          }} />
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <Sparkles style={{ width: 20, height: 20, color: "#7C3AED" }} />
            <span style={{ fontSize: 14, fontWeight: 800, color: "#7C3AED", letterSpacing: 0.3 }}>
              OFERTAS PERSONALIZADAS POR IA
            </span>
          </div>
          <p style={{ fontSize: 13, color: "#4B5563", margin: "0 0 14px", lineHeight: 1.5 }}>
            Responda 4 perguntas rápidas e descubra ofertas com desconto exclusivo que combinam com o seu perfil de viajante!
          </p>
          <button
            onClick={() => {
              const event = new CustomEvent("openTravelerProfile")
              window.dispatchEvent(event)
            }}
            data-testid="button-create-profile-cta"
            style={{
              padding: "12px 24px", borderRadius: 12, border: "none",
              background: "linear-gradient(135deg, #7C3AED, #6D28D9)",
              color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer",
              display: "inline-flex", alignItems: "center", gap: 8,
              boxShadow: "0 4px 14px rgba(124,58,237,0.3)",
            }}
          >
            <Sparkles style={{ width: 16, height: 16 }} />
            Descobrir Minhas Ofertas Ideais
            <ChevronRight style={{ width: 16, height: 16 }} />
          </button>
        </div>
      )}

      <div style={{
        margin: "16px 16px 0", padding: "14px 18px",
        background: "linear-gradient(135deg, #FEF3C7, #FDE68A)",
        borderRadius: 12, display: "flex", alignItems: "center", gap: 10,
        border: "1px solid #F59E0B",
      }}>
        <Zap style={{ width: 22, height: 22, color: "#D97706", flexShrink: 0 }} />
        <div>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#92400E" }}>
            <Zap style={{ width: 14, height: 14, display: "inline", verticalAlign: "middle", color: "#D97706" }} /> {FLASH_DEALS.length} ofertas relâmpago disponíveis agora!
          </span>
          <span style={{ fontSize: 12, color: "#A16207", display: "block", marginTop: 2 }}>
            Garanta antes que acabe — preços exclusivos por tempo limitado
          </span>
        </div>
      </div>

      {activeFilter === "IA Recomenda" && (
        <div style={{
          margin: "16px 16px 0", padding: "12px 16px", borderRadius: 12,
          background: "linear-gradient(135deg, #EFF6FF, #F0FDF4)",
          border: "1px solid #93C5FD",
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <TrendingUp style={{ width: 18, height: 18, color: "#2563EB", flexShrink: 0 }} />
          <div>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#1E40AF" }}>
              <Sparkles style={{ width: 12, height: 12, display: "inline", verticalAlign: "middle", color: "#2563EB" }} /> IA Recomenda Para Você
            </span>
            <span style={{ fontSize: 11, color: "#6B7280", display: "block", marginTop: 2 }}>
              Ordenado pelo match com seu perfil de viajante
            </span>
          </div>
        </div>
      )}

      <div className="rsv-subpage-grid" style={{ padding: "16px 16px 24px" }}>
        {filteredDeals.map((deal, cardIndex) => {
          const timeLeft = timers[deal.id] ?? parseTimeLeft(deal.timeLeft)
          const isHovered = hoveredCard === deal.id
          const matchScore = matchScores[deal.id] || 75
          const viewers = viewerCounts[deal.id] || 10
          const isUnder1Hour = timeLeft < 3600 && timeLeft > 0
          const barDelay = 0.3 + cardIndex * 0.15

          return (
            <div
              key={deal.id}
              data-testid={`card-deal-${deal.id}`}
              onMouseEnter={() => setHoveredCard(deal.id)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                background: "#fff", borderRadius: 16, overflow: "hidden",
                boxShadow: isHovered
                  ? "0 8px 30px rgba(0,0,0,0.18)"
                  : "0 2px 16px rgba(0,0,0,0.1)",
                transform: isHovered ? "scale(1.02)" : "scale(1)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease, opacity 0.5s ease",
                position: "relative",
                animation: `cardStaggerIn 0.5s ease-out ${cardIndex * 0.1}s both`,
              }}
            >
              <div style={{
                height: 200, position: "relative", overflow: "hidden",
              }}>
                <img
                  src={deal.image}
                  alt={deal.title}
                  style={{
                    width: "100%", height: "100%", objectFit: "cover",
                    transition: "transform 0.4s ease",
                    transform: isHovered ? "scale(1.08)" : "scale(1)",
                  }}
                />
                <div style={{
                  position: "absolute", inset: 0,
                  background: "linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.5) 100%)",
                }} />

                <div style={{
                  position: "absolute", top: 12, left: 12,
                  background: "#DC2626", color: "#fff", padding: "5px 12px",
                  borderRadius: 8, fontSize: 14, fontWeight: 800,
                  boxShadow: "0 2px 8px rgba(220,38,38,0.4)",
                }}>-{deal.discount}% OFF</div>

                <div style={{
                  position: "absolute", top: 12, right: 12,
                  display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end",
                }}>
                  <div style={{
                    background: isUnder1Hour ? "rgba(220,38,38,0.9)" : "rgba(0,0,0,0.7)",
                    color: "#fff", padding: isUnder1Hour ? "8px 14px" : "5px 10px",
                    borderRadius: isUnder1Hour ? 10 : 8,
                    fontSize: isUnder1Hour ? 18 : 13,
                    fontWeight: isUnder1Hour ? 900 : 700,
                    display: "flex", alignItems: "center", gap: 6,
                    backdropFilter: "blur(4px)",
                    fontVariantNumeric: "tabular-nums",
                    animation: isUnder1Hour ? "countdownPulse 1.5s ease-in-out infinite" : "none",
                    boxShadow: isUnder1Hour ? "0 2px 12px rgba(220,38,38,0.5)" : "none",
                  }} data-testid={`countdown-deal-${deal.id}`}>
                    <Clock style={{ width: isUnder1Hour ? 16 : 12, height: isUnder1Hour ? 16 : 12 }} />
                    {formatSeconds(timeLeft)}
                    {isUnder1Hour && (
                      <AlertTriangle style={{ width: 14, height: 14, marginLeft: 2 }} />
                    )}
                  </div>
                  <AIRecommendedBadge matchPercent={matchScore} />
                </div>

                <div style={{
                  position: "absolute", bottom: 12, left: 12,
                  display: "flex", alignItems: "center", gap: 6,
                  background: "rgba(0,0,0,0.6)", color: "#fff", padding: "4px 10px",
                  borderRadius: 8, backdropFilter: "blur(4px)",
                }}>
                  <Eye style={{ width: 12, height: 12 }} />
                  <span style={{ fontSize: 11, fontWeight: 600 }}>
                    {viewers} pessoas vendo agora
                  </span>
                </div>

                {deal.soldPercent > 80 && (
                  <div style={{
                    position: "absolute", bottom: 12, right: 12,
                    background: "#DC2626", color: "#fff", padding: "5px 12px",
                    borderRadius: 8, fontSize: 12, fontWeight: 800,
                    animation: "esgotandoPulse 1.2s ease-in-out infinite",
                    letterSpacing: 0.5,
                    display: "flex", alignItems: "center", gap: 4,
                    boxShadow: "0 2px 10px rgba(220,38,38,0.5)",
                  }} data-testid={`badge-esgotando-${deal.id}`}>
                    <AlertTriangle style={{ width: 12, height: 12 }} />
                    ESGOTANDO!
                  </div>
                )}

                {deal.roomsLeft <= 3 && (
                  <div style={{
                    position: "absolute", bottom: deal.soldPercent > 80 ? 44 : 12, left: 12, right: deal.soldPercent > 80 ? "auto" : 12,
                    background: "linear-gradient(90deg, #DC2626, #EF4444)",
                    color: "#fff", padding: "6px 12px",
                    borderRadius: 8, fontSize: 12, fontWeight: 800,
                    textAlign: "center", letterSpacing: 0.5,
                    boxShadow: "0 2px 8px rgba(220,38,38,0.4)",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
                  }}>
                    <AlertTriangle style={{ width: 12, height: 12 }} />
                    ÚLTIMAS VAGAS! Apenas {deal.roomsLeft} quartos!
                  </div>
                )}
              </div>

              <div style={{ padding: 16 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                  <h2 style={{ fontSize: 17, fontWeight: 700, color: "#1F2937", margin: 0 }} data-testid={`text-deal-title-${deal.id}`}>{deal.title}</h2>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 10 }}>
                  <MapPin style={{ width: 13, height: 13, color: "#9CA3AF" }} />
                  <span style={{ fontSize: 13, color: "#6B7280" }}>{deal.location}</span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 12 }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} style={{
                      width: 14, height: 14,
                      fill: s <= Math.floor(deal.rating) ? "#FBBF24" : (s - deal.rating < 1 ? "#FBBF24" : "#E5E7EB"),
                      color: s <= Math.floor(deal.rating) ? "#FBBF24" : (s - deal.rating < 1 ? "#FBBF24" : "#E5E7EB"),
                    }} />
                  ))}
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#1F2937", marginLeft: 4 }}>{deal.rating}</span>
                  <span style={{ fontSize: 12, color: "#9CA3AF" }}>({deal.reviews.toLocaleString("pt-BR")} avaliações)</span>
                </div>

                <UrgencyIndicator roomsLeft={deal.roomsLeft} soldPercent={deal.soldPercent} />

                <div style={{ margin: "12px 0" }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                    <span style={{ fontSize: 13, color: "#9CA3AF", textDecoration: "line-through" }}>
                      {formatPrice(deal.originalPrice)}
                    </span>
                    <div style={{
                      background: "#DC2626", color: "#fff", padding: "2px 8px",
                      borderRadius: 6, fontSize: 12, fontWeight: 800,
                    }}>-{deal.discount}%</div>
                  </div>
                  <div style={{ marginTop: 4 }}>
                    <span style={{ fontSize: 28, fontWeight: 900, color: "#22C55E" }} data-testid={`text-deal-price-${deal.id}`}>
                      {formatPrice(deal.price)}
                    </span>
                  </div>
                  <span style={{ fontSize: 12, color: "#9CA3AF", display: "block", marginTop: 2 }}>por noite</span>
                </div>

                <div style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: deal.soldPercent >= 80 ? "#DC2626" : "#F59E0B" }}>
                      {deal.soldPercent}% vendido
                    </span>
                    <span style={{ fontSize: 11, color: "#9CA3AF" }}>
                      {deal.roomsLeft} quartos restantes
                    </span>
                  </div>
                  <div style={{ height: 8, background: "#F3F4F6", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{
                      width: animatedBars ? `${deal.soldPercent}%` : "0%",
                      height: "100%",
                      background: deal.soldPercent >= 80
                        ? "linear-gradient(90deg, #DC2626, #EF4444)"
                        : deal.soldPercent >= 60
                          ? "linear-gradient(90deg, #F59E0B, #FBBF24)"
                          : "linear-gradient(90deg, #22C55E, #4ADE80)",
                      borderRadius: 4,
                      transition: `width 1.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${barDelay}s`,
                      boxShadow: deal.soldPercent >= 80 ? "0 0 8px rgba(220,38,38,0.3)" : "0 0 8px rgba(245,158,11,0.3)",
                      animation: deal.soldPercent >= 80 ? "barPulse 2s ease-in-out infinite" : "none",
                    }} />
                  </div>
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={(e) => handleReserveClick(deal, e)}
                    data-testid={`button-reserve-${deal.id}`}
                    style={{
                      flex: 1, padding: "14px 0", borderRadius: 12, border: "none",
                      background: "linear-gradient(135deg, #22C55E, #16A34A)",
                      color: "#fff", fontSize: 15, fontWeight: 800, cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      boxShadow: "0 4px 14px rgba(34,197,94,0.3)",
                      textDecoration: "none",
                      transition: "transform 0.15s ease",
                    }}
                  >
                    <Zap style={{ width: 18, height: 18 }} />
                    RESERVAR AGORA
                    <ChevronRight style={{ width: 16, height: 16 }} />
                  </button>
                  <a
                    href={`https://wa.me/5564993197555?text=Ol%C3%A1!%20Quero%20reservar%20${encodeURIComponent(deal.title)}%20com%20${deal.discount}%25%20de%20desconto!`}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid={`button-whatsapp-${deal.id}`}
                    style={{
                      width: 48, height: 48, borderRadius: 12, border: "none",
                      background: "#25D366", color: "#fff",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: "pointer", flexShrink: 0,
                    }}
                  >
                    <Phone style={{ width: 20, height: 20 }} />
                  </a>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <CrossSellSection
        title="Combine sua viagem com estas experiências"
        items={crossSellItems}
      />

      <div style={{
        background: "linear-gradient(135deg, #0F172A, #1E3A5F)",
        padding: "32px 20px",
        textAlign: "center", color: "#fff",
      }}>
        <Phone style={{ width: 32, height: 32, color: "#22C55E", margin: "0 auto 12px" }} />
        <h3 style={{ fontSize: 20, fontWeight: 800, margin: "0 0 8px" }}>
          Não perca nenhuma oferta!
        </h3>
        <p style={{ fontSize: 14, opacity: 0.8, margin: "0 0 20px", lineHeight: 1.5 }}>
          Receba alertas de ofertas relâmpago direto no seu WhatsApp. Seja o primeiro a saber!
        </p>
        <a
          href="https://wa.me/5564993197555?text=Quero%20receber%20alertas%20de%20ofertas%20rel%C3%A2mpago%20do%20RSV360!"
          target="_blank"
          rel="noopener noreferrer"
          data-testid="link-whatsapp-alerts"
          style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "#22C55E", color: "#fff",
            padding: "14px 28px", borderRadius: 12,
            fontSize: 15, fontWeight: 800, textDecoration: "none",
            boxShadow: "0 4px 14px rgba(34,197,94,0.4)",
          }}
        >
          <Phone style={{ width: 18, height: 18 }} />
          Ativar Alertas via WhatsApp
        </a>
      </div>

      {notificationVisible && notification && (
        <div style={{
          position: "fixed", bottom: 90, left: 16, right: 16,
          maxWidth: 380,
          background: "#fff", borderRadius: 14, padding: "14px 18px",
          boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
          border: "1px solid #E5E7EB",
          display: "flex", alignItems: "center", gap: 12,
          zIndex: 100,
          animation: "slideUp 0.4s ease-out",
        }} data-testid="notification-purchase">
          <div style={{
            width: 36, height: 36, borderRadius: "50%",
            background: "linear-gradient(135deg, #22C55E, #16A34A)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <ShoppingCart style={{ width: 16, height: 16, color: "#fff" }} />
          </div>
          <div>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#22C55E", display: "block" }}>
              Compra Confirmada!
            </span>
            <span style={{ fontSize: 12, color: "#374151" }}>
              {notification}
            </span>
          </div>
        </div>
      )}

      <a
        href="https://wa.me/5564993197555?text=Ol%C3%A1!%20Quero%20saber%20mais%20sobre%20as%20ofertas%20rel%C3%A2mpago%20do%20RSV360!"
        target="_blank"
        rel="noopener noreferrer"
        data-testid="button-whatsapp-float"
        style={{
          position: "fixed", bottom: 24, right: 24,
          width: 56, height: 56, borderRadius: "50%",
          background: "#25D366", color: "#fff",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 16px rgba(37,211,102,0.4)",
          zIndex: 50, textDecoration: "none",
        }}
      >
        <Phone style={{ width: 26, height: 26 }} />
      </a>

      <style>{`
        @keyframes flashBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes barPulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 8px rgba(220,38,38,0.3); }
          50% { opacity: 0.85; box-shadow: 0 0 16px rgba(220,38,38,0.6); }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes countdownPulse {
          0%, 100% { transform: scale(1); box-shadow: 0 2px 12px rgba(220,38,38,0.5); }
          50% { transform: scale(1.05); box-shadow: 0 4px 20px rgba(220,38,38,0.7); }
        }
        @keyframes esgotandoPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.85; transform: scale(1.05); }
        }
        @keyframes feedbackPopIn {
          from { transform: scale(0.5); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes globalCountdownPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(220,38,38,0); }
          50% { box-shadow: 0 0 20px 4px rgba(220,38,38,0.3); }
        }
        @keyframes cardStaggerIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
