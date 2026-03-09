import { useState, useEffect, useRef, useMemo } from "react"
import { Search, Star, Phone, Shield, CheckCircle, Award, Calendar, Users, ChevronRight, Zap, Clock, MapPin, TrendingUp, Eye, Flame, Filter, Heart, Gavel, Minus, Plus, X, Gift, Trophy, Ticket, UserCheck, ChevronLeft } from "lucide-react"
import { Link } from "wouter";
import LGPDPopup from "@/components/lgpd-popup"
import ReviewsSection from "@/components/reviews-section"
import ChatAgent from "@/components/chat-agent"
import HotelDetailPanel, { type HotelDetailData } from "@/components/hotel-detail-panel"

const TABS = [
  { id: "tudo", label: "Tudo" },
  { id: "hoteis", label: "Hotéis" },
  { id: "parques", label: "Parques" },
  { id: "passeios", label: "Passeios" },
]

const POPULAR_TAGS = ["Hot Park", "diRoma", "Lagoa Quente", "Náutico", "Water Park"]

const POPULAR_TAG_DETAILS: Record<string, HotelDetailData> = {
  "Hot Park": {
    id: "hot-park",
    title: "Hot Park - Rio Quente",
    description: "O maior parque aquático de águas quentes naturais do mundo. Diversão garantida com piscinas de ondas, toboáguas radicais e rio lento. Perfeito para toda a família!",
    images: ["https://q-xx.bstatic.com/xdata/images/hotel/max1024x768/261264812.jpg"],
    stars: 5,
    location: "Rio Quente, GO",
    price: 149.90,
    originalPrice: 289.90,
    features: ["Piscinas Termais", "Toboáguas", "Rio Lento", "Área Kids", "Alimentação"],
    capacity: 6,
    rating: 4.9,
    reviews: 2847,
    type: "parque",
  },
  "diRoma": {
    id: "diroma",
    title: "DiRoma Acqua Park",
    description: "Um dos maiores parques aquáticos de Caldas Novas com piscinas de águas quentes naturais, toboáguas emocionantes e área de lazer completa.",
    images: ["https://dynamic-media-cdn.tripadvisor.com/media/photo-o/17/63/c5/62/photo0jpg.jpg"],
    stars: 5,
    location: "Caldas Novas, GO",
    price: 139.90,
    originalPrice: 259.90,
    features: ["Águas Termais", "Toboáguas", "Bar Molhado", "Área Infantil", "Estacionamento"],
    capacity: 6,
    rating: 4.8,
    reviews: 1932,
    type: "parque",
  },
  "Lagoa Quente": {
    id: "lagoa-quente",
    title: "Lagoa Quente Flat Hotel",
    description: "Complexo de lazer com piscinas naturais de águas termais em meio à natureza. Ambiente tranquilo e relaxante para toda a família.",
    images: ["https://dynamic-media-cdn.tripadvisor.com/media/photo-o/10/d4/f5/85/lagoa-quente.jpg"],
    stars: 4,
    location: "Caldas Novas, GO",
    price: 649.00,
    originalPrice: 989.00,
    features: ["Águas Termais", "Natureza", "Restaurante", "Estacionamento", "Área Kids"],
    capacity: 4,
    rating: 4.6,
    reviews: 987,
    type: "hotel",
  },
  "Náutico": {
    id: "nautico",
    title: "Náutico Praia Clube",
    description: "Clube com piscinas de águas termais, área de lazer completa, restaurantes e muito mais. Diversão para toda a família em Caldas Novas!",
    images: ["https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/a6/2a/e9/water-park.jpg"],
    stars: 4,
    location: "Caldas Novas, GO",
    price: 99.90,
    originalPrice: 189.90,
    features: ["Piscinas Termais", "Restaurante", "Quadras Esportivas", "Estacionamento"],
    capacity: 5,
    rating: 4.5,
    reviews: 1123,
    type: "parque",
  },
  "Water Park": {
    id: "water-park",
    title: "Water Park",
    description: "Parque aquático moderno com diversas atrações para toda a família. Piscinas termais, toboáguas e área gourmet em um só lugar.",
    images: ["https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/a6/2a/e9/water-park.jpg"],
    stars: 4,
    location: "Caldas Novas, GO",
    price: 119.90,
    originalPrice: 199.90,
    features: ["Piscinas Termais", "Toboáguas", "Área Gourmet", "Wi-Fi", "Estacionamento"],
    capacity: 5,
    rating: 4.7,
    reviews: 1456,
    type: "parque",
  },
}

const SIDEBAR_HIGHLIGHTS = [
  {
    type: "flash" as const,
    title: "Hot Park - Ingresso",
    location: "Rio Quente, GO",
    originalPrice: 289.90,
    price: 149.90,
    discount: 48,
    soldPercent: 82,
    link: "/flash-deals",
    badge: "FLASH DEAL",
    badgeColor: "#DC2626",
  },
  {
    type: "auction" as const,
    title: "Resort Termas Paradise",
    location: "Caldas Novas, GO",
    currentBid: 750,
    participants: 23,
    link: "/leiloes",
    badge: "LEILÃO AO VIVO",
    badgeColor: "#7C3AED",
  },
  {
    type: "ticket" as const,
    title: "DiRoma Acqua Park",
    location: "Caldas Novas, GO",
    originalPrice: 259.90,
    price: 139.90,
    discount: 46,
    link: "/ingressos",
    badge: "INGRESSO",
    badgeColor: "#2563EB",
  },
  {
    type: "flash" as const,
    title: "Lagoa Quente Flat",
    location: "Caldas Novas, GO",
    originalPrice: 989.00,
    price: 649.00,
    discount: 34,
    soldPercent: 65,
    link: "/flash-deals",
    badge: "FLASH DEAL",
    badgeColor: "#DC2626",
  },
  {
    type: "auction" as const,
    title: "Pousada Recanto das Águas",
    location: "Rio Quente, GO",
    currentBid: 420,
    participants: 15,
    link: "/leiloes",
    badge: "LEILÃO AO VIVO",
    badgeColor: "#7C3AED",
  },
]

const LAST_BOOKINGS = [
  { name: "João", city: "Brasília, DF", product: "Hot Park", time: "3 min" },
  { name: "Maria", city: "Goiânia, GO", product: "Resort Termas", time: "7 min" },
  { name: "Carlos", city: "São Paulo, SP", product: "DiRoma", time: "12 min" },
  { name: "Ana", city: "Uberlândia, MG", product: "Water Park", time: "18 min" },
  { name: "Pedro", city: "Cuiabá, MT", product: "Náutico", time: "25 min" },
  { name: "Fernanda", city: "Campo Grande, MS", product: "Lagoa Quente", time: "32 min" },
]

const TOP3_WEEK = [
  { name: "Hot Park", bookings: 342, trend: "+18%", medal: "gold" },
  { name: "DiRoma Acqua Park", bookings: 287, trend: "+12%", medal: "silver" },
  { name: "Resort Termas", bookings: 198, trend: "+9%", medal: "bronze" },
]

const PRODUCTS = [
  {
    id: 1,
    title: "Hot Park - Ingresso Individual",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hot-park-Jm2Xy9K8RfqL3vN5wT1pA6sD4hB7eC.jpg",
    originalPrice: 289.90,
    price: 149.90,
    discount: 48,
    rating: 4.9,
    reviews: 2847,
    badge: "OFERTA RELÂMPAGO",
    monthly: true,
    location: "Rio Quente",
    category: "parques",
  },
  {
    id: 2,
    title: "DiRoma Acqua Park - Família",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/diroma-Kp4Mn7Hs8Qf2Lw6Rv3Jx5Bt1Yd9Gc.jpg",
    originalPrice: 259.90,
    price: 139.90,
    discount: 46,
    rating: 4.8,
    reviews: 1932,
    badge: "OFERTA RELÂMPAGO",
    monthly: true,
    location: "Caldas Novas",
    category: "parques",
  },
  {
    id: 3,
    title: "Resort Termas Paradise - 3 Noites",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/termas-paradise-Np6Qr8Ts2Uf4Xv7Zy1Bw3Dc5Eg9Hj.jpg",
    originalPrice: 1899.00,
    price: 1199.00,
    discount: 37,
    rating: 4.9,
    reviews: 856,
    badge: "MAIS VENDIDO",
    monthly: false,
    location: "Caldas Novas",
    category: "hoteis",
  },
  {
    id: 4,
    title: "Water Park - Dia Inteiro",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/water-park-Lq8Rs2Ut4Wv6Xy9Ab1Cd3Ef5Gh7Ij.jpg",
    originalPrice: 199.90,
    price: 119.90,
    discount: 40,
    rating: 4.7,
    reviews: 1456,
    badge: "PROMOÇÃO",
    monthly: true,
    location: "Caldas Novas",
    category: "parques",
  },
  {
    id: 5,
    title: "Lagoa Quente Flat Hotel - 2 Noites",
    originalPrice: 989.00,
    price: 649.00,
    discount: 34,
    rating: 4.6,
    reviews: 987,
    badge: "OFERTA RELÂMPAGO",
    monthly: false,
    location: "Caldas Novas",
    image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/a6/2a/e9/water-park.jpg",
    category: "hoteis",
  },
  {
    id: 6,
    title: "Náutico Praia Clube - Família",
    originalPrice: 189.90,
    price: 99.90,
    discount: 47,
    rating: 4.5,
    reviews: 1123,
    badge: "PROMOÇÃO",
    monthly: true,
    location: "Caldas Novas",
    image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/a6/2a/e9/water-park.jpg",
    category: "parques",
  },
  {
    id: 7,
    title: "Privé Thermas Hotel - 4 Noites",
    originalPrice: 2299.00,
    price: 1449.00,
    discount: 37,
    rating: 4.7,
    reviews: 1245,
    badge: "MAIS VENDIDO",
    monthly: false,
    location: "Caldas Novas",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/termas-paradise-Np6Qr8Ts2Uf4Xv7Zy1Bw3Dc5Eg9Hj.jpg",
    category: "hoteis",
  },
  {
    id: 8,
    title: "DiRoma Fiori Resort - 3 Noites",
    originalPrice: 1799.00,
    price: 1099.00,
    discount: 39,
    rating: 4.8,
    reviews: 634,
    badge: "OFERTA RELÂMPAGO",
    monthly: false,
    location: "Caldas Novas",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/diroma-Kp4Mn7Hs8Qf2Lw6Rv3Jx5Bt1Yd9Gc.jpg",
    category: "hoteis",
  },
  {
    id: 9,
    title: "Jardim Japonês - Tour Guiado",
    originalPrice: 89.90,
    price: 49.90,
    discount: 44,
    rating: 4.5,
    reviews: 432,
    badge: "PROMOÇÃO",
    monthly: true,
    location: "Caldas Novas",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hot-park-Jm2Xy9K8RfqL3vN5wT1pA6sD4hB7eC.jpg",
    category: "passeios",
  },
  {
    id: 10,
    title: "Lago Corumbá - Passeio de Barco",
    originalPrice: 159.90,
    price: 99.90,
    discount: 38,
    rating: 4.6,
    reviews: 567,
    badge: "PROMOÇÃO",
    monthly: true,
    location: "Caldas Novas",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/water-park-Lq8Rs2Ut4Wv6Xy9Ab1Cd3Ef5Gh7Ij.jpg",
    category: "passeios",
  },
  {
    id: 11,
    title: "Serra de Caldas - Trilha Ecológica",
    originalPrice: 129.90,
    price: 79.90,
    discount: 38,
    rating: 4.4,
    reviews: 312,
    badge: "NOVO",
    monthly: true,
    location: "Caldas Novas",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/termas-paradise-Np6Qr8Ts2Uf4Xv7Zy1Bw3Dc5Eg9Hj.jpg",
    category: "passeios",
  },
  {
    id: 12,
    title: "City Tour Caldas Novas - Completo",
    originalPrice: 119.90,
    price: 69.90,
    discount: 42,
    rating: 4.7,
    reviews: 789,
    badge: "MAIS VENDIDO",
    monthly: true,
    location: "Caldas Novas",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hot-park-Jm2Xy9K8RfqL3vN5wT1pA6sD4hB7eC.jpg",
    category: "passeios",
  },
]

const RECENT_VIEWS = [
  { name: "Hot Park", price: "R$ 149,90", rating: 4.9 },
  { name: "DiRoma Acqua", price: "R$ 139,90", rating: 4.8 },
  { name: "Resort Termas", price: "R$ 1.199", rating: 4.9 },
]

const LIVE_ACTIVITY = [
  "Ana de São Paulo reservou Hot Park",
  "Carlos de Goiânia garantiu Resort Termas",
  "Maria de BH reservou DiRoma Acqua",
  "João de Brasília comprou ingresso Water Park",
  "Lucia de Uberlândia reservou Lagoa Quente",
]

export default function RSV360Landing() {
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("tudo")
  const [showLGPDPopup, setShowLGPDPopup] = useState(false)
  const [liveIndex, setLiveIndex] = useState(0)
  const [showNotif, setShowNotif] = useState(false)
  const [selectedHotel, setSelectedHotel] = useState<HotelDetailData | null>(null)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showGuestPicker, setShowGuestPicker] = useState(false)
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [guests, setGuests] = useState(2)
  const [searchHighlight, setSearchHighlight] = useState(false)
  const [highlightIndex, setHighlightIndex] = useState(0)
  const [lastBookingIndex, setLastBookingIndex] = useState(0)
  const [couponCopied, setCouponCopied] = useState(false)
  const [flashCountdown, setFlashCountdown] = useState({ hours: 2, minutes: 47, seconds: 33 })
  const [priceMin, setPriceMin] = useState("")
  const [priceMax, setPriceMax] = useState("")
  const [minStars, setMinStars] = useState<number | null>(null)
  const productsRef = useRef<HTMLDivElement>(null)

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      if (activeTab !== "tudo" && p.category !== activeTab) return false
      if (priceMin && p.price < Number(priceMin)) return false
      if (priceMax && p.price > Number(priceMax)) return false
      if (minStars && p.rating < minStars) return false
      return true
    })
  }, [activeTab, priceMin, priceMax, minStars])
  const searchBarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchBarRef.current && !searchBarRef.current.contains(e.target as Node)) {
        setShowDatePicker(false)
        setShowGuestPicker(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800)
    const lgpdConsent = localStorage.getItem("reservei-lgpd-consent")
    if (!lgpdConsent) setShowLGPDPopup(true)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>
    const interval = setInterval(() => {
      setShowNotif(true)
      timeoutId = setTimeout(() => {
        setShowNotif(false)
        setLiveIndex((p) => (p + 1) % LIVE_ACTIVITY.length)
      }, 4000)
    }, 8000)
    return () => {
      clearInterval(interval)
      clearTimeout(timeoutId)
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setHighlightIndex((p) => (p + 1) % SIDEBAR_HIGHLIGHTS.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setFlashCountdown((prev) => {
        let { hours, minutes, seconds } = prev
        seconds--
        if (seconds < 0) { seconds = 59; minutes-- }
        if (minutes < 0) { minutes = 59; hours-- }
        if (hours < 0) return { hours: 2, minutes: 59, seconds: 59 }
        return { hours, minutes, seconds }
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setLastBookingIndex((p) => (p + 1) % LAST_BOOKINGS.length)
    }, 3500)
    return () => clearInterval(interval)
  }, [])

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price)

  const handleSearch = () => {
    setShowDatePicker(false)
    setShowGuestPicker(false)
    if (productsRef.current) {
      productsRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
      setSearchHighlight(true)
      setTimeout(() => setSearchHighlight(false), 2000)
    }
  }

  const formatDateLabel = (dateStr: string) => {
    if (!dateStr) return ""
    const d = new Date(dateStr + "T12:00:00")
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })
  }

  const getTodayStr = () => {
    const d = new Date()
    return d.toISOString().split("T")[0]
  }

  if (isLoading) {
    return (
      <div style={{
        position: "fixed", inset: 0, zIndex: 50,
        background: "linear-gradient(135deg, #1e3a5f 0%, #2563EB 50%, #1e3a5f 100%)",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{ position: "relative", marginBottom: 32 }}>
          <div style={{
            width: 120, height: 120, borderRadius: "50%",
            background: "rgba(255,255,255,0.15)",
            display: "flex", alignItems: "center", justifyContent: "center",
            animation: "pulse 2s infinite",
          }}>
            <div style={{ textAlign: "center", color: "#fff" }}>
              <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: -1 }}>RSV<span style={{ color: "#F57C00" }}>360</span></div>
            </div>
          </div>
        </div>
        <div style={{ textAlign: "center", color: "#fff" }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Reservei Viagens</h2>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 14 }}>Carregando sua experiência...</p>
        </div>
        <div style={{ marginTop: 32, width: 180, height: 4, background: "rgba(255,255,255,0.2)", borderRadius: 4, overflow: "hidden" }}>
          <div style={{ height: "100%", background: "#F57C00", borderRadius: 4, animation: "loadbar 2s ease-in-out infinite" }} />
        </div>
        <style>{`
          @keyframes loadbar { 0% { width: 0%; } 50% { width: 70%; } 100% { width: 100%; } }
        `}</style>
      </div>
    )
  }

  return (
    <div className="rsv-page">
      {/* Social Proof Notification */}
      {showNotif && (
        <div className="rsv-social-notification" style={{
          position: "fixed", top: 80, right: 20, zIndex: 45,
          background: "#fff", borderRadius: 12, padding: "12px 16px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)", maxWidth: 300,
          alignItems: "center", gap: 10,
          animation: "notifSlideIn 0.3s ease-out",
          borderLeft: "4px solid #22C55E",
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: "50%", background: "#F0FDF4",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <CheckCircle style={{ width: 18, height: 18, color: "#22C55E" }} />
          </div>
          <div>
            <p style={{ fontSize: 12, fontWeight: 600, color: "#1F2937", margin: 0 }}>{LIVE_ACTIVITY[liveIndex]}</p>
            <p style={{ fontSize: 10, color: "#9CA3AF", margin: "2px 0 0" }}>Agora mesmo</p>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="rsv-header-bar">
        <div className="rsv-header-inner">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 40, height: 40, borderRadius: "50%",
                border: "2px solid #fff", display: "flex", alignItems: "center", justifyContent: "center",
                background: "rgba(255,255,255,0.1)", fontSize: 9, fontWeight: 900, letterSpacing: -0.5,
              }}>
                <span>RSV<span style={{ color: "#F57C00" }}>360</span></span>
              </div>
              <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: -0.5 }}>Reservei Viagens</span>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button style={{
                padding: "6px 14px", borderRadius: 20, border: "1px solid rgba(255,255,255,0.5)",
                background: "transparent", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer",
              }}>Entrar</button>
              <button style={{
                padding: "6px 14px", borderRadius: 20, border: "none",
                background: "#fff", color: "#2563EB", fontSize: 13, fontWeight: 700, cursor: "pointer",
              }}>Cadastrar</button>
            </div>
          </div>

          <div style={{ display: "flex", gap: 0, borderBottom: "2px solid rgba(255,255,255,0.15)" }}>
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id)
                  if (productsRef.current) {
                    productsRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
                  }
                }}
                style={{
                  flex: 1, maxWidth: 120, padding: "10px 0", border: "none", background: "transparent",
                  color: activeTab === tab.id ? "#fff" : "rgba(255,255,255,0.6)",
                  fontSize: 14, fontWeight: activeTab === tab.id ? 700 : 500,
                  cursor: "pointer", position: "relative",
                  borderBottom: activeTab === tab.id ? "2px solid #F57C00" : "2px solid transparent",
                  marginBottom: -2, transition: "all 0.2s",
                }}
              >{tab.label}</button>
            ))}
          </div>
        </div>
      </header>

      {/* Hero Section - Full Width */}
      <div className="rsv-hero-full">
        <div className="rsv-hero-inner">
          <div style={{ flex: 1, marginBottom: 24 }}>
            <h1 style={{ fontSize: "clamp(24px, 4vw, 42px)", fontWeight: 900, color: "#fff", marginBottom: 8, lineHeight: 1.2 }}>
              Caldas Novas te espera com até <span style={{ color: "#F57C00" }}>70% OFF</span>
            </h1>
            <p style={{ fontSize: "clamp(12px, 1.3vw, 16px)", color: "rgba(255,255,255,0.8)", marginBottom: 24 }}>
              Hotéis, parques aquáticos e passeios com os melhores preços. Reserve agora e parcele em até 12x!
            </p>
            <div ref={searchBarRef} className="rsv-hero-search" style={{ marginBottom: 16, position: "relative" }}>
              <div
                className="rsv-hero-search-field"
                onClick={() => { setShowDatePicker(!showDatePicker); setShowGuestPicker(false) }}
                style={{ cursor: "pointer" }}
              >
                <Calendar style={{ width: 16, height: 16, flexShrink: 0 }} />
                <span>
                  {checkIn && checkOut
                    ? `${formatDateLabel(checkIn)} - ${formatDateLabel(checkOut)}`
                    : "ENTRADA / SAÍDA"
                  }
                </span>
              </div>
              <div
                className="rsv-hero-search-field"
                onClick={() => { setShowGuestPicker(!showGuestPicker); setShowDatePicker(false) }}
                style={{ minWidth: 100, maxWidth: 140, cursor: "pointer" }}
              >
                <span style={{ fontWeight: 600, color: "#fff" }}>{guests}</span>
                <Users style={{ width: 16, height: 16, flexShrink: 0 }} />
                <span>Hóspedes</span>
              </div>
              <button
                onClick={handleSearch}
                style={{
                  padding: "12px 28px", borderRadius: 10, border: "none",
                  background: "#22C55E", color: "#fff", fontSize: 15, fontWeight: 700,
                  cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
                  boxShadow: "0 4px 12px rgba(34,197,94,0.3)", whiteSpace: "nowrap",
                  transition: "transform 0.2s",
                }}
              >
                <Search style={{ width: 18, height: 18 }} />
                BUSCAR AGORA
              </button>

              {showDatePicker && (
                <div style={{
                  position: "absolute", top: "calc(100% + 8px)", left: 0,
                  background: "#fff", borderRadius: 14, padding: 20, zIndex: 60,
                  boxShadow: "0 8px 32px rgba(0,0,0,0.2)", minWidth: 280,
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <h4 style={{ fontSize: 15, fontWeight: 700, color: "#1F2937", margin: 0 }}>Selecione as datas</h4>
                    <button onClick={() => setShowDatePicker(false)} style={{
                      width: 28, height: 28, borderRadius: "50%", border: "none",
                      background: "#F3F4F6", cursor: "pointer", display: "flex",
                      alignItems: "center", justifyContent: "center",
                    }}><X style={{ width: 14, height: 14, color: "#6B7280" }} /></button>
                  </div>
                  <div style={{ marginBottom: 14 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#6B7280", display: "block", marginBottom: 6 }}>Check-in</label>
                    <input
                      type="date"
                      value={checkIn}
                      min={getTodayStr()}
                      onChange={(e) => {
                        setCheckIn(e.target.value)
                        if (checkOut && e.target.value > checkOut) setCheckOut("")
                      }}
                      style={{
                        width: "100%", padding: "10px 12px", borderRadius: 8,
                        border: "1px solid #D1D5DB", fontSize: 14, outline: "none",
                        color: "#1F2937",
                      }}
                    />
                  </div>
                  <div style={{ marginBottom: 14 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#6B7280", display: "block", marginBottom: 6 }}>Check-out</label>
                    <input
                      type="date"
                      value={checkOut}
                      min={checkIn || getTodayStr()}
                      onChange={(e) => setCheckOut(e.target.value)}
                      style={{
                        width: "100%", padding: "10px 12px", borderRadius: 8,
                        border: "1px solid #D1D5DB", fontSize: 14, outline: "none",
                        color: "#1F2937",
                      }}
                    />
                  </div>
                  <button
                    onClick={() => setShowDatePicker(false)}
                    style={{
                      width: "100%", padding: "10px 0", borderRadius: 8, border: "none",
                      background: "#2563EB", color: "#fff", fontSize: 14, fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >Confirmar datas</button>
                </div>
              )}

              {showGuestPicker && (
                <div style={{
                  position: "absolute", top: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)",
                  background: "#fff", borderRadius: 14, padding: 20, zIndex: 60,
                  boxShadow: "0 8px 32px rgba(0,0,0,0.2)", minWidth: 220,
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <h4 style={{ fontSize: 15, fontWeight: 700, color: "#1F2937", margin: 0 }}>Hóspedes</h4>
                    <button onClick={() => setShowGuestPicker(false)} style={{
                      width: 28, height: 28, borderRadius: "50%", border: "none",
                      background: "#F3F4F6", cursor: "pointer", display: "flex",
                      alignItems: "center", justifyContent: "center",
                    }}><X style={{ width: 14, height: 14, color: "#6B7280" }} /></button>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 14, color: "#374151", fontWeight: 500 }}>Adultos + Crianças</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <button
                        onClick={() => setGuests(Math.max(1, guests - 1))}
                        style={{
                          width: 34, height: 34, borderRadius: "50%", border: "1px solid #D1D5DB",
                          background: guests <= 1 ? "#F3F4F6" : "#fff", cursor: guests <= 1 ? "default" : "pointer",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}
                      ><Minus style={{ width: 14, height: 14, color: guests <= 1 ? "#D1D5DB" : "#374151" }} /></button>
                      <span style={{ fontSize: 20, fontWeight: 700, color: "#1F2937", minWidth: 24, textAlign: "center" }}>{guests}</span>
                      <button
                        onClick={() => setGuests(Math.min(10, guests + 1))}
                        style={{
                          width: 34, height: 34, borderRadius: "50%", border: "1px solid #D1D5DB",
                          background: guests >= 10 ? "#F3F4F6" : "#fff", cursor: guests >= 10 ? "default" : "pointer",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}
                      ><Plus style={{ width: 14, height: 14, color: guests >= 10 ? "#D1D5DB" : "#374151" }} /></button>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowGuestPicker(false)}
                    style={{
                      width: "100%", padding: "10px 0", borderRadius: 8, border: "none",
                      background: "#2563EB", color: "#fff", fontSize: 14, fontWeight: 700,
                      cursor: "pointer", marginTop: 16,
                    }}
                  >Confirmar</button>
                </div>
              )}
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#F57C00", padding: "6px 0" }}>Popular:</span>
              {POPULAR_TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    const detail = POPULAR_TAG_DETAILS[tag]
                    if (detail) setSelectedHotel(detail)
                  }}
                  style={{
                    padding: "6px 14px", borderRadius: 20, border: "1px solid rgba(255,255,255,0.3)",
                    background: "rgba(255,255,255,0.1)", color: "#fff", fontSize: 13, fontWeight: 500,
                    cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.2s",
                  }}
                >{tag}</button>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
            {[
              { icon: TrendingUp, label: "+5.000 reservas", color: "#22C55E" },
              { icon: Star, label: "4.9 avaliação", color: "#FBBF24" },
              { icon: Shield, label: "Pagamento seguro", color: "#2563EB" },
            ].map((stat, i) => (
              <div key={i} style={{
                background: "rgba(255,255,255,0.1)", borderRadius: 12, padding: "12px 16px",
                display: "flex", alignItems: "center", gap: 8, backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}>
                <stat.icon style={{ width: 18, height: 18, color: stat.color }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content with Sidebars */}
      <div className="rsv-container">
        <div className="rsv-main-layout">
          {/* Left Sidebar - Desktop only */}
          <aside className="rsv-sidebar">
            <div className="rsv-sidebar-card">
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <Filter style={{ width: 18, height: 18, color: "#2563EB" }} />
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1F2937", margin: 0 }}>Filtros</h3>
              </div>
              <div style={{ marginBottom: 16 }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: "#6B7280", marginBottom: 8 }}>Faixa de Preço</p>
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceMin}
                    onChange={(e) => setPriceMin(e.target.value)}
                    style={{
                      flex: 1, padding: "8px 10px", borderRadius: 8,
                      border: priceMin ? "2px solid #2563EB" : "1px solid #E5E7EB",
                      fontSize: 13, color: "#1F2937", outline: "none",
                      background: priceMin ? "#EFF6FF" : "#fff",
                      transition: "all 0.2s",
                    }}
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceMax}
                    onChange={(e) => setPriceMax(e.target.value)}
                    style={{
                      flex: 1, padding: "8px 10px", borderRadius: 8,
                      border: priceMax ? "2px solid #2563EB" : "1px solid #E5E7EB",
                      fontSize: 13, color: "#1F2937", outline: "none",
                      background: priceMax ? "#EFF6FF" : "#fff",
                      transition: "all 0.2s",
                    }}
                  />
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: "#6B7280", marginBottom: 8 }}>Classificação</p>
                {[5, 4, 3].map((s) => (
                  <div
                    key={s}
                    onClick={() => setMinStars(minStars === s ? null : s)}
                    style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6, cursor: "pointer", transition: "all 0.2s" }}
                  >
                    <div style={{
                      width: 16, height: 16, borderRadius: 4,
                      border: minStars === s ? "2px solid #2563EB" : "1px solid #D1D5DB",
                      background: minStars === s ? "#2563EB" : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "all 0.2s",
                    }}>
                      {minStars === s && (
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path d="M2 5L4 7L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                    <div style={{ display: "flex", gap: 2 }}>
                      {Array.from({ length: s }).map((_, i) => (
                        <Star key={i} style={{ width: 12, height: 12, fill: "#FBBF24", color: "#FBBF24" }} />
                      ))}
                    </div>
                    <span style={{ fontSize: 12, color: minStars === s ? "#2563EB" : "#6B7280", fontWeight: minStars === s ? 600 : 400 }}>& acima</span>
                  </div>
                ))}
              </div>
              {(priceMin || priceMax || minStars) && (
                <button
                  onClick={() => { setPriceMin(""); setPriceMax(""); setMinStars(null) }}
                  style={{
                    width: "100%", padding: "8px 0", borderRadius: 8, border: "1px solid #DC2626",
                    background: "rgba(220,38,38,0.06)", color: "#DC2626", fontSize: 12, fontWeight: 600,
                    cursor: "pointer", marginBottom: 16, transition: "all 0.2s",
                  }}
                >
                  Limpar Filtros
                </button>
              )}
              <div>
                <p style={{ fontSize: 12, fontWeight: 600, color: "#6B7280", marginBottom: 8 }}>Tipo</p>
                {[
                  { label: "Hotéis", tab: "hoteis" },
                  { label: "Parques", tab: "parques" },
                  { label: "Passeios", tab: "passeios" },
                ].map((type) => (
                  <div
                    key={type.tab}
                    onClick={() => {
                      setActiveTab(activeTab === type.tab ? "tudo" : type.tab)
                      if (productsRef.current) {
                        productsRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
                      }
                    }}
                    style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6, cursor: "pointer" }}
                  >
                    <div style={{
                      width: 16, height: 16, borderRadius: 4,
                      border: activeTab === type.tab ? "2px solid #2563EB" : "1px solid #D1D5DB",
                      background: activeTab === type.tab ? "#2563EB" : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      {activeTab === type.tab && (
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path d="M2 5L4 7L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                    <span style={{ fontSize: 13, color: activeTab === type.tab ? "#2563EB" : "#374151", fontWeight: activeTab === type.tab ? 600 : 400 }}>{type.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rsv-sidebar-card">
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <Eye style={{ width: 18, height: 18, color: "#2563EB" }} />
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1F2937", margin: 0 }}>Vistos Recentemente</h3>
              </div>
              {RECENT_VIEWS.map((item, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "10px 0",
                  borderTop: i > 0 ? "1px solid #F3F4F6" : "none", cursor: "pointer",
                }}>
                  <div style={{
                    width: 44, height: 36, borderRadius: 8, flexShrink: 0,
                    background: "linear-gradient(135deg, #2563EB, #1e3a5f)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <MapPin style={{ width: 14, height: 14, color: "rgba(255,255,255,0.5)" }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#1F2937", margin: 0 }}>{item.name}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <Star style={{ width: 10, height: 10, fill: "#FBBF24", color: "#FBBF24" }} />
                      <span style={{ fontSize: 11, color: "#6B7280" }}>{item.rating}</span>
                    </div>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#F57C00" }}>{item.price}</span>
                </div>
              ))}
            </div>

            <div className="rsv-sidebar-card" style={{ background: "linear-gradient(135deg, #F0FDF4, #DCFCE7)", border: "1px solid #BBF7D0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <Flame style={{ width: 18, height: 18, color: "#22C55E" }} />
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "#166534", margin: 0 }}>Atividade ao Vivo</h3>
              </div>
              {LIVE_ACTIVITY.slice(0, 3).map((act, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 6, padding: "6px 0",
                  borderTop: i > 0 ? "1px solid rgba(34,197,94,0.15)" : "none",
                }}>
                  <div style={{
                    width: 6, height: 6, borderRadius: "50%", background: "#22C55E", flexShrink: 0,
                  }} />
                  <p style={{ fontSize: 11, color: "#374151", margin: 0 }}>{act}</p>
                </div>
              ))}
              <p style={{ fontSize: 10, color: "#6B7280", margin: "8px 0 0", fontStyle: "italic" }}>
                Atualizado em tempo real
              </p>
            </div>

            {/* Cupom Exclusivo */}
            <div className="rsv-sidebar-card" style={{
              background: "linear-gradient(135deg, #FEFCE8, #FEF9C3)",
              border: "2px dashed #F59E0B",
              position: "relative", overflow: "hidden",
            }}>
              <div style={{
                position: "absolute", top: -8, right: -8, width: 60, height: 60,
                borderRadius: "50%", background: "rgba(245,158,11,0.1)",
              }} />
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <Gift style={{ width: 20, height: 20, color: "#F59E0B" }} />
                <h3 style={{ fontSize: 14, fontWeight: 800, color: "#92400E", margin: 0 }}>Cupom Exclusivo</h3>
              </div>
              <p style={{ fontSize: 12, color: "#78350F", marginBottom: 10 }}>
                Use no checkout e ganhe desconto extra em qualquer reserva!
              </p>
              <button
                onClick={() => {
                  navigator.clipboard.writeText("CALDAS15")
                  setCouponCopied(true)
                  setTimeout(() => setCouponCopied(false), 2000)
                }}
                style={{
                  width: "100%", padding: "10px 0", borderRadius: 8,
                  border: "2px dashed #D97706",
                  background: couponCopied ? "#22C55E" : "#fff",
                  color: couponCopied ? "#fff" : "#92400E",
                  fontSize: 16, fontWeight: 900, cursor: "pointer",
                  letterSpacing: 3, transition: "all 0.3s",
                }}
              >
                {couponCopied ? "COPIADO!" : "CALDAS15"}
              </button>
              <p style={{ fontSize: 11, color: "#A16207", margin: "8px 0 0", textAlign: "center" }}>
                {couponCopied ? "Cole no checkout para aplicar" : "Clique para copiar · 15% OFF"}
              </p>
            </div>

            {/* Top 3 da Semana */}
            <div className="rsv-sidebar-card">
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <Trophy style={{ width: 18, height: 18, color: "#F59E0B" }} />
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1F2937", margin: 0 }}>Top 3 da Semana</h3>
              </div>
              {TOP3_WEEK.map((item, i) => {
                const medalEmojis = { gold: "🥇", silver: "🥈", bronze: "🥉" }
                return (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: 10, padding: "10px 0",
                    borderTop: i > 0 ? "1px solid #F3F4F6" : "none",
                  }}>
                    <span style={{ fontSize: 20 }}>{medalEmojis[item.medal as keyof typeof medalEmojis]}</span>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: "#1F2937", margin: 0 }}>{item.name}</p>
                      <p style={{ fontSize: 11, color: "#6B7280", margin: 0 }}>{item.bookings} reservas</p>
                    </div>
                    <span style={{
                      fontSize: 11, fontWeight: 700,
                      color: "#22C55E", background: "#F0FDF4",
                      padding: "2px 8px", borderRadius: 10,
                    }}>{item.trend}</span>
                  </div>
                )
              })}
            </div>
          </aside>

          {/* Main Content */}
          <main className="rsv-main-content">
            {/* Mais Vendidos */}
            <div ref={productsRef} style={{
              marginBottom: 24,
              transition: "box-shadow 0.5s ease",
              boxShadow: searchHighlight ? "0 0 0 3px #2563EB, 0 0 20px rgba(37,99,235,0.2)" : "none",
              borderRadius: searchHighlight ? 16 : 0,
              padding: searchHighlight ? 16 : 0,
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1F2937" }}>
                  {searchHighlight
                    ? `Resultados para ${guests} hóspede${guests > 1 ? "s" : ""}`
                    : activeTab === "tudo"
                    ? "Mais Vendidos em Caldas"
                    : activeTab === "hoteis"
                    ? "Hotéis e Resorts"
                    : activeTab === "parques"
                    ? "Parques Aquáticos"
                    : "Passeios e Tours"}
                </h2>
                <Link href="/promocoes" style={{ fontSize: 13, color: "#2563EB", fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", gap: 2 }}>
                  Ver todos <ChevronRight style={{ width: 14, height: 14 }} />
                </Link>
              </div>

              <div style={{ display: "flex", gap: 8, marginBottom: 16, overflowX: "auto" }}>
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      padding: "6px 16px",
                      borderRadius: 20,
                      border: activeTab === tab.id ? "2px solid #2563EB" : "1px solid #D1D5DB",
                      background: activeTab === tab.id ? "#EFF6FF" : "#fff",
                      color: activeTab === tab.id ? "#2563EB" : "#6B7280",
                      fontSize: 13,
                      fontWeight: activeTab === tab.id ? 700 : 500,
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      transition: "all 0.2s",
                    }}
                  >{tab.label}</button>
                ))}
              </div>

              {(priceMin || priceMax || minStars) && (
                <div style={{
                  display: "flex", alignItems: "center", gap: 8, marginBottom: 12,
                  padding: "8px 14px", background: "#EFF6FF", borderRadius: 10, border: "1px solid #BFDBFE",
                }}>
                  <Filter style={{ width: 14, height: 14, color: "#2563EB" }} />
                  <span style={{ fontSize: 13, color: "#2563EB", fontWeight: 600 }}>
                    {filteredProducts.length} resultado(s) encontrado(s)
                  </span>
                  <button
                    onClick={() => { setPriceMin(""); setPriceMax(""); setMinStars(null) }}
                    style={{
                      marginLeft: "auto", background: "none", border: "none", color: "#DC2626",
                      fontSize: 12, fontWeight: 600, cursor: "pointer", textDecoration: "underline",
                    }}
                  >
                    Limpar
                  </button>
                </div>
              )}
              <div className="rsv-products-grid">
                {filteredProducts.length === 0 ? (
                  <div style={{
                    gridColumn: "1 / -1", textAlign: "center", padding: "40px 20px",
                  }}>
                    <Search style={{ width: 40, height: 40, color: "#D1D5DB", margin: "0 auto 12px" }} />
                    <p style={{ fontSize: 16, fontWeight: 600, color: "#6B7280", marginBottom: 4 }}>Nenhum resultado encontrado</p>
                    <p style={{ fontSize: 13, color: "#9CA3AF" }}>Tente ajustar os filtros de preço ou classificação</p>
                  </div>
                ) : null}
                {filteredProducts.map((product) => (
                  <div key={product.id} onClick={() => setSelectedHotel({
                    id: String(product.id),
                    title: product.title,
                    description: product.category === "parques"
                      ? `${product.title} em ${product.location}. Aproveite esta oferta exclusiva com ${product.discount}% de desconto! Avaliação ${product.rating} com ${product.reviews} avaliações de visitantes satisfeitos. Diversão garantida para toda a família!`
                      : product.category === "passeios"
                        ? `${product.title} em ${product.location}. Experiência turística imperdível com ${product.discount}% de desconto! Avaliação ${product.rating} com ${product.reviews} avaliações de turistas satisfeitos.`
                        : `${product.title} em ${product.location}. Aproveite esta oferta exclusiva com ${product.discount}% de desconto! Avaliação ${product.rating} com ${product.reviews} avaliações de hóspedes satisfeitos.`,
                    images: [product.image],
                    stars: Math.round(product.rating),
                    location: product.location,
                    price: product.price,
                    originalPrice: product.originalPrice,
                    features: product.category === "parques"
                      ? ["Complexo Aquático", "Estacionamento", "Recreação Infantil", "Restaurante"]
                      : product.category === "passeios"
                        ? ["Tour Guiado", "Transporte", "Guia Local", "Fotos Incluídas"]
                        : ["Wi-Fi", "Café da Manhã", "Estacionamento", "Piscinas Termais"],
                    capacity: 4,
                    rating: product.rating,
                    reviews: product.reviews,
                    type: product.category === "parques" ? "parque" as const : product.category === "passeios" ? "passeio" as const : "hotel" as const,
                  })} style={{
                    background: "#fff", borderRadius: 14, overflow: "hidden",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)", transition: "transform 0.2s, box-shadow 0.2s",
                    cursor: "pointer",
                  }}>
                    <div style={{ position: "relative", height: 160, background: "#E5E7EB", overflow: "hidden" }}>
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.title}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      ) : (
                        <div style={{
                          width: "100%", height: "100%",
                          background: "linear-gradient(135deg, #2563EB 0%, #1e3a5f 100%)",
                          display: "flex", alignItems: "center", justifyContent: "center", color: "#fff",
                        }}>
                          <MapPin style={{ width: 24, height: 24, opacity: 0.5 }} />
                        </div>
                      )}
                      <div style={{
                        position: "absolute", top: 8, right: 8,
                        background: "#EF4444", color: "#fff", padding: "3px 8px",
                        borderRadius: 6, fontSize: 11, fontWeight: 700,
                      }}>{product.discount}%</div>
                      <button style={{
                        position: "absolute", top: 8, left: 8,
                        background: "rgba(255,255,255,0.9)", border: "none", borderRadius: "50%",
                        width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: "pointer",
                      }}>
                        <Heart style={{ width: 14, height: 14, color: "#9CA3AF" }} />
                      </button>
                      {product.rating && (
                        <div style={{
                          position: "absolute", bottom: 8, left: 8,
                          background: "rgba(0,0,0,0.6)", color: "#fff", padding: "2px 6px",
                          borderRadius: 4, fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", gap: 3,
                        }}>
                          <Star style={{ width: 10, height: 10, fill: "#FBBF24", color: "#FBBF24" }} />
                          {product.rating}
                        </div>
                      )}
                    </div>
                    <div style={{ padding: 12 }}>
                      <div style={{
                        fontSize: 10, fontWeight: 700, color: "#fff", padding: "2px 6px",
                        borderRadius: 4, display: "inline-block", marginBottom: 6,
                        background: product.badge === "OFERTA RELÂMPAGO" ? "#F57C00" : product.badge === "MAIS VENDIDO" ? "#2563EB" : product.badge === "NOVO" ? "#8B5CF6" : "#22C55E",
                      }}>{product.badge}</div>
                      <h3 style={{ fontSize: 13, fontWeight: 700, color: "#1F2937", marginBottom: 2, lineHeight: 1.3 }}>{product.title}</h3>
                      <p style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 4 }}>{product.location}</p>
                      <div style={{ marginBottom: 4 }}>
                        <span style={{ fontSize: 11, color: "#9CA3AF", textDecoration: "line-through" }}>{formatPrice(product.originalPrice)}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                        <span style={{ fontSize: 17, fontWeight: 800, color: "#F57C00" }}>{formatPrice(product.price)}</span>
                        {product.monthly && <span style={{ fontSize: 11, color: "#6B7280" }}>/mês</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Flash Deals Banner */}
            <div style={{
              background: "linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)",
              borderRadius: 16, padding: 20, marginBottom: 24, position: "relative", overflow: "hidden",
            }}>
              <div style={{
                position: "absolute", top: -20, right: -20, width: 100, height: 100,
                borderRadius: "50%", background: "rgba(245,124,0,0.1)",
              }} />
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <Zap style={{ width: 20, height: 20, color: "#F57C00" }} />
                <span style={{ fontSize: 14, fontWeight: 700, color: "#F57C00" }}>Ofertas Relâmpago</span>
                <div style={{
                  marginLeft: "auto", display: "flex", alignItems: "center", gap: 4,
                  background: "#DC2626", color: "#fff", padding: "3px 10px", borderRadius: 12,
                  fontSize: 12, fontWeight: 700,
                }}>
                  <Clock style={{ width: 12, height: 12 }} />
                  ACABA EM BREVE
                </div>
              </div>
              <div style={{
                background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 80, height: 60, borderRadius: 8, overflow: "hidden",
                    background: "linear-gradient(135deg, #1e3a5f, #2563EB)",
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    <MapPin style={{ width: 20, height: 20, color: "rgba(255,255,255,0.5)" }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1F2937", marginBottom: 2 }}>Resort Termas Paradise</h3>
                    <p style={{ fontSize: 12, color: "#6B7280", marginBottom: 4 }}>Caldas Novas</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 12, color: "#9CA3AF", textDecoration: "line-through" }}>R$ 1.899</span>
                      <span style={{ fontSize: 16, fontWeight: 800, color: "#22C55E" }}>R$ 1.199</span>
                    </div>
                  </div>
                  <div style={{
                    background: "#DC2626", color: "#fff", padding: "4px 8px",
                    borderRadius: 6, fontSize: 12, fontWeight: 800, transform: "rotate(-5deg)",
                  }}>-37%</div>
                </div>
              </div>
              <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ flex: 1, height: 6, background: "rgba(220,38,38,0.15)", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ width: "78%", height: "100%", background: "#DC2626", borderRadius: 3 }} />
                </div>
                <span style={{ fontSize: 11, fontWeight: 600, color: "#DC2626" }}>78% vendido</span>
              </div>
              <Link href="/flash-deals" style={{ textDecoration: "none" }}>
                <button style={{
                  width: "100%", marginTop: 12, padding: "10px 0", borderRadius: 10, border: "none",
                  background: "linear-gradient(135deg, #F57C00, #E65100)",
                  color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                }}>
                  <Zap style={{ width: 16, height: 16 }} />
                  Ver Todas as Ofertas Relâmpago
                </button>
              </Link>
            </div>

            {/* Reviews Section */}
            <div style={{
              background: "linear-gradient(135deg, #EBF5FF 0%, #DBEAFE 100%)",
              borderRadius: 16, padding: 20, marginBottom: 24, textAlign: "center",
            }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1F2937", marginBottom: 4 }}>
                Quem viaja com a <span style={{ color: "#2563EB" }}>Reservei</span>, aprova!
              </h2>
              <p style={{ fontSize: 13, color: "#6B7280", marginBottom: 16 }}>+5.000 clientes satisfeitos</p>
              <ReviewsSection />
            </div>

            {/* CTA Reservar */}
            <div style={{
              background: "#fff", borderRadius: 16, padding: 20, marginBottom: 24,
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}>
              <div style={{
                background: "linear-gradient(135deg, #22C55E, #16A34A)",
                borderRadius: 12, padding: 20, textAlign: "center", color: "#fff", marginBottom: 16,
              }}>
                <p style={{ fontSize: 12, fontWeight: 600, opacity: 0.9, marginBottom: 4 }}>Economia de R$ 30,10</p>
                <div style={{ fontSize: 32, fontWeight: 900, marginBottom: 4 }}>R$ 149,90</div>
                <Link href="/promocoes">
                  <button style={{
                    width: "100%", padding: "14px 0", borderRadius: 10, border: "none",
                    background: "#fff", color: "#22C55E", fontSize: 16, fontWeight: 800,
                    cursor: "pointer", marginTop: 8,
                  }}>RESERVAR AGORA</button>
                </Link>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Shield style={{ width: 16, height: 16, color: "#2563EB" }} />
                  <span style={{ fontSize: 12, color: "#6B7280" }}>Pagamento Seguro via</span>
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#2563EB" }}>Reservei Viagens</span>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="rsv-trust-grid" style={{ marginBottom: 24 }}>
              {[
                { icon: Shield, title: "Site Seguro", desc: "Certificado SSL", color: "#2563EB" },
                { icon: CheckCircle, title: "LGPD Conforme", desc: "Dados protegidos", color: "#22C55E" },
                { icon: Award, title: "Parceiro Oficial", desc: "Caldas Novas", color: "#F57C00" },
              ].map((badge, i) => (
                <div key={i} style={{
                  background: "#fff", borderRadius: 12, padding: 16, textAlign: "center",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                }}>
                  <badge.icon style={{ width: 28, height: 28, color: badge.color, margin: "0 auto 8px" }} />
                  <p style={{ fontSize: 12, fontWeight: 600, color: "#374151", lineHeight: 1.3, marginBottom: 2 }}>{badge.title}</p>
                  <p style={{ fontSize: 10, color: "#9CA3AF", margin: 0 }}>{badge.desc}</p>
                </div>
              ))}
            </div>
          </main>

          {/* Right Sidebar - Desktop only */}
          <aside className="rsv-sidebar">
            <div className="rsv-sidebar-card" style={{
              background: "linear-gradient(135deg, #1e3a5f, #2563EB)",
              color: "#fff", textAlign: "center",
            }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 8px" }}>Mapa de Caldas Novas</h3>
              <div style={{
                height: 140, borderRadius: 10, overflow: "hidden",
                background: "rgba(255,255,255,0.1)", marginBottom: 12,
                display: "flex", alignItems: "center", justifyContent: "center",
                border: "1px solid rgba(255,255,255,0.15)",
              }}>
                <MapPin style={{ width: 32, height: 32, color: "rgba(255,255,255,0.3)" }} />
              </div>
              <Link href="/mapa-caldas-novas" style={{ textDecoration: "none" }}>
                <button style={{
                  width: "100%", padding: "8px 0", borderRadius: 8, border: "none",
                  background: "rgba(255,255,255,0.2)", color: "#fff", fontSize: 13, fontWeight: 600,
                  cursor: "pointer",
                }}>Explorar Mapa Interativo</button>
              </Link>
            </div>

            <div className="rsv-sidebar-card">
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <Gavel style={{ width: 18, height: 18, color: "#7C3AED" }} />
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1F2937", margin: 0 }}>Leilão Ao Vivo</h3>
              </div>
              <div style={{
                background: "#F5F3FF", borderRadius: 10, padding: 12, marginBottom: 12,
                border: "1px solid #DDD6FE", textAlign: "center",
              }}>
                <p style={{ fontSize: 11, color: "#6B7280", margin: "0 0 4px" }}>Lance Atual</p>
                <div style={{ fontSize: 22, fontWeight: 900, color: "#7C3AED" }}>R$ 750,00</div>
                <p style={{ fontSize: 11, color: "#9CA3AF", margin: "4px 0 0" }}>Resort Termas Paradise</p>
              </div>
              <Link href="/leiloes" style={{ textDecoration: "none" }}>
                <button style={{
                  width: "100%", padding: "8px 0", borderRadius: 8, border: "none",
                  background: "#7C3AED", color: "#fff", fontSize: 13, fontWeight: 600,
                  cursor: "pointer",
                }}>Participar do Leilão</button>
              </Link>
            </div>

            <div className="rsv-sidebar-card">
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <TrendingUp style={{ width: 18, height: 18, color: "#22C55E" }} />
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1F2937", margin: 0 }}>Mais Procurados</h3>
              </div>
              {[
                { name: "Hot Park", searches: "2.4k buscas hoje", hot: true },
                { name: "DiRoma", searches: "1.8k buscas hoje", hot: true },
                { name: "Water Park", searches: "1.2k buscas hoje", hot: false },
                { name: "Lagoa Quente", searches: "890 buscas hoje", hot: false },
              ].map((item, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 8, padding: "8px 0",
                  borderTop: i > 0 ? "1px solid #F3F4F6" : "none",
                }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#D1D5DB", width: 20 }}>{i + 1}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#1F2937", margin: 0 }}>{item.name}</p>
                    <p style={{ fontSize: 10, color: "#9CA3AF", margin: 0 }}>{item.searches}</p>
                  </div>
                  {item.hot && <Flame style={{ width: 14, height: 14, color: "#EF4444" }} />}
                </div>
              ))}
            </div>

            <div className="rsv-sidebar-card" style={{
              background: "linear-gradient(135deg, #FFF7ED, #FFEDD5)",
              border: "1px solid #FED7AA",
            }}>
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: "#F57C00", margin: "0 0 4px" }}>Oferta Exclusiva</p>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: "#1F2937", margin: "0 0 4px" }}>Pacote Caldas Premium</h3>
                <p style={{ fontSize: 12, color: "#6B7280", margin: "0 0 8px" }}>5 Noites + Hot Park + DiRoma</p>
                <div style={{ fontSize: 24, fontWeight: 900, color: "#F57C00", marginBottom: 8 }}>R$ 2.499</div>
                <span style={{ fontSize: 11, color: "#9CA3AF", textDecoration: "line-through" }}>R$ 4.899</span>
                <Link href="/promocoes" style={{ textDecoration: "none" }}>
                  <button style={{
                    width: "100%", marginTop: 8, padding: "10px 0", borderRadius: 8, border: "none",
                    background: "#F57C00", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer",
                  }}>Aproveitar Oferta</button>
                </Link>
              </div>
            </div>

            {/* Destaques Imperdíveis - Carousel */}
            <div className="rsv-sidebar-card" style={{ padding: 0, overflow: "hidden" }}>
              <div style={{ padding: "14px 16px 10px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Zap style={{ width: 16, height: 16, color: "#F57C00" }} />
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1F2937", margin: 0 }}>Destaques Imperdíveis</h3>
                </div>
                <div style={{ display: "flex", gap: 4 }}>
                  {SIDEBAR_HIGHLIGHTS.map((_, i) => (
                    <div
                      key={i}
                      onClick={() => setHighlightIndex(i)}
                      style={{
                        width: i === highlightIndex ? 16 : 6, height: 6, borderRadius: 3,
                        background: i === highlightIndex ? SIDEBAR_HIGHLIGHTS[highlightIndex].badgeColor : "#E5E7EB",
                        transition: "all 0.3s", cursor: "pointer",
                      }}
                    />
                  ))}
                </div>
              </div>
              {(() => {
                const h = SIDEBAR_HIGHLIGHTS[highlightIndex]
                return (
                  <div style={{ padding: "0 16px 16px", transition: "opacity 0.3s" }}>
                    <div style={{
                      display: "flex", alignItems: "center", gap: 6, marginBottom: 10,
                    }}>
                      <span style={{
                        fontSize: 10, fontWeight: 800, color: "#fff",
                        background: h.badgeColor, padding: "2px 8px", borderRadius: 6,
                        display: "flex", alignItems: "center", gap: 4,
                      }}>
                        {h.type === "auction" && <Gavel style={{ width: 10, height: 10 }} />}
                        {h.type === "flash" && <Zap style={{ width: 10, height: 10 }} />}
                        {h.type === "ticket" && <Ticket style={{ width: 10, height: 10 }} />}
                        {h.badge}
                      </span>
                    </div>
                    <h4 style={{ fontSize: 14, fontWeight: 700, color: "#1F2937", margin: "0 0 2px" }}>{h.title}</h4>
                    <p style={{ fontSize: 11, color: "#6B7280", margin: "0 0 10px", display: "flex", alignItems: "center", gap: 4 }}>
                      <MapPin style={{ width: 10, height: 10 }} />{h.location}
                    </p>

                    {h.type === "auction" ? (
                      <div style={{ background: "#F5F3FF", borderRadius: 10, padding: 12, marginBottom: 10, textAlign: "center", border: "1px solid #DDD6FE" }}>
                        <p style={{ fontSize: 10, color: "#6B7280", margin: "0 0 2px" }}>Lance Atual</p>
                        <div style={{ fontSize: 22, fontWeight: 900, color: "#7C3AED" }}>R$ {h.currentBid?.toLocaleString("pt-BR")}</div>
                        <p style={{ fontSize: 10, color: "#9CA3AF", margin: "4px 0 0" }}>
                          <Users style={{ width: 10, height: 10, display: "inline", verticalAlign: "middle" }} /> {h.participants} participantes
                        </p>
                      </div>
                    ) : (
                      <div style={{ marginBottom: 10 }}>
                        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                          <span style={{ fontSize: 12, color: "#9CA3AF", textDecoration: "line-through" }}>
                            {formatPrice(h.originalPrice || 0)}
                          </span>
                          <span style={{ fontSize: 20, fontWeight: 900, color: "#22C55E" }}>
                            {formatPrice(h.price || 0)}
                          </span>
                        </div>
                        {h.type === "flash" && (
                          <>
                            <div style={{
                              display: "flex", alignItems: "center", justifyContent: "center", gap: 4, marginTop: 8,
                              background: "rgba(220,38,38,0.08)", borderRadius: 8, padding: "6px 10px",
                            }}>
                              <Clock style={{ width: 12, height: 12, color: "#DC2626" }} />
                              <span style={{ fontSize: 13, fontWeight: 800, color: "#DC2626", fontVariantNumeric: "tabular-nums" }}>
                                {String(flashCountdown.hours).padStart(2, "0")}:{String(flashCountdown.minutes).padStart(2, "0")}:{String(flashCountdown.seconds).padStart(2, "0")}
                              </span>
                            </div>
                            {h.soldPercent && (
                              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
                                <div style={{ flex: 1, height: 5, background: "rgba(220,38,38,0.12)", borderRadius: 3, overflow: "hidden" }}>
                                  <div style={{ width: `${h.soldPercent}%`, height: "100%", background: "#DC2626", borderRadius: 3, transition: "width 1s" }} />
                                </div>
                                <span style={{ fontSize: 10, fontWeight: 700, color: "#DC2626" }}>{h.soldPercent}%</span>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    )}
                    <Link href={h.link} style={{ textDecoration: "none" }}>
                      <button style={{
                        width: "100%", padding: "9px 0", borderRadius: 8, border: "none",
                        background: h.badgeColor, color: "#fff", fontSize: 12, fontWeight: 700,
                        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                      }}>
                        {h.type === "auction" ? "Dar Lance" : h.type === "flash" ? "Ver Oferta" : "Comprar Ingresso"}
                        <ChevronRight style={{ width: 14, height: 14 }} />
                      </button>
                    </Link>
                  </div>
                )
              })()}
            </div>

            {/* Últimas Reservas - Social Proof */}
            <div className="rsv-sidebar-card" style={{
              background: "linear-gradient(135deg, #F0FDF4, #DCFCE7)",
              border: "1px solid #BBF7D0",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <UserCheck style={{ width: 16, height: 16, color: "#16A34A" }} />
                <h3 style={{ fontSize: 13, fontWeight: 700, color: "#166534", margin: 0 }}>Últimas Reservas</h3>
                <div style={{
                  width: 8, height: 8, borderRadius: "50%", background: "#22C55E",
                  marginLeft: "auto", animation: "pulse 2s infinite",
                }} />
              </div>
              <div style={{ overflow: "hidden", height: 100 }}>
                {LAST_BOOKINGS.map((booking, i) => {
                  const isVisible = i === lastBookingIndex || i === (lastBookingIndex + 1) % LAST_BOOKINGS.length
                  const isFirst = i === lastBookingIndex
                  return (
                    <div key={i} style={{
                      display: isVisible ? "flex" : "none",
                      alignItems: "center", gap: 10, padding: "8px 0",
                      borderTop: !isFirst ? "1px solid rgba(34,197,94,0.15)" : "none",
                      opacity: isVisible ? 1 : 0,
                      transition: "opacity 0.5s",
                    }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: "50%",
                        background: "linear-gradient(135deg, #22C55E, #16A34A)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "#fff", fontSize: 14, fontWeight: 700, flexShrink: 0,
                      }}>{booking.name[0]}</div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 12, fontWeight: 600, color: "#1F2937", margin: 0 }}>
                          {booking.name} de {booking.city}
                        </p>
                        <p style={{ fontSize: 11, color: "#16A34A", margin: 0 }}>
                          reservou <strong>{booking.product}</strong>
                        </p>
                      </div>
                      <span style={{ fontSize: 10, color: "#6B7280", flexShrink: 0 }}>há {booking.time}</span>
                    </div>
                  )
                })}
              </div>
              <p style={{ fontSize: 10, color: "#15803D", margin: "8px 0 0", textAlign: "center", fontWeight: 600 }}>
                +47 reservas nas últimas 24h
              </p>
            </div>
          </aside>
        </div>

        {/* Footer */}
        <footer style={{
          borderTop: "1px solid #E5E7EB", paddingTop: 32, paddingBottom: 100,
          marginTop: 24,
        }}>
          <div className="rsv-footer-grid">
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%",
                  border: "2px solid #2563EB", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 8, fontWeight: 900, color: "#2563EB",
                }}>
                  <span>RSV<span style={{ color: "#F57C00" }}>360</span></span>
                </div>
                <span style={{ fontSize: 16, fontWeight: 700, color: "#2563EB" }}>Reservei Viagens</span>
              </div>
              <p style={{ fontSize: 13, color: "#2563EB", fontWeight: 600, fontStyle: "italic", marginBottom: 16 }}>
                &quot;Parques, Hotéis &amp; Atrações&quot;
              </p>
              <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
                <a href="https://www.facebook.com/comercialreservei" target="_blank" rel="noopener noreferrer" style={{ fontSize: 24 }}>📘</a>
                <a href="https://www.instagram.com/reserveiviagens" target="_blank" rel="noopener noreferrer" style={{ fontSize: 24 }}>📸</a>
                <a href="https://www.reserveiviagens.com.br" target="_blank" rel="noopener noreferrer" style={{ fontSize: 24 }}>🌐</a>
              </div>
            </div>

            <div>
              <p style={{ fontWeight: 700, color: "#1F2937", marginBottom: 8, fontSize: 14 }}>Endereços</p>
              <div style={{ marginBottom: 12, fontSize: 13, color: "#6B7280" }}>
                <p style={{ fontWeight: 600, color: "#374151", marginBottom: 2 }}>Sede Caldas Novas:</p>
                <p>Rua RP5, Residencial Primavera 2 - Caldas Novas, GO</p>
              </div>
              <div style={{ fontSize: 13, color: "#6B7280" }}>
                <p style={{ fontWeight: 600, color: "#374151", marginBottom: 2 }}>Filial Cuiabá:</p>
                <p>Av. Manoel José de Arruda, Porto - Cuiabá, MT</p>
              </div>
            </div>

            <div>
              <p style={{ fontWeight: 700, color: "#1F2937", marginBottom: 8, fontSize: 14 }}>Contato</p>
              <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 8 }}>
                <p><strong>E-mail:</strong>{" "}
                  <a href="mailto:reservas@reserveiviagens.com.br" style={{ color: "#2563EB" }}>reservas@reserveiviagens.com.br</a>
                </p>
                <p><strong>Tel:</strong>{" "}
                  <a href="tel:+556521270415" style={{ color: "#2563EB" }}>(65) 2127-0415</a>
                </p>
              </div>
              <p style={{ fontWeight: 600, color: "#374151", marginBottom: 4, fontSize: 13 }}>WhatsApp:</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {["5564993197555", "5564993068752", "5565992351207", "5565992048814"].map((num, i) => {
                  const formatted = ["(64) 99319-7555", "(64) 99306-8752", "(65) 99235-1207", "(65) 99204-8814"][i]
                  return (
                    <a key={num} href={`https://wa.me/${num}?text=Olá! Gostaria de mais informações sobre as ofertas da Reservei Viagens.`}
                      target="_blank" rel="noopener noreferrer"
                      style={{ color: "#22C55E", fontWeight: 600, fontSize: 12 }}
                    >{formatted}</a>
                  )
                })}
              </div>
            </div>
          </div>

          <div style={{ textAlign: "center", marginTop: 24 }}>
            <p style={{ fontSize: 11, color: "#9CA3AF" }}>© 2024-2026 Reservei Viagens. Todos os direitos reservados.</p>
          </div>
        </footer>
      </div>

      <ChatAgent onOpenHotelDetail={(hotel) => setSelectedHotel(hotel)} />

      {showLGPDPopup && <LGPDPopup onAccept={() => {}} onDecline={() => {}} />}

      <a
        href="https://wa.me/5564993197555?text=Olá! Gostaria de mais informações sobre as ofertas da Reservei Viagens."
        target="_blank" rel="noopener noreferrer"
        style={{
          position: "fixed", bottom: 24, right: 16, width: 56, height: 56,
          background: "#22C55E", borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 12px rgba(34,197,94,0.4)", zIndex: 50,
        }}
      >
        <Phone style={{ width: 26, height: 26, color: "#fff" }} />
      </a>

      {selectedHotel && (
        <HotelDetailPanel hotel={selectedHotel} onClose={() => setSelectedHotel(null)} />
      )}
    </div>
  )
}
