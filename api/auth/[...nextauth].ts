import NextAuth, { User } from "next-auth";
import Auth0Provider from "next-auth/providers/auth0"
import { JWT } from "next-auth/jwt"

export default NextAuth({
    providers: [
        Auth0Provider({
            clientId: process.env.AUTH0_CLIENT_ID,
            clientSecret: process.env.AUTH0_CLIENT_SECRET,
            issuer: process.env.AUTH0_ISSUER,
        })
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
    }
})