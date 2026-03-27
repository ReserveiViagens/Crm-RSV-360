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

const retryQueue = new Map<string, PendingDelivery>();

export function enqueuePendingDelivery(entry: PendingDelivery): void {
  retryQueue.set(entry.orderId, entry);
}

export function dequeueDelivery(orderId: string): void {
  retryQueue.delete(orderId);
}

export function updateDelivery(orderId: string, patch: Partial<PendingDelivery>): void {
  const existing = retryQueue.get(orderId);
  if (existing) {
    retryQueue.set(orderId, { ...existing, ...patch });
  }
}

export function getPendingDeliveries(): PendingDelivery[] {
  return Array.from(retryQueue.values()).sort(
    (a, b) => new Date(b.attemptedAt).getTime() - new Date(a.attemptedAt).getTime()
  );
}

export function getPendingDelivery(orderId: string): PendingDelivery | null {
  return retryQueue.get(orderId) ?? null;
}
