import { io, Socket as SocketIOClient } from "socket.io-client";

const URL =
  process.env.NEXT_PUBLIC_BASE_URL ??
  "https://everythingbeautybackend-production.up.railway.app";

function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accesstoken");
}

declare global {
  // eslint-disable-next-line no-var
  var __appSocket: SocketIOClient | undefined;
}

function createSocket(): SocketIOClient {
  const socket = io(URL, {
    transports: ["websocket", "polling"],
    path: "/socket.io",
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 2000,
    reconnectionDelayMax: 10000,
    timeout: 20000,
    withCredentials: false,
    auth: (cb) => {
      const token = getAccessToken();
      cb(token ? { token: `Bearer ${token}` } : {});
    },
  });

  let serverDisconnectTimer: ReturnType<typeof setTimeout> | null = null;

  socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
  });

  socket.on("disconnect", (reason) => {
    console.log("Socket disconnected:", reason);

    // Socket.io does not auto-reconnect after a server-initiated disconnect.
    // Reconnect once with refreshed auth, but debounce to avoid freezing the UI.
    if (reason === "io server disconnect") {
      if (serverDisconnectTimer) clearTimeout(serverDisconnectTimer);

      serverDisconnectTimer = setTimeout(() => {
        if (socket.connected) return;

        const token = getAccessToken();
        socket.auth = token ? { token: `Bearer ${token}` } : {};
        socket.connect();
      }, 3000);
    }
  });

  socket.on("connect_error", (error) => {
    console.error("Socket connection error:", error.message);
  });

  return socket;
}

function createServerStub(): SocketIOClient {
  const noop = () => undefined;
  const asyncNoop = async () => ({});

  return {
    connected: false,
    connect: noop,
    disconnect: noop,
    on: noop,
    off: noop,
    emit: noop,
    emitWithAck: asyncNoop,
  } as unknown as SocketIOClient;
}

function getOrCreateSocket(): SocketIOClient {
  if (typeof window === "undefined") {
    return createServerStub();
  }

  if (!globalThis.__appSocket) {
    globalThis.__appSocket = createSocket();
  }

  return globalThis.__appSocket;
}

// Lazy proxy: avoids creating connections during SSR/module evaluation
// and reuses a single client instance across HMR reloads.
export const Socket: SocketIOClient = new Proxy({} as SocketIOClient, {
  get(_target, prop) {
    const socket = getOrCreateSocket();
    const value = socket[prop as keyof SocketIOClient];

    if (typeof value === "function") {
      return (value as (...args: unknown[]) => unknown).bind(socket);
    }

    return value;
  },
});
