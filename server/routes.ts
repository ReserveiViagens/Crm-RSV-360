
import type { Express, Request, Response } from "express";
import { type Server } from "http";
import { getOpcionais } from "./opcionais";
import {
  criarReserva,
  getReservasPorExcursao,
  chamarProximoDaFila,
} from "./reservas";
import { emitEstadoGrupo, emitPixExpirado, emitVigilancia } from "./socket";
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
    const { userId } = getActorFromHeaders(req);
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

  return httpServer;
}
