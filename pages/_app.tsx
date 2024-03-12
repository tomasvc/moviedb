import "../styles/styles.css";
import { HeaderProvider } from "../contexts/headerContext";
import { SessionProvider } from "next-auth/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <HeaderProvider>
        <SpeedInsights />
        <Component {...pageProps} />
      </HeaderProvider>
    </SessionProvider>
  );
}

export default MyApp;
