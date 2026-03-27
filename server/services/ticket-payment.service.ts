import { calculateCartComboTotal } from "./pricing-engine";
import { lookupTicketPrice } from "./ticket-catalog";

const GATEWAY_API_URL = process.env.GATEWAY_API_URL;
const GATEWAY_API_KEY = process.env.GATEWAY_API_KEY;
const IS_DEMO = !GATEWAY_API_URL || !GATEWAY_API_KEY;

const DEMO_CONFIRM_DELAY_MS = process.env.DEMO_CONFIRM_DELAY_MS
  ? parseInt(process.env.DEMO_CONFIRM_DELAY_MS, 10)
  : null;

const DEMO_PIX_QR =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAABlBMVEX///8AAABVwtN+AAAB+klEQVR4nO2ayw7DIAxE6f9/uqcrQQiPweNJpZ6VKmxmjI0BAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgc4wxHiml9NznvPe01lprH+e9/17vvfc457z3nPe+5z3nfe9573vfe9573vfe9573vfe9773vfe9573vee/73vfe9573vee977nvfe9573vfe9773vfe9573vfe9773vfe9573vfe977nvfe9573vfe9773vfe9573vfe9773vfe977";

export interface TicketLineItem {
  ticketId: string
  quantity: number
}

export interface TicketResolvedItem {
  ticketId: string
  title: string
  quantity: number
  unitPrice: number
  originalPrice: number
}

export interface TicketCustomer {
  name: string;
  email: string;
  cpf: string;
  phone: string;
}

export interface TicketPaymentResult {
  success: boolean;
  demo: boolean;
  transactionId: string;
  qrCodeBase64: string;
  copyPasteCode: string;
  status: "PENDING" | "APPROVED" | "EXPIRED" | "FAILED" | "CANCELLED";
  totalAmount: number;
  originalTotal: number;
  totalSavings: number;
  isCombo: boolean;
  expirationDate: string;
  items: TicketResolvedItem[];
  customer: TicketCustomer;
}

export class UnknownTicketError extends Error {
  constructor(public ticketId: string) {
    super(`Ingresso não encontrado no catálogo: ${ticketId}`)
    this.name = "UnknownTicketError"
  }
}

export async function createTicketPix(
  lineItems: TicketLineItem[],
  customer: TicketCustomer
): Promise<TicketPaymentResult> {
  const resolvedItems: TicketResolvedItem[] = lineItems.map((li) => {
    const catalogEntry = lookupTicketPrice(li.ticketId)
    if (!catalogEntry) throw new UnknownTicketError(li.ticketId)
    return {
      ticketId: li.ticketId,
      title: catalogEntry.name,
      quantity: li.quantity,
      unitPrice: catalogEntry.unitPrice,
      originalPrice: catalogEntry.originalPrice,
    }
  })

  const isCombo = resolvedItems.length >= 2;
  const comboTotals = calculateCartComboTotal({
    items: resolvedItems.map((i) => ({
      unitPrice: i.unitPrice,
      originalPrice: i.originalPrice,
      quantity: i.quantity,
    })),
    comboDiscountRate: isCombo ? 0.15 : 0,
  });

  const totalAmount = isCombo ? comboTotals.comboTotal : comboTotals.originalTotal;
  const expirationDate = new Date(Date.now() + 30 * 60 * 1000).toISOString();
  const orderId = `tkt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  if (IS_DEMO) {
    const transactionId = `demo-${orderId}`;

    if (DEMO_CONFIRM_DELAY_MS && DEMO_CONFIRM_DELAY_MS > 0) {
      setTimeout(() => {
        demoAutoConfirmCallbacks.get(transactionId)?.();
        demoAutoConfirmCallbacks.delete(transactionId);
      }, DEMO_CONFIRM_DELAY_MS);
    }

    return {
      success: true,
      demo: true,
      transactionId,
      qrCodeBase64: DEMO_PIX_QR,
      copyPasteCode: `00020126580014br.gov.bcb.pix0136reservei-ingressos-${orderId}5204000053039865802BR5925${customer.name.slice(0, 25).toUpperCase()}6009CALDAS NOV62070503***6304ABCD`,
      status: "PENDING",
      totalAmount,
      originalTotal: comboTotals.originalTotal,
      totalSavings: comboTotals.totalSavings,
      isCombo,
      expirationDate,
      items: resolvedItems,
      customer,
    };
  }

  const payload = {
    items: resolvedItems.map((i) => ({
      id: i.ticketId,
      title: i.title,
      quantity: i.quantity,
      unit_price: i.unitPrice,
    })),
    customer: {
      name: customer.name,
      email: customer.email,
      document: customer.cpf,
      phone: customer.phone,
    },
    payment_method: "pix",
    metadata: { orderId, type: "ingresso" },
  };

  const res = await fetch(`${GATEWAY_API_URL}/transactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${GATEWAY_API_KEY}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Falha na comunicação com o Gateway de Pagamento.");
  const data = (await res.json()) as {
    id: string;
    pix_qr_code: string;
    pix_copy_paste: string;
    status: string;
  };

  return {
    success: true,
    demo: false,
    transactionId: data.id,
    qrCodeBase64: data.pix_qr_code,
    copyPasteCode: data.pix_copy_paste,
    status: "PENDING",
    totalAmount,
    originalTotal: comboTotals.originalTotal,
    totalSavings: comboTotals.totalSavings,
    isCombo,
    expirationDate,
    items: resolvedItems,
    customer,
  };
}

export async function checkTicketPaymentStatus(transactionId: string): Promise<{
  status: "PENDING" | "APPROVED" | "EXPIRED" | "FAILED" | "CANCELLED";
  paid: boolean;
}> {
  if (IS_DEMO || transactionId.startsWith("demo-")) {
    return { status: "PENDING", paid: false };
  }
  const res = await fetch(`${GATEWAY_API_URL}/transactions/${transactionId}`, {
    headers: { Authorization: `Bearer ${GATEWAY_API_KEY}` },
  });
  const data = (await res.json()) as { status: string };
  const paid = data.status === "paid" || data.status === "approved";
  return {
    status: paid ? "APPROVED" : data.status === "expired" ? "EXPIRED" : "PENDING",
    paid,
  };
}

export async function cancelTicketPix(transactionId: string): Promise<{ cancelled: boolean }> {
  if (transactionId.startsWith("demo-")) {
    return { cancelled: true };
  }
  if (!GATEWAY_API_URL || !GATEWAY_API_KEY) {
    return { cancelled: true };
  }
  try {
    const res = await fetch(`${GATEWAY_API_URL}/transactions/${transactionId}/cancel`, {
      method: "POST",
      headers: { Authorization: `Bearer ${GATEWAY_API_KEY}` },
    });
    return { cancelled: res.ok };
  } catch {
    return { cancelled: false };
  }
}

export const demoAutoConfirmCallbacks = new Map<string, () => void>();
