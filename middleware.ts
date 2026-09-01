/**
 * middleware.ts
 *
 * Edge middleware that protects administrative routes.
 *
 * /admin/* — requires a valid session cookie.
 *            Unauthenticated requests are redirected to /login.
 *
 * /api/admin/* — requires a valid session.
 *               Unauthenticated requests return 401.
 *
 * All other routes (the main application) remain accessible without
 * authentication in this milestone. The Step 6 spec adds auth to admin
 * surfaces first; full viewer gating is a later milestone.
 *
 * Hidden navigation is NOT the security boundary — every admin API handler
 * independently checks permissions via lib/auth/guard.ts.
 */

import { NextRequest, NextResponse } from "next/server";
import { verifySession, getSessionFromRequest } from "@/lib/auth/session";

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};

export async function middleware(req: NextRequest) {
  const token = getSessionFromRequest(req);

  if (!token) {
    return redirectOrUnauthorized(req);
  }

  const session = await verifySession(token);
  if (!session) {
    return redirectOrUnauthorized(req);
  }

  // Only administrators and data stewards can access /admin
  if (
    req.nextUrl.pathname.startsWith("/admin") &&
    session.role !== "administrator" &&
    session.role !== "data-steward" &&
    session.role !== "reviewer"
  ) {
    // Redirect insufficient-role users to the main application
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Attach session metadata to downstream headers
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-session-user-id", session.userId);
  requestHeaders.set("x-session-role", session.role);
  requestHeaders.set("x-session-email", session.email);

  return NextResponse.next({ request: { headers: requestHeaders } });
}

function redirectOrUnauthorized(req: NextRequest): NextResponse {
  if (req.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }
  const loginUrl = new URL("/login", req.url);
  loginUrl.searchParams.set("redirect", req.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}
