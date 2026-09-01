/**
 * lib/auth/session.ts
 *
 * Edge-safe HMAC-signed session cookie.
 * Uses only Web Crypto — no node:crypto — so it works in Next.js middleware.
 *
 * Cookie name: dsc_session
 * Payload:    base64url(JSON) + "." + base64url(HMAC-SHA256 signature)
 * SameSite:   None; Secure  — required when the app runs in a cross-origin iframe (v0 preview).
 */

import type { SessionUser } from "./types";

const COOKIE_NAME = "dsc_session";
/** 8 hours */
const SESSION_DURATION_MS = 8 * 60 * 60 * 1000;

// ─── Key derivation ───────────────────────────────────────────────────────────

async function importKey(secret: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function b64url(buf: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

function fromB64url(str: string): Uint8Array {
  const b64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(b64);
  return new Uint8Array(raw.split("").map((c) => c.charCodeAt(0)));
}

// ─── Sign / verify ────────────────────────────────────────────────────────────

export async function signSession(payload: SessionUser): Promise<string> {
  const secret = process.env.DSC_SESSION_SECRET ?? "dev-secret-change-in-production";
  const key = await importKey(secret);
  const enc = new TextEncoder();
  const payloadB64 = b64url(enc.encode(JSON.stringify(payload)).buffer as ArrayBuffer);
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(payloadB64));
  return `${payloadB64}.${b64url(sig)}`;
}

export async function verifySession(cookie: string): Promise<SessionUser | null> {
  try {
    const [payloadB64, sigB64] = cookie.split(".");
    if (!payloadB64 || !sigB64) return null;

    const secret = process.env.DSC_SESSION_SECRET ?? "dev-secret-change-in-production";
    const key = await importKey(secret);
    const enc = new TextEncoder();
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      fromB64url(sigB64).buffer as ArrayBuffer,
      enc.encode(payloadB64)
    );
    if (!valid) return null;

    const payload: SessionUser = JSON.parse(new TextDecoder().decode(fromB64url(payloadB64)));
    if (new Date(payload.expiresAt) < new Date()) return null;
    return payload;
  } catch {
    return null;
  }
}

// ─── Cookie helpers ───────────────────────────────────────────────────────────

export function buildSetCookieHeader(token: string): string {
  // SameSite=None requires Secure — always set both so the cookie is accepted
  // in cross-origin iframe contexts (v0 preview). Browsers allow Secure on
  // http://localhost via a special exemption.
  const flags = [
    `${COOKIE_NAME}=${token}`,
    `Path=/`,
    `HttpOnly`,
    `SameSite=None`,
    `Secure`,
    `Max-Age=${SESSION_DURATION_MS / 1000}`,
  ].join("; ");
  return flags;
}

export function buildClearCookieHeader(): string {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=None; Secure; Max-Age=0`;
}

export function getSessionFromRequest(req: Request): string | null {
  const cookieHeader = req.headers.get("cookie") ?? "";
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]+)`));
  return match ? match[1] : null;
}

// ─── Session factory ──────────────────────────────────────────────────────────

export function createSessionPayload(
  userId: string,
  email: string,
  name: string,
  role: import("./types").UserRole
): SessionUser {
  return {
    userId,
    email,
    name,
    role,
    expiresAt: new Date(Date.now() + SESSION_DURATION_MS).toISOString(),
  };
}
