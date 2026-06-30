import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_WS_URL || "http://localhost:5004";

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});
