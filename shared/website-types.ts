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

export interface AdminPageResponse extends WebsitePage {}

export interface AdminPageListResponse {
  success: true;
  data: AdminPageResponse[];
  meta: PaginationMeta;
}

export interface AdminSettingsResponse extends WebsiteSettings {}

export interface AdminMediaResponse extends WebsiteMedia {}

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
