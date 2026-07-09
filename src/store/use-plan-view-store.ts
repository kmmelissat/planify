import { create } from "zustand";

export type PlanViewMode = "calendario" | "kanban" | "tabla";

interface PlanViewStoreState {
  viewMode: PlanViewMode;
  setViewMode: (mode: PlanViewMode) => void;
}

/**
 * Solo controla qué visualización está activa. Las tres vistas leen del
 * mismo `currentPlan` en `usePlanStore`, así que alternar entre ellas nunca
 * pierde datos.
 */
export const usePlanViewStore = create<PlanViewStoreState>((set) => ({
  viewMode: "calendario",
  setViewMode: (viewMode) => set({ viewMode }),
}));
