/**
 * POST /api/auth/login
 *
 * Validates email + password against the user store.
 * On success, sets a HMAC-signed session cookie and writes an audit event.
 * Rate limiting: 10 failed attempts per minute per IP (in-memory, resets on restart).
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getUserByEmail, verifyPassword } from "@/lib/stores/user-store";
import { createSessionPayload, signSession, buildSetCookieHeader } from "@/lib/auth/session";
import { writeAuditEvent } from "@/lib/stores/audit-store";

const LoginSchema = z.object({
  email: z.string().email().max(254),
  password: z.string().min(1).max(256),
});

// In-memory rate limiter — key = IP, value = { count, resetAt }
const failMap = new Map<string, { count: number; resetAt: number }>();
const RATE_WINDOW_MS = 60_000;
const MAX_FAILURES = 10;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = failMap.get(ip);
  if (!entry || now > entry.resetAt) return true; // window expired
  return entry.count < MAX_FAILURES;
}

function recordFailure(ip: string) {
  const now = Date.now();
  const entry = failMap.get(ip);
  if (!entry || now > entry.resetAt) {
    failMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
  } else {
    entry.count += 1;
  }
}

function clearFailures(ip: string) {
  failMap.delete(ip);
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many failed login attempts. Please try again in a minute." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = LoginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email or password format." }, { status: 400 });
  }

  const { email, password } = parsed.data;

  const user = await getUserByEmail(email);
  if (!user || !user.active) {
    recordFailure(ip);
    // Always take the same time path to prevent user enumeration
    await new Promise((r) => setTimeout(r, 200 + Math.random() * 100));
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  const valid = await verifyPassword(password, user.passwordHash, user.passwordSalt);
  if (!valid) {
    recordFailure(ip);
    await writeAuditEvent({
      actorUserId: user.id,
      actorEmail: user.email,
      actorRole: user.role,
      action: "auth:login-failed",
      entityType: "user",
      entityId: user.id,
      metadata: { ip },
    });
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  clearFailures(ip);

  const payload = createSessionPayload(user.id, user.email, user.name, user.role);
  const token = await signSession(payload);

  await writeAuditEvent({
    actorUserId: user.id,
    actorEmail: user.email,
    actorRole: user.role,
    action: "auth:login",
    entityType: "user",
    entityId: user.id,
    metadata: { ip },
  });

  const response = NextResponse.json({
    ok: true,
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
  });
  response.headers.set("Set-Cookie", buildSetCookieHeader(token));
  return response;
}
