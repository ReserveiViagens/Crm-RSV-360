export interface WeatherCodeInfo {
  label: string;
  emoji: string;
  group: "clear" | "cloudy" | "fog" | "drizzle" | "rain" | "snow" | "thunder";
}

const WEATHER_CODE_MAP: Record<number, WeatherCodeInfo> = {
  0:  { label: "Céu limpo",              emoji: "☀️",  group: "clear" },
  1:  { label: "Predominantly clear",    emoji: "🌤️", group: "clear" },
  2:  { label: "Parcialmente nublado",   emoji: "⛅",  group: "cloudy" },
  3:  { label: "Nublado",                emoji: "☁️",  group: "cloudy" },
  45: { label: "Neblina",                emoji: "🌫️", group: "fog" },
  48: { label: "Neblina com gelo",        emoji: "🌫️", group: "fog" },
  51: { label: "Garoa leve",             emoji: "🌦️", group: "drizzle" },
  53: { label: "Garoa moderada",         emoji: "🌦️", group: "drizzle" },
  55: { label: "Garoa intensa",          emoji: "🌦️", group: "drizzle" },
  61: { label: "Chuva leve",             emoji: "🌧️", group: "rain" },
  63: { label: "Chuva moderada",         emoji: "🌧️", group: "rain" },
  65: { label: "Chuva intensa",          emoji: "🌧️", group: "rain" },
  71: { label: "Neve leve",              emoji: "🌨️", group: "snow" },
  73: { label: "Neve moderada",          emoji: "🌨️", group: "snow" },
  75: { label: "Neve intensa",           emoji: "❄️",  group: "snow" },
  77: { label: "Grãos de neve",          emoji: "🌨️", group: "snow" },
  80: { label: "Pancadas de chuva leve", emoji: "🌦️", group: "rain" },
  81: { label: "Pancadas de chuva",      emoji: "🌧️", group: "rain" },
  82: { label: "Pancadas fortes",        emoji: "⛈️",  group: "rain" },
  85: { label: "Pancadas de neve",       emoji: "🌨️", group: "snow" },
  86: { label: "Pancadas de neve fortes",emoji: "❄️",  group: "snow" },
  95: { label: "Tempestade",             emoji: "⛈️",  group: "thunder" },
  96: { label: "Tempestade com granizo", emoji: "⛈️",  group: "thunder" },
  99: { label: "Tempestade intensa",     emoji: "⛈️",  group: "thunder" },
};

export function getWeatherInfo(code: number): WeatherCodeInfo {
  return (
    WEATHER_CODE_MAP[code] ?? {
      label: "Condição desconhecida",
      emoji: "🌡️",
      group: "clear",
    }
  );
}
