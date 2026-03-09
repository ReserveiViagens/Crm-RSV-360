import { useState, useEffect, useMemo, useRef } from "react"
import { ArrowLeft, Star, MapPin, Phone, Eye, Users, X, Check, BarChart3, Sparkles, Navigation, Building, Trees, Landmark, ChevronRight, ChevronLeft, Shield, Wifi, Coffee, Car, Waves, Heart } from "lucide-react"
import { Link } from "wouter";
import HotelDetailPanel, { type HotelDetailData } from "@/components/hotel-detail-panel"
import {
  SocialProofBanner,
  AIRecommendedBadge,
  calculateMatchScore,
  getTravelerProfile,
  PersonalizedBanner,
  CrossSellSection,
  UrgencyIndicator,
  TravelerProfileModal,
  type TravelerProfile,
} from "@/components/ai-conversion-elements"

interface HotelReview {
  name: string
  city: string
  avatar: string
  rating: number
  text: string
  date: string
}

interface ProximityPoint {
  name: string
  distance: string
  type: string
  km?: number
}

interface Hotel {
  id: string
  title: string
  description: string
  images: string[]
  stars: number
  location: string
  price: number
  original_price?: number
  features: string[]
  capacity: number
  tags?: string[]
  rating?: number
  reviewCount?: number
  roomsLeft?: number
  reviews?: HotelReview[]
  proximity?: ProximityPoint[]
}

const hotels: Hotel[] = [
  {
    id: "hot-park",
    title: "Hot Park Rio Quente",
    description: "O maior parque aquático de águas termais do mundo! Hospedagem com acesso ilimitado ao parque, piscinas naturais aquecidas e muito mais.",
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hot-park-rio-quente-resort-1-vb7vdyxEIIlbS2bWqxwBp7IaRi7x7F.jpeg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hot-park-rio-quente-resort-2-jKlP9nMxR8qZwYhVtCx4yS2fNpQr3D.jpeg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hot-park-rio-quente-resort-3-aB3cDeFgH5iJkLmN7oPqRsTuV9wXyZ.jpeg",
    ],
    stars: 5,
    location: "Rio Quente - GO",
    price: 850,
    original_price: 1200,
    features: ["Acesso ao Hot Park", "Café da manhã", "Estacionamento", "Wi-Fi"],
    capacity: 4,
    tags: ["Resort", "Família"],
    rating: 4.9,
    reviewCount: 2847,
    roomsLeft: 3,
    reviews: [
      { name: "Ana Paula", city: "Brasilia", avatar: "AP", rating: 5, text: "Incrivel! As piscinas termais sao maravilhosas e o parque e sensacional para toda a familia.", date: "Dez 2024" },
      { name: "Carlos M.", city: "Goiania", avatar: "CM", rating: 5, text: "Melhor resort que ja visitei. Atendimento impecavel e infraestrutura completa.", date: "Nov 2024" },
      { name: "Beatriz F.", city: "Sao Paulo", avatar: "BF", rating: 5, text: "Voltaremos com certeza! Experiencia unica para a familia inteira.", date: "Out 2024" },
    ],
    proximity: [
      { name: "Hot Park", distance: "Acesso direto", type: "parque", km: 0 },
      { name: "Lagoa Quente", distance: "500m", type: "natureza", km: 0.5 },
      { name: "Centro de Rio Quente", distance: "1.2km", type: "cidade", km: 1.2 },
    ],
  },
  {
    id: "golden-dolphin",
    title: "Golden Dolphin Grand Hotel",
    description: "Hotel de luxo com parque aquático privativo, piscinas termais, restaurante e entretenimento para toda a família.",
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/golden-dolphin-1-mN7oPqRsTuV9wXyZ1aB2cDeFgH3iJk.jpeg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/golden-dolphin-2-kLmN7oPqRsTuV9wXyZ1aB2cDeFgH3i.jpeg",
    ],
    stars: 5,
    location: "Caldas Novas - GO",
    price: 650,
    original_price: 900,
    features: ["Parque Aquático", "All Inclusive", "Kids Club", "Spa"],
    capacity: 4,
    tags: ["Resort", "Família"],
    rating: 4.8,
    reviewCount: 1934,
    roomsLeft: 5,
    reviews: [
      { name: "Fernanda S.", city: "Sao Paulo", avatar: "FS", rating: 5, text: "All inclusive excelente! As criancas amaram o kids club.", date: "Jan 2025" },
      { name: "Roberto L.", city: "Uberlandia", avatar: "RL", rating: 4, text: "Otimo custo-beneficio. Parque aquatico muito bom.", date: "Dez 2024" },
      { name: "Claudia M.", city: "Brasilia", avatar: "CM", rating: 5, text: "Servico impecavel. Nota 10 para o atendimento e conforto.", date: "Nov 2024" },
    ],
    proximity: [
      { name: "Parque Aquatico Privativo", distance: "Interno", type: "parque", km: 0 },
      { name: "Lago Corumba", distance: "3km", type: "natureza", km: 3 },
      { name: "Centro Caldas Novas", distance: "2km", type: "cidade", km: 2 },
    ],
  },
  {
    id: "diroma",
    title: "Di Roma Acqua Park",
    description: "Hotel com parque aquático integrado, toboáguas emocionantes e piscinas termais naturais. Perfeito para famílias!",
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/diroma-1-pQrStUvW9xYz1aB2cDeFgH3iJkLmN7o.jpeg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/diroma-2-rStUvW9xYz1aB2cDeFgH3iJkLmN7oPq.jpeg",
    ],
    stars: 4,
    location: "Caldas Novas - GO",
    price: 480,
    original_price: 650,
    features: ["Parque Aquático", "Meia Pensão", "Recreação Infantil", "Bar"],
    capacity: 4,
    tags: ["Resort", "Família"],
    rating: 4.7,
    reviewCount: 1567,
    roomsLeft: 8,
    reviews: [
      { name: "Juliana R.", city: "BH", avatar: "JR", rating: 5, text: "Toboguas incriveis! Diversao garantida para toda a familia.", date: "Jan 2025" },
      { name: "Andre S.", city: "Goiania", avatar: "AS", rating: 4, text: "Boa estrutura e piscinas muito agradaveis. Voltaremos.", date: "Dez 2024" },
    ],
    proximity: [
      { name: "Parque Di Roma", distance: "Interno", type: "parque", km: 0 },
      { name: "Serra de Caldas", distance: "5km", type: "natureza", km: 5 },
      { name: "Centro Caldas Novas", distance: "1.5km", type: "cidade", km: 1.5 },
    ],
  },
  {
    id: "lacqua",
    title: "Lacqua Di Roma",
    description: "Resort moderno com piscinas de águas termais, toboáguas radicais e completa infraestrutura de lazer.",
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/lacqua-1-tUvW9xYz1aB2cDeFgH3iJkLmN7oPqRs.jpeg",
    ],
    stars: 4,
    location: "Caldas Novas - GO",
    price: 520,
    original_price: 720,
    features: ["Complexo Aquático", "Café da Manhã", "Estacionamento", "Academia"],
    capacity: 4,
    tags: ["Resort"],
    rating: 4.6,
    reviewCount: 1203,
    roomsLeft: 6,
    reviews: [
      { name: "Pedro H.", city: "Campo Grande", avatar: "PH", rating: 4, text: "Complexo aquatico moderno e muito bem cuidado. Recomendo!", date: "Nov 2024" },
      { name: "Marina C.", city: "Cuiaba", avatar: "MC", rating: 5, text: "Estrutura excelente, piscinas termais incriveis!", date: "Out 2024" },
    ],
    proximity: [
      { name: "Complexo Lacqua", distance: "Interno", type: "parque", km: 0 },
      { name: "Lagoa de Pirapitinga", distance: "4km", type: "natureza", km: 4 },
      { name: "Centro Caldas Novas", distance: "2.5km", type: "cidade", km: 2.5 },
    ],
  },
  {
    id: "prive",
    title: "Privé Caldas Novas",
    description: "Hotel boutique com águas termais, ambiente intimista e atendimento personalizado. Ideal para casais.",
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/prive-1-vW9xYz1aB2cDeFgH3iJkLmN7oPqRsTu.jpeg",
    ],
    stars: 4,
    location: "Caldas Novas - GO",
    price: 380,
    original_price: 550,
    features: ["Piscinas Termais", "Café da Manhã", "Romântico", "Wi-Fi"],
    capacity: 2,
    tags: ["Econômico", "Casal"],
    rating: 4.8,
    reviewCount: 987,
    roomsLeft: 2,
    reviews: [
      { name: "Lucia T.", city: "Ribeirao Preto", avatar: "LT", rating: 5, text: "Perfeito para casais! Ambiente romantico e piscinas termais deliciosas.", date: "Jan 2025" },
      { name: "Marcos A.", city: "Cuiaba", avatar: "MA", rating: 5, text: "Atendimento personalizado, hotel aconchegante e bem localizado.", date: "Dez 2024" },
    ],
    proximity: [
      { name: "Fontes Termais", distance: "200m", type: "natureza", km: 0.2 },
      { name: "Centro Caldas Novas", distance: "800m", type: "cidade", km: 0.8 },
      { name: "Parque Estadual", distance: "3km", type: "natureza", km: 3 },
    ],
  },
]

const FILTERS = ["Todos", "5 Estrelas", "4 Estrelas", "Resort", "Econômico"]

const TAG_COLORS: Record<string, { bg: string; color: string }> = {
  "Resort": { bg: "#DBEAFE", color: "#1D4ED8" },
  "Econômico": { bg: "#D1FAE5", color: "#065F46" },
  "Família": { bg: "#FEF3C7", color: "#92400E" },
  "Casal": { bg: "#FCE7F3", color: "#9D174D" },
}

function MatchBadge({ score }: { score: number }) {
  const color = score >= 80 ? "#22C55E" : score >= 60 ? "#EAB308" : "#9CA3AF"
  const bg = score >= 80 ? "#F0FDF4" : score >= 60 ? "#FEFCE8" : "#F9FAFB"
  const borderColor = score >= 80 ? "#BBF7D0" : score >= 60 ? "#FDE68A" : "#E5E7EB"
  const label = score >= 80 ? "Excelente Match" : score >= 60 ? "Bom Match" : "Match"
  const ringPercent = score

  return (
    <div
      data-testid={`badge-match-${score}`}
      style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        background: bg, border: `1.5px solid ${borderColor}`,
        borderRadius: 12, padding: "5px 12px",
      }}
    >
      <div style={{ position: "relative", width: 28, height: 28 }}>
        <svg width="28" height="28" viewBox="0 0 28 28" style={{ transform: "rotate(-90deg)" }}>
          <circle cx="14" cy="14" r="11" fill="none" stroke="#E5E7EB" strokeWidth="3" />
          <circle
            cx="14" cy="14" r="11" fill="none"
            stroke={color} strokeWidth="3"
            strokeDasharray={`${(ringPercent / 100) * 69.1} 69.1`}
            strokeLinecap="round"
            style={{ transition: "stroke-dasharray 0.8s ease" }}
          />
        </svg>
        <span style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 8, fontWeight: 800, color,
        }}>
          {score}
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span style={{ fontSize: 13, fontWeight: 800, color, lineHeight: 1.2 }}>
          {score}%
        </span>
        <span style={{ fontSize: 9, fontWeight: 600, color, opacity: 0.8, lineHeight: 1.2 }}>
          {label}
        </span>
      </div>
    </div>
  )
}

function MatchBadgeLarge({ score, reasons }: { score: number; reasons?: string[] }) {
  const color = score >= 80 ? "#22C55E" : score >= 60 ? "#EAB308" : "#9CA3AF"
  const bg = score >= 80 ? "#F0FDF4" : score >= 60 ? "#FEFCE8" : "#F9FAFB"
  const borderColor = score >= 80 ? "#BBF7D0" : score >= 60 ? "#FDE68A" : "#E5E7EB"
  const label = score >= 80 ? "Excelente Match" : score >= 60 ? "Bom Match" : "Match Basico"

  return (
    <div
      data-testid={`badge-match-large-${score}`}
      style={{
        background: bg, border: `1.5px solid ${borderColor}`,
        borderRadius: 14, padding: "12px 16px",
        display: "flex", alignItems: "center", gap: 12,
      }}
    >
      <div style={{ position: "relative", width: 48, height: 48, flexShrink: 0 }}>
        <svg width="48" height="48" viewBox="0 0 48 48" style={{ transform: "rotate(-90deg)" }}>
          <circle cx="24" cy="24" r="20" fill="none" stroke="#E5E7EB" strokeWidth="4" />
          <circle
            cx="24" cy="24" r="20" fill="none"
            stroke={color} strokeWidth="4"
            strokeDasharray={`${(score / 100) * 125.6} 125.6`}
            strokeLinecap="round"
            style={{ transition: "stroke-dasharray 1s ease" }}
          />
        </svg>
        <span style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 14, fontWeight: 800, color,
        }}>
          {score}%
        </span>
      </div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 700, color, marginBottom: 2 }}>
          {label}
        </div>
        {reasons && reasons.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {reasons.map((r) => (
              <span key={r} style={{
                fontSize: 10, padding: "2px 6px", borderRadius: 6,
                background: `${color}15`, color, fontWeight: 600,
              }}>
                {r}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function ReviewCard({ review }: { review: HotelReview }) {
  return (
    <div
      data-testid={`review-${review.name}`}
      style={{
        display: "flex", gap: 10, padding: "10px 0",
        borderBottom: "1px solid #F3F4F6",
      }}
    >
      <div style={{
        width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
        background: "linear-gradient(135deg, #2563EB, #1D4ED8)",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#fff", fontSize: 12, fontWeight: 700,
      }}>
        {review.avatar}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#1F2937" }}>{review.name}</span>
          <span style={{ fontSize: 11, color: "#9CA3AF" }}>{review.city}</span>
          <span style={{ fontSize: 10, color: "#9CA3AF" }}>{review.date}</span>
        </div>
        <div style={{ display: "flex", gap: 2, margin: "3px 0" }}>
          {Array.from({ length: 5 }, (_, i) => (
            <Star key={i} size={10} fill={i < review.rating ? "#FBBF24" : "transparent"} style={{ color: i < review.rating ? "#FBBF24" : "#D1D5DB" }} />
          ))}
        </div>
        <p style={{ fontSize: 12, color: "#6B7280", margin: 0, lineHeight: 1.4 }}>{review.text}</p>
      </div>
    </div>
  )
}

function ReviewsHighlight({ reviews, rating, reviewCount }: { reviews: HotelReview[]; rating?: number; reviewCount?: number }) {
  const [showAll, setShowAll] = useState(false)
  const displayReviews = showAll ? reviews : reviews.slice(0, 2)

  return (
    <div data-testid="reviews-highlight" style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Star style={{ width: 14, height: 14, color: "#FBBF24", fill: "#FBBF24" }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: "#1F2937" }}>
            Avaliacoes em destaque
          </span>
        </div>
        {rating && (
          <div style={{
            display: "flex", alignItems: "center", gap: 4,
            background: "#FEF3C7", padding: "3px 8px", borderRadius: 8,
          }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: "#92400E" }}>{rating}</span>
            <Star style={{ width: 10, height: 10, color: "#FBBF24", fill: "#FBBF24" }} />
            {reviewCount && (
              <span style={{ fontSize: 10, color: "#92400E", fontWeight: 500 }}>
                ({reviewCount.toLocaleString("pt-BR")})
              </span>
            )}
          </div>
        )}
      </div>
      {displayReviews.map((review) => (
        <ReviewCard key={review.name} review={review} />
      ))}
      {reviews.length > 2 && (
        <button
          data-testid="button-show-more-reviews"
          onClick={(e) => { e.stopPropagation(); setShowAll(!showAll) }}
          style={{
            border: "none", background: "transparent", cursor: "pointer",
            fontSize: 12, fontWeight: 600, color: "#2563EB", padding: "6px 0",
            display: "flex", alignItems: "center", gap: 4,
          }}
        >
          {showAll ? "Ver menos" : `Ver todas ${reviews.length} avaliacoes`}
          <ChevronRight style={{ width: 12, height: 12, transform: showAll ? "rotate(90deg)" : "none", transition: "transform 0.2s" }} />
        </button>
      )}
    </div>
  )
}

function ProximityMap({ points }: { points: ProximityPoint[] }) {
  const typeConfig: Record<string, { bg: string; color: string; Icon: typeof Building }> = {
    parque: { bg: "#DBEAFE", color: "#1D4ED8", Icon: Waves },
    natureza: { bg: "#D1FAE5", color: "#065F46", Icon: Trees },
    cidade: { bg: "#FEF3C7", color: "#92400E", Icon: Building },
  }
  const maxKm = Math.max(...points.map(p => p.km || 5), 5)

  return (
    <div data-testid="proximity-map" style={{ marginTop: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
        <Navigation style={{ width: 13, height: 13, color: "#6B7280" }} />
        <span style={{ fontSize: 12, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: 0.5 }}>
          Distancia dos pontos turisticos
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {points.map((point) => {
          const config = typeConfig[point.type] || typeConfig.cidade
          const IconComp = config.Icon
          const barWidth = point.km !== undefined ? Math.max(((point.km / maxKm) * 100), 8) : 50

          return (
            <div
              key={point.name}
              data-testid={`proximity-${point.name}`}
              style={{ display: "flex", alignItems: "center", gap: 8 }}
            >
              <div style={{
                width: 26, height: 26, borderRadius: 6,
                background: config.bg, display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <IconComp style={{ width: 13, height: 13, color: config.color }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 3 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "#374151" }}>{point.name}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: config.color }}>{point.distance}</span>
                </div>
                <div style={{ height: 4, background: "#F3F4F6", borderRadius: 2 }}>
                  <div style={{
                    height: "100%", borderRadius: 2,
                    background: config.color,
                    width: `${barWidth}%`,
                    transition: "width 0.5s ease",
                    opacity: 0.6,
                  }} />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ViewersBadge({ count }: { count: number }) {
  return (
    <div
      data-testid="viewers-badge"
      style={{
        display: "flex", alignItems: "center", gap: 6,
        background: "rgba(0,0,0,0.6)", borderRadius: 8,
        padding: "5px 10px", backdropFilter: "blur(4px)",
      }}
    >
      <div style={{
        width: 7, height: 7, borderRadius: "50%",
        background: "#22C55E",
        animation: "pulse 2s infinite",
        boxShadow: "0 0 4px rgba(34,197,94,0.6)",
      }} />
      <Eye style={{ width: 12, height: 12, color: "#fff" }} />
      <span style={{ fontSize: 11, color: "#fff", fontWeight: 600 }}>
        {count} vendo agora
      </span>
    </div>
  )
}

function CompareModal({
  hotels: compareHotels,
  onClose,
  formatPrice,
  matchScores,
}: {
  hotels: Hotel[]
  onClose: () => void
  formatPrice: (p: number) => string
  matchScores: Record<string, number>
}) {
  if (compareHotels.length < 2) return null

  const a = compareHotels[0]
  const b = compareHotels[1]

  const allFeatures = Array.from(new Set([...a.features, ...b.features]))

  const compareRows: { label: string; aVal: string; bVal: string; highlight?: "a" | "b" | null }[] = [
    {
      label: "Preco/Diaria",
      aVal: formatPrice(a.price),
      bVal: formatPrice(b.price),
      highlight: a.price < b.price ? "a" : b.price < a.price ? "b" : null,
    },
    {
      label: "Estrelas",
      aVal: `${a.stars} estrelas`,
      bVal: `${b.stars} estrelas`,
      highlight: a.stars > b.stars ? "a" : b.stars > a.stars ? "b" : null,
    },
    {
      label: "Avaliacao",
      aVal: `${a.rating || "-"}`,
      bVal: `${b.rating || "-"}`,
      highlight: (a.rating || 0) > (b.rating || 0) ? "a" : (b.rating || 0) > (a.rating || 0) ? "b" : null,
    },
    {
      label: "Avaliacoes",
      aVal: `${(a.reviewCount || 0).toLocaleString("pt-BR")}`,
      bVal: `${(b.reviewCount || 0).toLocaleString("pt-BR")}`,
      highlight: (a.reviewCount || 0) > (b.reviewCount || 0) ? "a" : (b.reviewCount || 0) > (a.reviewCount || 0) ? "b" : null,
    },
    {
      label: "Capacidade",
      aVal: `${a.capacity} pessoa${a.capacity > 1 ? "s" : ""}`,
      bVal: `${b.capacity} pessoa${b.capacity > 1 ? "s" : ""}`,
      highlight: null,
    },
    {
      label: "Match IA",
      aVal: `${matchScores[a.id] || 0}%`,
      bVal: `${matchScores[b.id] || 0}%`,
      highlight: (matchScores[a.id] || 0) > (matchScores[b.id] || 0) ? "a" : (matchScores[b.id] || 0) > (matchScores[a.id] || 0) ? "b" : null,
    },
  ]

  return (
    <div
      data-testid="compare-modal"
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 16,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff", borderRadius: 20, width: "100%", maxWidth: 580,
          maxHeight: "90vh", overflow: "auto", position: "relative",
        }}
      >
        <button
          data-testid="button-close-compare"
          onClick={onClose}
          style={{
            position: "sticky", top: 12, float: "right", marginRight: 12,
            width: 32, height: 32,
            borderRadius: "50%", border: "none", background: "#F3F4F6",
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 10,
          }}
        >
          <X style={{ width: 16, height: 16, color: "#6B7280" }} />
        </button>

        <div style={{ padding: "24px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, justifyContent: "center" }}>
            <BarChart3 style={{ width: 22, height: 22, color: "#2563EB" }} />
            <h2 style={{ fontSize: 18, fontWeight: 800, color: "#1F2937", margin: 0 }}>
              Comparar Hoteis
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
            {[a, b].map((h) => (
              <div key={h.id} style={{ textAlign: "center" }}>
                <img
                  src={h.images[0]}
                  alt={h.title}
                  style={{ width: "100%", height: 110, objectFit: "cover", borderRadius: 12, marginBottom: 8 }}
                />
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1F2937", margin: "0 0 4px" }}>{h.title}</h3>
                <div style={{ display: "flex", justifyContent: "center", gap: 2, margin: "4px 0" }}>
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} size={12} fill={i < h.stars ? "#FBBF24" : "transparent"} style={{ color: i < h.stars ? "#FBBF24" : "#D1D5DB" }} />
                  ))}
                </div>
                <MatchBadge score={matchScores[h.id] || 75} />
              </div>
            ))}
          </div>

          <div style={{ borderTop: "1px solid #E5E7EB", paddingTop: 16, marginBottom: 16 }}>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: "#6B7280", margin: "0 0 12px", textTransform: "uppercase", letterSpacing: 0.5 }}>
              Comparacao Detalhada
            </h4>
            {compareRows.map((row) => (
              <div
                key={row.label}
                style={{
                  display: "grid", gridTemplateColumns: "1fr 2fr 1fr",
                  alignItems: "center", padding: "8px 0",
                  borderBottom: "1px solid #F3F4F6",
                }}
              >
                <div style={{
                  textAlign: "center", fontSize: 13, fontWeight: row.highlight === "a" ? 700 : 500,
                  color: row.highlight === "a" ? "#22C55E" : "#374151",
                }}>
                  {row.aVal}
                </div>
                <div style={{ fontSize: 12, color: "#6B7280", textAlign: "center", fontWeight: 600 }}>{row.label}</div>
                <div style={{
                  textAlign: "center", fontSize: 13, fontWeight: row.highlight === "b" ? 700 : 500,
                  color: row.highlight === "b" ? "#22C55E" : "#374151",
                }}>
                  {row.bVal}
                </div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: "1px solid #E5E7EB", paddingTop: 16, marginBottom: 16 }}>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: "#6B7280", margin: "0 0 12px", textTransform: "uppercase", letterSpacing: 0.5 }}>
              Recursos
            </h4>
            {allFeatures.map((f) => (
              <div
                key={f}
                style={{
                  display: "grid", gridTemplateColumns: "1fr 2fr 1fr",
                  alignItems: "center", padding: "8px 0",
                  borderBottom: "1px solid #F3F4F6",
                }}
              >
                <div style={{ textAlign: "center" }}>
                  {a.features.includes(f) ? (
                    <Check style={{ width: 16, height: 16, color: "#22C55E" }} />
                  ) : (
                    <X style={{ width: 16, height: 16, color: "#D1D5DB" }} />
                  )}
                </div>
                <div style={{ fontSize: 13, color: "#374151", textAlign: "center", fontWeight: 500 }}>{f}</div>
                <div style={{ textAlign: "center" }}>
                  {b.features.includes(f) ? (
                    <Check style={{ width: 16, height: 16, color: "#22C55E" }} />
                  ) : (
                    <X style={{ width: 16, height: 16, color: "#D1D5DB" }} />
                  )}
                </div>
              </div>
            ))}
          </div>

          {(a.reviews?.length || b.reviews?.length) && (
            <div style={{ borderTop: "1px solid #E5E7EB", paddingTop: 16, marginBottom: 16 }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: "#6B7280", margin: "0 0 12px", textTransform: "uppercase", letterSpacing: 0.5 }}>
                Avaliacoes em Destaque
              </h4>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {[a, b].map((h) => (
                  <div key={h.id}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#1F2937", marginBottom: 6 }}>{h.title.split(" ").slice(0, 2).join(" ")}</div>
                    {h.reviews?.slice(0, 1).map((review) => (
                      <div key={review.name} style={{ fontSize: 11, color: "#6B7280", lineHeight: 1.4 }}>
                        <div style={{ display: "flex", gap: 2, marginBottom: 2 }}>
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star key={i} size={8} fill={i < review.rating ? "#FBBF24" : "transparent"} style={{ color: i < review.rating ? "#FBBF24" : "#D1D5DB" }} />
                          ))}
                        </div>
                        <p style={{ margin: 0 }}>"{review.text}"</p>
                        <span style={{ fontSize: 10, color: "#9CA3AF" }}>- {review.name}, {review.city}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[a, b].map((h) => (
              <div key={h.id} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#22C55E", marginBottom: 4 }}>{formatPrice(h.price)}</div>
                <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 8 }}>diaria p/ {h.capacity} pessoa{h.capacity > 1 ? "s" : ""}</div>
                <button
                  data-testid={`button-reserve-compare-${h.id}`}
                  onClick={() => window.open(`https://wa.me/5564993197555?text=Olá! Quero reservar o ${h.title} com desconto especial!`, "_blank")}
                  style={{
                    width: "100%", padding: "12px 0", border: "none", borderRadius: 10, cursor: "pointer",
                    fontSize: 13, fontWeight: 700, color: "#fff",
                    background: "linear-gradient(135deg, #22C55E 0%, #16A34A 100%)",
                  }}
                >
                  Reservar
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function getMatchReasons(profile: TravelerProfile | null, hotel: Hotel): string[] {
  if (!profile) return []
  const reasons: string[] = []
  const budgetLabels: Record<string, string> = {
    economico: "Orcamento", moderado: "Preco ideal", confortavel: "Conforto", premium: "Premium",
  }
  if (budgetLabels[profile.budget]) reasons.push(budgetLabels[profile.budget])
  if (profile.tripType === "familia" && hotel.tags?.includes("Família")) reasons.push("Para Familias")
  if (profile.tripType === "romantico" && hotel.tags?.includes("Casal")) reasons.push("Romantico")
  if (profile.interests.includes("parques") && hotel.features.some(f => f.toLowerCase().includes("parque") || f.toLowerCase().includes("aquat"))) reasons.push("Parques Aquaticos")
  if (profile.interests.includes("spa") && hotel.features.some(f => f.toLowerCase().includes("spa"))) reasons.push("Spa")
  if (hotel.stars >= 5) reasons.push("5 Estrelas")
  return reasons.slice(0, 3)
}

export default function HoteisPage() {
  const [selectedHotel, setSelectedHotel] = useState<HotelDetailData | null>(null)
  const [activeFilter, setActiveFilter] = useState("Todos")
  const [profile, setProfile] = useState<TravelerProfile | null>(null)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [compareList, setCompareList] = useState<string[]>([])
  const [showCompare, setShowCompare] = useState(false)
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const [viewerCounts, setViewerCounts] = useState<Record<string, number>>({})
  const [animatedCards, setAnimatedCards] = useState<Set<string>>(new Set())

  useEffect(() => {
    const p = getTravelerProfile()
    setProfile(p)
    if (!p) {
      const timer = setTimeout(() => setShowProfileModal(true), 2000)
      return () => clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    const counts: Record<string, number> = {}
    hotels.forEach((h) => {
      counts[h.id] = Math.floor(Math.random() * 18) + 5
    })
    setViewerCounts(counts)

    const interval = setInterval(() => {
      setViewerCounts((prev) => {
        const next = { ...prev }
        const keys = Object.keys(next)
        const key = keys[Math.floor(Math.random() * keys.length)]
        next[key] = Math.max(3, next[key] + (Math.random() > 0.5 ? 1 : -1))
        return next
      })
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      const ids = new Set(hotels.map(h => h.id))
      setAnimatedCards(ids)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  const matchScores = useMemo(() => {
    const scores: Record<string, number> = {}
    hotels.forEach((h) => {
      scores[h.id] = calculateMatchScore(profile, { price: h.price, tags: h.tags })
    })
    return scores
  }, [profile])

  const recommendedHotels = useMemo(() => {
    return [...hotels].sort((a, b) => (matchScores[b.id] || 0) - (matchScores[a.id] || 0)).slice(0, 3)
  }, [matchScores])

  const filteredHotels = hotels.filter((hotel) => {
    if (activeFilter === "Todos") return true
    if (activeFilter === "5 Estrelas") return hotel.stars === 5
    if (activeFilter === "4 Estrelas") return hotel.stars === 4
    if (activeFilter === "Resort") return hotel.tags?.includes("Resort")
    if (activeFilter === "Econômico") return hotel.tags?.includes("Econômico")
    return true
  })

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price)

  const calculateDiscount = (price: number, originalPrice?: number) => {
    if (!originalPrice || originalPrice <= price) return 0
    return Math.round(((originalPrice - price) / originalPrice) * 100)
  }

  const toggleCompare = (id: string) => {
    setCompareList((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id)
      if (prev.length >= 2) return prev
      return [...prev, id]
    })
  }

  const openHotelDetail = (hotel: Hotel) => {
    setSelectedHotel({
      id: hotel.id,
      title: hotel.title,
      description: hotel.description,
      images: hotel.images,
      stars: hotel.stars,
      location: hotel.location,
      price: hotel.price,
      originalPrice: hotel.original_price,
      features: hotel.features,
      capacity: hotel.capacity,
    })
  }

  const renderHotelCard = (hotel: Hotel, isRecommended = false, index = 0) => {
    const discount = calculateDiscount(hotel.price, hotel.original_price)
    const isHovered = hoveredCard === hotel.id
    const isInCompare = compareList.includes(hotel.id)
    const matchScore = matchScores[hotel.id] || 75
    const viewers = viewerCounts[hotel.id] || 8
    const savings = hotel.original_price ? hotel.original_price - hotel.price : 0
    const reasons = getMatchReasons(profile, hotel)
    const isAnimated = animatedCards.has(hotel.id)

    return (
      <div
        key={hotel.id}
        data-testid={`card-hotel-${hotel.id}`}
        style={{
          background: "#fff",
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: isHovered
            ? "0 8px 30px rgba(0,0,0,0.15)"
            : isRecommended
              ? "0 4px 20px rgba(37,99,235,0.15)"
              : "0 2px 12px rgba(0,0,0,0.08)",
          cursor: "pointer",
          transition: "box-shadow 0.3s, transform 0.5s, opacity 0.5s",
          transform: isHovered ? "scale(1.02)" : isAnimated ? "scale(1)" : "scale(0.95)",
          opacity: isAnimated ? 1 : 0,
          border: isRecommended ? "2px solid #2563EB" : isInCompare ? "2px solid #F57C00" : "none",
          position: "relative",
          transitionDelay: `${index * 80}ms`,
        }}
        onMouseEnter={() => setHoveredCard(hotel.id)}
        onMouseLeave={() => setHoveredCard(null)}
        onClick={() => openHotelDetail(hotel)}
      >
        <div style={{ position: "relative" }}>
          <img
            src={hotel.images[0]}
            alt={hotel.title}
            style={{ width: "100%", height: 200, objectFit: "cover", display: "block" }}
          />
          {discount > 0 && (
            <span
              data-testid={`badge-discount-${hotel.id}`}
              style={{
                position: "absolute", top: 12, right: 12,
                background: "#EF4444", color: "#fff",
                fontSize: 12, fontWeight: 700,
                padding: "4px 10px", borderRadius: 12,
              }}
            >
              -{discount}% OFF
            </span>
          )}
          {isRecommended && (
            <span
              style={{
                position: "absolute", top: 12, left: 12,
                background: "linear-gradient(135deg, #2563EB, #1D4ED8)", color: "#fff",
                fontSize: 11, fontWeight: 700,
                padding: "5px 10px", borderRadius: 12,
                display: "flex", alignItems: "center", gap: 4,
              }}
            >
              <Sparkles style={{ width: 12, height: 12 }} />
              IA RECOMENDA
            </span>
          )}

          <div style={{ position: "absolute", bottom: 12, left: 12 }}>
            <ViewersBadge count={viewers} />
          </div>

          <button
            data-testid={`button-compare-${hotel.id}`}
            onClick={(e) => { e.stopPropagation(); toggleCompare(hotel.id) }}
            style={{
              position: "absolute", bottom: 12, right: 12,
              width: 32, height: 32, borderRadius: "50%",
              border: isInCompare ? "2px solid #F57C00" : "1px solid rgba(255,255,255,0.6)",
              background: isInCompare ? "#F57C00" : "rgba(0,0,0,0.4)",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s",
            }}
          >
            <BarChart3 style={{ width: 14, height: 14, color: "#fff" }} />
          </button>
        </div>

        <div style={{ padding: 16 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 6 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: "#1F2937", flex: 1 }}>
              {hotel.title}
            </h3>
            <MatchBadge score={matchScore} />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <div style={{ display: "flex", gap: 2 }}>
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  size={14}
                  fill={i < hotel.stars ? "#FBBF24" : "transparent"}
                  style={{ color: i < hotel.stars ? "#FBBF24" : "#D1D5DB" }}
                />
              ))}
            </div>
            {hotel.rating && (
              <span style={{ fontSize: 12, color: "#6B7280", fontWeight: 600 }}>
                {hotel.rating} · {hotel.reviewCount?.toLocaleString("pt-BR")} avaliacoes
              </span>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: "#6B7280", marginBottom: 8 }}>
            <MapPin size={14} />
            {hotel.location}
          </div>

          <p
            style={{
              fontSize: 13, color: "#6B7280", lineHeight: 1.5, margin: "0 0 10px",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical" as const,
              overflow: "hidden",
            }}
          >
            {hotel.description}
          </p>

          {reasons.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 8 }}>
              {reasons.map((r) => (
                <span key={r} style={{
                  fontSize: 10, padding: "3px 8px", borderRadius: 6,
                  background: "#EFF6FF", color: "#2563EB", fontWeight: 600,
                  display: "flex", alignItems: "center", gap: 3,
                }}>
                  <Check style={{ width: 10, height: 10 }} />
                  {r}
                </span>
              ))}
            </div>
          )}

          {hotel.tags && hotel.tags.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
              {hotel.tags.map((tag) => {
                const tagStyle = TAG_COLORS[tag] || { bg: "#F3F4F6", color: "#374151" }
                return (
                  <span
                    key={tag}
                    data-testid={`tag-${tag}-${hotel.id}`}
                    style={{
                      fontSize: 11, padding: "3px 10px", borderRadius: 20,
                      background: tagStyle.bg, color: tagStyle.color,
                      fontWeight: 600,
                    }}
                  >
                    {tag}
                  </span>
                )
              })}
            </div>
          )}

          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
            {hotel.features.map((feature) => (
              <span
                key={feature}
                style={{
                  fontSize: 11, padding: "3px 8px", borderRadius: 6,
                  background: "#EFF6FF", color: "#2563EB", fontWeight: 500,
                }}
              >
                {feature}
              </span>
            ))}
          </div>

          {hotel.roomsLeft && hotel.roomsLeft <= 5 && (
            <div style={{ marginBottom: 10 }}>
              <UrgencyIndicator roomsLeft={hotel.roomsLeft} />
            </div>
          )}

          {hotel.reviews && hotel.reviews.length > 0 && (
            <ReviewsHighlight
              reviews={hotel.reviews}
              rating={hotel.rating}
              reviewCount={hotel.reviewCount}
            />
          )}

          {hotel.proximity && hotel.proximity.length > 0 && (
            <ProximityMap points={hotel.proximity} />
          )}

          <div style={{ borderTop: "1px solid #F3F4F6", paddingTop: 12, marginTop: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <div>
                {hotel.original_price && hotel.original_price > hotel.price && (
                  <span style={{ fontSize: 13, color: "#9CA3AF", textDecoration: "line-through", marginRight: 8 }}>
                    {formatPrice(hotel.original_price)}
                  </span>
                )}
                <div style={{ fontSize: 22, fontWeight: 800, color: "#22C55E", margin: "2px 0 2px" }}>
                  {formatPrice(hotel.price)}
                </div>
                <span style={{ fontSize: 11, color: "#9CA3AF" }}>
                  diaria p/ {hotel.capacity} pessoa{hotel.capacity > 1 ? "s" : ""}
                </span>
              </div>
              {savings > 0 && (
                <div
                  data-testid={`badge-savings-${hotel.id}`}
                  style={{
                    marginLeft: "auto", background: "#DCFCE7", color: "#166534",
                    fontSize: 12, fontWeight: 700, padding: "6px 12px", borderRadius: 8,
                    display: "flex", alignItems: "center", gap: 4,
                  }}
                >
                  <Shield style={{ width: 12, height: 12 }} />
                  Economize {formatPrice(savings)}
                </div>
              )}
            </div>
          </div>

          <button
            data-testid={`button-reserve-${hotel.id}`}
            onClick={(e) => {
              e.stopPropagation()
              window.open(
                `https://wa.me/5564993197555?text=Olá! Quero reservar o ${hotel.title} com desconto especial!`,
                "_blank",
              )
            }}
            style={{
              width: "100%", marginTop: 12, padding: "12px 0", border: "none", borderRadius: 10,
              cursor: "pointer", fontSize: 14, fontWeight: 700, color: "#fff",
              background: "linear-gradient(135deg, #22C55E 0%, #16A34A 100%)",
              transition: "opacity 0.2s",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}
          >
            <Phone style={{ width: 16, height: 16 }} />
            Reservar Agora
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="rsv-subpage">
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.85; transform: scale(1.05); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
      `}</style>

      <div
        style={{
          background: "linear-gradient(135deg, #1e3a5f 0%, #0D47A1 50%, #2563EB 100%)",
          color: "#fff",
          padding: "24px 20px 28px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Link href="/" style={{ color: "#fff", display: "flex", alignItems: "center" }}>
              <ArrowLeft size={22} />
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
          {!profile && (
            <button
              data-testid="button-create-profile"
              onClick={() => setShowProfileModal(true)}
              style={{
                padding: "8px 14px", border: "1px solid rgba(255,255,255,0.3)",
                borderRadius: 10, background: "rgba(255,255,255,0.1)", color: "#fff",
                fontSize: 12, fontWeight: 600, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 6,
                backdropFilter: "blur(4px)",
              }}
            >
              <Sparkles style={{ width: 14, height: 14 }} />
              Personalizar
            </button>
          )}
        </div>
        <h1 data-testid="text-page-title" style={{ fontSize: 26, fontWeight: 800, margin: "0 0 8px" }}>
          Hoteis em Caldas Novas
        </h1>
        <p style={{ fontSize: 14, margin: 0, opacity: 0.85, lineHeight: 1.5 }}>
          Encontre as melhores hospedagens em Caldas Novas e Rio Quente com precos exclusivos
        </p>

        <div style={{ display: "flex", gap: 0, borderBottom: "2px solid rgba(255,255,255,0.15)", marginTop: 16 }}>
          {FILTERS.map((filter) => (
            <button
              key={filter}
              data-testid={`button-filter-${filter}`}
              onClick={() => setActiveFilter(filter)}
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

      <SocialProofBanner pageName="hoteis" />
      <PersonalizedBanner profile={profile} />

      {recommendedHotels.length > 0 && (
        <div style={{ padding: "20px 16px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <Sparkles style={{ width: 22, height: 22, color: "#F57C00" }} />
            <h2 data-testid="text-ai-recommendations-title" style={{ fontSize: 18, fontWeight: 800, color: "#1F2937", margin: 0 }}>
              {profile
                ? `Baseado no seu perfil de ${
                    { relaxamento: "Relaxamento", aventura: "Aventura", familia: "Familia", romantico: "Romantico", amigos: "Amigos", negocios: "Negocios" }[profile.tripType] || profile.tripType
                  }, recomendamos:`
                : "Hoteis Recomendados Para Voce"}
            </h2>
          </div>
          {profile && (
            <p data-testid="text-ai-recommendations-subtitle" style={{ fontSize: 13, color: "#6B7280", margin: "0 0 14px", paddingLeft: 30 }}>
              Selecionamos os melhores hoteis com base no seu orcamento{" "}
              <span style={{ fontWeight: 700, color: "#2563EB" }}>
                {({ economico: "Economico", moderado: "Moderado", confortavel: "Confortavel", premium: "Premium" } as Record<string, string>)[profile.budget] || profile.budget}
              </span>
              {" "}e interesses
            </p>
          )}
          {!profile && (
            <p style={{ fontSize: 13, color: "#6B7280", margin: "0 0 14px", paddingLeft: 30 }}>
              Crie seu perfil de viajante para recomendacoes ainda mais precisas
            </p>
          )}
          <div style={{ display: "flex", gap: 14, overflowX: "auto", paddingBottom: 8 }}>
            {recommendedHotels.map((hotel, idx) => (
              <div key={hotel.id} style={{ minWidth: 300, maxWidth: 340, flexShrink: 0 }}>
                {renderHotelCard(hotel, true, idx)}
              </div>
            ))}
          </div>
        </div>
      )}

      {compareList.length > 0 && (
        <div
          data-testid="compare-bar"
          style={{
            margin: "16px 16px 0", padding: "12px 16px", borderRadius: 12,
            background: "linear-gradient(135deg, #FFF7ED, #FFEDD5)",
            border: "1px solid #FDBA74",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            flexWrap: "wrap", gap: 8,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <BarChart3 style={{ width: 18, height: 18, color: "#EA580C" }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: "#9A3412" }}>
              {compareList.length}/2 hoteis selecionados para comparacao
            </span>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {compareList.length === 2 && (
              <button
                data-testid="button-compare-now"
                onClick={() => setShowCompare(true)}
                style={{
                  padding: "8px 20px", border: "none", borderRadius: 8, cursor: "pointer",
                  fontSize: 13, fontWeight: 700, color: "#fff",
                  background: "linear-gradient(135deg, #EA580C, #C2410C)",
                }}
              >
                Comparar Agora
              </button>
            )}
            <button
              data-testid="button-clear-compare"
              onClick={() => setCompareList([])}
              style={{
                padding: "6px 12px", border: "1px solid #FDBA74", borderRadius: 8,
                cursor: "pointer", fontSize: 12, fontWeight: 600, color: "#9A3412",
                background: "transparent",
              }}
            >
              Limpar
            </button>
          </div>
        </div>
      )}

      <div style={{ padding: "20px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <h2 data-testid="text-all-hotels-title" style={{ fontSize: 18, fontWeight: 800, color: "#1F2937", margin: 0 }}>
            {activeFilter === "Todos" ? "Todos os Hoteis" : `Hoteis: ${activeFilter}`}
          </h2>
          <span style={{ fontSize: 13, color: "#6B7280", fontWeight: 500 }}>
            {filteredHotels.length} resultado{filteredHotels.length !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="rsv-subpage-grid">
          {filteredHotels.map((hotel, idx) => renderHotelCard(hotel, false, idx))}
        </div>
        {filteredHotels.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <Building style={{ width: 48, height: 48, color: "#D1D5DB", margin: "0 auto 12px" }} />
            <p style={{ fontSize: 15, color: "#6B7280", fontWeight: 600 }}>Nenhum hotel encontrado para este filtro</p>
            <button
              data-testid="button-clear-filter"
              onClick={() => setActiveFilter("Todos")}
              style={{
                marginTop: 8, padding: "8px 20px", border: "1px solid #E5E7EB",
                borderRadius: 8, background: "#fff", cursor: "pointer",
                fontSize: 13, fontWeight: 600, color: "#2563EB",
              }}
            >
              Ver todos os hoteis
            </button>
          </div>
        )}
      </div>

      <CrossSellSection
        title="Combine sua estadia com experiencias"
        items={[
          { name: "Ingresso Hot Park", price: 189, link: "/ingressos", badge: "POPULAR" },
          { name: "Passeio Lagoa Quente", price: 79, link: "/atracoes", badge: "NOVO" },
          { name: "Day Use Di Roma", price: 120, link: "/ingressos" },
          { name: "Tour Cidade", price: 59, link: "/atracoes" },
        ]}
      />

      <div
        data-testid="cta-whatsapp-section"
        style={{
          margin: "0 16px 24px",
          background: "linear-gradient(135deg, #22C55E 0%, #16A34A 100%)",
          borderRadius: 16, padding: "28px 20px", textAlign: "center", color: "#fff",
        }}
      >
        <Phone size={32} style={{ marginBottom: 8, opacity: 0.9 }} />
        <h3 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 8px" }}>Precisa de Ajuda?</h3>
        <p style={{ fontSize: 14, margin: "0 0 16px", opacity: 0.9 }}>
          Fale com nossos especialistas e encontre o hotel perfeito!
        </p>
        <button
          data-testid="button-whatsapp-help"
          onClick={() =>
            window.open("https://wa.me/5564993197555?text=Olá! Preciso de ajuda para escolher um hotel em Caldas Novas.", "_blank")
          }
          style={{
            padding: "12px 28px", border: "none", borderRadius: 10, cursor: "pointer",
            fontSize: 14, fontWeight: 700, background: "#fff", color: "#16A34A",
            display: "inline-flex", alignItems: "center", gap: 8,
          }}
        >
          <Phone size={16} />
          Falar com Especialista
        </button>
      </div>

      <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 50 }}>
        <button
          data-testid="button-whatsapp-float"
          onClick={() =>
            window.open("https://wa.me/5564993197555?text=Olá! Quero saber mais sobre os hotéis em Caldas Novas.", "_blank")
          }
          style={{
            width: 56, height: 56, borderRadius: "50%", border: "none", cursor: "pointer",
            background: "#22C55E", display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 16px rgba(34,197,94,0.4)",
          }}
        >
          <Phone size={26} style={{ color: "#fff" }} />
        </button>
      </div>

      {selectedHotel && (
        <HotelDetailPanel hotel={selectedHotel} onClose={() => setSelectedHotel(null)} />
      )}

      {showProfileModal && (
        <TravelerProfileModal
          onClose={() => setShowProfileModal(false)}
          onSave={(p) => { setProfile(p); setShowProfileModal(false) }}
        />
      )}

      {showCompare && compareList.length === 2 && (
        <CompareModal
          hotels={hotels.filter((h) => compareList.includes(h.id))}
          onClose={() => setShowCompare(false)}
          formatPrice={formatPrice}
          matchScores={matchScores}
        />
      )}
    </div>
  )
}
