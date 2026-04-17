import { test, expect } from "@playwright/test";

/* ─────────────────────────────────────────────────────────────────────────────
   RSV360 — Admin/Website Module E2E Specs
   Covers the public website API endpoints and the admin auth gate.
   Base URL is set to http://127.0.0.1:5000 in playwright.config.ts.
   ───────────────────────────────────────────────────────────────────────────── */

test.describe("Public website API", () => {
  test("GET /api/website/navigation responds 200", async ({ request }) => {
    const res = await request.get("/api/website/navigation");
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(typeof body.data).toBe("object");
  });

  test("GET /api/website/settings responds 200 with public fields", async ({ request }) => {
    const res = await request.get("/api/website/settings");
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    const data = body.data;
    expect(typeof data.siteName).toBe("string");
    expect("logoUrl" in data).toBe(true);
    expect("defaultBannerUrl" in data).toBe(true);
    expect("id" in data).toBe(false);
    expect("logoMediaId" in data).toBe(false);
    expect("heroType" in data).toBe(false);
  });

  test("GET /api/website/pages/:slug returns 404 for unknown slug", async ({ request }) => {
    const res = await request.get("/api/website/pages/slug-que-nao-existe-xyz-abc");
    expect(res.status()).toBe(404);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.code).toBe("NOT_FOUND");
  });

  test("GET /api/website/pages/:slug returns 200 or 404 for 'home'", async ({ request }) => {
    const res = await request.get("/api/website/pages/home");
    expect([200, 404]).toContain(res.status());
    const body = await res.json();
    if (res.status() === 200) {
      expect(body.success).toBe(true);
      expect(body.data.slug).toBe("home");
      expect("bannerUrl" in body.data).toBe(true);
      expect("publishedAt" in body.data).toBe(true);
    } else {
      expect(body.success).toBe(false);
    }
  });
});

test.describe("Admin website API — auth gate", () => {
  test("GET /api/admin/website/pages without auth returns 401", async ({ request }) => {
    const res = await request.get("/api/admin/website/pages");
    expect(res.status()).toBe(401);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.code).toBe("UNAUTHORIZED");
  });

  test("GET /api/admin/website/settings without auth returns 401", async ({ request }) => {
    const res = await request.get("/api/admin/website/settings");
    expect(res.status()).toBe(401);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.code).toBe("UNAUTHORIZED");
  });

  test("GET /api/admin/website/audit without auth returns 401", async ({ request }) => {
    const res = await request.get("/api/admin/website/audit");
    expect(res.status()).toBe(401);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.code).toBe("UNAUTHORIZED");
  });
});
