import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { eq } from "drizzle-orm";
import { ticketCatalog } from "../shared/schema.js";
import { TICKET_CATALOG } from "../server/services/ticket-catalog.js";
import { TICKET_GROUP_MAP, CATALOG_GROUP_LABELS } from "../shared/catalog-groups.js";
import { generateSlug } from "../server/utils/slug.js";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required — set the env var before running this script");
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

export type SyncResult = { created: number; updated: number; total: number };

export async function syncCatalog(): Promise<SyncResult> {
  const now = new Date();
  let created = 0;
  let updated = 0;

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

  const total = TICKET_CATALOG.length;
  console.log(`[sync-catalog] Done — created: ${created}, updated: ${updated}, total: ${total}`);

  await pool.end();
  return { created, updated, total };
}

syncCatalog().catch((err) => {
  console.error("[sync-catalog] Error:", err);
  process.exit(1);
});
