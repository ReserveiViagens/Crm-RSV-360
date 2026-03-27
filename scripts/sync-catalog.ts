import path from "path";
import fs from "fs";
import { TICKET_CATALOG } from "../server/services/ticket-catalog";
import { TICKET_GROUP_MAP, CATALOG_GROUP_LABELS } from "../shared/catalog-groups";
import { generateSlug } from "../server/utils/slug";

const DB_PATH = path.join(process.cwd(), "data", "db.json");

type CatalogEntry = {
  id: string;
  name: string;
  slug: string;
  group: string;
  groupLabel: string;
  basePrice: number;
  originalPrice: number;
  syncedAt: string;
};

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

function syncCatalog(): void {
  const db = loadDb();
  const existing = (db.ticketCatalogStore ?? {}) as Record<string, CatalogEntry>;

  let created = 0;
  let updated = 0;

  const now = new Date().toISOString();

  for (const ticket of TICKET_CATALOG) {
    const group = TICKET_GROUP_MAP[ticket.id] ?? "INDEPENDENTE";
    const groupLabel = CATALOG_GROUP_LABELS[group as keyof typeof CATALOG_GROUP_LABELS] ?? group;
    const slug = generateSlug(ticket.name);

    const prev = existing[ticket.id];

    const entry: CatalogEntry = {
      id: ticket.id,
      name: ticket.name,
      slug,
      group,
      groupLabel,
      basePrice: prev?.basePrice ?? 0,
      originalPrice: ticket.originalPrice,
      syncedAt: now,
    };

    if (!prev) {
      created++;
    } else {
      updated++;
    }

    existing[ticket.id] = entry;
  }

  db.ticketCatalogStore = existing;
  saveDb(db);

  console.log(`[sync-catalog] Done — created: ${created}, updated: ${updated}, total: ${Object.keys(existing).length}`);
}

syncCatalog();
