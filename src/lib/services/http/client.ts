import { ApiError } from "@/lib/services/api-error";

const DEFAULT_API_BASE_URL = "http://localhost:8000";

export function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE_URL;
}

export function getAuthHeaders(): Record<string, string> {
  if (typeof window === "undefined") {
    return {};
  }

  const token = getSupabaseAccessToken();
  if (!token) {
    return {};
  }

  return { Authorization: `Bearer ${token}` };
}

function getSupabaseAccessToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  for (const key of Object.keys(window.localStorage)) {
    if (!key.includes("sb-") || !key.includes("auth-token")) {
      continue;
    }

    const rawValue = window.localStorage.getItem(key);
    if (!rawValue) {
      continue;
    }

    try {
      const parsed = JSON.parse(rawValue) as
        | { access_token?: string }
        | { currentSession?: { access_token?: string } }
        | { session?: { access_token?: string } };

      if ("access_token" in parsed && parsed.access_token) {
        return parsed.access_token;
      }

      if ("currentSession" in parsed && parsed.currentSession?.access_token) {
        return parsed.currentSession.access_token;
      }

      if ("session" in parsed && parsed.session?.access_token) {
        return parsed.session.access_token;
      }
    } catch {
      if (rawValue.includes("access_token")) {
        const match = rawValue.match(/"access_token"\s*:\s*"([^"]+)"/);
        if (match?.[1]) {
          return match[1];
        }
      }
    }
  }

  return null;
}

export async function requestJson<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
      ...(init.headers ?? {}),
    },
  });

  const isJsonResponse = response.headers.get("content-type")?.includes("application/json");
  const payload = isJsonResponse ? await response.json() : null;

  if (!response.ok) {
    throw ApiError.fromResponse(response.status, payload ?? { detail: null });
  }

  return payload as T;
}