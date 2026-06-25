import { type Express, type Request, type Response } from "express";
import {
  fetchActiveAuctionsFromRsv360,
  fetchAuctionDetailFromRsv360,
  isRsv360AuctionsEnabled,
  obtainRsv360AccessTokenForBids,
  placeBidOnRsv360,
} from "../services/rsv360-auctions.service.js";
import { logger } from "../lib/logger.js";

export function registerAuctionsRoutes(app: Express): void {
  app.get("/api/leiloes", async (_req: Request, res: Response) => {
    if (!isRsv360AuctionsEnabled()) {
      return res.status(503).json({
        success: false,
        error: "Proxy de leilões desativado (USE_RSV360_AUCTIONS=false).",
      });
    }

    try {
      const data = await fetchActiveAuctionsFromRsv360();
      return res.json({
        success: true,
        source: "rsv360",
        data,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao buscar leilões.";
      logger.warn(`[api/leiloes] ${message}`);
      return res.status(502).json({
        success: false,
        error: "Serviço de leilões temporariamente indisponível.",
        detail: process.env.NODE_ENV === "development" ? message : undefined,
      });
    }
  });

  app.get("/api/leiloes/:id", async (req: Request, res: Response) => {
    const id = parseInt(String(req.params.id), 10);
    if (!Number.isFinite(id)) {
      return res.status(400).json({ success: false, error: "ID inválido" });
    }

    if (!isRsv360AuctionsEnabled()) {
      return res.status(503).json({
        success: false,
        error: "Proxy de leilões desativado (USE_RSV360_AUCTIONS=false).",
      });
    }

    try {
      const data = await fetchAuctionDetailFromRsv360(id);
      if (!data) {
        return res.status(404).json({ success: false, error: "Leilão não encontrado" });
      }
      return res.json({ success: true, source: "rsv360", data });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao buscar leilão.";
      logger.warn(`[api/leiloes/${id}] ${message}`);
      return res.status(502).json({
        success: false,
        error: "Serviço de leilões temporariamente indisponível.",
        detail: process.env.NODE_ENV === "development" ? message : undefined,
      });
    }
  });

  app.post("/api/leiloes/:id/bids", async (req: Request, res: Response) => {
    if (!req.session.userId) {
      return res.status(401).json({
        success: false,
        error: "Login necessário para dar lance.",
      });
    }

    const id = parseInt(String(req.params.id), 10);
    if (!Number.isFinite(id)) {
      return res.status(400).json({ success: false, error: "ID inválido" });
    }

    const amount = Number(req.body?.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({ success: false, error: "Valor de lance inválido" });
    }

    if (!isRsv360AuctionsEnabled()) {
      return res.status(503).json({
        success: false,
        error: "Proxy de leilões desativado (USE_RSV360_AUCTIONS=false).",
      });
    }

    try {
      const token = await obtainRsv360AccessTokenForBids();
      const bid = await placeBidOnRsv360(id, amount, token);
      return res.status(201).json({
        success: true,
        source: "rsv360",
        data: bid,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao registrar lance.";
      logger.warn(`[api/leiloes/${id}/bids] ${message}`);
      return res.status(502).json({
        success: false,
        error: "Não foi possível registrar o lance. Tente novamente.",
        detail: process.env.NODE_ENV === "development" ? message : undefined,
      });
    }
  });
}
