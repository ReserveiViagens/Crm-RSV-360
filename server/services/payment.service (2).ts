const GATEWAY_API_URL = process.env.GATEWAY_API_URL;
const GATEWAY_API_KEY = process.env.GATEWAY_API_KEY;
const IS_DEMO = !GATEWAY_API_URL || !GATEWAY_API_KEY;

export interface SplitRule {
  recipientId: string;
  amount: number;
  liable: boolean;
  chargeProcessingFee: boolean;
}

export interface PixPaymentResult {
  success: boolean;
  demo: boolean;
  transactionId: string;
  pixQrCode: string;
  pixCopyPaste: string;
  status: string;
  platformAmount: number;
  organizerAmount: number;
  expiresAt: string;
}

const DEMO_PIX_QR =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAABlBMVEX///8AAABVwtN+AAAB+klEQVR4nO2ayw7DIAxE6f9/uqcrQQiPweNJpZ6VKmxmjI0BAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgc4wxHiml9NznvPe01lprH+e9/17vvfc457z3nPe+5z3nfe9573vfe9573vee/73vfe9573vee9773vfe9573vfe9773vfe9573vfe9773vfe9573vfe+573vfe9773vfe9573vfe9773vfe977nvfe9573vfe9773vfe9573vfe9773vfe9573vfe977nvfe9573vfe9773vfe9573vfe9773vfe977";

export async function createSplitPaymentPix(
  amount: number,
  orderId: string,
  customerName: string,
  organizerCommissionAmount: number,
): Promise<PixPaymentResult> {
  const platformAmount = amount - organizerCommissionAmount;
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();

  if (IS_DEMO) {
    return {
      success: true,
      demo: true,
      transactionId: `demo-txn-${orderId}`,
      pixQrCode: DEMO_PIX_QR,
      pixCopyPaste: `00020126580014br.gov.bcb.pix0136reservei-demo-${orderId}5204000053039865802BR5925${customerName.slice(0, 25)}6009SAO PAULO62070503***6304DEMO`,
      status: "waiting_payment",
      platformAmount,
      organizerAmount: organizerCommissionAmount,
      expiresAt,
    };
  }

  const payload = {
    items: [{ id: orderId, title: "Excursão Caldas Novas", quantity: 1, unit_price: amount }],
    customer: { name: customerName },
    payment_method: "pix",
    split: [
      { recipientId: process.env.RESERVEI_RECIPIENT_ID, amount: platformAmount, liable: true, chargeProcessingFee: true },
      { recipientId: process.env.ORGANIZER_RECIPIENT_ID, amount: organizerCommissionAmount, liable: false, chargeProcessingFee: false },
    ] as SplitRule[],
    metadata: { orderId },
  };

  const res = await fetch(`${GATEWAY_API_URL}/transactions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${GATEWAY_API_KEY}` },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Falha na comunicação com o Gateway de Pagamento.");
  const data = await res.json() as { id: string; pix_qr_code: string; pix_copy_paste: string; status: string };

  return {
    success: true,
    demo: false,
    transactionId: data.id,
    pixQrCode: data.pix_qr_code,
    pixCopyPaste: data.pix_copy_paste,
    status: data.status,
    platformAmount,
    organizerAmount: organizerCommissionAmount,
    expiresAt,
  };
}

export async function checkPaymentStatus(transactionId: string): Promise<{ status: string; paid: boolean }> {
  if (IS_DEMO || transactionId.startsWith("demo-")) {
    return { status: "waiting_payment", paid: false };
  }
  const res = await fetch(`${GATEWAY_API_URL}/transactions/${transactionId}`, {
    headers: { Authorization: `Bearer ${GATEWAY_API_KEY}` },
  });
  const data = await res.json() as { status: string };
  return { status: data.status, paid: data.status === "paid" };
}
