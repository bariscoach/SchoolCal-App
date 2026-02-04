import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" }, // Keep JWT for performance, but Adapter ensures User creation
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
                params: {
                    prompt: "login", // Force re-authentication to clear stale cookies
                    access_type: "offline",
                    response_type: "code"
                }
            },
            allowDangerousEmailAccountLinking: true,
        }),
    ],
    callbacks: {
        jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.role = user.role
            }
            return token
        },
        session({ session, token }) {
            if (token?.id) session.user.id = token.id
            if (token?.role) session.user.role = token.role
            return session
        },
    },
    secret: process.env.AUTH_SECRET,
    debug: true,
    trustHost: true,
})
