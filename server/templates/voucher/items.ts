import type PDFDocument from "pdfkit"
import type { VoucherItem } from "../../services/voucher-pdf.service"

const GREEN = "#16A34A"
const PRIMARY_BLUE = "#1E3A5F"
const LIGHT_GRAY = "#F3F4F6"
const TEXT_DARK = "#1F2937"
const TEXT_GRAY = "#6B7280"

export function categorizeItem(item: VoucherItem): "hotel" | "parque" | "addon" {
  const lower = item.ticketId.toLowerCase() + " " + item.title.toLowerCase()
  if (lower.includes("hotel") || lower.includes("resort") || lower.includes("diroma") || lower.includes("pousada")) return "hotel"
  if (lower.includes("park") || lower.includes("parque") || lower.includes("lagoa") || lower.includes("termas") || lower.includes("aqua") || lower.includes("kawana") || lower.includes("hot-park")) return "parque"
  return "addon"
}

export function sortItems(items: VoucherItem[]): VoucherItem[] {
  const order = { hotel: 0, parque: 1, addon: 2 }
  return [...items].sort((a, b) => order[categorizeItem(a)] - order[categorizeItem(b)])
}

function formatBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)
}

export function renderVoucherItems(
  doc: InstanceType<typeof PDFDocument>,
  items: VoucherItem[],
  isCombo: boolean,
  totalSavings: number,
  totalAmount: number,
  startY: number,
): number {
  let y = startY

  doc.fillColor(TEXT_DARK).font("Helvetica-Bold").fontSize(11)
    .text("Ingressos", 20, y)
  y += 18
  doc.rect(20, y, 335, 1).fill("#E5E7EB")
  y += 8

  const sorted = sortItems(items)
  for (const item of sorted) {
    const lineTotal = item.unitPrice * item.quantity
    const cat = categorizeItem(item)
    const catLabel = cat === "hotel" ? "Hotel" : cat === "parque" ? "Parque" : "Serviço"
    const catColor = cat === "hotel" ? PRIMARY_BLUE : cat === "parque" ? GREEN : TEXT_GRAY

    doc.rect(20, y, 335, 36).fill(LIGHT_GRAY).stroke()
    doc.rect(20, y, 3, 36).fill(catColor)

    doc.fontSize(9).fillColor(TEXT_DARK).font("Helvetica-Bold")
      .text(item.title, 28, y + 6, { width: 255 })
    doc.fontSize(7).fillColor(TEXT_GRAY).font("Helvetica")
      .text(`${catLabel} · ${item.quantity}× ingresso`, 28, y + 19)
    doc.fontSize(9).fillColor(GREEN).font("Helvetica-Bold")
      .text(formatBRL(lineTotal), 20, y + 11, { width: 329, align: "right" })

    y += 42
  }

  y += 8

  if (isCombo && totalSavings > 0) {
    doc.rect(20, y, 335, 24).fill("#DCFCE7")
    doc.fontSize(8).fillColor(GREEN).font("Helvetica-Bold")
      .text("Desconto Combo IA (15%)", 26, y + 8)
    doc.fontSize(8).fillColor(GREEN).font("Helvetica-Bold")
      .text(`-${formatBRL(totalSavings)}`, 20, y + 8, { width: 329, align: "right" })
    y += 30
  }

  doc.rect(20, y, 335, 32).fill(PRIMARY_BLUE)
  doc.fontSize(10).fillColor("#FFFFFF").font("Helvetica-Bold")
    .text("TOTAL PAGO", 26, y + 10)
  doc.fontSize(16).fillColor("#FFFFFF").font("Helvetica-Bold")
    .text(formatBRL(totalAmount), 20, y + 8, { width: 329, align: "right" })
  y += 40

  return y
}
