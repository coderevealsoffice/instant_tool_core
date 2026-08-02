import NextAuth from "next-auth"
import { NextResponse } from "next/server"

const { auth } = NextAuth({
  providers: [],
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "super-secret-key-for-local-dev-12345",
  callbacks: {
    async session({ session, token }: any) {
      if (session.user && token) {
        session.user.id = (token.id || token.sub) as string
        session.user.role = token.role as any
      }
      return session
    },
  }
})

export default auth((req: any) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  const user = req.auth?.user as any

  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth")
  const isPublicRoute = nextUrl.pathname === "/" || nextUrl.pathname.startsWith("/auth") || nextUrl.pathname.startsWith("/pdf-tools") || nextUrl.pathname.startsWith("/image-tools") || nextUrl.pathname.startsWith("/video-tools") || nextUrl.pathname.startsWith("/qr-tools") || nextUrl.pathname.startsWith("/pricing")

  const isAdminRoute = nextUrl.pathname.startsWith("/admin")
  const isSuperAdminRoute = nextUrl.pathname.startsWith("/super-admin")
  const isDashboardRoute = nextUrl.pathname.startsWith("/dashboard")

  if (isApiAuthRoute) return NextResponse.next()

  if (!isLoggedIn && (isDashboardRoute || isAdminRoute || isSuperAdminRoute)) {
    return NextResponse.redirect(new URL("/auth/login", nextUrl))
  }

  if (isLoggedIn) {
    if (isSuperAdminRoute && user?.role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", nextUrl))
    }

    if (isAdminRoute && user?.role !== "ADMIN" && user?.role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", nextUrl))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}
