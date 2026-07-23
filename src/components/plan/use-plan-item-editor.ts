"use client";

import { useState } from "react";
import { usePlanStore } from "@/store/use-plan-store";
import type { PlanItem, Weekday } from "@/lib/types";

/** Estado y guardado compartidos por las 3 vistas del plan (tabla, calendario, kanban). */
export function usePlanItemEditor(items: PlanItem[]) {
  const { updatePlanItems } = usePlanStore();
  const [editingItem, setEditingItem] = useState<PlanItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  function openEditDialog(item: PlanItem) {
    setEditingItem(item);
    setIsDialogOpen(true);
  }

  async function handleSaveBlock(day: Weekday, startTime: string, endTime: string) {
    if (!editingItem) return;
    const updatedItems = items.map((item) =>
      item.id === editingItem.id ? { ...item, day, startTime, endTime } : item,
    );
    await updatePlanItems(updatedItems);
  }

  return {
    editingItem,
    isDialogOpen,
    setIsDialogOpen,
    openEditDialog,
    handleSaveBlock,
  };
}
