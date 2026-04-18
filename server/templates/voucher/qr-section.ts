import type PDFDocument from "pdfkit"
import QRCode from "qrcode"

const TEXT_GRAY = "#6B7280"
const TEXT_DARK = "#1F2937"

export async function renderQrSection(
  doc: InstanceType<typeof PDFDocument>,
  qrContent: string,
  copyPasteCode: string | undefined,
  startY: number,
): Promise<number> {
  let y = startY

  const qrDataUrl = await QRCode.toDataURL(qrContent, {
    errorCorrectionLevel: "H",
    width: 240,
    margin: 1,
    color: { dark: "#000000", light: "#FFFFFF" },
  })
  const qrBuffer = Buffer.from(qrDataUrl.replace(/^data:image\/png;base64,/, ""), "base64")

  const qrSize = 220
  const qrX = (375 - qrSize) / 2

  doc.fillColor(TEXT_DARK).font("Helvetica-Bold").fontSize(10)
    .text("QR Code de Verificação", 20, y, { width: 335, align: "center" })
  y += 14

  doc.image(qrBuffer, qrX, y, { width: qrSize, height: qrSize })
  y += qrSize + 8

  doc.fontSize(7).fillColor(TEXT_GRAY).font("Helvetica")
    .text("Apresente este QR Code na entrada do parque.", 20, y, { width: 335, align: "center" })
  y += 12

  if (copyPasteCode) {
    doc.fontSize(6).fillColor(TEXT_GRAY).font("Helvetica")
      .text(copyPasteCode.slice(0, 60) + "...", 20, y, { width: 335, align: "center" })
    y += 10
  }

  return y
}
