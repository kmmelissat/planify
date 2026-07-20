import { usePlanStore } from "@/store/use-plan-store";

export async function refreshPlanState(): Promise<void> {
  const { fetchCurrentPlan, fetchHistory } = usePlanStore.getState();
  await Promise.all([fetchCurrentPlan(), fetchHistory()]);
}