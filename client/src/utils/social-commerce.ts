export interface TimeSlot {
  id?: string;
  inicio?: string;
  fim?: string;
  startsAt?: string;
  endsAt?: string;
  diaViagem?: string;
}

export function calculateNights(dataIda: string, dataVolta: string): number {
  const ida = new Date(dataIda);
  const volta = new Date(dataVolta);
  const diff = volta.getTime() - ida.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function getSlotStart(slot: TimeSlot): string {
  return slot.inicio ?? slot.startsAt ?? "00:00";
}

function getSlotEnd(slot: TimeSlot): string {
  return slot.fim ?? slot.endsAt ?? "23:59";
}

export function hasScheduleConflict(
  slotAOrArray: TimeSlot | TimeSlot[],
  slotB: TimeSlot
): boolean {
  if (Array.isArray(slotAOrArray)) {
    return slotAOrArray.some((existing) => hasScheduleConflict(existing, slotB));
  }
  const slotA = slotAOrArray;
  if (slotA.diaViagem && slotB.diaViagem && slotA.diaViagem !== slotB.diaViagem) {
    return false;
  }
  const startA = timeToMinutes(getSlotStart(slotA));
  const endA = timeToMinutes(getSlotEnd(slotA));
  const startB = timeToMinutes(getSlotStart(slotB));
  const endB = timeToMinutes(getSlotEnd(slotB));
  return startA < endB && startB < endA;
}

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + (minutes || 0);
}

export interface ScoredItem {
  id: string;
  margin?: number;
  score?: number;
  badgeTipo?: "ia" | "popular";
  [key: string]: unknown;
}

export function sortByMarginAndScore<T extends ScoredItem>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const scoreA = (a.margin ?? 0) + (a.score ?? 0) + (a.badgeTipo === "ia" ? 10 : 0) + (a.badgeTipo === "popular" ? 5 : 0);
    const scoreB = (b.margin ?? 0) + (b.score ?? 0) + (b.badgeTipo === "ia" ? 10 : 0) + (b.badgeTipo === "popular" ? 5 : 0);
    return scoreB - scoreA;
  });
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function generateInviteLink(excursaoId: string, inviteCode: string): string {
  return `${window.location.origin}/viagens-grupo/${excursaoId}?invite=${inviteCode}`;
}

export function getUserId(): string {
  let id = localStorage.getItem("rsv_user_id");
  if (!id) {
    id = `u-${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem("rsv_user_id", id);
  }
  return id;
}

export function getUserName(): string {
  return localStorage.getItem("rsv_user_name") ?? "Você";
}
