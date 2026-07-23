import type { BackendAuthUser } from "@/lib/services/http/auth-repository";

const STORAGE_KEY = "sb-planify-auth-token";

/** Leída por middleware.ts (Edge, sin acceso a localStorage) para el gate de /app. */
const COOKIE_NAME = "planify-token";
// Igual a access_token_expire_minutes por defecto en el backend (app/core/config.py).
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

function setCookie(name: string, value: string, maxAgeSeconds: number): void {
  if (typeof document === "undefined") return;
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Lax${secure}`;
}

function clearCookie(name: string): void {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax`;
}

export function persistSession(accessToken: string, user: BackendAuthUser): void {
  if (typeof window === "undefined") return;

  const payload = {
    access_token: accessToken,
    currentSession: { access_token: accessToken },
    session: { access_token: accessToken },
    user,
  };

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  setCookie(COOKIE_NAME, accessToken, COOKIE_MAX_AGE_SECONDS);
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
  clearCookie(COOKIE_NAME);
}

export function getSessionEmail(): string | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { user?: { email?: string } };
    return parsed.user?.email?.trim().toLowerCase() ?? null;
  } catch {
    return null;
  }
}

export function getSessionProfile(): BackendAuthUser | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { user?: BackendAuthUser };
    if (!parsed.user?.email || !parsed.user?.id) return null;
    return parsed.user;
  } catch {
    return null;
  }
}

export function hasActiveSession(): boolean {
  return Boolean(getSessionEmail());
}
