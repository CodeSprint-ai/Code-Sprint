// hooks/useSubmissionSocket.ts
import { useEffect, useCallback } from "react";
import { Socket } from "socket.io-client";
import { initSocket } from "@/lib/socket-io";
import { useAuthStore } from "@/store/authStore";

/**
 * Socket event types for submission updates
 */
export type SubmissionSocketEvent =
  | "submission:created"
  | "submission:queued"
  | "submission:compiling"
  | "submission:running"
  | "submission:testcase_result"
  | "submission:completed"
  | "submission:error"
  | "submission.update"; // Legacy event

/**
 * Hook for listening to real-time submission updates via Socket.IO
 * 
 * @param callback - Function to call when any submission event is received
 * @param events - Optional array of specific events to listen to (defaults to all)
 */
export const useSubmissionSocket = (
  callback: (data: any) => void,
  events?: SubmissionSocketEvent[]
) => {
  const token = useAuthStore((state) => state.token);

  const stableCallback = useCallback(callback, [callback]);

  useEffect(() => {
    if (!token) return;

    const socket: Socket = initSocket(token);

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

    // Default events to listen to
    const eventsToListen: SubmissionSocketEvent[] = events || [
      "submission:created",
      "submission:queued",
      "submission:compiling",
      "submission:running",
      "submission:testcase_result",
      "submission:completed",
      "submission:error",
      "submission.update", // Legacy support
    ];

    // Create handlers for each event
    const handlers: Record<string, (data: any) => void> = {};

    eventsToListen.forEach((event) => {
      handlers[event] = (data: any) => {
        console.log(`🔥 [${event}] Received:`, data);
        
        // Normalize the data based on event type
        const normalizedData = normalizeEventData(event, data);
        stableCallback(normalizedData);
      };

      socket.on(event, handlers[event]);
    });

    // Cleanup
    return () => {
      eventsToListen.forEach((event) => {
        socket.off(event, handlers[event]);
      });
    };
  }, [token, stableCallback, events]);
};

/**
 * Normalize event data to a consistent format
 */
function normalizeEventData(event: SubmissionSocketEvent, data: any): any {
  switch (event) {
    case "submission:created":
      return {
        ...data,
        phase: "created",
      };

    case "submission:queued":
      return {
        ...data,
        phase: "queued",
      };

    case "submission:compiling":
      return {
        ...data,
        phase: "compiling",
      };

    case "submission:running":
      return {
        ...data,
        phase: "running",
        currentTestCase: data.currentTestCase,
        totalTestCases: data.totalTestCases,
      };

    case "submission:testcase_result":
      return {
        ...data,
        testCaseResult: data.result,
        testCaseIndex: data.testCaseIndex,
      };

    case "submission:completed":
      return {
        ...data,
        phase: "completed",
      };

    case "submission:error":
      return {
        ...data,
        phase: "error",
        error: data.error || data.message,
      };

    case "submission.update":
      // Legacy format - pass through
      return data;

    default:
      return data;
  }
}

/**
 * Hook for subscribing to a specific submission's updates
 */
export const useSubmissionUpdates = (
  submissionId: string | null,
  callback: (data: any) => void
) => {
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    if (!token || !submissionId) return;

    const socket: Socket = initSocket(token);

    const handleUpdate = (data: any) => {
      // Only process updates for the specific submission
      if (data.submissionId === submissionId || data.id === submissionId) {
        callback(data);
      }
    };

    // Listen to all submission events
    const events = [
      "submission:created",
      "submission:queued",
      "submission:compiling",
      "submission:running",
      "submission:testcase_result",
      "submission:completed",
      "submission:error",
      "submission.update",
    ];

    events.forEach((event) => {
      socket.on(event, handleUpdate);
    });

    return () => {
      events.forEach((event) => {
        socket.off(event, handleUpdate);
      });
    };
  }, [token, submissionId, callback]);
};
