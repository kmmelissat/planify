export type Weekday =
  | "lunes"
  | "martes"
  | "miercoles"
  | "jueves"
  | "viernes"
  | "sabado"
  | "domingo";

/** Bloque de tiempo libre declarado por el usuario para un día de la semana. */
export interface AvailabilityBlock {
  id: string;
  date?: string;
  day: Weekday;
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
  label?: string;
}

export type ConstraintType =
  | "horario_ocupado"
  | "tarea_fija"
  | "tiempo_maximo_sesion"
  | "otro";

/**
 * Restricción que el motor de planificación debe respetar: desde bloqueos de
 * horario hasta límites de duración por sesión de trabajo.
 */
export interface Constraint {
  id: string;
  type: ConstraintType;
  description: string;
  day?: Weekday;
  taskId?: string;
  startTime?: string; // "HH:mm", aplica a horario_ocupado / tarea_fija
  endTime?: string; // "HH:mm"
  maxSessionMinutes?: number; // aplica a tiempo_maximo_sesion
  createdAt: string;
}

export type AvailabilityBlockInput = Omit<AvailabilityBlock, "id">;
export type ConstraintInput = Omit<Constraint, "id" | "createdAt">;
