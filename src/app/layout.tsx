import "../styles/styles.css";
import { ClientLayout } from "./ClientLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Movies",
  description: "Movie database application",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
