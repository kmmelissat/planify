import type { PlanGenerado } from "@/lib/types";
import type { PlanRepository } from "@/lib/services/interfaces";
import { requestJson } from "@/lib/services/http/client";
import { fromBackendPlanResponse, toBackendApprovalUpdate, toBackendPlanUpdate } from "@/lib/services/http/mappers";
import type { BackendPlanResponse } from "@/lib/services/http/types";

export class HttpPlanRepository implements PlanRepository {
  async list(): Promise<PlanGenerado[]> {
    const plans = await requestJson<BackendPlanResponse[]>("/plans/");
    return plans.map((plan) => fromBackendPlanResponse(plan));
  }

  async getById(id: string): Promise<PlanGenerado | null> {
    try {
      const plan = await requestJson<BackendPlanResponse>(`/plans/${id}`);
      return fromBackendPlanResponse(plan);
    } catch {
      return null;
    }
  }

  async getLatest(): Promise<PlanGenerado | null> {
    try {
      const plan = await requestJson<BackendPlanResponse>("/plans/latest");
      return fromBackendPlanResponse(plan);
    } catch {
      return null;
    }
  }

  async save(plan: PlanGenerado): Promise<PlanGenerado> {
    const updated = await requestJson<BackendPlanResponse>(`/plans/${plan.id}`, {
      method: "PATCH",
      body: JSON.stringify(toBackendPlanUpdate(plan.items)),
    });
    return fromBackendPlanResponse(updated);
  }

  async updateApprovalStatus(
    id: string,
    status: PlanGenerado["approvalStatus"],
    userNote?: string,
  ): Promise<PlanGenerado> {
    const updated = await requestJson<BackendPlanResponse>(`/plans/${id}/approval`, {
      method: "PATCH",
      body: JSON.stringify(toBackendApprovalUpdate(status, userNote)),
    });
    return fromBackendPlanResponse(updated);
  }
}