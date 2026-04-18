export type DeliveryChannel = "whatsapp" | "email";

export type PendingDelivery = {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  failedChannels: DeliveryChannel[];
  attemptedAt: string;
  retryCount: number;
  lastError: string;
};

export type PendingConfirmation = {
  orderId: string;
  transactionId: string;
  enqueuedAt: string;
  retryCount: number;
  lastError: string;
};

// ─── Voucher Delivery Queue ───────────────────────────────────────────────────
const voucherDeliveryQueue = new Map<string, PendingDelivery>();

export function enqueuePendingDelivery(entry: PendingDelivery): void {
  voucherDeliveryQueue.set(entry.orderId, entry);
}

export function dequeueDelivery(orderId: string): void {
  voucherDeliveryQueue.delete(orderId);
}

export function updateDelivery(orderId: string, patch: Partial<PendingDelivery>): void {
  const existing = voucherDeliveryQueue.get(orderId);
  if (existing) {
    voucherDeliveryQueue.set(orderId, { ...existing, ...patch });
  }
}

export function getPendingDeliveries(): PendingDelivery[] {
  return Array.from(voucherDeliveryQueue.values()).sort(
    (a, b) => new Date(b.attemptedAt).getTime() - new Date(a.attemptedAt).getTime()
  );
}

export function getPendingDelivery(orderId: string): PendingDelivery | null {
  return voucherDeliveryQueue.get(orderId) ?? null;
}

export function getDeliveryQueueSize(): number {
  return voucherDeliveryQueue.size;
}

// ─── Payment Confirmation Queue ───────────────────────────────────────────────
const paymentConfirmationQueue = new Map<string, PendingConfirmation>();

export function enqueuePaymentConfirmation(entry: PendingConfirmation): void {
  paymentConfirmationQueue.set(entry.orderId, entry);
}

export function dequeuePaymentConfirmation(orderId: string): void {
  paymentConfirmationQueue.delete(orderId);
}

export function updatePaymentConfirmation(orderId: string, patch: Partial<PendingConfirmation>): void {
  const existing = paymentConfirmationQueue.get(orderId);
  if (existing) {
    paymentConfirmationQueue.set(orderId, { ...existing, ...patch });
  }
}

export function getPendingConfirmations(): PendingConfirmation[] {
  return Array.from(paymentConfirmationQueue.values()).sort(
    (a, b) => new Date(b.enqueuedAt).getTime() - new Date(a.enqueuedAt).getTime()
  );
}

export function getConfirmationQueueSize(): number {
  return paymentConfirmationQueue.size;
}

export function getQueueStats(): { deliveryQueue: number; confirmationQueue: number } {
  return {
    deliveryQueue: voucherDeliveryQueue.size,
    confirmationQueue: paymentConfirmationQueue.size,
  };
}
