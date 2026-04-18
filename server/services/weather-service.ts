import { weatherCache, type CacheMode } from "../lib/weather-cache.js";
import { geocodeCity, fetchForecast } from "../providers/open-meteo-provider.js";
import { normalizeWeather, type NormalizedWeather } from "../utils/weather-normalizer.js";

function log(msg: string) {
  const t = new Date().toLocaleTimeString("pt-BR");
  console.log(`[weather-service] ${t} ${msg}`);
}

async function fetchAndStore(
  cacheKey: "city" | "coords",
  city: string,
  country: string,
  lat?: number,
  lon?: number,
): Promise<NormalizedWeather> {
  const start = Date.now();

  let latitude: number;
  let longitude: number;
  let resolvedCity: string;
  let timezone: string;

  if (lat !== undefined && lon !== undefined) {
    latitude = lat;
    longitude = lon;
    resolvedCity = city;
    timezone = "America/Sao_Paulo";
  } else {
    const geo = await geocodeCity(city, country);
    latitude = geo.latitude;
    longitude = geo.longitude;
    resolvedCity = geo.resolvedCity;
    timezone = geo.timezone;
  }

  const payload = await fetchForecast(latitude, longitude, timezone);
  const normalized = normalizeWeather(payload, resolvedCity, country);

  const elapsed = Date.now() - start;
  log(`FETCH city="${resolvedCity}" lat=${latitude} lon=${longitude} elapsed=${elapsed}ms`);

  if (cacheKey === "city") {
    weatherCache.setByCity(city, country, normalized);
  } else {
    weatherCache.setByCoords(lat!, lon!, normalized);
  }

  return normalized;
}

export async function getWeatherByCity(
  city: string,
  country: string,
): Promise<NormalizedWeather> {
  const cached = weatherCache.getByCity(city, country);
  const mode: CacheMode = cached.mode;

  if (mode === "HIT" && cached.data) {
    log(`HIT city="${city}" country="${country}"`);
    return cached.data;
  }

  if (mode === "STALE" && cached.data) {
    log(`STALE city="${city}" country="${country}" — fetching in background`);
    fetchAndStore("city", city, country).catch((err) =>
      log(`STALE refresh failed for city="${city}": ${err.message}`),
    );
    return cached.data;
  }

  log(`MISS city="${city}" country="${country}" — fetching`);
  return fetchAndStore("city", city, country);
}

export async function getWeatherByCoords(
  lat: number,
  lon: number,
): Promise<NormalizedWeather> {
  const cached = weatherCache.getByCoords(lat, lon);
  const mode: CacheMode = cached.mode;

  if (mode === "HIT" && cached.data) {
    log(`HIT coords=${lat},${lon}`);
    return cached.data;
  }

  if (mode === "STALE" && cached.data) {
    log(`STALE coords=${lat},${lon} — fetching in background`);
    fetchAndStore("coords", `${lat},${lon}`, "BR", lat, lon).catch((err) =>
      log(`STALE refresh failed for coords=${lat},${lon}: ${err.message}`),
    );
    return cached.data;
  }

  log(`MISS coords=${lat},${lon} — fetching`);
  return fetchAndStore("coords", `${lat},${lon}`, "BR", lat, lon);
}

const DEFAULT_WARMUP_CITIES: Array<{ city: string; country: string }> = [
  { city: "Caldas Novas", country: "BR" },
  { city: "Rio Quente", country: "BR" },
];

export async function warmupCache(): Promise<{ warmed: number; failed: number }> {
  let warmed = 0;
  let failed = 0;

  for (const { city, country } of DEFAULT_WARMUP_CITIES) {
    try {
      await getWeatherByCity(city, country);
      warmed++;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      log(`warmup failed for "${city}": ${msg}`);
      failed++;
    }
  }

  log(`warmup complete: ${warmed} warmed, ${failed} failed`);
  return { warmed, failed };
}
