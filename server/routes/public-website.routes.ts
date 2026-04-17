import { Router, type Request, type Response } from "express";
import { z } from "zod";
import {
  getPageBySlug,
  listPages,
  getSettings,
} from "../services/admin-website.service.js";
import { getMediaById, listMedia } from "../services/media-storage.service.js";
import type {
  PublicPageResponse,
  PublicSettingsResponse,
  PublicNavigationResponse,
} from "@shared/website-types";

/* ─────────────────────────────────────────────────────────────────────────────
   RSV360 — Public Website Router
   Base: /api/website
   No authentication required. Only published, public content is exposed.
   All media IDs are resolved to URLs server-side — clients never handle IDs.
   ───────────────────────────────────────────────────────────────────────────── */

const router = Router();

const slugParamValidator = z.object({ slug: z.string().min(1).max(255) });

/* ─── GET /settings ──────────────────────────────────────────────────────── */

router.get("/settings", async (_req: Request, res: Response) => {
  const settings = await getSettings();

  if (!settings) {
    const empty: PublicSettingsResponse = {
      siteName: "RSV360",
      logoUrl: null,
      defaultBannerUrl: null,
      primaryColor: null,
      contactEmail: null,
      contactPhone: null,
      socialLinks: null,
    };
    return res.json({ success: true, data: empty });
  }

  const [logoMedia, bannerMedia] = await Promise.all([
    settings.logoMediaId ? getMediaById(settings.logoMediaId) : null,
    settings.defaultBannerMediaId ? getMediaById(settings.defaultBannerMediaId) : null,
  ]);

  const data: PublicSettingsResponse = {
    siteName: settings.siteName,
    logoUrl: logoMedia?.url ?? null,
    defaultBannerUrl: bannerMedia?.url ?? null,
    primaryColor: settings.primaryColor,
    contactEmail: settings.contactEmail,
    contactPhone: settings.contactPhone,
    socialLinks: settings.socialLinks,
  };

  return res.json({ success: true, data });
});

async function getAllPublishedPublicPages() {
  const PAGE_SIZE = 500;
  let currentPage = 1;
  const collected: { title: string; slug: string; section: string }[] = [];

  while (true) {
    const { data, meta } = await listPages({
      status: "published",
      page: currentPage,
      limit: PAGE_SIZE,
    });

    for (const p of data) {
      if (p.access === "public") {
        collected.push({ title: p.title, slug: p.slug, section: p.section });
      }
    }

    if (currentPage * PAGE_SIZE >= meta.total) break;
    currentPage++;
  }

  return collected;
}

/* ─── GET /navigation ────────────────────────────────────────────────────── */

router.get("/navigation", async (_req: Request, res: Response) => {
  const pages = await getAllPublishedPublicPages();

  const grouped: PublicNavigationResponse = {};
  for (const page of pages) {
    if (!grouped[page.section]) grouped[page.section] = [];
    grouped[page.section].push({ title: page.title, slug: page.slug });
  }

  return res.json({ success: true, data: grouped });
});

/* ─── GET /pages/:slug ───────────────────────────────────────────────────── */

router.get("/pages/:slug", async (req: Request, res: Response) => {
  const parsed = slugParamValidator.safeParse(req.params);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      error: "Slug inválido",
      code: "VALIDATION_ERROR",
    });
  }

  const page = await getPageBySlug(parsed.data.slug);

  if (!page || page.status !== "published" || page.access !== "public") {
    return res.status(404).json({
      success: false,
      error: "Página não encontrada",
      code: "NOT_FOUND",
    });
  }

  const bannerMedia = page.bannerMediaId ? await getMediaById(page.bannerMediaId) : null;

  const data: PublicPageResponse = {
    id: page.id,
    title: page.title,
    slug: page.slug,
    section: page.section,
    content: page.content,
    metaTitle: page.metaTitle,
    metaDescription: page.metaDescription,
    bannerUrl: bannerMedia?.url ?? null,
    publishedAt: page.publishedAt ?? page.updatedAt,
  };

  return res.json({ success: true, data });
});

/* ─── GET /pages/:slug/content ───────────────────────────────────────────── */

router.get("/pages/:slug/content", async (req: Request, res: Response) => {
  const parsed = slugParamValidator.safeParse(req.params);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      error: "Slug inválido",
      code: "VALIDATION_ERROR",
    });
  }

  const page = await getPageBySlug(parsed.data.slug);

  if (!page || page.status !== "published" || page.access !== "public") {
    return res.status(404).json({
      success: false,
      error: "Página não encontrada",
      code: "NOT_FOUND",
    });
  }

  return res.json({ success: true, data: page.content ?? null });
});

/* ─── GET /pages/:slug/gallery ───────────────────────────────────────────── */

router.get("/pages/:slug/gallery", async (req: Request, res: Response) => {
  const parsed = slugParamValidator.safeParse(req.params);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      error: "Slug inválido",
      code: "VALIDATION_ERROR",
    });
  }

  const page = await getPageBySlug(parsed.data.slug);

  if (!page || page.status !== "published" || page.access !== "public") {
    return res.json({ success: true, images: [], video: null });
  }

  const { data: items } = await listMedia({
    pageId: page.id,
    placement: "gallery",
    status: "active",
    limit: 50,
  });

  const toItem = (m: (typeof items)[number]) => ({
    id: m.id,
    type: m.type,
    url: m.url,
    altText: m.altText ?? null,
    originalName: m.originalName,
  });

  const images = items.filter((m) => m.type === "image").map(toItem);
  const videoItem = items.find((m) => m.type === "video") ?? null;
  const video = videoItem ? toItem(videoItem) : null;

  return res.json({ success: true, images, video });
});

export default router;
