"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

function isJwtExpired(token: string | null): boolean {
  if (!token) return true;

  try {
    const parts = token.split(".");
    if (parts.length !== 3) return true;

    const payload = parts[1]
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .padEnd(parts[1].length + ((4 - (parts[1].length % 4)) % 4), "=");

    const decoded = JSON.parse(atob(payload)) as { exp?: number };

    if (!decoded.exp) return false;

    return decoded.exp * 1000 < Date.now();
  } catch {
    // If the token cannot be decoded, treat it as invalid/expired
    return true;
  }
}

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const { token, clearAuth } = useAuthStore();

  useEffect(() => {
    // If the token is expired, we should NOT clearAuth() here because the refresh token
    // might still be valid. The axios response interceptor in api.ts will handle 
    // catching the 401 Unauthorized error and automatically refreshing the token.
    // If we clearAuth() here, 'user' becomes null, and protected pages won't even 
    // attempt to make API calls, preventing the refresh token flow from starting.
  }, [token]);

  return <>{children}</>;
}

