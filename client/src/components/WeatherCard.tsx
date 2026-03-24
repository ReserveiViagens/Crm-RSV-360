import { Wind, Droplets, ThermometerSun, RefreshCw, AlertCircle, Loader2 } from "lucide-react"
import { useWeather, type UseWeatherOptions } from "@/hooks/useWeather"
import { type DayForecast } from "@/services/weather-api"

interface WeatherCardProps {
  options: UseWeatherOptions
  compact?: boolean
}

function formatDay(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number)
  const d = new Date(year, month - 1, day)
  return d.toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "2-digit" })
}

function ForecastDay({ day }: { day: DayForecast }) {
  return (
    <div
      data-testid={`weather-forecast-day-${day.date}`}
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
        padding: "8px 6px",
        background: "rgba(255,255,255,0.08)",
        borderRadius: 10,
        minWidth: 0,
      }}
    >
      <span style={{ fontSize: 9, fontWeight: 600, color: "rgba(255,255,255,0.65)", letterSpacing: 0.3, textTransform: "capitalize" }}>
        {formatDay(day.date)}
      </span>
      <span style={{ fontSize: 18, lineHeight: 1 }}>{day.emoji}</span>
      <span style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>
        {day.tempMax}° / {day.tempMin}°
      </span>
      {day.precipitationProbability > 0 && (
        <span style={{ fontSize: 9, color: "#93C5FD", fontWeight: 600 }}>
          💧 {day.precipitationProbability}%
        </span>
      )}
    </div>
  )
}

function SkeletonCard() {
  return (
    <div
      data-testid="weather-card-loading"
      style={{
        background: "linear-gradient(135deg, #0C4A6E 0%, #1E40AF 100%)",
        borderRadius: 16,
        padding: "16px 18px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        color: "#fff",
        minWidth: 220,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Loader2 style={{ width: 18, height: 18, opacity: 0.6, animation: "spin 1s linear infinite" }} />
        <span style={{ fontSize: 12, opacity: 0.7 }}>Carregando clima...</span>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

function ErrorCard({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div
      data-testid="weather-card-error"
      style={{
        background: "#FEF2F2",
        border: "1px solid #FECACA",
        borderRadius: 16,
        padding: "14px 16px",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        minWidth: 220,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <AlertCircle style={{ width: 16, height: 16, color: "#EF4444", flexShrink: 0 }} />
        <span style={{ fontSize: 12, color: "#B91C1C", fontWeight: 600 }}>Clima indisponível</span>
      </div>
      <span style={{ fontSize: 11, color: "#DC2626", lineHeight: 1.4 }}>{message}</span>
      <button
        data-testid="weather-card-retry"
        onClick={onRetry}
        style={{
          display: "inline-flex", alignItems: "center", gap: 5,
          padding: "5px 10px", border: "1px solid #FECACA",
          borderRadius: 7, background: "#FFF1F2", color: "#DC2626",
          fontSize: 11, fontWeight: 600, cursor: "pointer",
          width: "fit-content",
        }}
      >
        <RefreshCw style={{ width: 11, height: 11 }} />
        Tentar novamente
      </button>
    </div>
  )
}

export function WeatherCard({ options, compact = false }: WeatherCardProps) {
  const { data, loading, error, refetch } = useWeather(options)

  if (loading) return <SkeletonCard />
  if (error || !data) return <ErrorCard message={error ?? "Dados não disponíveis."} onRetry={refetch} />

  return (
    <div
      data-testid="weather-card"
      style={{
        background: "linear-gradient(135deg, #0C4A6E 0%, #1E40AF 100%)",
        borderRadius: 16,
        padding: compact ? "12px 14px" : "16px 18px",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        boxShadow: "0 4px 20px rgba(12,74,110,0.35)",
        minWidth: 220,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{
        position: "absolute", top: -20, right: -20,
        width: 90, height: 90, borderRadius: "50%",
        background: "rgba(255,255,255,0.05)",
        pointerEvents: "none",
      }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div
            data-testid="weather-card-city"
            style={{ fontSize: 13, fontWeight: 700, letterSpacing: 0.3, opacity: 0.9 }}
          >
            📍 {data.city}
          </div>
          <div style={{ fontSize: 10, opacity: 0.6, marginTop: 1 }}>
            {data.country} • atualizado às {new Date(data.fetchedAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
          </div>
        </div>
        <button
          data-testid="weather-card-refresh"
          onClick={refetch}
          title="Atualizar clima"
          style={{
            background: "rgba(255,255,255,0.12)",
            border: "none",
            borderRadius: 8,
            width: 28, height: 28,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", color: "rgba(255,255,255,0.7)",
            flexShrink: 0,
          }}
        >
          <RefreshCw style={{ width: 12, height: 12 }} />
        </button>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 42, lineHeight: 1 }} data-testid="weather-card-emoji">
          {data.emoji}
        </span>
        <div>
          <div
            data-testid="weather-card-temp"
            style={{ fontSize: 36, fontWeight: 800, lineHeight: 1 }}
          >
            {data.currentTemp}°C
          </div>
          <div
            data-testid="weather-card-label"
            style={{ fontSize: 12, opacity: 0.8, marginTop: 2 }}
          >
            {data.label}
          </div>
        </div>
      </div>

      <div style={{
        display: "flex", gap: 12, padding: "8px 10px",
        background: "rgba(255,255,255,0.10)",
        borderRadius: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }} data-testid="weather-card-wind">
          <Wind style={{ width: 13, height: 13, opacity: 0.75, flexShrink: 0 }} />
          <span style={{ fontSize: 11, fontWeight: 600 }}>{data.windSpeed} km/h</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }} data-testid="weather-card-precip">
          <Droplets style={{ width: 13, height: 13, opacity: 0.75, flexShrink: 0 }} />
          <span style={{ fontSize: 11, fontWeight: 600 }}>{data.precipitationProbability}% chuva</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }} data-testid="weather-card-minmax">
          <ThermometerSun style={{ width: 13, height: 13, opacity: 0.75, flexShrink: 0 }} />
          <span style={{ fontSize: 11, fontWeight: 600 }}>{data.tempMax}° / {data.tempMin}°</span>
        </div>
      </div>

      {!compact && data.forecast.length > 0 && (
        <div data-testid="weather-card-forecast" style={{ display: "flex", gap: 6 }}>
          {data.forecast.map((day) => (
            <ForecastDay key={day.date} day={day} />
          ))}
        </div>
      )}
    </div>
  )
}
