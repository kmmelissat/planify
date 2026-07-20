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
import { ApiError, getApiErrorMessage } from "@/lib/services/api-error";
import { refreshPlanState } from "@/lib/services/refresh-plan";

interface PlanStoreState {
  currentPlan: PlanGenerado | null;
  plans: PlanGenerado[];
  history: HistorialEntry[];
  isGenerating: boolean;
  error: { code?: string; message: string } | null;

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
        id: result.id,
        version: result.version,
        generatedAt: result.generatedAt,
        approvalStatus: result.approvalStatus,
        ...result,
      };

      set({ currentPlan: plan });
      await refreshPlanState();
    } catch (error) {
      set({
        error: {
          message: getApiErrorMessage(error),
          code: error instanceof ApiError ? error.code : undefined,
        },
      });
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
      userNote,
    );
    set({ currentPlan: updated });
    await refreshPlanState();
  },

  updatePlanItems: async (items) => {
    const current = get().currentPlan;
    if (!current) return;

    const updated: PlanGenerado = {
      ...current,
      items,
      approvalStatus: "editado",
    };
    const saved = await getPlanRepository().save(updated);
    set({ currentPlan: saved });
    await refreshPlanState();
  },
}));
