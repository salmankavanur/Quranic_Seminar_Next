import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Set a cookie with the current pathname for use in the layout
  const response = NextResponse.next()
  response.cookies.set("__pathname", path, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
  })

  // Define public paths that don't require authentication
  const isPublicPath = path === "/admin/login" || path === "/api/create-admin-user" || !path.startsWith("/admin")

  // If it's a public path, no need to check authentication
  if (isPublicPath) {
    // If the path is login and there's a session cookie, redirect to admin dashboard
    if (path === "/admin/login" && request.cookies.has("session_id")) {
      return NextResponse.redirect(new URL("/admin", request.url))
    }
    return response
  }

  // For admin paths, check if session cookie exists
  const sessionId = request.cookies.get("session_id")?.value

  if (!sessionId) {
    return NextResponse.redirect(new URL("/admin/login", request.url))
  }

  return response
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: ["/admin/:path*"],
}

