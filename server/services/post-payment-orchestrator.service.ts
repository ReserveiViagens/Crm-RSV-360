import { deliverVoucher } from "./voucher-delivery.service.js";

export type OrderForOrchestration = {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  totalAmount: number;
  originalTotal: number;
  totalSavings: number;
  isCombo: boolean;
  status: string;
  createdAt: string;
  expirationDate?: string;
  demo?: boolean;
  copyPasteCode?: string;
  items: Array<{ ticketId: string; title: string; quantity: number; unitPrice: number; originalPrice?: number }>;
};

export async function runPostPaymentOrchestration(order: OrderForOrchestration): Promise<void> {
  const { orderId, customerName, customerEmail, customerPhone, totalAmount } = order;
  console.log(`[orchestrator] Iniciando pós-pagamento para orderId=${orderId}`);

  const voucherGeneration = import("./voucher-pdf.service.js").then(async ({ generateVoucherPdf }) => {
    await generateVoucherPdf({
      orderId,
      customerName,
      customerEmail,
      totalAmount,
      originalTotal: order.originalTotal,
      totalSavings: order.totalSavings,
      isCombo: order.isCombo,
      status: order.status,
      createdAt: order.createdAt,
      expirationDate: order.expirationDate,
      demo: order.demo,
      copyPasteCode: order.copyPasteCode,
      items: order.items,
    });
    console.log(`[orchestrator] Voucher PDF gerado para orderId=${orderId}`);
  });

  const deliveryEnqueue = deliverVoucher({
    orderId,
    customerName,
    customerEmail,
    customerPhone,
    totalAmount,
  });

  const [voucherResult, deliveryResult] = await Promise.allSettled([
    voucherGeneration,
    deliveryEnqueue,
  ]);

  if (voucherResult.status === "rejected") {
    console.warn(
      `[orchestrator] Voucher PDF falhou para orderId=${orderId}:`,
      voucherResult.reason instanceof Error ? voucherResult.reason.message : voucherResult.reason
    );
  }

  if (deliveryResult.status === "rejected") {
    console.warn(
      `[orchestrator] Delivery falhou para orderId=${orderId}:`,
      deliveryResult.reason instanceof Error ? deliveryResult.reason.message : deliveryResult.reason
    );
  }

  console.log(`[orchestrator] Concluído para orderId=${orderId} — pagamento PAID permanece independente de falhas de canal`);
}
