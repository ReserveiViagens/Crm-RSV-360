import { z } from "zod";

/* ─────────────────────────────────────────────────────────────────────────────
   RSV360 — Admin/Website Module — Zod Validators
   All incoming request validation for /api/admin/website and /api/website
   ───────────────────────────────────────────────────────────────────────────── */

/* ─── Enum schemas ───────────────────────────────────────────────────────── */

export const PageStatusSchema = z.enum(["draft", "published", "archived"]);

export const PageSectionSchema = z.enum([
  "main",
  "hoteis",
  "parques",
  "combos",
  "ingressos",
  "outros",
]);

export const MediaTypeSchema = z.enum(["image", "video", "document"]);

export const MediaPlacementSchema = z.enum([
  "hero",
  "card",
  "banner",
  "gallery",
  "avatar",
  "icon",
  "background",
  "misc",
]);

export const MediaStatusSchema = z.enum(["active", "archived", "orphan"]);

export const AuditActionSchema = z.enum([
  "create",
  "update",
  "delete",
  "publish",
  "unpublish",
  "upload",
  "swap",
  "unlink",
]);

export const AuditEntitySchema = z.enum(["page", "settings", "media"]);

/* ─── Common helpers ─────────────────────────────────────────────────────── */

const uuidParam = z.string().uuid("ID inválido (esperado UUID)");
const slugParam = z
  .string()
  .min(1)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug inválido (use apenas letras minúsculas, números e hífens)");

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida (formato esperado: YYYY-MM-DD)");

const hexColor = z
  .string()
  .regex(/^#[0-9A-Fa-f]{6}$/, "Cor inválida (formato esperado: #RRGGBB)");

/* ─── Page validators ────────────────────────────────────────────────────── */

export const createPageValidator = z.object({
  title: z.string().min(3, "Título deve ter ao menos 3 caracteres").max(200, "Título muito longo"),
  slug: slugParam,
  section: PageSectionSchema,
  content: z.record(z.unknown()).default({}),
  metaTitle: z.string().max(70, "Meta title deve ter no máximo 70 caracteres").optional(),
  metaDescription: z.string().max(160, "Meta description deve ter no máximo 160 caracteres").optional(),
  bannerMediaId: z.string().uuid("bannerMediaId inválido").optional(),
  status: PageStatusSchema.default("draft"),
});

export const updatePageValidator = z.object({
  title: z.string().min(3, "Título deve ter ao menos 3 caracteres").max(200).optional(),
  slug: slugParam.optional(),
  section: PageSectionSchema.optional(),
  content: z.record(z.unknown()).optional(),
  metaTitle: z.string().max(70).nullable().optional(),
  metaDescription: z.string().max(160).nullable().optional(),
  bannerMediaId: z.string().uuid("bannerMediaId inválido").nullable().optional(),
  status: PageStatusSchema.optional(),
}).refine(
  (data) => Object.keys(data).length > 0,
  "Ao menos um campo deve ser fornecido para atualização"
);

export const pageIdParamValidator = z.object({
  id: uuidParam,
});

export const pageSlugParamValidator = z.object({
  slug: slugParam,
});

export const pageListQueryValidator = z.object({
  status: PageStatusSchema.optional(),
  section: PageSectionSchema.optional(),
  search: z.string().max(200).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

/* ─── Settings validators ────────────────────────────────────────────────── */

export const updateSettingsValidator = z.object({
  siteName: z.string().min(1).max(100, "Nome do site deve ter no máximo 100 caracteres").optional(),
  logoMediaId: z.string().uuid("logoMediaId inválido").nullable().optional(),
  defaultBannerMediaId: z.string().uuid("defaultBannerMediaId inválido").nullable().optional(),
  primaryColor: hexColor.nullable().optional(),
  contactEmail: z.string().email("E-mail de contato inválido").nullable().optional(),
  contactPhone: z.string().max(30).nullable().optional(),
  socialLinks: z.record(z.string().url("URL de rede social inválida")).nullable().optional(),
}).refine(
  (data) => Object.keys(data).length > 0,
  "Ao menos um campo deve ser fornecido para atualização"
);

/* ─── Media validators ───────────────────────────────────────────────────── */

export const mediaQueryValidator = z.object({
  type: MediaTypeSchema.optional(),
  status: MediaStatusSchema.optional(),
  placement: MediaPlacementSchema.optional(),
  pageId: z.string().uuid("pageId inválido").optional(),
  search: z.string().max(200, "Busca muito longa").optional(),
  dateFrom: isoDate.optional(),
  dateTo: isoDate.optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
}).refine(
  (data) => {
    if (data.dateFrom && data.dateTo) {
      return data.dateFrom <= data.dateTo;
    }
    return true;
  },
  { message: "dateFrom não pode ser posterior a dateTo", path: ["dateFrom"] }
);

export const mediaUploadMetaValidator = z.object({
  altText: z.string().max(300, "Alt text muito longo").optional(),
  placement: MediaPlacementSchema.default("misc"),
  pageId: z.string().uuid("pageId inválido").nullable().optional(),
});

export const mediaUpdateValidator = z.object({
  altText: z.string().max(300).nullable().optional(),
  placement: MediaPlacementSchema.optional(),
  pageId: z.string().uuid("pageId inválido").nullable().optional(),
  status: MediaStatusSchema.optional(),
}).refine(
  (data) => Object.keys(data).length > 0,
  "Ao menos um campo deve ser fornecido para atualização"
);

export const mediaIdParamValidator = z.object({
  id: uuidParam,
});

export const mediaSwapValidator = z.object({
  id: uuidParam,
});

export const mediaDeleteQueryValidator = z.object({
  force: z
    .string()
    .optional()
    .transform((v) => v === "true"),
});

/* ─── Audit validators ───────────────────────────────────────────────────── */

export const auditQueryValidator = z.object({
  entity: AuditEntitySchema.optional(),
  entityId: z.string().uuid("entityId inválido").optional(),
  action: AuditActionSchema.optional(),
  actorId: z.string().optional(),
  dateFrom: isoDate.optional(),
  dateTo: isoDate.optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
}).refine(
  (data) => {
    if (data.dateFrom && data.dateTo) {
      return data.dateFrom <= data.dateTo;
    }
    return true;
  },
  { message: "dateFrom não pode ser posterior a dateTo", path: ["dateFrom"] }
);

/* ─── Inferred types ─────────────────────────────────────────────────────── */

export type CreatePageInput = z.infer<typeof createPageValidator>;
export type UpdatePageInput = z.infer<typeof updatePageValidator>;
export type PageListQuery = z.infer<typeof pageListQueryValidator>;
export type UpdateSettingsInput = z.infer<typeof updateSettingsValidator>;
export type MediaQueryInput = z.infer<typeof mediaQueryValidator>;
export type MediaUploadMetaInput = z.infer<typeof mediaUploadMetaValidator>;
export type MediaUpdateInput = z.infer<typeof mediaUpdateValidator>;
export type AuditQueryInput = z.infer<typeof auditQueryValidator>;
