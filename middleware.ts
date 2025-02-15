import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("next-auth.session-token")?.value;

  // If the user is already logged in, let them access all pages
  if (!token) {
    return NextResponse.redirect(new URL("/signup", req.url));
  }

  // Redirect unauthenticated users to home page
  // return NextResponse.redirect(new URL("/", req.url));
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|public|signup|api/auth).*)"], 

};
