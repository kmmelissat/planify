import type { PlanGenerado } from "@/lib/types";
import type { PlanRepository } from "@/lib/services/interfaces";
import { seedPlans } from "@/lib/services/mock/seed-data";
import { networkDelay } from "@/lib/services/mock/utils";

export class MockPlanRepository implements PlanRepository {
  private plans: PlanGenerado[] = [...seedPlans];

  async list(): Promise<PlanGenerado[]> {
    await networkDelay();
    return [...this.plans].sort((a, b) => b.version - a.version);
  }

  async getById(id: string): Promise<PlanGenerado | null> {
    await networkDelay();
    return this.plans.find((plan) => plan.id === id) ?? null;
  }

  async getLatest(): Promise<PlanGenerado | null> {
    await networkDelay();
    if (this.plans.length === 0) return null;
    return [...this.plans].sort((a, b) => b.version - a.version)[0];
  }

  async save(plan: PlanGenerado): Promise<PlanGenerado> {
    await networkDelay();
    const index = this.plans.findIndex((existing) => existing.id === plan.id);
    if (index === -1) {
      this.plans.push(plan);
    } else {
      this.plans[index] = plan;
    }
    return plan;
  }

  async updateApprovalStatus(
    id: string,
    status: PlanGenerado["approvalStatus"],
  ): Promise<PlanGenerado> {
    await networkDelay();
    const index = this.plans.findIndex((plan) => plan.id === id);
    if (index === -1) {
      throw new Error(`Plan no encontrado: ${id}`);
    }
    const updated = { ...this.plans[index], approvalStatus: status };
    this.plans[index] = updated;
    return updated;
  }
}
