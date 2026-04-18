import { mutateDb } from "./persistence";

export interface Reserva {
  id: string;
  excursaoId: string;
  passageiroId: string;
  passageiroNome: string;
  assento?: string;
  status: "pendente" | "confirmada" | "cancelada" | "fila";
  dataExpiracaoPix?: Date;
  pixPago?: boolean;
  logAceite?: {
    ipAceite?: string;
    userAgent?: string;
    timestampAceite: Date;
    termoVersao: string;
  };
  criadaEm: Date;
}

export async function criarReserva(
  excursaoId: string,
  passageiroId: string,
  passageiroNome: string,
  opts: {
    assento?: string;
    dataExpiracaoPix?: Date;
    logAceite?: {
      ipAceite?: string;
      userAgent?: string;
      timestampAceite: Date;
      termoVersao: string;
    };
  } = {}
): Promise<Reserva> {
  return mutateDb((db) => {
    const reservas = (db.reservaStore as Reserva[]) ?? [];
    const nova: Reserva = {
      id: `res-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      excursaoId,
      passageiroId,
      passageiroNome,
      assento: opts.assento,
      status: "pendente",
      dataExpiracaoPix: opts.dataExpiracaoPix,
      logAceite: opts.logAceite,
      criadaEm: new Date(),
    };
    reservas.push(nova);
    db.reservaStore = reservas;
    return nova;
  });
}

export async function getReserva(id: string): Promise<Reserva | undefined> {
  return mutateDb((db) => {
    const reservas = (db.reservaStore as Reserva[]) ?? [];
    return reservas.find((r) => r.id === id);
  });
}

export async function getReservasPorExcursao(excursaoId: string): Promise<Reserva[]> {
  return mutateDb((db) => {
    const reservas = (db.reservaStore as Reserva[]) ?? [];
    return reservas.filter((r) => r.excursaoId === excursaoId);
  });
}

export async function chamarProximoDaFila(excursaoId: string): Promise<Reserva | null> {
  return mutateDb((db) => {
    const reservas = (db.reservaStore as Reserva[]) ?? [];
    const proximo = reservas.find((r) => r.excursaoId === excursaoId && r.status === "fila");
    if (!proximo) return null;
    proximo.status = "pendente";
    proximo.dataExpiracaoPix = new Date(Date.now() + 15 * 60 * 1000);
    db.reservaStore = reservas;
    return proximo;
  });
}
