import { useState } from "react"
import { Copy, Check } from "lucide-react"
import { trackEvent } from "@/lib/analytics"

interface PixCopyPasteFieldProps {
  copyPasteCode: string
  transactionId: string
  disabled?: boolean
}

export function PixCopyPasteField({ copyPasteCode, transactionId, disabled = false }: PixCopyPasteFieldProps) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    if (disabled) return
    navigator.clipboard.writeText(copyPasteCode)
    setCopied(true)
    trackEvent("pix_code_copy", { transactionId })
    setTimeout(() => setCopied(false), 3000)
  }

  return (
    <div style={{
      background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 10,
      padding: "12px 14px", marginBottom: 14,
      display: "flex", alignItems: "center", gap: 10,
    }} data-testid="field-pix-code">
      <code style={{
        flex: 1, fontSize: 11, color: "#374151", wordBreak: "break-all",
        fontFamily: "monospace", lineHeight: 1.5,
      }}>
        {copyPasteCode}
      </code>
      <button
        data-testid="button-copy-pix"
        onClick={handleCopy}
        disabled={disabled}
        style={{
          padding: "10px 14px", border: "none", borderRadius: 8,
          background: copied ? "#DCFCE7" : "#22C55E",
          color: copied ? "#16A34A" : "#fff",
          fontSize: 13, fontWeight: 700, cursor: disabled ? "not-allowed" : "pointer",
          display: "flex", alignItems: "center", gap: 6, flexShrink: 0,
          transition: "all 0.2s",
        }}
      >
        {copied ? <Check style={{ width: 15, height: 15 }} /> : <Copy style={{ width: 15, height: 15 }} />}
        {copied ? "Copiado!" : "Copiar"}
      </button>
    </div>
  )
}
