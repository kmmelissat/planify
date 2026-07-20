import type { Weekday } from "./availability";
import type { TaskPriority } from "./task";

export type PlanScope = "diario" | "semanal";

export type PlanApprovalStatus =
  | "propuesto"
  | "aprobado"
  | "editado"
  | "rechazado";

/**
 * Un bloque de trabajo asignado a una tarea dentro del plan propuesto.
 * Es la unidad compartida entre las 3 vistas (calendario, kanban, tabla).
 */
export interface PlanItem {
  id: string;
  taskId: string;
  taskTitle: string;
  priority: TaskPriority;
  day: Weekday;
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
  /** Estado del item dentro del plan (distinto del estado de la tarea original). */
  status: "programada" | "en_progreso" | "completada" | "en_riesgo";
  /** Explicación puntual de por qué este bloque quedó en este orden/horario. */
  justification: string;
}

export type ConflictSeverity = "info" | "advertencia" | "critico";

export type ConflictType =
  | "sobrecarga"
  | "fecha_en_riesgo"
  | "informacion_insuficiente"
  | "choque_horario";

export interface ConflictAlert {
  id: string;
  type: ConflictType;
  severity: ConflictSeverity;
  message: string;
  relatedTaskIds: string[];
}

/**
 * Propuesta de plan generada por la IA. Vive en estado "propuesto" hasta que
 * el usuario aprueba, edita o rechaza — nunca se aplica automáticamente.
 */
export interface PlanGenerado {
  id: string;
  version: number;
  scope: PlanScope;
  generatedAt: string;
  approvalStatus: PlanApprovalStatus;
  viabilidad?: "viable" | "viable_con_ajustes" | "no_viable";
  validationCode?: string | null;
  estadoRevision?: "normal" | "requiere_revision";
  responseStatus?: "valid" | "invalid" | "error";
  /** Resumen en lenguaje natural de la estrategia usada para ordenar las tareas. */
  overallJustification: string;
  items: PlanItem[];
  conflicts: ConflictAlert[];
  /** Prompt (simulado por ahora) que produjo esta versión del plan. */
  promptUsed: string;
}
