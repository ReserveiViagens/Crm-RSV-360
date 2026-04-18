import type { Express, Request, Response } from "express";

import { findExcursao, type Excursao } from "../excursoes";
import {
  createInvite,
  ensureGroupForExcursao,
  getGroupById,
  listMemberships,
  upsertMembership,
  validateInvite,
  consumeInvite,
} from "../social-commerce";

const getActorFromHeaders = (req: Request) => {
  const userId = String(req.get("x-user-id") ?? "").trim();
  const nome = String(req.get("x-user-name") ?? "").trim() || "Usuário";
  return { userId, nome };
};

const getMembershipRole = async (excursao: Excursao, userId: string) => {
  if (!userId) return null;

  const group = await ensureGroupForExcursao(
    excursao.id,
    excursao.nome,
    excursao.capacidade
  );

  const memberships = await listMemberships(group.id);
  const role = memberships.find((m) => m.userId === userId)?.status ?? null;

  return { group, role };
};

export function registerGroupRoutes(app: Express) {
  app.post("/api/excursoes/:id/invites", async (req: Request, res: Response) => {
    const excursao = await findExcursao(String(req.params.id));
    if (!excursao) {
      return res
        .status(404)
        .json({ error: "NOT_FOUND", message: "Excursão não encontrada" });
    }

    const group = await ensureGroupForExcursao(
      excursao.id,
      excursao.nome,
      excursao.capacidade
    );

    const invite = await createInvite(group.id);
    const joinUrl = `${req.protocol}://${req.get("host")}/join?code=${encodeURIComponent(invite.code)}`;

    return res.status(201).json({ invite, joinUrl });
  });

  app.post("/api/invites/validate", async (req: Request, res: Response) => {
    const code = String((req.body as { code?: string })?.code ?? "");
    const result = await validateInvite(code);

    if (!result.valid || !result.invite) {
      return res.status(400).json({ ok: false, reason: result.reason });
    }

    return res.json({
      ok: true,
      invite: result.invite,
    });
  });

  app.get("/api/invites/:code", async (req: Request, res: Response) => {
    const code = String(req.params.code ?? "");
    const result = await validateInvite(code);

    if (!result.valid || !result.invite) {
      return res.status(400).json({ ok: false, reason: result.reason });
    }

    const group = await getGroupById(result.invite.groupId);
    if (!group) {
      return res.status(404).json({ ok: false, reason: "GROUP_NOT_FOUND" });
    }

    const excursao = await findExcursao(group.excursaoId);

    return res.json({
      ok: true,
      invite: result.invite,
      group: {
        id: group.id,
        nome: group.nome,
        excursaoId: group.excursaoId,
      },
      excursao,
    });
  });

  app.post("/api/invites/join", async (req: Request, res: Response) => {
    const body = (req.body as { code?: string; userId?: string; nome?: string }) || {};

    if (!body.code || !body.userId || !body.nome) {
      return res.status(400).json({ ok: false, reason: "INVALID_PAYLOAD" });
    }

    const result = await validateInvite(body.code);
    if (!result.valid || !result.invite) {
      return res.status(400).json({ ok: false, reason: result.reason });
    }

    const group = await getGroupById(result.invite.groupId);
    if (!group) {
      return res.status(404).json({ ok: false, reason: "GROUP_NOT_FOUND" });
    }

    await consumeInvite(body.code);

    const membership = await upsertMembership(
      result.invite.groupId,
      body.userId,
      body.nome,
      "MEMBER"
    );

    return res.json({
      ok: true,
      membership,
      excursaoId: group.excursaoId,
    });
  });

  app.post(
    "/api/excursoes/:id/solicitar-participacao",
    async (req: Request, res: Response) => {
      const excursao = await findExcursao(String(req.params.id));
      if (!excursao) {
        return res
          .status(404)
          .json({ error: "NOT_FOUND", message: "Excursão não encontrada" });
      }

      const body = (req.body as { userId?: string; nome?: string }) || {};
      if (!body.userId || !body.nome) {
        return res.status(400).json({
          error: "BAD_REQUEST",
          message: "userId e nome obrigatórios",
        });
      }

      const group = await ensureGroupForExcursao(
        excursao.id,
        excursao.nome,
        excursao.capacidade
      );

      const membership = await upsertMembership(
        group.id,
        body.userId,
        body.nome,
        "PENDING"
      );

      return res.status(201).json({ ok: true, membership });
    }
  );

  app.post(
    "/api/excursoes/:id/creator-setup",
    async (req: Request, res: Response) => {
      const excursao = await findExcursao(String(req.params.id));
      if (!excursao) {
        return res
          .status(404)
          .json({ error: "NOT_FOUND", message: "Excursão não encontrada" });
      }

      const body = (req.body as { userId?: string; nome?: string }) || {};
      if (!body.userId || !body.nome) {
        return res.status(400).json({
          error: "BAD_REQUEST",
          message: "userId e nome obrigatórios",
        });
      }

      const group = await ensureGroupForExcursao(
        excursao.id,
        excursao.nome,
        excursao.capacidade
      );

      const membership = await upsertMembership(
        group.id,
        body.userId,
        body.nome,
        "ADMIN"
      );

      return res.status(201).json({ ok: true, group, membership });
    }
  );

  app.get("/api/excursoes/:id/me-role", async (req: Request, res: Response) => {
    const excursao = await findExcursao(String(req.params.id));
    if (!excursao) {
      return res
        .status(404)
        .json({ error: "NOT_FOUND", message: "Excursão não encontrada" });
    }

    const sessionUserId = (req.session as any).userId as string | undefined;
    const { userId: headerUserId } = getActorFromHeaders(req);
    const userId = sessionUserId || headerUserId;

    if (!userId) {
      return res.json({ role: null, isAdmin: false });
    }

    const info = await getMembershipRole(excursao, userId);

    return res.json({
      role: info?.role ?? null,
      isAdmin: info?.role === "ADMIN",
    });
  });
}