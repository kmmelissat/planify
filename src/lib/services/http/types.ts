import type { Weekday } from "@/lib/types/availability";

export type BackendTaskStatus =
  | "pending"
  | "in_progress"
  | "completed"
  | "overdue"
  | "rescheduled";

export interface BackendTaskOut {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  category: string | null;
  deadline: string;
  priority: number;
  effort_hours: number;
  status: BackendTaskStatus;
  created_at: string | null;
}

export interface BackendTaskCreate {
  title: string;
  description?: string | null;
  category?: string | null;
  deadline: string;
  priority: number;
  effort_hours: number;
  status?: BackendTaskStatus;
}

export interface BackendAvailabilityOut {
  id: string;
  user_id: string;
  date: string;
  start_time: string;
  end_time: string;
  label?: string | null;
}

export interface BackendAvailabilityCreate {
  date: string;
  day: Weekday;
  start_time: string;
  end_time: string;
  label?: string | null;
}

export type BackendConstraintType =
  | "blocked_time"
  | "max_session_hours"
  | "fixed_task"
  | "academic_priority";

export interface BackendConstraintOut {
  id: string;
  user_id: string;
  type: BackendConstraintType;
  description: string;
  meta_data?: Record<string, unknown> | null;
  metadata?: Record<string, unknown> | null;
}

export interface BackendConstraintCreate {
  type: BackendConstraintType;
  description: string;
  metadata?: Record<string, unknown> | null;
}

export interface BackendPlanItemOut {
  tarea_id: string;
  dia: string;
  bloque_inicio: string;
  bloque_fin: string;
  orden: number;
  task_title?: string | null;
  priority?: number | null;
  status?: string | null;
}

export interface BackendConflictOut {
  tarea_id?: string | null;
  tipo: string;
  severidad: "info" | "advertencia" | "critico";
  mensaje: string;
}

export interface BackendPlanResponse {
  id: string;
  version: number;
  version_plan: string;
  scope: "diario" | "semanal";
  generated_at: string;
  approval_status: "propuesto" | "aprobado" | "editado" | "rechazado";
  viabilidad: "viable" | "viable_con_ajustes" | "no_viable";
  plan: BackendPlanItemOut[];
  justificacion: string;
  riesgos: string[];
  conflictos: BackendConflictOut[];
  recomendaciones: string[];
  prompt_enviado: string;
  respuesta_ia: string;
  response_status: "valid" | "invalid" | "error";
  modelo_usado: string;
  validation_code?: string | null;
  estado_revision: "normal" | "requiere_revision";
}

export interface BackendPlanUpdateRequest {
  plan: BackendPlanItemOut[];
  user_note?: string | null;
}

export interface BackendApprovalUpdateRequest {
  approval_status: "propuesto" | "aprobado" | "editado" | "rechazado";
  user_note?: string | null;
}

export interface BackendHistoryEntryOut {
  id: string;
  plan_id: string;
  version: number;
  scope: "diario" | "semanal";
  action: string;
  approval_status: string;
  prompt_used: string;
  created_at: string | null;
  user_note?: string | null;
}

export type AnyBackendEntity =
  | BackendTaskOut
  | BackendAvailabilityOut
  | BackendConstraintOut
  | BackendPlanResponse
  | BackendHistoryEntryOut;