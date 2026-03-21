import { useEffect } from "react"
import { CheckCircle2, Download, Phone, ArrowLeft, Ticket, Hotel, MapPin, Star } from "lucide-react"
import { Link, useSearch } from "wouter"
import { useQuery } from "@tanstack/react-query"
import { trackEvent } from "@/lib/analytics"

function formatPrice(price: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price)
}

const relatedHotels = [
  { name: "Hotel diRoma Fiori", price: 320, discount: "20%", image: "/images/diroma-acqua-park.jpeg", link: "/hoteis" },
  { name: "Lacqua DiRoma", price: 280, discount: "TOP", image: "/images/hot-park.jpeg", link: "/hoteis" },
  { name: "Pousada Recanto", price: 195, discount: "Econômico", image: "/images/water-park.jpeg", link: "/hoteis" },
]

export default function IngressosSucessoPage() {
  const search = useSearch()
  const params = new URLSearchParams(search)
  const txnId = params.get("txn") ?? ""

  const { data: txnData } = useQuery({
    queryKey: ["/api/payments/tickets", txnId],
    queryFn: async () => {
      const res = await fetch(`/api/payments/tickets/${txnId}`)
      if (!res.ok) return null
      return res.json() as Promise<{
        transactionId: string
        totalAmount: number
        items: Array<{ ticketId: string; title: string; quantity: number; unitPrice: number }>
        customer: { name: string; email: string }
        expirationDate: string
        demo: boolean
      }>
    },
    enabled: !!txnId,
  })

  useEffect(() => {
    trackEvent("tickets_success_view", { transactionId: txnId })
  }, [])

  function handleDownload() {
    trackEvent("ticket_download_click", { transactionId: txnId })
    const content = `
RSV360 — Reservei Viagens
Ingresso Digital

Transação: ${txnId}
Data: ${new Date().toLocaleDateString("pt-BR")}
Cliente: ${txnData?.customer?.name ?? ""}

Itens:
${(txnData?.items ?? []).map((i) => `• ${i.quantity}x ${i.title} — ${formatPrice(i.unitPrice * i.quantity)}`).join("\n")}

Total pago: ${formatPrice(txnData?.totalAmount ?? 0)}

Apresente este comprovante na entrada do parque.
Dúvidas? WhatsApp: (64) 99319-7555
    `.trim()

    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `ingresso-rsv360-${txnId}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="rsv-subpage" style={{ background: "#F8FAFC", minHeight: "100vh" }}>
      <div style={{
        background: "linear-gradient(135deg, #16A34A 0%, #22C55E 100%)",
        color: "#fff", padding: "24px 20px 28px", textAlign: "center",
      }}>
        <CheckCircle2 style={{ width: 56, height: 56, margin: "0 auto 12px", display: "block" }} />
        <h1 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 6px" }} data-testid="text-success-title">
          Pagamento Confirmado!
        </h1>
        <p style={{ fontSize: 14, opacity: 0.9, margin: 0 }}>
          Seu ingresso foi gerado com sucesso
        </p>
      </div>

      <div style={{ padding: 16, maxWidth: 560, margin: "0 auto" }}>
        {txnData?.demo && (
          <div style={{
            background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 10,
            padding: "8px 12px", marginBottom: 14, fontSize: 12, color: "#1D4ED8",
            textAlign: "center",
          }} data-testid="badge-demo-success">
            Modo demonstração — este é um ingresso de teste
          </div>
        )}

        <div style={{
          background: "#fff", borderRadius: 16, padding: 20, marginBottom: 16,
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        }} data-testid="card-success-summary">
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <Ticket style={{ width: 20, height: 20, color: "#2563EB" }} />
            <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: "#1F2937" }}>
              Seus Ingressos
            </h3>
          </div>

          {txnData ? (
            <>
              {txnData.items.map((item, idx) => (
                <div key={idx} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "8px 0", borderBottom: "1px solid #F3F4F6",
                }} data-testid={`row-success-item-${item.ticketId}`}>
                  <div>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#1F2937" }}>{item.title}</p>
                    <p style={{ margin: 0, fontSize: 12, color: "#6B7280" }}>{item.quantity}x ingresso</p>
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#16A34A" }}>
                    {formatPrice(item.unitPrice * item.quantity)}
                  </span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 12 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#374151" }}>Total pago</span>
                <span style={{ fontSize: 20, fontWeight: 800, color: "#16A34A" }} data-testid="text-success-total">
                  {formatPrice(txnData.totalAmount)}
                </span>
              </div>
              <div style={{
                marginTop: 12, padding: "10px 12px", background: "#F9FAFB",
                borderRadius: 10, display: "flex", justifyContent: "space-between",
              }}>
                <span style={{ fontSize: 11, color: "#6B7280" }}>Transação</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#374151", fontFamily: "monospace" }} data-testid="text-transaction-id">
                  {txnId.slice(0, 20)}...
                </span>
              </div>
            </>
          ) : (
            <div style={{ padding: "20px 0", textAlign: "center" }}>
              <div style={{
                width: 40, height: 40, borderRadius: "50%", background: "#E5E7EB",
                margin: "0 auto 10px", animation: "pulse 2s infinite",
              }} />
              <p style={{ color: "#9CA3AF", fontSize: 13 }}>Carregando detalhes...</p>
            </div>
          )}
        </div>

        <button
          data-testid="button-download-ticket"
          onClick={handleDownload}
          style={{
            width: "100%", padding: "14px 0", border: "none", borderRadius: 12,
            background: "linear-gradient(135deg, #2563EB, #0891B2)",
            color: "#fff", fontSize: 15, fontWeight: 800, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            marginBottom: 12, boxShadow: "0 4px 14px rgba(37,99,235,0.3)",
          }}
        >
          <Download style={{ width: 18, height: 18 }} />
          Baixar Ingresso / Comprovante
        </button>

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
            marginBottom: 24, boxShadow: "0 4px 14px rgba(34,197,94,0.3)",
          }}
        >
          <Phone style={{ width: 18, height: 18 }} />
          Suporte via WhatsApp
        </a>

        <div data-testid="section-related-hotels">
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <Hotel style={{ width: 18, height: 18, color: "#2563EB" }} />
            <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: "#1F2937" }}>
              Complete sua viagem com um hotel
            </h3>
          </div>
          <p style={{ fontSize: 13, color: "#6B7280", margin: "0 0 12px" }}>
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

      <style>{`@keyframes pulse { 0%, 100% { opacity: 1 } 50% { opacity: 0.5 } }`}</style>
    </div>
  )
}
