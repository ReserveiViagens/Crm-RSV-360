import { emitEstadoGrupo } from "../socket";

const pausedGroups = new Map<string, { operatorId: string; since: Date }>();

export function pauseAI(groupId: string, operatorId: string) {
  pausedGroups.set(groupId, { operatorId, since: new Date() });
  emitEstadoGrupo(groupId, {
    type: "ai_paused",
    groupId,
    operatorId,
    message: "CaldasAI pausado. Operador humano assumiu o atendimento.",
  });
  return { success: true, groupId, operatorId };
}

export function resumeAI(groupId: string) {
  pausedGroups.delete(groupId);
  emitEstadoGrupo(groupId, {
    type: "ai_resumed",
    groupId,
    message: "CaldasAI retomou o atendimento automático.",
  });
  return { success: true, groupId };
}

export function isAIPaused(groupId: string) {
  return pausedGroups.has(groupId);
}

export function getHandoffInfo(groupId: string) {
  return pausedGroups.get(groupId) ?? null;
}

export function listPausedGroups() {
  return Array.from(pausedGroups.entries()).map(([groupId, info]) => ({ groupId, ...info }));
}
