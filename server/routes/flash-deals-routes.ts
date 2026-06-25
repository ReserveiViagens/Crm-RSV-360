import type { Express } from "express";
import { listFlashDealsWithOverlays } from "../services/flash-deals.service.js";

export function registerFlashDealsRoutes(app: Express): void {
  app.get("/api/flash-deals", (_req, res) => {
    return res.json({ success: true, data: listFlashDealsWithOverlays() });
  });
}
