import { getWeatherInfo } from "./weather-code-map.js";

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

export interface NormalizedWeather {
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

export interface OpenMeteoCurrentResponse {
  temperature_2m: number;
  weather_code: number;
  wind_speed_10m: number;
}

export interface OpenMeteoDailyResponse {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_sum: number[];
  precipitation_probability_max: number[];
}

export interface OpenMeteoHourlyResponse {
  time: string[];
  temperature_2m: number[];
  precipitation_probability: number[];
  precipitation: number[];
}

export interface OpenMeteoForecastPayload {
  latitude: number;
  longitude: number;
  timezone: string;
  current: OpenMeteoCurrentResponse;
  daily: OpenMeteoDailyResponse;
  hourly: OpenMeteoHourlyResponse;
}

export function normalizeWeather(
  payload: OpenMeteoForecastPayload,
  city: string,
  country: string,
): NormalizedWeather {
  const { current, daily } = payload;

  const currentInfo = getWeatherInfo(current.weather_code);

  const forecastDays = Math.min(daily.time.length, 3);
  const forecast: DayForecast[] = [];

  for (let i = 0; i < forecastDays; i++) {
    const code = daily.weather_code[i] ?? 0;
    const info = getWeatherInfo(code);
    forecast.push({
      date: daily.time[i],
      weatherCode: code,
      label: info.label,
      emoji: info.emoji,
      tempMax: Math.round(daily.temperature_2m_max[i] ?? 0),
      tempMin: Math.round(daily.temperature_2m_min[i] ?? 0),
      precipitationMm: Math.round((daily.precipitation_sum[i] ?? 0) * 10) / 10,
      precipitationProbability: daily.precipitation_probability_max[i] ?? 0,
    });
  }

  const todayMax = daily.temperature_2m_max[0] ?? current.temperature_2m;
  const todayMin = daily.temperature_2m_min[0] ?? current.temperature_2m;
  const todayPrecipProb = daily.precipitation_probability_max[0] ?? 0;

  return {
    city,
    country,
    latitude: payload.latitude,
    longitude: payload.longitude,
    timezone: payload.timezone,
    currentTemp: Math.round(current.temperature_2m),
    weatherCode: current.weather_code,
    label: currentInfo.label,
    emoji: currentInfo.emoji,
    windSpeed: Math.round(current.wind_speed_10m),
    tempMax: Math.round(todayMax),
    tempMin: Math.round(todayMin),
    precipitationProbability: todayPrecipProb,
    forecast,
    fetchedAt: new Date().toISOString(),
  };
}
