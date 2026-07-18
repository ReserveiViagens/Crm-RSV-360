/**
 * Safe summaries of HTTP response bodies for Express request logs.
 * Production: metadata only (no content). Dev: truncated preview.
 */

function safeStringify(body: unknown): string {
  const seen = new WeakSet<object>();
  try {
    return JSON.stringify(body, (_key, value) => {
      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) return "[Circular]";
        seen.add(value);
      }
      return value;
    });
  } catch {
    return '"[unserializable]"';
  }
}

export function measureBodyBytes(body: unknown): number {
  if (body === undefined || body === null) return 0;
  if (typeof body === "string") return Buffer.byteLength(body, "utf8");
  return Buffer.byteLength(safeStringify(body), "utf8");
}

export function countBodyItems(body: unknown): number | undefined {
  if (Array.isArray(body)) return body.length;
  if (body && typeof body === "object") {
    const record = body as Record<string, unknown>;
    for (const key of ["items", "data", "results", "suggestions"] as const) {
      const value = record[key];
      if (Array.isArray(value)) return value.length;
    }
  }
  return undefined;
}

function extractErrorMessage(body: unknown): string | undefined {
  if (!body || typeof body !== "object") return undefined;
  const message = (body as { message?: unknown }).message;
  return typeof message === "string" && message.length > 0 ? message : undefined;
}

/**
 * Dev-oriented truncation. Never throws (circular / unserializable → safe marker).
 */
export function summarizeBody(body: unknown, limit = 500): string {
  if (body === undefined) return "[undefined]";
  if (body === null) return "null";
  const raw = typeof body === "string" ? body : safeStringify(body);
  const bytes = Buffer.byteLength(raw, "utf8");
  if (raw.length <= limit) return raw;
  return `${raw.slice(0, limit)}… [truncated, ${bytes} bytes]`;
}

/**
 * Fragment appended after `METHOD path status in Xms`.
 * Preserves the leading ` :: ` used by the Express request logger.
 */
export function formatResponseBodyLogFragment(
  body: unknown,
  options: { production: boolean; statusCode: number; limit?: number },
): string {
  const bytes = measureBodyBytes(body);
  const items = countBodyItems(body);
  const itemsPart = items === undefined ? "" : `, ${items} items`;

  if (options.production) {
    if (options.statusCode >= 400) {
      const message = extractErrorMessage(body);
      if (message) {
        const safe =
          message.length > 200 ? `${message.slice(0, 200)}…` : message;
        return ` :: ${JSON.stringify({ message: safe })}`;
      }
    }
    return ` :: [body omitted] ${bytes} bytes${itemsPart}`;
  }

  return ` :: ${summarizeBody(body, options.limit ?? 500)}`;
}
