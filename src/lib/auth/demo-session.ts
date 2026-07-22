type DemoSession = {
  access_token: string;
  name: string;
  email: string;
};

export interface DemoUserProfile {
  name: string;
  email: string;
}

const STORAGE_KEY = "sb-planify-auth-token";

function base64UrlEncode(value: string): string {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function buildDemoJwt(session: DemoSession): string {
  const header = base64UrlEncode(JSON.stringify({ alg: "none", typ: "JWT" }));
  const payload = base64UrlEncode(
    JSON.stringify({
      sub: session.email.toLowerCase(),
      email: session.email,
      name: session.name,
    }),
  );
  return `${header}.${payload}.demo`;
}

export function persistDemoSession(name: string, email: string): void {
  if (typeof window === "undefined") return;

  const normalizedName = name.trim() || "Usuario";
  const normalizedEmail = email.trim().toLowerCase();
  const session: DemoSession = {
    access_token: buildDemoJwt({ access_token: "", name: normalizedName, email: normalizedEmail }),
    name: normalizedName,
    email: normalizedEmail,
  };

  const payload = {
    access_token: session.access_token,
    currentSession: { access_token: session.access_token },
    session: { access_token: session.access_token },
    user: { email: normalizedEmail, name: normalizedName },
  };

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

export function clearDemoSession(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}

export function getDemoSessionEmail(): string | null {
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

export function getDemoSessionProfile(): DemoUserProfile | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { user?: { email?: string; name?: string } };
    const email = parsed.user?.email?.trim().toLowerCase();
    const name = parsed.user?.name?.trim();
    if (!email) return null;
    return { email, name: name || email.split("@")[0] || "Usuario" };
  } catch {
    return null;
  }
}

export function hasActiveDemoSession(): boolean {
  return Boolean(getDemoSessionEmail());
}