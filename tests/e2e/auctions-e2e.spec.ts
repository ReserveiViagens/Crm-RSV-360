import { test, expect, APIRequestContext } from "@playwright/test";

const backend =
  (process.env.RSV_AUCTIONS_BACKEND_URL || "http://127.0.0.1:3002").replace(/\/$/, "");

type BackendAuction = {
  id: number;
  title: string;
  current_price: number;
  min_increment?: number;
  start_price?: number;
};

type BidsListResponse = {
  success?: boolean;
  data?: { id: number; amount: number; created_at?: string }[];
};

async function isBackendReady(request: APIRequestContext): Promise<boolean> {
  try {
    const res = await request.get(`${backend}/health`, { timeout: 5_000 });
    return res.ok();
  } catch {
    return false;
  }
}

async function fetchActiveAuctions(request: APIRequestContext): Promise<BackendAuction[]> {
  const res = await request.get(`${backend}/api/v1/auctions/active`);
  if (!res.ok()) return [];
  const body = await res.json();
  return Array.isArray(body) ? body : [];
}

async function countBids(request: APIRequestContext, auctionId: number): Promise<number> {
  const res = await request.get(`${backend}/api/v1/auctions/${auctionId}/bids`);
  if (!res.ok()) return 0;
  const body = (await res.json()) as BidsListResponse;
  return Array.isArray(body.data) ? body.data.length : 0;
}

test.describe("Fase 5.4 — Leilões E2E (S1 → :3002)", () => {
  test.beforeEach(async ({ request }) => {
    const ready = await isBackendReady(request);
    test.skip(!ready, `Backend RSV360 indisponível em ${backend}`);
  });

  test("login → /leiloes → lance → valida no :3002", async ({ page, request }) => {
    const auctions = await fetchActiveAuctions(request);
    test.skip(auctions.length === 0, "Nenhum leilão ativo — rode seed:auctions no rsv360");

    const auction = auctions[0];
    const bidsBefore = await countBids(request, auction.id);
    const minIncrement = Number(auction.min_increment ?? 10);
    const targetBid =
      Number(auction.current_price ?? auction.start_price ?? 0) + minIncrement;

    await page.goto("/entrar");
    await page.getByTestId("btn-entrar-demo").click();
    await expect(page).toHaveURL(/\/perfil/, { timeout: 15_000 });

    await page.goto("/leiloes");
    await expect(page.getByTestId("text-page-title")).toBeVisible();

    const card = page.getByTestId(`card-leilao-${auction.id}`);
    await expect(card).toBeVisible({ timeout: 20_000 });

    await page.getByTestId(`button-bid-${auction.id}`).click();
    await expect(page.getByTestId("bid-wizard-step-valor")).toBeVisible();

    const increments = [10, 25, 50, 100];
    const chosen = increments.find((inc) => inc >= minIncrement) ?? 100;
    await page.getByTestId(`button-increment-${chosen}`).click();

    await page.getByTestId("button-bid-wizard-next").click();
    await page.getByTestId("button-bid-wizard-next").click();
    await page.getByTestId("button-bid-wizard-next").click();
    await page.getByTestId("button-bid-wizard-next").click();
    await page.getByTestId("checkbox-aceite-leilao").check();
    await page.getByTestId("button-confirm-bid").click();
    await expect(page.getByTestId("bid-wizard-success")).toBeVisible({ timeout: 15_000 });

    await expect
      .poll(async () => countBids(request, auction.id), {
        timeout: 20_000,
        message: "Lance não apareceu em /api/v1/auctions/:id/bids",
      })
      .toBeGreaterThan(bidsBefore);

    const bidsRes = await request.get(`${backend}/api/v1/auctions/${auction.id}/bids`);
    const bidsBody = (await bidsRes.json()) as BidsListResponse;
    const latest = bidsBody.data?.[0];
    expect(latest?.amount).toBeGreaterThanOrEqual(targetBid);
  });
});
