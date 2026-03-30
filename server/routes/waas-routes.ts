import type { Express, Request, Response, NextFunction, RequestHandler } from "express";

import {
  createExcursionGroup,
  sendTextToGroup,
  sendPollToGroup,
  getWaasStatus,
  createInstance,
  getInstanceStatus,
  getQRCode,
  deleteInstance,
  fetchAllGroups,
  handleWebhookEvent,
} from "../services/whatsapp.service";
import {
  pauseAI,
  resumeAI,
  isAIPaused,
  getHandoffInfo,
  listPausedGroups,
} from "../services/humanHandoff.service";

type RegisterWaasRoutesDeps = {
  requireAdmin: RequestHandler;
};

export function registerWaasRoutes(app: Express, deps: RegisterWaasRoutesDeps) {
  const { requireAdmin } = deps;

  app.get("/api/waas/status", requireAdmin, (_req: Request, res: Response) => {
    res.json(getWaasStatus());
  });

  app.post("/api/waas/instancia", requireAdmin, async (_req: Request, res: Response) => {
    try {
      const result = await createInstance();
      return res.json(result);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Erro interno";
      return res.status(500).json({ error: msg });
    }
  });

  app.get("/api/waas/instancia/status", requireAdmin, async (_req: Request, res: Response) => {
    try {
      const result = await getInstanceStatus();
      return res.json(result);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Erro interno";
      return res.status(500).json({ error: msg });
    }
  });

  app.get("/api/waas/instancia/qrcode", requireAdmin, async (_req: Request, res: Response) => {
    try {
      const result = await getQRCode();
      return res.json(result);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Erro interno";
      return res.status(500).json({ error: msg });
    }
  });

  app.delete("/api/waas/instancia", requireAdmin, async (_req: Request, res: Response) => {
    try {
      const result = await deleteInstance();
      return res.json(result);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Erro interno";
      return res.status(500).json({ error: msg });
    }
  });

  app.post("/api/waas/webhook", (req: Request, res: Response) => {
    const body = req.body as Record<string, unknown>;
    const rawApikey = req.headers["apikey"] || req.query["apikey"];
    const apikey = Array.isArray(rawApikey) ? rawApikey[0] : String(rawApikey || "");

    if (process.env.EVOLUTION_API_KEY && apikey !== process.env.EVOLUTION_API_KEY) {
      return res.status(401).json({ error: "Unauthorized webhook" });
    }

    const event = (body?.event as string) || "unknown";
    const data = (body?.data as Record<string, unknown>) || body;

    handleWebhookEvent(event, data);

    return res.json({ received: true });
  });

  app.get("/api/waas/grupos", requireAdmin, async (_req: Request, res: Response) => {
    try {
      const result = await fetchAllGroups();
      return res.json(result);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Erro interno";
      return res.status(500).json({ error: msg });
    }
  });

  app.post("/api/waas/criar-grupo", async (req: Request, res: Response) => {
    const { name, phone } = req.body as { name?: string; phone?: string };

    if (!name || !phone) {
      return res.status(400).json({ error: "name e phone são obrigatórios" });
    }

    try {
      const result = await createExcursionGroup(name, phone);
      return res.json(result);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Erro interno";
      return res.status(500).json({ error: msg });
    }
  });

  app.post("/api/waas/:excursaoId/mensagem", async (req: Request, res: Response) => {
    const excursaoId = String(req.params.excursaoId);
    const { text } = req.body as { text?: string };

    if (!text) {
      return res.status(400).json({ error: "text é obrigatório" });
    }

    try {
      const result = await sendTextToGroup(excursaoId, text);
      return res.json(result);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Erro interno";
      return res.status(500).json({ error: msg });
    }
  });

  app.post("/api/waas/:excursaoId/enquete", async (req: Request, res: Response) => {
    const excursaoId = String(req.params.excursaoId);
    const { question, options } = req.body as { question?: string; options?: string[] };

    if (!question || !options?.length) {
      return res.status(400).json({ error: "question e options são obrigatórios" });
    }

    try {
      const result = await sendPollToGroup(excursaoId, question, options);
      return res.json(result);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Erro interno";
      return res.status(500).json({ error: msg });
    }
  });

  app.get("/api/waas/:excursaoId/status", (req: Request, res: Response) => {
    const excursaoId = String(req.params.excursaoId);
    res.json({
      excursaoId,
      aiPaused: isAIPaused(excursaoId),
      handoff: getHandoffInfo(excursaoId),
    });
  });

  app.post("/api/handoff/:groupId/pausar", (req: Request, res: Response) => {
    const groupId = String(req.params.groupId);
    const { operatorId } = req.body as { operatorId?: string };
    const result = pauseAI(groupId, operatorId ?? "op-unknown");
    return res.json(result);
  });

  app.post("/api/handoff/:groupId/retomar", (req: Request, res: Response) => {
    const groupId = String(req.params.groupId);
    const result = resumeAI(groupId);
    return res.json(result);
  });

  app.get("/api/handoff/pausados", (_req: Request, res: Response) => {
    return res.json(listPausedGroups());
  });
}