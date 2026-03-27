import { sendVoucherByWhatsApp, sendVoucherByEmail } from "./notification.service.js";
import { enqueuePendingDelivery, updateDelivery, dequeueDelivery, type DeliveryChannel } from "./retry-queue.service.js";

export type VoucherDeliveryInput = {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  totalAmount: number;
};

export type VoucherDeliveryResult = {
  orderId: string;
  whatsapp: { success: boolean; error?: string };
  email: { success: boolean; error?: string };
  allDelivered: boolean;
  pendingChannels: DeliveryChannel[];
};

export async function deliverVoucher(input: VoucherDeliveryInput): Promise<VoucherDeliveryResult> {
  const { orderId, customerName, customerEmail, customerPhone, totalAmount } = input;

  const [waResult, emailResult] = await Promise.allSettled([
    sendVoucherByWhatsApp(orderId, customerName, customerPhone, totalAmount),
    sendVoucherByEmail(orderId, customerName, customerEmail, totalAmount),
  ]);

  const wa = waResult.status === "fulfilled" ? waResult.value : { success: false, channel: "whatsapp" as const, error: waResult.reason instanceof Error ? waResult.reason.message : "Erro desconhecido" };
  const email = emailResult.status === "fulfilled" ? emailResult.value : { success: false, channel: "email" as const, error: emailResult.reason instanceof Error ? emailResult.reason.message : "Erro desconhecido" };

  const pendingChannels: DeliveryChannel[] = [];
  if (!wa.success) pendingChannels.push("whatsapp");
  if (!email.success) pendingChannels.push("email");

  const allDelivered = pendingChannels.length === 0;

  if (!allDelivered) {
    enqueuePendingDelivery({
      orderId,
      customerName,
      customerEmail,
      customerPhone,
      failedChannels: pendingChannels,
      attemptedAt: new Date().toISOString(),
      retryCount: 1,
      lastError: [wa.error, email.error].filter(Boolean).join("; "),
    });
    console.warn(`[voucher-delivery] Entrega pendente para orderId=${orderId} — canais: ${pendingChannels.join(", ")}`);
  } else {
    dequeueDelivery(orderId);
    console.log(`[voucher-delivery] Entrega completa para orderId=${orderId}`);
  }

  return {
    orderId,
    whatsapp: { success: wa.success, error: wa.error },
    email: { success: email.success, error: email.error },
    allDelivered,
    pendingChannels,
  };
}

export async function retryDelivery(input: VoucherDeliveryInput): Promise<VoucherDeliveryResult> {
  const result = await deliverVoucher(input);
  const existing = await import("./retry-queue.service.js").then(m => m.getPendingDelivery(input.orderId));
  if (existing && !result.allDelivered) {
    updateDelivery(input.orderId, {
      retryCount: existing.retryCount + 1,
      attemptedAt: new Date().toISOString(),
      failedChannels: result.pendingChannels,
    });
  }
  return result;
}
