/* ─────────────────────────────────────────────────────────────────────────────
   RSV360 — Admin/Website Module — Shared Types
   Canonical source of truth for ALL types in this module.
   Server imports: import { ... } from '../../shared/website-types'
   Client imports: import type { ... } from '@shared/website-types'

   Design rule: enum literals live ONCE here as const arrays.
   Both TS types and Zod schemas derive from these arrays — no duplication.
   ───────────────────────────────────────────────────────────────────────────── */

/* ─── Enum const arrays (single source of truth) ────────────────────────── */

export const PAGE_STATUSES = ["draft", "published", "archived"] as const;
export const PAGE_SECTIONS = [
  "main",
  "hoteis",
  "parques",
  "combos",
  "ingressos",
  "outros",
] as const;
export const PAGE_ACCESSES = ["public", "authenticated", "admin"] as const;
export const HERO_TYPES = ["image", "video", "none"] as const;
export const MEDIA_TYPES = ["image", "video", "document"] as const;
export const MEDIA_PLACEMENTS = [
  "hero",
  "card",
  "banner",
  "gallery",
  "avatar",
  "icon",
  "background",
  "misc",
] as const;
export const MEDIA_STATUSES = ["active", "archived", "orphan"] as const;
export const AUDIT_ACTIONS = [
  "create",
  "update",
  "delete",
  "publish",
  "unpublish",
  "upload",
  "swap",
  "unlink",
] as const;
export const AUDIT_ENTITIES = ["page", "settings", "media"] as const;

/* ─── Enum types (derived from const arrays) ─────────────────────────────── */

export type PageStatus = (typeof PAGE_STATUSES)[number];
export type PageSection = (typeof PAGE_SECTIONS)[number];
export type PageAccess = (typeof PAGE_ACCESSES)[number];
export type HeroType = (typeof HERO_TYPES)[number];
export type MediaType = (typeof MEDIA_TYPES)[number];
export type MediaPlacement = (typeof MEDIA_PLACEMENTS)[number];
export type MediaStatus = (typeof MEDIA_STATUSES)[number];
export type AuditAction = (typeof AUDIT_ACTIONS)[number];
export type AuditEntity = (typeof AUDIT_ENTITIES)[number];

/* ─── Constants ──────────────────────────────────────────────────────────── */

export const PROTECTED_ROUTES = [
  "home",
  "sobre",
  "contato",
  "politica-de-privacidade",
] as const;

export type ProtectedRoute = (typeof PROTECTED_ROUTES)[number];

/* ─── Core Entities ──────────────────────────────────────────────────────── */

export interface WebsitePage {
  id: string;
  title: string;
  slug: string;
  section: PageSection;
  access: PageAccess;
  content: Record<string, unknown>;
  status: PageStatus;
  metaTitle: string | null;
  metaDescription: string | null;
  bannerMediaId: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

export interface WebsiteMedia {
  id: string;
  type: MediaType;
  placement: MediaPlacement;
  status: MediaStatus;
  filename: string;
  originalName: string;
  mimetype: string;
  sizeBytes: number;
  url: string;
  altText: string | null;
  pageId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface WebsiteSettings {
  id: number;
  siteName: string;
  logoMediaId: string | null;
  defaultBannerMediaId: string | null;
  heroType: HeroType;
  primaryColor: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  socialLinks: Record<string, string> | null;
  updatedAt: string;
}

export interface WebsitePageVersion {
  id: string;
  pageId: string;
  content: Record<string, unknown>;
  snapshot: WebsitePage;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  entity: AuditEntity;
  entityId: string;
  action: AuditAction;
  actorId: string;
  actorName: string;
  diff: Record<string, unknown> | null;
  createdAt: string;
}

/* ─── Admin Request DTOs ─────────────────────────────────────────────────── */

export interface CreatePageRequest {
  title: string;
  slug: string;
  section: PageSection;
  access?: PageAccess;
  content: Record<string, unknown>;
  metaTitle?: string;
  metaDescription?: string;
  bannerMediaId?: string;
  status?: PageStatus;
}

export interface UpdatePageRequest {
  title?: string;
  slug?: string;
  section?: PageSection;
  access?: PageAccess;
  content?: Record<string, unknown>;
  metaTitle?: string | null;
  metaDescription?: string | null;
  bannerMediaId?: string | null;
  status?: PageStatus;
}

export interface UpdateSettingsRequest {
  siteName?: string;
  logoMediaId?: string | null;
  defaultBannerMediaId?: string | null;
  heroType?: HeroType;
  primaryColor?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  socialLinks?: Record<string, string> | null;
}

export interface UpdateMediaRequest {
  altText?: string | null;
  placement?: MediaPlacement;
  pageId?: string | null;
  status?: MediaStatus;
}

export interface MediaUploadMetaRequest {
  altText?: string;
  placement?: MediaPlacement;
  pageId?: string | null;
}

export interface MediaDeleteQuery {
  force?: boolean;
}

/* ─── Admin Response DTOs ────────────────────────────────────────────────── */

export type AdminPageResponse = WebsitePage;

export interface AdminPageListResponse {
  success: true;
  data: AdminPageResponse[];
  meta: PaginationMeta;
}

export type AdminSettingsResponse = WebsiteSettings;

export type AdminMediaResponse = WebsiteMedia;

export interface AdminMediaListResponse {
  success: true;
  data: AdminMediaResponse[];
  meta: PaginationMeta;
}

export interface AdminAuditListResponse {
  success: true;
  data: AuditLog[];
  meta: PaginationMeta;
}

/* ─── Public Response DTOs ───────────────────────────────────────────────── */

export interface PublicPageResponse {
  id: string;
  title: string;
  slug: string;
  section: PageSection;
  content: Record<string, unknown>;
  metaTitle: string | null;
  metaDescription: string | null;
  bannerUrl: string | null;
  publishedAt: string;
}

export interface PublicSettingsResponse {
  siteName: string;
  logoUrl: string | null;
  defaultBannerUrl: string | null;
  primaryColor: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  socialLinks: Record<string, string> | null;
}

export type PublicNavigationResponse = Record<
  string,
  Array<{ title: string; slug: string }>
>;

/* ─── Filter / Query Types ───────────────────────────────────────────────── */

export interface MediaQueryFilter {
  type?: MediaType;
  status?: MediaStatus;
  placement?: MediaPlacement;
  pageId?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

export interface PageListFilter {
  status?: PageStatus;
  section?: PageSection;
  search?: string;
  page?: number;
  limit?: number;
}

export interface AuditQueryFilter {
  entity?: AuditEntity;
  entityId?: string;
  action?: AuditAction;
  actorId?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

/* ─── API Response Envelope ──────────────────────────────────────────────── */

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  error: string;
  code: string;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

/* ─── Pagination Meta ────────────────────────────────────────────────────── */

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  success: true;
  data: T[];
  meta: PaginationMeta;
}

/* ─── CMS Content Types ──────────────────────────────────────────────────── */

export const CMS_SECTION_TYPES = [
  "hero",
  "text",
  "image",
  "video",
  "gallery",
  "cta",
  "table",
  "cards",
  "faq",
  "svg",
  "html",
  "divider",
] as const;

export type CMSSectionType = (typeof CMS_SECTION_TYPES)[number];

export interface CMSHeroData {
  headline?: string;
  subheadline?: string;
  ctaText?: string;
  ctaUrl?: string;
  bgColor?: string;
  textColor?: string;
  imageUrl?: string;
  overlayOpacity?: number;
}

export interface CMSTextData {
  heading?: string;
  body?: string;
  alignment?: "left" | "center" | "right";
  bgColor?: string;
  textColor?: string;
}

export interface CMSImageData {
  imageUrl?: string;
  altText?: string;
  caption?: string;
  link?: string;
  width?: "full" | "wide" | "medium" | "small";
}

export interface CMSVideoData {
  videoUrl?: string;
  posterUrl?: string;
  caption?: string;
  autoplay?: boolean;
}

export interface CMSGalleryItem {
  url: string;
  alt?: string;
  caption?: string;
}

export interface CMSGalleryData {
  title?: string;
  columns?: number;
  items?: CMSGalleryItem[];
}

export interface CMSCtaData {
  heading?: string;
  body?: string;
  buttonText?: string;
  buttonUrl?: string;
  bgColor?: string;
  textColor?: string;
  buttonColor?: string;
}

export interface CMSTableData {
  title?: string;
  headers?: string[];
  rows?: string[][];
}

export interface CMSCardItem {
  icon?: string;
  heading?: string;
  text?: string;
  link?: string;
  color?: string;
}

export interface CMSCardsData {
  title?: string;
  columns?: number;
  items?: CMSCardItem[];
}

export interface CMSFaqItem {
  question: string;
  answer: string;
}

export interface CMSFaqData {
  title?: string;
  items?: CMSFaqItem[];
}

export interface CMSSvgData {
  rawSvg?: string;
  caption?: string;
}

export interface CMSHtmlData {
  rawHtml?: string;
}

export interface CMSDividerData {
  color?: string;
  thickness?: number;
  marginTop?: number;
  marginBottom?: number;
}

export type CMSSectionData =
  | CMSHeroData
  | CMSTextData
  | CMSImageData
  | CMSVideoData
  | CMSGalleryData
  | CMSCtaData
  | CMSTableData
  | CMSCardsData
  | CMSFaqData
  | CMSSvgData
  | CMSHtmlData
  | CMSDividerData;

export interface CMSSection {
  id: string;
  type: CMSSectionType;
  visible: boolean;
  order: number;
  data: Record<string, unknown>;
}

export interface CMSTheme {
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
}

export interface CMSSeo {
  metaTitle?: string;
  metaDescription?: string;
  ogImageUrl?: string;
}

export interface CMSPageContent {
  sections?: CMSSection[];
  theme?: CMSTheme;
  seo?: CMSSeo;
}

export const LANDING_PAGES: ReadonlyArray<{
  slug: string;
  label: string;
  path: string;
  section: "main" | "hoteis" | "parques" | "combos" | "ingressos" | "outros";
}> = [
  { slug: "home", label: "Início", path: "/", section: "main" },
  { slug: "hoteis", label: "Hotéis", path: "/hoteis", section: "hoteis" },
  { slug: "promocoes", label: "Promoções", path: "/promocoes", section: "combos" },
  { slug: "ingressos", label: "Ingressos", path: "/ingressos", section: "ingressos" },
  { slug: "atracoes", label: "Atrações", path: "/atracoes", section: "parques" },
  { slug: "ofertas", label: "Ofertas", path: "/flash-deals", section: "combos" },
  { slug: "leiloes", label: "Leilões", path: "/leiloes", section: "outros" },
  { slug: "excursoes", label: "Excursões", path: "/excursoes", section: "outros" },
  { slug: "quem-somos", label: "Quem Somos", path: "/quem-somos", section: "main" },
  { slug: "caldas-ai", label: "Caldas AI", path: "/caldas-ai", section: "outros" },
  { slug: "grupos", label: "Grupos", path: "/viagens-grupo", section: "outros" },
  { slug: "perfil", label: "Perfil", path: "/perfil", section: "outros" },
  { slug: "mapas", label: "Mapas", path: "/mapa-caldas-novas", section: "outros" },
  { slug: "contato", label: "Contato", path: "/contato", section: "main" },
  { slug: "catalogo", label: "Catálogo", path: "/catalogo-excursoes", section: "outros" },
] as const;
