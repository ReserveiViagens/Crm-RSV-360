import { CheckCircle2, Share2 } from "lucide-react"

interface SuccessHeroProps {
  customerName?: string
  onWhatsAppShare: () => void
}

export function SuccessHero({ customerName, onWhatsAppShare }: SuccessHeroProps) {
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
