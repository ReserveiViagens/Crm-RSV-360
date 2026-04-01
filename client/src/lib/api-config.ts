/**
 * API Configuration for Frontend
 * 
 * Define a URL base da API conforme o ambiente.
 * O Vercel reescreve /api/* para o backend externo
 * automaticamente via vercel.json
 */

export const API_CONFIG = {
  // Durante deploy no Vercel, /api/* é reescrito para o backend externo
  // Durante desenvolvimento local, as chamadas vão para localhost:5000
  BASE_URL: process.env.VITE_API_BASE_URL || "/api",
  
  // Timeout padrão para requests
  TIMEOUT: 30000,
  
  // Headers padrão
  HEADERS: {
    "Content-Type": "application/json",
  },
};

/**
 * Utility para criar URL completa de API
 */
export function getApiUrl(endpoint: string): string {
  // Remove leading slash se existir
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${API_CONFIG.BASE_URL}${cleanEndpoint}`;
}

/**
 * Utility para fetch com config padrão
 */
export async function apiFetch(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const url = getApiUrl(endpoint);
  
  const response = await fetch(url, {
    headers: {
      ...API_CONFIG.HEADERS,
      ...options.headers,
    },
    ...options,
  });

  return response;
}

/**
 * Utility para fetch com JSON response
 */
export async function apiJson<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await apiFetch(endpoint, options);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `API Error: ${response.statusCode}`);
  }

  return response.json();
}
