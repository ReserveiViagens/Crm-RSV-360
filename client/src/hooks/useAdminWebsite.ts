import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  AdminPageResponse,
  AdminSettingsResponse,
  AdminMediaResponse,
  UpdateSettingsRequest,
  CreatePageRequest,
  UpdatePageRequest,
  UpdateMediaRequest,
  MediaQueryFilter,
  PageListFilter,
} from "@shared/website-types";
import {
  fetchSettings,
  patchSettings,
  fetchPages,
  createPage,
  updatePage,
  deletePage,
  publishPage,
  unpublishPage,
  fetchMedia,
  fetchMediaById,
  uploadMedia,
  updateMedia,
  swapMedia,
  unlinkMedia,
  deleteMedia,
  type PageListResult,
  type MediaListResult,
} from "@/services/adminWebsiteApi";

/* ─── Settings ───────────────────────────────────────────────────────────── */

export function useAdminSettings() {
  const qc = useQueryClient();

  const query = useQuery<AdminSettingsResponse>({
    queryKey: ["/api/admin/website/settings"],
    queryFn: fetchSettings,
  });

  const update = useMutation<AdminSettingsResponse, Error, UpdateSettingsRequest>({
    mutationFn: patchSettings,
    onSuccess: (data) => {
      qc.setQueryData(["/api/admin/website/settings"], data);
    },
  });

  return { ...query, update };
}

/* ─── Pages ─────────────────────────────────────────────────────────────── */

export function useAdminPages(filter?: PageListFilter) {
  const qc = useQueryClient();

  const query = useQuery<PageListResult>({
    queryKey: ["/api/admin/website/pages", filter ?? {}],
    queryFn: () => fetchPages(filter),
  });

  const create = useMutation<AdminPageResponse, Error, CreatePageRequest>({
    mutationFn: createPage,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["/api/admin/website/pages"] }),
  });

  const update = useMutation<AdminPageResponse, Error, { id: string; body: UpdatePageRequest }>({
    mutationFn: ({ id, body }) => updatePage(id, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["/api/admin/website/pages"] }),
  });

  const remove = useMutation<void, Error, string>({
    mutationFn: deletePage,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["/api/admin/website/pages"] }),
  });

  const publish = useMutation<AdminPageResponse, Error, string>({
    mutationFn: publishPage,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["/api/admin/website/pages"] }),
  });

  const unpublish = useMutation<AdminPageResponse, Error, string>({
    mutationFn: unpublishPage,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["/api/admin/website/pages"] }),
  });

  return { ...query, create, update, remove, publish, unpublish };
}

/* ─── Media ─────────────────────────────────────────────────────────────── */

export type UploadMediaArgs = {
  file: File;
  meta?: { altText?: string; placement?: string; pageId?: string | null };
};

export type SwapMediaArgs = { id: string; file: File };
export type UpdateMetaArgs = { id: string; body: UpdateMediaRequest };

export function useAdminMedia(filter?: MediaQueryFilter) {
  const qc = useQueryClient();

  const invalidate = () =>
    qc.invalidateQueries({ queryKey: ["/api/admin/website/media"] });

  const query = useQuery<MediaListResult>({
    queryKey: ["/api/admin/website/media", filter ?? {}],
    queryFn: () => fetchMedia(filter),
    enabled: filter !== undefined,
  });

  const upload = useMutation<AdminMediaResponse, Error, UploadMediaArgs>({
    mutationFn: ({ file, meta }) => uploadMedia(file, meta),
    onSuccess: invalidate,
  });

  const updateMeta = useMutation<AdminMediaResponse, Error, UpdateMetaArgs>({
    mutationFn: ({ id, body }) => updateMedia(id, body),
    onSuccess: invalidate,
  });

  const swap = useMutation<AdminMediaResponse, Error, SwapMediaArgs>({
    mutationFn: ({ id, file }) => swapMedia(id, file),
    onSuccess: invalidate,
  });

  const unlink = useMutation<AdminMediaResponse, Error, string>({
    mutationFn: unlinkMedia,
    onSuccess: invalidate,
  });

  const remove = useMutation<void, Error, { id: string; force?: boolean }>({
    mutationFn: ({ id, force }) => deleteMedia(id, force),
    onSuccess: invalidate,
  });

  return { ...query, upload, updateMeta, swap, unlink, remove };
}

/* ─── Upload-only hook (no list query) ──────────────────────────────────── */

export function useAdminMediaUpload() {
  const qc = useQueryClient();
  return useMutation<AdminMediaResponse, Error, UploadMediaArgs>({
    mutationFn: ({ file, meta }) => uploadMedia(file, meta),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["/api/admin/website/media"] }),
  });
}

/* ─── Single media by ID (for resolving logo/banner URLs) ────────────────── */

export function useAdminMediaById(id: string | null | undefined) {
  return useQuery<AdminMediaResponse>({
    queryKey: ["/api/admin/website/media", id],
    queryFn: () => fetchMediaById(id!),
    enabled: !!id,
  });
}
