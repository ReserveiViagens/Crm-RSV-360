import { useState, useEffect } from "react"
import {
  X, Star, MapPin, Wifi, Coffee, Car, Dumbbell,
  UtensilsCrossed, Waves, Baby, Wine, Heart,
  Calendar, Users, ChevronLeft, ChevronRight, MessageCircle, Phone, Clock,
} from "lucide-react"

export interface HotelDetailData {
  id: string
  title: string
  description: string
  images: string[]
  stars: number
  location: string
  price: number
  originalPrice?: number
  features: string[]
  capacity: number
  rating?: number
  reviews?: number
  type?: "hotel" | "parque" | "passeio"
}

const AMENITY_ICONS: Record<string, typeof Wifi> = {
  "Wi-Fi": Wifi,
  "Café da manhã": Coffee,
  "Café da Manhã": Coffee,
  "Estacionamento": Car,
  "Academia": Dumbbell,
  "Restaurante": UtensilsCrossed,
  "Piscinas Termais": Waves,
  "Complexo Aquático": Waves,
  "Parque Aquático": Waves,
  "Acesso ao Hot Park": Waves,
  "Kids Club": Baby,
  "Recreação Infantil": Baby,
  "All Inclusive": UtensilsCrossed,
  "Meia Pensão": UtensilsCrossed,
  "Spa": Heart,
  "Romântico": Heart,
  "Bar": Wine,
}

interface HotelDetailPanelProps {
  hotel: HotelDetailData
  onClose: () => void
}

function MiniCalendar({ selectedDates, onToggleDate, accentColor = "#2563EB" }: { selectedDates: string[], onToggleDate: (date: string) => void, accentColor?: string }) {
  const [viewMonth, setViewMonth] = useState(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1)
  })

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const year = viewMonth.getFullYear()
  const month = viewMonth.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]
  const dayNames = ["D", "S", "T", "Q", "Q", "S", "S"]

  const prevMonth = () => setViewMonth(new Date(year, month - 1, 1))
  const nextMonth = () => setViewMonth(new Date(year, month + 1, 1))

  const formatDateStr = (d: number) => {
    const mm = String(month + 1).padStart(2, "0")
    const dd = String(d).padStart(2, "0")
    return `${year}-${mm}-${dd}`
  }

  const isPast = (d: number) => new Date(year, month, d) < today

  return (
    <div style={{ border: "1px solid #E5E7EB", borderRadius: 12, padding: 12, background: "#fff" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <button onClick={prevMonth} style={{ border: "none", background: "none", cursor: "pointer", fontSize: 18, color: "#6B7280", padding: "4px 8px" }}>‹</button>
        <span style={{ fontSize: 14, fontWeight: 700, color: "#1F2937" }}>{monthNames[month]} {year}</span>
        <button onClick={nextMonth} style={{ border: "none", background: "none", cursor: "pointer", fontSize: 18, color: "#6B7280", padding: "4px 8px" }}>›</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2, textAlign: "center" }}>
        {dayNames.map((d, i) => (
          <div key={i} style={{ fontSize: 11, fontWeight: 600, color: "#9CA3AF", padding: "4px 0" }}>{d}</div>
        ))}
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`e-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1
          const dateStr = formatDateStr(day)
          const isSelected = selectedDates.includes(dateStr)
          const past = isPast(day)
          return (
            <button
              key={day}
              onClick={() => !past && onToggleDate(dateStr)}
              disabled={past}
              style={{
                width: 32, height: 32, borderRadius: "50%", border: "none",
                fontSize: 13, fontWeight: isSelected ? 700 : 400,
                cursor: past ? "default" : "pointer",
                background: isSelected ? accentColor : "transparent",
                color: past ? "#D1D5DB" : isSelected ? "#fff" : "#374151",
                transition: "all 0.15s",
                margin: "0 auto",
              }}
            >
              {day}
            </button>
          )
        })}
      </div>
      {selectedDates.length > 0 && (
        <div style={{ marginTop: 10, padding: "8px 10px", background: accentColor === "#7C3AED" ? "#F3E8FF" : "#EFF6FF", borderRadius: 8, fontSize: 12, color: accentColor, fontWeight: 600, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <Calendar size={13} />
          {selectedDates.length} {selectedDates.length === 1 ? "dia selecionado" : "dias selecionados"}
        </div>
      )}
    </div>
  )
}

const TOUR_SCHEDULES = [
  { label: "Manhã · 8h", value: "08:00" },
  { label: "Manhã · 9h", value: "09:00" },
  { label: "Manhã · 10h", value: "10:00" },
  { label: "Tarde · 14h", value: "14:00" },
  { label: "Tarde · 15h", value: "15:00" },
  { label: "Tarde · 16h", value: "16:00" },
]

export default function HotelDetailPanel({ hotel, onClose }: HotelDetailPanelProps) {
  const [currentImage, setCurrentImage] = useState(0)
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [guests, setGuests] = useState(2)
  const [nights, setNights] = useState(3)
  const [quantity, setQuantity] = useState(2)
  const [tourPeople, setTourPeople] = useState(2)
  const [tourDate, setTourDate] = useState("")
  const [tourTime, setTourTime] = useState("09:00")
  const [selectedDates, setSelectedDates] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<"reservar" | "avaliacoes">("reservar")
  const [showTooltip, setShowTooltip] = useState(true)
  const isDayUse = hotel.type === "parque"
  const isPasseio = hotel.type === "passeio"

  const toggleDate = (date: string) => {
    setSelectedDates((prev) =>
      prev.includes(date) ? prev.filter((d) => d !== date) : [...prev, date].sort()
    )
  }

  const selectSingleDate = (date: string) => {
    setTourDate(date)
  }

  useEffect(() => {
    const timer = setTimeout(() => setShowTooltip(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price)

  const dayCount = isDayUse ? Math.max(selectedDates.length, 1) : nights
  const totalPrice = isPasseio
    ? hotel.price * tourPeople
    : isDayUse
      ? hotel.price * quantity * dayCount
      : hotel.price * nights
  const discount = hotel.originalPrice ? Math.round(((hotel.originalPrice - hotel.price) / hotel.originalPrice) * 100) : 0

  const nextImage = () => setCurrentImage((p) => (p + 1) % hotel.images.length)
  const prevImage = () => setCurrentImage((p) => (p - 1 + hotel.images.length) % hotel.images.length)

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 100,
        display: "flex", justifyContent: "center", alignItems: "stretch",
      }}
      onClick={onClose}
    >
      <div
        style={{
          position: "absolute", inset: 0,
          background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)",
        }}
      />

      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative", width: "100%", maxWidth: 960,
          background: "#fff", overflowY: "auto" as const,
          animation: "panelSlideUp 0.35s ease-out",
        }}
      >
        <div style={{ position: "relative" }}>
          <div style={{
            width: "100%", height: 320,
            background: `url(${hotel.images[currentImage]}) center/cover`,
            position: "relative",
          }}>
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 40%)",
            }} />

            <button
              onClick={onClose}
              style={{
                position: "absolute", top: 16, right: 16, width: 40, height: 40,
                borderRadius: "50%", border: "none", cursor: "pointer",
                background: "rgba(0,0,0,0.5)", display: "flex",
                alignItems: "center", justifyContent: "center", zIndex: 2,
              }}
            >
              <X size={20} style={{ color: "#fff" }} />
            </button>

            {hotel.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  style={{
                    position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)",
                    width: 36, height: 36, borderRadius: "50%", border: "none",
                    background: "rgba(0,0,0,0.5)", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  <ChevronLeft size={20} style={{ color: "#fff" }} />
                </button>
                <button
                  onClick={nextImage}
                  style={{
                    position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)",
                    width: 36, height: 36, borderRadius: "50%", border: "none",
                    background: "rgba(0,0,0,0.5)", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  <ChevronRight size={20} style={{ color: "#fff" }} />
                </button>
                <div style={{
                  position: "absolute", bottom: 70, left: "50%", transform: "translateX(-50%)",
                  display: "flex", gap: 6,
                }}>
                  {hotel.images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentImage(i)}
                      style={{
                        width: i === currentImage ? 24 : 8, height: 8,
                        borderRadius: 4, border: "none", cursor: "pointer",
                        background: i === currentImage ? "#fff" : "rgba(255,255,255,0.5)",
                        transition: "all 0.2s",
                      }}
                    />
                  ))}
                </div>
              </>
            )}

            {discount > 0 && (
              <div style={{
                position: "absolute", top: 16, left: 16,
                background: "#EF4444", color: "#fff",
                padding: "6px 14px", borderRadius: 20, fontSize: 13, fontWeight: 700,
              }}>
                -{discount}% OFF
              </div>
            )}

            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px" }}>
              <h2 style={{ color: "#fff", fontSize: 24, fontWeight: 800, margin: "0 0 6px" }}>
                {hotel.title}
              </h2>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" as const }}>
                <div style={{ display: "flex", gap: 2 }}>
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      size={14}
                      fill={i < hotel.stars ? "#FBBF24" : "transparent"}
                      style={{ color: i < hotel.stars ? "#FBBF24" : "rgba(255,255,255,0.4)" }}
                    />
                  ))}
                </div>
                {hotel.rating && (
                  <span style={{ color: "#fff", fontSize: 13 }}>
                    {hotel.rating} ({hotel.reviews} avaliações)
                  </span>
                )}
                <span style={{ color: "rgba(255,255,255,0.6)" }}>•</span>
                <span style={{ color: "#fff", fontSize: 13 }}>RSV360</span>
              </div>
            </div>
          </div>
        </div>

        <div className="rsv-hotel-detail-body">
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1F2937", margin: "0 0 12px" }}>
              {isPasseio ? "Sobre a Atração" : isDayUse ? "Sobre o Parque Aquático" : "Sobre o Hotel"}
            </h3>
            <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.7, margin: "0 0 24px" }}>
              {hotel.description}
            </p>

            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1F2937", margin: "0 0 16px" }}>
              {isPasseio ? "Destaques" : isDayUse ? "Atrações" : "Comodidades"}
            </h3>
            <div style={{
              display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
              gap: 12, marginBottom: 24,
            }}>
              {hotel.features.map((feature) => {
                const IconComp = AMENITY_ICONS[feature] || Wifi
                return (
                  <div
                    key={feature}
                    style={{
                      display: "flex", flexDirection: "column" as const,
                      alignItems: "center", gap: 8, padding: "14px 8px",
                      background: "#F9FAFB", borderRadius: 12, textAlign: "center" as const,
                    }}
                  >
                    <IconComp size={22} style={{ color: "#2563EB" }} />
                    <span style={{ fontSize: 11, color: "#4B5563", fontWeight: 500 }}>{feature}</span>
                  </div>
                )
              })}
            </div>

            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1F2937", margin: "0 0 12px" }}>
              Localização
            </h3>
            <div style={{
              background: "#E5E7EB", borderRadius: 12, height: 180,
              display: "flex", alignItems: "center", justifyContent: "center",
              position: "relative", overflow: "hidden",
            }}>
              <div style={{
                background: "linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)",
                width: "100%", height: "100%", display: "flex",
                flexDirection: "column" as const, alignItems: "center", justifyContent: "center",
              }}>
                <MapPin size={32} style={{ color: "#2563EB", marginBottom: 8 }} />
                <span style={{ fontSize: 14, fontWeight: 600, color: "#1E40AF" }}>
                  {hotel.location}
                </span>
                <span style={{ fontSize: 12, color: "#3B82F6", marginTop: 4 }}>
                  Caldas Novas / Rio Quente - GO
                </span>
              </div>
            </div>
          </div>

          <div className="rsv-hotel-detail-sidebar" style={{
            width: 320, borderLeft: "1px solid #E5E7EB",
            padding: 24, flexShrink: 0,
          }}>
            <div style={{
              display: "flex", borderBottom: "2px solid #E5E7EB", marginBottom: 20,
            }}>
              <button
                onClick={() => setActiveTab("reservar")}
                style={{
                  flex: 1, padding: "10px 0", border: "none", cursor: "pointer",
                  background: "transparent", fontSize: 14, fontWeight: 600,
                  color: activeTab === "reservar" ? "#2563EB" : "#9CA3AF",
                  borderBottom: activeTab === "reservar" ? "2px solid #2563EB" : "2px solid transparent",
                  marginBottom: -2,
                }}
              >
                Reservar
              </button>
              <button
                onClick={() => setActiveTab("avaliacoes")}
                style={{
                  flex: 1, padding: "10px 0", border: "none", cursor: "pointer",
                  background: "transparent", fontSize: 14, fontWeight: 600,
                  color: activeTab === "avaliacoes" ? "#2563EB" : "#9CA3AF",
                  borderBottom: activeTab === "avaliacoes" ? "2px solid #2563EB" : "2px solid transparent",
                  marginBottom: -2,
                }}
              >
                Avaliações
              </button>
            </div>

            {activeTab === "reservar" ? (
              <div>
                {isPasseio ? (
                  <>
                    <div style={{ marginBottom: 16 }}>
                      <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                        <Calendar size={14} style={{ color: "#7C3AED" }} />
                        Dia do passeio
                      </label>
                      <MiniCalendar selectedDates={tourDate ? [tourDate] : []} onToggleDate={selectSingleDate} accentColor="#7C3AED" />
                    </div>

                    <div style={{ marginBottom: 16 }}>
                      <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                        <Clock size={14} style={{ color: "#7C3AED" }} />
                        Horário
                      </label>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
                        {TOUR_SCHEDULES.map((s) => (
                          <button
                            key={s.value}
                            onClick={() => setTourTime(s.value)}
                            style={{
                              padding: "10px 4px", borderRadius: 8, fontSize: 12, fontWeight: 600,
                              cursor: "pointer", transition: "all 0.15s", textAlign: "center",
                              border: tourTime === s.value ? "2px solid #7C3AED" : "1px solid #D1D5DB",
                              background: tourTime === s.value ? "#F3E8FF" : "#fff",
                              color: tourTime === s.value ? "#7C3AED" : "#4B5563",
                            }}
                          >
                            {s.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div style={{ marginBottom: 16 }}>
                      <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
                        Pessoas
                      </label>
                      <div style={{
                        display: "flex", alignItems: "center", gap: 8,
                        border: "1px solid #D1D5DB", borderRadius: 8, padding: "10px 12px",
                      }}>
                        <Users size={14} style={{ color: "#9CA3AF" }} />
                        <select
                          value={tourPeople}
                          onChange={(e) => setTourPeople(Number(e.target.value))}
                          style={{ border: "none", outline: "none", fontSize: 13, color: "#374151", flex: 1, background: "transparent" }}
                        >
                          {[1, 2, 3, 4, 5, 6, 8, 10, 15, 20].map((n) => (
                            <option key={n} value={n}>{n} {n === 1 ? "pessoa" : "pessoas"}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </>
                ) : isDayUse ? (
                  <>
                    <div style={{ marginBottom: 16 }}>
                      <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                        <Calendar size={14} style={{ color: "#2563EB" }} />
                        Escolha os dias
                      </label>
                      <p style={{ fontSize: 11, color: "#9CA3AF", margin: "0 0 8px" }}>Toque nos dias desejados (1 dia, vários ou intercalados)</p>
                      <MiniCalendar selectedDates={selectedDates} onToggleDate={toggleDate} />
                    </div>

                    <div style={{ marginBottom: 16 }}>
                      <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
                        Day Use
                      </label>
                      <div style={{
                        display: "flex", alignItems: "center", gap: 8,
                        border: "1px solid #D1D5DB", borderRadius: 8, padding: "10px 12px",
                      }}>
                        <Users size={14} style={{ color: "#9CA3AF" }} />
                        <select
                          value={quantity}
                          onChange={(e) => setQuantity(Number(e.target.value))}
                          style={{ border: "none", outline: "none", fontSize: 13, color: "#374151", flex: 1, background: "transparent" }}
                        >
                          {[1, 2, 3, 4, 5, 6, 8, 10].map((n) => (
                            <option key={n} value={n}>{n} {n === 1 ? "pessoa" : "pessoas"}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ marginBottom: 16 }}>
                      <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
                        Data
                      </label>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{
                          flex: 1, display: "flex", alignItems: "center", gap: 6,
                          border: "1px solid #D1D5DB", borderRadius: 8, padding: "10px 12px",
                        }}>
                          <Calendar size={14} style={{ color: "#9CA3AF" }} />
                          <input
                            type="date"
                            value={checkIn}
                            onChange={(e) => setCheckIn(e.target.value)}
                            style={{ border: "none", outline: "none", fontSize: 13, color: "#374151", width: "100%" }}
                          />
                        </div>
                        <span style={{ color: "#9CA3AF", fontSize: 13 }}>—</span>
                        <div style={{
                          flex: 1, display: "flex", alignItems: "center", gap: 6,
                          border: "1px solid #D1D5DB", borderRadius: 8, padding: "10px 12px",
                        }}>
                          <Calendar size={14} style={{ color: "#9CA3AF" }} />
                          <input
                            type="date"
                            value={checkOut}
                            onChange={(e) => setCheckOut(e.target.value)}
                            style={{ border: "none", outline: "none", fontSize: 13, color: "#374151", width: "100%" }}
                          />
                        </div>
                      </div>
                    </div>

                    <div style={{ marginBottom: 16 }}>
                      <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
                        Hóspedes
                      </label>
                      <div style={{
                        display: "flex", alignItems: "center", gap: 8,
                        border: "1px solid #D1D5DB", borderRadius: 8, padding: "10px 12px",
                      }}>
                        <Users size={14} style={{ color: "#9CA3AF" }} />
                        <select
                          value={guests}
                          onChange={(e) => setGuests(Number(e.target.value))}
                          style={{ border: "none", outline: "none", fontSize: 13, color: "#374151", flex: 1, background: "transparent" }}
                        >
                          {[1, 2, 3, 4, 5, 6].map((n) => (
                            <option key={n} value={n}>{n} {n === 1 ? "hóspede" : "hóspedes"}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div style={{ marginBottom: 16 }}>
                      <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
                        Noites
                      </label>
                      <div style={{
                        display: "flex", alignItems: "center", gap: 8,
                        border: "1px solid #D1D5DB", borderRadius: 8, padding: "10px 12px",
                      }}>
                        <select
                          value={nights}
                          onChange={(e) => setNights(Number(e.target.value))}
                          style={{ border: "none", outline: "none", fontSize: 13, color: "#374151", flex: 1, background: "transparent" }}
                        >
                          {[1, 2, 3, 4, 5, 7, 10, 14].map((n) => (
                            <option key={n} value={n}>{n} {n === 1 ? "noite" : "noites"}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </>
                )}

                <div style={{
                  background: "#F9FAFB", borderRadius: 12, padding: 16, marginBottom: 16,
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ fontSize: 13, color: "#6B7280" }}>Preço</span>
                    <div style={{ textAlign: "right" as const }}>
                      <span style={{ fontSize: 15, fontWeight: 700, color: "#1F2937" }}>
                        {formatPrice(hotel.price)}
                      </span>
                      <span style={{ fontSize: 11, color: "#9CA3AF", display: "block" }}>
                        {isPasseio ? "p/ pessoa" : isDayUse ? "p/ pessoa · Day Use" : "por noite"}
                      </span>
                    </div>
                  </div>
                  {(isDayUse || isPasseio) && (
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, paddingTop: 8, borderTop: "1px solid #E5E7EB" }}>
                      <span style={{ fontSize: 12, color: "#6B7280" }}>Cálculo</span>
                      <span style={{ fontSize: 12, color: "#6B7280" }}>
                        {isPasseio
                          ? `${formatPrice(hotel.price)} × ${tourPeople} ${tourPeople === 1 ? "pessoa" : "pessoas"}`
                          : `${formatPrice(hotel.price)} × ${quantity} ${quantity === 1 ? "pessoa" : "pessoas"} × ${dayCount} ${dayCount === 1 ? "dia" : "dias"}`}
                      </span>
                    </div>
                  )}
                  <div style={{
                    display: "flex", justifyContent: "space-between",
                    paddingTop: 8, borderTop: "1px solid #E5E7EB",
                  }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#1F2937" }}>Total</span>
                    <div style={{ textAlign: "right" as const }}>
                      <span style={{ fontSize: 18, fontWeight: 800, color: "#22C55E" }}>
                        {formatPrice(totalPrice)}
                      </span>
                      <span style={{ fontSize: 11, color: "#9CA3AF", display: "block" }}>
                        {isPasseio
                          ? `${tourPeople} ${tourPeople === 1 ? "pessoa" : "pessoas"} · ${TOUR_SCHEDULES.find((s) => s.value === tourTime)?.label || tourTime}`
                          : isDayUse
                            ? `${quantity} ${quantity === 1 ? "pessoa" : "pessoas"} · ${dayCount} ${dayCount === 1 ? "dia" : "dias"}`
                            : `por ${nights} ${nights === 1 ? "noite" : "noites"}`}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (isPasseio) {
                      const dateText = tourDate ? tourDate.split("-").reverse().join("/") : "a definir"
                      const timeLabel = TOUR_SCHEDULES.find((s) => s.value === tourTime)?.label || tourTime
                      window.open(
                        `https://wa.me/5564993197555?text=Olá! Quero reservar o passeio ${hotel.title} para ${tourPeople} pessoa(s) no dia ${dateText} às ${timeLabel}. Total: ${formatPrice(totalPrice)}`,
                        "_blank",
                      )
                    } else if (isDayUse) {
                      const datesText = selectedDates.length > 0
                        ? selectedDates.map((d) => d.split("-").reverse().join("/")).join(", ")
                        : "a definir"
                      window.open(
                        `https://wa.me/5564993197555?text=Olá! Quero ${quantity} ingresso(s) Day Use para ${hotel.title} nos dias: ${datesText}. Total: ${formatPrice(totalPrice)}`,
                        "_blank",
                      )
                    } else {
                      window.open(
                        `https://wa.me/5564993197555?text=Olá! Quero reservar o ${hotel.title} por ${nights} noites para ${guests} hóspedes. Total: ${formatPrice(totalPrice)}`,
                        "_blank",
                      )
                    }
                  }}
                  style={{
                    width: "100%", padding: "14px 0", border: "none",
                    borderRadius: 10, cursor: "pointer", fontSize: 15, fontWeight: 700,
                    background: isPasseio ? "#7C3AED" : "#2563EB", color: "#fff",
                    transition: "background 0.2s",
                  }}
                >
                  {isPasseio ? "Reservar Passeio" : isDayUse ? "Comprar Ingresso" : "Reservar Agora"}
                </button>

                <button
                  onClick={() =>
                    window.open(
                      `https://wa.me/5564993197555?text=Olá! Gostaria de mais informações sobre o ${hotel.title}`,
                      "_blank",
                    )
                  }
                  style={{
                    width: "100%", padding: "12px 0", border: "1px solid #D1D5DB",
                    borderRadius: 10, cursor: "pointer", fontSize: 13, fontWeight: 600,
                    background: "transparent", color: "#374151", marginTop: 8,
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  }}
                >
                  <Phone size={14} />
                  Falar com Especialista
                </button>
              </div>
            ) : (
              <div>
                {[
                  ...(isPasseio ? [
                    { name: "Maria Silva", rating: 5, text: "Passeio incrível! O guia foi muito atencioso e conhecedor da região.", date: "Jan 2026" },
                    { name: "João Santos", rating: 5, text: "Experiência maravilhosa, perfeito para toda a família. Super recomendo!", date: "Dez 2025" },
                    { name: "Ana Oliveira", rating: 4, text: "Paisagens lindas e organização impecável. Vale cada centavo!", date: "Nov 2025" },
                  ] : isDayUse ? [
                    { name: "Maria Silva", rating: 5, text: "Parque incrível! Águas termais maravilhosas e diversão garantida.", date: "Jan 2026" },
                    { name: "João Santos", rating: 5, text: "Perfeito para família. Crianças adoraram os toboáguas!", date: "Dez 2025" },
                    { name: "Ana Oliveira", rating: 4, text: "Infraestrutura excelente e muitas opções de lazer. Recomendo!", date: "Nov 2025" },
                  ] : [
                    { name: "Maria Silva", rating: 5, text: "Hotel maravilhoso! Águas termais incríveis e atendimento nota 10.", date: "Jan 2026" },
                    { name: "João Santos", rating: 5, text: "Perfeito para família. Crianças adoraram o parque aquático!", date: "Dez 2025" },
                    { name: "Ana Oliveira", rating: 4, text: "Ótima localização e café da manhã delicioso. Recomendo!", date: "Nov 2025" },
                  ]),
                ].map((review, i) => (
                  <div key={i} style={{
                    padding: "14px 0",
                    borderBottom: i < 2 ? "1px solid #F3F4F6" : "none",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#1F2937" }}>{review.name}</span>
                      <span style={{ fontSize: 11, color: "#9CA3AF" }}>{review.date}</span>
                    </div>
                    <div style={{ display: "flex", gap: 2, marginBottom: 6 }}>
                      {Array.from({ length: 5 }, (_, j) => (
                        <Star key={j} size={12} fill={j < review.rating ? "#FBBF24" : "transparent"} style={{ color: j < review.rating ? "#FBBF24" : "#D1D5DB" }} />
                      ))}
                    </div>
                    <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.5, margin: 0 }}>
                      {review.text}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div
          style={{
            position: "fixed", bottom: 20, right: 20, zIndex: 101,
          }}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <div style={{
            background: "#fff", borderRadius: 12, padding: "10px 14px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)", maxWidth: 220,
            display: "flex", alignItems: "center", gap: 8, marginBottom: 8,
            opacity: showTooltip ? 1 : 0,
            transform: showTooltip ? "translateY(0)" : "translateY(10px)",
            transition: "opacity 0.3s ease, transform 0.3s ease",
            pointerEvents: showTooltip ? "auto" as const : "none" as const,
          }}>
            <span style={{ fontSize: 12, color: "#374151", lineHeight: 1.4 }}>
              Dúvidas sobre este hotel? Posso ajudar!
            </span>
          </div>
          <button
            onClick={() =>
              window.open(
                `https://wa.me/5564993197555?text=Olá! Tenho dúvidas sobre o ${hotel.title}`,
                "_blank",
              )
            }
            style={{
              width: 48, height: 48, borderRadius: "50%", border: "none",
              background: "#2563EB", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 12px rgba(37,99,235,0.4)", float: "right" as const,
            }}
          >
            <MessageCircle size={22} style={{ color: "#fff" }} />
          </button>
        </div>
      </div>

    </div>
  )
}
