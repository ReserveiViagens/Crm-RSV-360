import { Router, type Request, type Response } from "express";
import { z } from "zod";
import {
  createOfferRule,
  deleteOfferRule,
  getAuctionOverlay,
  getWizardRulesForAuction,
  getWizardRulesForFlashDeal,
  listOfferRules,
  listFlashDealOverlays,
  updateOfferRule,
  upsertAuctionOverlay,
  upsertFlashDealOverlay,
} from "../services/offers-cms.service.js";
import {
  fetchActiveAuctionsFromRsv360,
  fetchAuctionDetailFromRsv360,
  isRsv360AuctionsEnabled,
} from "../services/rsv360-auctions.service.js";
import { listFlashDealsForAdmin } from "../services/flash-deals.service.js";

const router = Router();

const ruleBodySchema = z.object({
  scope: z.enum(["global", "auction", "flash_deal", "hotel"]),
  targetId: z.string().optional(),
  category: z.enum(["regras", "hotel", "politicas", "sem_reembolso"]),
  title: z.string().min(2).max(200),
  body: z.string().min(5).max(5000),
  sortOrder: z.number().int().optional(),
  active: z.boolean().optional(),
});

const auctionOverlaySchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  location: z.string().optional(),
  category: z.string().optional(),
  image: z.string().url().optional().or(z.literal("")),
  tags: z.array(z.string()).optional(),
  rating: z.number().min(0).max(5).optional(),
  hotelName: z.string().optional(),
  hotelKey: z.string().optional(),
});

const flashOverlaySchema = z.object({
  title: z.string().optional(),
  location: z.string().optional(),
  originalPrice: z.number().optional(),
  price: z.number().optional(),
  discount: z.number().optional(),
  image: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  description: z.string().optional(),
  hotelKey: z.string().optional(),
});

router.get("/rules", (_req: Request, res: Response) => {
  return res.json({ success: true, data: listOfferRules() });
});

router.post("/rules", async (req: Request, res: Response) => {
  const parsed = ruleBodySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      error: parsed.error.errors[0]?.message ?? "Dados inválidos",
    });
  }
  const created = await createOfferRule(parsed.data);
  return res.status(201).json({ success: true, data: created });
});

router.patch("/rules/:id", async (req: Request, res: Response) => {
  const parsed = ruleBodySchema.partial().safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      error: parsed.error.errors[0]?.message ?? "Dados inválidos",
    });
  }
  const updated = await updateOfferRule(String(req.params.id), parsed.data);
  if (!updated) {
    return res.status(404).json({ success: false, error: "Regra não encontrada" });
  }
  return res.json({ success: true, data: updated });
});

router.delete("/rules/:id", async (req: Request, res: Response) => {
  const removed = await deleteOfferRule(String(req.params.id));
  if (!removed) {
    return res.status(404).json({ success: false, error: "Regra não encontrada" });
  }
  return res.json({ success: true });
});

router.get("/auctions", async (_req: Request, res: Response) => {
  if (!isRsv360AuctionsEnabled()) {
    return res.status(503).json({ success: false, error: "Proxy RSV360 desativado" });
  }
  try {
    const cards = await fetchActiveAuctionsFromRsv360();
    const enriched = cards.map((card) => ({
      ...card,
      overlay: getAuctionOverlay(card.id) ?? null,
    }));
    return res.json({ success: true, data: enriched });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao listar leilões";
    return res.status(502).json({ success: false, error: message });
  }
});

router.get("/auctions/:id", async (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id), 10);
  if (!Number.isFinite(id)) {
    return res.status(400).json({ success: false, error: "ID inválido" });
  }
  if (!isRsv360AuctionsEnabled()) {
    return res.status(503).json({ success: false, error: "Proxy RSV360 desativado" });
  }
  try {
    const card = await fetchAuctionDetailFromRsv360(id);
    if (!card) {
      return res.status(404).json({ success: false, error: "Leilão não encontrado" });
    }
    return res.json({
      success: true,
      data: { ...card, overlay: getAuctionOverlay(id) ?? null },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao buscar leilão";
    return res.status(502).json({ success: false, error: message });
  }
});

router.put("/auctions/:id/overlay", async (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id), 10);
  if (!Number.isFinite(id)) {
    return res.status(400).json({ success: false, error: "ID inválido" });
  }
  const parsed = auctionOverlaySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      error: parsed.error.errors[0]?.message ?? "Dados inválidos",
    });
  }
  const overlay = await upsertAuctionOverlay(id, parsed.data);
  return res.json({ success: true, data: overlay });
});

router.get("/flash-deals", (_req: Request, res: Response) => {
  return res.json({ success: true, data: listFlashDealsForAdmin() });
});

router.get("/flash-deals/overlays", (_req: Request, res: Response) => {
  return res.json({ success: true, data: listFlashDealOverlays() });
});

router.put("/flash-deals/:id/overlay", async (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id), 10);
  if (!Number.isFinite(id)) {
    return res.status(400).json({ success: false, error: "ID inválido" });
  }
  const parsed = flashOverlaySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      error: parsed.error.errors[0]?.message ?? "Dados inválidos",
    });
  }
  const overlay = await upsertFlashDealOverlay(id, parsed.data);
  return res.json({ success: true, data: overlay });
});

export default router;

/** Rotas públicas de regras do wizard — montadas em /api/leiloes */
export function registerPublicOfferRulesRoutes(app: import("express").Express): void {
  app.get("/api/leiloes/rules", (req, res) => {
    const auctionId = req.query.auctionId ? parseInt(String(req.query.auctionId), 10) : undefined;
    const flashDealId = req.query.flashDealId
      ? parseInt(String(req.query.flashDealId), 10)
      : undefined;
    const hotelKey = typeof req.query.hotelKey === "string" ? req.query.hotelKey : undefined;

    if (flashDealId && Number.isFinite(flashDealId)) {
      return res.json({
        success: true,
        data: getWizardRulesForFlashDeal(flashDealId, hotelKey),
      });
    }

    if (!auctionId || !Number.isFinite(auctionId)) {
      return res.status(400).json({ success: false, error: "auctionId ou flashDealId obrigatório" });
    }

    return res.json({
      success: true,
      data: getWizardRulesForAuction(auctionId, hotelKey),
    });
  });
}
