import { CheckCircle2, XCircle } from "lucide-react"
import { Link } from "wouter"

type PaymentStatus = "PENDING" | "APPROVED" | "EXPIRED" | "FAILED" | "CANCELLED"

interface PaymentStatusBannerProps {
  status: PaymentStatus
  isExpired: boolean
}

export function PaymentStatusBanner({ status, isExpired }: PaymentStatusBannerProps) {
  if (status === "APPROVED") {
    return (
      <div style={{
        background: "#DCFCE7", border: "1px solid #86EFAC", borderRadius: 12,
        padding: "14px 16px", marginBottom: 16, display: "flex", alignItems: "center", gap: 10,
      }} data-testid="banner-payment-approved">
        <CheckCircle2 style={{ width: 22, height: 22, color: "#16A34A", flexShrink: 0 }} />
        <span style={{ fontSize: 15, fontWeight: 700, color: "#15803D" }}>Pagamento confirmado!</span>
      </div>
    )
  }

  if (status === "EXPIRED" || isExpired) {
    return (
      <div style={{
        background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 12,
        padding: "14px 16px", marginBottom: 16, display: "flex", alignItems: "center", gap: 10,
      }} data-testid="banner-payment-expired">
        <XCircle style={{ width: 22, height: 22, color: "#EF4444", flexShrink: 0 }} />
        <div>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#DC2626", display: "block" }}>Pix expirado</span>
          <Link href="/ingressos" style={{ fontSize: 12, color: "#2563EB" }}>Voltar e tentar novamente</Link>
        </div>
      </div>
    )
  }

  if (status === "FAILED") {
    return (
      <div style={{
        background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 12,
        padding: "14px 16px", marginBottom: 16, display: "flex", alignItems: "center", gap: 10,
      }} data-testid="banner-payment-failed">
        <XCircle style={{ width: 22, height: 22, color: "#EF4444", flexShrink: 0 }} />
        <div>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#DC2626", display: "block" }}>Falha no pagamento</span>
          <Link href="/ingressos" style={{ fontSize: 12, color: "#2563EB" }}>Voltar e tentar novamente</Link>
        </div>
      </div>
    )
  }

  if (status === "CANCELLED") {
    return (
      <div style={{
        background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 12,
        padding: "14px 16px", marginBottom: 16, display: "flex", alignItems: "center", gap: 10,
      }} data-testid="banner-payment-cancelled">
        <XCircle style={{ width: 22, height: 22, color: "#9CA3AF", flexShrink: 0 }} />
        <span style={{ fontSize: 14, fontWeight: 600, color: "#6B7280" }}>Pagamento cancelado</span>
      </div>
    )
  }

  return null
}
