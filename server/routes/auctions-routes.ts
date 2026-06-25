import { type Express, type Request, type Response } from "express";
import {
  fetchActiveAuctionsFromRsv360,
  fetchAuctionDetailFromRsv360,
  isRsv360AuctionsEnabled,
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
}
