import { deliverVoucher } from "./voucher-delivery.service.js";
import { logger } from "../lib/logger.js";
import { raiseAlert } from "../lib/alerts.js";

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
  const t0 = Date.now();

  logger.info("[orchestrator] Iniciando pós-pagamento", { orderId, customerName, totalAmount });
  console.log(`[orchestrator] Iniciando pós-pagamento para orderId=${orderId}`);

  const voucherGeneration = import("./voucher-pdf.service.js").then(async ({ generateVoucherPdf }) => {
    const start = Date.now();
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
    const elapsedMs = Date.now() - start;
    logger.info("[orchestrator] Voucher PDF gerado", { orderId, elapsedMs });
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
    const errMsg = voucherResult.reason instanceof Error ? voucherResult.reason.message : String(voucherResult.reason);
    logger.error("[orchestrator] Voucher PDF falhou", { orderId, error: errMsg });
    console.warn(`[orchestrator] Voucher PDF falhou para orderId=${orderId}:`, errMsg);
    raiseAlert("VOUCHER_PDF_FAILURE", `Falha ao gerar voucher PDF para orderId=${orderId}: ${errMsg}`, {
      severity: "critical",
      orderId,
      meta: { error: errMsg },
    });
  }

  if (deliveryResult.status === "rejected") {
    const errMsg = deliveryResult.reason instanceof Error ? deliveryResult.reason.message : String(deliveryResult.reason);
    logger.warn("[orchestrator] Delivery falhou", { orderId, error: errMsg });
    console.warn(`[orchestrator] Delivery falhou para orderId=${orderId}:`, errMsg);
  } else if (deliveryResult.status === "fulfilled") {
    const result = deliveryResult.value;
    if (!result.allDelivered && result.pendingChannels.length > 0) {
      const retryEntry = await import("../services/retry-queue.service.js")
        .then((m) => m.getPendingDelivery(orderId));
      if (retryEntry && retryEntry.retryCount >= 2) {
        raiseAlert(
          "DOUBLE_DELIVERY_FAILURE",
          `Falha dupla de entrega (${retryEntry.retryCount} tentativas) para orderId=${orderId}`,
          { severity: "high", orderId, meta: { channels: result.pendingChannels, retryCount: retryEntry.retryCount } }
        );
      }
    }
  }

  const totalMs = Date.now() - t0;
  logger.info("[orchestrator] Concluído", { orderId, totalMs });
  console.log(`[orchestrator] Concluído para orderId=${orderId} — pagamento PAID permanece independente de falhas de canal`);
}
