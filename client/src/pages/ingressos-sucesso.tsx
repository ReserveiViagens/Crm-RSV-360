import { useState, useEffect } from "react"
import { CheckCircle2, Download, Phone, ArrowLeft, Ticket, Hotel, Star, Share2, Loader2, AlertCircle, CheckCheck } from "lucide-react"
import { Link, useSearch } from "wouter"
import { useQuery } from "@tanstack/react-query"
import { trackEvent } from "@/lib/analytics"
import { HomeHeader } from "@/components/home/HomeHeader"
import { HomeFooter } from "@/components/home/HomeFooter"
import { MobileCTABar } from "@/components/home/MobileCTABar"

function formatPrice(price: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price)
}

const relatedHotels = [
  { name: "Hotel diRoma Fiori", price: 320, discount: "20%", image: "/images/diroma-acqua-park.jpeg", link: "/hoteis" },
  { name: "Lacqua DiRoma", price: 280, discount: "TOP", image: "/images/hot-park.jpeg", link: "/hoteis" },
  { name: "Pousada Recanto", price: 195, discount: "Econômico", image: "/images/water-park.jpeg", link: "/hoteis" },
]

type OrderData = {
  orderId: string
  status: string
  totalAmount: number
  originalTotal: number
  totalSavings: number
  isCombo: boolean
  items: Array<{ ticketId: string; title: string; quantity: number; unitPrice: number }>
  customer: { name: string; email: string }
  createdAt: string
  expirationDate?: string
  demo?: boolean
}

function SuccessHero({ customerName, onWhatsAppShare }: { customerName?: string; onWhatsAppShare: () => void }) {
  return (
    <div style={{
      background: "linear-gradient(135deg, #16A34A 0%, #22C55E 100%)",
      color: "#fff", padding: "32px 20px 36px", textAlign: "center",
    }}>
      <div style={{
        width: 72, height: 72, borderRadius: "50%",
        background: "rgba(255,255,255,0.20)",
        display: "flex", alignItems: "center", justifyContent: "center",
        margin: "0 auto 14px",
      }}>
        <CheckCircle2 style={{ width: 44, height: 44 }} />
      </div>
      <h1 style={{ fontSize: 26, fontWeight: 800, margin: "0 0 6px" }} data-testid="text-success-title">
        Pagamento Confirmado!
      </h1>
      {customerName && (
        <p style={{ fontSize: 14, opacity: 0.85, margin: "0 0 6px" }}>
          Olá, {customerName.split(" ")[0]}! Seus ingressos estão prontos.
        </p>
      )}
      <p style={{ fontSize: 13, opacity: 0.9, margin: "0 0 20px" }}>
        Baixe o voucher PDF e apresente na entrada do parque. 🎉
      </p>
      <button
        data-testid="button-whatsapp-share"
        onClick={onWhatsAppShare}
        style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "10px 20px", borderRadius: 10,
          background: "rgba(255,255,255,0.95)", color: "#16A34A",
          fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer",
          boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
        }}
      >
        <Share2 style={{ width: 15, height: 15 }} />
        Compartilhar no WhatsApp
      </button>
    </div>
  )
}

function OrderSummaryCard({ data }: { data: OrderData }) {
  return (
    <div style={{
      background: "#fff", borderRadius: 16, padding: 20, marginBottom: 16,
      boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
    }} data-testid="card-success-summary">
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <Ticket style={{ width: 20, height: 20, color: "#2563EB" }} />
        <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: "#1F2937" }}>
          Seus Ingressos
        </h3>
        {data.isCombo && (
          <span style={{
            background: "#DCFCE7", color: "#16A34A", fontSize: 10,
            fontWeight: 700, padding: "2px 6px", borderRadius: 4,
          }}>
            COMBO IA
          </span>
        )}
      </div>

      {data.items.map((item, idx) => (
        <div key={idx} style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "8px 0", borderBottom: "1px solid #F3F4F6",
        }} data-testid={`row-success-item-${item.ticketId}`}>
          <div>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#1F2937" }}>{item.title}</p>
            <p style={{ margin: 0, fontSize: 12, color: "#6B7280" }}>{item.quantity}× ingresso</p>
          </div>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#16A34A" }}>
            {formatPrice(item.unitPrice * item.quantity)}
          </span>
        </div>
      ))}

      {data.isCombo && data.totalSavings > 0 && (
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "8px 0", borderBottom: "1px solid #F3F4F6",
        }}>
          <span style={{ fontSize: 13, color: "#16A34A", fontWeight: 600 }}>Desconto Combo IA (15%)</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#16A34A" }} data-testid="text-success-savings">
            -{formatPrice(data.totalSavings)}
          </span>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 12 }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: "#374151" }}>Total pago</span>
        <span style={{ fontSize: 20, fontWeight: 800, color: "#16A34A" }} data-testid="text-success-total">
          {formatPrice(data.totalAmount)}
        </span>
      </div>

      <div style={{
        marginTop: 12, padding: "10px 12px", background: "#F9FAFB",
        borderRadius: 10, display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <span style={{ fontSize: 11, color: "#6B7280" }}>Nº do Pedido</span>
        <span style={{ fontSize: 10, fontWeight: 700, color: "#374151", fontFamily: "monospace" }} data-testid="text-order-id">
          {data.orderId.slice(0, 28)}...
        </span>
      </div>
    </div>
  )
}

type DownloadState = "idle" | "loading" | "success" | "error"

function VoucherDownloadCard({ orderId, demo }: { orderId: string; demo?: boolean }) {
  const [state, setState] = useState<DownloadState>("idle")
  const [errorMsg, setErrorMsg] = useState("")

  async function handleDownload() {
    setState("loading")
    setErrorMsg("")
    trackEvent("voucher_pdf_download_click", { orderId })
    try {
      const res = await fetch(`/api/orders/${orderId}/voucher`)
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: "Erro ao gerar voucher" }))
        throw new Error(err.message ?? "Erro ao gerar voucher")
      }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `ingresso-rsv360-${orderId.slice(0, 20)}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      setTimeout(() => URL.revokeObjectURL(url), 5000)
      setState("success")
      trackEvent("voucher_pdf_download_success", { orderId })
    } catch (err: any) {
      setErrorMsg(err.message ?? "Erro ao baixar voucher")
      setState("error")
      trackEvent("voucher_pdf_download_error", { orderId, error: err.message })
    }
  }

  const stateMap: Record<DownloadState, { icon: React.ReactNode; label: string; bg: string; color: string }> = {
    idle: {
      icon: <Download style={{ width: 18, height: 18 }} />,
      label: "Baixar Voucher PDF",
      bg: "linear-gradient(135deg, #2563EB, #0891B2)",
      color: "#fff",
    },
    loading: {
      icon: <Loader2 style={{ width: 18, height: 18, animation: "spin 1s linear infinite" }} />,
      label: "Gerando PDF...",
      bg: "linear-gradient(135deg, #2563EB, #0891B2)",
      color: "#fff",
    },
    success: {
      icon: <CheckCheck style={{ width: 18, height: 18 }} />,
      label: "Voucher Baixado!",
      bg: "linear-gradient(135deg, #16A34A, #22C55E)",
      color: "#fff",
    },
    error: {
      icon: <Download style={{ width: 18, height: 18 }} />,
      label: "Tentar novamente",
      bg: "linear-gradient(135deg, #2563EB, #0891B2)",
      color: "#fff",
    },
  }

  const s = stateMap[state]

  return (
    <div style={{ marginBottom: 12 }}>
      {demo && (
        <div style={{
          background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 8,
          padding: "6px 10px", marginBottom: 8, fontSize: 11, color: "#1D4ED8",
          textAlign: "center",
        }} data-testid="badge-demo-voucher">
          Modo demo — o PDF é real e pode ser baixado normalmente
        </div>
      )}
      <button
        data-testid="button-download-voucher"
        onClick={handleDownload}
        disabled={state === "loading"}
        style={{
          width: "100%", padding: "14px 0", border: "none", borderRadius: 12,
          background: s.bg, color: s.color,
          fontSize: 15, fontWeight: 800, cursor: state === "loading" ? "not-allowed" : "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          boxShadow: "0 4px 14px rgba(37,99,235,0.3)",
          opacity: state === "loading" ? 0.85 : 1,
          transition: "all 0.2s",
        }}
      >
        {s.icon}
        {s.label}
      </button>
      {state === "error" && errorMsg && (
        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          marginTop: 8, padding: "8px 12px",
          background: "#FEF2F2", borderRadius: 8,
          fontSize: 12, color: "#DC2626",
        }} data-testid="text-download-error">
          <AlertCircle style={{ width: 14, height: 14, flexShrink: 0 }} />
          {errorMsg}
        </div>
      )}
      {state === "success" && (
        <p style={{ fontSize: 12, color: "#16A34A", textAlign: "center", marginTop: 6 }} data-testid="text-download-success">
          PDF salvo — apresente o QR Code na entrada do parque
        </p>
      )}
    </div>
  )
}

export default function IngressosSucessoPage() {
  const search = useSearch()
  const params = new URLSearchParams(search)
  const orderId = params.get("orderId") ?? params.get("txn") ?? ""

  const { data: orderData, isLoading } = useQuery<OrderData | null>({
    queryKey: ["/api/orders", orderId],
    queryFn: async () => {
      if (!orderId) return null
      const res = await fetch(`/api/orders/${orderId}`)
      if (!res.ok) return null
      return res.json()
    },
    enabled: !!orderId,
    staleTime: 30_000,
  })

  useEffect(() => {
    trackEvent("tickets_success_view", { orderId })
  }, [])

  function handleWhatsAppShare() {
    trackEvent("ticket_whatsapp_share_click", { orderId })
    const msg = encodeURIComponent(
      `🎟️ Comprei meus ingressos pelo RSV360!\n\nTotal: ${formatPrice(orderData?.totalAmount ?? 0)}\n\nAdquira também em: https://rsv360.com.br/ingressos`
    )
    window.open(`https://wa.me/?text=${msg}`, "_blank")
  }

  return (
    <div className="rsv-subpage" style={{ background: "#F8FAFC", minHeight: "100vh" }}>
      <HomeHeader />

      <SuccessHero customerName={orderData?.customer?.name} onWhatsAppShare={handleWhatsAppShare} />

      <div style={{ padding: 16, maxWidth: 560, margin: "0 auto" }}>
        {orderData?.demo && (
          <div style={{
            background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 10,
            padding: "8px 12px", marginBottom: 14, fontSize: 12, color: "#1D4ED8",
            textAlign: "center",
          }} data-testid="badge-demo-success">
            Modo demonstração — este é um ingresso de teste
          </div>
        )}

        {isLoading ? (
          <div style={{
            background: "#fff", borderRadius: 16, padding: 32,
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)", textAlign: "center", marginBottom: 16,
          }} data-testid="card-loading-order">
            <Loader2 style={{ width: 32, height: 32, color: "#2563EB", margin: "0 auto 10px", animation: "spin 1s linear infinite" }} />
            <p style={{ color: "#9CA3AF", fontSize: 13, margin: 0 }}>Carregando detalhes do pedido...</p>
          </div>
        ) : orderData ? (
          <OrderSummaryCard data={orderData} />
        ) : (
          <div style={{
            background: "#fff", borderRadius: 16, padding: 20, marginBottom: 16,
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)", textAlign: "center",
          }} data-testid="card-order-fallback">
            <CheckCircle2 style={{ width: 40, height: 40, color: "#16A34A", margin: "0 auto 10px" }} />
            <p style={{ fontSize: 14, color: "#374151", fontWeight: 600, margin: "0 0 4px" }}>
              Pagamento confirmado!
            </p>
            <p style={{ fontSize: 12, color: "#6B7280", margin: 0 }}>
              Baixe o voucher PDF para seus ingressos.
            </p>
          </div>
        )}

        {orderId && (
          <VoucherDownloadCard orderId={orderId} demo={orderData?.demo} />
        )}

        <a
          href="https://wa.me/5564993197555?text=Olá! Acabei de comprar ingressos pelo RSV360 e preciso de ajuda."
          target="_blank"
          rel="noopener noreferrer"
          data-testid="link-success-whatsapp"
          onClick={() => trackEvent("support_whatsapp_click", { from: "sucesso" })}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            padding: "14px 0", background: "#22C55E", borderRadius: 12,
            color: "#fff", fontSize: 15, fontWeight: 700, textDecoration: "none",
            marginBottom: 28, boxShadow: "0 4px 14px rgba(34,197,94,0.3)",
          }}
        >
          <Phone style={{ width: 18, height: 18 }} />
          Suporte via WhatsApp
        </a>

        <div data-testid="section-related-hotels">
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <Hotel style={{ width: 18, height: 18, color: "#2563EB" }} />
            <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: "#1F2937" }}>
              Complete sua viagem com um hotel
            </h3>
          </div>
          <p style={{ fontSize: 13, color: "#6B7280", margin: "0 0 14px" }}>
            Garanta sua hospedagem próxima aos parques com desconto exclusivo
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {relatedHotels.map((hotel, idx) => (
              <Link
                href={hotel.link}
                key={idx}
                data-testid={`card-related-hotel-${idx}`}
                onClick={() => trackEvent("related_offer_click", { hotelName: hotel.name })}
                style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
                  background: "#fff", borderRadius: 12, textDecoration: "none",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  border: "1px solid #F3F4F6",
                }}
              >
                <img
                  src={hotel.image}
                  alt={hotel.name}
                  style={{ width: 56, height: 56, borderRadius: 8, objectFit: "cover", flexShrink: 0 }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#1F2937" }}>{hotel.name}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                    <Star style={{ width: 12, height: 12, color: "#FACC15", fill: "#FACC15" }} />
                    <span style={{ fontSize: 11, color: "#6B7280" }}>Altamente avaliado</span>
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <span style={{
                    display: "block", background: "#DCFCE7", color: "#16A34A",
                    fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 4, marginBottom: 4,
                  }}>
                    -{hotel.discount}
                  </span>
                  <span style={{ fontSize: 14, fontWeight: 800, color: "#16A34A" }}>
                    {formatPrice(hotel.price)}
                  </span>
                  <span style={{ display: "block", fontSize: 10, color: "#9CA3AF" }}>/noite</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <Link
          href="/ingressos"
          data-testid="link-back-to-tickets"
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            padding: "14px 0", marginTop: 24, marginBottom: 40,
            background: "transparent", borderRadius: 12,
            border: "2px solid #E5E7EB",
            color: "#374151", fontSize: 14, fontWeight: 600, textDecoration: "none",
          }}
        >
          <ArrowLeft style={{ width: 16, height: 16 }} />
          Ver mais ingressos
        </Link>
      </div>

      <HomeFooter />
      <MobileCTABar />

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1 } 50% { opacity: 0.5 } }
      `}</style>
    </div>
  )
}
