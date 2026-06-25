import type { FlashDealCatalogItem } from "@shared/flash-deals-catalog";
import type {
  AuctionCardOverlay,
  CreateOfferRuleInput,
  FlashDealCardOverlay,
  OfferRule,
  UpdateOfferRuleInput,
  WizardRulesBundle,
} from "@shared/offers-cms-types";
import type { LeilaoItem } from "./leiloes-api";

async function adminFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(init?.headers ?? {}),
    },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok || body.success === false) {
    throw new Error(body.error || `Erro ${res.status}`);
  }
  return body.data as T;
}

export async function fetchLeilaoWizardRules(
  auctionId: number,
  hotelKey?: string,
): Promise<WizardRulesBundle> {
  const params = new URLSearchParams({ auctionId: String(auctionId) });
  if (hotelKey) params.set("hotelKey", hotelKey);

  const res = await fetch(`/api/leiloes/rules?${params}`, {
    headers: { Accept: "application/json" },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok || !body.success || !body.data) {
    throw new Error(body.error || "Falha ao carregar regras");
  }
  return body.data as WizardRulesBundle;
}

export async function listAdminOfferRules(): Promise<OfferRule[]> {
  return adminFetch<OfferRule[]>("/api/admin/offers/rules");
}

export async function createAdminOfferRule(input: CreateOfferRuleInput): Promise<OfferRule> {
  return adminFetch<OfferRule>("/api/admin/offers/rules", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateAdminOfferRule(
  id: string,
  input: UpdateOfferRuleInput,
): Promise<OfferRule> {
  return adminFetch<OfferRule>(`/api/admin/offers/rules/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export async function deleteAdminOfferRule(id: string): Promise<void> {
  await adminFetch<null>(`/api/admin/offers/rules/${id}`, { method: "DELETE" });
}

export type AdminAuctionCard = LeilaoItem & { overlay: AuctionCardOverlay | null };

export async function listAdminAuctionCards(): Promise<AdminAuctionCard[]> {
  return adminFetch<AdminAuctionCard[]>("/api/admin/offers/auctions");
}

export async function saveAdminAuctionOverlay(
  auctionId: number,
  overlay: Omit<AuctionCardOverlay, "auctionId" | "updatedAt">,
): Promise<AuctionCardOverlay> {
  return adminFetch<AuctionCardOverlay>(`/api/admin/offers/auctions/${auctionId}/overlay`, {
    method: "PUT",
    body: JSON.stringify(overlay),
  });
}

export type AdminFlashDealCard = FlashDealCatalogItem & { overlay: FlashDealCardOverlay | null };

export async function listAdminFlashDealCards(): Promise<AdminFlashDealCard[]> {
  return adminFetch<AdminFlashDealCard[]>("/api/admin/offers/flash-deals");
}

export async function saveAdminFlashDealOverlay(
  flashDealId: number,
  overlay: Omit<FlashDealCardOverlay, "flashDealId" | "updatedAt">,
): Promise<FlashDealCardOverlay> {
  return adminFetch<FlashDealCardOverlay>(`/api/admin/offers/flash-deals/${flashDealId}/overlay`, {
    method: "PUT",
    body: JSON.stringify(overlay),
  });
}
