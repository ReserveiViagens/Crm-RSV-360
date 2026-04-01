import { Router, type Request, type Response } from "express";
import {
  createPageValidator,
  updatePageValidator,
  pageIdParamValidator,
  pageSlugParamValidator,
  pageListQueryValidator,
  updateSettingsValidator,
  mediaQueryValidator,
  mediaUploadMetaValidator,
  mediaUpdateValidator,
  mediaIdParamValidator,
  mediaDeleteQueryValidator,
} from "../validators/admin-website.validator.js";
import {
  listPages,
  getPageById,
  getPageBySlug,
  createPage,
  updatePage,
  deletePage,
  publishPage,
  unpublishPage,
  getSettings,
  updateSettings,
} from "../services/admin-website.service.js";
import {
  upload,
  validateFile,
  persistMediaRecord,
  listMedia,
  getMediaById,
  updateMedia,
  swapMediaFile,
  unlinkMedia,
  deleteMedia,
} from "../services/media-storage.service.js";

/* ─────────────────────────────────────────────────────────────────────────────
   RSV360 — Admin Website Router
   Base: /api/admin/website
   Auth guard is applied at registration point in server/routes.ts.
   All handlers use standardized { success, data } | { success, error, code }.
   ───────────────────────────────────────────────────────────────────────────── */

const router = Router();

function getActor(req: Request): { actorId: string; actorName: string } {
  const userId = (req.session as { userId?: string })?.userId ?? "unknown";
  const user = (req as Request & { user?: { id?: string; nome?: string; username?: string } }).user;
  const actorName = user?.nome ?? user?.username ?? userId;
  return { actorId: userId, actorName };
}

/* ─── Pages ──────────────────────────────────────────────────────────────── */

router.get("/pages", async (req: Request, res: Response) => {
  const parsed = pageListQueryValidator.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      error: parsed.error.errors[0]?.message ?? "Parâmetros inválidos",
      code: "VALIDATION_ERROR",
    });
  }

  const result = await listPages(parsed.data);
  return res.json({ success: true, ...result });
});

router.get("/pages/by-slug/:slug", async (req: Request, res: Response) => {
  const parsed = pageSlugParamValidator.safeParse(req.params);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      error: "Slug inválido",
      code: "VALIDATION_ERROR",
    });
  }

  const page = await getPageBySlug(parsed.data.slug);
  if (!page) return res.status(404).json({ success: false, error: "Página não encontrada", code: "NOT_FOUND" });
  return res.json({ success: true, data: page });
});

router.get("/pages/:id", async (req: Request, res: Response) => {
  const parsed = pageIdParamValidator.safeParse(req.params);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      error: "ID inválido",
      code: "VALIDATION_ERROR",
    });
  }

  const page = await getPageById(parsed.data.id);
  if (!page) return res.status(404).json({ success: false, error: "Página não encontrada", code: "NOT_FOUND" });
  return res.json({ success: true, data: page });
});

router.post("/pages", async (req: Request, res: Response) => {
  const parsed = createPageValidator.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      error: parsed.error.errors[0]?.message ?? "Dados inválidos",
      code: "VALIDATION_ERROR",
    });
  }

  const { actorId, actorName } = getActor(req);

  try {
    const page = await createPage(parsed.data, actorId, actorName);
    return res.status(201).json({ success: true, data: page });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erro ao criar página";
    if (msg.includes("unique") || msg.includes("slug")) {
      return res.status(409).json({ success: false, error: "Slug já em uso", code: "CONFLICT" });
    }
    return res.status(500).json({ success: false, error: msg, code: "INTERNAL_ERROR" });
  }
});

router.patch("/pages/:id", async (req: Request, res: Response) => {
  const paramParsed = pageIdParamValidator.safeParse(req.params);
  if (!paramParsed.success) {
    return res.status(400).json({ success: false, error: "ID inválido", code: "VALIDATION_ERROR" });
  }

  const bodyParsed = updatePageValidator.safeParse(req.body);
  if (!bodyParsed.success) {
    return res.status(400).json({
      success: false,
      error: bodyParsed.error.errors[0]?.message ?? "Dados inválidos",
      code: "VALIDATION_ERROR",
    });
  }

  const { actorId, actorName } = getActor(req);
  const page = await updatePage(paramParsed.data.id, bodyParsed.data, actorId, actorName);
  if (!page) return res.status(404).json({ success: false, error: "Página não encontrada", code: "NOT_FOUND" });
  return res.json({ success: true, data: page });
});

router.delete("/pages/:id", async (req: Request, res: Response) => {
  const parsed = pageIdParamValidator.safeParse(req.params);
  if (!parsed.success) {
    return res.status(400).json({ success: false, error: "ID inválido", code: "VALIDATION_ERROR" });
  }

  const { actorId, actorName } = getActor(req);
  const result = await deletePage(parsed.data.id, actorId, actorName);

  if ("error" in result) {
    if (result.error === "not_found") {
      return res.status(404).json({ success: false, error: "Página não encontrada", code: "NOT_FOUND" });
    }
    if (result.error === "protected") {
      return res.status(403).json({
        success: false,
        error: `Página "${result.slug}" é protegida e não pode ser removida`,
        code: "PROTECTED_ROUTE",
      });
    }
  }

  return res.json({ success: true, data: { deleted: true } });
});

router.post("/pages/:id/publish", async (req: Request, res: Response) => {
  const parsed = pageIdParamValidator.safeParse(req.params);
  if (!parsed.success) {
    return res.status(400).json({ success: false, error: "ID inválido", code: "VALIDATION_ERROR" });
  }

  const { actorId, actorName } = getActor(req);
  const page = await publishPage(parsed.data.id, actorId, actorName);
  if (!page) return res.status(404).json({ success: false, error: "Página não encontrada", code: "NOT_FOUND" });
  return res.json({ success: true, data: page });
});

router.post("/pages/:id/unpublish", async (req: Request, res: Response) => {
  const parsed = pageIdParamValidator.safeParse(req.params);
  if (!parsed.success) {
    return res.status(400).json({ success: false, error: "ID inválido", code: "VALIDATION_ERROR" });
  }

  const { actorId, actorName } = getActor(req);
  const page = await unpublishPage(parsed.data.id, actorId, actorName);
  if (!page) return res.status(404).json({ success: false, error: "Página não encontrada", code: "NOT_FOUND" });
  return res.json({ success: true, data: page });
});

/* ─── Settings ───────────────────────────────────────────────────────────── */

router.get("/settings", async (_req: Request, res: Response) => {
  const settings = await getSettings();
  if (!settings) return res.status(404).json({ success: false, error: "Settings não encontrado", code: "NOT_FOUND" });
  return res.json({ success: true, data: settings });
});

router.patch("/settings", async (req: Request, res: Response) => {
  const parsed = updateSettingsValidator.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      error: parsed.error.errors[0]?.message ?? "Dados inválidos",
      code: "VALIDATION_ERROR",
    });
  }

  const { actorId, actorName } = getActor(req);
  const settings = await updateSettings(parsed.data, actorId, actorName);
  return res.json({ success: true, data: settings });
});

/* ─── Media ──────────────────────────────────────────────────────────────── */

router.get("/media", async (req: Request, res: Response) => {
  const parsed = mediaQueryValidator.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      error: parsed.error.errors[0]?.message ?? "Parâmetros inválidos",
      code: "VALIDATION_ERROR",
    });
  }

  const result = await listMedia(parsed.data);
  return res.json({ success: true, ...result });
});

router.post(
  "/media/upload",
  upload.single("file"),
  async (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "Nenhum arquivo enviado. Use o campo 'file' no multipart/form-data.",
        code: "NO_FILE",
      });
    }

    const validation = validateFile(req.file);
    if (!validation.ok) {
      return res.status(422).json({
        success: false,
        error: validation.error,
        code: validation.code ?? "VALIDATION_ERROR",
      });
    }

    const metaParsed = mediaUploadMetaValidator.safeParse(req.body);
    if (!metaParsed.success) {
      return res.status(400).json({
        success: false,
        error: metaParsed.error.errors[0]?.message ?? "Metadados inválidos",
        code: "VALIDATION_ERROR",
      });
    }

    const { actorId, actorName } = getActor(req);

    try {
      const media = await persistMediaRecord(
        req.file,
        metaParsed.data,
        validation.mediaType!,
        actorId,
        actorName
      );
      return res.status(201).json({ success: true, data: media });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao salvar mídia";
      return res.status(500).json({ success: false, error: msg, code: "INTERNAL_ERROR" });
    }
  }
);

router.put("/media/:id", async (req: Request, res: Response) => {
  const paramParsed = mediaIdParamValidator.safeParse(req.params);
  if (!paramParsed.success) {
    return res.status(400).json({ success: false, error: "ID inválido", code: "VALIDATION_ERROR" });
  }

  const bodyParsed = mediaUpdateValidator.safeParse(req.body);
  if (!bodyParsed.success) {
    return res.status(400).json({
      success: false,
      error: bodyParsed.error.errors[0]?.message ?? "Dados inválidos",
      code: "VALIDATION_ERROR",
    });
  }

  const { actorId, actorName } = getActor(req);
  const media = await updateMedia(paramParsed.data.id, bodyParsed.data, actorId, actorName);
  if (!media) return res.status(404).json({ success: false, error: "Mídia não encontrada", code: "NOT_FOUND" });
  return res.json({ success: true, data: media });
});

router.post(
  "/media/:id/swap",
  upload.single("file"),
  async (req: Request, res: Response) => {
    const paramParsed = mediaIdParamValidator.safeParse(req.params);
    if (!paramParsed.success) {
      if (req.file) {
        const { deleteFileFromDisk } = await import("../services/media-storage.service.js");
        deleteFileFromDisk(req.file.filename);
      }
      return res.status(400).json({ success: false, error: "ID inválido", code: "VALIDATION_ERROR" });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "Nenhum arquivo enviado. Use o campo 'file' no multipart/form-data.",
        code: "NO_FILE",
      });
    }

    const { actorId, actorName } = getActor(req);

    try {
      const media = await swapMediaFile(paramParsed.data.id, req.file, actorId, actorName);
      if (!media) {
        return res.status(404).json({ success: false, error: "Mídia não encontrada", code: "NOT_FOUND" });
      }
      return res.json({ success: true, data: media });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao fazer swap de mídia";
      return res.status(500).json({ success: false, error: msg, code: "INTERNAL_ERROR" });
    }
  }
);

router.post("/media/:id/unlink", async (req: Request, res: Response) => {
  const parsed = mediaIdParamValidator.safeParse(req.params);
  if (!parsed.success) {
    return res.status(400).json({ success: false, error: "ID inválido", code: "VALIDATION_ERROR" });
  }

  const { actorId, actorName } = getActor(req);
  const media = await unlinkMedia(parsed.data.id, actorId, actorName);
  if (!media) return res.status(404).json({ success: false, error: "Mídia não encontrada", code: "NOT_FOUND" });
  return res.json({ success: true, data: media });
});

router.delete("/media/:id", async (req: Request, res: Response) => {
  const paramParsed = mediaIdParamValidator.safeParse(req.params);
  if (!paramParsed.success) {
    return res.status(400).json({ success: false, error: "ID inválido", code: "VALIDATION_ERROR" });
  }

  const queryParsed = mediaDeleteQueryValidator.safeParse(req.query);
  const force = queryParsed.success ? queryParsed.data.force : false;

  const { actorId, actorName } = getActor(req);
  const result = await deleteMedia(paramParsed.data.id, force, actorId, actorName);

  if ("error" in result) {
    if (result.error === "not_found") {
      return res.status(404).json({ success: false, error: "Mídia não encontrada", code: "NOT_FOUND" });
    }
    if (result.error === "has_references") {
      return res.status(409).json({
        success: false,
        error: (result as { error: "has_references"; message: string }).message,
        code: "HAS_REFERENCES",
      });
    }
  }

  return res.json({ success: true, data: { deleted: true } });
});

export default router;
