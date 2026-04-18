import { logger } from "./logger.js";

export type AlertSeverity = "critical" | "high" | "medium" | "low";

export type AlertEvent =
  | "VOUCHER_PDF_FAILURE"
  | "RECOMMENDATIONS_FAILURE"
  | "PIX_WEBHOOK_FAILURE"
  | "DOUBLE_DELIVERY_FAILURE"
  | "HIGH_LATENCY";

export interface Alert {
  id: string;
  event: AlertEvent;
  severity: AlertSeverity;
  message: string;
  orderId?: string;
  meta?: Record<string, unknown>;
  createdAt: string;
  acknowledged: boolean;
}

const alerts = new Map<string, Alert>();
let _counter = 0;

function nextId(): string {
  return `alert-${Date.now()}-${++_counter}`;
}

export function raiseAlert(
  event: AlertEvent,
  message: string,
  opts: { severity?: AlertSeverity; orderId?: string; meta?: Record<string, unknown> } = {}
): Alert {
  const alert: Alert = {
    id: nextId(),
    event,
    severity: opts.severity ?? "high",
    message,
    orderId: opts.orderId,
    meta: opts.meta,
    createdAt: new Date().toISOString(),
    acknowledged: false,
  };
  alerts.set(alert.id, alert);
  logger.warn("[alert] " + message, {
    alertId: alert.id,
    event,
    severity: alert.severity,
    orderId: opts.orderId,
    ...opts.meta,
  });
  return alert;
}

export function acknowledgeAlert(id: string): boolean {
  const alert = alerts.get(id);
  if (!alert) return false;
  alerts.set(id, { ...alert, acknowledged: true });
  return true;
}

export function getActiveAlerts(): Alert[] {
  return Array.from(alerts.values())
    .filter((a) => !a.acknowledged)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getAllAlerts(): Alert[] {
  return Array.from(alerts.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getAlertCount(): { active: number; total: number } {
  const all = Array.from(alerts.values());
  return { active: all.filter((a) => !a.acknowledged).length, total: all.length };
}
