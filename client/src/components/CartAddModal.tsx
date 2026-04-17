import { useState, useEffect, useRef } from "react"
import { CheckCircle2, X, Clock, ShoppingBag, Info, ChevronRight, AlertCircle, FileText, ShieldCheck } from "lucide-react"
import { PARK_DETAILS } from "@/lib/park-details"
import { type TicketItem } from "@/components/TicketsGrid"

interface CartAddModalProps {
  ticket: TicketItem | null
  onClose: () => void
  onGoToCart: () => void
  adjPrice: number
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price)
}

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 640)
  useEffect(() => {
    const handler = () => setIsDesktop(window.innerWidth >= 640)
    window.addEventListener("resize", handler)
    return () => window.removeEventListener("resize", handler)
  }, [])
  return isDesktop
}

const AUTO_DISMISS_MS = 8000

export function CartAddModal({ ticket, onClose, onGoToCart, adjPrice }: CartAddModalProps) {
  const isDesktop = useIsDesktop()
  const [progress, setProgress] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startRef = useRef<number>(0)

  useEffect(() => {
    if (!ticket) return
    setProgress(0)
    startRef.current = Date.now()
    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startRef.current
      const pct = Math.min(100, (elapsed / AUTO_DISMISS_MS) * 100)
      setProgress(pct)
      if (pct >= 100) {
        clearInterval(timerRef.current!)
        onClose()
      }
    }, 60)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [ticket])

  if (!ticket) return null

  const details = PARK_DETAILS[ticket.id]

  const isMeiaEntrada = ticket.ticketCategory === "meia-entrada"
  const isMorador = ticket.ticketCategory === "morador"

  const headerBg = isMeiaEntrada
    ? "linear-gradient(135deg, #7C3AED, #DB2777)"
    : isMorador
    ? "linear-gradient(135deg, #059669, #0D9488)"
    : "linear-gradient(135deg, #16A34A, #0891B2)"

  const modalContent = (
    <div
      data-testid="modal-cart-add"
      onClick={(e) => e.stopPropagation()}
      style={{
        background: "#fff",
        borderRadius: isDesktop ? 20 : "20px 20px 0 0",
        width: "100%",
        maxWidth: isDesktop ? 460 : "100%",
        maxHeight: isDesktop ? "90vh" : "88vh",
        overflow: "auto",
        boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
        position: "relative",
      }}
    >
      <div style={{
        height: 3,
        background: "#E5E7EB",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}>
        <div style={{
          height: "100%",
          width: `${progress}%`,
          background: "#22C55E",
          transition: "width 0.06s linear",
        }} />
      </div>

      <div style={{
        background: headerBg,
        padding: "20px 20px 16px",
        color: "#fff",
        position: "relative",
      }}>
        <button
          data-testid="button-close-cart-modal"
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
            flexShrink: 0,
          }}>
            <CheckCircle2 style={{ width: 28, height: 28, color: "#fff" }} />
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.8, marginBottom: 2, letterSpacing: 0.5, textTransform: "uppercase" }}>
              Adicionado ao carrinho!
            </div>
            <div style={{ fontSize: 15, fontWeight: 800, lineHeight: 1.3 }}>
              {ticket.name}
            </div>
          </div>
        </div>

        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          background: "rgba(255,255,255,0.15)", borderRadius: 10, padding: "10px 14px",
        }}>
          <div>
            <div style={{ fontSize: 10, opacity: 0.8, marginBottom: 2 }}>Preço por pessoa</div>
            <div style={{ fontSize: 20, fontWeight: 900 }}>{formatPrice(adjPrice)}</div>
          </div>
          <div style={{ flex: 1 }} />
          <div style={{
            background: "rgba(255,255,255,0.2)", borderRadius: 8,
            padding: "4px 10px", fontSize: 12, fontWeight: 700,
          }}>
            -{ticket.discount}% OFF
          </div>
        </div>
      </div>

      <div style={{ padding: "16px 20px" }}>
        {(isMeiaEntrada || isMorador || ticket.documentRequired) && (
          <div style={{
            background: "#FEF3C7", border: "1px solid #FDE68A",
            borderRadius: 10, padding: "12px 14px", marginBottom: 14,
            display: "flex", gap: 10, alignItems: "flex-start",
          }} data-testid="alert-documents-required">
            <AlertCircle style={{ width: 16, height: 16, color: "#D97706", flexShrink: 0, marginTop: 1 }} />
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#92400E", marginBottom: 4 }}>
                Documentação obrigatória na bilheteria
              </div>
              {details?.meiaEntrada && details.meiaEntrada.length > 0 && (
                <ul style={{ margin: 0, padding: "0 0 0 14px", fontSize: 11, color: "#92400E" }}>
                  {details.meiaEntrada.map((d) => (
                    <li key={d} style={{ marginBottom: 2 }}>{d}</li>
                  ))}
                </ul>
              )}
              {ticket.documentRequired && (
                <p style={{ fontSize: 11, color: "#92400E", margin: "4px 0 0" }}>{ticket.documentRequired}</p>
              )}
            </div>
          </div>
        )}

        {details && (
          <>
            <div style={{
              display: "flex", alignItems: "center", gap: 8, marginBottom: 12,
              borderBottom: "1px solid #F3F4F6", paddingBottom: 10,
            }}>
              <Clock style={{ width: 14, height: 14, color: "#2563EB" }} />
              <div>
                <div style={{ fontSize: 10, fontWeight: 600, color: "#6B7280", marginBottom: 2 }}>HORÁRIO DE FUNCIONAMENTO</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#1F2937" }}>{details.horario}</div>
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#374151", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                <CheckCircle2 style={{ width: 12, height: 12, color: "#16A34A" }} />
                O que está incluso
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {details.inclui.map((item) => (
                  <span key={item} style={{
                    background: "#F0FDF4", border: "1px solid #BBF7D0",
                    borderRadius: 6, padding: "3px 8px",
                    fontSize: 10, color: "#15803D", fontWeight: 600,
                  }}>
                    ✓ {item}
                  </span>
                ))}
              </div>
            </div>

            {details.naInclui.length > 0 && (
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#374151", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                  <X style={{ width: 12, height: 12, color: "#EF4444" }} />
                  Não incluso
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                  {details.naInclui.map((item) => (
                    <span key={item} style={{
                      background: "#FEF2F2", border: "1px solid #FECACA",
                      borderRadius: 6, padding: "3px 8px",
                      fontSize: 10, color: "#DC2626", fontWeight: 600,
                    }}>
                      ✗ {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div style={{
              background: "#F8FAFC", borderRadius: 10, padding: "12px 14px", marginBottom: 14,
              border: "1px solid #E2E8F0",
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#374151", marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
                <ShoppingBag style={{ width: 12, height: 12, color: "#6366F1" }} />
                O que levar
              </div>
              <ul style={{ margin: 0, padding: "0 0 0 14px", fontSize: 11, color: "#6B7280" }}>
                {details.oQueTrazer.map((item) => (
                  <li key={item} style={{ marginBottom: 3, lineHeight: 1.4 }}>{item}</li>
                ))}
              </ul>
            </div>

            <div style={{
              background: "#FFF7ED", border: "1px solid #FED7AA",
              borderRadius: 10, padding: "10px 14px", marginBottom: 14,
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#92400E", marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}>
                <Info style={{ width: 12, height: 12, color: "#D97706" }} />
                Alimentação
              </div>
              <p style={{ margin: 0, fontSize: 11, color: "#78350F", lineHeight: 1.4 }}>{details.alimentacao}</p>
            </div>

            {details.observacoes && (
              <div style={{
                background: "#EFF6FF", border: "1px solid #BFDBFE",
                borderRadius: 10, padding: "10px 14px", marginBottom: 14,
              }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#1E40AF", marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}>
                  <FileText style={{ width: 12, height: 12, color: "#2563EB" }} />
                  Informação importante
                </div>
                <p style={{ margin: 0, fontSize: 11, color: "#1E3A8A", lineHeight: 1.4 }}>{details.observacoes}</p>
              </div>
            )}
          </>
        )}

        <div style={{
          background: "#F0FDF4", border: "1px solid #BBF7D0",
          borderRadius: 10, padding: "12px 14px", marginBottom: 16,
        }} data-testid="section-ticket-rules">
          <div style={{ fontSize: 11, fontWeight: 700, color: "#15803D", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
            <ShieldCheck style={{ width: 13, height: 13, color: "#16A34A" }} />
            Regras do ingresso
          </div>
          <ul style={{ margin: 0, padding: "0 0 0 16px" }}>
            <li style={{ fontSize: 11, color: "#166534", marginBottom: 4, lineHeight: 1.4 }}>
              Válido apenas para a data selecionada — não permite reagendamento
            </li>
            <li style={{ fontSize: 11, color: "#166534", marginBottom: 4, lineHeight: 1.4 }}>
              Sem direito a re-entrada (saída = encerramento da visita)
            </li>
            <li style={{ fontSize: 11, color: "#166534", marginBottom: 4, lineHeight: 1.4 }}>
              Crianças até 4 anos entram gratuitamente (conforme o parque)
            </li>
            <li style={{ fontSize: 11, color: "#166534", marginBottom: 4, lineHeight: 1.4 }}>
              Não é permitido trazer alimentos ou bebidas de fora do parque
            </li>
            <li style={{ fontSize: 11, color: "#166534", lineHeight: 1.4 }}>
              Apresente o ingresso digital na entrada (QR Code ou comprovante PDF)
            </li>
          </ul>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            data-testid="button-continue-shopping"
            onClick={onClose}
            style={{
              flex: 1, padding: "13px 0", border: "1.5px solid #E5E7EB",
              borderRadius: 12, background: "#fff",
              color: "#374151", fontSize: 13, fontWeight: 700, cursor: "pointer",
            }}
          >
            Continuar comprando
          </button>
          <button
            data-testid="button-go-to-cart"
            onClick={onGoToCart}
            style={{
              flex: 1, padding: "13px 0", border: "none",
              borderRadius: 12, background: "linear-gradient(135deg, #0891B2, #2563EB)",
              color: "#fff", fontSize: 13, fontWeight: 800, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            }}
          >
            Ver carrinho
            <ChevronRight style={{ width: 14, height: 14 }} />
          </button>
        </div>

        <p style={{ margin: "8px 0 0", fontSize: 10, color: "#9CA3AF", textAlign: "center" }}>
          Fechando em {Math.ceil((AUTO_DISMISS_MS * (1 - progress / 100)) / 1000)}s automaticamente
        </p>
      </div>
    </div>
  )

  return (
    <div
      data-testid="overlay-cart-add"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(0,0,0,0.5)",
        backdropFilter: "blur(3px)",
        display: "flex",
        alignItems: isDesktop ? "center" : "flex-end",
        justifyContent: "center",
        padding: isDesktop ? 16 : 0,
      }}
    >
      {modalContent}
    </div>
  )
}
