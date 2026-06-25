import { logger } from "../lib/logger.js";
import { getRsv360BackendUrl } from "./marketing-lab-sso.service.js";

export type BackendAuction = {
  id: number;
  title: string;
  description?: string;
  start_price: number;
  current_price: number;
  min_increment: number;
  end_date: string;
  image_url?: string;
  total_bids?: number;
  latitude?: number;
  longitude?: number;
  status?: string;
};

export type BackendBid = {
  id: number;
  auction_id: number;
  amount: number;
  created_at: string;
  customer_name?: string;
};

export type LeilaoCard = {
  id: number;
  title: string;
  location: string;
  category: string;
  startPrice: number;
  currentBid: number;
  totalBids: number;
  bidders: number;
  timeLeftSeconds: number;
  endingSoon: boolean;
  image: string;
  lastBids: { name: string; value: number; timestamp: number }[];
  rating: number;
  tags: string[];
  description: string;
};

const DEFAULT_IMAGE =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/termas-paradise-Np6Qr8Ts2Uf4Xv7Zy1Bw3Dc5Eg9Hj.jpg";

export function isRsv360AuctionsEnabled(): boolean {
  const flag = (process.env.USE_RSV360_AUCTIONS ?? "true").trim().toLowerCase();
  return flag !== "false" && flag !== "0" && flag !== "off";
}

async function fetchBackendJson<T>(path: string, init?: RequestInit): Promise<T> {
  const base = getRsv360BackendUrl();
  const url = `${base}${path.startsWith("/") ? path : `/${path}`}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12_000);

  try {
    const res = await fetch(url, { ...init, signal: controller.signal });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`RSV360 backend ${res.status}: ${body.slice(0, 200)}`);
    }
    return (await res.json()) as T;
  } finally {
    clearTimeout(timeout);
  }
}

function inferLocation(title: string, description?: string): string {
  const text = `${title} ${description ?? ""}`.toLowerCase();
  if (text.includes("rio quente")) return "Rio Quente";
  return "Caldas Novas";
}

function inferCategory(title: string, description?: string): string {
  const text = `${title} ${description ?? ""}`.toLowerCase();
  if (text.includes("hot park") || text.includes("parque") || text.includes("ingresso")) {
    return "parques";
  }
  if (text.includes("pacote")) return "pacote";
  if (text.includes("spa") || text.includes("experi")) return "experiencia";
  return "hotel";
}

function inferTags(title: string, description?: string): string[] {
  const text = `${title} ${description ?? ""}`.toLowerCase();
  const tags: string[] = [];
  const candidates = [
    ["spa", "spa"],
    ["família", "família"],
    ["familia", "família"],
    ["parque", "parques"],
    ["casal", "casal"],
    ["aventura", "aventura"],
    ["termas", "termas"],
  ] as const;
  for (const [needle, tag] of candidates) {
    if (text.includes(needle) && !tags.includes(tag)) tags.push(tag);
  }
  return tags.length ? tags : ["leilão"];
}

export function mapAuctionToLeilaoCard(
  auction: BackendAuction,
  bids: BackendBid[] = [],
): LeilaoCard {
  const endMs = new Date(auction.end_date).getTime();
  const timeLeftSeconds = Math.max(0, Math.floor((endMs - Date.now()) / 1000));
  const totalBids = auction.total_bids ?? bids.length ?? 0;

  return {
    id: auction.id,
    title: auction.title,
    location: inferLocation(auction.title, auction.description),
    category: inferCategory(auction.title, auction.description),
    startPrice: Number(auction.start_price),
    currentBid: Number(auction.current_price),
    totalBids,
    bidders: Math.max(1, Math.ceil(totalBids * 0.35)),
    timeLeftSeconds,
    endingSoon: timeLeftSeconds > 0 && timeLeftSeconds <= 600,
    image: auction.image_url || DEFAULT_IMAGE,
    lastBids: bids.slice(0, 5).map((bid) => ({
      name: bid.customer_name || "Participante",
      value: Number(bid.amount),
      timestamp: new Date(bid.created_at).getTime(),
    })),
    rating: 4.8,
    tags: inferTags(auction.title, auction.description),
    description: auction.description || auction.title,
  };
}

export async function fetchActiveAuctionsFromRsv360(): Promise<LeilaoCard[]> {
  const rows = await fetchBackendJson<BackendAuction[]>("/api/v1/auctions/active");
  if (!Array.isArray(rows)) {
    throw new Error("Resposta inválida de /api/v1/auctions/active");
  }

  const mapped = await Promise.all(
    rows.map(async (auction) => {
      try {
        const bidsRes = await fetchBackendJson<{ success?: boolean; data?: BackendBid[] }>(
          `/api/v1/auctions/${auction.id}/bids`,
        );
        const bids = Array.isArray(bidsRes)
          ? (bidsRes as unknown as BackendBid[])
          : bidsRes.data ?? [];
        return mapAuctionToLeilaoCard(auction, bids);
      } catch (error) {
        logger.warn(`[auctions] bids ${auction.id}: ${error instanceof Error ? error.message : "erro"}`);
        return mapAuctionToLeilaoCard(auction);
      }
    }),
  );

  return mapped;
}

export async function fetchAuctionDetailFromRsv360(id: number): Promise<LeilaoCard | null> {
  const auction = await fetchBackendJson<BackendAuction>(`/api/v1/auctions/${id}`);
  if (!auction?.id) return null;

  let bids: BackendBid[] = [];
  try {
    const bidsRes = await fetchBackendJson<{ success?: boolean; data?: BackendBid[] }>(
      `/api/v1/auctions/${id}/bids`,
    );
    bids = Array.isArray(bidsRes) ? (bidsRes as unknown as BackendBid[]) : bidsRes.data ?? [];
  } catch {
    bids = [];
  }

  return mapAuctionToLeilaoCard(auction, bids);
}
