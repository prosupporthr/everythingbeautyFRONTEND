import { io, Socket as SocketIO } from "socket.io-client";

const URL = process.env.NEXT_PUBLIC_BASE_URL
  ? process.env.NEXT_PUBLIC_BASE_URL
  : "https://everythingbeautybackend-production.up.railway.app";

const token =
  typeof window !== "undefined"
    ? localStorage.getItem("accesstoken")
    : null;

export const Socket: SocketIO = io(URL, {
  transports: ["websocket", "polling"],
  path: "/socket.io",
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 200000,
  withCredentials: false,
  auth: token ? { token: `Bearer ${token}` } : undefined,
});

// Keep auth in sync if token changes
Socket.on("connect_error", () => {
  const latestToken = localStorage.getItem("accesstoken") as string;
  if (latestToken) {
    // Update auth payload for next handshake
    Socket.auth = { token: `Bearer ${latestToken}` };
  }
});

if (Socket.disconnected) {
  Socket.connect();
}

Socket.on("connect", () => {
  console.log("Socket connected:", Socket.id);
});

Socket.on("disconnect", (reason) => {
  console.log("Socket disconnected:", reason);
  // If not a manual disconnect, attempt to reconnect
  if (reason !== "io client disconnect") {
    Socket.connect();
  }
});

Socket.on("reconnect_attempt", (attempt) => {
  console.log("Socket reconnect attempt:", attempt);
});

Socket.on("reconnect", (attempt) => {
  console.log("Socket reconnected after attempts:", attempt);
});

Socket.on("reconnect_error", (error) => {
  console.error("Socket reconnect error:", error);
});

Socket.on("reconnect_failed", () => {
  console.error("Socket reconnect failed");
});

Socket.on("connect_error", (error) => {
  console.error("Socket connection error:", error);
});

Socket.on("error", (error) => {
  console.error("Socket error:", error);
});
