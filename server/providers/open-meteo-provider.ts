import { type OpenMeteoForecastPayload } from "../utils/weather-normalizer.js";

const GEOCODING_BASE = "https://geocoding-api.open-meteo.com/v1";
const FORECAST_BASE = "https://api.open-meteo.com/v1";
const TIMEOUT_MS = 5000;

interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country_code: string;
  timezone: string;
}

async function fetchWithTimeout(url: string): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: controller.signal });
    return res;
  } finally {
    clearTimeout(timer);
  }
}

export async function geocodeCity(
  city: string,
  country: string,
): Promise<{ latitude: number; longitude: number; resolvedCity: string; timezone: string }> {
  const url = `${GEOCODING_BASE}/search?name=${encodeURIComponent(city)}&count=5&language=pt&format=json`;
  const res = await fetchWithTimeout(url);

  if (!res.ok) {
    throw new Error(`Open-Meteo geocoding HTTP ${res.status}`);
  }

  const json = (await res.json()) as { results?: GeocodingResult[] };

  if (!json.results || json.results.length === 0) {
    throw new Error(`Cidade não encontrada: "${city}"`);
  }

  const countryUpper = country.toUpperCase();
  const match =
    json.results.find((r) => r.country_code?.toUpperCase() === countryUpper) ??
    json.results[0];

  return {
    latitude: match.latitude,
    longitude: match.longitude,
    resolvedCity: match.name,
    timezone: match.timezone ?? "America/Sao_Paulo",
  };
}

export async function fetchForecast(
  latitude: number,
  longitude: number,
  timezone: string,
): Promise<OpenMeteoForecastPayload> {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    timezone,
    current: "temperature_2m,weather_code,wind_speed_10m",
    daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max",
    forecast_days: "3",
    wind_speed_unit: "kmh",
  });

  const url = `${FORECAST_BASE}/forecast?${params.toString()}`;
  const res = await fetchWithTimeout(url);

  if (!res.ok) {
    throw new Error(`Open-Meteo forecast HTTP ${res.status}`);
  }

  const json = (await res.json()) as OpenMeteoForecastPayload;
  return json;
}
