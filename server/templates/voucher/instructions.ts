import type PDFDocument from "pdfkit"

const TEXT_DARK = "#1F2937"
const TEXT_GRAY = "#6B7280"
const PRIMARY_BLUE = "#1E3A5F"

const INSTRUCTIONS = [
  "1. Salve este voucher no seu celular",
  "2. Apresente o QR Code na entrada do parque",
  "3. Um ingresso físico será entregue",
  "4. Dúvidas? WhatsApp: (64) 99319-7555",
]

export function renderVoucherInstructions(
  doc: InstanceType<typeof PDFDocument>,
  startY: number,
): number {
  let y = startY

  doc.rect(20, y, 335, 1).fill("#E5E7EB")
  y += 8

  doc.fontSize(8).fillColor(TEXT_DARK).font("Helvetica-Bold")
    .text("Como usar seu ingresso:", 20, y)
  y += 14

  for (const step of INSTRUCTIONS) {
    doc.fontSize(8).fillColor(TEXT_GRAY).font("Helvetica")
      .text(step, 20, y)
    y += 13
  }

  y += 8

  doc.rect(0, y, 375, 28).fill(PRIMARY_BLUE)
  doc.fontSize(7).fillColor("rgba(255,255,255,0.7)").font("Helvetica")
    .text("RSV360 · Reservei Viagens · reservei.com.br · CNPJ 00.000.000/0001-00", 20, y + 10, {
      width: 335,
      align: "center",
    })

  return y + 28
}
