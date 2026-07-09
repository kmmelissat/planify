import type { PlanGenerationRequest, PlanGenerationResult } from "@/lib/ai/types";

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
  await simulatedDelay();

  return {
    scope: request.scope,
    overallJustification:
      "Justificación simulada: esta respuesta será provista por el backend cuando el motor de IA generativa esté conectado.",
    items: [],
    conflicts: [],
    promptUsed: `[MOCK] Generar plan ${request.scope} a partir de ${request.tasks.length} tarea(s), ${request.availabilityBlocks.length} bloque(s) de disponibilidad y ${request.constraints.length} restricción(es).`,
  };
}

function simulatedDelay(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 400));
}
