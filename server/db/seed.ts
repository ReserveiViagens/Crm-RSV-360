import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { eq } from "drizzle-orm";
import { ticketCatalog } from "../../shared/schema.js";
import { TICKET_CATALOG } from "../services/ticket-catalog.js";
import { TICKET_GROUP_MAP, CATALOG_GROUP_LABELS } from "../../shared/catalog-groups.js";
import { generateSlug } from "../utils/slug.js";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required");
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

export async function runSeed(): Promise<void> {
  const now = new Date();
  let seeded = 0;

  for (const ticket of TICKET_CATALOG) {
    const existing = await db
      .select({ id: ticketCatalog.id })
      .from(ticketCatalog)
      .where(eq(ticketCatalog.id, ticket.id))
      .limit(1);

    if (existing.length > 0) continue;

    const group = TICKET_GROUP_MAP[ticket.id] ?? "INDEPENDENTE";
    const groupLabel =
      CATALOG_GROUP_LABELS[group as keyof typeof CATALOG_GROUP_LABELS] ?? group;

    await db.insert(ticketCatalog).values({
      id: ticket.id,
      name: ticket.name,
      slug: generateSlug(ticket.name),
      group,
      groupLabel,
      basePrice: "0",
      originalPrice: String(ticket.originalPrice),
      syncedAt: now,
    });
    seeded++;
  }

  if (seeded > 0) {
    console.log(`[seed] ticket_catalog: ${seeded} entradas criadas (basePrice=0 até tarifa oficial)`);
  } else {
    console.log("[seed] ticket_catalog: nenhuma entrada nova (idempotente)");
  }

  await pool.end();
}

runSeed().catch((err) => {
  console.error("[seed] Error:", err);
  process.exit(1);
});
