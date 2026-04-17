import type { Request, Response, NextFunction } from "express";
import { storage } from "../storage.js";

/* ─────────────────────────────────────────────────────────────────────────────
   RSV360 — Admin Auth Middleware
   Reusable guard for any route that requires admin (or superadmin) role.
   After a successful auth check, attaches the user object to req.adminUser
   so that downstream route handlers can read the real actor identity for audits.
   (Express.Request.adminUser is declared in server/types/express.d.ts)
   Returns standardised { success, error, code } envelopes on failure.
   ───────────────────────────────────────────────────────────────────────────── */

export async function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const userId = (req.session as { userId?: string })?.userId;

  if (!userId) {
    res
      .status(401)
      .json({ success: false, error: "Não autenticado", code: "UNAUTHORIZED" });
    return;
  }

  const user = await storage.getUser(userId);

  if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
    res.status(403).json({
      success: false,
      error: "Acesso restrito a administradores",
      code: "FORBIDDEN",
    });
    return;
  }

  req.adminUser = {
    id: String(user.id),
    nome: user.nome ?? null,
    username: user.username ?? null,
    role: user.role,
  };

  next();
}

export async function requireEditor(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const userId = (req.session as { userId?: string })?.userId;

  if (!userId) {
    res
      .status(401)
      .json({ success: false, error: "Não autenticado", code: "UNAUTHORIZED" });
    return;
  }

  const user = await storage.getUser(userId);

  if (
    !user ||
    (user.role !== "admin" &&
      user.role !== "superadmin" &&
      user.role !== "editor")
  ) {
    res.status(403).json({
      success: false,
      error: "Acesso restrito a administradores e editores",
      code: "FORBIDDEN",
    });
    return;
  }

  req.adminUser = {
    id: String(user.id),
    nome: user.nome ?? null,
    username: user.username ?? null,
    role: user.role,
  };

  next();
}
