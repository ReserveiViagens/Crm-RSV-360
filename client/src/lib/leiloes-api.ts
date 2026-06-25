export type LeilaoBid = {
  name: string;
  value: number;
  timestamp: number;
};

export type LeilaoItem = {
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
  lastBids: LeilaoBid[];
  rating: number;
  tags: string[];
  description: string;
  hotelKey?: string;
  hotelName?: string;
};

type LeiloesListResponse = {
  success: boolean;
  source?: string;
  data?: LeilaoItem[];
  error?: string;
};

export async function fetchLeiloesFromApi(): Promise<LeilaoItem[]> {
  const res = await fetch("/api/leiloes", {
    headers: { Accept: "application/json" },
  });

  let body: LeiloesListResponse = { success: false };
  try {
    body = await res.json();
  } catch {
    body = { success: false };
  }

  if (!res.ok || !body.success || !Array.isArray(body.data)) {
    throw new Error(body.error || `Falha ao carregar leilões (${res.status})`);
  }

  return body.data;
}

type PlaceBidResponse = {
  success: boolean;
  data?: { id: number; amount: number; auction_id?: number };
  error?: string;
};

export async function placeLeilaoBid(auctionId: number, amount: number): Promise<PlaceBidResponse["data"]> {
  const res = await fetch(`/api/leiloes/${auctionId}/bids`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ amount }),
  });

  let body: PlaceBidResponse = { success: false };
  try {
    body = await res.json();
  } catch {
    body = { success: false };
  }

  if (!res.ok || !body.success || !body.data) {
    throw new Error(body.error || `Falha ao registrar lance (${res.status})`);
  }

  return body.data;
}
