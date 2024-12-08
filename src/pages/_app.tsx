import "../styles/styles.css";
import { HeaderProvider } from "../contexts/headerContext";
import { SessionProvider } from "next-auth/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <HeaderProvider>
        <SpeedInsights />
        <Component {...pageProps} />
      </HeaderProvider>
    </SessionProvider>
  );
}
