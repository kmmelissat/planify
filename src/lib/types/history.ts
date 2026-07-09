import type { PlanApprovalStatus, PlanScope } from "./plan";

export type HistoryAction =
  | "generado"
  | "aprobado"
  | "editado"
  | "rechazado"
  | "replanificado";

/**
 * Entrada de trazabilidad: un registro inmutable de cada evento del ciclo
 * humano-IA (generación, aprobación, edición, rechazo, replanificación).
 */
export interface HistorialEntry {
  id: string;
  planId: string;
  version: number;
  scope: PlanScope;
  action: HistoryAction;
  approvalStatus: PlanApprovalStatus;
  promptUsed: string;
  createdAt: string;
  /** Motivo declarado por el usuario, si aplica (ej. al rechazar o pedir nueva versión). */
  userNote?: string;
}
