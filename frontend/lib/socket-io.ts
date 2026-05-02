// lib/socket.ts
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const initSocket = (token: string) => {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000", {
      auth: { token },
      transports: ["websocket"],
      reconnectionAttempts: 5, // optional
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });

    socket.on("connect", () => {
      console.log("Socket connected:", socket?.id);
    });
  }
  return socket;
};

export const getSocket = () => {
  if (!socket) throw new Error("Socket not initialized. Call initSocket(token) first.");
  return socket;
};
