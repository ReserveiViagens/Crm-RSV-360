export interface TimeSlot {
  inicio: string;
  fim: string;
  diaViagem?: string;
}

export function calculateNights(dataIda: string, dataVolta: string): number {
  const ida = new Date(dataIda);
  const volta = new Date(dataVolta);
  const diff = volta.getTime() - ida.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function hasScheduleConflict(slotA: TimeSlot, slotB: TimeSlot): boolean {
  if (slotA.diaViagem && slotB.diaViagem && slotA.diaViagem !== slotB.diaViagem) {
    return false;
  }
  const startA = timeToMinutes(slotA.inicio);
  const endA = timeToMinutes(slotA.fim);
  const startB = timeToMinutes(slotB.inicio);
  const endB = timeToMinutes(slotB.fim);
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
