export const CATALOG_GROUPS = {
  DIROMA: "DIROMA",
  PRIVE: "PRIVE",
  GOLDEN_DOLPHIN: "GOLDEN_DOLPHIN",
  RIO_QUENTE: "RIO_QUENTE",
  INDEPENDENTE: "INDEPENDENTE",
} as const;

export type CatalogGroup = (typeof CATALOG_GROUPS)[keyof typeof CATALOG_GROUPS];

export const CATALOG_GROUP_LABELS: Record<CatalogGroup, string> = {
  DIROMA: "DiRoma Hotels",
  PRIVE: "Privê Caldas",
  GOLDEN_DOLPHIN: "Golden Dolphin",
  RIO_QUENTE: "Rio Quente Resorts",
  INDEPENDENTE: "Independente",
};

export const CATALOG_GROUP_SLUGS: Record<CatalogGroup, string> = {
  DIROMA: "diroma",
  PRIVE: "prive",
  GOLDEN_DOLPHIN: "golden-dolphin",
  RIO_QUENTE: "rio-quente",
  INDEPENDENTE: "independente",
};

export const TICKET_GROUP_MAP: Record<string, CatalogGroup> = {
  "hot-park": CATALOG_GROUPS.RIO_QUENTE,
  "hot-park-crianca": CATALOG_GROUPS.RIO_QUENTE,
  "ingresso-vip": CATALOG_GROUPS.RIO_QUENTE,
  "ingresso-noturno": CATALOG_GROUPS.RIO_QUENTE,
  "morador-hot-park": CATALOG_GROUPS.RIO_QUENTE,
  "diroma-acqua-park": CATALOG_GROUPS.DIROMA,
  "morador-diroma": CATALOG_GROUPS.DIROMA,
  "lagoa-termas": CATALOG_GROUPS.DIROMA,
  "morador-lagoa": CATALOG_GROUPS.DIROMA,
  "passaporte-kawana": CATALOG_GROUPS.GOLDEN_DOLPHIN,
  "morador-kawana": CATALOG_GROUPS.GOLDEN_DOLPHIN,
  "water-park": CATALOG_GROUPS.INDEPENDENTE,
  "kawana-park": CATALOG_GROUPS.GOLDEN_DOLPHIN,
  "combo-3-parques": CATALOG_GROUPS.INDEPENDENTE,
  "transp-goiania": CATALOG_GROUPS.INDEPENDENTE,
  "transp-brasilia": CATALOG_GROUPS.INDEPENDENTE,
  "cabana-standard": CATALOG_GROUPS.RIO_QUENTE,
  "cabana-premium": CATALOG_GROUPS.RIO_QUENTE,
  "cabana-exclusive": CATALOG_GROUPS.RIO_QUENTE,
  "ingresso-open-hotel": CATALOG_GROUPS.RIO_QUENTE,
  "meia-idoso": CATALOG_GROUPS.INDEPENDENTE,
  "meia-estudante": CATALOG_GROUPS.INDEPENDENTE,
  "meia-pcd": CATALOG_GROUPS.INDEPENDENTE,
  "meia-professor": CATALOG_GROUPS.INDEPENDENTE,
  "parque-hotpark": CATALOG_GROUPS.RIO_QUENTE,
  "parque-diroma": CATALOG_GROUPS.DIROMA,
  "parque-lagoa": CATALOG_GROUPS.DIROMA,
};
