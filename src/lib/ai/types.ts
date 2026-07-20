import type {
  AvailabilityBlock,
  Constraint,
  PlanGenerado,
  PlanScope,
  Task,
} from "@/lib/types";

/**
 * Entrada del generador de planes. Este shape es el contrato que debe
 * respetar la integración real con el modelo generativo cuando se conecte.
 */
export interface PlanGenerationRequest {
  scope: PlanScope;
  tasks: Task[];
  availabilityBlocks: AvailabilityBlock[];
  constraints: Constraint[];
  /** Presente cuando el usuario pide una nueva versión o hay una replanificación. */
  previousPlan?: PlanGenerado;
  /** Instrucción libre del usuario, ej. al pedir "otra versión" del plan. */
  userNote?: string;
}

/**
 * Salida del generador. Hoy la produce `generatePlanProposal` con una
 * heurística simple; cuando se conecte el modelo real, esta es la forma que
 * debe devolver la respuesta (sin cambiar el resto de la app).
 */
export type PlanGenerationResult = Pick<
  PlanGenerado,
  | "id"
  | "version"
  | "generatedAt"
  | "approvalStatus"
  | "scope"
  | "overallJustification"
  | "items"
  | "conflicts"
  | "promptUsed"
  | "viabilidad"
  | "validationCode"
  | "estadoRevision"
  | "responseStatus"
>;

export interface BackendPlanGenerationRequest {
  scope: PlanScope;
  user_note?: string;
  change_block?: Record<string, unknown> | null;
}
