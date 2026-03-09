let socket: WebSocket | null = null;
const listeners: Map<string, Set<(data: unknown) => void>> = new Map();

export function getSocket(): WebSocket | null {
  return socket;
}

export function connectSocket(): WebSocket {
  if (socket && socket.readyState === WebSocket.OPEN) return socket;

  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  const url = `${protocol}//${window.location.host}/ws`;
  socket = new WebSocket(url);

  socket.onmessage = (event) => {
    try {
      const msg = JSON.parse(event.data);
      const handlers = listeners.get(msg.type);
      if (handlers) {
        handlers.forEach((fn) => fn(msg.payload));
      }
      const allHandlers = listeners.get("*");
      if (allHandlers) {
        allHandlers.forEach((fn) => fn(msg));
      }
    } catch {
      // ignore parse errors
    }
  };

  socket.onclose = () => {
    socket = null;
    setTimeout(() => connectSocket(), 3000);
  };

  return socket;
}

export function subscribeExcursao(excursaoId: string, onMessage: (data: unknown) => void): () => void {
  const sock = connectSocket();

  const sendSubscribe = () => {
    if (sock.readyState === WebSocket.OPEN) {
      sock.send(JSON.stringify({ type: "subscribe", excursaoId }));
    }
  };

  if (sock.readyState === WebSocket.OPEN) {
    sendSubscribe();
  } else {
    sock.addEventListener("open", sendSubscribe, { once: true });
  }

  const handler = (data: unknown) => onMessage(data);
  if (!listeners.has("*")) listeners.set("*", new Set());
  listeners.get("*")!.add(handler);

  return () => {
    listeners.get("*")?.delete(handler);
  };
}

export function on(type: string, fn: (data: unknown) => void): () => void {
  if (!listeners.has(type)) listeners.set(type, new Set());
  listeners.get(type)!.add(fn);
  return () => listeners.get(type)?.delete(fn);
}
