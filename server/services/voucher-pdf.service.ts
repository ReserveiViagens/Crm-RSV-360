import PDFDocument from "pdfkit"
import QRCode from "qrcode"

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

function categorizeItem(item: VoucherItem): "hotel" | "parque" | "addon" {
  const lower = item.ticketId.toLowerCase() + " " + item.title.toLowerCase()
  if (lower.includes("hotel") || lower.includes("resort") || lower.includes("diroma") || lower.includes("pousada")) return "hotel"
  if (lower.includes("park") || lower.includes("parque") || lower.includes("lagoa") || lower.includes("termas") || lower.includes("aqua") || lower.includes("kawana") || lower.includes("hot-park")) return "parque"
  return "addon"
}

function sortItems(items: VoucherItem[]): VoucherItem[] {
  const order = { hotel: 0, parque: 1, addon: 2 }
  return [...items].sort((a, b) => order[categorizeItem(a)] - order[categorizeItem(b)])
}

function formatBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" })
  } catch {
    return iso
  }
}

export async function generateVoucherPdf(data: VoucherData): Promise<Buffer> {
  const qrContent = data.copyPasteCode ?? data.orderId
  const qrDataUrl = await QRCode.toDataURL(qrContent, {
    errorCorrectionLevel: "H",
    width: 240,
    margin: 1,
    color: { dark: "#000000", light: "#FFFFFF" },
  })
  const qrBase64 = qrDataUrl.replace(/^data:image\/png;base64,/, "")
  const qrBuffer = Buffer.from(qrBase64, "base64")

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: [375, 700],
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

    const W = 335
    const primaryBlue = "#1E3A5F"
    const green = "#16A34A"
    const lightGray = "#F3F4F6"
    const textGray = "#6B7280"
    const textDark = "#1F2937"

    doc.rect(0, 0, 375, 72).fill(primaryBlue)

    doc.fontSize(18).fillColor("#FFFFFF").font("Helvetica-Bold")
      .text("RSV360", 20, 18, { width: W, align: "left" })
    doc.fontSize(8).fillColor("rgba(255,255,255,0.8)").font("Helvetica")
      .text("Reservei Viagens", 20, 38, { width: W, align: "left" })
    doc.fontSize(8).fillColor("#FFFFFF").font("Helvetica")
      .text("INGRESSO DIGITAL", 20, 54, { width: W, align: "left" })

    if (data.demo) {
      doc.rect(230, 24, 105, 20).fill("#EFF6FF")
      doc.fontSize(8).fillColor("#1D4ED8").font("Helvetica-Bold")
        .text("MODO DEMONSTRAÇÃO", 232, 29, { width: 100, align: "center" })
    }

    let y = 88

    doc.fillColor(textDark).font("Helvetica-Bold").fontSize(11)
      .text("Detalhes do Pedido", 20, y)
    y += 18

    doc.rect(20, y, W, 1).fill("#E5E7EB")
    y += 8

    doc.fontSize(8).fillColor(textGray).font("Helvetica")
      .text("Nº do Pedido", 20, y)
    doc.fontSize(8).fillColor(textDark).font("Helvetica-Bold")
      .text(data.orderId.slice(0, 36), 20, y, { width: W, align: "right" })
    y += 16

    doc.fontSize(8).fillColor(textGray).font("Helvetica")
      .text("Cliente", 20, y)
    doc.fontSize(8).fillColor(textDark).font("Helvetica-Bold")
      .text(data.customerName, 20, y, { width: W, align: "right" })
    y += 16

    doc.fontSize(8).fillColor(textGray).font("Helvetica")
      .text("E-mail", 20, y)
    doc.fontSize(8).fillColor(textDark).font("Helvetica")
      .text(data.customerEmail, 20, y, { width: W, align: "right" })
    y += 16

    doc.fontSize(8).fillColor(textGray).font("Helvetica")
      .text("Data de emissão", 20, y)
    doc.fontSize(8).fillColor(textDark).font("Helvetica")
      .text(formatDate(data.createdAt), 20, y, { width: W, align: "right" })
    y += 16

    doc.fontSize(8).fillColor(textGray).font("Helvetica")
      .text("Status", 20, y)
    const statusLabel = data.status === "APPROVED" ? "CONFIRMADO" : data.status
    doc.fontSize(8).fillColor(data.status === "APPROVED" ? green : textGray).font("Helvetica-Bold")
      .text(statusLabel, 20, y, { width: W, align: "right" })
    y += 16

    y += 10

    doc.fillColor(textDark).font("Helvetica-Bold").fontSize(11)
      .text("Ingressos", 20, y)
    y += 18
    doc.rect(20, y, W, 1).fill("#E5E7EB")
    y += 8

    const sorted = sortItems(data.items)
    for (const item of sorted) {
      const lineTotal = item.unitPrice * item.quantity
      const cat = categorizeItem(item)
      const catLabel = cat === "hotel" ? "Hotel" : cat === "parque" ? "Parque" : "Serviço"

      doc.rect(20, y, W, 36).fill(lightGray).stroke()
      doc.rect(20, y, 3, 36).fill(cat === "hotel" ? primaryBlue : cat === "parque" ? green : "#6B7280")

      doc.fontSize(9).fillColor(textDark).font("Helvetica-Bold")
        .text(item.title, 28, y + 6, { width: W - 80 })
      doc.fontSize(7).fillColor(textGray).font("Helvetica")
        .text(`${catLabel} · ${item.quantity}× ingresso`, 28, y + 19)
      doc.fontSize(9).fillColor(green).font("Helvetica-Bold")
        .text(formatBRL(lineTotal), 20, y + 11, { width: W - 6, align: "right" })

      y += 42
    }

    y += 8

    if (data.isCombo && data.totalSavings > 0) {
      doc.rect(20, y, W, 24).fill("#DCFCE7")
      doc.fontSize(8).fillColor(green).font("Helvetica-Bold")
        .text("Desconto Combo IA (15%)", 26, y + 8)
      doc.fontSize(8).fillColor(green).font("Helvetica-Bold")
        .text(`-${formatBRL(data.totalSavings)}`, 20, y + 8, { width: W - 6, align: "right" })
      y += 30
    }

    doc.rect(20, y, W, 32).fill(primaryBlue)
    doc.fontSize(10).fillColor("#FFFFFF").font("Helvetica-Bold")
      .text("TOTAL PAGO", 26, y + 10)
    doc.fontSize(16).fillColor("#FFFFFF").font("Helvetica-Bold")
      .text(formatBRL(data.totalAmount), 20, y + 8, { width: W - 6, align: "right" })
    y += 40

    y += 12

    const qrSize = 220
    const qrX = (375 - qrSize) / 2
    doc.fillColor(textDark).font("Helvetica-Bold").fontSize(10)
      .text("QR Code de Verificação", 20, y, { width: W, align: "center" })
    y += 14

    doc.image(qrBuffer, qrX, y, { width: qrSize, height: qrSize })
    y += qrSize + 8

    doc.fontSize(7).fillColor(textGray).font("Helvetica")
      .text("Apresente este QR Code na entrada do parque.", 20, y, { width: W, align: "center" })
    y += 12

    if (data.copyPasteCode) {
      doc.fontSize(6).fillColor(textGray).font("Helvetica")
        .text(data.copyPasteCode.slice(0, 60) + "...", 20, y, { width: W, align: "center" })
      y += 10
    }

    y += 8

    doc.rect(20, y, W, 1).fill("#E5E7EB")
    y += 8

    doc.fontSize(8).fillColor(textDark).font("Helvetica-Bold")
      .text("Como usar seu ingresso:", 20, y)
    y += 14

    const steps = [
      "1. Salve este voucher no seu celular",
      "2. Apresente o QR Code na entrada do parque",
      "3. Um ingresso físico será entregue",
      "4. Dúvidas? WhatsApp: (64) 99319-7555",
    ]
    for (const step of steps) {
      doc.fontSize(8).fillColor(textGray).font("Helvetica")
        .text(step, 20, y)
      y += 13
    }

    y += 8

    doc.rect(0, y, 375, 28).fill(primaryBlue)
    doc.fontSize(7).fillColor("rgba(255,255,255,0.7)").font("Helvetica")
      .text("RSV360 · Reservei Viagens · reservei.com.br · CNPJ 00.000.000/0001-00", 20, y + 10, {
        width: W,
        align: "center",
      })

    doc.end()
  })
}
