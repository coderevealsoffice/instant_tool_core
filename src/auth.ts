import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import EmailProvider from "next-auth/providers/email"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "./lib/prisma/client"
import bcrypt from "bcryptjs"
import { notifySuperAdminOnNewUser } from "./lib/mail"

export const { handlers, auth, signIn, signOut } = NextAuth({
  // Adapter is needed ONLY for OAuth & Magic Link to store accounts/tokens
  // Credentials login bypasses the adapter entirely with JWT
  adapter: PrismaAdapter(prisma) as any,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "super-secret-key-for-local-dev-12345",
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    // Magic Link via Email — nodemailer SMTP
    EmailProvider({
      server: {
        host: process.env.SMTP_HOST!,
        port: Number(process.env.SMTP_PORT || 587),
        auth: {
          user: process.env.SMTP_USER!,
          pass: process.env.SMTP_PASS!,
        },
      },
      from: `InstantTool <${process.env.SMTP_USER}>`,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string },
            select: {
              id: true,
              email: true,
              name: true,
              image: true,
              password: true,
              role: true,
              emailVerified: true,
            },
          })

          if (!user || !user.password) return null

          const isValid = await bcrypt.compare(
            credentials.password as string,
            user.password
          )

          if (!isValid) return null

          if (!user.emailVerified) {
            throw new Error("Please verify your email first.")
          }

          // Return plain object — no DB write happens here with JWT strategy
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role,
          }
        } catch (err) {
          console.error("[auth] credentials authorize error:", err)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, trigger }) {
      // On sign-in, enrich token from the user object
      if (user) {
        token.id = user.id
        token.role = (user as any).role || "USER"
      }
      // On OAuth/Email sign-in, fetch role from DB since OAuth user objects don't have role
      if (account && account.provider !== "credentials" && token.email) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: token.email },
            select: { id: true, role: true },
          })
          if (dbUser) {
            token.id = dbUser.id
            token.role = dbUser.role
          }
        } catch {
          // Ignore DB errors during token refresh
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user && token) {
        // Fallback to token.sub if token.id is missing (standard NextAuth behavior)
        session.user.id = (token.id || token.sub) as string
        session.user.role = token.role as any
      }
      return session
    },
  },
  events: {
    // Give new OAuth/Magic Link users 20 free credits
    async createUser({ user }) {
      if (user.id) {
        try {
          await prisma.user.update({
            where: { id: user.id },
            data: { credits: 20 },
          })
        } catch {
          // credits column has default(20) in schema, so ignore
        }
        
        if (user.email) {
          await notifySuperAdminOnNewUser(user.email, user.name || null)
        }
      }
    },
  },
  pages: {
    signIn: "/auth/login",
    verifyRequest: "/auth/verify-request",
    error: "/auth/login",
  },
})
