import { eq, desc, asc, and, ilike, count } from "drizzle-orm";
import { db } from "../db.js";
import {
  websitePages,
  websiteMedia,
  websiteSettings,
  websitePageVersions,
  auditLogs,
} from "@shared/schema";
import {
  PROTECTED_ROUTES,
  type AdminPageResponse,
  type AdminSettingsResponse,
  type PageListFilter,
  type CreatePageRequest,
  type UpdatePageRequest,
  type UpdateSettingsRequest,
  type PaginationMeta,
} from "@shared/website-types";
import type { WebsitePageRow, WebsiteSettingsRow } from "@shared/schema";

/* ─────────────────────────────────────────────────────────────────────────────
   RSV360 — Admin/Website Service
   Business logic for page CRUD, settings, versioning, and audit log.
   All methods return DTOs (not raw DB rows).
   ───────────────────────────────────────────────────────────────────────────── */

function toPageDto(row: WebsitePageRow): AdminPageResponse {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    section: row.section,
    content: row.content as Record<string, unknown>,
    status: row.status,
    metaTitle: row.metaTitle ?? null,
    metaDescription: row.metaDescription ?? null,
    bannerMediaId: row.bannerMediaId ?? null,
    publishedAt: row.publishedAt?.toISOString() ?? null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

function toSettingsDto(row: WebsiteSettingsRow): AdminSettingsResponse {
  return {
    id: row.id,
    siteName: row.siteName,
    logoMediaId: row.logoMediaId ?? null,
    defaultBannerMediaId: row.defaultBannerMediaId ?? null,
    primaryColor: row.primaryColor ?? null,
    contactEmail: row.contactEmail ?? null,
    contactPhone: row.contactPhone ?? null,
    socialLinks: (row.socialLinks as Record<string, string> | null) ?? null,
    updatedAt: row.updatedAt.toISOString(),
  };
}

async function writeAudit(
  entity: "page" | "settings" | "media",
  entityId: string,
  action: string,
  actorId: string,
  actorName: string,
  diff?: Record<string, unknown>
): Promise<void> {
  await db.insert(auditLogs).values({
    entity: entity as "page" | "settings" | "media",
    entityId,
    action: action as "create" | "update" | "delete" | "publish" | "unpublish" | "upload" | "swap" | "unlink",
    actorId,
    actorName,
    diff: diff ?? null,
  });
}

/* ─── Pages ──────────────────────────────────────────────────────────────── */

export async function listPages(
  filter: PageListFilter
): Promise<{ data: AdminPageResponse[]; meta: PaginationMeta }> {
  const page = filter.page ?? 1;
  const limit = filter.limit ?? 20;
  const offset = (page - 1) * limit;

  const conditions = [];
  if (filter.status) conditions.push(eq(websitePages.status, filter.status));
  if (filter.section) conditions.push(eq(websitePages.section, filter.section));
  if (filter.search) conditions.push(ilike(websitePages.title, `%${filter.search}%`));

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const [rows, [{ value: total }]] = await Promise.all([
    db
      .select()
      .from(websitePages)
      .where(where)
      .orderBy(desc(websitePages.updatedAt))
      .limit(limit)
      .offset(offset),
    db
      .select({ value: count() })
      .from(websitePages)
      .where(where),
  ]);

  return {
    data: rows.map(toPageDto),
    meta: { total: Number(total), page, limit },
  };
}

export async function getPageById(id: string): Promise<AdminPageResponse | null> {
  const [row] = await db
    .select()
    .from(websitePages)
    .where(eq(websitePages.id, id))
    .limit(1);
  return row ? toPageDto(row) : null;
}

export async function getPageBySlug(slug: string): Promise<AdminPageResponse | null> {
  const [row] = await db
    .select()
    .from(websitePages)
    .where(eq(websitePages.slug, slug))
    .limit(1);
  return row ? toPageDto(row) : null;
}

export async function createPage(
  input: CreatePageRequest,
  actorId: string,
  actorName: string
): Promise<AdminPageResponse> {
  const [row] = await db
    .insert(websitePages)
    .values({
      title: input.title,
      slug: input.slug,
      section: input.section,
      content: input.content ?? {},
      status: input.status ?? "draft",
      metaTitle: input.metaTitle ?? null,
      metaDescription: input.metaDescription ?? null,
      bannerMediaId: input.bannerMediaId ?? null,
    })
    .returning();

  await writeAudit("page", row.id, "create", actorId, actorName, { slug: row.slug });
  return toPageDto(row);
}

export async function updatePage(
  id: string,
  input: UpdatePageRequest,
  actorId: string,
  actorName: string
): Promise<AdminPageResponse | null> {
  const existing = await db
    .select()
    .from(websitePages)
    .where(eq(websitePages.id, id))
    .limit(1);

  if (existing.length === 0) return null;

  const [row] = await db
    .update(websitePages)
    .set({
      ...input,
      updatedAt: new Date(),
    })
    .where(eq(websitePages.id, id))
    .returning();

  await writeAudit("page", id, "update", actorId, actorName, input as Record<string, unknown>);
  return toPageDto(row);
}

export async function deletePage(
  id: string,
  actorId: string,
  actorName: string
): Promise<{ deleted: true } | { error: "not_found" } | { error: "protected"; slug: string }> {
  const [existing] = await db
    .select({ id: websitePages.id, slug: websitePages.slug })
    .from(websitePages)
    .where(eq(websitePages.id, id))
    .limit(1);

  if (!existing) return { error: "not_found" };

  if ((PROTECTED_ROUTES as readonly string[]).includes(existing.slug)) {
    return { error: "protected", slug: existing.slug };
  }

  await db.delete(websitePages).where(eq(websitePages.id, id));
  await writeAudit("page", id, "delete", actorId, actorName, { slug: existing.slug });
  return { deleted: true };
}

export async function publishPage(
  id: string,
  actorId: string,
  actorName: string
): Promise<AdminPageResponse | null> {
  const [existing] = await db
    .select()
    .from(websitePages)
    .where(eq(websitePages.id, id))
    .limit(1);

  if (!existing) return null;

  await db.insert(websitePageVersions).values({
    pageId: id,
    content: existing.content as Record<string, unknown>,
    snapshot: existing as unknown as Record<string, unknown>,
  });

  const [row] = await db
    .update(websitePages)
    .set({ status: "published", publishedAt: new Date(), updatedAt: new Date() })
    .where(eq(websitePages.id, id))
    .returning();

  await writeAudit("page", id, "publish", actorId, actorName);
  return toPageDto(row);
}

export async function unpublishPage(
  id: string,
  actorId: string,
  actorName: string
): Promise<AdminPageResponse | null> {
  const [existing] = await db
    .select({ id: websitePages.id })
    .from(websitePages)
    .where(eq(websitePages.id, id))
    .limit(1);

  if (!existing) return null;

  const [row] = await db
    .update(websitePages)
    .set({ status: "draft", updatedAt: new Date() })
    .where(eq(websitePages.id, id))
    .returning();

  await writeAudit("page", id, "unpublish", actorId, actorName);
  return toPageDto(row);
}

/* ─── Settings ───────────────────────────────────────────────────────────── */

export async function getSettings(): Promise<AdminSettingsResponse | null> {
  const [row] = await db
    .select()
    .from(websiteSettings)
    .where(eq(websiteSettings.id, 1))
    .limit(1);
  return row ? toSettingsDto(row) : null;
}

export async function updateSettings(
  input: UpdateSettingsRequest,
  actorId: string,
  actorName: string
): Promise<AdminSettingsResponse> {
  const existing = await db
    .select({ id: websiteSettings.id })
    .from(websiteSettings)
    .where(eq(websiteSettings.id, 1))
    .limit(1);

  let row: WebsiteSettingsRow;

  if (existing.length === 0) {
    [row] = await db
      .insert(websiteSettings)
      .values({ id: 1, siteName: input.siteName ?? "RSV360", ...input })
      .returning();
  } else {
    [row] = await db
      .update(websiteSettings)
      .set({ ...input, updatedAt: new Date() })
      .where(eq(websiteSettings.id, 1))
      .returning();
  }

  await writeAudit("settings", "1", "update", actorId, actorName, input as Record<string, unknown>);
  return toSettingsDto(row);
}
