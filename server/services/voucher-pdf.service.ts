import PDFDocument from "pdfkit"
import { renderVoucherHeader } from "../templates/voucher/header"
import { renderVoucherItems } from "../templates/voucher/items"
import { renderQrSection } from "../templates/voucher/qr-section"
import { renderVoucherInstructions } from "../templates/voucher/instructions"

export interface VoucherItem {
  ticketId: string
  title: string
  quantity: number
  unitPrice: number
  originalPrice?: number
}

export interface VoucherData {
  orderId: string
  customerName: string
  customerEmail: string
  items: VoucherItem[]
  totalAmount: number
  originalTotal: number
  totalSavings: number
  isCombo: boolean
  status: string
  createdAt: string
  expirationDate?: string
  demo?: boolean
  copyPasteCode?: string
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" })
  } catch {
    return iso
  }
}

export async function generateVoucherPdf(data: VoucherData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: [375, 900],
      margins: { top: 24, bottom: 24, left: 20, right: 20 },
      autoFirstPage: true,
      bufferPages: true,
      info: {
        Title: `Voucher RSV360 — Pedido ${data.orderId}`,
        Author: "RSV360 — Reservei Viagens",
        Subject: "Ingresso Digital",
      },
    })

    const chunks: Buffer[] = []
    doc.on("data", (c: Buffer) => chunks.push(c))
    doc.on("end", () => resolve(Buffer.concat(chunks)))
    doc.on("error", reject)

    const TEXT_DARK = "#1F2937"
    const TEXT_GRAY = "#6B7280"
    const GREEN = "#16A34A"
    const W = 335

    renderVoucherHeader(doc, data.demo)

    let y = 88

    doc.fillColor(TEXT_DARK).font("Helvetica-Bold").fontSize(11)
      .text("Detalhes do Pedido", 20, y)
    y += 18

    doc.rect(20, y, W, 1).fill("#E5E7EB")
    y += 8

    const rows: [string, string, string][] = [
      ["Nº do Pedido", data.orderId.slice(0, 36), "mono"],
      ["Cliente", data.customerName, "bold"],
      ["E-mail", data.customerEmail, "normal"],
      ["Data de emissão", formatDate(data.createdAt), "normal"],
      ["Status", data.status === "APPROVED" ? "CONFIRMADO" : data.status, data.status === "APPROVED" ? "green" : "normal"],
    ]

    for (const [label, value, style] of rows) {
      doc.fontSize(8).fillColor(TEXT_GRAY).font("Helvetica").text(label, 20, y)
      const color = style === "green" ? GREEN : TEXT_DARK
      const font = style === "bold" || style === "green" ? "Helvetica-Bold" : "Helvetica"
      doc.fontSize(8).fillColor(color).font(font)
        .text(value, 20, y, { width: W, align: "right" })
      y += 16
    }

    y += 10

    y = renderVoucherItems(doc, data.items, data.isCombo, data.totalSavings, data.totalAmount, y)

    y += 12

    const qrContent = data.copyPasteCode ?? data.orderId

    renderQrSection(doc, qrContent, data.copyPasteCode, y).then((newY) => {
      y = newY + 8
      renderVoucherInstructions(doc, y)
      doc.end()
    }).catch(reject)
  })
}
