import type PDFDocument from "pdfkit"

const PRIMARY_BLUE = "#1E3A5F"

export function renderVoucherHeader(
  doc: InstanceType<typeof PDFDocument>,
  demo: boolean | undefined,
): void {
  doc.rect(0, 0, 375, 72).fill(PRIMARY_BLUE)

  doc.fontSize(18).fillColor("#FFFFFF").font("Helvetica-Bold")
    .text("RSV360", 20, 18, { width: 335, align: "left" })
  doc.fontSize(8).fillColor("rgba(255,255,255,0.8)").font("Helvetica")
    .text("Reservei Viagens", 20, 38, { width: 335, align: "left" })
  doc.fontSize(8).fillColor("#FFFFFF").font("Helvetica")
    .text("INGRESSO DIGITAL", 20, 54, { width: 335, align: "left" })

  if (demo) {
    doc.rect(230, 24, 105, 20).fill("#EFF6FF")
    doc.fontSize(8).fillColor("#1D4ED8").font("Helvetica-Bold")
      .text("MODO DEMONSTRAÇÃO", 232, 29, { width: 100, align: "center" })
  }
}
