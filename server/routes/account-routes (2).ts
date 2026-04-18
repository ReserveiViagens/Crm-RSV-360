import type { Express, Request, Response } from "express";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";

import { storage } from "../storage";
import { registerSchema, loginSchema } from "@shared/schema";

type ReservaPassageiro = {
  id: string;
  hotel: string;
  dates: string;
  status: "Confirmada" | "Pendente" | "Cancelada";
  location: string;
  excursaoId?: string;
};

type Notificacao = {
  id: string;
  titulo: string;
  mensagem: string;
  tipo: "info" | "sucesso" | "alerta" | "promo";
  lida: boolean;
  criadoEm: string;
};

const reservaPassageiroStore: Record<string, ReservaPassageiro[]> = {};
const notificacaoStore: Record<string, Notificacao[]> = {};

const scryptAsync = promisify(scrypt);

const hashPassword = async (password: string): Promise<string> => {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
};

const verifyPassword = async (password: string, stored: string): Promise<boolean> => {
  const [hash, salt] = stored.split(".");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  const storedBuf = Buffer.from(hash, "hex");
  return timingSafeEqual(buf, storedBuf);
};

const safeUser = (u: any) => ({
  id: u.id,
  nome: u.nome,
  email: u.email,
  telefone: u.telefone,
  role: u.role,
  cpf: u.cpf,
  fotoUrl: u.fotoUrl,
  provider: u.provider,
});

const seedReservasForUser = (userId: string, _nome: string) => {
  if (reservaPassageiroStore[userId]) return;

  reservaPassageiroStore[userId] = [
    {
      id: `res-${userId}-1`,
      hotel: "Resort Termas Paradise",
      dates: "13/05/2026",
      status: "Confirmada",
      location: "Caldas Novas",
    },
    {
      id: `res-${userId}-2`,
      hotel: "Hot Park - Ingresso Família",
      dates: "15/05/2026",
      status: "Pendente",
      location: "Rio Quente",
    },
  ];
};

const seedNotificacoesForUser = (userId: string) => {
  if (notificacaoStore[userId]) return;

  const now = new Date();

  notificacaoStore[userId] = [
    {
      id: `notif-${userId}-1`,
      titulo: "Reserva confirmada!",
      mensagem: "Sua reserva no Resort Termas Paradise foi confirmada para 13/05/2026.",
      tipo: "sucesso",
      lida: false,
      criadoEm: new Date(now.getTime() - 2 * 3600000).toISOString(),
    },
    {
      id: `notif-${userId}-2`,
      titulo: "Pagamento pendente",
      mensagem: "O pagamento do Hot Park - Ingresso Família está aguardando confirmação PIX.",
      tipo: "alerta",
      lida: false,
      criadoEm: new Date(now.getTime() - 24 * 3600000).toISOString(),
    },
    {
      id: `notif-${userId}-3`,
      titulo: "Promoção imperdível!",
      mensagem: "Di Roma Acqua Park com 30% de desconto para grupos acima de 10 pessoas.",
      tipo: "promo",
      lida: false,
      criadoEm: new Date(now.getTime() - 48 * 3600000).toISOString(),
    },
  ];
};

export function registerAccountRoutes(app: Express) {
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: parsed.error.issues[0].message });
    }

    const { nome, email, telefone, cpf = "", senha } = parsed.data;

    const existing = await storage.getUserByEmail(email);
    if (existing) {
      return res.status(409).json({ message: "E-mail já cadastrado" });
    }

    if (cpf) {
      const existingCpf = await storage.getUserByCpf(cpf);
      if (existingCpf) {
        return res.status(409).json({ message: "CPF já cadastrado" });
      }
    }

    const hashedPassword = await hashPassword(senha);
    const user = await storage.createUser({
      username: email,
      password: hashedPassword,
      nome,
      email,
      telefone,
      cpf,
      role: "user",
      ativo: true,
      googleId: "",
      fotoUrl: "",
      provider: "local",
    });

    req.session.userId = user.id;
    return res.status(201).json(safeUser(user));
  });

  app.post("/api/auth/login", async (req: Request, res: Response) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: parsed.error.issues[0].message });
    }

    const { identificador, senha } = parsed.data;

    const user = await storage.getUserByIdentifier(identificador);
    if (!user) {
      return res.status(401).json({ message: "Credenciais não encontradas" });
    }

    if (user.provider !== "local" || !user.password) {
      return res.status(401).json({
        message: `Esta conta usa login via ${user.provider}. Use o botão correspondente.`,
      });
    }

    const ok = await verifyPassword(senha, user.password);
    if (!ok) {
      return res.status(401).json({ message: "Senha incorreta" });
    }

    req.session.userId = user.id;
    return res.json(safeUser(user));
  });

  app.post("/api/auth/logout", (req: Request, res: Response) => {
    req.session.destroy(() => {
      res.json({ ok: true });
    });
  });

  app.get("/api/auth/me", async (req: Request, res: Response) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Não autenticado" });
    }

    const user = await storage.getUser(req.session.userId);
    if (!user) {
      return res.status(401).json({ message: "Usuário não encontrado" });
    }

    return res.json(safeUser(user));
  });

  app.post("/api/auth/selfie", async (req: Request, res: Response) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Não autenticado" });
    }

    const { fotoUrl } = req.body;
    if (!fotoUrl || typeof fotoUrl !== "string") {
      return res.status(400).json({ message: "Foto inválida" });
    }

    const updated = await storage.updateUser(req.session.userId, { fotoUrl });
    if (!updated) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    return res.json(safeUser(updated));
  });

  app.post("/api/auth/tornar-lider", async (req: Request, res: Response) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Não autenticado" });
    }

    const user = await storage.getUser(req.session.userId);
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    if (user.role === "LIDER" || user.role === "admin") {
      return res.json({ ...safeUser(user), message: "Você já é um Líder!" });
    }

    const { tipoGrupo, qtdPessoas } = req.body as {
      tipoGrupo?: string;
      qtdPessoas?: number;
    };

    console.log(
      `[LIDER-CANDIDATURA] user=${user.id} nome="${user.nome}" tipoGrupo=${tipoGrupo} qtdPessoas=${qtdPessoas}`
    );

    const updated = await storage.updateUser(req.session.userId, { role: "LIDER" });
    if (!updated) {
      return res.status(500).json({ message: "Erro ao atualizar role" });
    }

    return res.json(safeUser(updated));
  });

  app.patch("/api/auth/perfil", async (req: Request, res: Response) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Não autenticado" });
    }

    const { nome, telefone } = req.body as { nome?: string; telefone?: string };
    const updates: Record<string, string> = {};

    if (typeof nome === "string" && nome.trim().length >= 3) {
      updates.nome = nome.trim();
    }

    if (typeof telefone === "string" && telefone.trim().length >= 10) {
      updates.telefone = telefone.trim();
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "Nenhum campo válido para atualizar" });
    }

    const updated = await storage.updateUser(req.session.userId, updates);
    if (!updated) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    return res.json(safeUser(updated));
  });

  app.get("/api/reservas/minhas", async (req: Request, res: Response) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Não autenticado" });
    }

    const user = await storage.getUser(req.session.userId);
    if (!user) {
      return res.status(401).json({ message: "Usuário não encontrado" });
    }

    seedReservasForUser(user.id, user.nome);
    return res.json({ items: reservaPassageiroStore[user.id] ?? [] });
  });

  app.get("/api/notificacoes", async (req: Request, res: Response) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Não autenticado" });
    }

    seedNotificacoesForUser(req.session.userId);
    const items = notificacaoStore[req.session.userId] ?? [];
    const naoLidas = items.filter((n) => !n.lida).length;

    return res.json({ items, naoLidas });
  });

  app.patch("/api/notificacoes/:id/lida", async (req: Request, res: Response) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Não autenticado" });
    }

    seedNotificacoesForUser(req.session.userId);
    const items = notificacaoStore[req.session.userId] ?? [];
    const notif = items.find((n) => n.id === req.params.id);

    if (!notif) {
      return res.status(404).json({ message: "Notificação não encontrada" });
    }

    notif.lida = true;
    return res.json(notif);
  });
}