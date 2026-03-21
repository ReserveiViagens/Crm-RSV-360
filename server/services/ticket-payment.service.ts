const GATEWAY_API_URL = process.env.GATEWAY_API_URL;
const GATEWAY_API_KEY = process.env.GATEWAY_API_KEY;
const IS_DEMO = !GATEWAY_API_URL || !GATEWAY_API_KEY;

const DEMO_PIX_QR =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAABlBMVEX///8AAABVwtN+AAAB+klEQVR4nO2ayw7DIAxE6f9/uqcrQQiPweNJpZ6VKmxmjI0BAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgc4wxHiml9NznvPe01lprH+e9/17vvfc457z3nPe+5z3nfe9573vfe9573vfe9773vfe9573vfe977nvfe9573vfe9773vfe9573vfe9773vfe977nvfe9573vfe9773vfe9573vfe9773vfe9573vfe977";

export interface TicketItem {
  ticketId: string;
  title: string;
  quantity: number;
  unitPrice: number;
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
  expirationDate: string;
  items: TicketItem[];
  customer: TicketCustomer;
}

export async function createTicketPix(
  items: TicketItem[],
  customer: TicketCustomer
): Promise<TicketPaymentResult> {
  const totalAmount = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
  const expirationDate = new Date(Date.now() + 30 * 60 * 1000).toISOString();
  const orderId = `tkt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  if (IS_DEMO) {
    return {
      success: true,
      demo: true,
      transactionId: `demo-${orderId}`,
      qrCodeBase64: DEMO_PIX_QR,
      copyPasteCode: `00020126580014br.gov.bcb.pix0136reservei-ingressos-${orderId}5204000053039865802BR5925${customer.name.slice(0, 25).toUpperCase()}6009CALDAS NOV62070503***6304ABCD`,
      status: "PENDING",
      totalAmount,
      expirationDate,
      items,
      customer,
    };
  }

  const payload = {
    items: items.map((i) => ({
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
    expirationDate,
    items,
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
