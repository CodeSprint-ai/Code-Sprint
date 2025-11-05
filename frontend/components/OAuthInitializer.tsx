"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function OAuthInitializer({ children }: { children: React.ReactNode }) {
  const { initializeOAuth } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // ✅ Prevent running twice
  const hasRun = useRef(false);

  useEffect(() => {
    const oauth = searchParams.get("oauth");
    const redirect = searchParams.get("redirect") || "/dashboard";

    if (oauth && !hasRun.current) {
      hasRun.current = true; // mark as executed

      (async () => {
        await initializeOAuth();
        // clean URL
        router.replace(pathname);
        // go to desired page
        router.push(redirect);
      })();
    }
  }, []); // 👈 empty deps → runs only on mount

  return <>{children}</>;
}
