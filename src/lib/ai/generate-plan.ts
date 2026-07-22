import type { PlanGenerationRequest, PlanGenerationResult } from "@/lib/ai/types";
import { requestJson } from "@/lib/services/http/client";
import { fromBackendPlanResponse } from "@/lib/services/http/mappers";
import type { BackendPlanResponse } from "@/lib/services/http/types";

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

  return fromBackendPlanResponse(response);
}
