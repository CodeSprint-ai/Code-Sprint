// hooks/useSubmissionSocket.ts
import { useEffect } from "react";
import { Socket } from "socket.io-client";
import { initSocket } from "@/lib/socket-io";
import { useAuthStore } from "@/store/authStore";

export const useSubmissionSocket = (callback: (data: any) => void) => {
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    if (!token) return;

    const socket: Socket = initSocket(token); // explicitly type

    // Debug logs
    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
    });

    socket.on("connect_error", (err: any) => {
      console.log("❌ Socket connection error:", err.message);
    });

    socket.on("disconnect", (reason: string) => {
      console.log("⚠️ Socket disconnected:", reason);
    });

    // Listen for submission updates
    const handleUpdate = (data: any) => {
      console.log("🔥 Submission update received:", data);
      callback(data);
    };
    socket.on("submission.update", handleUpdate);

    // Cleanup
    return () => {
      socket.off("submission.update", handleUpdate);
    };
  }, [token, callback]);
};
