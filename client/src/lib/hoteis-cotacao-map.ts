/**
 * Mapa S1 hotel.id → slug CMS S2 (website_content content_id / hotel).
 * Regra: só pares cujo nome de exibição bate a migration 0033.
 * Golden Dolphin Grand ≠ Supreme → omitido.
 */
export const HOTEIS_COTACAO_MAP: Readonly<Record<string, string>> = {
  lacqua: "lacqua-diroma", // S1 "Lacqua Di Roma" ↔ 0033 "Lacqua diRoma"
  diroma: "diroma-acqua-park", // S1 "Di Roma Acqua Park" ↔ 0033 "diRoma Acqua Park"
};

export const S1_HOTEIS_CANAL = "s1-hoteis";
export const S1_HOTEIS_REF = "hoteis";

export function resolveCotacaoHotelSlug(s1HotelId: string): string | null {
  return HOTEIS_COTACAO_MAP[s1HotelId] ?? null;
}

/** Link relativo — S1 redirect 307 preserva query via originalUrl. */
export function buildHoteisCotacaoHref(
  s1HotelId: string,
  opts?: { adults?: number; checkin?: string; checkout?: string },
): string {
  const params = new URLSearchParams();
  const slug = resolveCotacaoHotelSlug(s1HotelId);
  if (slug) params.set("hotel", slug);
  params.set("adults", String(opts?.adults ?? 2));
  if (opts?.checkin) params.set("checkin", opts.checkin);
  if (opts?.checkout) params.set("checkout", opts.checkout);
  params.set("canal", S1_HOTEIS_CANAL);
  params.set("ref", S1_HOTEIS_REF);
  return `/cotacao?${params.toString()}`;
}

export function buildWhatsAppReserveUrl(hotelTitle: string): string {
  return `https://wa.me/5564993197555?text=${encodeURIComponent(
    `Olá! Quero reservar o ${hotelTitle} com desconto especial!`,
  )}`;
}
