import type { BackendAuthUser } from "@/lib/services/http/auth-repository";

const STORAGE_KEY = "sb-planify-auth-token";

export function persistSession(accessToken: string, user: BackendAuthUser): void {
  if (typeof window === "undefined") return;

  const payload = {
    access_token: accessToken,
    currentSession: { access_token: accessToken },
    session: { access_token: accessToken },
    user,
  };

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
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
