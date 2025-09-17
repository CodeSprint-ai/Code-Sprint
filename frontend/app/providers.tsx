"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from "@/components/ui/sonner";

interface Props {
  children: ReactNode;
}

const queryClient = new QueryClient();

export function Provider({ children }: Props) {
  return (
    <QueryClientProvider client={queryClient}>
      <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
        <Toaster />
      </NextThemesProvider>
         {/* Devtools - only show in development */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
