export interface DayForecast {
  date: string;
  weatherCode: number;
  label: string;
  emoji: string;
  tempMax: number;
  tempMin: number;
  precipitationMm: number;
  precipitationProbability: number;
}

export interface WeatherData {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
  currentTemp: number;
  weatherCode: number;
  label: string;
  emoji: string;
  windSpeed: number;
  tempMax: number;
  tempMin: number;
  precipitationProbability: number;
  forecast: DayForecast[];
  fetchedAt: string;
}

export interface WeatherErrorResponse {
  error: true;
  message: string;
}

async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url);
  const json = await res.json();
  if (!res.ok || (json as WeatherErrorResponse).error) {
    throw new Error((json as WeatherErrorResponse).message ?? `HTTP ${res.status}`);
  }
  return json as T;
}

export async function fetchWeatherByCity(
  city: string,
  country = "BR",
): Promise<WeatherData> {
  const params = new URLSearchParams({ city, country });
  return fetchJSON<WeatherData>(`/api/weather?${params.toString()}`);
}

export async function fetchWeatherByCoords(
  lat: number,
  lon: number,
): Promise<WeatherData> {
  const params = new URLSearchParams({ lat: String(lat), lon: String(lon) });
  return fetchJSON<WeatherData>(`/api/weather/by-coords?${params.toString()}`);
}
