import { sendTextToGroup } from "./whatsapp.service.js";

export type NotificationResult = {
  success: boolean;
  channel: "whatsapp" | "email";
  error?: string;
};

function buildVoucherMessage(orderId: string, customerName: string, totalAmount: number): string {
  return (
    `🎟️ *Voucher RSV360 — Reservei Viagens*\n\n` +
    `Olá, *${customerName}*! Seu pedido foi confirmado.\n\n` +
    `📋 Pedido: \`${orderId}\`\n` +
    `💰 Total: *R$ ${totalAmount.toFixed(2).replace(".", ",")}*\n\n` +
    `📥 Faça o download do seu voucher PDF em:\n` +
    `https://reservei.com.br/ingressos/sucesso?orderId=${orderId}\n\n` +
    `Dúvidas? Fale conosco. Boas viagens! 🌴`
  );
}

export async function sendVoucherByWhatsApp(
  orderId: string,
  customerName: string,
  customerPhone: string,
  totalAmount: number
): Promise<NotificationResult> {
  try {
    const message = buildVoucherMessage(orderId, customerName, totalAmount);
    const phoneNumber = customerPhone.replace(/\D/g, "");
    await sendTextToGroup(phoneNumber + "@s.whatsapp.net", message);
    return { success: true, channel: "whatsapp" };
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : "Erro desconhecido no WhatsApp";
    console.warn(`[notification] WhatsApp falhou para orderId=${orderId}:`, error);
    return { success: false, channel: "whatsapp", error };
  }
}

export async function sendVoucherByEmail(
  orderId: string,
  customerName: string,
  customerEmail: string,
  totalAmount: number
): Promise<NotificationResult> {
  const SMTP_HOST = process.env.SMTP_HOST;
  const SMTP_USER = process.env.SMTP_USER;
  const SMTP_PASS = process.env.SMTP_PASS;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.warn(`[notification] E-mail não configurado (SMTP env vars ausentes). orderId=${orderId}`);
    return { success: false, channel: "email", error: "SMTP não configurado" };
  }

  try {
    const nodemailer = await import("nodemailer");
    const transporter = nodemailer.default.createTransport({
      host: SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT ?? "587", 10),
      secure: process.env.SMTP_SECURE === "true",
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    await transporter.sendMail({
      from: `"Reservei Viagens" <${SMTP_USER}>`,
      to: customerEmail,
      subject: `Seu voucher RSV360 — Pedido ${orderId}`,
      text: buildVoucherMessage(orderId, customerName, totalAmount).replace(/\*/g, "").replace(/`/g, ""),
      html: `
        <h2>Voucher Reservei Viagens</h2>
        <p>Olá, <strong>${customerName}</strong>! Seu pedido foi confirmado.</p>
        <p>📋 <strong>Pedido:</strong> ${orderId}</p>
        <p>💰 <strong>Total:</strong> R$ ${totalAmount.toFixed(2).replace(".", ",")}</p>
        <p>
          <a href="https://reservei.com.br/ingressos/sucesso?orderId=${orderId}" style="background:#2563EB;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;margin-top:12px;">
            📥 Baixar Voucher PDF
          </a>
        </p>
        <p style="color:#888;font-size:13px;margin-top:24px;">Boas viagens! — Equipe Reservei Viagens</p>
      `,
    });

    return { success: true, channel: "email" };
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : "Erro desconhecido no e-mail";
    console.warn(`[notification] E-mail falhou para orderId=${orderId}:`, error);
    return { success: false, channel: "email", error };
  }
}
