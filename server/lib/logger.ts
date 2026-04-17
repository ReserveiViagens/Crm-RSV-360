import { randomUUID } from "crypto";

export type LogLevel = "debug" | "info" | "warn" | "error";

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  correlationId?: string;
  orderId?: string;
  paymentId?: string;
  customerId?: string;
  [key: string]: unknown;
}

function emit(level: LogLevel, message: string, meta: Record<string, unknown> = {}): void {
  const entry: LogEntry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...meta,
  };
  const line = JSON.stringify(entry);
  if (level === "error" || level === "warn") {
    process.stderr.write(line + "\n");
  } else {
    process.stdout.write(line + "\n");
  }
}

export const logger = {
  debug: (message: string, meta?: Record<string, unknown>) => emit("debug", message, meta),
  info:  (message: string, meta?: Record<string, unknown>) => emit("info",  message, meta),
  warn:  (message: string, meta?: Record<string, unknown>) => emit("warn",  message, meta),
  error: (message: string, meta?: Record<string, unknown>) => emit("error", message, meta),
};

export function newCorrelationId(): string {
  return randomUUID();
}
