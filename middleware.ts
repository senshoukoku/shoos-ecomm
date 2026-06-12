import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const token = await getToken({ req })
  const { pathname } = req.nextUrl

  // Skip middleware for public routes (auth internals, products, chat, webhooks)
  if (
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/products") ||
    pathname.startsWith("/api/chat") ||
    pathname.startsWith("/api/webhooks")
  ) {
    return NextResponse.next()
  }

  // Page route checks — redirect to login
  const isPageRoute =
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/success") ||
    pathname.startsWith("/account") ||
    pathname.startsWith("/admin")

  // API route — return JSON 401
  const isApiRoute = pathname.startsWith("/api")

  if (isApiRoute) {
    if (!token) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }
    if (pathname.startsWith("/api/admin") && token.role !== "admin") {
      return Response.json({ error: "Forbidden" }, { status: 403 })
    }
    return NextResponse.next()
  }

  if (isPageRoute) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url))
    }
    if (pathname.startsWith("/admin") && token.role !== "admin") {
      return NextResponse.redirect(new URL("/login", req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/checkout", "/success", "/account/:path*", "/admin/:path*", "/api/:path*"],
}
