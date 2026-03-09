import { mutateDb } from "./persistence";
import { randomUUID } from "crypto";

export interface Group {
  id: string;
  excursaoId: string;
  nome: string;
  capacidade: number;
  criadoEm: string;
}

export interface Membership {
  id: string;
  groupId: string;
  userId: string;
  nome: string;
  status: "ADMIN" | "MEMBER" | "PENDING";
  criadoEm: string;
}

export interface Order {
  id: string;
  groupId: string;
  userId: string;
  totalAmount: number;
  paidAmount: number;
  voucherCode?: string;
  voucherDiscount?: number;
  updatedAt: string;
}

export interface Invite {
  id: string;
  groupId: string;
  code: string;
  used: boolean;
  criadoEm: string;
  expiresAt?: string;
}

export async function ensureGroupForExcursao(
  excursaoId: string,
  nome: string,
  capacidade: number
): Promise<Group> {
  return mutateDb((db) => {
    const groups = (db.groupStore as Group[]) ?? [];
    let group = groups.find((g) => g.excursaoId === excursaoId);
    if (!group) {
      group = {
        id: `grp-${excursaoId}`,
        excursaoId,
        nome,
        capacidade,
        criadoEm: new Date().toISOString(),
      };
      groups.push(group);
      db.groupStore = groups;
    }
    return group;
  });
}

export async function getGroupById(id: string): Promise<Group | undefined> {
  return mutateDb((db) => {
    const groups = (db.groupStore as Group[]) ?? [];
    return groups.find((g) => g.id === id);
  });
}

export async function listMemberships(groupId: string): Promise<Membership[]> {
  return mutateDb((db) => {
    const mems = (db.membershipStore as Membership[]) ?? [];
    return mems.filter((m) => m.groupId === groupId);
  });
}

export async function upsertMembership(
  groupId: string,
  userId: string,
  nome: string,
  status: "ADMIN" | "MEMBER" | "PENDING"
): Promise<Membership> {
  return mutateDb((db) => {
    const mems = (db.membershipStore as Membership[]) ?? [];
    let mem = mems.find((m) => m.groupId === groupId && m.userId === userId);
    if (!mem) {
      mem = {
        id: `mem-${randomUUID()}`,
        groupId,
        userId,
        nome,
        status,
        criadoEm: new Date().toISOString(),
      };
      mems.push(mem);
    } else {
      mem.status = status;
      mem.nome = nome;
    }
    db.membershipStore = mems;
    return mem;
  });
}

export async function listOrders(groupId: string): Promise<Order[]> {
  return mutateDb((db) => {
    const orders = (db.orderStore as Order[]) ?? [];
    return orders.filter((o) => o.groupId === groupId);
  });
}

export async function upsertOrder(
  groupId: string,
  userId: string,
  data: { totalAmount: number; paidAmount: number }
): Promise<Order> {
  return mutateDb((db) => {
    const orders = (db.orderStore as Order[]) ?? [];
    let order = orders.find((o) => o.groupId === groupId && o.userId === userId);
    if (!order) {
      order = {
        id: `ord-${randomUUID()}`,
        groupId,
        userId,
        totalAmount: data.totalAmount,
        paidAmount: data.paidAmount,
        updatedAt: new Date().toISOString(),
      };
      orders.push(order);
    } else {
      order.totalAmount = data.totalAmount;
      order.paidAmount = data.paidAmount;
      order.updatedAt = new Date().toISOString();
    }
    db.orderStore = orders;
    return order;
  });
}

export async function recalculateVoucherForGroup(
  groupId: string
): Promise<{ voucherCode: string; discount: number } | null> {
  return mutateDb((db) => {
    const orders = (db.orderStore as Order[]) ?? [];
    const groupOrders = orders.filter((o) => o.groupId === groupId);
    const totalPaid = groupOrders.reduce((sum, o) => sum + o.paidAmount, 0);
    if (totalPaid < 500) return null;
    const discount = Math.min(Math.floor(totalPaid / 500) * 50, 500);
    const code = `RSV-${groupId.slice(-6).toUpperCase()}-${discount}`;
    groupOrders.forEach((o) => {
      o.voucherCode = code;
      o.voucherDiscount = discount;
    });
    db.orderStore = orders;
    return { voucherCode: code, discount };
  });
}

export async function createInvite(groupId: string): Promise<Invite> {
  return mutateDb((db) => {
    const invites = (db.inviteStore as Invite[]) ?? [];
    const code = `INV-${groupId.slice(-4).toUpperCase()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const invite: Invite = {
      id: `inv-${randomUUID()}`,
      groupId,
      code,
      used: false,
      criadoEm: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    };
    invites.push(invite);
    db.inviteStore = invites;
    return invite;
  });
}

export async function validateInvite(
  code: string
): Promise<{ valid: boolean; invite?: Invite; reason?: string }> {
  return mutateDb((db) => {
    const invites = (db.inviteStore as Invite[]) ?? [];
    const invite = invites.find((i) => i.code === code);
    if (!invite) return { valid: false, reason: "Convite não encontrado" };
    if (invite.used) return { valid: false, reason: "Convite já utilizado" };
    if (invite.expiresAt && new Date(invite.expiresAt) < new Date()) {
      return { valid: false, reason: "Convite expirado" };
    }
    return { valid: true, invite };
  });
}

export async function consumeInvite(code: string): Promise<boolean> {
  return mutateDb((db) => {
    const invites = (db.inviteStore as Invite[]) ?? [];
    const invite = invites.find((i) => i.code === code);
    if (!invite || invite.used) return false;
    invite.used = true;
    db.inviteStore = invites;
    return true;
  });
}
