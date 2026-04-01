import { useState, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { Star, MapPin, Phone, Waves, Users, Zap, LayoutGrid, Ticket, ArrowRight, ChevronRight, Eye } from "lucide-react"
import { Link } from "wouter"
import { HomeHeader } from "@/components/home/HomeHeader"
import { HomeFooter } from "@/components/home/HomeFooter"
import { MobileCTABar } from "@/components/home/MobileCTABar"
import { HotelCategoryNav } from "@/components/hotel/HotelCategoryNav"
import { CatalogPageShell } from "@/components/layouts/CatalogPageShell"
import type { SearchItem } from "@/types/search"

const WA_URL = "https://wa.me/5564993197555?text=Olá! Quero informações sobre ingressos para os parques aquáticos."

const FILTERS = [
  { label: "Todos",    value: "todos",    icon: LayoutGrid },
  { label: "Família",  value: "familia",  icon: Users },
  { label: "Aventura", value: "aventura", icon: Zap },
  { label: "Termas",   value: "termas",   icon: Waves },
]

const TAG_COLORS: Record<string, { bg: string; text: string }> = {
  "família":        { bg: "#FEF3C7", text: "#92400E" },
  "termas":         { bg: "#DBEAFE", text: "#1D4ED8" },
  "aventura":       { bg: "#FEE2E2", text: "#991B1B" },
  "parque-aquático":{ bg: "#D1FAE5", text: "#065F46" },
  "toboágua":       { bg: "#EDE9FE", text: "#5B21B6" },
  "infantil":       { bg: "#FCE7F3", text: "#9D174D" },
}

const PROFILE_TO_TAGS: Record<string, string[]> = {
  familia:  ["família", "infantil"],
  aventura: ["aventura", "toboágua"],
  termas:   ["termas", "parque-aquático"],
}

const LIVE_TICKER = [
  { name: "Fernanda A.", city: "Brasília", action: "comprou ingresso para o Hot Park", ago: "3 min" },
  { name: "Paulo S.", city: "Goiânia",  action: "reservou familia no Di Roma",   ago: "7 min" },
  { name: "Camila F.", city: "Anápolis", action: "comprou pacote família no Hot Park", ago: "12 min" },
  { name: "Ricardo M.", city: "Cuiabá", action: "garantiu ingresso antecipado",   ago: "18 min" },
]

function StarRating({ rating, count }: { rating: number; count?: number }) {
  const full = Math.floor(rating)
  return (
    <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={13}
          style={{ fill: i < full ? "#FBBF24" : "none", color: i < full ? "#FBBF24" : "#D1D5DB" }}
        />
      ))}
      <span style={{ fontSize: 13, fontWeight: 700, color: "#1F2937" }}>{rating}</span>
      {count && (
        <span style={{ fontSize: 11, color: "#9CA3AF" }}>
          ({count.toLocaleString("pt-BR")})
        </span>
      )}
    </span>
  )
}

function ParkCard({ park, isHighlighted }: { park: SearchItem; isHighlighted?: boolean }) {
  const [hovered, setHovered] = useState(false)
  const img = park.images?.[0] || "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=600&q=80"
  const discount = park.priceFrom > 0 ? Math.round(park.priceFrom * 1.3) : null

  return (
    <div
      data-testid={`card-park-${park.id}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#fff",
        borderRadius: 18,
        overflow: "hidden",
        boxShadow: hovered ? "0 12px 36px rgba(0,0,0,0.15)" : "0 2px 14px rgba(0,0,0,0.08)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        transition: "box-shadow 0.25s ease, transform 0.25s ease",
        border: isHighlighted ? "2px solid #2563EB" : "1.5px solid #F3F4F6",
        cursor: "default",
      }}
    >
      {/* Image */}
      <div style={{ position: "relative", overflow: "hidden" }}>
        <img
          src={img}
          alt={park.name}
          style={{
            width: "100%",
            height: 220,
            objectFit: "cover",
            display: "block",
            transform: hovered ? "scale(1.05)" : "scale(1)",
            transition: "transform 0.4s ease",
          }}
        />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 55%)",
        }} />

        {/* Featured badge */}
        {park.isFeatured && (
          <div style={{
            position: "absolute", top: 12, left: 12,
            background: "linear-gradient(135deg, #F59E0B, #EA580C)",
            color: "#fff", fontSize: 11, fontWeight: 800,
            padding: "4px 10px", borderRadius: 999,
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          }}>
            ⭐ Mais visitado
          </div>
        )}

        {/* Viewers */}
        <div style={{
          position: "absolute", top: 12, right: 12,
          background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)",
          borderRadius: 8, padding: "4px 10px",
          display: "flex", alignItems: "center", gap: 5,
        }}>
          <Eye size={11} style={{ color: "#fff" }} />
          <span style={{ fontSize: 11, color: "#fff", fontWeight: 600 }}>
            {Math.floor(Math.random() * 40) + 10} vendo agora
          </span>
        </div>

        {/* Location */}
        <div style={{
          position: "absolute", bottom: 12, left: 12,
          display: "flex", alignItems: "center", gap: 4,
        }}>
          <MapPin size={12} style={{ color: "#fff" }} />
          <span style={{ fontSize: 12, color: "#fff", fontWeight: 600, textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}>
            {park.city} - {park.state}
          </span>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "18px 20px 20px" }}>
        {/* Tags */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
          {park.tags.slice(0, 3).map(tag => {
            const col = TAG_COLORS[tag] || { bg: "#F3F4F6", text: "#6B7280" }
            return (
              <span
                key={tag}
                style={{
                  fontSize: 10, fontWeight: 700, padding: "2px 8px",
                  borderRadius: 999, background: col.bg, color: col.text,
                  textTransform: "capitalize",
                }}
              >
                {tag}
              </span>
            )
          })}
        </div>

        {/* Title */}
        <h3 style={{ fontSize: 17, fontWeight: 800, color: "#1E3A5F", marginBottom: 6, lineHeight: 1.3 }}>
          {park.name}
        </h3>

        <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.5, marginBottom: 14, minHeight: 40 }}>
          {park.descriptionShort}
        </p>

        {/* Amenities */}
        {park.amenities?.slice(0, 4).length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
            {park.amenities.slice(0, 4).map(a => (
              <span
                key={a}
                style={{
                  fontSize: 11, padding: "3px 9px", borderRadius: 8,
                  background: "#F0F9FF", color: "#0369A1", fontWeight: 600,
                  border: "1px solid #BAE6FD",
                }}
              >
                ✓ {a}
              </span>
            ))}
          </div>
        )}

        {/* Rating */}
        <div style={{ marginBottom: 14 }}>
          <StarRating rating={park.rating} count={park.reviewCount} />
        </div>

        {/* Price + CTA */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <div>
            {park.priceFrom > 0 ? (
              <>
                {discount && (
                  <div style={{ fontSize: 11, color: "#9CA3AF", textDecoration: "line-through" }}>
                    R$ {discount.toLocaleString("pt-BR")}
                  </div>
                )}
                <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                  <span style={{ fontSize: 12, color: "#6B7280" }}>A partir de</span>
                </div>
                <div style={{ fontSize: 22, fontWeight: 900, color: "#1E3A5F" }}>
                  R$ {park.priceFrom.toLocaleString("pt-BR")}
                  <span style={{ fontSize: 12, fontWeight: 500, color: "#9CA3AF" }}>/pessoa</span>
                </div>
              </>
            ) : (
              <div style={{ fontSize: 15, fontWeight: 700, color: "#16A34A" }}>Entrada gratuita</div>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 140 }}>
            {park.comboAvailable && (
              <Link href="/ingressos" data-testid={`link-ingressos-${park.id}`}>
                <button
                  data-testid={`btn-ingresso-${park.id}`}
                  style={{
                    width: "100%", padding: "9px 14px", borderRadius: 10,
                    background: "linear-gradient(135deg, #2563EB, #1D4ED8)",
                    color: "#fff", fontWeight: 700, fontSize: 13, border: "none",
                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  }}
                >
                  <Ticket size={13} />
                  Comprar ingresso
                </button>
              </Link>
            )}
            <a
              href={`${WA_URL}&text=Olá! Tenho interesse no ${encodeURIComponent(park.name)}. Pode me ajudar?`}
              target="_blank"
              rel="noopener noreferrer"
              data-testid={`btn-whatsapp-${park.id}`}
            >
              <button
                style={{
                  width: "100%", padding: "9px 14px", borderRadius: 10,
                  background: park.comboAvailable ? "transparent" : "#25D366",
                  color: park.comboAvailable ? "#374151" : "#fff",
                  fontWeight: 700, fontSize: 13,
                  border: park.comboAvailable ? "1.5px solid #E5E7EB" : "none",
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                }}
              >
                <Phone size={13} />
                {park.comboAvailable ? "Mais informações" : "Reservar via WhatsApp"}
              </button>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Parques() {
  const [activeFilter, setActiveFilter] = useState("todos")
  const [tickerIdx, setTickerIdx] = useState(0)

  const { data: searchData, isLoading } = useQuery<{ results: SearchItem[] }>({
    queryKey: ["/api/search", { type: "park" }],
    queryFn: () => fetch("/api/search?type=park&limit=20").then(r => r.json()),
  })

  const parks = useMemo(() => searchData?.results ?? [], [searchData])

  const filteredParks = useMemo(() => {
    if (activeFilter === "todos") return parks
    const tags = PROFILE_TO_TAGS[activeFilter] || []
    return parks.filter(p =>
      tags.some(tag => p.tags?.some(t => t.toLowerCase().includes(tag.toLowerCase())))
    )
  }, [parks, activeFilter])

  const liveTicker = LIVE_TICKER[tickerIdx % LIVE_TICKER.length]

  const filterBar = (
    <div
      data-testid="parques-filter-bar"
      style={{
        background: "#fff",
        borderBottom: "1px solid #E5E7EB",
        padding: "10px 16px",
        display: "flex",
        gap: 8,
        overflowX: "auto",
        position: "sticky",
        top: 64,
        zIndex: 30,
      }}
    >
      <HotelCategoryNav
        categories={FILTERS.map(f => ({
          label: f.label,
          value: f.value,
          icon: f.icon,
          testId: `button-filter-park-${f.value}`,
        }))}
        activeFilter={activeFilter}
        onSelect={(f) => setActiveFilter(f.value)}
      />
    </div>
  )

  return (
    <CatalogPageShell
      header={<HomeHeader />}
      searchBar={filterBar}
      footer={<><HomeFooter /><MobileCTABar /></>}
    >
      {/* Hero */}
      <section
        data-testid="parques-hero"
        style={{
          position: "relative",
          minHeight: 460,
          background: "#0C1A30",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "url('https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=1600&q=60')",
          backgroundSize: "cover", backgroundPosition: "center",
          opacity: 0.28,
        }} />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(12,26,48,0.5) 0%, rgba(12,26,48,0.88) 100%)",
        }} />

        <div style={{
          position: "relative", maxWidth: 800, margin: "0 auto",
          padding: "90px 24px 60px",
          textAlign: "center",
        }}>
          {/* Live badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(255,255,255,0.1)", backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.18)",
            borderRadius: 999, padding: "6px 18px", marginBottom: 22,
          }}>
            <span style={{
              width: 8, height: 8, borderRadius: "50%", background: "#22C55E",
              boxShadow: "0 0 0 2px rgba(34,197,94,0.3)", flexShrink: 0,
            }} />
            <span style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>
              {parks.length || 2} parques aquáticos disponíveis — Caldas Novas &amp; Rio Quente
            </span>
          </div>

          <h1 style={{
            fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 900,
            color: "#fff", lineHeight: 1.15, marginBottom: 16, letterSpacing: -1,
          }}>
            Parques Aquáticos nas<br />
            <span style={{ color: "#38BDF8" }}>Águas Quentes do Brasil</span>
          </h1>

          <p style={{
            fontSize: "clamp(14px, 2.5vw, 17px)", color: "rgba(255,255,255,0.72)",
            maxWidth: 560, margin: "0 auto 32px", lineHeight: 1.7,
          }}>
            Ingresso para Hot Park, Di Roma e os melhores parques aquáticos de Caldas Novas e Rio Quente. Reserve agora e garanta seu dia perfeito!
          </p>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
            <Link href="/ingressos">
              <button
                data-testid="btn-hero-ingressos"
                style={{
                  padding: "14px 32px", borderRadius: 12,
                  background: "linear-gradient(135deg, #2563EB, #1D4ED8)",
                  color: "#fff", fontWeight: 800, fontSize: 15, border: "none",
                  cursor: "pointer", boxShadow: "0 4px 20px rgba(37,99,235,0.4)",
                  display: "flex", alignItems: "center", gap: 8,
                }}
              >
                <Ticket size={18} />
                Comprar ingresso
              </button>
            </Link>
            <a
              href={WA_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="btn-hero-whatsapp"
              style={{
                padding: "14px 28px", borderRadius: 12,
                background: "#25D366", color: "#fff",
                fontWeight: 700, fontSize: 15, textDecoration: "none",
                display: "flex", alignItems: "center", gap: 8,
              }}
            >
              <Phone size={16} />
              Reservar no WhatsApp
            </a>
          </div>

          {/* Trust stats */}
          <div style={{
            display: "flex", gap: 28, flexWrap: "wrap", justifyContent: "center",
            marginTop: 40, paddingTop: 28, borderTop: "1px solid rgba(255,255,255,0.12)",
          }}>
            {[
              { icon: Waves, value: "38°C+", label: "Águas termais" },
              { icon: Users, value: "50k+", label: "Visitantes/mês" },
              { icon: Star, value: "4.9", label: "Avaliação média" },
              { icon: Ticket, value: "100%", label: "Ingresso garantido" },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <Icon style={{ width: 18, height: 18, color: "#38BDF8" }} />
                <span style={{ fontSize: 20, fontWeight: 900, color: "#fff" }}>{value}</span>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live ticker */}
      <div
        data-testid="parques-live-ticker"
        style={{
          background: "#EFF6FF", borderBottom: "1px solid #BFDBFE",
          padding: "12px 20px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{
            width: 8, height: 8, borderRadius: "50%", background: "#22C55E",
            flexShrink: 0, boxShadow: "0 0 0 2px rgba(34,197,94,0.3)",
          }} />
          <span style={{ fontSize: 13, color: "#1D4ED8", fontWeight: 600 }}>
            <strong>{liveTicker.name}</strong> de {liveTicker.city} {liveTicker.action} — {liveTicker.ago}
          </span>
        </div>
        <button
          data-testid="btn-ticker-next"
          onClick={() => setTickerIdx(i => i + 1)}
          style={{ background: "transparent", border: "none", cursor: "pointer", padding: 2 }}
        >
          <ChevronRight size={16} style={{ color: "#2563EB" }} />
        </button>
      </div>

      {/* Trust bar */}
      <div style={{ background: "#fff", borderBottom: "1px solid #F3F4F6", padding: "14px 20px" }}>
        <div style={{
          maxWidth: 1100, margin: "0 auto",
          display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "center",
        }}>
          {[
            { emoji: "🌊", text: "Águas termais naturais" },
            { emoji: "🎫", text: "Ingressos com garantia" },
            { emoji: "📞", text: "Suporte WhatsApp 7 dias" },
            { emoji: "💳", text: "Pague em até 12x" },
          ].map(item => (
            <div key={item.text} style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <span style={{ fontSize: 18 }}>{item.emoji}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Parks grid */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 20px 64px" }}>
        <div style={{ marginBottom: 28, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h2 style={{ fontSize: 26, fontWeight: 900, color: "#1E3A5F", marginBottom: 4 }}>
              {activeFilter === "todos" ? "Todos os parques" : `Parques — ${FILTERS.find(f => f.value === activeFilter)?.label}`}
            </h2>
            <p style={{ fontSize: 14, color: "#6B7280" }}>
              {isLoading ? "Carregando..." : `${filteredParks.length} ${filteredParks.length === 1 ? "parque encontrado" : "parques encontrados"}`}
            </p>
          </div>
          <Link href="/ingressos">
            <button
              data-testid="btn-ver-ingressos"
              style={{
                padding: "10px 20px", borderRadius: 10,
                background: "transparent", border: "2px solid #1E3A5F",
                color: "#1E3A5F", fontWeight: 700, fontSize: 13, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 6,
              }}
            >
              Ver ingressos <ArrowRight size={14} />
            </button>
          </Link>
        </div>

        {isLoading ? (
          <div
            data-testid="parques-loading"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: 24,
            }}
          >
            {[1, 2, 3].map(i => (
              <div
                key={i}
                style={{
                  borderRadius: 18, overflow: "hidden",
                  background: "#F3F4F6", height: 440,
                  animation: "pulse 1.5s ease-in-out infinite",
                }}
              />
            ))}
          </div>
        ) : filteredParks.length === 0 ? (
          <div
            data-testid="parques-empty"
            style={{
              textAlign: "center", padding: "60px 20px",
              background: "#F9FAFB", borderRadius: 16,
            }}
          >
            <Waves size={48} style={{ color: "#D1D5DB", marginBottom: 16 }} />
            <p style={{ fontSize: 18, fontWeight: 700, color: "#374151", marginBottom: 8 }}>
              Nenhum parque encontrado
            </p>
            <p style={{ fontSize: 14, color: "#6B7280" }}>
              Tente outro filtro ou{" "}
              <button
                onClick={() => setActiveFilter("todos")}
                style={{ color: "#2563EB", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}
              >
                veja todos os parques
              </button>
            </p>
          </div>
        ) : (
          <div
            data-testid="parques-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: 24,
            }}
          >
            {filteredParks.map((park, idx) => (
              <ParkCard key={park.id} park={park} isHighlighted={idx === 0 && activeFilter === "todos"} />
            ))}
          </div>
        )}
      </section>

      {/* Bottom CTA */}
      <section
        data-testid="parques-bottom-cta"
        style={{
          background: "linear-gradient(135deg, #1E3A5F, #2563EB)",
          padding: "48px 24px",
          textAlign: "center",
        }}
      >
        <h2 style={{ fontSize: 26, fontWeight: 900, color: "#fff", marginBottom: 12 }}>
          Pronto para mergulhar?
        </h2>
        <p style={{ fontSize: 15, color: "rgba(255,255,255,0.75)", marginBottom: 28, maxWidth: 480, margin: "0 auto 28px" }}>
          Garante seu ingresso com antecedência e economize até 30% no valor do dia.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/ingressos">
            <button
              data-testid="btn-cta-ingressos"
              style={{
                padding: "14px 36px", borderRadius: 12,
                background: "#fff", color: "#1E3A5F",
                fontWeight: 800, fontSize: 15, border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", gap: 8,
              }}
            >
              <Ticket size={18} />
              Ver ingressos disponíveis
            </button>
          </Link>
          <a
            href={WA_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="btn-cta-whatsapp"
            style={{
              padding: "14px 28px", borderRadius: 12,
              background: "#25D366", color: "#fff",
              fontWeight: 700, fontSize: 15, textDecoration: "none",
              display: "flex", alignItems: "center", gap: 8,
            }}
          >
            <Phone size={16} />
            Falar com especialista
          </a>
        </div>
      </section>
    </CatalogPageShell>
  )
}
