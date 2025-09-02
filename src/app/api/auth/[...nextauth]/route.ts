import NextAuth, { User } from "next-auth";
import Auth0Provider from "next-auth/providers/auth0";
import { JWT } from "next-auth/jwt";

const handler = NextAuth({
  providers: [
    Auth0Provider({
      clientId: process.env.AUTH0_CLIENT_ID as string,
      clientSecret: process.env.AUTH0_CLIENT_SECRET as string,
      issuer: process.env.AUTH0_ISSUER as string,
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user: User | undefined }) {
      if (user) {
        token.id = user.id;
        token.gender = null;
        token.description = null;
        token.favorites = [];
        token.ratings = [];
        token.reviews = [];
        token.watchlist = [];
      }
      return token;
    },
    async session({ session, token }: { session: any; token: JWT }) {
      session.user.id = token.id;
      session.user.gender = token.gender;
      session.user.description = token.description;
      session.user.favorites = token.favorites;
      session.user.ratings = token.ratings;
      session.user.reviews = token.reviews;
      session.user.watchlist = token.watchlist;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
