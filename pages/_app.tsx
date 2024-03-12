import '../styles/styles.css';
import { HeaderProvider } from "../contexts/headerContext"
import { SessionProvider } from "next-auth/react"

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <HeaderProvider>
          <Component {...pageProps} />
      </HeaderProvider>
    </SessionProvider>
  )
}

export default MyApp; 
