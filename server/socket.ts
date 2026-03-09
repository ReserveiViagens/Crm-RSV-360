import type { Server } from "http";
import { WebSocketServer, WebSocket } from "ws";

let wss: WebSocketServer | null = null;

export function setupWebSocket(httpServer: Server): void {
  wss = new WebSocketServer({ server: httpServer, path: "/ws" });

  wss.on("connection", (ws: WebSocket) => {
    ws.on("message", (data: Buffer) => {
      try {
        const msg = JSON.parse(data.toString());
        if (msg.type === "subscribe" && msg.excursaoId) {
          (ws as WebSocket & { excursaoId?: string }).excursaoId = msg.excursaoId;
        }
      } catch {
        // ignore invalid JSON
      }
    });
  });
}

function broadcast(excursaoId: string, payload: unknown): void {
  if (!wss) return;
  const msg = JSON.stringify(payload);
  wss.clients.forEach((client) => {
    const c = client as WebSocket & { excursaoId?: string };
    if (c.readyState === WebSocket.OPEN && c.excursaoId === excursaoId) {
      c.send(msg);
    }
  });
}

export function emitEstadoGrupo(excursaoId: string, estado: unknown): void {
  broadcast(excursaoId, { type: "estado_grupo", payload: estado });
}

export function emitPixExpirado(excursaoId: string, reservaId: string): void {
  broadcast(excursaoId, { type: "pix_expirado", payload: { reservaId } });
}

export function emitVigilancia(excursaoId: string, dados: unknown): void {
  broadcast(excursaoId, { type: "vigilancia", payload: dados });
}
