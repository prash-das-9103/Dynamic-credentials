/**
 * lib/auth/guard.ts
 *
 * Server-side permission helpers for Route Handlers.
 * Every write API route must call requirePermission() before touching any data.
 *
 * Hidden navigation is NOT the security boundary — every API call is checked here.
 */

import { NextResponse } from "next/server";
import { verifySession, getSessionFromRequest } from "./session";
import { roleHasPermission } from "./types";
import type { Permission, SessionUser } from "./types";

/** Returned by requireSession when the request is unauthenticated. */
export const UNAUTHORIZED = NextResponse.json(
  { error: "Authentication required." },
  { status: 401 }
);

/** Returned by requirePermission when the user lacks a permission. */
export const FORBIDDEN = NextResponse.json(
  { error: "You do not have permission to perform this action." },
  { status: 403 }
);

/**
 * Resolve the session from a Request.
 * Returns the SessionUser, or null if missing/expired/invalid.
 */
export async function getSession(req: Request): Promise<SessionUser | null> {
  const token = getSessionFromRequest(req);
  if (!token) return null;
  return verifySession(token);
}

/**
 * Require a valid session.
 * Returns { session } or { response } (the 401 to short-circuit with).
 */
export async function requireSession(
  req: Request
): Promise<{ session: SessionUser; response?: never } | { session?: never; response: NextResponse }> {
  const session = await getSession(req);
  if (!session) return { response: UNAUTHORIZED };
  return { session };
}

/**
 * Require a valid session AND a specific permission.
 * Returns { session } or { response } (401 or 403).
 */
export async function requirePermission(
  req: Request,
  permission: Permission
): Promise<{ session: SessionUser; response?: never } | { session?: never; response: NextResponse }> {
  const result = await requireSession(req);
  if (result.response) return result;
  const { session } = result;
  if (!roleHasPermission(session.role, permission)) {
    return { response: FORBIDDEN };
  }
  return { session };
}

/**
 * Guard for self-approval: a contributor cannot approve their own content.
 * Returns FORBIDDEN if submitter === reviewer.
 */
export function checkSelfApproval(
  submitterId: string,
  reviewerId: string
): NextResponse | null {
  if (submitterId === reviewerId) {
    return NextResponse.json(
      { error: "Contributors cannot approve their own submissions." },
      { status: 403 }
    );
  }
  return null;
}
