# 05_prompt-final-cursor.md
## Projeto: Módulo de Previsão do Tempo com Open-Meteo
## Versão: 4.0
## Data: 2026-03-24

---

# Prompt final para execução no Cursor

Implemente um módulo completo de previsão do tempo usando **Open-Meteo** como provider principal.

## Objetivo
Criar uma integração barata, robusta, desacoplada e pronta para produção, usando backend Express e frontend React.

## Regra arquitetural máxima
O frontend **não pode** consumir Open-Meteo diretamente.

Toda consulta deve seguir:

```text
Frontend -> API interna -> Serviço -> Cache -> Provider Open-Meteo
```

---

# Restrições obrigatórias

- não chamar Open-Meteo em componente React
- não repassar payload bruto do provider ao frontend
- não concentrar toda lógica na route
- não implementar sem cache
- não ignorar timeout externo
- não deixar sem fallback stale
- não expor stack trace ao cliente
- não acoplar UI ao modelo bruto da API externa

---

# Arquivos que devem existir

## Backend
- `server/utils/weather-code-map.js`
- `server/utils/weather-normalizer.js`
- `server/utils/weather-validators.js`
- `server/lib/weather-cache.js`
- `server/providers/open-meteo-provider.js`
- `server/services/weather-service.js`
- `server/routes/weather-routes.js`

## Alteração obrigatória
- registrar rotas em `server/app.js`

## Frontend
- `client/src/services/weather-api.js`
- `client/src/hooks/useWeather.js`
- `client/src/components/WeatherCard.jsx`

## Opcionais
- `client/src/components/WeatherForecastList.jsx`
- `client/src/types/weather.ts`

---

# Endpoints obrigatórios

## Por cidade
```http
GET /api/weather?city=Caldas%20Novas&country=BR
```

## Por coordenadas
```http
GET /api/weather/by-coords?lat=-17.7445&lon=-48.6250
```

## Warmup interno
```http
POST /internal/weather/warmup
```

---

# Contrato JSON obrigatório

```json
{
  "location": {
    "name": "Caldas Novas",
    "state": "Goiás",
    "country": "Brazil",
    "latitude": -17.7445,
    "longitude": -48.6250
  },
  "current": {
    "temperature": 28.4,
    "windSpeed": 12.1,
    "weatherCode": 1,
    "label": "Poucas nuvens"
  },
  "today": {
    "min": 21.2,
    "max": 30.8,
    "rainProbability": 35,
    "precipitation": 1.4
  },
  "daily": [
    {
      "date": "2026-03-24",
      "min": 21.2,
      "max": 30.8,
      "weatherCode": 1,
      "rainProbability": 35,
      "precipitation": 1.4
    }
  ],
  "updatedAt": "2026-03-24T13:00:00Z",
  "cacheTtlMinutes": 60
}
```

---

# Regras obrigatórias de implementação

## Cache
- TTL de 60 minutos
- stale de 6 horas
- chave por cidade
- chave por coordenadas

## Provider
- isolar Open-Meteo em provider próprio
- implementar geocoding
- implementar forecast
- aplicar timeout externo entre 4 e 6 segundos

## Service
- orquestrar cache + provider + normalização
- implementar `getWeatherByCity`
- implementar `getWeatherByCoords`

## Rota
- validar entradas
- responder com status HTTP correto
- usar resposta JSON padronizada
- manter rota fina

## UI
- criar `WeatherCard`
- exibir temperatura atual
- exibir label
- exibir máxima/mínima
- exibir chuva
- exibir vento
- exibir 3 dias de previsão
- tratar loading e erro

---

# Ordem obrigatória de execução

1. criar `weather-code-map.js`
2. criar `weather-normalizer.js`
3. criar `weather-validators.js`
4. criar `weather-cache.js`
5. criar `open-meteo-provider.js`
6. criar `weather-service.js`
7. criar `weather-routes.js`
8. registrar rotas em `server/app.js`
9. criar `weather-api.js`
10. criar `useWeather.js`
11. criar `WeatherCard.jsx`
12. testar cenários principais

---

# Cenários mínimos que devem funcionar

## Backend
- cidade válida
- cidade inválida
- city ausente
- country ausente
- coordenadas válidas
- coordenadas inválidas
- cache HIT
- cache MISS
- fallback STALE
- erro externo sem cache

## Frontend
- loading
- erro
- sucesso
- troca de cidade

---

# Critérios de aceite

- frontend não consome provider externo
- provider está isolado
- service está isolado
- cache está isolado
- normalizador existe
- validadores existem
- `/api/weather` funciona
- `/api/weather/by-coords` funciona
- `WeatherCard` funciona
- payload enviado ao frontend é estável
- solução é extensível para Redis e múltiplos providers

---

# Anti-patterns proibidos

- fetch externo no React
- payload bruto da API externa no componente
- rota com lógica excessiva
- ausência de cache
- ausência de timeout
- ausência de fallback stale
- ausência de mapeamento legível de weather code

---

# Resultado esperado

Ao final, o repositório deve conter uma implementação modular, clara e pronta para crescer, com:

- backend desacoplado
- frontend limpo
- integração barata
- baixo retrabalho futuro
- base pronta para produção

---
