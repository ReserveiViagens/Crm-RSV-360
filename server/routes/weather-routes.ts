import { type Express, type Request, type Response } from "express";
import { validateCityQuery, validateCoordsQuery } from "../utils/weather-validators.js";
import {
  getWeatherByCity,
  getWeatherByCoords,
  warmupCache,
} from "../services/weather-service.js";

export function registerWeatherRoutes(app: Express): void {
  app.get("/api/weather", async (req: Request, res: Response) => {
    const validation = validateCityQuery(req.query as Record<string, unknown>);
    if (!validation.valid) {
      return res.status(400).json({ error: true, message: validation.message });
    }

    const { city, country } = validation.data;

    try {
      const data = await getWeatherByCity(city, country);
      return res.json(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro ao buscar previsão do tempo.";
      return res.status(502).json({ error: true, message });
    }
  });

  app.get("/api/weather/by-coords", async (req: Request, res: Response) => {
    const validation = validateCoordsQuery(req.query as Record<string, unknown>);
    if (!validation.valid) {
      return res.status(400).json({ error: true, message: validation.message });
    }

    const { lat, lon } = validation.data;

    try {
      const data = await getWeatherByCoords(lat, lon);
      return res.json(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro ao buscar previsão do tempo.";
      return res.status(502).json({ error: true, message });
    }
  });

  app.post("/internal/weather/warmup", async (_req: Request, res: Response) => {
    try {
      const result = await warmupCache();
      return res.json({ ok: true, ...result });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro ao pré-aquecer o cache.";
      return res.status(500).json({ error: true, message });
    }
  });
}
