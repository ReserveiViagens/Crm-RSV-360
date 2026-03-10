import { type User } from "@shared/schema";
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
}

const normalizePhone = (v: string) => v.replace(/\D/g, "");
const normalizeCpf = (v: string) => v.replace(/\D/g, "");

export class MemStorage implements IStorage {
  private users: Map<string, User>;

  constructor() {
    this.users = new Map();
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
}

export const storage = new MemStorage();
