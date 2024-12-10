import "../styles/styles.css";
import { HeaderProvider } from "../contexts/headerContext";
import { SessionProvider } from "next-auth/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import NextNProgress from "nextjs-progressbar";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <HeaderProvider>
        <SpeedInsights />
        <NextNProgress height={2} options={{ easing: "ease", speed: 500 }} />
        <Component {...pageProps} />
      </HeaderProvider>
    </SessionProvider>
  );
}
