export interface ApiErrorDetail {
  code?: string;
  message?: string;
  [key: string]: unknown;
}

export class ApiError extends Error {
  status: number;
  code?: string;
  details?: ApiErrorDetail | unknown;

  constructor(status: number, message: string, code?: string, details?: ApiErrorDetail | unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }

  static fromResponse(status: number, payload: unknown): ApiError {
    if (payload && typeof payload === "object" && "detail" in payload) {
      const detail = (payload as { detail?: unknown }).detail;
      if (detail && typeof detail === "object") {
        const typed = detail as ApiErrorDetail;
        return new ApiError(status, typed.message ?? "Error de API", typed.code, typed);
      }

      if (typeof detail === "string") {
        return new ApiError(status, detail);
      }
    }

    return new ApiError(status, "Error de API", undefined, payload);
  }
}

export function getApiErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Error desconocido";
}