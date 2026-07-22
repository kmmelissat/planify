import { requestJson } from "@/lib/services/http/client";

export interface BackendAuthUser {
  id: string;
  email: string;
  name: string;
}

export interface BackendAuthResponse {
  access_token: string;
  token_type: string;
  user: BackendAuthUser;
}

export async function registerUser(
  name: string,
  email: string,
  password: string,
): Promise<BackendAuthResponse> {
  return requestJson<BackendAuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

export async function loginUser(
  email: string,
  password: string,
): Promise<BackendAuthResponse> {
  return requestJson<BackendAuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}
