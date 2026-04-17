import { sql } from "drizzle-orm";
import { pgTable, pgEnum, text, varchar, integer, numeric, timestamp, boolean, jsonb, check } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import {
  PAGE_STATUSES,
  PAGE_SECTIONS,
  PAGE_ACCESSES,
  HERO_TYPES,
  MEDIA_TYPES,
  MEDIA_PLACEMENTS,
  MEDIA_STATUSES,
  AUDIT_ACTIONS,
  AUDIT_ENTITIES,
} from "./website-types";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull().default(""),
  nome: text("nome").notNull().default(""),
  email: text("email").notNull().unique(),
  telefone: text("telefone").notNull().default(""),
  cpf: text("cpf").notNull().default(""),
  role: text("role").notNull().default("user"),
  ativo: boolean("ativo").notNull().default(true),
  googleId: text("google_id").default(""),
  fotoUrl: text("foto_url").default(""),
  provider: text("provider").notNull().default("local"),
});

/* ─── Catálogo de Ingressos ──────────────────────────────── */

export const ticketCatalog = pgTable("ticket_catalog", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  group: text("group").notNull().default("INDEPENDENTE"),
  groupLabel: text("group_label").notNull().default("Independente"),
  basePrice: numeric("base_price", { precision: 10, scale: 2 }).notNull().default("0"),
  originalPrice: numeric("original_price", { precision: 10, scale: 2 }).notNull().default("0"),
  syncedAt: timestamp("synced_at").notNull().defaultNow(),
});

export const insertTicketCatalogSchema = createInsertSchema(ticketCatalog).omit({ syncedAt: true });
export type TicketCatalogRow = typeof ticketCatalog.$inferSelect;
export type InsertTicketCatalog = z.infer<typeof insertTicketCatalogSchema>;

/* ─── Gamificação ────────────────────────────────────────── */

export const gamificacaoPontos = pgTable("gamificacao_pontos", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  pontos: integer("pontos").notNull().default(0),
  streak: integer("streak").notNull().default(0),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const gamificacaoHistorico = pgTable("gamificacao_historico", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  motivo: text("motivo").notNull(),
  valor: integer("valor").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const gamificacaoConquistas = pgTable("gamificacao_conquistas", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  conquistaId: text("conquista_id").notNull(),
  desbloqueadaEm: timestamp("desbloqueada_em").notNull().defaultNow(),
});

/* ─── Controle de Acesso — Solicitações de Editor ─────────── */

export const accessRequests = pgTable("access_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  status: text("status").notNull().default("pending"),
  message: text("message").notNull().default(""),
  reviewedBy: text("reviewed_by"),
  reviewedAt: timestamp("reviewed_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type AccessRequest = typeof accessRequests.$inferSelect;
export type InsertAccessRequest = typeof accessRequests.$inferInsert;

/* ─── Zod Schemas ────────────────────────────────────────── */

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const registerSchema = z.object({
  nome: z.string().min(3, "Nome deve ter ao menos 3 caracteres"),
  email: z.string().email("E-mail inválido"),
  telefone: z.string().min(10, "Telefone inválido"),
  cpf: z.string().optional().transform(v => v?.replace(/\D/g, "") ?? ""),
  senha: z.string().min(6, "Senha deve ter ao menos 6 caracteres"),
  confirmarSenha: z.string(),
  termos: z.boolean().refine((v) => v === true, "Aceite os termos para continuar"),
}).refine((d) => d.senha === d.confirmarSenha, {
  message: "As senhas não coincidem",
  path: ["confirmarSenha"],
});

export const loginSchema = z.object({
  identificador: z.string().min(1, "Informe seu e-mail, telefone ou CPF"),
  senha: z.string().min(1, "Informe a senha"),
});

export const atividadeWizardSchema = z.object({
  id: z.string().optional(),
  label: z.string().min(1, "Label é obrigatório"),
  descricao: z.string().min(1, "Descrição é obrigatória"),
  icone: z.string().optional(),
});

export const insertAtividadeWizardSchema = atividadeWizardSchema.omit({ id: true });

/* ─── Enums de Pedido ─────────────────────────────────── */

export const PaymentMethodSchema = z.enum(["PIX", "CARTAO", "DINHEIRO"]);
export type PaymentMethod = z.infer<typeof PaymentMethodSchema>;

export const OrderStatusSchema = z.enum([
  "PENDING",
  "PAID",
  "APPROVED",
  "CANCELLED",
  "EXPIRED",
  "FAILED",
]);
export type OrderStatus = z.infer<typeof OrderStatusSchema>;

/* ─── Produto / Ingresso ─────────────────────────────── */

export const productSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  unitPrice: z.number().positive(),
  originalPrice: z.number().positive().optional(),
  discount: z.number().min(0).max(100).optional(),
  image: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  comboDates: z.record(z.string()).optional(),
});

export const insertProductSchema = productSchema.omit({ id: true });
export type Product = z.infer<typeof productSchema>;
export type InsertProduct = z.infer<typeof insertProductSchema>;

/* ─── CartItem ───────────────────────────────────────── */

export const cartItemSchema = z.object({
  ticketId: z.string().min(1),
  name: z.string().min(1),
  unitPrice: z.number().positive(),
  originalPrice: z.number().positive().optional(),
  discount: z.number().min(0).max(100).optional(),
  quantity: z.number().int().positive(),
  image: z.string().optional(),
  comboDates: z.record(z.string()).optional(),
});

export type CartItem = z.infer<typeof cartItemSchema>;

/* ─── Cliente do Pedido ──────────────────────────────── */

export const orderCustomerSchema = z.object({
  name: z.string().min(3, "Nome deve ter ao menos 3 caracteres"),
  email: z.string().email("E-mail inválido"),
  cpf: z
    .string()
    .transform((v) => v.replace(/\D/g, ""))
    .pipe(z.string().length(11, "CPF inválido")),
  phone: z
    .string()
    .transform((v) => v.replace(/\D/g, ""))
    .pipe(z.string().min(10, "Telefone inválido")),
});

export type OrderCustomer = z.infer<typeof orderCustomerSchema>;

/* ─── Pedido de Ingressos ────────────────────────────── */

export const orderSchema = z.object({
  id: z.string(),
  items: z.array(cartItemSchema).min(1, "Carrinho vazio"),
  customer: orderCustomerSchema,
  totalAmount: z.number().positive(),
  paymentMethod: PaymentMethodSchema,
  status: OrderStatusSchema,
  transactionId: z.string().optional(),
  qrCodeBase64: z.string().optional(),
  copyPasteCode: z.string().optional(),
  expirationDate: z.string().optional(),
  createdAt: z.string(),
});

export const insertOrderSchema = orderSchema.omit({ id: true, createdAt: true });
export type Order = z.infer<typeof orderSchema>;
export type InsertOrder = z.infer<typeof insertOrderSchema>;

/* ─── Types ──────────────────────────────────────────────── */

export type AtividadeWizard = {
  id: string;
  label: string;
  descricao: string;
  icone?: string;
};

export type InsertAtividadeWizard = z.infer<typeof insertAtividadeWizardSchema>;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

export type GamificacaoPontos = typeof gamificacaoPontos.$inferSelect;
export type GamificacaoHistorico = typeof gamificacaoHistorico.$inferSelect;
export type GamificacaoConquista = typeof gamificacaoConquistas.$inferSelect;

/* ─── Admin/Website Module — Drizzle Enums ───────────────────────────────── */

export const pageStatusEnum = pgEnum("page_status", PAGE_STATUSES);
export const pageSectionEnum = pgEnum("page_section", PAGE_SECTIONS);
export const pageAccessEnum = pgEnum("page_access", PAGE_ACCESSES);
export const heroTypeEnum = pgEnum("hero_type", HERO_TYPES);
export const mediaTypeEnum = pgEnum("media_type", MEDIA_TYPES);
export const mediaPlacementEnum = pgEnum("media_placement", MEDIA_PLACEMENTS);
export const mediaStatusEnum = pgEnum("media_status", MEDIA_STATUSES);
export const auditActionEnum = pgEnum("audit_action", AUDIT_ACTIONS);
export const auditEntityEnum = pgEnum("audit_entity", AUDIT_ENTITIES);
export const settingsKeyEnum = pgEnum("settings_key", ["general", "seo", "branding", "contact", "social"]);

/* ─── Admin/Website Module — Tables ─────────────────────────────────────── */

export const websitePages = pgTable("website_pages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  section: pageSectionEnum("section").notNull().default("outros"),
  access: pageAccessEnum("access").notNull().default("public"),
  content: jsonb("content").notNull().default({}),
  status: pageStatusEnum("status").notNull().default("draft"),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  bannerMediaId: varchar("banner_media_id"),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const websiteMedia = pgTable("website_media", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: mediaTypeEnum("type").notNull().default("image"),
  placement: mediaPlacementEnum("placement").notNull().default("misc"),
  status: mediaStatusEnum("status").notNull().default("active"),
  filename: text("filename").notNull(),
  originalName: text("original_name").notNull(),
  mimetype: text("mimetype").notNull(),
  sizeBytes: integer("size_bytes").notNull().default(0),
  url: text("url").notNull(),
  altText: text("alt_text"),
  pageId: varchar("page_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const websiteSettings = pgTable(
  "website_settings",
  {
    id: integer("id").primaryKey().default(1),
    siteName: text("site_name").notNull().default("RSV360"),
    logoMediaId: varchar("logo_media_id"),
    defaultBannerMediaId: varchar("default_banner_media_id"),
    heroType: heroTypeEnum("hero_type").notNull().default("image"),
    primaryColor: text("primary_color"),
    contactEmail: text("contact_email"),
    contactPhone: text("contact_phone"),
    socialLinks: jsonb("social_links"),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [check("website_settings_singleton", sql`${table.id} = 1`)]
);

export const websitePageVersions = pgTable("website_page_versions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  pageId: varchar("page_id").notNull(),
  content: jsonb("content").notNull().default({}),
  snapshot: jsonb("snapshot").notNull().default({}),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const auditLogs = pgTable("audit_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  entity: auditEntityEnum("entity").notNull(),
  entityId: varchar("entity_id").notNull(),
  action: auditActionEnum("action").notNull(),
  actorId: varchar("actor_id").notNull(),
  actorName: text("actor_name").notNull(),
  diff: jsonb("diff"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

/* ─── Insert schemas and types for website tables ─────────────────────────── */

export const insertWebsitePageSchema = createInsertSchema(websitePages).omit({ id: true, createdAt: true, updatedAt: true });
export const insertWebsiteMediaSchema = createInsertSchema(websiteMedia).omit({ id: true, createdAt: true, updatedAt: true });
export const insertWebsiteSettingsSchema = createInsertSchema(websiteSettings).omit({ updatedAt: true });
export const insertWebsitePageVersionSchema = createInsertSchema(websitePageVersions).omit({ id: true, createdAt: true });
export const insertAuditLogSchema = createInsertSchema(auditLogs).omit({ id: true, createdAt: true });

export type WebsitePageRow = typeof websitePages.$inferSelect;
export type InsertWebsitePage = z.infer<typeof insertWebsitePageSchema>;
export type WebsiteMediaRow = typeof websiteMedia.$inferSelect;
export type InsertWebsiteMedia = z.infer<typeof insertWebsiteMediaSchema>;
export type WebsiteSettingsRow = typeof websiteSettings.$inferSelect;
export type InsertWebsiteSettings = z.infer<typeof insertWebsiteSettingsSchema>;
export type WebsitePageVersionRow = typeof websitePageVersions.$inferSelect;
export type InsertWebsitePageVersion = z.infer<typeof insertWebsitePageVersionSchema>;
export type AuditLogRow = typeof auditLogs.$inferSelect;
export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;

/* ─── Re-export shared types ─────────────────────────────────────────────── */
export * from "./website-types";
