import { type User, type AtividadeWizard, type InsertAtividadeWizard, users, accessRequests } from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export type AccessRequestStatus = "pending" | "approved" | "rejected";

export interface AccessRequest {
  id: string;
  userId: string;
  status: AccessRequestStatus;
  message: string;
  reviewedBy: string | null;
  reviewedAt: string | null;
  createdAt: string;
}

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByPhone(telefone: string): Promise<User | undefined>;
  getUserByCpf(cpf: string): Promise<User | undefined>;
  getUserByGoogleId(googleId: string): Promise<User | undefined>;
  getUserByNome(nome: string): Promise<User | undefined>;
  getUserByIdentifier(identifier: string): Promise<User | undefined>;
  createUser(user: Omit<User, "id">): Promise<User>;
  updateUser(id: string, data: Partial<Omit<User, "id">>): Promise<User | undefined>;
  listUsers(): Promise<User[]>;
  listAtividadesWizard(): Promise<AtividadeWizard[]>;
  getAtividadeWizard(id: string): Promise<AtividadeWizard | undefined>;
  createAtividadeWizard(data: InsertAtividadeWizard): Promise<AtividadeWizard>;
  updateAtividadeWizard(id: string, data: Partial<InsertAtividadeWizard>): Promise<AtividadeWizard | undefined>;
  deleteAtividadeWizard(id: string): Promise<boolean>;
  createAccessRequest(data: { userId: string; message: string }): Promise<AccessRequest>;
  getAccessRequestByUserId(userId: string): Promise<AccessRequest | undefined>;
  getPendingAccessRequestByUserId(userId: string): Promise<AccessRequest | undefined>;
  listAccessRequests(status?: AccessRequestStatus): Promise<AccessRequest[]>;
  updateAccessRequest(id: string, data: Partial<Pick<AccessRequest, "status" | "reviewedBy" | "reviewedAt">>): Promise<AccessRequest | undefined>;
  deleteAccessRequest(id: string): Promise<boolean>;
}

const normalizePhone = (v: string) => v.replace(/\D/g, "");
const normalizeCpf = (v: string) => v.replace(/\D/g, "");

const SEED_ATIVIDADES: AtividadeWizard[] = [
  { id: "hot-park", label: "Hot Park", descricao: "Maior parque aquático de águas quentes do mundo", icone: "waves" },
  { id: "di-roma", label: "Di Roma Thermas", descricao: "Resort com piscinas termais e toboáguas", icone: "droplets" },
  { id: "lagoa-quente", label: "Lagoa Quente", descricao: "Complexo termal com águas naturalmente aquecidas", icone: "thermometer" },
  { id: "parque-corumba", label: "Parque Corumbá", descricao: "Lago Corumbá com passeio de barco e esportes náuticos", icone: "sailboat" },
  { id: "city-tour", label: "City Tour", descricao: "Centro + comprinhas + pontos turísticos locais", icone: "map" },
  { id: "taua-resort", label: "Tauá Resort", descricao: "Resort all-inclusive com parque aquático e spa", icone: "hotel" },
  { id: "rio-quente", label: "Rio Quente Resorts", descricao: "Hot Park + hospedagem integrada no complexo", icone: "tree-pine" },
  { id: "aquapark", label: "Caldas Novas Aquapark", descricao: "Parque aquático familiar com piscinas e toboáguas", icone: "fish" },
];

function dbRowToAccessRequest(row: typeof accessRequests.$inferSelect): AccessRequest {
  return {
    id: row.id,
    userId: row.userId,
    status: row.status as AccessRequestStatus,
    message: row.message,
    reviewedBy: row.reviewedBy ?? null,
    reviewedAt: row.reviewedAt ? row.reviewedAt.toISOString() : null,
    createdAt: row.createdAt ? row.createdAt.toISOString() : new Date().toISOString(),
  };
}

export class DatabaseStorage implements IStorage {
  private atividades: Map<string, AtividadeWizard>;

  constructor() {
    this.atividades = new Map();
    for (const a of SEED_ATIVIDADES) {
      this.atividades.set(a.id, { ...a });
    }
  }

  async getUser(id: string): Promise<User | undefined> {
    const rows = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return rows[0] ?? undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const rows = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return rows[0] ?? undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const all = await db.select().from(users);
    return all.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  async getUserByPhone(telefone: string): Promise<User | undefined> {
    const digits = normalizePhone(telefone);
    const all = await db.select().from(users);
    return all.find((u) => normalizePhone(u.telefone) === digits);
  }

  async getUserByCpf(cpf: string): Promise<User | undefined> {
    const digits = normalizeCpf(cpf);
    if (!digits) return undefined;
    const all = await db.select().from(users);
    return all.find((u) => normalizeCpf(u.cpf) === digits);
  }

  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    const all = await db.select().from(users);
    return all.find((u) => u.googleId === googleId);
  }

  async getUserByNome(nome: string): Promise<User | undefined> {
    const lower = nome.trim().toLowerCase();
    const all = await db.select().from(users);
    return all.find((u) => u.nome?.trim().toLowerCase() === lower);
  }

  async getUserByIdentifier(identifier: string): Promise<User | undefined> {
    const trimmed = identifier.trim();
    const digits = trimmed.replace(/\D/g, "");

    if (trimmed.includes("@")) return this.getUserByEmail(trimmed);
    if (digits.length === 11 && !trimmed.includes("@")) {
      const byCpf = await this.getUserByCpf(digits);
      if (byCpf) return byCpf;
    }
    if (digits.length >= 10 && digits.length <= 11) {
      return this.getUserByPhone(digits);
    }
    return this.getUserByEmail(trimmed);
  }

  async createUser(data: Omit<User, "id">): Promise<User> {
    const id = randomUUID();
    const [created] = await db.insert(users).values({ ...data, id }).returning();
    return created;
  }

  async updateUser(id: string, data: Partial<Omit<User, "id">>): Promise<User | undefined> {
    const rows = await db.update(users).set(data).where(eq(users.id, id)).returning();
    return rows[0] ?? undefined;
  }

  async listUsers(): Promise<User[]> {
    return db.select().from(users);
  }

  async createAccessRequest(data: { userId: string; message: string }): Promise<AccessRequest> {
    const id = randomUUID();
    const [row] = await db.insert(accessRequests).values({
      id,
      userId: data.userId,
      status: "pending",
      message: data.message,
    }).returning();
    return dbRowToAccessRequest(row);
  }

  async getAccessRequestByUserId(userId: string): Promise<AccessRequest | undefined> {
    const rows = await db.select().from(accessRequests)
      .where(eq(accessRequests.userId, userId))
      .orderBy(accessRequests.createdAt)
      .limit(1);
    return rows[0] ? dbRowToAccessRequest(rows[0]) : undefined;
  }

  async getPendingAccessRequestByUserId(userId: string): Promise<AccessRequest | undefined> {
    const rows = await db.select().from(accessRequests)
      .where(and(eq(accessRequests.userId, userId), eq(accessRequests.status, "pending")))
      .limit(1);
    return rows[0] ? dbRowToAccessRequest(rows[0]) : undefined;
  }

  async listAccessRequests(status?: AccessRequestStatus): Promise<AccessRequest[]> {
    let rows;
    if (status) {
      rows = await db.select().from(accessRequests).where(eq(accessRequests.status, status));
    } else {
      rows = await db.select().from(accessRequests);
    }
    return rows.map(dbRowToAccessRequest);
  }

  async updateAccessRequest(id: string, data: Partial<Pick<AccessRequest, "status" | "reviewedBy" | "reviewedAt">>): Promise<AccessRequest | undefined> {
    const updateData: Record<string, unknown> = {};
    if (data.status !== undefined) updateData.status = data.status;
    if (data.reviewedBy !== undefined) updateData.reviewedBy = data.reviewedBy;
    if (data.reviewedAt !== undefined) updateData.reviewedAt = data.reviewedAt ? new Date(data.reviewedAt) : null;
    const rows = await db.update(accessRequests).set(updateData).where(eq(accessRequests.id, id)).returning();
    return rows[0] ? dbRowToAccessRequest(rows[0]) : undefined;
  }

  async deleteAccessRequest(id: string): Promise<boolean> {
    const rows = await db.delete(accessRequests).where(eq(accessRequests.id, id)).returning();
    return rows.length > 0;
  }

  async listAtividadesWizard(): Promise<AtividadeWizard[]> {
    return Array.from(this.atividades.values());
  }

  async getAtividadeWizard(id: string): Promise<AtividadeWizard | undefined> {
    return this.atividades.get(id);
  }

  async createAtividadeWizard(data: InsertAtividadeWizard): Promise<AtividadeWizard> {
    const id = randomUUID();
    const atividade: AtividadeWizard = { id, ...data };
    this.atividades.set(id, atividade);
    return atividade;
  }

  async updateAtividadeWizard(id: string, data: Partial<InsertAtividadeWizard>): Promise<AtividadeWizard | undefined> {
    const existing = this.atividades.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...data };
    this.atividades.set(id, updated);
    return updated;
  }

  async deleteAtividadeWizard(id: string): Promise<boolean> {
    return this.atividades.delete(id);
  }
}

export const storage = new DatabaseStorage();
