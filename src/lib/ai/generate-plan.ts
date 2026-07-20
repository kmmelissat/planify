import type { PlanGenerationRequest, PlanGenerationResult } from "@/lib/ai/types";
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
export async function generatePlanProposal(
  request: PlanGenerationRequest,
): Promise<PlanGenerationResult> {
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

  const mapped = fromBackendPlanResponse(response);
  return {
    scope: mapped.scope,
    overallJustification: mapped.overallJustification,
    items: mapped.items,
    conflicts: mapped.conflicts,
    promptUsed: mapped.promptUsed,
    viabilidad: mapped.viabilidad,
    validationCode: mapped.validationCode,
    estadoRevision: mapped.estadoRevision,
    responseStatus: mapped.responseStatus,
  };
}
