export interface CityQueryParams {
  city: string;
  country: string;
}

export interface CoordsQueryParams {
  lat: number;
  lon: number;
}

export interface ValidationError {
  valid: false;
  message: string;
}

export interface ValidationOk<T> {
  valid: true;
  data: T;
}

export type ValidationResult<T> = ValidationError | ValidationOk<T>;

export function validateCityQuery(
  raw: Record<string, unknown>,
): ValidationResult<CityQueryParams> {
  const city = typeof raw.city === "string" ? raw.city.trim() : "";
  const country = typeof raw.country === "string" ? raw.country.trim().toUpperCase() : "BR";

  if (!city) {
    return { valid: false, message: "Parâmetro 'city' é obrigatório." };
  }
  if (city.length > 100) {
    return { valid: false, message: "Parâmetro 'city' muito longo." };
  }
  if (country.length > 10) {
    return { valid: false, message: "Parâmetro 'country' muito longo." };
  }

  return { valid: true, data: { city, country } };
}

export function validateCoordsQuery(
  raw: Record<string, unknown>,
): ValidationResult<CoordsQueryParams> {
  const latRaw = parseFloat(String(raw.lat ?? ""));
  const lonRaw = parseFloat(String(raw.lon ?? ""));

  if (isNaN(latRaw) || latRaw < -90 || latRaw > 90) {
    return { valid: false, message: "Parâmetro 'lat' inválido. Deve ser entre -90 e 90." };
  }
  if (isNaN(lonRaw) || lonRaw < -180 || lonRaw > 180) {
    return { valid: false, message: "Parâmetro 'lon' inválido. Deve ser entre -180 e 180." };
  }

  return { valid: true, data: { lat: latRaw, lon: lonRaw } };
}
