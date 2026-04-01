import path from "path";
import fs from "fs";
import multer, { type FileFilterCallback } from "multer";
import type { Request } from "express";
import { randomUUID } from "crypto";
import { db } from "../db.js";
import { websiteMedia, auditLogs } from "../../shared/schema.js";
import { eq, and, ilike, gte, lte, sql, count } from "drizzle-orm";
import type {
  WebsiteMediaRow,
  MediaQueryFilter,
  MediaUpdateRequest,
} from "../../shared/website-types.js";

/* ─── Constants ────────────────────────────────────────────────────────────── */

const UPLOADS_DIR = path.resolve(process.cwd(), "uploads", "website");
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

const ALLOWED_MIMETYPES: Record<string, "image" | "video" | "document"> = {
  "image/jpeg": "image",
  "image/jpg": "image",
  "image/png": "image",
  "image/gif": "image",
  "image/webp": "image",
  "image/svg+xml": "image",
  "video/mp4": "video",
  "video/webm": "video",
  "application/pdf": "document",
};

/* ─── Ensure uploads directory exists ─────────────────────────────────────── */

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

/* ─── URL builder ──────────────────────────────────────────────────────────── */

export function buildMediaUrl(filename: string): string {
  const cdnBase = process.env.MEDIA_CDN_BASE_URL;
  if (cdnBase) {
    return `${cdnBase.replace(/\/$/, "")}/${filename}`;
  }
  return `/uploads/website/${filename}`;
}

/* ─── Multer storage adapter ───────────────────────────────────────────────── */

const diskStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safe = path
      .basename(file.originalname, ext)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 40);
    cb(null, `${safe}-${randomUUID()}${ext}`);
  },
});

function fileFilter(
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void {
  if (ALLOWED_MIMETYPES[file.mimetype]) {
    cb(null, true);
  } else {
    cb(
      Object.assign(new Error("Tipo de arquivo não suportado"), {
        code: "UNSUPPORTED_FILE_TYPE",
      })
    );
  }
}

export const upload = multer({
  storage: diskStorage,
  limits: { fileSize: MAX_FILE_SIZE_BYTES },
  fileFilter,
});

/* ─── Validate a file that has already been saved (post-multer checks) ──── */

export function validateFile(file: Express.Multer.File): {
  ok: boolean;
  error?: string;
  code?: string;
  mediaType?: "image" | "video" | "document";
} {
  const mediaType = ALLOWED_MIMETYPES[file.mimetype];
  if (!mediaType) {
    return { ok: false, error: "Tipo de arquivo não suportado", code: "UNSUPPORTED_FILE_TYPE" };
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { ok: false, error: "Arquivo excede o limite de 10 MB", code: "FILE_TOO_LARGE" };
  }
  return { ok: true, mediaType };
}

/* ─── Delete file from disk (best-effort) ──────────────────────────────────── */

export function deleteFileFromDisk(filename: string): void {
  const filePath = path.join(UPLOADS_DIR, filename);
  try {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  } catch {
    // non-fatal — log only
    console.warn(`[media-storage] Could not delete file: ${filePath}`);
  }
}

/* ─── Persist media record ─────────────────────────────────────────────────── */

export async function persistMediaRecord(
  file: Express.Multer.File,
  meta: { altText?: string; placement?: string; pageId?: string | null },
  mediaType: "image" | "video" | "document",
  actorId: string,
  actorName: string
): Promise<WebsiteMediaRow> {
  const url = buildMediaUrl(file.filename);

  const [row] = await db
    .insert(websiteMedia)
    .values({
      type: mediaType,
      placement: (meta.placement ?? "misc") as WebsiteMediaRow["placement"],
      status: "active",
      filename: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      sizeBytes: file.size,
      url,
      altText: meta.altText ?? null,
      pageId: meta.pageId ?? null,
    })
    .returning();

  await writeMediaAudit({
    entityId: row.id,
    action: "upload",
    actorId,
    actorName,
    diff: { filename: file.filename, size: file.size, mimetype: file.mimetype },
  });

  return row;
}

/* ─── List media with filters ──────────────────────────────────────────────── */

export async function listMedia(
  filter: MediaQueryFilter
): Promise<{ data: WebsiteMediaRow[]; meta: { total: number; page: number; limit: number } }> {
  const page = filter.page ?? 1;
  const limit = filter.limit ?? 20;
  const offset = (page - 1) * limit;

  const conditions = [];

  if (filter.type) conditions.push(eq(websiteMedia.type, filter.type));
  if (filter.status) conditions.push(eq(websiteMedia.status, filter.status));
  if (filter.placement) conditions.push(eq(websiteMedia.placement, filter.placement));
  if (filter.pageId) conditions.push(eq(websiteMedia.pageId, filter.pageId));
  if (filter.search) conditions.push(ilike(websiteMedia.originalName, `%${filter.search}%`));
  if (filter.dateFrom)
    conditions.push(gte(websiteMedia.createdAt, new Date(filter.dateFrom)));
  if (filter.dateTo)
    conditions.push(lte(websiteMedia.createdAt, new Date(filter.dateTo + "T23:59:59Z")));

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const [{ total }] = await db
    .select({ total: count() })
    .from(websiteMedia)
    .where(where);

  const data = await db
    .select()
    .from(websiteMedia)
    .where(where)
    .orderBy(sql`${websiteMedia.createdAt} DESC`)
    .limit(limit)
    .offset(offset);

  return { data, meta: { total: Number(total), page, limit } };
}

/* ─── Get single media ──────────────────────────────────────────────────────── */

export async function getMediaById(id: string): Promise<WebsiteMediaRow | null> {
  const rows = await db.select().from(websiteMedia).where(eq(websiteMedia.id, id)).limit(1);
  return rows[0] ?? null;
}

/* ─── Update media metadata ─────────────────────────────────────────────────── */

export async function updateMedia(
  id: string,
  input: MediaUpdateRequest,
  actorId: string,
  actorName: string
): Promise<WebsiteMediaRow | null> {
  const existing = await getMediaById(id);
  if (!existing) return null;

  const updates: Partial<WebsiteMediaRow> = { updatedAt: new Date() };
  if (input.altText !== undefined) updates.altText = input.altText;
  if (input.placement !== undefined) updates.placement = input.placement;
  if (input.pageId !== undefined) updates.pageId = input.pageId;
  if (input.status !== undefined) updates.status = input.status;

  const [updated] = await db
    .update(websiteMedia)
    .set(updates)
    .where(eq(websiteMedia.id, id))
    .returning();

  await writeMediaAudit({
    entityId: id,
    action: "update",
    actorId,
    actorName,
    diff: input as Record<string, unknown>,
  });

  return updated ?? null;
}

/* ─── Swap file binary ──────────────────────────────────────────────────────── */

export async function swapMediaFile(
  id: string,
  newFile: Express.Multer.File,
  actorId: string,
  actorName: string
): Promise<WebsiteMediaRow | null> {
  const existing = await getMediaById(id);
  if (!existing) {
    deleteFileFromDisk(newFile.filename);
    return null;
  }

  const validation = validateFile(newFile);
  if (!validation.ok) {
    deleteFileFromDisk(newFile.filename);
    return null;
  }

  // Delete old file from disk
  deleteFileFromDisk(existing.filename);

  const newUrl = buildMediaUrl(newFile.filename);

  const [updated] = await db
    .update(websiteMedia)
    .set({
      filename: newFile.filename,
      originalName: newFile.originalname,
      mimetype: newFile.mimetype,
      sizeBytes: newFile.size,
      url: newUrl,
      type: validation.mediaType!,
      updatedAt: new Date(),
    })
    .where(eq(websiteMedia.id, id))
    .returning();

  await writeMediaAudit({
    entityId: id,
    action: "swap",
    actorId,
    actorName,
    diff: {
      old: { filename: existing.filename },
      new: { filename: newFile.filename, size: newFile.size },
    },
  });

  return updated ?? null;
}

/* ─── Unlink media from page ────────────────────────────────────────────────── */

export async function unlinkMedia(
  id: string,
  actorId: string,
  actorName: string
): Promise<WebsiteMediaRow | null> {
  const existing = await getMediaById(id);
  if (!existing) return null;

  const [updated] = await db
    .update(websiteMedia)
    .set({ pageId: null, status: "orphan", updatedAt: new Date() })
    .where(eq(websiteMedia.id, id))
    .returning();

  await writeMediaAudit({
    entityId: id,
    action: "unlink",
    actorId,
    actorName,
    diff: { previousPageId: existing.pageId },
  });

  return updated ?? null;
}

/* ─── Delete media ──────────────────────────────────────────────────────────── */

export type DeleteMediaResult =
  | { deleted: true }
  | { error: "not_found" }
  | { error: "has_references"; message: string };

export async function deleteMedia(
  id: string,
  force: boolean,
  actorId: string,
  actorName: string
): Promise<DeleteMediaResult> {
  const existing = await getMediaById(id);
  if (!existing) return { error: "not_found" };

  if (!force && existing.pageId) {
    return {
      error: "has_references",
      message: `Arquivo vinculado à página ${existing.pageId}. Use ?force=true para forçar a exclusão.`,
    };
  }

  deleteFileFromDisk(existing.filename);

  await db.delete(websiteMedia).where(eq(websiteMedia.id, id));

  await writeMediaAudit({
    entityId: id,
    action: "delete",
    actorId,
    actorName,
    diff: { filename: existing.filename, force },
  });

  return { deleted: true };
}

/* ─── Audit helper ──────────────────────────────────────────────────────────── */

async function writeMediaAudit(params: {
  entityId: string;
  action: (typeof import("../../shared/website-types.js").AUDIT_ACTIONS)[number];
  actorId: string;
  actorName: string;
  diff?: Record<string, unknown>;
}): Promise<void> {
  try {
    await db.insert(auditLogs).values({
      entity: "media",
      entityId: params.entityId,
      action: params.action,
      actorId: params.actorId,
      actorName: params.actorName,
      diff: params.diff ?? null,
    });
  } catch (err) {
    console.error("[media-storage] Failed to write audit log", err);
  }
}
