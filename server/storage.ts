import { type User, type AtividadeWizard, type InsertAtividadeWizard } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByPhone(telefone: string): Promise<User | undefined>;
  getUserByCpf(cpf: string): Promise<User | undefined>;
  getUserByGoogleId(googleId: string): Promise<User | undefined>;
  getUserByIdentifier(identifier: string): Promise<User | undefined>;
  createUser(user: Omit<User, "id">): Promise<User>;
  updateUser(id: string, data: Partial<Omit<User, "id">>): Promise<User | undefined>;
  listAtividadesWizard(): Promise<AtividadeWizard[]>;
  getAtividadeWizard(id: string): Promise<AtividadeWizard | undefined>;
  createAtividadeWizard(data: InsertAtividadeWizard): Promise<AtividadeWizard>;
  updateAtividadeWizard(id: string, data: Partial<InsertAtividadeWizard>): Promise<AtividadeWizard | undefined>;
  deleteAtividadeWizard(id: string): Promise<boolean>;
}

const normalizePhone = (v: string) => v.replace(/\D/g, "");
const normalizeCpf = (v: string) => v.replace(/\D/g, "");

const SEED_ATIVIDADES: AtividadeWizard[] = [
  { id: "hot-park", label: "Hot Park", descricao: "Parque aquático o dia inteiro", icone: "waves" },
  { id: "city-tour", label: "City Tour", descricao: "Centro + comprinhas + pontos turísticos", icone: "map" },
  { id: "spa-dia", label: "Dia de Spa", descricao: "Relax nas águas termais", icone: "tree-pine" },
];

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private atividades: Map<string, AtividadeWizard>;

  constructor() {
    this.users = new Map();
    this.atividades = new Map();
    for (const a of SEED_ATIVIDADES) {
      this.atividades.set(a.id, { ...a });
    }
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find((u) => u.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  async getUserByPhone(telefone: string): Promise<User | undefined> {
    const digits = normalizePhone(telefone);
    return Array.from(this.users.values()).find((u) => normalizePhone(u.telefone) === digits);
  }

  async getUserByCpf(cpf: string): Promise<User | undefined> {
    const digits = normalizeCpf(cpf);
    if (!digits) return undefined;
    return Array.from(this.users.values()).find((u) => normalizeCpf(u.cpf) === digits);
  }

  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find((u) => u.googleId === googleId);
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
    const user: User = { ...data, id };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, data: Partial<Omit<User, "id">>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    const updated = { ...user, ...data };
    this.users.set(id, updated);
    return updated;
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

export const storage = new MemStorage();
