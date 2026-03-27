import { useEffect } from "react"
import { CheckCircle2, Loader2, Phone, ArrowLeft, Hotel, Star } from "lucide-react"
import { Link, useSearch } from "wouter"
import { useQuery } from "@tanstack/react-query"
import { trackEvent } from "@/lib/analytics"
import { HomeHeader } from "@/components/home/HomeHeader"
import { HomeFooter } from "@/components/home/HomeFooter"
import { MobileCTABar } from "@/components/home/MobileCTABar"
import { SuccessHero } from "@/components/success/SuccessHero"
import { OrderSummaryCard, type OrderSummaryData } from "@/components/success/OrderSummaryCard"
import { VoucherDownloadCard } from "@/components/success/VoucherDownloadCard"

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
  const orderId = params.get("orderId") ?? params.get("txn") ?? ""

  const { data: orderData, isLoading } = useQuery<OrderSummaryData | null>({
    queryKey: ["/api/orders", orderId],
    queryFn: async () => {
      if (!orderId) return null
      const res = await fetch(`/api/orders/${orderId}`)
      if (!res.ok) return null
      return res.json() as Promise<OrderSummaryData>
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
      `}</style>
    </div>
  )
}
