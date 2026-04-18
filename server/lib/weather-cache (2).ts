import { type NormalizedWeather } from "../utils/weather-normalizer.js";

const TTL_MS = 60 * 60 * 1000;
const STALE_WINDOW_MS = 6 * 60 * 60 * 1000;

interface CacheEntry {
  data: NormalizedWeather;
  cachedAt: number;
}

export type CacheMode = "HIT" | "MISS" | "STALE";

export interface CacheGetResult {
  data: NormalizedWeather | null;
  mode: CacheMode;
}

export class WeatherCache {
  private readonly store = new Map<string, CacheEntry>();

  private cityKey(city: string, country: string): string {
    return `weather:city:${city.toLowerCase()}:${country.toLowerCase()}`;
  }

  private coordsKey(lat: number, lon: number): string {
    const rLat = Math.round(lat * 100) / 100;
    const rLon = Math.round(lon * 100) / 100;
    return `weather:coords:${rLat}:${rLon}`;
  }

  private get(key: string): CacheGetResult {
    const entry = this.store.get(key);
    if (!entry) return { data: null, mode: "MISS" };

    const age = Date.now() - entry.cachedAt;
    if (age <= TTL_MS) return { data: entry.data, mode: "HIT" };
    if (age <= STALE_WINDOW_MS) return { data: entry.data, mode: "STALE" };

    this.store.delete(key);
    return { data: null, mode: "MISS" };
  }

  private set(key: string, data: NormalizedWeather): void {
    this.store.set(key, { data, cachedAt: Date.now() });
  }

  getByCity(city: string, country: string): CacheGetResult {
    return this.get(this.cityKey(city, country));
  }

  setByCity(city: string, country: string, data: NormalizedWeather): void {
    this.set(this.cityKey(city, country), data);
  }

  getByCoords(lat: number, lon: number): CacheGetResult {
    return this.get(this.coordsKey(lat, lon));
  }

  setByCoords(lat: number, lon: number, data: NormalizedWeather): void {
    this.set(this.coordsKey(lat, lon), data);
  }

  size(): number {
    return this.store.size;
  }

  clear(): void {
    this.store.clear();
  }
}

export const weatherCache = new WeatherCache();
