import { Clock, Loader2 } from "lucide-react"

interface PixCountdownProps {
  minutes: string
  seconds: string
  isExpired: boolean
}

export function PixCountdown({ minutes, seconds, isExpired }: PixCountdownProps) {
  if (isExpired) return null

  return (
    <div style={{
      background: "#FFF7ED", border: "1px solid #FED7AA", borderRadius: 12,
      padding: "10px 14px", marginBottom: 16, display: "flex", alignItems: "center", gap: 10,
    }} data-testid="banner-payment-pending">
      <Clock style={{ width: 18, height: 18, color: "#D97706", flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: "#92400E" }}>
          Aguardando pagamento — expira em{" "}
          <span style={{ fontWeight: 800, color: "#D97706" }} data-testid="text-pix-countdown">
            {minutes}:{seconds}
          </span>
        </span>
      </div>
      <Loader2 style={{ width: 16, height: 16, color: "#D97706", animation: "spin 1s linear infinite", flexShrink: 0 }} />
    </div>
  )
}
