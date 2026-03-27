import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { eq } from "drizzle-orm";
import { ticketCatalog } from "../../shared/schema.js";
import { TICKET_CATALOG } from "./ticket-catalog.js";
import { TICKET_GROUP_MAP, CATALOG_GROUP_LABELS } from "../../shared/catalog-groups.js";
import { generateSlug } from "../utils/slug.js";

export type SyncResult = {
  created: number;
  updated: number;
  total: number;
  dryRun: boolean;
  syncedAt: string;
};

export type SyncOptions = { dryRun?: boolean };

export async function runCatalogSync(options?: SyncOptions): Promise<SyncResult> {
  const dryRun = options?.dryRun ?? false;
  const now = new Date();
  const syncedAt = now.toISOString();

  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required");
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool);

  let created = 0;
  let updated = 0;

  if (!dryRun) {
    for (const ticket of TICKET_CATALOG) {
      const group = TICKET_GROUP_MAP[ticket.id] ?? "INDEPENDENTE";
      const groupLabel =
        CATALOG_GROUP_LABELS[group as keyof typeof CATALOG_GROUP_LABELS] ?? group;
      const slug = generateSlug(ticket.name);

      const existing = await db
        .select({ id: ticketCatalog.id, basePrice: ticketCatalog.basePrice })
        .from(ticketCatalog)
        .where(eq(ticketCatalog.id, ticket.id))
        .limit(1);

      const preservedBasePrice = existing.length > 0 ? existing[0].basePrice : "0";

      await db
        .insert(ticketCatalog)
        .values({
          id: ticket.id,
          name: ticket.name,
          slug,
          group,
          groupLabel,
          basePrice: preservedBasePrice,
          originalPrice: String(ticket.originalPrice),
          syncedAt: now,
        })
        .onConflictDoUpdate({
          target: ticketCatalog.id,
          set: {
            name: ticket.name,
            slug,
            group,
            groupLabel,
            originalPrice: String(ticket.originalPrice),
            syncedAt: now,
          },
        });

      if (existing.length === 0) {
        created++;
      } else {
        updated++;
      }
    }
  } else {
    updated = TICKET_CATALOG.length;
  }

  await pool.end();

  const total = TICKET_CATALOG.length;
  console.log(`[catalog-sync] created: ${created}, updated: ${updated}, total: ${total}, dryRun: ${dryRun}`);

  return { created, updated, total, dryRun, syncedAt };
}
