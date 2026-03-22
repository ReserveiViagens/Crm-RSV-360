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

function getDayStatus(date: Date): DayStatus {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  if (date < today) return "past"
  const day = date.getDate()
  const month = date.getMonth()
  const dow = date.getDay()
  const seed = (day * 3 + month * 7 + 13) % 17
  if (seed === 0 || seed === 5 || seed === 11) return "sold-out"
  if (dow === 0 || dow === 6 || seed <= 4) return "high-demand"
  return "available"
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}

const STATUS_COLORS: Record<DayStatus, { bg: string; text: string; border: string }> = {
  available: { bg: "#F0FDF4", text: "#16A34A", border: "#DCFCE7" },
  "high-demand": { bg: "#FFF7ED", text: "#EA580C", border: "#FED7AA" },
  "sold-out": { bg: "#FEF2F2", text: "#DC2626", border: "#FECACA" },
  past: { bg: "#F9FAFB", text: "#D1D5DB", border: "transparent" },
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
                    background: selected ? "rgba(255,255,255,0.7)"
                      : status === "sold-out" ? "#DC2626"
                      : status === "high-demand" ? "#EA580C"
                      : "#16A34A",
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
            { status: "available" as DayStatus, label: "Disponível", icon: "●" },
            { status: "high-demand" as DayStatus, label: "Alta demanda", icon: "●" },
            { status: "sold-out" as DayStatus, label: "Esgotado", icon: "●" },
          ].map(({ status, label, icon }) => (
            <div key={status} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{
                fontSize: 10,
                color: STATUS_COLORS[status].text,
              }}>{icon}</span>
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
  const isHighDemand = status === "high-demand"
  const formatted = selectedDate.toLocaleDateString("pt-BR", {
    weekday: "long", day: "2-digit", month: "long", year: "numeric",
  })

  return (
    <div style={{
      background: isHighDemand
        ? "linear-gradient(135deg, #FFF7ED, #FFEDD5)"
        : "linear-gradient(135deg, #F0FDF4, #DCFCE7)",
      border: `1px solid ${isHighDemand ? "#FED7AA" : "#BBF7D0"}`,
      borderRadius: 12,
      padding: "10px 14px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 10,
    }} data-testid="banner-selected-date">
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {isHighDemand ? (
          <AlertTriangle style={{ width: 16, height: 16, color: "#EA580C", flexShrink: 0 }} />
        ) : (
          <Sun style={{ width: 16, height: 16, color: "#16A34A", flexShrink: 0 }} />
        )}
        <div>
          <p style={{ margin: 0, fontSize: 12, fontWeight: 800, color: isHighDemand ? "#EA580C" : "#16A34A" }}>
            {isHighDemand ? "Alta demanda — preços de fim de semana" : "Data selecionada"}
          </p>
          <p style={{ margin: 0, fontSize: 12, color: "#374151", textTransform: "capitalize" }}>
            {formatted}
            {priceMultiplier > 1 && (
              <span style={{
                marginLeft: 8, fontSize: 10, fontWeight: 700,
                background: "#FEF3C7", color: "#D97706",
                padding: "1px 6px", borderRadius: 4,
              }}>
                +{Math.round((priceMultiplier - 1) * 100)}% fim de semana
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

export function getPriceMultiplier(date: Date | null): number {
  if (!date) return 1
  const dow = date.getDay()
  if (dow === 0 || dow === 6) return 1.20
  return 1.0
}

export { getDayStatus }
