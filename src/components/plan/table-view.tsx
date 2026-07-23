"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import type { PlanItem } from "@/lib/types";
import { PriorityBadge, priorityAccentClass } from "@/components/tasks/badges";
import { dayLabels } from "@/lib/constants/weekday";
import { cn } from "@/lib/utils";
import { usePlanStore } from "@/store/use-plan-store";
import { Button } from "@/components/ui/button";
import { EditPlanItemDialog } from "@/components/plan/edit-plan-item-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const priorityWeight: Record<PlanItem["priority"], number> = {
  urgente: 4,
  alta: 3,
  media: 2,
  baja: 1,
};

export function TableView({ items }: { items: PlanItem[] }) {
  const { updatePlanItems } = usePlanStore();
  const [editingItem, setEditingItem] = useState<PlanItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const sorted = [...items].sort(
    (a, b) => priorityWeight[b.priority] - priorityWeight[a.priority],
  );

  function openEditDialog(item: PlanItem) {
    setEditingItem(item);
    setIsDialogOpen(true);
  }

  async function handleSaveBlock(startTime: string, endTime: string) {
    if (!editingItem) return;
    const updatedItems = items.map((item) =>
      item.id === editingItem.id ? { ...item, startTime, endTime } : item,
    );
    await updatePlanItems(updatedItems);
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="pl-6">Tarea</TableHead>
            <TableHead>Prioridad</TableHead>
            <TableHead>Día</TableHead>
            <TableHead>Horario</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="pr-6 text-right">Acción</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                No hay bloques en el plan actual.
              </TableCell>
            </TableRow>
          )}
          {sorted.map((item) => (
            <TableRow key={item.id} className={cn(priorityAccentClass(item.priority))}>
              <TableCell className="py-4 pl-5.25 font-medium">
                {item.taskTitle}
              </TableCell>
              <TableCell>
                <PriorityBadge priority={item.priority} />
              </TableCell>
              <TableCell className="text-muted-foreground">
                {dayLabels[item.day]}
              </TableCell>
              <TableCell className="text-xs text-muted-foreground tabular-nums">
                {item.startTime} – {item.endTime}
              </TableCell>
              <TableCell className="capitalize text-muted-foreground">
                {item.status.replace(/_/g, " ")}
              </TableCell>
              <TableCell className="pr-6 text-right">
                <Button
                  size="sm"
                  variant="ghost"
                  className="gap-1.5 text-muted-foreground"
                  onClick={() => openEditDialog(item)}
                >
                  <Pencil className="size-3.5" /> Editar bloque
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <EditPlanItemDialog
        key={editingItem?.id}
        item={editingItem}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleSaveBlock}
      />
    </>
  );
}
