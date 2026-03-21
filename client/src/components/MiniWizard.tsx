import { useState, useMemo } from "react"
import { X, ChevronRight, ChevronLeft, Users, Clock, TrendingUp, Star, Heart, Sparkles, Check, ShoppingCart } from "lucide-react"
import { type CartItem } from "@/lib/cart-store"

type Duration = "Dia inteiro" | "Meio dia" | "Tanto faz"
type Priority = "economia" | "popularidade" | "familia"

interface TicketBase {
  id: string
  name: string
  price: number
  originalPrice: number
  discount: number
  duration: string
  popular?: boolean
  tags: string[]
  image?: string
}

interface MiniWizardProps {
  open: boolean
  tickets: TicketBase[]
  onClose: () => void
  onConfirm: (items: CartItem[]) => void
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price)
}

function scoreTickets(
  tickets: TicketBase[],
  duration: Duration,
  priority: Priority
): TicketBase[] {
  return [...tickets].sort((a, b) => {
    let scoreA = 0
    let scoreB = 0

    if (duration !== "Tanto faz") {
      if (a.duration === duration) scoreA += 3
      if (b.duration === duration) scoreB += 3
    }

    if (priority === "economia") {
      scoreA += a.discount / a.price
      scoreB += b.discount / b.price
    } else if (priority === "popularidade") {
      if (a.popular) scoreA += 2
      if (b.popular) scoreB += 2
      scoreA += a.discount * 0.01
      scoreB += b.discount * 0.01
    } else if (priority === "familia") {
      const familyTags = ["família", "familia", "kids", "infantil"]
      if (a.tags.some((t) => familyTags.some((f) => t.toLowerCase().includes(f)))) scoreA += 2
      if (b.tags.some((t) => familyTags.some((f) => t.toLowerCase().includes(f)))) scoreB += 2
      if (a.popular) scoreA += 1
      if (b.popular) scoreB += 1
    }

    return scoreB - scoreA
  })
}

export function MiniWizard({ open, tickets, onClose, onConfirm }: MiniWizardProps) {
  const [step, setStep] = useState(1)
  const [people, setPeople] = useState(2)
  const [duration, setDuration] = useState<Duration>("Tanto faz")
  const [priority, setPriority] = useState<Priority>("economia")
  const [wantsCombo, setWantsCombo] = useState(false)

  const recommendation = useMemo(() => {
    if (tickets.length === 0) return []
    const scored = scoreTickets(tickets, duration, priority)
    return wantsCombo ? scored.slice(0, 2) : [scored[0]]
  }, [tickets, duration, priority, wantsCombo])

  const originalTotal = recommendation.reduce((s, t) => s + t.price, 0)
  const finalTotal = wantsCombo
    ? Math.round(originalTotal * 0.85)
    : originalTotal
  const savings = originalTotal - finalTotal

  function handleConfirm() {
    const items: CartItem[] = recommendation.map((t) => ({
      ticketId: t.id,
      name: t.name,
      unitPrice: wantsCombo
        ? Math.round((t.price * 0.85 * 100) / 100)
        : t.price,
      originalPrice: t.originalPrice,
      discount: t.discount,
      quantity: people,
      image: t.image,
    }))
    onConfirm(items)
    setStep(1)
    setPeople(2)
    setDuration("Tanto faz")
    setPriority("economia")
    setWantsCombo(false)
  }

  function handleClose() {
    onClose()
    setStep(1)
  }

  if (!open) return null

  return (
    <div
      data-testid="modal-mini-wizard"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 300,
        background: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        padding: "0 0 0",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) handleClose() }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "20px 20px 0 0",
          width: "100%",
          maxWidth: 520,
          maxHeight: "85vh",
          overflow: "auto",
          padding: 24,
          boxShadow: "0 -8px 32px rgba(0,0,0,0.15)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 17, fontWeight: 800, color: "#111827" }}>
              {step === 1 ? "Sua viagem" : step === 2 ? "Suas preferências" : "Recomendação"}
            </div>
            <div style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>
              Passo {step} de 3
            </div>
          </div>
          <button
            data-testid="button-wizard-close"
            onClick={handleClose}
            style={{
              background: "#F3F4F6",
              border: "none",
              borderRadius: 10,
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <X style={{ width: 16, height: 16, color: "#374151" }} />
          </button>
        </div>

        <div style={{ display: "flex", gap: 4, marginBottom: 24 }}>
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              style={{
                flex: 1,
                height: 4,
                borderRadius: 4,
                background: s <= step ? "linear-gradient(90deg, #0891B2, #2563EB)" : "#E5E7EB",
                transition: "background 0.3s",
              }}
            />
          ))}
        </div>

        {step === 1 && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <Users style={{ width: 16, height: 16, color: "#0891B2" }} />
                <span style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>
                  Quantas pessoas?
                </span>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {[1, 2, 3, 4].map((n) => (
                  <button
                    key={n}
                    data-testid={`wizard-people-${n}`}
                    onClick={() => setPeople(n)}
                    style={{
                      flex: 1,
                      padding: "10px 0",
                      border: `2px solid ${people === n ? "#0891B2" : "#E5E7EB"}`,
                      borderRadius: 10,
                      background: people === n ? "#EFF6FF" : "#fff",
                      color: people === n ? "#0891B2" : "#374151",
                      fontWeight: 700,
                      fontSize: 14,
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                  >
                    {n === 4 ? "4+" : n}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <Clock style={{ width: 16, height: 16, color: "#0891B2" }} />
                <span style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>
                  Tempo disponível?
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {(["Dia inteiro", "Meio dia", "Tanto faz"] as Duration[]).map((d) => (
                  <button
                    key={d}
                    data-testid={`wizard-duration-${d.toLowerCase().replace(/ /g, "-")}`}
                    onClick={() => setDuration(d)}
                    style={{
                      padding: "12px 16px",
                      border: `2px solid ${duration === d ? "#0891B2" : "#E5E7EB"}`,
                      borderRadius: 12,
                      background: duration === d ? "#EFF6FF" : "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                  >
                    <span style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: duration === d ? "#0891B2" : "#374151",
                    }}>{d}</span>
                    {duration === d && <Check style={{ width: 14, height: 14, color: "#0891B2" }} />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#111827", marginBottom: 12 }}>
                O que é mais importante para você?
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {([
                  { key: "economia" as Priority, icon: TrendingUp, label: "Economia", desc: "Melhor custo-benefício" },
                  { key: "popularidade" as Priority, icon: Star, label: "Popularidade", desc: "O mais badalado" },
                  { key: "familia" as Priority, icon: Heart, label: "Família", desc: "Ideal para crianças" },
                ]).map(({ key, icon: Icon, label, desc }) => (
                  <button
                    key={key}
                    data-testid={`wizard-priority-${key}`}
                    onClick={() => setPriority(key)}
                    style={{
                      padding: "12px 16px",
                      border: `2px solid ${priority === key ? "#0891B2" : "#E5E7EB"}`,
                      borderRadius: 12,
                      background: priority === key ? "#EFF6FF" : "#fff",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                  >
                    <Icon style={{ width: 18, height: 18, color: priority === key ? "#0891B2" : "#9CA3AF" }} />
                    <div style={{ textAlign: "left" }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: priority === key ? "#0891B2" : "#111827" }}>
                        {label}
                      </div>
                      <div style={{ fontSize: 11, color: "#6B7280" }}>{desc}</div>
                    </div>
                    {priority === key && (
                      <Check style={{ width: 14, height: 14, color: "#0891B2", marginLeft: "auto" }} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div style={{
              padding: "14px 16px",
              border: `2px solid ${wantsCombo ? "#8B5CF6" : "#E5E7EB"}`,
              borderRadius: 12,
              background: wantsCombo ? "#F5F3FF" : "#FAFAFA",
              display: "flex",
              alignItems: "center",
              gap: 12,
              cursor: "pointer",
              transition: "all 0.15s",
            }}
              onClick={() => setWantsCombo(!wantsCombo)}
              data-testid="wizard-toggle-combo"
            >
              <Sparkles style={{ width: 18, height: 18, color: wantsCombo ? "#8B5CF6" : "#9CA3AF", flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: wantsCombo ? "#8B5CF6" : "#111827" }}>
                  Quero combo com 15% OFF
                </div>
                <div style={{ fontSize: 11, color: "#6B7280" }}>
                  Combine 2 parques e economize mais
                </div>
              </div>
              <div style={{
                width: 22,
                height: 22,
                borderRadius: 6,
                border: `2px solid ${wantsCombo ? "#8B5CF6" : "#D1D5DB"}`,
                background: wantsCombo ? "#8B5CF6" : "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}>
                {wantsCombo && <Check style={{ width: 12, height: 12, color: "#fff" }} />}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 12 }}>
                Baseado nas suas preferências, recomendamos:
              </div>
              {recommendation.map((t) => (
                <div
                  key={t.id}
                  style={{
                    padding: "12px 14px",
                    border: "1.5px solid #BFDBFE",
                    borderRadius: 12,
                    background: "#EFF6FF",
                    marginBottom: 8,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#1E40AF" }}>
                      {t.name}
                    </div>
                    <div style={{ fontSize: 11, color: "#6B7280", marginTop: 2 }}>
                      {t.duration} · -{t.discount}% OFF
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 15, fontWeight: 800, color: "#1E40AF" }}>
                      {formatPrice(t.price)}
                    </div>
                    <div style={{ fontSize: 10, color: "#9CA3AF", textDecoration: "line-through" }}>
                      {formatPrice(t.originalPrice)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              padding: "14px 16px",
              borderRadius: 12,
              background: wantsCombo
                ? "linear-gradient(135deg, #8B5CF6, #6D28D9)"
                : "linear-gradient(135deg, #0891B2, #2563EB)",
              marginBottom: 16,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.75)" }}>Subtotal</span>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", textDecoration: "line-through" }}>
                  {formatPrice(originalTotal * people)}
                </span>
              </div>
              {wantsCombo && (
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.85)" }}>Desconto combo (15%)</span>
                  <span style={{ fontSize: 12, color: "#86EFAC" }}>-{formatPrice(savings * people)}</span>
                </div>
              )}
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                paddingTop: 8,
                borderTop: "1px solid rgba(255,255,255,0.2)",
              }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>
                  Total ({people} {people === 1 ? "pessoa" : "pessoas"})
                </span>
                <span style={{ fontSize: 17, fontWeight: 800, color: "#fff" }}>
                  {formatPrice(finalTotal * people)}
                </span>
              </div>
              {wantsCombo && (
                <div style={{
                  marginTop: 8,
                  background: "rgba(255,255,255,0.15)",
                  borderRadius: 8,
                  padding: "6px 10px",
                  fontSize: 11,
                  color: "#fff",
                  textAlign: "center",
                }}>
                  Você economiza {formatPrice(savings * people)}!
                </div>
              )}
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
          {step > 1 && (
            <button
              data-testid="button-wizard-back"
              onClick={() => setStep(step - 1)}
              style={{
                padding: "12px 20px",
                border: "1.5px solid #E5E7EB",
                borderRadius: 12,
                background: "#fff",
                color: "#374151",
                fontWeight: 700,
                fontSize: 14,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <ChevronLeft style={{ width: 16, height: 16 }} />
              Voltar
            </button>
          )}

          {step < 3 ? (
            <button
              data-testid="button-wizard-next"
              onClick={() => setStep(step + 1)}
              style={{
                flex: 1,
                padding: "12px 20px",
                border: "none",
                borderRadius: 12,
                background: "linear-gradient(135deg, #0891B2, #2563EB)",
                color: "#fff",
                fontWeight: 800,
                fontSize: 14,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
              }}
            >
              Próximo
              <ChevronRight style={{ width: 16, height: 16 }} />
            </button>
          ) : (
            <button
              data-testid="button-wizard-confirm"
              onClick={handleConfirm}
              style={{
                flex: 1,
                padding: "12px 20px",
                border: "none",
                borderRadius: 12,
                background: wantsCombo
                  ? "linear-gradient(135deg, #8B5CF6, #6D28D9)"
                  : "linear-gradient(135deg, #22C55E, #16A34A)",
                color: "#fff",
                fontWeight: 800,
                fontSize: 14,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
              }}
            >
              <ShoppingCart style={{ width: 16, height: 16 }} />
              Adicionar ao carrinho
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
