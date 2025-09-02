'use client';

import { HeaderProvider } from "../contexts/headerContext";
import { SessionProvider } from "next-auth/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { IsClientCtxProvider } from "../contexts/isClientCtx";
import NextNProgress from "nextjs-progressbar";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";

export function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppRouterCacheProvider>
      <SessionProvider>
        <IsClientCtxProvider>
          <HeaderProvider>
            <SpeedInsights />
            <NextNProgress height={3} options={{ easing: "ease", speed: 500 }} />
            {children}
          </HeaderProvider>
        </IsClientCtxProvider>
      </SessionProvider>
    </AppRouterCacheProvider>
  );
}
