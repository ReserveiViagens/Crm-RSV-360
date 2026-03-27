import path from "path";
import fs from "fs";
import { TICKET_CATALOG } from "../services/ticket-catalog";
import { TICKET_GROUP_MAP, CATALOG_GROUP_LABELS } from "../../shared/catalog-groups";
import { generateSlug } from "../utils/slug";

const DB_PATH = path.join(process.cwd(), "data", "db.json");

function loadDb(): Record<string, unknown> {
  try {
    if (fs.existsSync(DB_PATH)) {
      return JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
    }
  } catch {
    // ignore
  }
  return {};
}

function saveDb(db: Record<string, unknown>): void {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
}

export function runSeed(): void {
  const db = loadDb();
  const now = new Date().toISOString();

  const existing = (db.ticketCatalogStore ?? {}) as Record<string, unknown>;
  let seeded = 0;

  for (const ticket of TICKET_CATALOG) {
    if (existing[ticket.id]) continue;

    const group = TICKET_GROUP_MAP[ticket.id] ?? "INDEPENDENTE";
    const groupLabel = CATALOG_GROUP_LABELS[group as keyof typeof CATALOG_GROUP_LABELS] ?? group;

    existing[ticket.id] = {
      id: ticket.id,
      name: ticket.name,
      slug: generateSlug(ticket.name),
      group,
      groupLabel,
      basePrice: 0,
      originalPrice: ticket.originalPrice,
      syncedAt: now,
    };
    seeded++;
  }

  if (seeded > 0) {
    db.ticketCatalogStore = existing;
    saveDb(db);
    console.log(`[seed] Ticket catalog: ${seeded} entradas criadas (basePrice=0 até tarifa oficial ser sincronizada)`);
  } else {
    console.log("[seed] Ticket catalog: nenhuma entrada nova (já populado)");
  }
}

if (require.main === module) {
  runSeed();
}
