import path from "path";
import fs from "fs";
import { TICKET_CATALOG } from "../services/ticket-catalog.js";
import { TICKET_GROUP_MAP, CATALOG_GROUP_LABELS, CATALOG_GROUPS } from "../../shared/catalog-groups.js";
import { generateSlug } from "../utils/slug.js";

const DB_PATH = path.join(process.cwd(), "data", "db.json");

type HotelDemo = {
  id: string;
  name: string;
  slug: string;
  group: string;
  groupLabel: string;
  stars: number;
  pricePerNight: number;
  description: string;
};

type ParkDemo = {
  id: string;
  name: string;
  slug: string;
  group: string;
  groupLabel: string;
  admissionPrice: number;
  description: string;
};

const DEMO_HOTELS: HotelDemo[] = [
  {
    id: "hotel-di-roma-grand", name: "Di Roma Grand Hotel", slug: "di-roma-grand-hotel",
    group: CATALOG_GROUPS.DIROMA, groupLabel: CATALOG_GROUP_LABELS.DIROMA,
    stars: 5, pricePerNight: 280,
    description: "Resort 5 estrelas com 18 piscinas termais, toboáguas e spa completo.",
  },
  {
    id: "hotel-di-roma-acqua", name: "Di Roma Acqua Hotel", slug: "di-roma-acqua-hotel",
    group: CATALOG_GROUPS.DIROMA, groupLabel: CATALOG_GROUP_LABELS.DIROMA,
    stars: 4, pricePerNight: 210,
    description: "Hotel com acesso direto ao Acqua Park e café da manhã incluso.",
  },
  {
    id: "hotel-prive-thermas-1", name: "Privê Thermas Resort I", slug: "prive-thermas-resort-i",
    group: CATALOG_GROUPS.PRIVE, groupLabel: CATALOG_GROUP_LABELS.PRIVE,
    stars: 4, pricePerNight: 195,
    description: "Resort com piscinas termais naturais e área de lazer completa.",
  },
  {
    id: "hotel-prive-thermas-2", name: "Privê Thermas Resort II", slug: "prive-thermas-resort-ii",
    group: CATALOG_GROUPS.PRIVE, groupLabel: CATALOG_GROUP_LABELS.PRIVE,
    stars: 5, pricePerNight: 320,
    description: "Torre Premium com suítes de frente para as piscinas termais.",
  },
  {
    id: "hotel-golden-dolphin-grand", name: "Golden Dolphin Grand Hotel", slug: "golden-dolphin-grand-hotel",
    group: CATALOG_GROUPS.GOLDEN_DOLPHIN, groupLabel: CATALOG_GROUP_LABELS.GOLDEN_DOLPHIN,
    stars: 5, pricePerNight: 350,
    description: "O mais luxuoso resort de Caldas Novas com parque aquático exclusivo.",
  },
  {
    id: "hotel-golden-dolphin-express", name: "Golden Dolphin Express", slug: "golden-dolphin-express",
    group: CATALOG_GROUPS.GOLDEN_DOLPHIN, groupLabel: CATALOG_GROUP_LABELS.GOLDEN_DOLPHIN,
    stars: 3, pricePerNight: 160,
    description: "Hotel econômico com acesso ao complexo Golden Dolphin.",
  },
  {
    id: "hotel-rio-quente-resorts", name: "Rio Quente Resorts — Torre Azul", slug: "rio-quente-resorts-torre-azul",
    group: CATALOG_GROUPS.RIO_QUENTE, groupLabel: CATALOG_GROUP_LABELS.RIO_QUENTE,
    stars: 5, pricePerNight: 480,
    description: "Resort all inclusive com acesso ao Hot Park e Rio de Águas Quentes.",
  },
  {
    id: "hotel-pousada-hot-park", name: "Pousada Hot Park — Rio Quente", slug: "pousada-hot-park-rio-quente",
    group: CATALOG_GROUPS.RIO_QUENTE, groupLabel: CATALOG_GROUP_LABELS.RIO_QUENTE,
    stars: 3, pricePerNight: 220,
    description: "Pousada com acesso ao complexo Hot Park e café da manhã.",
  },
  {
    id: "hotel-independente-villa", name: "Villa Termal Caldas", slug: "villa-termal-caldas",
    group: CATALOG_GROUPS.INDEPENDENTE, groupLabel: CATALOG_GROUP_LABELS.INDEPENDENTE,
    stars: 3, pricePerNight: 140,
    description: "Hotel independente próximo ao centro de Caldas Novas.",
  },
  {
    id: "hotel-independente-eco", name: "Eco Pousada Caldas Novas", slug: "eco-pousada-caldas-novas",
    group: CATALOG_GROUPS.INDEPENDENTE, groupLabel: CATALOG_GROUP_LABELS.INDEPENDENTE,
    stars: 2, pricePerNight: 95,
    description: "Pousada econômica para quem busca apenas hospedagem simples.",
  },
];

const DEMO_PARKS: ParkDemo[] = [
  {
    id: "parque-di-roma-acqua", name: "Di Roma Acqua Park", slug: "di-roma-acqua-park",
    group: CATALOG_GROUPS.DIROMA, groupLabel: CATALOG_GROUP_LABELS.DIROMA,
    admissionPrice: 130,
    description: "8 toboáguas, piscinas termais e área infantil.",
  },
  {
    id: "parque-prive-thermas", name: "Privê Parque Termal", slug: "prive-parque-termal",
    group: CATALOG_GROUPS.PRIVE, groupLabel: CATALOG_GROUP_LABELS.PRIVE,
    admissionPrice: 110,
    description: "Piscinas termais naturais e toboáguas radicais.",
  },
  {
    id: "parque-kawana", name: "Kawana Water Park", slug: "kawana-water-park",
    group: CATALOG_GROUPS.GOLDEN_DOLPHIN, groupLabel: CATALOG_GROUP_LABELS.GOLDEN_DOLPHIN,
    admissionPrice: 155,
    description: "12 atrações aquáticas, rio lento e piscina de ondas.",
  },
  {
    id: "parque-hot-park", name: "Hot Park", slug: "hot-park",
    group: CATALOG_GROUPS.RIO_QUENTE, groupLabel: CATALOG_GROUP_LABELS.RIO_QUENTE,
    admissionPrice: 189,
    description: "O maior parque aquático de águas quentes do mundo — 13 atrações.",
  },
  {
    id: "parque-lagoa-quente", name: "Lagoa Quente Thermas", slug: "lagoa-quente-thermas",
    group: CATALOG_GROUPS.INDEPENDENTE, groupLabel: CATALOG_GROUP_LABELS.INDEPENDENTE,
    admissionPrice: 75,
    description: "Complexo termal independente com águas naturalmente aquecidas.",
  },
];

function loadDb(): Record<string, unknown> {
  try {
    if (fs.existsSync(DB_PATH)) {
      return JSON.parse(fs.readFileSync(DB_PATH, "utf-8")) as Record<string, unknown>;
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

  const ticketStore = (db.ticketCatalogStore ?? {}) as Record<string, unknown>;
  let ticketsSeeded = 0;
  for (const ticket of TICKET_CATALOG) {
    if (ticketStore[ticket.id]) continue;
    const group = TICKET_GROUP_MAP[ticket.id] ?? "INDEPENDENTE";
    const groupLabel =
      CATALOG_GROUP_LABELS[group as keyof typeof CATALOG_GROUP_LABELS] ?? group;
    ticketStore[ticket.id] = {
      id: ticket.id,
      name: ticket.name,
      slug: generateSlug(ticket.name),
      group,
      groupLabel,
      basePrice: 0,
      originalPrice: ticket.originalPrice,
      syncedAt: now,
    };
    ticketsSeeded++;
  }
  db.ticketCatalogStore = ticketStore;

  const hotelStore = (db.hotelDemoStore ?? {}) as Record<string, unknown>;
  let hotelsSeeded = 0;
  for (const hotel of DEMO_HOTELS) {
    if (hotelStore[hotel.id]) continue;
    hotelStore[hotel.id] = { ...hotel, seededAt: now };
    hotelsSeeded++;
  }
  db.hotelDemoStore = hotelStore;

  const parkStore = (db.parkDemoStore ?? {}) as Record<string, unknown>;
  let parksSeeded = 0;
  for (const park of DEMO_PARKS) {
    if (parkStore[park.id]) continue;
    parkStore[park.id] = { ...park, seededAt: now };
    parksSeeded++;
  }
  db.parkDemoStore = parkStore;

  saveDb(db);

  if (ticketsSeeded > 0 || hotelsSeeded > 0 || parksSeeded > 0) {
    console.log(
      `[seed] tickets: ${ticketsSeeded} | hotels: ${hotelsSeeded} | parks: ${parksSeeded} (basePrice=0 até tarifa oficial)`,
    );
  } else {
    console.log("[seed] Nenhuma entrada nova — banco já populado (idempotente)");
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runSeed();
}

function fileURLToPath(url: string): string {
  return new URL(url).pathname;
}
