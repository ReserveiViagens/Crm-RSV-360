import type { Express, Request, Response } from "express";
import { timingSafeEqual } from "crypto";

import { storage } from "../storage";
import { mutateDb } from "../persistence";
import { emitEstadoGrupo } from "../socket";
import { sendPaymentConfirmation } from "../services/whatsapp.service";
import { createSplitPaymentPix, checkPaymentStatus } from "../services/payment.service";
import { adicionarPontos } from "../services/gamification-service";

export function registerPaymentRoutes(app: Express) {
  app.post("/api/pagamento/gerar-pix", async (req: Request, res: Response) => {
    const { excursaoId, amount, passengerName, organizerCommission } = req.body as {
      excursaoId?: string;
      amount?: number;
      passengerName?: string;
      organizerCommission?: number;
    };

    if (!excursaoId || !amount || !passengerName) {
      return res.status(400).json({
        error: "excursaoId, amount e passengerName são obrigatórios",
      });
    }

    try {
      const result = await createSplitPaymentPix(
        amount,
        excursaoId,
        passengerName,
        organizerCommission ?? 0
      );
      return res.json(result);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Erro interno";
      return res.status(500).json({ error: msg });
    }
  });

  app.get("/api/pagamento/status/:transactionId", async (req: Request, res: Response) => {
    const transactionId = String(req.params.transactionId);

    try {
      const result = await checkPaymentStatus(transactionId);
      return res.json(result);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Erro interno";
      return res.status(500).json({ error: msg });
    }
  });

  app.post("/api/webhook/payment", async (req: Request, res: Response) => {
    const webhookSecret = process.env.WEBHOOK_PAYMENT_SECRET;

    if (webhookSecret) {
      const provided = req.headers["x-webhook-secret"] as string | undefined;

      if (!provided || provided.length !== webhookSecret.length) {
        return res.status(401).json({ error: "Unauthorized: invalid webhook secret" });
      }

      const a = Buffer.from(provided, "utf8");
      const b = Buffer.from(webhookSecret, "utf8");

      if (!timingSafeEqual(a, b)) {
        return res.status(401).json({ error: "Unauthorized: invalid webhook secret" });
      }
    } else if (process.env.NODE_ENV === "production") {
      console.error("[Webhook] WEBHOOK_PAYMENT_SECRET not configured in production — rejecting request");
      return res.status(500).json({ error: "Webhook not configured" });
    }

    const { event, data } = req.body as {
      event?: string;
      data?: {
        id: string;
        metadata?: { orderId?: string; userId?: string };
        customer?: { name: string };
        amount?: number;
      };
    };

    if (event === "transaction.paid" && data) {
      const transactionId = data.id;

      const alreadyProcessed = await mutateDb((db) => {
        if (!db.processedTransactions) db.processedTransactions = {};
        const processed = db.processedTransactions as Record<string, boolean>;

        if (processed[transactionId]) return true;

        processed[transactionId] = true;
        return false;
      });

      if (alreadyProcessed) {
        return res.json({ received: true, duplicate: true });
      }

      const excursaoId = data.metadata?.orderId ?? "";
      const rawName = data.customer?.name ?? "Passageiro";
      const passengerName = rawName.trim();
      const amount = (data.amount ?? 0) / 100;

      await sendPaymentConfirmation(excursaoId, passengerName, amount).catch(() => {});
      emitEstadoGrupo(excursaoId, {
        type: "pagamento_confirmado",
        transactionId,
        passengerName,
        amount,
      });

      await mutateDb((db) => {
        db.gamificationExtraSeats = ((db.gamificationExtraSeats as number) ?? 0) + 1;
      });

      const pontos = Math.round(amount);
      if (pontos > 0) {
        let userFound;

        if (data.metadata?.userId) {
          userFound = await storage.getUser(data.metadata.userId).catch(() => undefined);
        }

        if (!userFound) {
          userFound = await storage.getUserByNome(passengerName).catch(() => undefined);
        }

        if (userFound) {
          await adicionarPontos(
            userFound.id,
            pontos,
            "Pagamento PIX — Excursão"
          ).catch((e) => console.error("[Gamification] Falha ao adicionar pontos:", e));
        } else {
          console.warn(
            `[Gamification] Usuário não encontrado para passageiro "${passengerName}" (txn: ${transactionId}). Pontos não foram atribuídos.`
          );
        }
      }
    }

    return res.json({ received: true });
  });
}