import { eq, and, desc, count } from "drizzle-orm";
import { db } from "../db.js";
import { auditLogs } from "@shared/schema";
import type { AuditLogRow } from "@shared/schema";
import type { AuditEntity, AuditAction, AuditLog } from "@shared/website-types";

/* ─────────────────────────────────────────────────────────────────────────────
   RSV360 — Audit Service
   Centralised audit trail for page, settings, and media operations.
   writeAudit is fire-and-forget safe: it catches all errors so the calling
   operation always succeeds even if the audit write fails.
   ───────────────────────────────────────────────────────────────────────────── */

function toAuditDto(row: AuditLogRow): AuditLog {
  return {
    id: row.id,
    entity: row.entity,
    entityId: row.entityId,
    action: row.action,
    actorId: row.actorId,
    actorName: row.actorName,
    diff: (row.diff as Record<string, unknown> | null) ?? null,
    createdAt: row.createdAt.toISOString(),
  };
}

export async function writeAudit(
  entity: AuditEntity,
  entityId: string,
  action: AuditAction,
  actorId: string,
  actorName: string,
  diff?: Record<string, unknown>
): Promise<void> {
  try {
    await db.insert(auditLogs).values({
      entity,
      entityId,
      action,
      actorId,
      actorName,
      diff: diff ?? null,
    });
  } catch (err) {
    console.error("[audit.service] writeAudit failed (non-fatal):", err);
  }
}

export interface AuditQueryOptions {
  entity?: AuditEntity;
  entityId?: string;
  action?: AuditAction;
  limit?: number;
  page?: number;
}

export async function getAuditLogs(
  opts: AuditQueryOptions = {}
): Promise<{ data: AuditLog[]; meta: { total: number; page: number; limit: number } }> {
  const limit = Math.min(opts.limit ?? 50, 200);
  const page = opts.page ?? 1;
  const offset = (page - 1) * limit;

  const conditions = [];
  if (opts.entity) conditions.push(eq(auditLogs.entity, opts.entity));
  if (opts.entityId) conditions.push(eq(auditLogs.entityId, opts.entityId));
  if (opts.action) conditions.push(eq(auditLogs.action, opts.action));

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const [rows, [{ value: rawTotal }]] = await Promise.all([
    db
      .select()
      .from(auditLogs)
      .where(where)
      .orderBy(desc(auditLogs.createdAt))
      .limit(limit)
      .offset(offset),
    db.select({ value: count() }).from(auditLogs).where(where),
  ]);

  return {
    data: rows.map(toAuditDto),
    meta: { total: Number(rawTotal), page, limit },
  };
}
