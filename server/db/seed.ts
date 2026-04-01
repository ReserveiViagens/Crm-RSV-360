import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { eq } from "drizzle-orm";
import { ticketCatalog } from "../../shared/schema.js";
import { CATALOG_GROUP_LABELS } from "../../shared/catalog-groups.js";
import { generateSlug } from "../utils/slug.js";
import { seedWebsite } from "./seed-website.js";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required");
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

type DemoEntry = {
  id: string;
  name: string;
  group: string;
  basePrice: string;
  originalPrice: string;
};

const DEMO_SEED: DemoEntry[] = [
  // ─── DIROMA ──────────────────────────────────────────────────────────────
  { id: "diroma-acqua-park",  name: "DiRoma Acqua Park — Ingresso Adulto",  group: "DIROMA", basePrice: "130", originalPrice: "155" },
  { id: "lagoa-termas",       name: "Lagoa Termas Parque — Ingresso Adulto", group: "DIROMA", basePrice: "75",  originalPrice: "95"  },
  { id: "parque-diroma",      name: "Di Roma Acqua Park",                    group: "DIROMA", basePrice: "130", originalPrice: "155" },

  // ─── PRIVE ───────────────────────────────────────────────────────────────
  { id: "prive-day-use",          name: "Privê Thermas — Day Use Adulto",   group: "PRIVE", basePrice: "110", originalPrice: "140" },
  { id: "prive-day-use-crianca",  name: "Privê Thermas — Day Use Criança",  group: "PRIVE", basePrice: "65",  originalPrice: "85"  },
  { id: "prive-parque-termal",    name: "Privê Parque Termal — Ingresso",   group: "PRIVE", basePrice: "120", originalPrice: "155" },

  // ─── GOLDEN DOLPHIN ──────────────────────────────────────────────────────
  { id: "passaporte-kawana",  name: "Passaporte Kawana — Adulto",            group: "GOLDEN_DOLPHIN", basePrice: "165", originalPrice: "200" },
  { id: "morador-kawana",     name: "Ingresso Morador Kawana",               group: "GOLDEN_DOLPHIN", basePrice: "80",  originalPrice: "100" },
  { id: "kawana-park",        name: "Kawana Park — Ingresso Parque Aquático",group: "GOLDEN_DOLPHIN", basePrice: "140", originalPrice: "180" },

  // ─── RIO QUENTE ──────────────────────────────────────────────────────────
  { id: "hot-park",           name: "Hot Park — Ingresso Adulto",            group: "RIO_QUENTE", basePrice: "189", originalPrice: "220" },
  { id: "hot-park-crianca",   name: "Hot Park — Ingresso Criança (até 12)",  group: "RIO_QUENTE", basePrice: "100", originalPrice: "130" },
  { id: "parque-hotpark",     name: "Hot Park",                              group: "RIO_QUENTE", basePrice: "189", originalPrice: "220" },

  // ─── INDEPENDENTE ────────────────────────────────────────────────────────
  { id: "water-park",         name: "Water Park — Ingresso Adulto",          group: "INDEPENDENTE", basePrice: "60", originalPrice: "80" },
  { id: "meia-idoso",         name: "Meia-Entrada — Idoso (60+)",            group: "INDEPENDENTE", basePrice: "95", originalPrice: "189" },
  { id: "combo-3-parques",    name: "Combo 3 Parques — Pacote Família",      group: "INDEPENDENTE", basePrice: "320", originalPrice: "430" },
];

export async function runSeed(): Promise<void> {
  const now = new Date();
  let seeded = 0;

  for (const entry of DEMO_SEED) {
    const existing = await db
      .select({ id: ticketCatalog.id })
      .from(ticketCatalog)
      .where(eq(ticketCatalog.id, entry.id))
      .limit(1);

    if (existing.length > 0) continue;

    const groupLabel =
      CATALOG_GROUP_LABELS[entry.group as keyof typeof CATALOG_GROUP_LABELS] ?? entry.group;

    await db.insert(ticketCatalog).values({
      id: entry.id,
      name: entry.name,
      slug: generateSlug(entry.name),
      group: entry.group,
      groupLabel,
      basePrice: entry.basePrice,
      originalPrice: entry.originalPrice,
      syncedAt: now,
    });
    seeded++;
  }

  if (seeded > 0) {
    console.log(`[seed] ticket_catalog: ${seeded} entradas demo criadas (5 grupos, ≥2 hotéis + 1 parque por grupo)`);
  } else {
    console.log("[seed] ticket_catalog: nenhuma entrada nova (idempotente)");
  }

  await seedWebsite(db);

  await pool.end();
}

runSeed().catch((err) => {
  console.error("[seed] Error:", err);
  process.exit(1);
});
