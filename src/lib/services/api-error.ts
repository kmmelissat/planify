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

      if (typeof detail === "string") {
        return new ApiError(status, detail);
      }

      // FastAPI/pydantic devuelve los errores 422 como un array de
      // { type, loc, msg, input, ctx }, no como un objeto { code, message }.
      if (Array.isArray(detail)) {
        const message = detail
          .map((item) =>
            item && typeof item === "object" && "msg" in item
              ? String((item as { msg: unknown }).msg)
              : null,
          )
          .filter((msg): msg is string => Boolean(msg))
          .join(" ");

        return new ApiError(status, message || "Error de API", undefined, detail);
      }

      if (detail && typeof detail === "object") {
        const typed = detail as ApiErrorDetail;
        return new ApiError(status, typed.message ?? "Error de API", typed.code, typed);
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