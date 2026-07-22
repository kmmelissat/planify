import type { PlanGenerationRequest, PlanGenerationResult } from "@/lib/ai/types";
import type { PlanItem, TaskPriority, Weekday } from "@/lib/types";
import { requestJson } from "@/lib/services/http/client";
import { fromBackendPlanResponse } from "@/lib/services/http/mappers";
import type { BackendPlanResponse } from "@/lib/services/http/types";

/**
 * ⚠️ Punto de integración con IA generativa.
 *
 * La lógica real de generación de planes la construye el equipo de backend
 * (llamada al modelo generativo, orquestación, etc.). Esta función es un
 * placeholder que devuelve una respuesta simulada con el mismo shape que
 * tendrá la respuesta real, para que el resto del frontend (UI de revisión,
 * aprobación, historial) se pueda construir y probar hoy.
 *
 * Cuando exista el endpoint real, este es el único archivo que debería
 * cambiar: reemplazar el cuerpo por un fetch/axios al backend, manteniendo
 * la firma `PlanGenerationRequest -> Promise<PlanGenerationResult>`.
 */
function buildLocalPlan(request: PlanGenerationRequest): PlanGenerationResult {
  const weekdayOrder: Weekday[] = [
    "lunes",
    "martes",
    "miercoles",
    "jueves",
    "viernes",
    "sabado",
    "domingo",
  ];

  const priorityRank: Record<TaskPriority, number> = {
    urgente: 0,
    alta: 1,
    media: 2,
    baja: 3,
  };

  const pendingTasks = request.tasks
    .filter((task) => task.status !== "completada")
    .sort((a, b) => {
      const byPriority = priorityRank[a.priority] - priorityRank[b.priority];
      if (byPriority !== 0) return byPriority;
      return (a.dueDate ?? "").localeCompare(b.dueDate ?? "");
    });

  const availableBlocks = [...request.availabilityBlocks].sort((a, b) => {
    const dayIndexA = weekdayOrder.indexOf(a.day);
    const dayIndexB = weekdayOrder.indexOf(b.day);
    return dayIndexA - dayIndexB || a.startTime.localeCompare(b.startTime);
  });

  const items: PlanItem[] = pendingTasks.map((task, index) => {
    const block = availableBlocks[index % availableBlocks.length] ?? availableBlocks[0];
    const day = block?.day ?? "lunes";
    const startTime = block?.startTime ?? "09:00";
    const endTime = block?.endTime ?? "10:00";
    const durationMinutes = Math.min(task.estimatedEffortMinutes, 120);
    const endHour = Math.min(23, Number(startTime.split(":")[0]) + 1);

    return {
      id: `plan-item-${task.id}`,
      taskId: task.id,
      taskTitle: task.title,
      priority: task.priority,
      day,
      startTime,
      endTime: `${String(endHour).padStart(2, "0")}:00`,
      status: "programada",
      justification: `Se prioriza esta tarea por ${task.priority === "urgente" ? "alta urgencia" : "su orden de prioridad"} y se ubica en el primer bloque libre disponible.`,
    };
  });

  const conflicts = [] as Array<{
    id: string;
    type: "sobrecarga" | "fecha_en_riesgo" | "informacion_insuficiente" | "choque_horario";
    severity: "info" | "advertencia" | "critico";
    message: string;
    relatedTaskIds: string[];
  }>;

  if (pendingTasks.length === 0) {
    conflicts.push({
      id: "conflict-empty",
      type: "informacion_insuficiente",
      severity: "info",
      message: "No hay tareas pendientes para asignar en el plan.",
      relatedTaskIds: [],
    });
  }

  if (request.availabilityBlocks.length === 0) {
    conflicts.push({
      id: "conflict-availability",
      type: "informacion_insuficiente",
      severity: "advertencia",
      message: "No se encontraron bloques de disponibilidad para ubicar el plan.",
      relatedTaskIds: pendingTasks.map((task) => task.id),
    });
  }

  return {
    id: request.previousPlan?.id ?? "plan-local-1",
    version: request.previousPlan?.version ? request.previousPlan.version + 1 : 1,
    generatedAt: new Date().toISOString(),
    approvalStatus: "propuesto",
    scope: request.scope,
    overallJustification:
      request.userNote && request.userNote.trim()
        ? `Se ajustó la propuesta según tu nota: ${request.userNote.trim()}`
        : "Se priorizaron las tareas con mayor urgencia y menor margen de entrega, respetando los bloques disponibles y las restricciones declaradas.",
    items,
    conflicts,
    promptUsed:
      request.userNote && request.userNote.trim()
        ? `Plan generado con nota: ${request.userNote.trim()}`
        : "Genera un plan semanal a partir de mis tareas pendientes, disponibilidad y restricciones registradas.",
    viabilidad: conflicts.length === 0 ? "viable" : "viable_con_ajustes",
    validationCode: conflicts.length === 0 ? null : "ERR-IA-004",
    estadoRevision: conflicts.length === 0 ? "normal" : "requiere_revision",
    responseStatus: "valid",
  };
}

export async function generatePlanProposal(
  request: PlanGenerationRequest,
): Promise<PlanGenerationResult> {
  try {
    const changeBlock = request.previousPlan
      ? {
          entity: "plan",
          operation: "replan",
          previous_plan_id: request.previousPlan.id,
          previous_version: request.previousPlan.version,
        }
      : null;

    const response = await requestJson<BackendPlanResponse>("/ai/plans/generate", {
      method: "POST",
      body: JSON.stringify({
        scope: request.scope,
        user_note: request.userNote,
        change_block: changeBlock,
      }),
    });

    return fromBackendPlanResponse(response);
  } catch {
    return buildLocalPlan(request);
  }
}
