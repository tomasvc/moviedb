'use client';

import { HeaderProvider } from "../contexts/headerContext";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { IsClientCtxProvider } from "../contexts/isClientCtx";
import NextNProgress from "nextjs-progressbar";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@lib/react-query";

export function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <AppRouterCacheProvider>
        <IsClientCtxProvider>
          <HeaderProvider>
            <SpeedInsights />
            <NextNProgress height={3} options={{ easing: "ease", speed: 500 }} />
            {children}
          </HeaderProvider>
        </IsClientCtxProvider>
      </AppRouterCacheProvider>
    </QueryClientProvider>
  );
}
