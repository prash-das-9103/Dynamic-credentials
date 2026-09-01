/**
 * lib/stores/user-store.ts
 *
 * File-backed user registry.
 * Swap internals for a Neon query when DB access is granted.
 *
 * Passwords are hashed with PBKDF2 (Web Crypto — no bcrypt needed at this scale).
 * The store is initialised with a seed admin on first read if the file is missing.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";
import type { UserRole } from "@/lib/auth/types";

const DATA_DIR = join(process.cwd(), ".data");
const FILE = join(DATA_DIR, "users.json");
const BACKUP = join(DATA_DIR, "users.backup.json");

export interface StoredUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  passwordHash: string;   // PBKDF2-SHA256, base64
  passwordSalt: string;   // random 16 bytes, base64
  createdAt: string;
  updatedAt: string;
  active: boolean;
  createdBy?: string;
}

interface UserStore {
  version: number;
  updatedAt: string;
  users: StoredUser[];
}

// ─── Password hashing (Web Crypto PBKDF2) ─────────────────────────────────────

export async function hashPassword(
  password: string,
  saltB64?: string
): Promise<{ hash: string; salt: string }> {
  const enc = new TextEncoder();
  const saltBytes = saltB64
    ? Uint8Array.from(atob(saltB64), (c) => c.charCodeAt(0))
    : crypto.getRandomValues(new Uint8Array(16));

  const baseKey = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const derived = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: saltBytes, iterations: 100_000, hash: "SHA-256" },
    baseKey,
    256
  );
  const hash = btoa(String.fromCharCode(...new Uint8Array(derived)));
  const salt = btoa(String.fromCharCode(...saltBytes));
  return { hash, salt };
}

export async function verifyPassword(
  password: string,
  storedHash: string,
  storedSalt: string
): Promise<boolean> {
  const { hash } = await hashPassword(password, storedSalt);
  return hash === storedHash;
}

// ─── Seed admin ───────────────────────────────────────────────────────────────

async function buildSeedAdmin(): Promise<StoredUser> {
  const seedPassword = process.env.DSC_ADMIN_SEED_PASSWORD ?? "ChangeThisPassword1";
  const { hash, salt } = await hashPassword(seedPassword);
  const now = new Date().toISOString();
  return {
    id: "user-admin-seed",
    email: process.env.DSC_ADMIN_SEED_EMAIL ?? "admin@example.com",
    name: "Platform Administrator",
    role: "administrator",
    passwordHash: hash,
    passwordSalt: salt,
    createdAt: now,
    updatedAt: now,
    active: true,
  };
}

// ─── File I/O ─────────────────────────────────────────────────────────────────

function ensureDir() {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
}

function readStore(): UserStore | null {
  try {
    if (!existsSync(FILE)) return null;
    return JSON.parse(readFileSync(FILE, "utf8")) as UserStore;
  } catch {
    try {
      if (existsSync(BACKUP))
        return JSON.parse(readFileSync(BACKUP, "utf8")) as UserStore;
    } catch {}
    return null;
  }
}

function writeStore(store: UserStore) {
  ensureDir();
  const data = JSON.stringify(store, null, 2);
  if (existsSync(FILE)) writeFileSync(BACKUP, readFileSync(FILE));
  writeFileSync(FILE, data);
}

// ─── Public API ───────────────────────────────────────────────────────────────

let _cache: UserStore | null = null;

async function loadStore(): Promise<UserStore> {
  // Always read from disk — no memoisation to avoid stale caches
  const stored = readStore();
  if (stored) return stored;

  // First boot — create seed admin
  const admin = await buildSeedAdmin();
  const store: UserStore = {
    version: 1,
    updatedAt: new Date().toISOString(),
    users: [admin],
  };
  writeStore(store);
  return store;
}

export async function getAllUsers(): Promise<StoredUser[]> {
  const store = await loadStore();
  return store.users;
}

export async function getUserByEmail(email: string): Promise<StoredUser | null> {
  const store = await loadStore();
  return store.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null;
}

export async function getUserById(id: string): Promise<StoredUser | null> {
  const store = await loadStore();
  return store.users.find((u) => u.id === id) ?? null;
}

export async function createUser(
  fields: Omit<StoredUser, "id" | "createdAt" | "updatedAt" | "passwordHash" | "passwordSalt">,
  password: string
): Promise<StoredUser> {
  const store = await loadStore();
  if (store.users.some((u) => u.email.toLowerCase() === fields.email.toLowerCase())) {
    throw new Error("A user with that email address already exists.");
  }
  const { hash, salt } = await hashPassword(password);
  const now = new Date().toISOString();
  const user: StoredUser = {
    ...fields,
    id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    passwordHash: hash,
    passwordSalt: salt,
    createdAt: now,
    updatedAt: now,
  };
  store.users.push(user);
  store.version += 1;
  store.updatedAt = now;
  writeStore(store);
  return user;
}

export async function updateUser(
  id: string,
  patch: Partial<Pick<StoredUser, "name" | "role" | "active">>
): Promise<StoredUser> {
  const store = await loadStore();
  const idx = store.users.findIndex((u) => u.id === id);
  if (idx === -1) throw new Error("User not found.");
  const now = new Date().toISOString();
  store.users[idx] = { ...store.users[idx], ...patch, updatedAt: now };
  store.version += 1;
  store.updatedAt = now;
  writeStore(store);
  return store.users[idx];
}

export async function updatePassword(
  id: string,
  newPassword: string
): Promise<void> {
  const store = await loadStore();
  const idx = store.users.findIndex((u) => u.id === id);
  if (idx === -1) throw new Error("User not found.");
  const { hash, salt } = await hashPassword(newPassword);
  const now = new Date().toISOString();
  store.users[idx] = {
    ...store.users[idx],
    passwordHash: hash,
    passwordSalt: salt,
    updatedAt: now,
  };
  store.version += 1;
  store.updatedAt = now;
  writeStore(store);
}
