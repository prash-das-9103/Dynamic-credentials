"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { UserRole } from "./types";
import { roleHasPermission } from "./types";
import type { Permission } from "./types";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  /** Reload the session from the server (e.g. after login). */
  refresh: () => Promise<void>;
  /** Sign out the current user. */
  logout: () => Promise<void>;
  /** Returns true if the current user has the given permission. */
  can: (permission: Permission) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  // Track consecutive 401s to avoid hammering the auth endpoint on load
  const failureCountRef = React.useRef(0);

  const refresh = useCallback(async () => {
    // Back off after 3 consecutive failures (unauthenticated state).
    // Still mark loading done so the UI doesn't stay in skeleton mode.
    if (failureCountRef.current >= 3) {
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      if (res.ok) {
        failureCountRef.current = 0;
        const data = await res.json();
        setUser(data.user ?? null);
      } else {
        failureCountRef.current += 1;
        setUser(null);
      }
    } catch {
      failureCountRef.current += 1;
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    } finally {
      failureCountRef.current = 0;
      setUser(null);
    }
  }, []);

  const can = useCallback(
    (permission: Permission): boolean => {
      if (!user) return false;
      return roleHasPermission(user.role, permission);
    },
    [user]
  );

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <AuthContext.Provider value={{ user, loading, refresh, logout, can }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
