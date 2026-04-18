import { useState, useMemo } from "react"
import { X, ChevronLeft, ChevronRight, CheckCircle2, Calendar, AlertCircle } from "lucide-react"
import { getDayStatus, getPriceMultiplier } from "@/components/CalendarioIngressos"
import { type TicketItem } from "@/components/TicketsGrid"

interface ComboDatesModalProps {
  ticket: TicketItem
  onConfirm: (comboDates: Record<string, string>, finalPrice: number) => void
  onClose: () => void
}

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]
const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
]

function formatPrice(price: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price)
}

function formatDateBR(iso: string | null): string {
  if (!iso) return "—"
  const d = new Date(iso + "T12:00:00")
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
}

function buildCalendarDays(year: number, month: number): (Date | null)[] {
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: (Date | null)[] = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d))
  return cells
}

interface ParkCalendarProps {
  park: { id: string; name: string; emoji: string; city: string; color: string }
  selectedIso: string | null
  otherSelectedIsos: string[]
  onSelect: (iso: string) => void
}

function ParkCalendar({ park, selectedIso, otherSelectedIsos, onSelect }: ParkCalendarProps) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())

  const cells = useMemo(() => buildCalendarDays(viewYear, viewMonth), [viewYear, viewMonth])

  const otherDates = useMemo(() =>
    otherSelectedIsos
      .filter(Boolean)
      .map(iso => { const d = new Date(iso + "T12:00:00"); d.setHours(0, 0, 0, 0); return d }),
    [otherSelectedIsos]
  )

  function prevMonth() {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11) }
    else setViewMonth(m => m - 1)
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0) }
    else setViewMonth(m => m + 1)
  }

  const selectedDate = selectedIso ? new Date(selectedIso + "T12:00:00") : null

  return (
    <div style={{
      border: "1.5px solid #E5E7EB", borderRadius: 14,
      overflow: "hidden", flex: 1, minWidth: 0,
    }}>
      <div style={{
        background: park.color,
        padding: "10px 14px",
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <span style={{ fontSize: 20, lineHeight: 1 }}>{park.emoji}</span>
        <div>
          <div style={{ fontSize: 12, fontWeight: 800, color: "#fff", lineHeight: 1.2 }}>{park.name}</div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.75)", marginTop: 1 }}>
            {selectedIso ? `✓ ${formatDateBR(selectedIso)}` : "Selecione a data"}
          </div>
        </div>
      </div>

      <div style={{ padding: "10px 12px" }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginBottom: 8,
        }}>
          <button
            data-testid={`button-prev-month-${park.id}`}
            onClick={prevMonth}
            style={{
              width: 26, height: 26, border: "1px solid #E5E7EB",
              borderRadius: 7, background: "#fff", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <ChevronLeft style={{ width: 14, height: 14, color: "#6B7280" }} />
          </button>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#1F2937" }}>
            {MONTHS[viewMonth].slice(0, 3)} {viewYear}
          </span>
          <button
            data-testid={`button-next-month-${park.id}`}
            onClick={nextMonth}
            style={{
              width: 26, height: 26, border: "1px solid #E5E7EB",
              borderRadius: 7, background: "#fff", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <ChevronRight style={{ width: 14, height: 14, color: "#6B7280" }} />
          </button>
        </div>

        <div style={{
          display: "grid", gridTemplateColumns: "repeat(7, 1fr)",
          gap: 2, marginBottom: 6,
        }}>
          {WEEKDAYS.map(w => (
            <div key={w} style={{
              fontSize: 9, fontWeight: 700, color: "#9CA3AF",
              textAlign: "center", padding: "2px 0",
            }}>
              {w.slice(0, 1)}
            </div>
          ))}
        </div>

        <div style={{
          display: "grid", gridTemplateColumns: "repeat(7, 1fr)",
          gap: 2,
        }}>
          {cells.map((date, idx) => {
            if (!date) return <div key={idx} />

            const status = getDayStatus(date)
            const isPast = status === "past"
            const isSoldOut = status === "sold-out"
            const isDisabled = isPast || isSoldOut
            const isConflict = otherDates.some(od => isSameDay(od, date))
            const isSelected = selectedDate ? isSameDay(selectedDate, date) : false
            const isWeekend = date.getDay() === 0 || date.getDay() === 6
            const mult = getPriceMultiplier(date)
            const hasBonus = mult > 1

            let bg = "#fff"
            let border = "1px solid #F3F4F6"
            let color = "#111827"
            let opacity = 1

            if (isSelected) {
              bg = park.color
              border = `1.5px solid ${park.color}`
              color = "#fff"
            } else if (isConflict) {
              bg = "#FEF3C7"
              border = "1px solid #FDE68A"
              color = "#92400E"
            } else if (isDisabled) {
              opacity = 0.35
              color = "#9CA3AF"
            } else if (status === "high-demand") {
              bg = "#FFF7ED"
              border = "1px solid #FED7AA"
              color = "#92400E"
            } else if (status === "available") {
              bg = "#F0FDF4"
              border = "1px solid #BBF7D0"
              color = "#15803D"
            }

            return (
              <button
                key={idx}
                data-testid={`day-${park.id}-${date.toISOString().slice(0, 10)}`}
                disabled={isDisabled || isConflict}
                onClick={() => {
                  const iso = date.toISOString().slice(0, 10)
                  onSelect(iso)
                }}
                style={{
                  width: "100%", aspectRatio: "1",
                  border,
                  borderRadius: 6,
                  background: bg,
                  color,
                  fontSize: 10,
                  fontWeight: isSelected ? 800 : 600,
                  cursor: isDisabled || isConflict ? "not-allowed" : "pointer",
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center",
                  gap: 1,
                  opacity,
                  position: "relative",
                  transition: "all 0.12s",
                  padding: 0,
                }}
                title={
                  isConflict ? "Outro parque já foi agendado nesta data"
                    : isSoldOut ? "Esgotado"
                    : isPast ? "Data passada"
                    : status === "high-demand" ? "Alta demanda"
                    : "Disponível"
                }
              >
                <span>{date.getDate()}</span>
                {hasBonus && !isDisabled && !isConflict && (
                  <span style={{
                    fontSize: 7, fontWeight: 800,
                    color: isSelected ? "rgba(255,255,255,0.85)" : "#D97706",
                    lineHeight: 1,
                  }}>
                    +{Math.round((mult - 1) * 100)}%
                  </span>
                )}
              </button>
            )
          })}
        </div>

        <div style={{
          display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap",
        }}>
          <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 9, color: "#15803D" }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: "#F0FDF4", border: "1px solid #BBF7D0", display: "inline-block" }} />
            Disponível
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 9, color: "#92400E" }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: "#FFF7ED", border: "1px solid #FED7AA", display: "inline-block" }} />
            Alta demanda
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 9, color: "#9CA3AF" }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: "#F3F4F6", border: "1px solid #E5E7EB", display: "inline-block", opacity: 0.4 }} />
            Esgotado
          </span>
        </div>
      </div>
    </div>
  )
}

export function ComboDatesModal({ ticket, onConfirm, onClose }: ComboDatesModalProps) {
  const slots = ticket.parkSlots ?? []
  const [dates, setDates] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {}
    return init
  })

  const allSelected = slots.every(s => !!dates[s.id])

  const finalPrice = useMemo(() => {
    const multipliers = Object.entries(dates).map(([, iso]) => {
      const d = new Date(iso + "T12:00:00")
      return getPriceMultiplier(d)
    })
    const maxMult = multipliers.length > 0 ? Math.max(...multipliers) : 1
    return Math.round(ticket.price * maxMult)
  }, [dates, ticket.price])

  function handleSelect(parkId: string, iso: string) {
    setDates(prev => ({ ...prev, [parkId]: iso }))
  }

  return (
    <div
      data-testid="overlay-combo-dates"
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 16,
        overflowY: "auto",
      }}
    >
      <div
        data-testid="modal-combo-dates"
        onClick={e => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: 20,
          width: "100%",
          maxWidth: slots.length >= 3 ? 760 : 580,
          maxHeight: "90vh",
          overflow: "auto",
          boxShadow: "0 24px 64px rgba(0,0,0,0.28)",
        }}
      >
        <div style={{
          background: "linear-gradient(135deg, #DC2626, #D97706)",
          padding: "20px 22px 16px",
          position: "relative",
        }}>
          <button
            data-testid="button-close-combo-modal"
            onClick={onClose}
            style={{
              position: "absolute", top: 14, right: 14,
              width: 30, height: 30, border: "none",
              background: "rgba(255,255,255,0.2)",
              borderRadius: "50%", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <X style={{ width: 16, height: 16, color: "#fff" }} />
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
            <div style={{
              width: 44, height: 44, borderRadius: "50%",
              background: "rgba(255,255,255,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 22,
            }}>
              📅
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.8, marginBottom: 2, letterSpacing: 0.5, textTransform: "uppercase", color: "#fff" }}>
                Combo Multi-Parque
              </div>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#fff", lineHeight: 1.3 }}>
                {ticket.name}
              </div>
            </div>
          </div>

          <div style={{
            background: "rgba(255,255,255,0.15)", borderRadius: 10,
            padding: "10px 14px",
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <AlertCircle style={{ width: 14, height: 14, color: "rgba(255,255,255,0.9)", flexShrink: 0 }} />
            <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.95)", lineHeight: 1.4 }}>
              Como cada parque fica em uma cidade diferente, selecione um dia exclusivo para cada parque. Finais de semana têm acréscimo de +20%.
            </p>
          </div>
        </div>

        <div style={{ padding: "18px 20px" }}>
          <div style={{
            display: "flex", gap: 12,
            flexWrap: slots.length >= 3 ? "nowrap" : "wrap",
            overflowX: slots.length >= 3 ? "auto" : "visible",
            paddingBottom: 4,
          }}>
            {slots.map(park => (
              <ParkCalendar
                key={park.id}
                park={park}
                selectedIso={dates[park.id] ?? null}
                otherSelectedIsos={slots.filter(s => s.id !== park.id).map(s => dates[s.id] ?? null).filter(Boolean) as string[]}
                onSelect={(iso) => handleSelect(park.id, iso)}
              />
            ))}
          </div>

          <div style={{
            marginTop: 16,
            background: "#F8FAFC", border: "1.5px solid #E2E8F0",
            borderRadius: 12, padding: "12px 16px",
            display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center",
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#9CA3AF", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>
                Datas selecionadas
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {slots.map(park => (
                  <span
                    key={park.id}
                    data-testid={`summary-date-${park.id}`}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 4,
                      background: dates[park.id] ? "#EFF6FF" : "#F3F4F6",
                      border: `1px solid ${dates[park.id] ? "#BFDBFE" : "#E5E7EB"}`,
                      borderRadius: 8, padding: "4px 10px",
                      fontSize: 11, fontWeight: 700,
                      color: dates[park.id] ? "#1D4ED8" : "#9CA3AF",
                    }}
                  >
                    {park.emoji} {park.name.split(" ")[0]}
                    {dates[park.id]
                      ? <><Calendar style={{ width: 10, height: 10 }} /> {formatDateBR(dates[park.id])}</>
                      : <span style={{ fontWeight: 400 }}>— escolher</span>}
                  </span>
                ))}
              </div>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div style={{ fontSize: 10, color: "#9CA3AF", marginBottom: 2 }}>Preço por pessoa</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: "#16A34A" }}>
                {formatPrice(finalPrice)}
              </div>
              {allSelected && (
                <div style={{ fontSize: 9, color: "#6B7280", marginTop: 1 }}>
                  preço ajustado às datas
                </div>
              )}
            </div>
          </div>

          {!allSelected && (
            <div style={{
              marginTop: 10,
              background: "#FEF3C7", border: "1px solid #FDE68A",
              borderRadius: 10, padding: "8px 12px",
              display: "flex", alignItems: "center", gap: 8,
            }} data-testid="alert-select-all-dates">
              <AlertCircle style={{ width: 13, height: 13, color: "#D97706", flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: "#92400E", fontWeight: 600 }}>
                Selecione uma data para {slots.filter(s => !dates[s.id]).map(s => s.name.split(" ")[0]).join(" e ")} para continuar
              </span>
            </div>
          )}

          <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
            <button
              data-testid="button-cancel-combo-dates"
              onClick={onClose}
              style={{
                flex: 1, padding: "13px 0",
                border: "1.5px solid #E5E7EB",
                borderRadius: 12, background: "#fff",
                color: "#374151", fontSize: 13, fontWeight: 700, cursor: "pointer",
              }}
            >
              Cancelar
            </button>
            <button
              data-testid="button-confirm-combo-dates"
              disabled={!allSelected}
              onClick={() => allSelected && onConfirm(dates, finalPrice)}
              style={{
                flex: 2, padding: "13px 0", border: "none",
                borderRadius: 12,
                background: allSelected
                  ? "linear-gradient(135deg, #22C55E, #16A34A)"
                  : "#E5E7EB",
                color: allSelected ? "#fff" : "#9CA3AF",
                fontSize: 13, fontWeight: 800,
                cursor: allSelected ? "pointer" : "not-allowed",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                transition: "all 0.15s",
                boxShadow: allSelected ? "0 4px 14px rgba(34,197,94,0.3)" : "none",
              }}
            >
              <CheckCircle2 style={{ width: 15, height: 15 }} />
              {allSelected ? "Confirmar e adicionar ao carrinho" : "Selecione todas as datas"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
