import { create } from "zustand";
import type { HistorialEntry, PlanApprovalStatus, PlanGenerado, PlanItem } from "@/lib/types";
import {
  getAvailabilityRepository,
  getConstraintRepository,
  getHistoryRepository,
  getPlanRepository,
  getTaskRepository,
} from "@/lib/services";
import { generatePlanProposal } from "@/lib/ai/generate-plan";
import { generateId } from "@/lib/utils";

interface PlanStoreState {
  currentPlan: PlanGenerado | null;
  plans: PlanGenerado[];
  history: HistorialEntry[];
  isGenerating: boolean;
  error: string | null;

  fetchCurrentPlan: () => Promise<void>;
  fetchHistory: () => Promise<void>;
  /** Dispara una nueva propuesta de plan (generación inicial, replanificación o "nueva versión"). */
  generateNewPlan: (userNote?: string) => Promise<void>;
  setApprovalStatus: (
    status: PlanApprovalStatus,
    userNote?: string,
  ) => Promise<void>;
  updatePlanItems: (items: PlanItem[]) => Promise<void>;
}

export const usePlanStore = create<PlanStoreState>((set, get) => ({
  currentPlan: null,
  plans: [],
  history: [],
  isGenerating: false,
  error: null,

  fetchCurrentPlan: async () => {
    const [currentPlan, plans] = await Promise.all([
      getPlanRepository().getLatest(),
      getPlanRepository().list(),
    ]);
    set({ currentPlan, plans });
  },

  fetchHistory: async () => {
    const history = await getHistoryRepository().list();
    set({ history });
  },

  generateNewPlan: async (userNote) => {
    set({ isGenerating: true, error: null });
    try {
      const previousPlan = get().currentPlan ?? undefined;
      const [tasks, availabilityBlocks, constraints] = await Promise.all([
        getTaskRepository().list(),
        getAvailabilityRepository().listBlocks(),
        getConstraintRepository().list(),
      ]);

      const result = await generatePlanProposal({
        scope: previousPlan?.scope ?? "semanal",
        tasks,
        availabilityBlocks,
        constraints,
        previousPlan,
        userNote,
      });

      const plan: PlanGenerado = {
        id: generateId("plan"),
        version: (previousPlan?.version ?? 0) + 1,
        generatedAt: new Date().toISOString(),
        approvalStatus: "propuesto",
        ...result,
      };

      await getPlanRepository().save(plan);
      await getHistoryRepository().append({
        id: generateId("hist"),
        planId: plan.id,
        version: plan.version,
        scope: plan.scope,
        action: previousPlan ? "replanificado" : "generado",
        approvalStatus: plan.approvalStatus,
        promptUsed: plan.promptUsed,
        createdAt: plan.generatedAt,
        userNote,
      });

      await Promise.all([get().fetchCurrentPlan(), get().fetchHistory()]);
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isGenerating: false });
    }
  },

  setApprovalStatus: async (status, userNote) => {
    const current = get().currentPlan;
    if (!current) return;

    const updated = await getPlanRepository().updateApprovalStatus(
      current.id,
      status,
    );

    const actionByStatus: Record<PlanApprovalStatus, HistorialEntry["action"]> = {
      propuesto: "generado",
      aprobado: "aprobado",
      editado: "editado",
      rechazado: "rechazado",
    };

    await getHistoryRepository().append({
      id: generateId("hist"),
      planId: updated.id,
      version: updated.version,
      scope: updated.scope,
      action: actionByStatus[status],
      approvalStatus: status,
      promptUsed: updated.promptUsed,
      createdAt: new Date().toISOString(),
      userNote,
    });

    await Promise.all([get().fetchCurrentPlan(), get().fetchHistory()]);
  },

  updatePlanItems: async (items) => {
    const current = get().currentPlan;
    if (!current) return;

    const updated: PlanGenerado = {
      ...current,
      items,
      approvalStatus: "editado",
    };
    await getPlanRepository().save(updated);
    await getHistoryRepository().append({
      id: generateId("hist"),
      planId: updated.id,
      version: updated.version,
      scope: updated.scope,
      action: "editado",
      approvalStatus: "editado",
      promptUsed: updated.promptUsed,
      createdAt: new Date().toISOString(),
      userNote: "Edición manual de bloques del plan.",
    });

    await Promise.all([get().fetchCurrentPlan(), get().fetchHistory()]);
  },
}));
