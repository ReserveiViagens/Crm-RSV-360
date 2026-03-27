import { useState } from "react"
import { Download, Loader2, CheckCheck, AlertCircle } from "lucide-react"
import { trackEvent } from "@/lib/analytics"

type DownloadState = "idle" | "loading" | "success" | "error"

interface VoucherDownloadCardProps {
  orderId: string
  demo?: boolean
  voucherToken?: string
}

export function VoucherDownloadCard({ orderId, demo, voucherToken }: VoucherDownloadCardProps) {
  const [state, setState] = useState<DownloadState>("idle")
  const [errorMsg, setErrorMsg] = useState("")

  async function handleDownload() {
    setState("loading")
    setErrorMsg("")
    trackEvent("voucher_pdf_download_click", { orderId })
    try {
      const tokenParam = voucherToken ? `?token=${encodeURIComponent(voucherToken)}` : ""
      const res = await fetch(`/api/orders/${orderId}/voucher${tokenParam}`)
      if (!res.ok) {
        const body = await res.json().catch(() => ({ message: "Erro ao gerar voucher" })) as { message?: string }
        throw new Error(body.message ?? "Erro ao gerar voucher")
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
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao baixar voucher"
      setErrorMsg(msg)
      setState("error")
      trackEvent("voucher_pdf_download_error", { orderId, error: msg })
    }
  }

  const stateConfig = {
    idle: {
      icon: <Download style={{ width: 18, height: 18 }} />,
      label: "Baixar Voucher PDF",
      bg: "linear-gradient(135deg, #2563EB, #0891B2)",
    },
    loading: {
      icon: <Loader2 style={{ width: 18, height: 18, animation: "spin 1s linear infinite" }} />,
      label: "Gerando PDF...",
      bg: "linear-gradient(135deg, #2563EB, #0891B2)",
    },
    success: {
      icon: <CheckCheck style={{ width: 18, height: 18 }} />,
      label: "Voucher Baixado!",
      bg: "linear-gradient(135deg, #16A34A, #22C55E)",
    },
    error: {
      icon: <Download style={{ width: 18, height: 18 }} />,
      label: "Tentar novamente",
      bg: "linear-gradient(135deg, #2563EB, #0891B2)",
    },
  }

  const cfg = stateConfig[state]

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
          background: cfg.bg, color: "#fff",
          fontSize: 15, fontWeight: 800, cursor: state === "loading" ? "not-allowed" : "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          boxShadow: "0 4px 14px rgba(37,99,235,0.3)",
          opacity: state === "loading" ? 0.85 : 1,
          transition: "all 0.2s",
        }}
      >
        {cfg.icon}
        {cfg.label}
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
