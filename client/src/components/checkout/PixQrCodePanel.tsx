interface PixQrCodePanelProps {
  qrCodeBase64: string
}

export function PixQrCodePanel({ qrCodeBase64 }: PixQrCodePanelProps) {
  return (
    <div
      style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}
      data-testid="div-qr-code"
    >
      <img
        src={qrCodeBase64}
        alt="QR Code Pix"
        style={{ width: 180, height: 180, borderRadius: 12, border: "3px solid #22C55E" }}
      />
    </div>
  )
}
