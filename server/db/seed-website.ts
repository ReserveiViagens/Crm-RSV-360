import { eq } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { websitePages, websiteSettings, websiteMedia } from "../../shared/schema.js";

/* ─────────────────────────────────────────────────────────────────────────────
   RSV360 — Website CMS seed (idempotente)
   Rodando 2× não duplica dados. Usa verificação por slug/id/url antes de inserir.
   ───────────────────────────────────────────────────────────────────────────── */

const DEMO_PAGES = [
  {
    slug: "home",
    title: "Página Inicial",
    section: "main" as const,
    status: "published" as const,
    metaTitle: "RSV360 — Caldas Novas e Rio Quente",
    metaDescription:
      "Ingressos e pacotes para os melhores parques aquáticos de Caldas Novas e Rio Quente. Reservas rápidas e seguras.",
    content: {
      hero: {
        headline: "O melhor das águas termais do Brasil",
        subheadline: "Ingressos para Hot Park, DiRoma, Kawana e muito mais",
        cta: "Comprar ingressos",
      },
    },
    publishedAt: new Date("2026-01-01"),
  },
  {
    slug: "sobre",
    title: "Sobre Nós",
    section: "main" as const,
    status: "published" as const,
    metaTitle: "Sobre a RSV360 — Quem somos",
    metaDescription:
      "A RSV360 é especialista em turismo termal em Caldas Novas e Rio Quente, Goiás.",
    content: {
      intro:
        "Somos uma plataforma especializada em reservas para os parques aquáticos e resorts de Caldas Novas e Rio Quente.",
    },
    publishedAt: new Date("2026-01-01"),
  },
  {
    slug: "contato",
    title: "Contato",
    section: "main" as const,
    status: "published" as const,
    metaTitle: "Fale Conosco — RSV360",
    metaDescription: "Entre em contato com a RSV360 para dúvidas, reservas e atendimento.",
    content: {
      email: "contato@reservei.com.br",
      phone: "+55 64 99999-0000",
    },
    publishedAt: new Date("2026-01-01"),
  },
  {
    slug: "politica-de-privacidade",
    title: "Política de Privacidade",
    section: "main" as const,
    status: "published" as const,
    metaTitle: "Política de Privacidade — RSV360",
    metaDescription: "Como a RSV360 coleta, usa e protege seus dados pessoais.",
    content: {
      lastUpdated: "2026-01-01",
      sections: ["Coleta de dados", "Uso de dados", "Segurança", "Seus direitos"],
    },
    publishedAt: new Date("2026-01-01"),
  },
  {
    slug: "parques-aquaticos-caldas-novas",
    title: "Parques Aquáticos — Caldas Novas",
    section: "parques" as const,
    status: "published" as const,
    metaTitle: "Parques Aquáticos em Caldas Novas — Ingressos RSV360",
    metaDescription:
      "Compre ingressos para DiRoma Acqua Park, Lagoa Termas, Privê Thermas e outros parques de Caldas Novas.",
    content: {
      featured: ["DiRoma Acqua Park", "Lagoa Termas Parque", "Privê Thermas"],
      highlights: "Mais de 50 atrações aquáticas com águas termais naturais.",
    },
    publishedAt: new Date("2026-01-01"),
  },
  {
    slug: "rio-quente-resorts",
    title: "Rio Quente Resorts",
    section: "hoteis" as const,
    status: "published" as const,
    metaTitle: "Rio Quente Resorts — Hot Park e Kawana | RSV360",
    metaDescription:
      "Pacotes e ingressos para Rio Quente Resorts: Hot Park, Kawana Park e Golden Dolphin.",
    content: {
      resorts: ["Rio Quente Resorts", "Golden Dolphin"],
      parks: ["Hot Park", "Kawana Park"],
    },
    publishedAt: new Date("2026-01-01"),
  },
];

const DEFAULT_SETTINGS = {
  id: 1,
  siteName: "RSV360",
  primaryColor: "#1a56db",
  contactEmail: "contato@reservei.com.br",
  contactPhone: "+55 64 99999-0000",
  socialLinks: {
    instagram: "https://instagram.com/reservei",
    whatsapp: "https://wa.me/5564999990000",
  },
};

const DEMO_MEDIA = [
  {
    filename: "hero-home-caldas-novas.jpg",
    originalName: "hero-home-caldas-novas.jpg",
    mimetype: "image/jpeg",
    sizeBytes: 0,
    url: "/uploads/website/hero-home-caldas-novas.jpg",
    altText: "Vista aérea das águas termais de Caldas Novas",
    type: "image" as const,
    placement: "hero" as const,
    status: "active" as const,
  },
  {
    filename: "logo-rsv360.png",
    originalName: "logo-rsv360.png",
    mimetype: "image/png",
    sizeBytes: 0,
    url: "/uploads/website/logo-rsv360.png",
    altText: "Logo RSV360",
    type: "image" as const,
    placement: "avatar" as const,
    status: "active" as const,
  },
  {
    filename: "banner-hot-park.jpg",
    originalName: "banner-hot-park.jpg",
    mimetype: "image/jpeg",
    sizeBytes: 0,
    url: "/uploads/website/banner-hot-park.jpg",
    altText: "Hot Park — Rio Quente Resorts",
    type: "image" as const,
    placement: "banner" as const,
    status: "active" as const,
  },
];

export async function seedWebsite(db: NodePgDatabase): Promise<void> {
  let pagesSeeded = 0;
  let pagesSkipped = 0;

  for (const page of DEMO_PAGES) {
    const existing = await db
      .select({ id: websitePages.id })
      .from(websitePages)
      .where(eq(websitePages.slug, page.slug))
      .limit(1);

    if (existing.length > 0) {
      pagesSkipped++;
      continue;
    }

    await db.insert(websitePages).values({
      title: page.title,
      slug: page.slug,
      section: page.section,
      status: page.status,
      metaTitle: page.metaTitle,
      metaDescription: page.metaDescription,
      content: page.content,
      publishedAt: page.publishedAt,
    });

    pagesSeeded++;
  }

  const existingSettings = await db
    .select({ id: websiteSettings.id })
    .from(websiteSettings)
    .where(eq(websiteSettings.id, 1))
    .limit(1);

  let settingsAction: "created" | "skipped";
  if (existingSettings.length === 0) {
    await db.insert(websiteSettings).values(DEFAULT_SETTINGS);
    settingsAction = "created";
  } else {
    settingsAction = "skipped";
  }

  let mediaSeeded = 0;
  let mediaSkipped = 0;

  for (const media of DEMO_MEDIA) {
    const existing = await db
      .select({ id: websiteMedia.id })
      .from(websiteMedia)
      .where(eq(websiteMedia.url, media.url))
      .limit(1);

    if (existing.length > 0) {
      mediaSkipped++;
      continue;
    }

    await db.insert(websiteMedia).values(media);
    mediaSeeded++;
  }

  console.log(
    `[seed] website_pages: ${pagesSeeded} criadas, ${pagesSkipped} já existiam (idempotente)`
  );
  console.log(`[seed] website_settings: ${settingsAction} (singleton)`);
  console.log(
    `[seed] website_media: ${mediaSeeded} criadas, ${mediaSkipped} já existiam (idempotente)`
  );
}
