
import type { Express, Request, Response, NextFunction } from "express";
import { type Server } from "http";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { registerSchema, loginSchema, insertAtividadeWizardSchema } from "@shared/schema";
import { getOpcionais } from "./opcionais";
import {
  criarReserva,
  getReservasPorExcursao,
  chamarProximoDaFila,
} from "./reservas";
import { emitEstadoGrupo, emitPixExpirado, emitVigilancia } from "./socket";
import { createExcursionGroup, sendTextToGroup, sendPollToGroup, sendPaymentConfirmation, getWaasStatus } from "./services/whatsapp.service";
import { createSplitPaymentPix, checkPaymentStatus } from "./services/payment.service";
import { pauseAI, resumeAI, isAIPaused, getHandoffInfo, listPausedGroups } from "./services/humanHandoff.service";
import {
  gerarManifestoANTT,
  gerarFNRH,
  gerarVoucherVIP,
  type PassageiroBurocracia,
} from "./services/bureaucracyService";
import { gerarRelatorioContabil } from "./services/accountingService";
import {
  createExcursao,
  deleteExcursao,
  findExcursao,
  listExcursoes,
  updateExcursao,
  type Excursao,
  type ExcursaoStatus,
  type Passageiro,
  type RoteiroCatalogCard,
  type RoteiroCatalogCategory,
} from "./excursoes";
import {
  createInvite,
  ensureGroupForExcursao,
  getGroupById,
  listMemberships,
  listOrders,
  recalculateVoucherForGroup,
  upsertMembership,
  upsertOrder,
  validateInvite,
  consumeInvite,
} from "./social-commerce";

export async function registerRoutes(
  httpServer: Server,
  app: Express,
): Promise<Server> {
  const getActorFromHeaders = (req: Request) => {
    const userId = String(req.get("x-user-id") ?? "").trim();
    const nome = String(req.get("x-user-name") ?? "").trim() || "Usuário";
    return { userId, nome };
  };

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
    id: u.id, nome: u.nome, email: u.email,
    telefone: u.telefone, role: u.role,
    cpf: u.cpf, fotoUrl: u.fotoUrl, provider: u.provider,
  });

  // ─── SEED DEMO ────────────────────────────────────────────────────────────
  let DEMO_EXCURSAO_ID = "";
  let DEMO_INVITE_CODE = "INV-DEMO-000000";

  (async () => {
    // 1. Usuário demo
    const DEMO_EMAIL = "demo@reservei.com.br";
    let demoUser = await storage.getUserByEmail(DEMO_EMAIL);
    if (!demoUser) {
      const hashedPassword = await hashPassword("demo123");
      demoUser = await storage.createUser({
        username: DEMO_EMAIL,
        password: hashedPassword,
        nome: "Demo Master",
        email: DEMO_EMAIL,
        telefone: "(62) 99999-0000",
        cpf: "00000000000",
        role: "admin",
        googleId: "",
        fotoUrl: "https://api.dicebear.com/7.x/initials/svg?seed=DM&backgroundColor=1e3a5f&textColor=ffffff",
        provider: "local",
      });
      console.log("[SEED] Usuário demo criado → demo@reservei.com.br / demo123 (admin)");
    }

    // 2. Excursão demo
    const allExcursoes = await listExcursoes();
    let demoExcursao = allExcursoes.find((e) => e.nome === "Caldas Novas — Grupo Demo");
    if (!demoExcursao) {
      demoExcursao = await createExcursao({
        nome: "Caldas Novas — Grupo Demo",
        destino: "Caldas Novas, GO",
        dataIda: "2026-07-15",
        dataVolta: "2026-07-20",
        localSaida: "Goiânia - Terminal Rodoviário",
        capacidade: 40,
        veiculoTipo: "Ônibus",
        status: "aberto",
      });
      console.log(`[SEED] Excursão demo criada → id=${demoExcursao.id}`);
    }
    DEMO_EXCURSAO_ID = demoExcursao.id;

    const existingRoteiro = demoExcursao.wizard?.roteiroOficial;
    const hasCards = existingRoteiro?.hoteis && existingRoteiro.hoteis.length > 0;
    if (!hasCards) {
      const roteiroOficial = {
        veiculoTipo: "Ônibus" as const,
        veiculoAutomatico: true,
        manualVehicleOverride: false,
        hotelPrincipal: "Di Roma Grand Hotel",
        atracoes: ["Mirante do Rio Corumbá", "Feira Noturna de Caldas Novas", "Museu das Culturas"],
        passeios: ["Passeio de Barco — Lago Corumbá", "Quadriciclo nas Trilhas do Cerrado", "Pesca Esportiva Rio Quente"],
        parquesAquaticos: ["Hot Park", "Di Roma Acqua Park", "Lagoa Quente Thermas"],
        hoteis: [
          { id: "hotel-di-roma", titulo: "Di Roma Grand Hotel", descricaoBreve: "Resort 5 estrelas com piscinas termais, toboáguas e spa completo", galeriaImagens: [] as string[], galeriaVideos: [] as string[], precoPorPessoa: 280, duracaoHoras: 24, horarioSaida: "14:00", diasDisponiveis: ["D1", "D2", "D3", "D4", "D5"], badgeTipo: "popular" as const },
          { id: "hotel-laranjais", titulo: "Resort Thermas dos Laranjais", descricaoBreve: "Resort familiar com águas termais naturais e área de lazer completa", galeriaImagens: [] as string[], galeriaVideos: [] as string[], precoPorPessoa: 220, duracaoHoras: 24, horarioSaida: "14:00", diasDisponiveis: ["D1", "D2", "D3", "D4", "D5"], badgeTipo: "ia" as const },
        ],
        atracoesCards: [
          { id: "atracao-mirante", titulo: "Mirante do Rio Corumbá", descricaoBreve: "Vista panorâmica do lago e pôr do sol inesquecível", galeriaImagens: [] as string[], galeriaVideos: [] as string[], precoPorPessoa: 0, duracaoHoras: 2, horarioSaida: "16:30", diasDisponiveis: ["D2", "D3", "D4"] },
          { id: "atracao-feira", titulo: "Feira Noturna de Caldas Novas", descricaoBreve: "Artesanato, gastronomia regional e apresentações culturais", galeriaImagens: [] as string[], galeriaVideos: [] as string[], precoPorPessoa: 0, duracaoHoras: 3, horarioSaida: "19:00", diasDisponiveis: ["D1", "D3", "D5"] },
          { id: "atracao-museu", titulo: "Museu das Culturas", descricaoBreve: "Exposição interativa sobre a história e cultura do cerrado goiano", galeriaImagens: [] as string[], galeriaVideos: [] as string[], precoPorPessoa: 15, duracaoHoras: 2, horarioSaida: "10:00", diasDisponiveis: ["D2", "D4"] },
        ],
        passeiosCards: [
          { id: "passeio-barco", titulo: "Passeio de Barco — Lago Corumbá", descricaoBreve: "Navegação pelo lago com paradas para banho e fotos", galeriaImagens: [] as string[], galeriaVideos: [] as string[], precoPorPessoa: 85, duracaoHoras: 3, horarioSaida: "09:00", diasDisponiveis: ["D2", "D3", "D4"], badgeTipo: "popular" as const },
          { id: "passeio-quadri", titulo: "Quadriciclo nas Trilhas do Cerrado", descricaoBreve: "Aventura off-road pelas trilhas com guia especializado", galeriaImagens: [] as string[], galeriaVideos: [] as string[], precoPorPessoa: 120, duracaoHoras: 2, horarioSaida: "08:00", diasDisponiveis: ["D3", "D5"] },
          { id: "passeio-pesca", titulo: "Pesca Esportiva Rio Quente", descricaoBreve: "Pesca esportiva com todo equipamento incluso e instrutor", galeriaImagens: [] as string[], galeriaVideos: [] as string[], precoPorPessoa: 95, duracaoHoras: 4, horarioSaida: "06:00", diasDisponiveis: ["D2", "D4"] },
        ],
        parquesAquaticosCards: [
          { id: "parque-hotpark", titulo: "Hot Park", descricaoBreve: "Maior parque de águas quentes do mundo — toboáguas, rio lento e praia artificial", galeriaImagens: [] as string[], galeriaVideos: [] as string[], precoPorPessoa: 189, duracaoHoras: 8, horarioSaida: "09:00", diasDisponiveis: ["D1", "D2", "D3", "D4"], badgeTipo: "ia" as const },
          { id: "parque-diroma", titulo: "Di Roma Acqua Park", descricaoBreve: "Piscinas termais, toboáguas radicais e área infantil completa", galeriaImagens: [] as string[], galeriaVideos: [] as string[], precoPorPessoa: 130, duracaoHoras: 6, horarioSaida: "10:00", diasDisponiveis: ["D2", "D3", "D5"], badgeTipo: "popular" as const },
          { id: "parque-lagoa", titulo: "Lagoa Quente Thermas", descricaoBreve: "Complexo termal com águas naturalmente aquecidas e spa relaxante", galeriaImagens: [] as string[], galeriaVideos: [] as string[], precoPorPessoa: 75, duracaoHoras: 5, horarioSaida: "10:00", diasDisponiveis: ["D1", "D3", "D4"] },
        ],
      };
      await updateExcursao(demoExcursao.id, {
        wizard: { ...(demoExcursao.wizard ?? {}), roteiroOficial: roteiroOficial },
      });
      console.log("[SEED] Roteiro oficial com 11 cards de Caldas Novas");
    }

    // 3. Grupo e convite
    const group = await ensureGroupForExcursao(demoExcursao.id, demoExcursao.nome, demoExcursao.capacidade);
    await upsertMembership(group.id, demoUser.id, demoUser.nome, "ADMIN");

    const { mutateDb } = await import("./persistence");
    const existingCode = await mutateDb((db: any) => {
      const invites = (db.inviteStore as Array<{ groupId: string; code: string; used: boolean }>) ?? [];
      return invites.find((i) => i.groupId === group.id && !i.used)?.code ?? null;
    });
    if (existingCode) {
      DEMO_INVITE_CODE = existingCode;
    } else {
      const inv = await createInvite(group.id, { multiUse: true });
      DEMO_INVITE_CODE = inv.code;
    }
    console.log(`[SEED] Convite demo → ${DEMO_INVITE_CODE} (excursão ${DEMO_EXCURSAO_ID})`);
  })();

  // ─── AUTH ────────────────────────────────────────────────────────────────

  app.post("/api/auth/register", async (req: Request, res: Response) => {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: parsed.error.issues[0].message });

    const { nome, email, telefone, cpf = "", senha } = parsed.data;

    const existing = await storage.getUserByEmail(email);
    if (existing) return res.status(409).json({ message: "E-mail já cadastrado" });

    if (cpf) {
      const existingCpf = await storage.getUserByCpf(cpf);
      if (existingCpf) return res.status(409).json({ message: "CPF já cadastrado" });
    }

    const hashedPassword = await hashPassword(senha);
    const user = await storage.createUser({
      username: email,
      password: hashedPassword,
      nome, email, telefone, cpf,
      role: "user", googleId: "", fotoUrl: "", provider: "local",
    });

    req.session.userId = user.id;
    return res.status(201).json(safeUser(user));
  });

  app.post("/api/auth/login", async (req: Request, res: Response) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: parsed.error.issues[0].message });

    const { identificador, senha } = parsed.data;

    const user = await storage.getUserByIdentifier(identificador);
    if (!user) return res.status(401).json({ message: "Credenciais não encontradas" });

    if (user.provider !== "local" || !user.password) {
      return res.status(401).json({ message: `Esta conta usa login via ${user.provider}. Use o botão correspondente.` });
    }

    const ok = await verifyPassword(senha, user.password);
    if (!ok) return res.status(401).json({ message: "Senha incorreta" });

    req.session.userId = user.id;
    return res.json(safeUser(user));
  });

  app.post("/api/auth/logout", (req: Request, res: Response) => {
    req.session.destroy(() => {
      res.json({ ok: true });
    });
  });

  app.get("/api/auth/me", async (req: Request, res: Response) => {
    if (!req.session.userId) return res.status(401).json({ message: "Não autenticado" });
    const user = await storage.getUser(req.session.userId);
    if (!user) return res.status(401).json({ message: "Usuário não encontrado" });
    return res.json(safeUser(user));
  });

  app.post("/api/auth/selfie", async (req: Request, res: Response) => {
    if (!req.session.userId) return res.status(401).json({ message: "Não autenticado" });
    const { fotoUrl } = req.body;
    if (!fotoUrl || typeof fotoUrl !== "string") {
      return res.status(400).json({ message: "Foto inválida" });
    }
    const updated = await storage.updateUser(req.session.userId, { fotoUrl });
    if (!updated) return res.status(404).json({ message: "Usuário não encontrado" });
    return res.json(safeUser(updated));
  });

  app.post("/api/auth/tornar-lider", async (req: Request, res: Response) => {
    if (!req.session.userId) return res.status(401).json({ message: "Não autenticado" });
    const user = await storage.getUser(req.session.userId);
    if (!user) return res.status(404).json({ message: "Usuário não encontrado" });
    if (user.role === "LIDER" || user.role === "admin") {
      return res.json({ ...safeUser(user), message: "Você já é um Líder!" });
    }
    const { tipoGrupo, qtdPessoas } = req.body as { tipoGrupo?: string; qtdPessoas?: number };
    console.log(`[LIDER-CANDIDATURA] user=${user.id} nome="${user.nome}" tipoGrupo=${tipoGrupo} qtdPessoas=${qtdPessoas}`);
    const updated = await storage.updateUser(req.session.userId, { role: "LIDER" });
    if (!updated) return res.status(500).json({ message: "Erro ao atualizar role" });
    return res.json(safeUser(updated));
  });

  // ─── GOOGLE OAUTH ─────────────────────────────────────────────────────────

  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
  const googleConfigured = !!(GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET);

  app.get("/api/demo/info", (_req: Request, res: Response) => {
    res.json({ excursaoId: DEMO_EXCURSAO_ID, inviteCode: DEMO_INVITE_CODE });
  });

  app.get("/api/auth/google/status", (_req: Request, res: Response) => {
    res.json({ configured: googleConfigured });
  });

  if (googleConfigured) {
    const { default: passport } = await import("passport");
    const { Strategy: GoogleStrategy } = await import("passport-google-oauth20");

    const CALLBACK_URL = process.env.NODE_ENV === "production"
      ? `${process.env.BASE_URL ?? ""}/api/auth/google/callback`
      : `http://localhost:5000/api/auth/google/callback`;

    passport.use(new GoogleStrategy(
      { clientID: GOOGLE_CLIENT_ID!, clientSecret: GOOGLE_CLIENT_SECRET!, callbackURL: CALLBACK_URL },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          let user = await storage.getUserByGoogleId(profile.id);
          if (!user) {
            const email = profile.emails?.[0]?.value ?? `${profile.id}@google.com`;
            user = await storage.getUserByEmail(email);
            if (user) {
              user = await storage.updateUser(user.id, { googleId: profile.id, provider: "google", fotoUrl: profile.photos?.[0]?.value ?? "" }) ?? user;
            } else {
              user = await storage.createUser({
                username: email, password: "", nome: profile.displayName ?? "Usuário Google",
                email, telefone: "", cpf: "", role: "user",
                googleId: profile.id, fotoUrl: profile.photos?.[0]?.value ?? "", provider: "google",
              });
            }
          }
          done(null, user);
        } catch (e) {
          done(e as Error);
        }
      }
    ));

    passport.serializeUser((user: any, done) => done(null, user.id));
    passport.deserializeUser(async (id: string, done) => {
      try { done(null, await storage.getUser(id)); } catch (e) { done(e); }
    });

    app.use(passport.initialize());
    app.use(passport.session());

    app.get("/api/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

    app.get("/api/auth/google/callback",
      passport.authenticate("google", { failureRedirect: "/entrar?erro=google" }),
      (req: Request, res: Response) => {
        const user = req.user as any;
        if (user) req.session.userId = user.id;
        res.redirect("/perfil");
      }
    );
  } else {
    app.get("/api/auth/google", (_req: Request, res: Response) => {
      res.redirect("/entrar?erro=google-nao-configurado");
    });
  }

  const getMembershipRole = async (excursao: Excursao, userId: string) => {
    if (!userId) return null;
    const group = await ensureGroupForExcursao(excursao.id, excursao.nome, excursao.capacidade);
    const memberships = await listMemberships(group.id);
    const role = memberships.find((m) => m.userId === userId)?.status ?? null;
    return { group, role };
  };

  const isAdminForExcursao = async (excursao: Excursao, userId: string) => {
    const info = await getMembershipRole(excursao, userId);
    return info?.role === "ADMIN";
  };

  type RoteiroCard = {
    id: string;
    titulo: string;
    descricaoBreve?: string;
    galeriaImagens: string[];
    galeriaVideos: string[];
    /** Preço por pessoa em BRL ou centavos (interpretado pelo cliente). */
    precoPorPessoa?: number;
    /** Duração da atividade em horas inteiras. */
    duracaoHoras?: number;
    /** Horário de saída aproximado, ex.: "09:00". */
    horarioSaida?: string;
    /** Dias da viagem em que a atividade está disponível, ex.: ["D1","D2"]. */
    diasDisponiveis?: string[];
    /** Badge visual sugerida para o card (Recomendado IA / Mais Popular). */
    badgeTipo?: "ia" | "popular";
    createdAt?: string;
    updatedAt?: string;
  };

  type RoteiroPayload = Partial<NonNullable<Excursao["wizard"]>["roteiroOficial"]> & { publish?: boolean };

  const toVehicleByCapacity = (capacidade: number): "Van" | "Micro" | "Ônibus" => {
    if (capacidade <= 15) return "Van";
    if (capacidade <= 28) return "Micro";
    return "Ônibus";
  };

  const sanitizeMediaList = (value: unknown) => {
    if (!Array.isArray(value)) return [];
    return value
      .map((v) => String(v ?? "").trim())
      .filter((v) => v.length > 0)
      .slice(0, 12);
  };

  const normalizeCard = (value: unknown, fallbackPrefix: string): RoteiroCard | null => {
    if (!value || typeof value !== "object") return null;
    const src = value as Record<string, unknown>;
    const titulo = String(src.titulo ?? src.valor ?? "").trim();
    if (!titulo) return null;
    const id = String(src.id ?? `${fallbackPrefix}-${Math.random().toString(36).slice(2, 9)}`);
    const descricaoBreve = String(src.descricaoBreve ?? src.descricao ?? "").trim() || undefined;
    const precoPorPessoaRaw = src.precoPorPessoa;
    const duracaoHorasRaw = src.duracaoHoras;
    const horarioSaidaRaw = src.horarioSaida;
    const diasDisponiveisRaw = src.diasDisponiveis;
    const precoPorPessoa =
      typeof precoPorPessoaRaw === "number" && Number.isFinite(precoPorPessoaRaw)
        ? precoPorPessoaRaw
        : undefined;
    const duracaoHoras =
      typeof duracaoHorasRaw === "number" && Number.isFinite(duracaoHorasRaw) && duracaoHorasRaw > 0
        ? duracaoHorasRaw
        : undefined;
    const horarioSaida =
      typeof horarioSaidaRaw === "string" && horarioSaidaRaw.trim().length > 0
        ? horarioSaidaRaw.trim()
        : undefined;
    const diasDisponiveis = Array.isArray(diasDisponiveisRaw)
      ? diasDisponiveisRaw
          .map((v) => String(v ?? "").trim())
          .filter((v) => v.length > 0)
          .slice(0, 10)
      : undefined;
    const badgeTipo =
      src.badgeTipo === "ia" || src.badgeTipo === "popular" ? (src.badgeTipo as "ia" | "popular") : undefined;
    return {
      id,
      titulo,
      descricaoBreve,
      galeriaImagens: sanitizeMediaList(src.galeriaImagens),
      galeriaVideos: sanitizeMediaList(src.galeriaVideos),
      precoPorPessoa,
      duracaoHoras,
      horarioSaida,
      diasDisponiveis,
      badgeTipo,
      createdAt: typeof src.createdAt === "string" ? src.createdAt : undefined,
      updatedAt: typeof src.updatedAt === "string" ? src.updatedAt : undefined,
    };
  };

  const normalizeCardsArray = (value: unknown, fallbackPrefix: string) => {
    if (!Array.isArray(value)) return [];
    return value
      .map((item, idx) => normalizeCard(item, `${fallbackPrefix}-${idx}`))
      .filter((item): item is RoteiroCard => Boolean(item));
  };

  const toCardsFromLegacyArray = (arr: string[], prefix: string) =>
    (arr || []).map((item, idx) => ({
      id: `${prefix}-${idx}-${Math.random().toString(36).slice(2, 7)}`,
      titulo: item,
      descricaoBreve: undefined,
      galeriaImagens: [],
      galeriaVideos: [],
    }));

  const normalizeCatalogCategory = (raw: string): RoteiroCatalogCategory | null => {
    if (
      raw === "atracoes" ||
      raw === "passeios" ||
      raw === "parquesAquaticos" ||
      raw === "refeicoes" ||
      raw === "transfers"
    ) {
      return raw;
    }
    return null;
  };

  const getCatalogo = (excursao: Excursao) => {
    const wizard = excursao.wizard ?? {};
    const catalogo = wizard.catalogoRoteiro ?? {
      atracoes: [],
      passeios: [],
      parquesAquaticos: [],
      refeicoes: [],
      transfers: [],
      updatedAt: undefined,
    };
    return {
      atracoes: normalizeCardsArray(catalogo.atracoes, "catalogo-atracao"),
      passeios: normalizeCardsArray(catalogo.passeios, "catalogo-passeio"),
      parquesAquaticos: normalizeCardsArray(catalogo.parquesAquaticos, "catalogo-parque"),
      refeicoes: normalizeCardsArray(catalogo.refeicoes, "catalogo-refeicao"),
      transfers: normalizeCardsArray(catalogo.transfers, "catalogo-transfer"),
      updatedAt: catalogo.updatedAt,
    };
  };

  // API de excursões (versão inicial em memória)

  app.get("/api/opcionais", (_req: Request, res: Response) => {
    res.json({ items: getOpcionais() });
  });

  app.get("/api/excursoes", async (_req: Request, res: Response) => {
    const items = await listExcursoes();
    res.json({ items });
  });

  app.get("/api/excursoes/:id", async (req: Request, res: Response) => {
    const item = await findExcursao(String(req.params.id));
    if (!item) {
      return res.status(404).json({
        error: "NOT_FOUND",
        message: "Excursão não encontrada",
        code: "EXCURSAO_NOT_FOUND",
      });
    }
    return res.json(item);
  });

  app.post("/api/excursoes", async (req: Request, res: Response) => {
    const userId = req.session.userId;
    if (!userId) {
      return res.status(401).json({ message: "Faça login para criar excursões.", code: "NOT_AUTHENTICATED" });
    }
    const requester = await storage.getUser(userId);
    if (!requester || (requester.role !== "LIDER" && requester.role !== "admin")) {
      return res.status(403).json({ message: "Apenas Líderes podem criar excursões.", code: "NOT_LIDER" });
    }

    const body = req.body as Partial<Excursao>;

    if (!body.nome || !body.dataIda || !body.dataVolta || !body.destino) {
      return res.status(400).json({
        error: "BAD_REQUEST",
        message: "Campos obrigatórios: nome, dataIda, dataVolta, destino",
        code: "EXCURSAO_INVALID_PAYLOAD",
      });
    }

    const novaPayload: Omit<Excursao, "id"> = {
      nome: body.nome,
      dataIda: body.dataIda,
      dataVolta: body.dataVolta,
      destino: body.destino,
      localSaida: body.localSaida || "A definir",
      capacidade: body.capacidade ?? 28,
      veiculoTipo: body.veiculoTipo || "Micro",
      status: (body.status as ExcursaoStatus) || "rascunho",
      wizard: body.wizard,
      anttNumero: body.anttNumero,
      anttValido: body.anttValido,
      cadasturNumero: body.cadasturNumero,
      cadasturValido: body.cadasturValido,
    };

    const nova = await createExcursao(novaPayload);
    const group = await ensureGroupForExcursao(nova.id, nova.nome, nova.capacidade);
    await createInvite(group.id);
    return res.status(201).json(nova);
  });

  app.get("/api/excursoes/:id/reservas", async (req: Request, res: Response) => {
    const item = await findExcursao(String(req.params.id));
    if (!item) {
      return res.status(404).json({
        error: "NOT_FOUND",
        message: "Excursão não encontrada",
        code: "EXCURSAO_NOT_FOUND",
      });
    }
    const reservas = await getReservasPorExcursao(String(req.params.id));
    return res.json({ items: reservas });
  });

  app.post("/api/excursoes/:id/reservas", async (req: Request, res: Response) => {
    const item = await findExcursao(String(req.params.id));
    if (!item) {
      return res.status(404).json({
        error: "NOT_FOUND",
        message: "Excursão não encontrada",
        code: "EXCURSAO_NOT_FOUND",
      });
    }
    const body = req.body as {
      passageiroId: string;
      passageiroNome: string;
      assento?: string;
      aceitouTermos?: boolean;
      termoVersao?: string;
    };
    if (!body.passageiroId || !body.passageiroNome) {
      return res.status(400).json({
        error: "BAD_REQUEST",
        message: "passageiroId e passageiroNome são obrigatórios",
        code: "RESERVA_INVALID_PAYLOAD",
      });
    }
    if (body.aceitouTermos !== true) {
      return res.status(400).json({
        error: "TERMOS_NAO_ACEITOS",
        message: "É necessário aceitar os termos de responsabilidade.",
        code: "TERMOS_NAO_ACEITOS",
      });
    }
    const dataExpiracaoPix = new Date(Date.now() + 15 * 60 * 1000);
    const forwarded = req.headers["x-forwarded-for"];
    const ipAceite =
      (req as unknown as { ip?: string }).ip ??
      (typeof forwarded === "string" ? forwarded : Array.isArray(forwarded) ? forwarded[0] : undefined) ??
      req.socket?.remoteAddress;
    const logAceite = {
      ipAceite: ipAceite ?? undefined,
      userAgent: req.get("User-Agent") ?? undefined,
      timestampAceite: new Date(),
      termoVersao: body.termoVersao ?? "1.0",
    };
    const reserva = await criarReserva(String(req.params.id), body.passageiroId, body.passageiroNome, {
      assento: body.assento,
      dataExpiracaoPix,
      logAceite,
    });
    const group = await ensureGroupForExcursao(item.id, item.nome, item.capacidade);
    await upsertMembership(group.id, body.passageiroId, body.passageiroNome, "MEMBER");
    await upsertOrder(group.id, body.passageiroId, { totalAmount: 450, paidAmount: 0 });
    return res.status(201).json(reserva);
  });

  app.delete("/api/excursoes/:id", async (req: Request, res: Response) => {
    const deleted = await deleteExcursao(String(req.params.id));
    if (!deleted) {
      return res.status(404).json({
        error: "NOT_FOUND",
        message: "Excursão não encontrada",
        code: "EXCURSAO_NOT_FOUND",
      });
    }
    return res.status(204).send();
  });

  app.patch("/api/excursoes/:id", async (req: Request, res: Response) => {
    const item = await findExcursao(String(req.params.id));
    if (!item) {
      return res.status(404).json({
        error: "NOT_FOUND",
        message: "Excursão não encontrada",
        code: "EXCURSAO_NOT_FOUND",
      });
    }

    const body = req.body as Partial<Excursao>;

    if (typeof body.nome === "string") item.nome = body.nome;
    if (typeof body.dataIda === "string") item.dataIda = body.dataIda;
    if (typeof body.dataVolta === "string") item.dataVolta = body.dataVolta;
    if (typeof body.destino === "string") item.destino = body.destino;
    if (typeof body.localSaida === "string") item.localSaida = body.localSaida;
    if (typeof body.capacidade === "number") item.capacidade = body.capacidade;
    if (typeof body.veiculoTipo === "string") item.veiculoTipo = body.veiculoTipo;
    if (typeof body.status === "string") item.status = body.status as ExcursaoStatus;

    if (body.wizard) {
      item.wizard = body.wizard;
    }
    if (typeof body.anttNumero !== "undefined") item.anttNumero = body.anttNumero;
    if (typeof body.anttValido !== "undefined") item.anttValido = body.anttValido;
    if (typeof body.cadasturNumero !== "undefined") item.cadasturNumero = body.cadasturNumero;
    if (typeof body.cadasturValido !== "undefined") item.cadasturValido = body.cadasturValido;

    const updated = await updateExcursao(String(req.params.id), item);
    return res.json(updated);
  });

  /** Verifica se a excursão pode ter reserva de veículo (certificações ANTT e Cadastur válidas). */
  app.get("/api/excursoes/:id/pode-reservar-veiculo", async (req: Request, res: Response) => {
    const item = await findExcursao(String(req.params.id));
    if (!item) {
      return res.status(404).json({
        error: "NOT_FOUND",
        message: "Excursão não encontrada",
        code: "EXCURSAO_NOT_FOUND",
      });
    }
    const anttOk = item.anttValido === true;
    const cadasturOk = item.cadasturValido === true;
    const ok = anttOk && cadasturOk;
    let motivo: string | undefined;
    if (!ok) {
      if (!anttOk && !cadasturOk) motivo = "Certificação ANTT e Cadastur inválidas ou não informadas.";
      else if (!anttOk) motivo = "Certificação ANTT inválida ou não informada.";
      else motivo = "Certificação Cadastur inválida ou não informada.";
    }
    return res.json({ ok, motivo });
  });

  /** Reserva de veículo: bloqueado se ANTT/Cadastur inválidos (middleware de conformidade). */
  app.post("/api/excursoes/:id/reservar-veiculo", async (req: Request, res: Response) => {
    const item = await findExcursao(String(req.params.id));
    if (!item) {
      return res.status(404).json({
        error: "NOT_FOUND",
        message: "Excursão não encontrada",
        code: "EXCURSAO_NOT_FOUND",
      });
    }
    if (item.anttValido !== true || item.cadasturValido !== true) {
      return res.status(403).json({
        error: "CONFORMIDADE_VEICULO",
        message: "Reserva de veículo bloqueada: certificação ANTT e/ou Cadastur inválida ou não informada.",
        code: "RESERVA_VEICULO_BLOQUEADA",
      });
    }
    return res.json({ ok: true, message: "Reserva de veículo permitida." });
  });

  /** Dispara alerta Socket.io: Pix expirado em 30 min (para clientes na sala da excursão). */
  app.post("/api/excursoes/:id/alertas/pix-expirado", async (req: Request, res: Response) => {
    const item = await findExcursao(String(req.params.id));
    if (!item) {
      return res.status(404).json({ error: "NOT_FOUND", message: "Excursão não encontrada", code: "EXCURSAO_NOT_FOUND" });
    }
    const body = (req.body as { passageiroNome?: string; valor?: number }) || {};
    emitPixExpirado(String(req.params.id), body);
    return res.json({ ok: true, message: "Alerta pix-expirado emitido." });
  });

  /** Dispara alerta Socket.io: Vigilância comunitária (Criança/Idoso) — com som no cliente. */
  app.post("/api/excursoes/:id/alertas/vigilancia", async (req: Request, res: Response) => {
    const item = await findExcursao(String(req.params.id));
    if (!item) {
      return res.status(404).json({ error: "NOT_FOUND", message: "Excursão não encontrada", code: "EXCURSAO_NOT_FOUND" });
    }
    const body = (req.body as { tipo: "crianca" | "idoso"; mensagem?: string }) || {};
    const tipo = body.tipo === "crianca" || body.tipo === "idoso" ? body.tipo : "crianca";
    emitVigilancia(String(req.params.id), tipo, { mensagem: body.mensagem });
    return res.json({ ok: true, message: "Alerta vigilância emitido." });
  });

  app.get("/api/excursoes/:id/stats", async (req: Request, res: Response) => {
    const item = await findExcursao(String(req.params.id));
    if (!item) {
      return res.status(404).json({ error: "NOT_FOUND", message: "Excursão não encontrada", code: "EXCURSAO_NOT_FOUND" });
    }
    const reservas = await getReservasPorExcursao(String(req.params.id));
    const ocupados = reservas.filter((r) => r.status === "confirmada").length;
    const precoBase = 450;
    const totalPassagens = ocupados * precoBase;
    const totalOpcionais = 0;
    const custosFixos = item.capacidade === 15 ? 2500 : item.capacidade === 28 ? 4000 : 6000;
    const receitaBruta = totalPassagens + totalOpcionais;
    const lucroLiquido = receitaBruta - custosFixos;
    const lucroPorPassageiro = ocupados > 0 ? lucroLiquido / ocupados : 0;
    return res.json({
      receitaBruta,
      totalOpcionais,
      custosFixos,
      lucroLiquido,
      lucroPorPassageiro,
      ocupados,
      capacidade: item.capacidade,
    });
  });

  app.get("/api/excursoes/:id/manifesto-antt", async (req: Request, res: Response) => {
    const item = await findExcursao(String(req.params.id));
    if (!item) {
      return res.status(404).json({ error: "NOT_FOUND", message: "Excursão não encontrada", code: "EXCURSAO_NOT_FOUND" });
    }
    const passageiros: PassageiroBurocracia[] = (item.wizard?.quem?.passageiros ?? []).map((p) => ({
      nome: p.nome,
      contato: p.contato,
      rg: p.rg,
      cpf: p.cpf,
    }));
    const manifesto = gerarManifestoANTT(
      item.id,
      (item as unknown as Record<string, string>).destino ?? "Caldas Novas",
      item.dataIda,
      item.dataVolta,
      item.veiculoTipo ?? "Ônibus",
      passageiros
    );
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", `attachment; filename="manifesto-antt-${req.params.id}.json"`);
    res.json(manifesto);
  });

  app.get("/api/excursoes/:id/fnrh", async (req: Request, res: Response) => {
    const item = await findExcursao(String(req.params.id));
    if (!item) {
      return res.status(404).json({ error: "NOT_FOUND", message: "Excursão não encontrada", code: "EXCURSAO_NOT_FOUND" });
    }
    const passageiros: PassageiroBurocracia[] = (item.wizard?.quem?.passageiros ?? []).map((p) => ({
      nome: p.nome,
      contato: p.contato,
      rg: p.rg,
      cpf: p.cpf,
    }));
    const fnrh = gerarFNRH(
      item.id,
      item.nome,
      item.dataIda,
      item.dataVolta,
      passageiros
    );
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", `attachment; filename="fnrh-${req.params.id}.json"`);
    res.json(fnrh);
  });

  app.get("/api/excursoes/:id/relatorio-contabil", async (req: Request, res: Response) => {
    const item = await findExcursao(String(req.params.id));
    if (!item) {
      return res.status(404).json({ error: "NOT_FOUND", message: "Excursão não encontrada", code: "EXCURSAO_NOT_FOUND" });
    }
    const reservas = await getReservasPorExcursao(item.id);
    const dados = reservas.map((r) => ({
      passageiroId: r.passageiroId,
      passageiroNome: r.passageiroNome,
      valorTotal: 450,
      valorPago: r.status === "confirmada" ? 450 : 0,
      status: r.status === "confirmada" ? "pago" as const : r.status === "cancelada" ? "cancelado" as const : "pendente" as const,
    }));
    const relatorio = gerarRelatorioContabil(item.id, item.dataIda, item.dataVolta, dados);
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", `attachment; filename="relatorio-contabil-${req.params.id}.json"`);
    res.json(relatorio);
  });

  app.get("/api/excursoes/:id/voucher/:passageiroIndex", async (req: Request, res: Response) => {
    const item = await findExcursao(String(req.params.id));
    if (!item) {
      return res.status(404).json({ error: "NOT_FOUND", message: "Excursão não encontrada", code: "EXCURSAO_NOT_FOUND" });
    }
    const list = item.wizard?.quem?.passageiros ?? [];
    const idx = parseInt(String(req.params.passageiroIndex), 10);
    if (isNaN(idx) || idx < 0 || idx >= list.length) {
      return res.status(400).json({ error: "BAD_REQUEST", message: "Índice de passageiro inválido" });
    }
    const p = list[idx];
    const requesterUserId = req.get("x-user-id");
    if (requesterUserId && requesterUserId !== String(idx)) {
      return res.status(403).json({
        error: "FORBIDDEN",
        message: "Sem permissão para acessar o voucher deste passageiro.",
        code: "VOUCHER_FORBIDDEN",
      });
    }
    const group = await ensureGroupForExcursao(item.id, item.nome, item.capacidade);
    const voucherStatus = await recalculateVoucherForGroup(group.id);
    if (!voucherStatus) {
      return res.status(403).json({
        error: "VOUCHER_LOCKED",
        message: "Voucher bloqueado: pagamento mínimo do grupo não atingido (R$500 em pagamentos).",
      });
    }
    const voucher = gerarVoucherVIP(item.id, String(idx), p.nome);
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", `attachment; filename="voucher-${req.params.id}-${idx}.json"`);
    res.json({ voucher, voucherCode: voucherStatus.voucherCode, discount: voucherStatus.discount });
  });

  /** Dispara estado do grupo (votação, lista de espera, passageiros) para a sala da excursão via Socket. Alternativa HTTP ao emit "atualizar-estado-grupo". */
  app.post("/api/excursoes/:id/estado-grupo", async (req: Request, res: Response) => {
    const item = await findExcursao(String(req.params.id));
    if (!item) {
      return res.status(404).json({
        error: "NOT_FOUND",
        message: "Excursão não encontrada",
        code: "EXCURSAO_NOT_FOUND",
      });
    }
    const body = (req.body as {
      votacao?: number[];
      listaEspera?: unknown;
      passageirosCount?: number;
      passageiros?: Array<{ nome: string; contato: string; rg?: string; cpf?: string }>;
    }) || {};
    emitEstadoGrupo(String(req.params.id), {
      votacao: body.votacao,
      listaEspera: body.listaEspera,
      passageirosCount: body.passageirosCount,
      passageiros: body.passageiros,
    });
    return res.json({ ok: true, message: "Estado do grupo emitido." });
  });

  app.post("/api/excursoes/:id/invites", async (req: Request, res: Response) => {
    const excursao = await findExcursao(String(req.params.id));
    if (!excursao) return res.status(404).json({ error: "NOT_FOUND", message: "Excursão não encontrada" });
    const group = await ensureGroupForExcursao(excursao.id, excursao.nome, excursao.capacidade);
    const invite = await createInvite(group.id);
    const joinUrl = `${req.protocol}://${req.get("host")}/join?code=${encodeURIComponent(invite.code)}`;
    return res.status(201).json({ invite, joinUrl });
  });

  app.post("/api/invites/validate", async (req: Request, res: Response) => {
    const code = String((req.body as { code?: string })?.code ?? "");
    const result = await validateInvite(code);
    if (!result.valid || !result.invite) return res.status(400).json({ ok: false, reason: result.reason });
    return res.json({
      ok: true,
      invite: result.invite,
    });
  });

  app.get("/api/invites/:code", async (req: Request, res: Response) => {
    const code = String(req.params.code ?? "");
    const result = await validateInvite(code);
    if (!result.valid || !result.invite) return res.status(400).json({ ok: false, reason: result.reason });
    const group = await getGroupById(result.invite.groupId);
    if (!group) return res.status(404).json({ ok: false, reason: "GROUP_NOT_FOUND" });
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
    if (!result.valid || !result.invite) return res.status(400).json({ ok: false, reason: result.reason });
    const group = await getGroupById(result.invite.groupId);
    if (!group) return res.status(404).json({ ok: false, reason: "GROUP_NOT_FOUND" });
    await consumeInvite(body.code);
    const membership = await upsertMembership(result.invite.groupId, body.userId, body.nome, "MEMBER");
    return res.json({ ok: true, membership, excursaoId: group.excursaoId });
  });

  app.post("/api/excursoes/:id/solicitar-participacao", async (req: Request, res: Response) => {
    const excursao = await findExcursao(String(req.params.id));
    if (!excursao) return res.status(404).json({ error: "NOT_FOUND", message: "Excursão não encontrada" });
    const body = (req.body as { userId?: string; nome?: string }) || {};
    if (!body.userId || !body.nome) return res.status(400).json({ error: "BAD_REQUEST", message: "userId e nome obrigatórios" });
    const group = await ensureGroupForExcursao(excursao.id, excursao.nome, excursao.capacidade);
    const membership = await upsertMembership(group.id, body.userId, body.nome, "PENDING");
    return res.status(201).json({ ok: true, membership });
  });

  app.post("/api/excursoes/:id/creator-setup", async (req: Request, res: Response) => {
    const excursao = await findExcursao(String(req.params.id));
    if (!excursao) return res.status(404).json({ error: "NOT_FOUND", message: "Excursão não encontrada" });
    const body = (req.body as { userId?: string; nome?: string }) || {};
    if (!body.userId || !body.nome) return res.status(400).json({ error: "BAD_REQUEST", message: "userId e nome obrigatórios" });
    const group = await ensureGroupForExcursao(excursao.id, excursao.nome, excursao.capacidade);
    const membership = await upsertMembership(group.id, body.userId, body.nome, "ADMIN");
    return res.status(201).json({ ok: true, group, membership });
  });

  app.get("/api/excursoes/:id/me-role", async (req: Request, res: Response) => {
    const excursao = await findExcursao(String(req.params.id));
    if (!excursao) return res.status(404).json({ error: "NOT_FOUND", message: "Excursão não encontrada" });
    const sessionUserId = (req.session as any).userId as string | undefined;
    const { userId: headerUserId } = getActorFromHeaders(req);
    const userId = sessionUserId || headerUserId;
    if (!userId) return res.json({ role: null, isAdmin: false });
    const info = await getMembershipRole(excursao, userId);
    return res.json({ role: info?.role ?? null, isAdmin: info?.role === "ADMIN" });
  });

  app.get("/api/excursoes/:id/roteiro", async (req: Request, res: Response) => {
    const excursao = await findExcursao(String(req.params.id));
    if (!excursao) return res.status(404).json({ error: "NOT_FOUND", message: "Excursão não encontrada" });
    const raw = excursao.wizard?.roteiroOficial ?? {
      veiculoTipo: excursao.veiculoTipo,
      atracoes: [],
      passeios: [],
      parquesAquaticos: [],
      veiculoAutomatico: true,
      manualVehicleOverride: false,
    };
    const atracoesLegacy = Array.isArray(raw.atracoes) ? raw.atracoes : [];
    const passeiosLegacy = Array.isArray(raw.passeios) ? raw.passeios : [];
    const parquesLegacy = Array.isArray(raw.parquesAquaticos) ? raw.parquesAquaticos : [];
    const hoteisCards = normalizeCardsArray(raw.hoteis, "hotel");
    const atracoesCards = normalizeCardsArray(raw.atracoesCards, "atracao");
    const passeiosCards = normalizeCardsArray(raw.passeiosCards, "passeio");
    const parquesCards = normalizeCardsArray(raw.parquesAquaticosCards, "parque");
    const normalizedVehicle = raw.veiculoTipo || excursao.veiculoTipo || toVehicleByCapacity(excursao.capacidade);
    const roteiro = {
      ...raw,
      veiculoTipo: normalizedVehicle,
      veiculoAutomatico: raw.veiculoAutomatico !== false,
      manualVehicleOverride: raw.manualVehicleOverride === true,
      atracoes: atracoesLegacy,
      passeios: passeiosLegacy,
      parquesAquaticos: parquesLegacy,
      hoteis: hoteisCards.length > 0
        ? hoteisCards
        : (raw.hotelPrincipal ? toCardsFromLegacyArray([raw.hotelPrincipal], "hotel") : []),
      atracoesCards: atracoesCards.length > 0 ? atracoesCards : toCardsFromLegacyArray(atracoesLegacy, "atracao"),
      passeiosCards: passeiosCards.length > 0 ? passeiosCards : toCardsFromLegacyArray(passeiosLegacy, "passeio"),
      parquesAquaticosCards: parquesCards.length > 0 ? parquesCards : toCardsFromLegacyArray(parquesLegacy, "parque"),
    };
    return res.json({ roteiro });
  });

  app.patch("/api/excursoes/:id/roteiro", async (req: Request, res: Response) => {
    const excursao = await findExcursao(String(req.params.id));
    if (!excursao) return res.status(404).json({ error: "NOT_FOUND", message: "Excursão não encontrada" });
    const { userId, nome } = getActorFromHeaders(req);
    const group = await ensureGroupForExcursao(excursao.id, excursao.nome, excursao.capacidade);
    const membership = await getMembershipRole(excursao, userId);
    const hasAnyMembership = (await listMemberships(group.id)).length > 0;
    if (membership?.role !== "ADMIN") {
      if (!hasAnyMembership && userId) {
        await upsertMembership(group.id, userId, nome, "ADMIN");
      } else {
        return res.status(403).json({ error: "FORBIDDEN", message: "Somente admin pode editar roteiro oficial" });
      }
    }
    const body = (req.body as RoteiroPayload) || {};
    const prevWizard = excursao.wizard ?? {};
    const prevRoteiro = prevWizard.roteiroOficial ?? {
      veiculoTipo: excursao.veiculoTipo,
      veiculoAutomatico: true,
      manualVehicleOverride: false,
      atracoes: [],
      passeios: [],
      parquesAquaticos: [],
    };
    const atracoesCards = normalizeCardsArray(body.atracoesCards, "atracao");
    const passeiosCards = normalizeCardsArray(body.passeiosCards, "passeio");
    const parquesCards = normalizeCardsArray(body.parquesAquaticosCards, "parque");
    const hoteisCards = normalizeCardsArray(body.hoteis, "hotel");

    const atracoesLegacy = Array.isArray(body.atracoes)
      ? body.atracoes.map((v) => String(v))
      : atracoesCards.length > 0
        ? atracoesCards.map((c) => c.titulo)
        : prevRoteiro.atracoes ?? [];
    const passeiosLegacy = Array.isArray(body.passeios)
      ? body.passeios.map((v) => String(v))
      : passeiosCards.length > 0
        ? passeiosCards.map((c) => c.titulo)
        : prevRoteiro.passeios ?? [];
    const parquesLegacy = Array.isArray(body.parquesAquaticos)
      ? body.parquesAquaticos.map((v) => String(v))
      : parquesCards.length > 0
        ? parquesCards.map((c) => c.titulo)
        : prevRoteiro.parquesAquaticos ?? [];
    const derivedHotelPrincipal = typeof body.hotelPrincipal === "string"
      ? body.hotelPrincipal
      : hoteisCards[0]?.titulo ?? prevRoteiro.hotelPrincipal;

    const veiculoAutomatico = body.veiculoAutomatico !== undefined
      ? body.veiculoAutomatico === true
      : prevRoteiro.veiculoAutomatico !== false;
    const manualVehicleOverride = body.manualVehicleOverride !== undefined
      ? body.manualVehicleOverride === true
      : prevRoteiro.manualVehicleOverride === true;
    const autoVehicle = toVehicleByCapacity(excursao.capacidade);
    const requestedVehicle = typeof body.veiculoTipo === "string" ? body.veiculoTipo : undefined;
    const vehicleFromRule = manualVehicleOverride && requestedVehicle
      ? requestedVehicle
      : (veiculoAutomatico ? autoVehicle : (requestedVehicle || prevRoteiro.veiculoTipo || autoVehicle));

    const roteiro = {
      ...prevRoteiro,
      ...body,
      veiculoTipo: vehicleFromRule,
      veiculoAutomatico,
      manualVehicleOverride,
      hotelPrincipal: derivedHotelPrincipal,
      atracoes: atracoesLegacy,
      passeios: passeiosLegacy,
      parquesAquaticos: parquesLegacy,
      hoteis: hoteisCards.length > 0 ? hoteisCards : normalizeCardsArray(prevRoteiro.hoteis, "hotel"),
      atracoesCards: atracoesCards.length > 0 ? atracoesCards : normalizeCardsArray(prevRoteiro.atracoesCards, "atracao"),
      passeiosCards: passeiosCards.length > 0 ? passeiosCards : normalizeCardsArray(prevRoteiro.passeiosCards, "passeio"),
      parquesAquaticosCards: parquesCards.length > 0 ? parquesCards : normalizeCardsArray(prevRoteiro.parquesAquaticosCards, "parque"),
      updatedByAdminAt: new Date().toISOString(),
      publishedAt: body.publish ? new Date().toISOString() : prevRoteiro.publishedAt,
    };
    const updated = await updateExcursao(excursao.id, {
      veiculoTipo: roteiro.veiculoTipo ?? excursao.veiculoTipo,
      wizard: { ...prevWizard, roteiroOficial: roteiro },
    });
    return res.json({ ok: true, roteiro: updated?.wizard?.roteiroOficial ?? roteiro });
  });

  app.get("/api/excursoes/:id/catalogo-roteiro", async (req: Request, res: Response) => {
    const excursao = await findExcursao(String(req.params.id));
    if (!excursao) return res.status(404).json({ error: "NOT_FOUND", message: "Excursão não encontrada" });
    return res.json({ items: getCatalogo(excursao) });
  });

  app.post("/api/excursoes/:id/catalogo-roteiro/:categoria", async (req: Request, res: Response) => {
    const excursao = await findExcursao(String(req.params.id));
    if (!excursao) return res.status(404).json({ error: "NOT_FOUND", message: "Excursão não encontrada" });
    const categoria = normalizeCatalogCategory(String(req.params.categoria || ""));
    if (!categoria) return res.status(400).json({ error: "BAD_REQUEST", message: "Categoria inválida" });
    const body = (req.body as Partial<RoteiroCatalogCard>) || {};
    const normalized = normalizeCard(body, `catalogo-${categoria}`);
    if (!normalized) return res.status(400).json({ error: "BAD_REQUEST", message: "Título obrigatório" });
    const now = new Date().toISOString();
    const catalogoAtual = getCatalogo(excursao);
    const item: RoteiroCatalogCard = { ...normalized, createdAt: now, updatedAt: now };
    const next = {
      ...catalogoAtual,
      [categoria]: [item, ...catalogoAtual[categoria]],
      updatedAt: now,
    };
    await updateExcursao(excursao.id, {
      wizard: {
        ...(excursao.wizard ?? {}),
        catalogoRoteiro: next,
      },
    });
    return res.status(201).json({ ok: true, item, categoria });
  });

  app.patch("/api/excursoes/:id/catalogo-roteiro/:categoria/:itemId", async (req: Request, res: Response) => {
    const excursao = await findExcursao(String(req.params.id));
    if (!excursao) return res.status(404).json({ error: "NOT_FOUND", message: "Excursão não encontrada" });
    const categoria = normalizeCatalogCategory(String(req.params.categoria || ""));
    if (!categoria) return res.status(400).json({ error: "BAD_REQUEST", message: "Categoria inválida" });
    const itemId = String(req.params.itemId || "");
    const catalogoAtual = getCatalogo(excursao);
    const arr = [...catalogoAtual[categoria]];
    const idx = arr.findIndex((i) => i.id === itemId);
    if (idx < 0) return res.status(404).json({ error: "NOT_FOUND", message: "Item não encontrado" });
    const body = (req.body as Partial<RoteiroCatalogCard>) || {};
    const merged = normalizeCard({ ...arr[idx], ...body, id: arr[idx].id }, `catalogo-${categoria}`);
    if (!merged) return res.status(400).json({ error: "BAD_REQUEST", message: "Título obrigatório" });
    const now = new Date().toISOString();
    arr[idx] = { ...merged, createdAt: arr[idx].createdAt, updatedAt: now };
    const next = { ...catalogoAtual, [categoria]: arr, updatedAt: now };
    await updateExcursao(excursao.id, {
      wizard: {
        ...(excursao.wizard ?? {}),
        catalogoRoteiro: next,
      },
    });
    return res.json({ ok: true, item: arr[idx], categoria });
  });

  app.delete("/api/excursoes/:id/catalogo-roteiro/:categoria/:itemId", async (req: Request, res: Response) => {
    const excursao = await findExcursao(String(req.params.id));
    if (!excursao) return res.status(404).json({ error: "NOT_FOUND", message: "Excursão não encontrada" });
    const categoria = normalizeCatalogCategory(String(req.params.categoria || ""));
    if (!categoria) return res.status(400).json({ error: "BAD_REQUEST", message: "Categoria inválida" });
    const itemId = String(req.params.itemId || "");
    const catalogoAtual = getCatalogo(excursao);
    const nextItems = catalogoAtual[categoria].filter((i) => i.id !== itemId);
    if (nextItems.length === catalogoAtual[categoria].length) {
      return res.status(404).json({ error: "NOT_FOUND", message: "Item não encontrado" });
    }
    const now = new Date().toISOString();
    const next = { ...catalogoAtual, [categoria]: nextItems, updatedAt: now };
    await updateExcursao(excursao.id, {
      wizard: {
        ...(excursao.wizard ?? {}),
        catalogoRoteiro: next,
      },
    });
    return res.json({ ok: true, categoria, removedId: itemId });
  });

  app.post("/api/excursoes/:id/sugestoes-roteiro", async (req: Request, res: Response) => {
    const excursao = await findExcursao(String(req.params.id));
    if (!excursao) return res.status(404).json({ error: "NOT_FOUND", message: "Excursão não encontrada" });
    const { userId, nome } = getActorFromHeaders(req);
    if (!userId) return res.status(400).json({ error: "BAD_REQUEST", message: "x-user-id obrigatório" });
    const info = await getMembershipRole(excursao, userId);
    if (!info || !info.role || info.role === "REJEITADO" || info.role === "PENDENTE") {
      return res.status(403).json({ error: "FORBIDDEN", message: "Somente membros aprovados podem sugerir" });
    }
    const body = (req.body as { categoria?: "veiculo" | "hotel" | "atracao" | "passeio" | "parque" | "outro"; valor?: string; descricao?: string }) || {};
    if (!body.categoria || !body.valor) return res.status(400).json({ error: "BAD_REQUEST", message: "categoria e valor obrigatórios" });
    const prevWizard = excursao.wizard ?? {};
    const prev = prevWizard.sugestoesRoteiro ?? [];
    const now = new Date().toISOString();
    const sugestao = {
      id: `sug-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
      userId,
      nomeAutor: nome,
      categoria: body.categoria,
      valor: body.valor,
      descricao: body.descricao,
      status: "PENDENTE" as const,
      publishedForVoting: false,
      createdAt: now,
      updatedAt: now,
    };
    await updateExcursao(excursao.id, {
      wizard: { ...prevWizard, sugestoesRoteiro: [sugestao, ...prev] },
    });
    return res.status(201).json({ ok: true, sugestao });
  });

  app.get("/api/excursoes/:id/sugestoes-roteiro", async (req: Request, res: Response) => {
    const excursao = await findExcursao(String(req.params.id));
    if (!excursao) return res.status(404).json({ error: "NOT_FOUND", message: "Excursão não encontrada" });
    const { userId } = getActorFromHeaders(req);
    const isAdmin = await isAdminForExcursao(excursao, userId);
    if (!isAdmin) return res.status(403).json({ error: "FORBIDDEN", message: "Somente admin pode moderar sugestões" });
    return res.json({ items: excursao.wizard?.sugestoesRoteiro ?? [] });
  });

  app.patch("/api/excursoes/:id/sugestoes-roteiro/:sugestaoId", async (req: Request, res: Response) => {
    const excursao = await findExcursao(String(req.params.id));
    if (!excursao) return res.status(404).json({ error: "NOT_FOUND", message: "Excursão não encontrada" });
    const { userId } = getActorFromHeaders(req);
    if (!(await isAdminForExcursao(excursao, userId))) {
      return res.status(403).json({ error: "FORBIDDEN", message: "Somente admin pode moderar sugestões" });
    }
    const body = (req.body as { status?: "APROVADA" | "REJEITADA"; publishForVoting?: boolean }) || {};
    if (!body.status) return res.status(400).json({ error: "BAD_REQUEST", message: "status obrigatório" });
    const prevWizard = excursao.wizard ?? {};
    const sugestoes = [...(prevWizard.sugestoesRoteiro ?? [])];
    const idx = sugestoes.findIndex((s) => s.id === String(req.params.sugestaoId));
    if (idx < 0) return res.status(404).json({ error: "NOT_FOUND", message: "Sugestão não encontrada" });
    const now = new Date().toISOString();
    sugestoes[idx] = {
      ...sugestoes[idx],
      status: body.status,
      publishedForVoting: body.status === "APROVADA" && body.publishForVoting === true,
      updatedAt: now,
    };
    const votacao = prevWizard.votacaoRoteiro ?? { items: [], updatedAt: now };
    if (sugestoes[idx].publishedForVoting) {
      const exists = votacao.items.some((i) => i.id === sugestoes[idx].id);
      if (!exists) {
        votacao.items.push({
          id: sugestoes[idx].id,
          categoria: sugestoes[idx].categoria,
          valor: sugestoes[idx].valor,
          votos: 0,
        });
      }
    }
    votacao.updatedAt = now;
    const updated = await updateExcursao(excursao.id, {
      wizard: { ...prevWizard, sugestoesRoteiro: sugestoes, votacaoRoteiro: votacao },
    });
    return res.json({ ok: true, sugestao: sugestoes[idx], votacao: updated?.wizard?.votacaoRoteiro ?? votacao });
  });

  app.get("/api/excursoes/:id/votacao-roteiro", async (req: Request, res: Response) => {
    const excursao = await findExcursao(String(req.params.id));
    if (!excursao) return res.status(404).json({ error: "NOT_FOUND", message: "Excursão não encontrada" });
    return res.json({ items: excursao.wizard?.votacaoRoteiro?.items ?? [] });
  });

  app.post("/api/excursoes/:id/votacao-roteiro", async (req: Request, res: Response) => {
    const excursao = await findExcursao(String(req.params.id));
    if (!excursao) return res.status(404).json({ error: "NOT_FOUND", message: "Excursão não encontrada" });
    const { userId } = getActorFromHeaders(req);
    if (!userId) return res.status(400).json({ error: "BAD_REQUEST", message: "x-user-id obrigatório" });
    const info = await getMembershipRole(excursao, userId);
    if (!info || !info.role || info.role === "REJEITADO" || info.role === "PENDENTE") {
      return res.status(403).json({ error: "FORBIDDEN", message: "Somente membros aprovados podem votar" });
    }
    const itemId = String((req.body as { itemId?: string })?.itemId ?? "");
    if (!itemId) return res.status(400).json({ error: "BAD_REQUEST", message: "itemId obrigatório" });
    const prevWizard = excursao.wizard ?? {};
    const votacao = prevWizard.votacaoRoteiro ?? { items: [], updatedAt: new Date().toISOString() };
    const idx = votacao.items.findIndex((i) => i.id === itemId);
    if (idx < 0) return res.status(404).json({ error: "NOT_FOUND", message: "Item de votação não encontrado" });
    votacao.items[idx] = { ...votacao.items[idx], votos: (votacao.items[idx].votos ?? 0) + 1 };
    votacao.updatedAt = new Date().toISOString();
    await updateExcursao(excursao.id, {
      wizard: { ...prevWizard, votacaoRoteiro: votacao },
    });
    return res.json({ ok: true, item: votacao.items[idx], items: votacao.items });
  });

  app.get("/api/excursoes/:id/solicitacoes", async (req: Request, res: Response) => {
    const excursao = await findExcursao(String(req.params.id));
    if (!excursao) return res.status(404).json({ error: "NOT_FOUND", message: "Excursão não encontrada" });
    const group = await ensureGroupForExcursao(excursao.id, excursao.nome, excursao.capacidade);
    const pendentes = await listMemberships(group.id, "PENDENTE");
    return res.json({ items: pendentes });
  });

  app.get("/api/excursoes/:id/solicitacoes/resumo", async (req: Request, res: Response) => {
    const excursao = await findExcursao(String(req.params.id));
    if (!excursao) return res.status(404).json({ error: "NOT_FOUND", message: "Excursão não encontrada" });
    const group = await ensureGroupForExcursao(excursao.id, excursao.nome, excursao.capacidade);
    const all = await listMemberships(group.id);
    const periodRaw = String(req.query.period ?? "today");
    const period = periodRaw === "today" || periodRaw === "7d" || periodRaw === "30d" ? periodRaw : "today";
    const now = Date.now();
    const hoje = new Date(now).toDateString();
    const inPeriod = (value?: string) => {
      const ts = new Date(value || "").getTime();
      if (!Number.isFinite(ts)) return false;
      if (period === "today") return new Date(ts).toDateString() === hoje;
      const days = period === "7d" ? 7 : 30;
      const diff = now - ts;
      return diff >= 0 && diff <= days * 24 * 60 * 60 * 1000;
    };
    const pendentes = all.filter((m) => m.status === "PENDENTE").length;
    const aprovadosPeriodo = all.filter((m) => m.status === "MEMBER" && inPeriod(m.updatedAt || m.createdAt)).length;
    const reprovadosPeriodo = all.filter((m) => m.status === "REJEITADO" && inPeriod(m.updatedAt || m.createdAt)).length;
    return res.json({ pendentes, aprovadosPeriodo, reprovadosPeriodo, period });
  });

  app.patch("/api/excursoes/:id/solicitacoes/:userId", async (req: Request, res: Response) => {
    const excursao = await findExcursao(String(req.params.id));
    if (!excursao) return res.status(404).json({ error: "NOT_FOUND", message: "Excursão não encontrada" });
    const body = (req.body as { aprovar?: boolean; nome?: string }) || {};
    const group = await ensureGroupForExcursao(excursao.id, excursao.nome, excursao.capacidade);
    const membership = await upsertMembership(
      group.id,
      String(req.params.userId),
      body.nome || "Membro",
      body.aprovar === false ? "REJEITADO" : "MEMBER",
    );
    return res.json({ ok: true, membership });
  });

  app.post("/api/excursoes/:id/clonar", async (req: Request, res: Response) => {
    const origem = await findExcursao(String(req.params.id));
    if (!origem) return res.status(404).json({ error: "NOT_FOUND", message: "Excursão base não encontrada" });
    const body = (req.body as Partial<Excursao>) || {};
    const nova = await createExcursao({
      nome: body.nome || `${origem.nome} - Minha Excursão`,
      dataIda: body.dataIda || origem.dataIda,
      dataVolta: body.dataVolta || origem.dataVolta,
      destino: body.destino || origem.destino,
      localSaida: body.localSaida || origem.localSaida || "A definir",
      capacidade: body.capacidade ?? origem.capacidade,
      veiculoTipo: body.veiculoTipo || origem.veiculoTipo,
      status: "rascunho",
      wizard: origem.wizard,
      anttNumero: undefined,
      anttValido: false,
      cadasturNumero: undefined,
      cadasturValido: false,
    });
    const group = await ensureGroupForExcursao(nova.id, nova.nome, nova.capacidade);
    await createInvite(group.id);
    return res.status(201).json(nova);
  });

  app.patch("/api/excursoes/:id/orders/:userId", async (req: Request, res: Response) => {
    const excursao = await findExcursao(String(req.params.id));
    if (!excursao) return res.status(404).json({ error: "NOT_FOUND", message: "Excursão não encontrada" });
    const group = await ensureGroupForExcursao(excursao.id, excursao.nome, excursao.capacidade);
    const body = (req.body as { totalAmount?: number; paidAmount?: number; hotelId?: string }) || {};
    const order = await upsertOrder(group.id, String(req.params.userId), {
      totalAmount: body.totalAmount ?? 0,
      paidAmount: body.paidAmount ?? 0,
    });
    const voucher = await recalculateVoucherForGroup(group.id);
    return res.json({ order, voucher });
  });

  app.get("/api/admin/stats/:excursaoId", async (req: Request, res: Response) => {
    const excursao = await findExcursao(String(req.params.excursaoId));
    if (!excursao) return res.status(404).json({ error: "NOT_FOUND", message: "Excursão não encontrada" });
    const group = await ensureGroupForExcursao(excursao.id, excursao.nome, excursao.capacidade);
    const orders = await listOrders(group.id);
    const membros = await listMemberships(group.id, "MEMBER");
    const receita = orders.reduce((acc, o) => acc + o.paidAmount, 0);
    const custos = excursao.capacidade <= 15 ? 2500 : excursao.capacidade <= 28 ? 4000 : 6000;
    const lucro = receita - custos;
    const lucroPorPoltrona = membros.length > 0 ? lucro / membros.length : 0;
    return res.json({
      receita,
      custos,
      lucro,
      lucroPorPoltrona,
      ocupados: membros.length,
      capacidade: excursao.capacidade,
      alertaUpgradeFrota: membros.length >= 15,
    });
  });

  app.get("/api/admin/solicitacoes/resumo", async (req: Request, res: Response) => {
    const periodRaw = String(req.query.period ?? "today");
    const period = periodRaw === "today" || periodRaw === "7d" || periodRaw === "30d" ? periodRaw : "today";
    const now = Date.now();
    const hoje = new Date(now).toDateString();
    const inPeriod = (value?: string) => {
      const ts = new Date(value || "").getTime();
      if (!Number.isFinite(ts)) return false;
      if (period === "today") return new Date(ts).toDateString() === hoje;
      const days = period === "7d" ? 7 : 30;
      const diff = now - ts;
      return diff >= 0 && diff <= days * 24 * 60 * 60 * 1000;
    };

    const excursoes = await listExcursoes();
    const grupos = await Promise.all(
      excursoes.map((e) => ensureGroupForExcursao(e.id, e.nome, e.capacidade)),
    );
    const membershipsByGroup = await Promise.all(grupos.map((g) => listMemberships(g.id)));
    const all = membershipsByGroup.flat();

    const pendentes = all.filter((m) => m.status === "PENDENTE").length;
    const aprovadosPeriodo = all.filter((m) => m.status === "MEMBER" && inPeriod(m.updatedAt || m.createdAt)).length;
    const reprovadosPeriodo = all.filter((m) => m.status === "REJEITADO" && inPeriod(m.updatedAt || m.createdAt)).length;

    return res.json({
      pendentes,
      aprovadosPeriodo,
      reprovadosPeriodo,
      period,
      totalExcursoes: excursoes.length,
    });
  });

  // ─────────────────────────────────────────────
  // NTX — WaaS (WhatsApp as a Service)
  // ─────────────────────────────────────────────
  app.get("/api/waas/status", (_req: Request, res: Response) => {
    res.json(getWaasStatus());
  });

  app.get("/api/waas/grupos", (_req: Request, res: Response) => {
    res.json([]);
  });

  app.post("/api/waas/criar-grupo", async (req: Request, res: Response) => {
    const { name, phone } = req.body as { name?: string; phone?: string };
    if (!name || !phone) return res.status(400).json({ error: "name e phone são obrigatórios" });
    try {
      const result = await createExcursionGroup(name, phone);
      return res.json(result);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Erro interno";
      return res.status(500).json({ error: msg });
    }
  });

  app.post("/api/waas/:excursaoId/mensagem", async (req: Request, res: Response) => {
    const excursaoId = String(req.params.excursaoId);
    const { text } = req.body as { text?: string };
    if (!text) return res.status(400).json({ error: "text é obrigatório" });
    try {
      const result = await sendTextToGroup(excursaoId, text);
      return res.json(result);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Erro interno";
      return res.status(500).json({ error: msg });
    }
  });

  app.post("/api/waas/:excursaoId/enquete", async (req: Request, res: Response) => {
    const excursaoId = String(req.params.excursaoId);
    const { question, options } = req.body as { question?: string; options?: string[] };
    if (!question || !options?.length) return res.status(400).json({ error: "question e options são obrigatórios" });
    try {
      const result = await sendPollToGroup(excursaoId, question, options);
      return res.json(result);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Erro interno";
      return res.status(500).json({ error: msg });
    }
  });

  app.get("/api/waas/:excursaoId/status", (req: Request, res: Response) => {
    const excursaoId = String(req.params.excursaoId);
    res.json({ excursaoId, aiPaused: isAIPaused(excursaoId), handoff: getHandoffInfo(excursaoId) });
  });

  // ─────────────────────────────────────────────
  // NTX — Split Pix Payment
  // ─────────────────────────────────────────────
  app.post("/api/pagamento/gerar-pix", async (req: Request, res: Response) => {
    const { excursaoId, amount, passengerName, organizerCommission } = req.body as {
      excursaoId?: string; amount?: number; passengerName?: string; organizerCommission?: number;
    };
    if (!excursaoId || !amount || !passengerName) return res.status(400).json({ error: "excursaoId, amount e passengerName são obrigatórios" });
    try {
      const result = await createSplitPaymentPix(amount, excursaoId, passengerName, organizerCommission ?? 0);
      return res.json(result);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Erro interno";
      return res.status(500).json({ error: msg });
    }
  });

  app.get("/api/pagamento/status/:transactionId", async (req: Request, res: Response) => {
    const transactionId = String(req.params.transactionId);
    try {
      const result = await checkPaymentStatus(transactionId);
      return res.json(result);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Erro interno";
      return res.status(500).json({ error: msg });
    }
  });

  app.post("/api/webhook/payment", async (req: Request, res: Response) => {
    const { event, data } = req.body as { event?: string; data?: { id: string; metadata?: { orderId: string }; customer?: { name: string }; amount?: number } };
    if (event === "transaction.paid" && data) {
      const excursaoId = data.metadata?.orderId ?? "";
      const passengerName = data.customer?.name ?? "Passageiro";
      const amount = (data.amount ?? 0) / 100;
      await sendPaymentConfirmation(excursaoId, passengerName, amount).catch(() => {});
      emitEstadoGrupo(excursaoId, { type: "pagamento_confirmado", transactionId: data.id, passengerName, amount });
    }
    return res.json({ received: true });
  });

  // ─────────────────────────────────────────────
  // NTX — Live Chat Handoff
  // ─────────────────────────────────────────────
  app.post("/api/handoff/:groupId/pausar", (req: Request, res: Response) => {
    const groupId = String(req.params.groupId);
    const { operatorId } = req.body as { operatorId?: string };
    const result = pauseAI(groupId, operatorId ?? "op-unknown");
    return res.json(result);
  });

  app.post("/api/handoff/:groupId/retomar", (req: Request, res: Response) => {
    const groupId = String(req.params.groupId);
    const result = resumeAI(groupId);
    return res.json(result);
  });

  app.get("/api/handoff/pausados", (_req: Request, res: Response) => {
    return res.json(listPausedGroups());
  });

  // ─────────────────────────────────────────────
  // NTX — Gamification / Organizer Goals
  // ─────────────────────────────────────────────
  const organizerGoals: Record<string, Array<{ id: string; title: string; targetSeats: number; achievedSeats: number; rewardType: string; rewardValue: string; status: string }>> = {};

  app.get("/api/organizador/:userId/metas", (req: Request, res: Response) => {
    const userId = String(req.params.userId);
    const goals = organizerGoals[userId] ?? [
      { id: "g1", title: "Viagem 100% Grátis", targetSeats: 15, achievedSeats: 0, rewardType: "CORTESIA", rewardValue: "Vaga gratuita", status: "LOCKED" },
      { id: "g2", title: "Bônus Pix R$ 500", targetSeats: 30, achievedSeats: 0, rewardType: "CASHBACK", rewardValue: "R$ 500,00 via Pix", status: "LOCKED" },
    ];
    return res.json(goals);
  });

  app.patch("/api/organizador/metas/:id/resgatar", (req: Request, res: Response) => {
    return res.json({ success: true, message: "Recompensa registrada. Entraremos em contato em até 48h." });
  });

  // ─────────────────────────────────────────────
  // NTX — Analytics pageview
  // ─────────────────────────────────────────────
  app.post("/api/analytics/pageview", (req: Request, res: Response) => {
    const { slug, page } = req.body as { slug?: string; page?: string };
    console.log(`[Analytics] pageview: ${page ?? "?"} / ${slug ?? "?"} at ${new Date().toISOString()}`);
    return res.json({ ok: true });
  });

  // ─────────────────────────────────────────────
  // NTX — Landing Pages
  // ─────────────────────────────────────────────
  app.get("/api/excursoes/landing/:slug", async (req: Request, res: Response) => {
    const { slug } = req.params;
    const excursoes = await listExcursoes();
    const excursao = excursoes.find((e) => e.nome.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") === slug);
    if (!excursao) return res.status(404).json({ error: "Landing page não encontrada" });
    return res.json({ slug, excursaoId: excursao.id, nome: excursao.nome, price: 890 });
  });

  // ─────────────────────────────────────────────
  // Atividades do Wizard (CRUD)
  // ─────────────────────────────────────────────
  app.get("/api/atividades-wizard", async (_req: Request, res: Response) => {
    const items = await storage.listAtividadesWizard();
    return res.json({ items });
  });

  async function requireAdmin(req: Request, res: Response, next: NextFunction) {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Não autenticado" });
    }
    const u = await storage.getUser(req.session.userId);
    if (!u || u.role !== "admin") {
      return res.status(403).json({ message: "Acesso restrito a administradores" });
    }
    return next();
  }

  app.post("/api/atividades-wizard", requireAdmin, async (req: Request, res: Response) => {
    const parsed = insertAtividadeWizardSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: parsed.error.issues[0].message });
    const created = await storage.createAtividadeWizard(parsed.data);
    return res.status(201).json(created);
  });

  app.patch("/api/atividades-wizard/:id", requireAdmin, async (req: Request, res: Response) => {
    const { id } = req.params;
    const existing = await storage.getAtividadeWizard(id);
    if (!existing) return res.status(404).json({ message: "Atividade não encontrada" });
    const partial = insertAtividadeWizardSchema.partial().safeParse(req.body);
    if (!partial.success) return res.status(400).json({ message: partial.error.issues[0].message });
    const updated = await storage.updateAtividadeWizard(id, partial.data);
    return res.json(updated);
  });

  app.delete("/api/atividades-wizard/:id", requireAdmin, async (req: Request, res: Response) => {
    const { id } = req.params;
    const deleted = await storage.deleteAtividadeWizard(id);
    if (!deleted) return res.status(404).json({ message: "Atividade não encontrada" });
    return res.status(204).send();
  });

  return httpServer;
}
