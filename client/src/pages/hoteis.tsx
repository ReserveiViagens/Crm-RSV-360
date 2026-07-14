import { useState, useEffect, useMemo, useRef, useCallback } from "react"
import { Star, MapPin, Phone, Eye, Users, X, Check, BarChart3, Sparkles, Navigation, Building, Trees, ChevronRight, ChevronLeft, Shield, Wifi, Coffee, Car, Waves, Heart, Lock, Tag, LayoutGrid, Wallet, Info, ChevronDown, ChevronUp } from "lucide-react"
import { Link, useSearch, useLocation } from "wouter";
import HotelDetailPanel, { type HotelDetailData } from "@/components/hotel-detail-panel"
import { HotelCategoryNav, type HotelCategory } from "@/components/hotel/HotelCategoryNav"
import { buildSectionTypeNav, CATALOG_DIVIDER } from "@/lib/catalogNav"
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
import { HomeHeader } from "@/components/home/HomeHeader"
import { HomeFooter } from "@/components/home/HomeFooter"
import { MobileCTABar } from "@/components/home/MobileCTABar"
import { CatalogPageShell } from "@/components/layouts/CatalogPageShell"
import SearchFiltersDrawer from "@/components/search/SearchFiltersDrawer"
import { FilterPopover } from "@/components/search/FilterPopover"
import { useUnifiedSearch } from "@/hooks/useUnifiedSearch"
import SearchBar from "@/components/search/SearchBar"
import SearchResultsSummary from "@/components/search/SearchResultsSummary"
import SearchEmptyState from "@/components/search/SearchEmptyState"
import { clearPriceRange } from "@/lib/search-query"
import {
  buildHoteisCotacaoHref,
  buildWhatsAppReserveUrl,
} from "@/lib/hoteis-cotacao-map"
import type { SearchFilters, SearchItem } from "@/types/search"

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

const FILTERS = [
  { label: "Todos",      value: "Todos",       icon: LayoutGrid },
  { label: "5 Estrelas", value: "5 Estrelas",  icon: Star },
  { label: "4 Estrelas", value: "4 Estrelas",  icon: Star },
  { label: "Resort",     value: "Resort",      icon: Waves },
  { label: "Econômico",  value: "Econômico",   icon: Wallet },
]

const LIVE_TICKER = [
  { name: "Maria S.", city: "São Paulo", hotel: "Hot Park Rio Quente", ago: "2 min" },
  { name: "Pedro A.", city: "Brasília", hotel: "diRoma Acqua Park", ago: "5 min" },
  { name: "Lucas M.", city: "Goiânia", hotel: "Lagoa Quente Resort", ago: "8 min" },
  { name: "Ana C.", city: "Belo Horizonte", hotel: "Náutico Praia Clube", ago: "11 min" },
  { name: "Camila F.", city: "Curitiba", hotel: "Tauá Resort", ago: "14 min" },
  { name: "Rafael B.", city: "Rio de Janeiro", hotel: "Hot Park Rio Quente", ago: "17 min" },
  { name: "Juliana P.", city: "Salvador", hotel: "diRoma Acqua Park", ago: "20 min" },
]

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
                <a
                  data-testid={`button-reserve-compare-${h.id}`}
                  href={buildHoteisCotacaoHref(h.id)}
                  style={{
                    display: "block", width: "100%", padding: "12px 0", border: "none", borderRadius: 10,
                    textDecoration: "none", textAlign: "center", boxSizing: "border-box",
                    fontSize: 13, fontWeight: 700, color: "#fff",
                    background: "linear-gradient(135deg, #22C55E 0%, #16A34A 100%)",
                  }}
                >
                  Reservar
                </a>
                <a
                  data-testid={`button-whatsapp-compare-${h.id}`}
                  href={buildWhatsAppReserveUrl(h.title)}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "block", width: "100%", marginTop: 6, padding: "8px 0", borderRadius: 10,
                    textDecoration: "none", textAlign: "center", boxSizing: "border-box",
                    fontSize: 11, fontWeight: 600, color: "#16A34A",
                    border: "1px solid #86EFAC", background: "#F0FDF4",
                  }}
                >
                  Falar no WhatsApp
                </a>
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
  const search = useSearch()
  const [, navigate] = useLocation()
  const [selectedHotel, setSelectedHotel] = useState<HotelDetailData | null>(null)
  const [activeFilter, setActiveFilter] = useState("Todos")

  const { filters: searchFilters, setFilter: setSearchFilter, setFilters: setSearchFilters, clearAll: clearAllSearch, data: searchData, isLoading: searchLoading } = useUnifiedSearch({
    syncUrl: true,
    basePath: "/hoteis",
    initialFilters: { type: "hotel" },
  })
  const [profile, setProfile] = useState<TravelerProfile | null>(null)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [compareList, setCompareList] = useState<string[]>([])
  const [showCompare, setShowCompare] = useState(false)
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false)
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const [viewerCounts, setViewerCounts] = useState<Record<string, number>>({})
  const [animatedCards, setAnimatedCards] = useState<Set<string>>(new Set())
  const [expandedSaibaMais, setExpandedSaibaMais] = useState<Set<string>>(new Set())
  const [expandedDetalhes, setExpandedDetalhes] = useState<Set<string>>(new Set())
  const [tickerIndex, setTickerIndex] = useState(0)
  const [recSlideIdx, setRecSlideIdx] = useState(0)
  const [recSlideTransition, setRecSlideTransition] = useState(true)
  const [recSlidePaused, setRecSlidePaused] = useState(false)
  const [recSlideStep, setRecSlideStep] = useState(314)
  const recFirstCardRef = useRef<HTMLDivElement>(null)

  const measureSlideStep = useCallback(() => {
    if (!recFirstCardRef.current) return
    const cardWidth = recFirstCardRef.current.getBoundingClientRect().width
    const gap = 14
    setRecSlideStep(cardWidth + gap)
  }, [])

  useEffect(() => {
    measureSlideStep()
    const observer = new ResizeObserver(measureSlideStep)
    if (recFirstCardRef.current) observer.observe(recFirstCardRef.current)
    return () => observer.disconnect()
  }, [measureSlideStep])

  useEffect(() => {
    const params = new URLSearchParams(search)
    const perfil = params.get("perfil")
    const perfilToProfile: Record<string, string> = {
      familia: "familia",
      casal: "casal",
      negocios: "negocios",
      economico: "economia",
    }
    const perfilToChip: Record<string, string> = {
      familia: "Família",
      casal: "Casal",
      negocios: "Negócios",
      economico: "Econômico",
    }
    if (perfil && perfilToProfile[perfil]) {
      setSearchFilters({ ...searchFilters, type: "hotel", profile: perfilToProfile[perfil] })
      setActiveFilter(perfilToChip[perfil] ?? "Todos")
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  useEffect(() => {
    const p = getTravelerProfile()
    setProfile(p)
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

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIndex(prev => (prev + 1) % LIVE_TICKER.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const matchScores = useMemo(() => {
    const scores: Record<string, number> = {}
    hotels.forEach((h) => {
      scores[h.id] = calculateMatchScore(profile, { price: h.price, tags: h.tags })
    })
    return scores
  }, [profile])

  const maisReservadoId = useMemo(() => {
    return [...hotels].sort((a, b) => (b.reviewCount || b.reviews?.length || 0) - (a.reviewCount || a.reviews?.length || 0))[0]?.id
  }, [])

  const melhorCustoBeneficioId = useMemo(() => {
    return [...hotels].sort((a, b) => {
      const scoreA = (a.stars * 100) / (a.price || 1)
      const scoreB = (b.stars * 100) / (b.price || 1)
      return scoreB - scoreA
    })[0]?.id
  }, [])

  const recommendedHotels = useMemo(() => {
    return [...hotels].sort((a, b) => (matchScores[b.id] || 0) - (matchScores[a.id] || 0)).slice(0, 3)
  }, [matchScores])

  useEffect(() => {
    if (recSlidePaused || recommendedHotels.length <= 1) return
    const interval = setInterval(() => setRecSlideIdx(p => p + 1), 3500)
    return () => clearInterval(interval)
  }, [recSlidePaused, recommendedHotels.length])

  useEffect(() => {
    if (recSlideIdx > 0 && recSlideIdx >= recommendedHotels.length) {
      const t = setTimeout(() => { setRecSlideTransition(false); setRecSlideIdx(0) }, 420)
      return () => clearTimeout(t)
    }
  }, [recSlideIdx, recommendedHotels.length])

  useEffect(() => {
    if (!recSlideTransition) {
      const t = setTimeout(() => setRecSlideTransition(true), 50)
      return () => clearTimeout(t)
    }
  }, [recSlideTransition])

  const apiHotels: SearchItem[] = useMemo(() => {
    const results = searchData?.results ?? []
    return results.filter(r => r.type === "hotel")
  }, [searchData])

  const filteredHotels = useMemo(() => {
    return apiHotels
  }, [apiHotels])

  const dynamicFilters = useMemo(() => {
    type DynFilter = { label: string; value: string; icon: typeof LayoutGrid; filterUpdate: Partial<SearchFilters> }
    const base: DynFilter[] = [
      { label: "Todos", value: "Todos", icon: LayoutGrid, filterUpdate: { profile: undefined, rating: undefined, maxPrice: undefined, enterprise: undefined, category: undefined } },
    ]
    const categories = searchData?.facets?.categories ?? {}
    const enterprises = searchData?.facets?.enterprises ?? {}
    const profiles = searchData?.facets?.profiles ?? {}
    const CLEAR = { profile: undefined, rating: undefined, maxPrice: undefined, enterprise: undefined, category: undefined }
    if (Object.keys(categories).some(c => c.includes("5"))) {
      base.push({ label: "5 Estrelas", value: "5 Estrelas", icon: Star, filterUpdate: { ...CLEAR, rating: 5 } })
    }
    if (Object.keys(categories).some(c => c.includes("4"))) {
      base.push({ label: "4 Estrelas", value: "4 Estrelas", icon: Star, filterUpdate: { ...CLEAR, rating: 4 } })
    }
    if (Object.keys(categories).some(c => c.toLowerCase().includes("resort"))) {
      base.push({ label: "Resort", value: "Resort", icon: Waves, filterUpdate: { ...CLEAR, category: "resort" } })
    }
    if (profiles["familia"]) {
      base.push({ label: "Família", value: "Família", icon: Users, filterUpdate: { ...CLEAR, profile: "familia" } })
    }
    if (profiles["casal"]) {
      base.push({ label: "Casal", value: "Casal", icon: Heart, filterUpdate: { ...CLEAR, profile: "casal" } })
    }
    if (profiles["premium"]) {
      base.push({ label: "Premium", value: "Premium", icon: Star, filterUpdate: { ...CLEAR, profile: "premium" } })
    }
    Object.keys(enterprises).slice(0, 4).forEach(ent => {
      base.push({ label: ent, value: `ent:${ent}`, icon: Building, filterUpdate: { ...CLEAR, enterprise: ent } })
    })
    base.push({ label: "Econômico", value: "Econômico", icon: Wallet, filterUpdate: { ...CLEAR, profile: "economia" } })
    return base
  }, [searchData])

  const hasAnySearchFilter = !!(searchFilters.q || searchFilters.minPrice !== undefined || searchFilters.maxPrice !== undefined || searchFilters.rating !== undefined || searchFilters.profile || searchFilters.enterprise || searchFilters.city)

  const handleRemoveSearchFilter = (key: keyof SearchFilters | "priceRange") => {
    if (key === "priceRange") {
      setSearchFilters(clearPriceRange(searchFilters))
    } else if (key === "profile") {
      const updated: Partial<SearchFilters> = { profile: undefined }
      setSearchFilters({ ...searchFilters, ...updated })
      setActiveFilter("Todos")
    } else {
      const updated: Partial<SearchFilters> = { [key]: undefined }
      setSearchFilters({ ...searchFilters, ...updated })
    }
  }

  const handleClearAll = () => {
    clearAllSearch()
    setSearchFilter("type", "hotel")
    setActiveFilter("Todos")
  }

  const getLocalHotel = (id: string): Hotel | undefined => hotels.find(h => h.id === id)

  const searchItemToHotel = (item: SearchItem): Hotel => {
    const local = getLocalHotel(item.id)
    const stars = item.category.includes("5") ? 5 : item.category.includes("4") ? 4 : 3
    return {
      id: item.id,
      title: item.name,
      description: item.descriptionLong || item.descriptionShort,
      images: item.images.length > 0 ? item.images : local?.images ?? [],
      stars,
      location: `${item.city} - ${item.state}`,
      price: item.priceFrom,
      original_price: local?.original_price,
      features: item.amenities.length > 0 ? item.amenities : local?.features ?? [],
      capacity: local?.capacity ?? 4,
      tags: item.profiles.length > 0 ? item.profiles.map(p => p.charAt(0).toUpperCase() + p.slice(1)) : local?.tags,
      rating: item.rating,
      reviewCount: item.reviewCount,
      roomsLeft: local?.roomsLeft,
      reviews: local?.reviews,
      proximity: local?.proximity,
    }
  }

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

  const toggleSaibaMais = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setExpandedSaibaMais(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      return next
    })
  }

  const toggleDetalhes = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setExpandedDetalhes(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      return next
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
    const isMaisReservado = hotel.id === maisReservadoId
    const isMelhorCusto = hotel.id === melhorCustoBeneficioId && !isMaisReservado
    const isSaibaMaisOpen = expandedSaibaMais.has(hotel.id)
    const isDetalhesOpen = expandedDetalhes.has(hotel.id)
    const isLowAvailability = hotel.roomsLeft != null && hotel.roomsLeft <= 3

    return (
      <div
        key={hotel.id}
        data-testid={`card-hotel-${hotel.id}`}
        style={{
          background: "#fff",
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: isHovered
            ? "0 12px 40px rgba(37,99,235,0.18), 0 4px 16px rgba(0,0,0,0.10)"
            : isRecommended
              ? "0 4px 20px rgba(37,99,235,0.15)"
              : "0 2px 12px rgba(0,0,0,0.08)",
          cursor: "pointer",
          transition: "box-shadow 0.3s, transform 0.35s, opacity 0.5s",
          transform: isHovered ? "translateY(-3px) scale(1.01)" : isAnimated ? "scale(1)" : "scale(0.95)",
          opacity: isAnimated ? 1 : 0,
          border: isRecommended ? "2px solid #2563EB" : isInCompare ? "2px solid #F57C00" : "1px solid #F3F4F6",
          position: "relative",
          transitionDelay: `${index * 80}ms`,
        }}
        onMouseEnter={() => setHoveredCard(hotel.id)}
        onMouseLeave={() => setHoveredCard(null)}
        onClick={() => openHotelDetail(hotel)}
      >
        {/* Image section */}
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

          {/* Top-left badge: priority order */}
          {isRecommended && (
            <span style={{
              position: "absolute", top: 12, left: 12,
              background: "linear-gradient(135deg, #2563EB, #1D4ED8)", color: "#fff",
              fontSize: 11, fontWeight: 700, padding: "5px 10px", borderRadius: 12,
              display: "flex", alignItems: "center", gap: 4,
            }}>
              <Sparkles style={{ width: 12, height: 12 }} />
              IA RECOMENDA
            </span>
          )}
          {!isRecommended && isMaisReservado && (
            <span
              data-testid={`badge-mais-reservado-${hotel.id}`}
              style={{
                position: "absolute", top: 12, left: 12,
                background: "linear-gradient(135deg, #D97706, #B45309)", color: "#fff",
                fontSize: 11, fontWeight: 700, padding: "5px 10px", borderRadius: 12,
                display: "flex", alignItems: "center", gap: 4,
                animation: "pulse 2s infinite",
              }}
            >
              🔥 Oferta do Dia
            </span>
          )}
          {!isRecommended && !isMaisReservado && isMelhorCusto && (
            <span
              data-testid={`badge-melhor-custo-${hotel.id}`}
              style={{
                position: "absolute", top: 12, left: 12,
                background: "linear-gradient(135deg, #059669, #047857)", color: "#fff",
                fontSize: 11, fontWeight: 700, padding: "5px 10px", borderRadius: 12,
                display: "flex", alignItems: "center", gap: 4,
              }}
            >
              💎 Melhor Custo-Benefício
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

        {/* Scarcity bar for very low availability */}
        {isLowAvailability && (
          <div style={{
            background: "linear-gradient(90deg, #FEE2E2, #FECACA)",
            padding: "6px 16px",
            display: "flex", alignItems: "center", gap: 6,
            borderBottom: "1px solid #FCA5A5",
          }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#DC2626", animation: "pulse 1.5s infinite" }}>
              ⚠️ Apenas {hotel.roomsLeft} quartos disponíveis — reserva antes que acabe!
            </span>
          </div>
        )}

        <div style={{ padding: 16 }}>
          {/* Title + match badge */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 6 }}>
            <h3 style={{ fontSize: 17, fontWeight: 700, margin: 0, color: "#1F2937", flex: 1, lineHeight: 1.3 }}>
              {hotel.title}
            </h3>
            <MatchBadge score={matchScore} />
          </div>

          {/* Stars + rating */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <div style={{ display: "flex", gap: 2 }}>
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  size={13}
                  fill={i < hotel.stars ? "#FBBF24" : "transparent"}
                  style={{ color: i < hotel.stars ? "#FBBF24" : "#D1D5DB" }}
                />
              ))}
            </div>
            {hotel.rating && (
              <span style={{ fontSize: 12, color: "#6B7280", fontWeight: 600 }}>
                {hotel.rating} · {hotel.reviewCount?.toLocaleString("pt-BR")} avaliações
              </span>
            )}
          </div>

          {/* Location */}
          <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: "#6B7280", marginBottom: 10 }}>
            <MapPin size={13} />
            {hotel.location}
          </div>

          {/* Urgency (non-scarcity bar case) */}
          {hotel.roomsLeft && hotel.roomsLeft > 3 && hotel.roomsLeft <= 5 && (
            <div style={{ marginBottom: 10 }}>
              <UrgencyIndicator roomsLeft={hotel.roomsLeft} />
            </div>
          )}

          {/* ── ACCORDION TOGGLE BUTTONS ── */}
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <button
              data-testid={`button-saiba-mais-${hotel.id}`}
              className="rsv-tab-btn"
              onClick={(e) => toggleSaibaMais(hotel.id, e)}
              style={{
                flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                padding: "9px 0", borderRadius: 999, cursor: "pointer",
                background: isSaibaMaisOpen
                  ? "linear-gradient(135deg, #2563EB, #1D4ED8)"
                  : "linear-gradient(135deg, #EFF6FF, #DBEAFE)",
                border: isSaibaMaisOpen ? "1.5px solid #1D4ED8" : "1.5px solid #BFDBFE",
                color: isSaibaMaisOpen ? "#fff" : "#2563EB",
                fontSize: 12, fontWeight: 700,
                boxShadow: isSaibaMaisOpen ? "0 4px 14px rgba(37,99,235,0.35)" : "none",
                transition: "all 0.2s",
              }}
            >
              <Info size={13} />
              Saiba mais
              {isSaibaMaisOpen
                ? <ChevronUp size={13} style={{ transition: "transform 0.2s" }} />
                : <ChevronDown size={13} style={{ transition: "transform 0.2s" }} />
              }
            </button>

            <button
              data-testid={`button-detalhes-${hotel.id}`}
              className="rsv-tab-btn-orange"
              onClick={(e) => toggleDetalhes(hotel.id, e)}
              style={{
                flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                padding: "9px 0", borderRadius: 999, cursor: "pointer",
                background: isDetalhesOpen
                  ? "linear-gradient(135deg, #F57C00, #EA580C)"
                  : "linear-gradient(135deg, #FFF7ED, #FFEDD5)",
                border: isDetalhesOpen ? "1.5px solid #EA580C" : "1.5px solid #FED7AA",
                color: isDetalhesOpen ? "#fff" : "#EA580C",
                fontSize: 12, fontWeight: 700,
                boxShadow: isDetalhesOpen ? "0 4px 14px rgba(245,124,0,0.35)" : "none",
                transition: "all 0.2s",
              }}
            >
              {isDetalhesOpen
                ? <ChevronUp size={13} style={{ transition: "transform 0.2s" }} />
                : <ChevronDown size={13} style={{ transition: "transform 0.2s" }} />
              }
              + Detalhes
            </button>
          </div>

          {/* ── SAIBA MAIS PANEL ── */}
          <div
            data-testid={`panel-saiba-mais-${hotel.id}`}
            className={`rsv-accordion-panel${isSaibaMaisOpen ? " open" : ""}`}
            onClick={e => e.stopPropagation()}
          >
            <div style={{
              background: "#F8FAFF", borderRadius: 12, padding: "12px 14px",
              marginBottom: 12, border: "1px solid #DBEAFE",
            }}>
              <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.6, margin: "0 0 10px" }}>
                {hotel.description}
              </p>

              {hotel.features.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 10 }}>
                  {hotel.features.map((feature) => (
                    <span key={feature} style={{
                      fontSize: 11, padding: "3px 9px", borderRadius: 6,
                      background: "#EFF6FF", color: "#2563EB", fontWeight: 500,
                      display: "flex", alignItems: "center", gap: 3,
                    }}>
                      <Check style={{ width: 9, height: 9 }} />
                      {feature}
                    </span>
                  ))}
                </div>
              )}

              {reasons.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 10 }}>
                  {reasons.map((r) => (
                    <span key={r} style={{
                      fontSize: 10, padding: "3px 8px", borderRadius: 6,
                      background: "#ECFDF5", color: "#065F46", fontWeight: 600,
                      display: "flex", alignItems: "center", gap: 3,
                    }}>
                      <Sparkles style={{ width: 9, height: 9 }} />
                      {r}
                    </span>
                  ))}
                </div>
              )}

              {hotel.reviews && hotel.reviews.slice(0, 2).map((rev, i) => (
                <div key={i} style={{
                  padding: "8px 0", borderTop: i === 0 ? "1px solid #DBEAFE" : "none",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                    <div style={{
                      width: 26, height: 26, borderRadius: "50%",
                      background: "linear-gradient(135deg, #2563EB, #7C3AED)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 10, fontWeight: 700, color: "#fff", flexShrink: 0,
                    }}>{rev.avatar}</div>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#1F2937" }}>{rev.name}</span>
                    <span style={{ fontSize: 11, color: "#9CA3AF", marginLeft: "auto" }}>{rev.date}</span>
                  </div>
                  <p style={{ fontSize: 12, color: "#4B5563", margin: 0, lineHeight: 1.5 }}>{rev.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── + DETALHES PANEL ── */}
          <div
            data-testid={`panel-detalhes-${hotel.id}`}
            className={`rsv-accordion-panel${isDetalhesOpen ? " open" : ""}`}
            onClick={e => e.stopPropagation()}
          >
            <div style={{
              background: "#FFFBF5", borderRadius: 12, padding: "12px 14px",
              marginBottom: 12, border: "1px solid #FED7AA",
            }}>
              {/* Tags */}
              {hotel.tags && hotel.tags.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 10 }}>
                  {hotel.tags.map((tag) => {
                    const tagStyle = TAG_COLORS[tag] || { bg: "#F3F4F6", color: "#374151" }
                    return (
                      <span key={tag} data-testid={`tag-${tag}-${hotel.id}`} style={{
                        fontSize: 11, padding: "3px 10px", borderRadius: 20,
                        background: tagStyle.bg, color: tagStyle.color, fontWeight: 600,
                      }}>{tag}</span>
                    )
                  })}
                </div>
              )}

              {/* Capacity */}
              <div style={{ display: "flex", gap: 12, marginBottom: 10, flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#6B7280" }}>
                  <Users size={13} style={{ color: "#F57C00" }} />
                  <span>Capacidade: <strong>{hotel.capacity} pessoa{hotel.capacity > 1 ? "s" : ""}</strong></span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#6B7280" }}>
                  <Shield size={13} style={{ color: "#22C55E" }} />
                  <span>Cancelamento flexível</span>
                </div>
              </div>

              {/* Proximity */}
              {hotel.proximity && hotel.proximity.length > 0 && (
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "#92400E", margin: "0 0 6px", textTransform: "uppercase", letterSpacing: 0.5 }}>
                    📍 Pontos próximos
                  </p>
                  {hotel.proximity.slice(0, 4).map((pt, i) => (
                    <div key={i} style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "4px 0", borderTop: i > 0 ? "1px solid #FED7AA" : "none",
                      fontSize: 12, color: "#374151",
                    }}>
                      <span>{pt.name}</span>
                      <span style={{ fontWeight: 600, color: "#EA580C" }}>{pt.distance}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Policy note */}
              <div style={{
                marginTop: 10, padding: "7px 10px", borderRadius: 8,
                background: "#ECFDF5", border: "1px solid #A7F3D0",
                display: "flex", alignItems: "center", gap: 6,
              }}>
                <Check size={12} style={{ color: "#059669", flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: "#065F46", fontWeight: 600 }}>
                  O que está incluído: diária + café da manhã + acesso às áreas comuns
                </span>
              </div>
            </div>
          </div>

          {/* Price row */}
          <div style={{ borderTop: "1px solid #F3F4F6", paddingTop: 12, marginTop: 4 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <div>
                {hotel.original_price && hotel.original_price > hotel.price && (
                  <span style={{ fontSize: 13, color: "#9CA3AF", textDecoration: "line-through", marginRight: 8 }}>
                    {formatPrice(hotel.original_price)}
                  </span>
                )}
                <div style={{
                  fontSize: 22, fontWeight: 800, margin: "2px 0 2px",
                  color: isHovered ? "#16A34A" : "#22C55E",
                  transition: "color 0.25s",
                }}>
                  {formatPrice(hotel.price)}
                </div>
                <span style={{ fontSize: 11, color: "#9CA3AF" }}>
                  diária p/ {hotel.capacity} pessoa{hotel.capacity > 1 ? "s" : ""}
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

          <a
            data-testid={`button-reserve-${hotel.id}`}
            href={buildHoteisCotacaoHref(hotel.id)}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%", marginTop: 12, padding: "13px 0", border: "none", borderRadius: 12,
              fontSize: 14, fontWeight: 700, color: "#fff", textDecoration: "none",
              background: "linear-gradient(135deg, #22C55E 0%, #16A34A 100%)",
              boxShadow: "0 4px 16px rgba(34,197,94,0.35)",
              transition: "opacity 0.2s, box-shadow 0.2s",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              boxSizing: "border-box",
            }}
          >
            Reservar Agora
          </a>
          <a
            data-testid={`button-whatsapp-${hotel.id}`}
            href={buildWhatsAppReserveUrl(hotel.title)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%", marginTop: 8, padding: "10px 0", borderRadius: 12,
              fontSize: 13, fontWeight: 600, color: "#16A34A", textDecoration: "none",
              border: "1.5px solid #86EFAC", background: "#F0FDF4",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              boxSizing: "border-box",
            }}
          >
            <Phone style={{ width: 14, height: 14 }} />
            Falar no WhatsApp
          </a>
        </div>
      </div>
    )
  }

  const scrollToHotels = () => {
    const el = document.getElementById("hoteis-grid")
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const searchBarSlot = (
    <>
      <div
        style={{ padding: "12px 16px 0", background: "#fff", position: "sticky", top: 64, zIndex: 31 }}
        data-testid="search-bar-hoteis-wrapper"
      >
        <SearchBar
          value={searchFilters.q || ""}
          activeType="hotel"
          onSearch={(q) => setSearchFilters({ ...searchFilters, q })}
          onTypeChange={() => {}}
          onFiltersOpen={() => {}}
          hasActiveFilters={hasAnySearchFilter}
          hideTypeChips={true}
        />
      </div>
      <div
        className="rsv-filter-bar"
        data-testid="filter-bar-hoteis"
        style={{
          background: "#fff", borderBottom: "1px solid #E5E7EB",
          padding: "8px 16px", display: "flex", gap: 8, alignItems: "stretch",
          position: "sticky", top: 84, zIndex: 30,
        }}
      >
        <div className="rsv-catalog-desktop-only" style={{ display: "flex", alignItems: "center" }}>
          <FilterPopover
            filters={searchFilters}
            facets={searchData?.facets}
            onFiltersChange={setSearchFilters}
            onClearAll={clearAllSearch}
          />
        </div>
        <button
          className="rsv-catalog-mobile-only"
          data-testid="button-open-filters"
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
        <HotelCategoryNav
          categories={[...buildSectionTypeNav("hoteis"), CATALOG_DIVIDER, ...dynamicFilters]}
          activeFilter={activeFilter}
          onSelect={(f) => {
            if (f.href) {
              navigate(f.href)
              return
            }
            if (f.value === "__nav_hoteis") {
              setActiveFilter("Todos")
              setSearchFilters({ ...searchFilters, type: "hotel", profile: undefined, rating: undefined, maxPrice: undefined, enterprise: undefined, category: undefined })
              return
            }
            setActiveFilter(f.value)
            setSearchFilters({ ...searchFilters, type: "hotel", ...f.filterUpdate })
          }}
        />
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
        @keyframes tickerSlide {
          from { opacity: 0; transform: translateX(28px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .rsv-accordion-panel {
          overflow: hidden;
          max-height: 0;
          transition: max-height 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.25s;
          opacity: 0;
        }
        .rsv-accordion-panel.open {
          max-height: 800px;
          opacity: 1;
        }
        .rsv-tab-btn:hover {
          filter: brightness(0.94);
          box-shadow: 0 4px 18px rgba(37,99,235,0.25) !important;
        }
        .rsv-tab-btn-orange:hover {
          filter: brightness(0.94);
          box-shadow: 0 4px 18px rgba(245,124,0,0.25) !important;
        }
        @media (max-width: 640px) {
          .rsv-hero-ctas { flex-direction: column; }
          .rsv-hero-ctas button, .rsv-hero-ctas a {
            width: 100%; justify-content: center;
          }
          .rsv-filter-chip { font-size: 12px !important; padding: 5px 10px !important; }
        }
      `}</style>

      <div
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1600&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          color: "#fff",
          padding: "104px 20px 56px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(135deg, rgba(15,31,56,0.90) 0%, rgba(26,58,110,0.82) 100%)",
          pointerEvents: "none",
        }} />

        <div style={{ position: "relative", maxWidth: 780, margin: "0 auto", textAlign: "center" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "rgba(245,124,0,0.2)", border: "1px solid rgba(245,124,0,0.4)",
            borderRadius: 20, padding: "5px 14px", marginBottom: 16,
          }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ade80", animation: "pulse 2s infinite" }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: "#fbbf24" }}>
              {hotels.length} hotéis disponíveis agora · até 35% OFF
            </span>
          </div>

          <h1
            data-testid="text-page-title"
            style={{ fontSize: "clamp(26px, 5vw, 40px)", fontWeight: 900, margin: "0 0 12px", lineHeight: 1.2, letterSpacing: -0.5 }}
          >
            Os melhores hotéis de Caldas Novas com <span style={{ color: "#F57C00" }}>até 35% de desconto</span>
          </h1>

          <p style={{ fontSize: "clamp(14px, 2.5vw, 16px)", margin: "0 0 24px", opacity: 0.88, lineHeight: 1.6 }}>
            Hospedagens com piscinas termais, parques aquáticos e café da manhã incluído. Reserva segura e suporte 24h.
          </p>

          <div className="rsv-hero-ctas" style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 28 }}>
            <button
              data-testid="button-hero-cta"
              onClick={scrollToHotels}
              style={{
                padding: "14px 28px", border: "none", borderRadius: 12, cursor: "pointer",
                fontSize: 15, fontWeight: 800, color: "#fff",
                background: "linear-gradient(135deg, #F57C00, #EA580C)",
                boxShadow: "0 4px 20px rgba(245,124,0,0.45)",
                display: "flex", alignItems: "center", gap: 8,
              }}
            >
              🏨 Ver ofertas
            </button>
            <a
              href="https://wa.me/5564993197555?text=Olá! Quero saber mais sobre os hotéis em Caldas Novas."
              target="_blank"
              rel="noopener noreferrer"
              data-testid="button-hero-whatsapp"
              style={{
                padding: "14px 22px", border: "1px solid rgba(255,255,255,0.35)",
                borderRadius: 12, cursor: "pointer", fontSize: 14, fontWeight: 700,
                color: "#fff", background: "rgba(255,255,255,0.10)", backdropFilter: "blur(6px)",
                display: "flex", alignItems: "center", gap: 8, textDecoration: "none",
              }}
            >
              <Phone style={{ width: 16, height: 16 }} />
              Falar com especialista
            </a>
          </div>

          {/* Live activity ticker */}
          <div style={{
            display: "flex", alignItems: "center", gap: 8, marginBottom: 20,
            background: "rgba(255,255,255,0.08)", borderRadius: 12, padding: "8px 14px",
            border: "1px solid rgba(255,255,255,0.15)", backdropFilter: "blur(6px)",
            overflow: "hidden",
          }}>
            <div style={{
              width: 7, height: 7, borderRadius: "50%", background: "#4ade80",
              flexShrink: 0, animation: "pulse 1.5s infinite",
            }} />
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", fontWeight: 600, flexShrink: 0 }}>
              AO VIVO
            </span>
            <span
              key={tickerIndex}
              style={{
                fontSize: 12, color: "rgba(255,255,255,0.85)", fontWeight: 500,
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                animation: "tickerSlide 0.45s cubic-bezier(0.22,1,0.36,1) both",
              }}
            >
              🏨 <strong>{LIVE_TICKER[tickerIndex].name}</strong> de {LIVE_TICKER[tickerIndex].city} reservou &quot;{LIVE_TICKER[tickerIndex].hotel}&quot; há {LIVE_TICKER[tickerIndex].ago}
            </span>
          </div>

          <div style={{ display: "flex", gap: 6, overflowX: "auto", marginBottom: 16, paddingBottom: 2 }}>
            {[
              { label: "👨‍👩‍👧‍👦 Família", perfil: "familia", filter: "Família" },
              { label: "💑 Casal", perfil: "casal", filter: "Casal" },
              { label: "💼 Negócios", perfil: "negocios", filter: "Negócios" },
              { label: "💰 Econômico", perfil: "economico", filter: "Econômico" },
            ].map((item) => (
              <Link
                key={item.perfil}
                href={`/hoteis?perfil=${item.perfil}`}
                data-testid={`button-perfil-${item.perfil}`}
                style={{
                  flexShrink: 0, padding: "7px 14px", borderRadius: 20,
                  border: activeFilter === item.filter ? "2px solid rgba(255,255,255,0.9)" : "1px solid rgba(255,255,255,0.3)",
                  background: activeFilter === item.filter ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.08)",
                  color: "#fff",
                  fontSize: 13, fontWeight: activeFilter === item.filter ? 700 : 500,
                  cursor: "pointer", textDecoration: "none",
                  whiteSpace: "nowrap", display: "inline-flex", alignItems: "center",
                  backdropFilter: "blur(4px)", transition: "all 0.2s",
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>

        </div>
      </div>

      <div style={{
        display: "flex", gap: 0, overflowX: "auto", padding: "14px 16px",
        background: "linear-gradient(135deg, #F0FDF4, #ECFDF5)",
        borderBottom: "1px solid #D1FAE5", flexWrap: "nowrap",
      }}>
        {[
          { icon: <Lock style={{ width: 16, height: 16, color: "#059669" }} />, text: "Reserva 100% segura" },
          { icon: <Tag style={{ width: 16, height: 16, color: "#059669" }} />, text: "Melhores preços" },
          { icon: <Phone style={{ width: 16, height: 16, color: "#059669" }} />, text: "Suporte 24h" },
          { icon: <Check style={{ width: 16, height: 16, color: "#059669" }} />, text: "Cancelamento flexível" },
        ].map((badge, i) => (
          <div
            key={i}
            style={{
              display: "flex", alignItems: "center", gap: 6, flexShrink: 0,
              marginRight: 20, whiteSpace: "nowrap",
            }}
          >
            {badge.icon}
            <span style={{ fontSize: 12, fontWeight: 600, color: "#065F46" }}>{badge.text}</span>
          </div>
        ))}
      </div>

      <SocialProofBanner pageName="hoteis" />
      <PersonalizedBanner profile={profile} />

      {recommendedHotels.length > 0 && (
        <div style={{ paddingTop: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, padding: "0 16px" }}>
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
            <p data-testid="text-ai-recommendations-subtitle" style={{ fontSize: 13, color: "#6B7280", margin: "0 0 14px", paddingLeft: 46 }}>
              Selecionamos os melhores hoteis com base no seu orcamento{" "}
              <span style={{ fontWeight: 700, color: "#2563EB" }}>
                {({ economico: "Economico", moderado: "Moderado", confortavel: "Confortavel", premium: "Premium" } as Record<string, string>)[profile.budget] || profile.budget}
              </span>
              {" "}e interesses
            </p>
          )}
          {!profile && (
            <p style={{ fontSize: 13, color: "#6B7280", margin: "0 0 14px", paddingLeft: 46 }}>
              Crie seu perfil de viajante para recomendacoes ainda mais precisas
            </p>
          )}
          <div
            style={{ overflow: "hidden", padding: "0 16px" }}
            onMouseEnter={() => setRecSlidePaused(true)}
            onMouseLeave={() => setRecSlidePaused(false)}
          >
            <div style={{
              display: "flex",
              gap: 14,
              transform: `translateX(-${recSlideIdx * recSlideStep}px)`,
              transition: recSlideTransition ? "transform 0.45s ease" : "none",
            }}>
              {[...recommendedHotels, recommendedHotels[0]].filter(Boolean).map((hotel, idx) => (
                <div
                  key={`${hotel.id}-${idx}`}
                  ref={idx === 0 ? recFirstCardRef : undefined}
                  style={{ minWidth: 300, maxWidth: 300, flexShrink: 0 }}
                >
                  {renderHotelCard(hotel, true, idx % recommendedHotels.length)}
                </div>
              ))}
            </div>
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

      <div style={{
        margin: "0 16px 28px", padding: "28px 24px", borderRadius: 20,
        background: "linear-gradient(135deg, #EFF6FF 0%, #F0FDF4 100%)",
        border: "1px solid #BFDBFE",
      }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: "#1F2937", margin: "0 0 6px", textAlign: "center" }}>
          Por que reservar com a Reservei?
        </h2>
        <p style={{ fontSize: 13, color: "#6B7280", margin: "0 0 20px", textAlign: "center" }}>
          Mais de 3.000 viajantes confiam em nós todo mês
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[
            {
              icon: "🔒", title: "Pagamento Seguro",
              desc: "Ambiente criptografado SSL e pagamento 100% protegido",
            },
            {
              icon: "💰", title: "Melhor Preço",
              desc: "Garantimos os menores preços ou devolvemos a diferença",
            },
            {
              icon: "📞", title: "Suporte 24h",
              desc: "Time de especialistas disponível 7 dias por semana",
            },
            {
              icon: "✅", title: "Cancelamento Fácil",
              desc: "Cancele ou remarque sem burocracia quando precisar",
            },
          ].map((item) => (
            <div
              key={item.title}
              style={{
                background: "#fff", borderRadius: 14, padding: "16px 14px",
                boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
              }}
            >
              <div style={{ fontSize: 26, marginBottom: 8 }}>{item.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#1F2937", marginBottom: 4 }}>{item.title}</div>
              <div style={{ fontSize: 11, color: "#6B7280", lineHeight: 1.5 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div id="hoteis-grid" style={{ padding: "20px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <h2 data-testid="text-all-hotels-title" style={{ fontSize: 18, fontWeight: 800, color: "#1F2937", margin: 0 }}>
            {activeFilter === "Todos" ? "Todos os Hoteis" : `Hoteis: ${activeFilter}`}
          </h2>
          <span style={{ fontSize: 13, color: "#6B7280", fontWeight: 500 }}>
            {filteredHotels.length} resultado{filteredHotels.length !== 1 ? "s" : ""}
          </span>
        </div>

        {(hasAnySearchFilter || !!searchFilters.q) && (
          <div style={{ marginBottom: 14 }}>
            <SearchResultsSummary
              total={filteredHotels.length}
              query={searchFilters.q || undefined}
              filters={searchFilters}
              onRemoveFilter={handleRemoveSearchFilter}
              onClearAll={handleClearAll}
            />
          </div>
        )}

        <div className="rsv-hotel-grid">
          {filteredHotels.map((item, idx) => renderHotelCard(searchItemToHotel(item), false, idx))}
        </div>
        {filteredHotels.length === 0 && !searchLoading && (
          hasAnySearchFilter || !!searchFilters.q ? (
            <SearchEmptyState
              query={searchFilters.q || undefined}
              onClearFilters={handleClearAll}
            />
          ) : (
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
          )
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
          hotels={compareList
            .map(id => {
              const fromApi = apiHotels.find(h => h.id === id)
              if (fromApi) return searchItemToHotel(fromApi)
              const fromLocal = hotels.find(h => h.id === id)
              return fromLocal ?? null
            })
            .filter((h): h is Hotel => h !== null)}
          onClose={() => setShowCompare(false)}
          formatPrice={formatPrice}
          matchScores={matchScores}
        />
      )}
    </CatalogPageShell>
  )
}
