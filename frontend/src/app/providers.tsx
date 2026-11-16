"use client";

import { MotionConfig } from "framer-motion";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import React, { Suspense, ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "@/features/shared/components/ui/sonner";
import { OAuthInitializer } from "@/features/shared/components/OAuthInitializer";
import { AuthInitializer } from "@/features/shared/components/AuthInitializer";

interface Props {
  children: ReactNode;
}

const queryClient = new QueryClient();

export function Provider({ children }: Props) {
  return (
    <MotionConfig reducedMotion="user">
      <QueryClientProvider client={queryClient}>
        <NextThemesProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
          storageKey="codesprint-theme"
          disableTransitionOnChange
        >
          <AuthInitializer>
            <Suspense fallback={null}>
              <OAuthInitializer>{children}</OAuthInitializer>
            </Suspense>
          </AuthInitializer>
          <Toaster />
        </NextThemesProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </MotionConfig>
  );
}
