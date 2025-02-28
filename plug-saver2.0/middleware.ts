import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { updateSession } from "@/lib/auth"

export async function middleware(request: NextRequest) {
  // Update session if needed
  await updateSession(request)

  // Public paths that don't require authentication
  const publicPaths = ["/", "/login", "/register", "/verify"]
  const isPublicPath = publicPaths.some((path) => request.nextUrl.pathname.startsWith(path))

  const session = request.cookies.get("session")

  // Redirect authenticated users away from public paths
  if (session && isPublicPath) {
    return NextResponse.redirect(new URL("/home", request.url))
  }

  // Redirect unauthenticated users to login
  if (!session && !isPublicPath) {
    const searchParams = new URLSearchParams({
      next: request.nextUrl.pathname,
    })
    return NextResponse.redirect(new URL(`/login?${searchParams}`, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}

