import { useState, useMemo } from "react"
import { ChevronLeft, ChevronRight, CalendarDays, Sun, AlertTriangle } from "lucide-react"

type DayStatus = "available" | "high-demand" | "sold-out" | "past"

interface CalendarioIngressosProps {
  selectedDate: Date | null
  onDateSelect: (date: Date) => void
}

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]
const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
]

const HOLIDAYS: Set<string> = new Set([
  "1-1",   // Ano Novo
  "21-4",  // Tiradentes
  "1-5",   // Dia do Trabalho
  "7-9",   // Independência
  "12-10", // Nossa Senhora Aparecida
  "2-11",  // Finados
  "15-11", // Proclamação da República
  "25-12", // Natal
  "24-2",  // Carnaval (2025 approx)
  "25-2",
  "26-2",
  "1-4",   // Semana Santa / Páscoa (approximate)
  "2-4",
  "3-4",
  "4-4",
])

function isHoliday(date: Date): boolean {
  const key = `${date.getDate()}-${date.getMonth() + 1}`
  return HOLIDAYS.has(key)
}

export function getDayStatus(date: Date): DayStatus {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  if (date < today) return "past"
  const day = date.getDate()
  const month = date.getMonth()
  const dow = date.getDay()
  const seed = (day * 3 + month * 7 + 13) % 17
  if (seed === 0 || seed === 5 || seed === 11) return "sold-out"
  if (isHoliday(date) || dow === 0 || dow === 6 || seed <= 4) return "high-demand"
  return "available"
}

export function getPriceMultiplier(date: Date | null): number {
  if (!date) return 1
  if (isHoliday(date)) return 1.30
  const dow = date.getDay()
  if (dow === 0 || dow === 6) return 1.20
  return 1.0
}

export function getDateAvailabilityForTicket(date: Date | null, ticketId: string): { soldToday: number; availableToday: number } {
  if (!date) {
    return { soldToday: Math.floor(Math.random() * 40) + 20, availableToday: Math.floor(Math.random() * 30) + 5 }
  }
  const status = getDayStatus(date)
  const daySeed = date.getDate() * 7 + date.getMonth() * 3 + ticketId.charCodeAt(0)
  if (status === "sold-out") {
    const sold = 80 + (daySeed % 30)
    return { soldToday: sold, availableToday: 0 }
  }
  if (status === "high-demand") {
    const sold = 45 + (daySeed % 25)
    const avail = Math.max(1, 8 - (daySeed % 7))
    return { soldToday: sold, availableToday: avail }
  }
  const sold = 15 + (daySeed % 20)
  const avail = 15 + (daySeed % 20)
  return { soldToday: sold, availableToday: avail }
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}

const STATUS_COLORS: Record<DayStatus, { bg: string; text: string; border: string; dot: string }> = {
  available: { bg: "#F9FAFB", text: "#6B7280", border: "#E5E7EB", dot: "#9CA3AF" },
  "high-demand": { bg: "#FFF7ED", text: "#EA580C", border: "#FED7AA", dot: "#EA580C" },
  "sold-out": { bg: "#FEF2F2", text: "#DC2626", border: "#FECACA", dot: "#DC2626" },
  past: { bg: "#F9FAFB", text: "#D1D5DB", border: "transparent", dot: "transparent" },
}

export function CalendarioIngressos({ selectedDate, onDateSelect }: CalendarioIngressosProps) {
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())

  const daysInMonth = getDaysInMonth(viewYear, viewMonth)
  const firstDayOfWeek = getFirstDayOfMonth(viewYear, viewMonth)

  const cells = useMemo(() => {
    const arr: (Date | null)[] = []
    for (let i = 0; i < firstDayOfWeek; i++) arr.push(null)
    for (let d = 1; d <= daysInMonth; d++) arr.push(new Date(viewYear, viewMonth, d))
    while (arr.length % 7 !== 0) arr.push(null)
    return arr
  }, [viewYear, viewMonth, daysInMonth, firstDayOfWeek])

  function prevMonth() {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11) }
    else setViewMonth(m => m - 1)
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0) }
    else setViewMonth(m => m + 1)
  }

  const canGoPrev = viewYear > today.getFullYear() || viewMonth > today.getMonth()

  function isSelected(date: Date | null) {
    if (!date || !selectedDate) return false
    return date.toDateString() === selectedDate.toDateString()
  }

  return (
    <div style={{
      background: "#fff",
      borderRadius: 16,
      boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
      overflow: "hidden",
    }} data-testid="calendar-ingressos">
      <div style={{
        background: "linear-gradient(135deg, #0891B2, #2563EB)",
        padding: "14px 16px 10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <CalendarDays style={{ width: 18, height: 18, color: "#fff" }} />
          <span style={{ color: "#fff", fontSize: 14, fontWeight: 700 }}>
            Escolha a data da visita
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            onClick={prevMonth}
            disabled={!canGoPrev}
            data-testid="button-calendar-prev"
            style={{
              background: canGoPrev ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.05)",
              border: "none", borderRadius: 8, width: 30, height: 30,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: canGoPrev ? "pointer" : "not-allowed",
              color: canGoPrev ? "#fff" : "rgba(255,255,255,0.3)",
            }}
          >
            <ChevronLeft style={{ width: 16, height: 16 }} />
          </button>
          <span style={{ color: "#fff", fontSize: 13, fontWeight: 700, minWidth: 130, textAlign: "center" }}>
            {MONTHS[viewMonth]} {viewYear}
          </span>
          <button
            onClick={nextMonth}
            data-testid="button-calendar-next"
            style={{
              background: "rgba(255,255,255,0.2)", border: "none",
              borderRadius: 8, width: 30, height: 30,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", color: "#fff",
            }}
          >
            <ChevronRight style={{ width: 16, height: 16 }} />
          </button>
        </div>
      </div>

      <div style={{ padding: "10px 12px" }}>
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(7, 1fr)",
          gap: 2, marginBottom: 4,
        }}>
          {WEEKDAYS.map((d) => (
            <div key={d} style={{
              textAlign: "center", fontSize: 10, fontWeight: 700,
              color: "#9CA3AF", padding: "4px 0",
            }}>
              {d}
            </div>
          ))}
        </div>

        <div style={{
          display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2,
        }}>
          {cells.map((date, idx) => {
            if (!date) return <div key={idx} />
            const status = getDayStatus(date)
            const selected = isSelected(date)
            const colors = STATUS_COLORS[status]
            const isClickable = status !== "past" && status !== "sold-out"
            const isToday = date.toDateString() === today.toDateString()
            const holiday = isHoliday(date)

            return (
              <button
                key={idx}
                data-testid={`calendar-day-${date.getDate()}`}
                onClick={() => isClickable && onDateSelect(date)}
                disabled={!isClickable}
                style={{
                  position: "relative",
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center",
                  padding: "6px 2px",
                  borderRadius: 8,
                  border: selected
                    ? "2px solid #2563EB"
                    : `1px solid ${colors.border}`,
                  background: selected ? "#2563EB" : colors.bg,
                  cursor: isClickable ? "pointer" : "not-allowed",
                  transition: "all 0.15s",
                  minHeight: 42,
                }}
              >
                {isToday && !selected && (
                  <div style={{
                    position: "absolute", top: 2, right: 2,
                    width: 5, height: 5, borderRadius: "50%",
                    background: "#0891B2",
                  }} />
                )}
                {holiday && !selected && status !== "past" && (
                  <div style={{
                    position: "absolute", top: 2, left: 2,
                    width: 5, height: 5, borderRadius: "50%",
                    background: "#F97316",
                  }} />
                )}
                <span style={{
                  fontSize: 13, fontWeight: selected ? 800 : 600,
                  color: selected ? "#fff" : status === "past" ? "#D1D5DB" : colors.text,
                  lineHeight: 1,
                }}>
                  {date.getDate()}
                </span>
                {status !== "past" && (
                  <div style={{
                    marginTop: 2,
                    width: 6, height: 6, borderRadius: "50%",
                    background: selected ? "rgba(255,255,255,0.7)" : colors.dot,
                  }} />
                )}
              </button>
            )
          })}
        </div>

        <div style={{
          display: "flex", gap: 12, marginTop: 10,
          padding: "8px 0", borderTop: "1px solid #F3F4F6",
          flexWrap: "wrap",
        }}>
          {[
            { status: "available" as DayStatus, label: "Disponível" },
            { status: "high-demand" as DayStatus, label: "Alta demanda" },
            { status: "sold-out" as DayStatus, label: "Esgotado" },
          ].map(({ status, label }) => (
            <div key={status} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{
                width: 10, height: 10, borderRadius: "50%",
                background: STATUS_COLORS[status].dot,
                border: `1px solid ${STATUS_COLORS[status].border}`,
              }} />
              <span style={{ fontSize: 10, color: "#6B7280" }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

interface DateBannerProps {
  selectedDate: Date
  priceMultiplier: number
  onClear: () => void
}

export function DateBanner({ selectedDate, priceMultiplier, onClear }: DateBannerProps) {
  const status = getDayStatus(selectedDate)
  const isSpecial = status === "high-demand"
  const formatted = selectedDate.toLocaleDateString("pt-BR", {
    weekday: "long", day: "2-digit", month: "long", year: "numeric",
  })
  const holiday = HOLIDAYS.has(`${selectedDate.getDate()}-${selectedDate.getMonth() + 1}`)
  const label = holiday
    ? "Feriado — preços de alta temporada"
    : isSpecial
    ? "Alta demanda — preços de fim de semana"
    : "Data selecionada"

  return (
    <div style={{
      background: isSpecial
        ? "linear-gradient(135deg, #FFF7ED, #FFEDD5)"
        : "linear-gradient(135deg, #F3F4F6, #F9FAFB)",
      border: `1px solid ${isSpecial ? "#FED7AA" : "#E5E7EB"}`,
      borderRadius: 12,
      padding: "10px 14px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 10,
    }} data-testid="banner-selected-date">
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {isSpecial ? (
          <AlertTriangle style={{ width: 16, height: 16, color: "#EA580C", flexShrink: 0 }} />
        ) : (
          <Sun style={{ width: 16, height: 16, color: "#6B7280", flexShrink: 0 }} />
        )}
        <div>
          <p style={{ margin: 0, fontSize: 12, fontWeight: 800, color: isSpecial ? "#EA580C" : "#374151" }}>
            {label}
          </p>
          <p style={{ margin: 0, fontSize: 12, color: "#374151", textTransform: "capitalize" }}>
            {formatted}
            {priceMultiplier > 1 && (
              <span style={{
                marginLeft: 8, fontSize: 10, fontWeight: 700,
                background: "#FEF3C7", color: "#D97706",
                padding: "1px 6px", borderRadius: 4,
              }}>
                +{Math.round((priceMultiplier - 1) * 100)}% sobre o preço base
              </span>
            )}
          </p>
        </div>
      </div>
      <button
        data-testid="button-clear-date"
        onClick={onClear}
        style={{
          border: "none",
          fontSize: 10, fontWeight: 700, cursor: "pointer",
          color: "#6B7280", flexShrink: 0, padding: "4px 8px",
          borderRadius: 6, background: "rgba(0,0,0,0.05)",
        } as React.CSSProperties}
      >
        Trocar data
      </button>
    </div>
  )
}
