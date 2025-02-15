import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("next-auth.session-token")?.value;

  // Allow public access to API routes, authentication routes, and static assets
  if (
    req.nextUrl.pathname.startsWith("/api") ||  // Allow API routes
    req.nextUrl.pathname.startsWith("/_next") ||  // Allow Next.js static assets
    req.nextUrl.pathname.startsWith("/public") || // Allow public assets
    req.nextUrl.pathname.startsWith("/signup") || // Allow signup page
    req.nextUrl.pathname.startsWith("/api/auth")  // Allow auth-related API
  ) {
    return NextResponse.next();
  }

  // Redirect unauthenticated users to /signup
  if (!token) {
    return NextResponse.redirect(new URL("/signup", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|public|api).*)"], // Protect all pages except API, public, and static files
};
