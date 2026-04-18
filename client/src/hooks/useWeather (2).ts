import { useState, useEffect } from "react";
import { fetchWeatherByCity, fetchWeatherByCoords, type WeatherData } from "@/services/weather-api";

interface UseWeatherCityOptions {
  mode: "city";
  city: string;
  country?: string;
}

interface UseWeatherCoordsOptions {
  mode: "coords";
  lat: number;
  lon: number;
}

export type UseWeatherOptions = UseWeatherCityOptions | UseWeatherCoordsOptions;

export interface UseWeatherResult {
  data: WeatherData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useWeather(options: UseWeatherOptions): UseWeatherResult {
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const refetch = () => setTick((t) => t + 1);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);

    const fetchData = async () => {
      try {
        let result: WeatherData;
        if (options.mode === "city") {
          result = await fetchWeatherByCity(options.city, options.country ?? "BR");
        } else {
          result = await fetchWeatherByCoords(options.lat, options.lon);
        }
        if (!cancelled) {
          setData(result);
          setError(null);
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Erro desconhecido.");
          setData(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [
    options.mode,
    options.mode === "city" ? options.city : options.lat,
    options.mode === "city" ? (options.country ?? "BR") : options.lon,
    tick,
  ]);

  return { data, loading, error, refetch };
}
