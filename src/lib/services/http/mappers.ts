import type {
  AvailabilityBlock,
  AvailabilityBlockInput,
  Constraint,
  ConstraintInput,
  Task,
  TaskInput,
  TaskStatus,
  TaskUpdate,
  PlanGenerado,
  ConflictAlert,
  PlanItem,
  HistorialEntry,
} from "@/lib/types";
import type {
  BackendApprovalUpdateRequest,
  BackendAvailabilityCreate,
  BackendAvailabilityOut,
  BackendConflictOut,
  BackendConstraintCreate,
  BackendConstraintOut,
  BackendHistoryEntryOut,
  BackendPlanResponse,
  BackendPlanUpdateRequest,
  BackendTaskCreate,
  BackendTaskOut,
  BackendTaskStatus,
} from "@/lib/services/http/types";
import type { PlanGenerationRequest, PlanGenerationResult } from "@/lib/ai/types";
import { addDays, startOfWeek } from "date-fns";

const PRIORITY_TO_NUMBER: Record<Task["priority"], number> = {
  baja: 1,
  media: 3,
  alta: 4,
  urgente: 5,
};

const NUMBER_TO_PRIORITY = (value: number): Task["priority"] => {
  if (value >= 5) return "urgente";
  if (value >= 4) return "alta";
  if (value >= 3) return "media";
  return "baja";
};

const FRONTEND_TO_BACKEND_STATUS: Record<TaskStatus, BackendTaskStatus> = {
  pendiente: "pending",
  en_progreso: "in_progress",
  completada: "completed",
  atrasada: "overdue",
  reprogramada: "rescheduled",
};

const BACKEND_TO_FRONTEND_STATUS: Record<BackendTaskStatus, TaskStatus> = {
  pending: "pendiente",
  in_progress: "en_progreso",
  completed: "completada",
  overdue: "atrasada",
  rescheduled: "reprogramada",
};

const CONSTRAINT_TO_BACKEND_TYPE: Record<Constraint["type"], BackendConstraintCreate["type"]> = {
  horario_ocupado: "blocked_time",
  tarea_fija: "fixed_task",
  tiempo_maximo_sesion: "max_session_hours",
  otro: "academic_priority",
};

const BACKEND_TO_FRONTEND_CONSTRAINT: Record<BackendConstraintCreate["type"], Constraint["type"]> = {
  blocked_time: "horario_ocupado",
  fixed_task: "tarea_fija",
  max_session_hours: "tiempo_maximo_sesion",
  academic_priority: "otro",
};

const WEEKDAY_ORDER: AvailabilityBlock["day"][] = [
  "lunes",
  "martes",
  "miercoles",
  "jueves",
  "viernes",
  "sabado",
  "domingo",
];

function weekdayToDate(day: AvailabilityBlock["day"], baseDate = new Date()): string {
  const weekStart = startOfWeek(baseDate, { weekStartsOn: 1 });
  const offset = WEEKDAY_ORDER.indexOf(day);
  return addDays(weekStart, offset).toISOString().slice(0, 10);
}

function dateToWeekday(dateValue: string): AvailabilityBlock["day"] {
  const days: AvailabilityBlock["day"][] = [
    "domingo",
    "lunes",
    "martes",
    "miercoles",
    "jueves",
    "viernes",
    "sabado",
  ];
  return days[new Date(dateValue).getDay()] ?? "lunes";
}

export function toBackendTaskCreate(input: TaskInput): BackendTaskCreate {
  return {
    title: input.title,
    description: input.description,
    category: input.category,
    deadline: toBackendDate(input.dueDate),
    priority: PRIORITY_TO_NUMBER[input.priority],
    effort_hours: Math.max(1, Math.ceil(input.estimatedEffortMinutes / 60)),
    status: FRONTEND_TO_BACKEND_STATUS[input.status],
  };
}

export function toBackendTaskUpdate(update: TaskUpdate): Partial<BackendTaskCreate> {
  const payload: Partial<BackendTaskCreate> = {};
  if (update.title !== undefined) payload.title = update.title;
  if (update.description !== undefined) payload.description = update.description;
  if (update.category !== undefined) payload.category = update.category;
  if (update.dueDate !== undefined) payload.deadline = toBackendDate(update.dueDate);
  if (update.priority !== undefined) payload.priority = PRIORITY_TO_NUMBER[update.priority];
  if (update.estimatedEffortMinutes !== undefined) {
    payload.effort_hours = Math.max(1, Math.ceil(update.estimatedEffortMinutes / 60));
  }
  if (update.status !== undefined) payload.status = FRONTEND_TO_BACKEND_STATUS[update.status];
  return payload;
}

export function fromBackendTask(task: BackendTaskOut): Task {
  return {
    id: task.id,
    title: task.title,
    description: task.description ?? "",
    category: (task.category as Task["category"]) ?? "otro",
    dueDate: toFrontendDate(task.deadline),
    priority: NUMBER_TO_PRIORITY(task.priority),
    estimatedEffortMinutes: task.effort_hours * 60,
    status: BACKEND_TO_FRONTEND_STATUS[task.status],
    createdAt: task.created_at ?? new Date().toISOString(),
    updatedAt: task.created_at ?? new Date().toISOString(),
  };
}

export function toBackendAvailabilityCreate(input: AvailabilityBlockInput): BackendAvailabilityCreate {
  return {
    date: weekdayToDate(input.day),
    day: input.day,
    start_time: input.startTime,
    end_time: input.endTime,
    label: input.label,
  };
}

export function toBackendAvailabilityUpdate(update: Partial<AvailabilityBlockInput>): Record<string, unknown> {
  return {
    ...(update.day !== undefined ? { date: weekdayToDate(update.day), day: update.day } : {}),
    ...(update.startTime !== undefined ? { start_time: update.startTime } : {}),
    ...(update.endTime !== undefined ? { end_time: update.endTime } : {}),
    ...(update.label !== undefined ? { label: update.label } : {}),
  };
}

export function fromBackendAvailability(block: BackendAvailabilityOut): AvailabilityBlock {
  return {
    id: block.id,
    date: block.date,
    day: block.day,
    startTime: block.start_time,
    endTime: block.end_time,
    label: block.label ?? undefined,
  };
}

export function toBackendConstraintCreate(input: ConstraintInput): BackendConstraintCreate {
  return {
    type: CONSTRAINT_TO_BACKEND_TYPE[input.type],
    description: input.description,
    metadata: constraintMetadataToBackend(input),
  };
}

export function toBackendConstraintUpdate(update: Partial<ConstraintInput>): Partial<BackendConstraintCreate> {
  const payload: Partial<BackendConstraintCreate> = {};
  if (update.type !== undefined) payload.type = CONSTRAINT_TO_BACKEND_TYPE[update.type];
  if (update.description !== undefined) payload.description = update.description;
  if (update.day !== undefined || update.startTime !== undefined || update.endTime !== undefined || update.maxSessionMinutes !== undefined) {
    payload.metadata = constraintMetadataToBackend(update);
  }
  return payload;
}

export function fromBackendConstraint(constraint: BackendConstraintOut): Constraint {
  const metadata = (constraint.metadata ?? constraint.meta_data ?? {}) as Record<string, unknown>;
  const type = BACKEND_TO_FRONTEND_CONSTRAINT[constraint.type];
  const weekday =
    (metadata.weekday as Constraint["day"] | undefined) ??
    (metadata.day as Constraint["day"] | undefined) ??
    (typeof metadata.date === "string" ? dateToWeekday(metadata.date) : undefined);
  return {
    id: constraint.id,
    type,
    description: constraint.description,
    day: weekday,
    taskId: (metadata.task_id as string | undefined) ?? undefined,
    startTime: (metadata.start_time as string | undefined) ?? (metadata.bloque_inicio as string | undefined),
    endTime: (metadata.end_time as string | undefined) ?? (metadata.bloque_fin as string | undefined),
    maxSessionMinutes: (metadata.max_session_minutes as number | undefined) ?? undefined,
    createdAt: new Date().toISOString(),
  };
}

export function toBackendPlanUpdate(items: PlanItem[]): BackendPlanUpdateRequest {
  return {
    plan: items.map((item, index) => ({
      tarea_id: item.taskId,
      dia: item.day,
      bloque_inicio: item.startTime,
      bloque_fin: item.endTime,
      orden: index + 1,
      task_title: item.taskTitle,
      priority: item.priority ? PRIORITY_TO_NUMBER[item.priority] : undefined,
      status: item.status,
    })),
  };
}

export function toBackendApprovalUpdate(
  status: PlanGenerado["approvalStatus"],
  userNote?: string,
): BackendApprovalUpdateRequest {
  return { approval_status: status, user_note: userNote };
}

export function fromBackendHistory(entry: BackendHistoryEntryOut): HistorialEntry {
  return {
    id: entry.id,
    planId: entry.plan_id,
    version: entry.version,
    scope: entry.scope,
    action: entry.action as HistorialEntry["action"],
    approvalStatus: entry.approval_status as HistorialEntry["approvalStatus"],
    promptUsed: entry.prompt_used,
    createdAt: entry.created_at ?? new Date().toISOString(),
    userNote: entry.user_note ?? undefined,
  };
}

export function toPlanGenerationPayload(request: PlanGenerationRequest) {
  return {
    scope: request.scope,
    user_note: request.userNote,
    change_block: request.previousPlan ? { previousPlan: request.previousPlan.id } : undefined,
  };
}

export function fromBackendPlanResponse(
  response: BackendPlanResponse,
): PlanGenerationResult & Pick<PlanGenerado, "id" | "version" | "generatedAt" | "approvalStatus"> {
  return {
    id: response.id,
    version: response.version,
    scope: response.scope,
    generatedAt: response.generated_at,
    approvalStatus: response.approval_status,
    viabilidad: response.viabilidad,
    validationCode: response.validation_code ?? null,
    estadoRevision: response.estado_revision,
    responseStatus: response.response_status,
    overallJustification: response.justificacion,
    items: response.plan.map((item) => ({
      id: `${item.tarea_id}-${item.orden}`,
      taskId: item.tarea_id,
      taskTitle: item.task_title ?? item.tarea_id,
      priority: NUMBER_TO_PRIORITY(item.priority ?? 1),
      day: item.dia,
      startTime: item.bloque_inicio,
      endTime: item.bloque_fin,
      status: (item.status as PlanItem["status"]) ?? "programada",
      justification: response.justificacion,
    })),
    conflicts: response.conflictos.map((conflict) => conflictToFrontend(conflict)),
    promptUsed: response.prompt_enviado,
  };
}

function conflictToFrontend(conflict: BackendConflictOut): ConflictAlert {
  return {
    id: `${conflict.tarea_id ?? conflict.tipo}-${conflict.severidad}`,
    type: conflict.tipo as ConflictAlert["type"],
    severity: conflict.severidad,
    message: conflict.mensaje,
    relatedTaskIds: conflict.tarea_id ? [conflict.tarea_id] : [],
  };
}

function constraintMetadataToBackend(input: Partial<ConstraintInput>): Record<string, unknown> {
  const metadata: Record<string, unknown> = {};
  if (input.day !== undefined) metadata.weekday = input.day;
  if (input.taskId !== undefined) metadata.task_id = input.taskId;
  if (input.startTime !== undefined) metadata.start_time = input.startTime;
  if (input.endTime !== undefined) metadata.end_time = input.endTime;
  if (input.maxSessionMinutes !== undefined) metadata.max_session_minutes = input.maxSessionMinutes;
  return metadata;
}

function toBackendDate(isoDate: string | undefined): string {
  if (!isoDate) {
    return new Date().toISOString().slice(0, 10);
  }
  return isoDate.slice(0, 10);
}

function toFrontendDate(dateValue: string): string {
  if (dateValue.includes("T")) {
    return dateValue;
  }
  return `${dateValue}T00:00:00.000Z`;
}