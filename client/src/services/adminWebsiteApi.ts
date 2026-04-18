import type {
  AdminPageResponse,
  AdminSettingsResponse,
  AdminMediaResponse,
  PaginationMeta,
  CreatePageRequest,
  UpdatePageRequest,
  UpdateSettingsRequest,
  UpdateMediaRequest,
  MediaQueryFilter,
  PageListFilter,
} from "@shared/website-types";

const BASE = "/api/admin/website";

async function req<T>(
  method: string,
  path: string,
  body?: unknown
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: body instanceof FormData ? {} : body ? { "Content-Type": "application/json" } : {},
    body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
    credentials: "include",
  });

  const json = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.error ?? `HTTP ${res.status}`);
  }

  return json as T;
}

/* ─── Pages ─────────────────────────────────────────────────────────────── */

export interface PageListResult {
  success: true;
  data: AdminPageResponse[];
  meta: PaginationMeta;
}

export async function fetchPages(filter?: PageListFilter): Promise<PageListResult> {
  const params = new URLSearchParams();
  if (filter?.status) params.set("status", filter.status);
  if (filter?.section) params.set("section", filter.section);
  if (filter?.search) params.set("search", filter.search);
  if (filter?.page) params.set("page", String(filter.page));
  if (filter?.limit) params.set("limit", String(filter.limit));
  const qs = params.toString();
  return req<PageListResult>("GET", `/pages${qs ? `?${qs}` : ""}`);
}

export async function fetchPageById(id: string): Promise<AdminPageResponse> {
  const res = await req<{ success: true; data: AdminPageResponse }>("GET", `/pages/${id}`);
  return (res as { success: true; data: AdminPageResponse }).data;
}

export async function createPage(body: CreatePageRequest): Promise<AdminPageResponse> {
  const res = await req<{ success: true; data: AdminPageResponse }>("POST", "/pages", body);
  return (res as { success: true; data: AdminPageResponse }).data;
}

export async function updatePage(id: string, body: UpdatePageRequest): Promise<AdminPageResponse> {
  const res = await req<{ success: true; data: AdminPageResponse }>("PUT", `/pages/${id}`, body);
  return (res as { success: true; data: AdminPageResponse }).data;
}

export async function deletePage(id: string): Promise<void> {
  await req("DELETE", `/pages/${id}`);
}

export async function publishPage(id: string): Promise<AdminPageResponse> {
  const res = await req<{ success: true; data: AdminPageResponse }>("POST", `/pages/${id}/publish`);
  return (res as { success: true; data: AdminPageResponse }).data;
}

export async function unpublishPage(id: string): Promise<AdminPageResponse> {
  const res = await req<{ success: true; data: AdminPageResponse }>("POST", `/pages/${id}/unpublish`);
  return (res as { success: true; data: AdminPageResponse }).data;
}

/* ─── Settings ───────────────────────────────────────────────────────────── */

export async function fetchSettings(): Promise<AdminSettingsResponse> {
  const res = await req<{ success: true; data: AdminSettingsResponse }>("GET", "/settings");
  return (res as { success: true; data: AdminSettingsResponse }).data;
}

export async function patchSettings(body: UpdateSettingsRequest): Promise<AdminSettingsResponse> {
  const res = await req<{ success: true; data: AdminSettingsResponse }>("PATCH", "/settings", body);
  return (res as { success: true; data: AdminSettingsResponse }).data;
}

/* ─── Media ─────────────────────────────────────────────────────────────── */

export interface MediaListResult {
  success: true;
  data: AdminMediaResponse[];
  meta: PaginationMeta;
}

export async function fetchMedia(filter?: MediaQueryFilter): Promise<MediaListResult> {
  const params = new URLSearchParams();
  if (filter?.type) params.set("type", filter.type);
  if (filter?.status) params.set("status", filter.status);
  if (filter?.placement) params.set("placement", filter.placement);
  if (filter?.pageId) params.set("pageId", filter.pageId);
  if (filter?.search) params.set("search", filter.search);
  if (filter?.dateFrom) params.set("dateFrom", filter.dateFrom);
  if (filter?.dateTo) params.set("dateTo", filter.dateTo);
  if (filter?.page) params.set("page", String(filter.page));
  if (filter?.limit) params.set("limit", String(filter.limit));
  const qs = params.toString();
  return req<MediaListResult>("GET", `/media${qs ? `?${qs}` : ""}`);
}

export async function uploadMedia(
  file: File,
  meta?: { altText?: string; placement?: string; pageId?: string | null }
): Promise<AdminMediaResponse> {
  const form = new FormData();
  form.append("file", file);
  if (meta?.altText) form.append("altText", meta.altText);
  if (meta?.placement) form.append("placement", meta.placement);
  if (meta?.pageId) form.append("pageId", meta.pageId);
  const res = await fetch(`${BASE}/media/upload`, {
    method: "POST",
    body: form,
    credentials: "include",
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.error ?? `HTTP ${res.status}`);
  return json.data;
}

export async function fetchMediaById(id: string): Promise<AdminMediaResponse> {
  const res = await req<{ success: true; data: AdminMediaResponse }>("GET", `/media/${id}`);
  return (res as { success: true; data: AdminMediaResponse }).data;
}

export async function updateMedia(id: string, body: UpdateMediaRequest): Promise<AdminMediaResponse> {
  const res = await req<{ success: true; data: AdminMediaResponse }>("PUT", `/media/${id}`, body);
  return (res as { success: true; data: AdminMediaResponse }).data;
}

export async function swapMedia(id: string, file: File): Promise<AdminMediaResponse> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`${BASE}/media/${id}/swap`, {
    method: "POST",
    body: form,
    credentials: "include",
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.error ?? `HTTP ${res.status}`);
  return json.data;
}

export async function unlinkMedia(id: string): Promise<AdminMediaResponse> {
  const res = await req<{ success: true; data: AdminMediaResponse }>("POST", `/media/${id}/unlink`);
  return (res as { success: true; data: AdminMediaResponse }).data;
}

export async function deleteMedia(id: string, force = false): Promise<void> {
  await req("DELETE", `/media/${id}${force ? "?force=true" : ""}`);
}
