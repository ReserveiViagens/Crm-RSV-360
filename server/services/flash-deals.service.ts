import type { FlashDealCardOverlay } from "@shared/offers-cms-types";
import { FLASH_DEALS_CATALOG, type FlashDealCatalogItem } from "@shared/flash-deals-catalog";
import { getFlashDealOverlay } from "./offers-cms.service.js";

export function applyFlashDealCardOverlay(
  deal: FlashDealCatalogItem,
  overlay?: FlashDealCardOverlay,
): FlashDealCatalogItem {
  if (!overlay) return deal;
  return {
    ...deal,
    title: overlay.title ?? deal.title,
    location: overlay.location ?? deal.location,
    originalPrice: overlay.originalPrice ?? deal.originalPrice,
    price: overlay.price ?? deal.price,
    discount: overlay.discount ?? deal.discount,
    image: overlay.image ?? deal.image,
    category: overlay.category ?? deal.category,
    tags: overlay.tags ?? deal.tags,
    description: overlay.description ?? deal.description,
    hotelKey: overlay.hotelKey ?? deal.hotelKey,
  };
}

export function listFlashDealsWithOverlays(): FlashDealCatalogItem[] {
  return FLASH_DEALS_CATALOG.map((deal) =>
    applyFlashDealCardOverlay(deal, getFlashDealOverlay(deal.id)),
  );
}

export function listFlashDealsForAdmin(): Array<FlashDealCatalogItem & { overlay: FlashDealCardOverlay | null }> {
  return FLASH_DEALS_CATALOG.map((deal) => ({
    ...deal,
    overlay: getFlashDealOverlay(deal.id) ?? null,
  }));
}

export function getFlashDealById(id: number): FlashDealCatalogItem | null {
  const base = FLASH_DEALS_CATALOG.find((d) => d.id === id);
  if (!base) return null;
  return applyFlashDealCardOverlay(base, getFlashDealOverlay(id));
}
