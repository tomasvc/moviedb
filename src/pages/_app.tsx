import "../styles/styles.css";
import { HeaderProvider } from "../contexts/headerContext";
import { SessionProvider } from "next-auth/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { IsClientCtxProvider } from "../contexts/isClientCtx";
import NextNProgress from "nextjs-progressbar";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <IsClientCtxProvider>
        <HeaderProvider>
          <SpeedInsights />
          <NextNProgress height={3} options={{ easing: "ease", speed: 500 }} />
          <Component {...pageProps} />
        </HeaderProvider>
      </IsClientCtxProvider>
    </SessionProvider>
  );
}
