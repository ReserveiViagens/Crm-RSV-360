import { db } from "../db";
import {
  gamificacaoPontos,
  gamificacaoHistorico,
  gamificacaoConquistas,
} from "@shared/schema";
import { eq, desc, and } from "drizzle-orm";

/* ─── Definições das Conquistas ──────────────────────────── */
export const CONQUISTAS_DEFS = [
  {
    id: "primeira-viagem",
    titulo: "Primeira Viagem",
    descricao: "Fez sua primeira reserva confirmada",
    icone: "🌟",
    tipo: "trips",
    threshold: 1,
  },
  {
    id: "grupo-de-5",
    titulo: "Grupo de 5",
    descricao: "Participou de um grupo com 5+ pessoas",
    icone: "🤝",
    tipo: "grupo",
    threshold: 5,
  },
  {
    id: "fiel-caldas",
    titulo: "Fiel Caldas Novas",
    descricao: "3 viagens confirmadas para Caldas Novas",
    icone: "🏆",
    tipo: "caldas",
    threshold: 3,
  },
  {
    id: "mil-pontos",
    titulo: "Mil Pontos",
    descricao: "Acumulou 1.000 pontos no programa",
    icone: "💎",
    tipo: "pontos",
    threshold: 1000,
  },
  {
    id: "embaixador",
    titulo: "Embaixador RSV",
    descricao: "Acumulou 5.000 pontos no programa",
    icone: "👑",
    tipo: "pontos",
    threshold: 5000,
  },
  {
    id: "perfil-completo",
    titulo: "Perfil Completo",
    descricao: "Completou 100% do perfil",
    icone: "✅",
    tipo: "perfil",
    threshold: 1,
  },
  {
    id: "primeira-avaliacao",
    titulo: "Avaliador",
    descricao: "Enviou sua primeira avaliação",
    icone: "⭐",
    tipo: "avaliacao",
    threshold: 1,
  },
] as const;

export type ConquistaId = (typeof CONQUISTAS_DEFS)[number]["id"];

/* ─── Busca ou cria o registro de pontos do usuário ─────── */
async function getOrCreatePontos(userId: string) {
  const existing = await db
    .select()
    .from(gamificacaoPontos)
    .where(eq(gamificacaoPontos.userId, userId))
    .limit(1);

  if (existing.length > 0) return existing[0];

  const [created] = await db
    .insert(gamificacaoPontos)
    .values({ userId, pontos: 0, streak: 0 })
    .returning();

  return created;
}

/* ─── Adicionar pontos ────────────────────────────────────── */
export async function adicionarPontos(
  userId: string,
  valor: number,
  motivo: string
): Promise<number> {
  const registro = await getOrCreatePontos(userId);
  const novoTotal = registro.pontos + valor;

  await db
    .update(gamificacaoPontos)
    .set({ pontos: novoTotal, updatedAt: new Date() })
    .where(eq(gamificacaoPontos.userId, userId));

  await db.insert(gamificacaoHistorico).values({
    userId,
    motivo,
    valor,
  });

  await verificarEDesbloquearConquistas(userId, novoTotal);

  return novoTotal;
}

/* ─── Obter pontos e streak ───────────────────────────────── */
export async function getPontos(userId: string): Promise<{ pontos: number; streak: number }> {
  const registro = await getOrCreatePontos(userId);
  return { pontos: registro.pontos, streak: registro.streak };
}

/* ─── Atualizar streak ────────────────────────────────────── */
export async function atualizarStreak(userId: string, confirmedTrips: number): Promise<void> {
  await getOrCreatePontos(userId);
  await db
    .update(gamificacaoPontos)
    .set({ streak: confirmedTrips, updatedAt: new Date() })
    .where(eq(gamificacaoPontos.userId, userId));
}

/* ─── Histórico de pontos ────────────────────────────────── */
export async function getHistorico(userId: string): Promise<
  Array<{ data: string; motivo: string; valor: number }>
> {
  const rows = await db
    .select()
    .from(gamificacaoHistorico)
    .where(eq(gamificacaoHistorico.userId, userId))
    .orderBy(desc(gamificacaoHistorico.createdAt))
    .limit(50);

  return rows.map((r) => ({
    data: r.createdAt.toISOString(),
    motivo: r.motivo,
    valor: r.valor,
  }));
}

/* ─── Conquistas desbloqueadas do usuário ────────────────── */
export async function getConquistasDesbloqueadas(userId: string): Promise<string[]> {
  const rows = await db
    .select()
    .from(gamificacaoConquistas)
    .where(eq(gamificacaoConquistas.userId, userId));

  return rows.map((r) => r.conquistaId);
}

/* ─── Verificar e desbloquear conquistas por pontos ─────── */
export async function verificarEDesbloquearConquistas(
  userId: string,
  pontos: number
): Promise<void> {
  const desbloqueadas = await getConquistasDesbloqueadas(userId);

  for (const conquista of CONQUISTAS_DEFS) {
    if (conquista.tipo !== "pontos") continue;
    if (desbloqueadas.includes(conquista.id)) continue;
    if (pontos >= conquista.threshold) {
      await db.insert(gamificacaoConquistas).values({
        userId,
        conquistaId: conquista.id,
      });
    }
  }
}

/* ─── Desbloquear conquista manualmente ─────────────────── */
export async function desbloquearConquista(
  userId: string,
  conquistaId: string
): Promise<void> {
  const existing = await db
    .select()
    .from(gamificacaoConquistas)
    .where(
      and(
        eq(gamificacaoConquistas.userId, userId),
        eq(gamificacaoConquistas.conquistaId, conquistaId)
      )
    )
    .limit(1);

  if (existing.length === 0) {
    await db.insert(gamificacaoConquistas).values({ userId, conquistaId });
  }
}

/* ─── Retorna lista completa de conquistas com estado ────── */
export async function getConquistas(
  userId: string,
  ctx: {
    pontos: number;
    confirmedCount: number;
    caldasCount: number;
    inGroupOf5: boolean;
    perfilCompleto?: boolean;
    temAvaliacao?: boolean;
  }
): Promise<Array<(typeof CONQUISTAS_DEFS)[number] & { desbloqueada: boolean }>> {
  const desbloqueadas = await getConquistasDesbloqueadas(userId);

  return CONQUISTAS_DEFS.map((c) => {
    let desbloqueada = desbloqueadas.includes(c.id);

    if (!desbloqueada) {
      switch (c.tipo) {
        case "pontos":
          desbloqueada = ctx.pontos >= c.threshold;
          break;
        case "trips":
          desbloqueada = ctx.confirmedCount >= c.threshold;
          break;
        case "caldas":
          desbloqueada = ctx.caldasCount >= c.threshold;
          break;
        case "grupo":
          desbloqueada = ctx.inGroupOf5;
          break;
        case "perfil":
          desbloqueada = ctx.perfilCompleto ?? false;
          break;
        case "avaliacao":
          desbloqueada = ctx.temAvaliacao ?? false;
          break;
      }

      if (desbloqueada) {
        desbloquearConquista(userId, c.id).catch(() => {});
      }
    }

    return { ...c, desbloqueada };
  });
}
