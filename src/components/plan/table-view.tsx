"use client";

import { Pencil } from "lucide-react";
import type { PlanItem } from "@/lib/types";
import { PriorityBadge, priorityAccentClass } from "@/components/tasks/badges";
import { dayLabels } from "@/lib/constants/weekday";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { EditPlanItemDialog } from "@/components/plan/edit-plan-item-dialog";
import { usePlanItemEditor } from "@/components/plan/use-plan-item-editor";
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
  const editor = usePlanItemEditor(items);

  const sorted = [...items].sort(
    (a, b) => priorityWeight[b.priority] - priorityWeight[a.priority],
  );

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
                  onClick={() => editor.openEditDialog(item)}
                >
                  <Pencil className="size-3.5" /> Editar bloque
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <EditPlanItemDialog
        key={editor.editingItem?.id}
        item={editor.editingItem}
        open={editor.isDialogOpen}
        onOpenChange={editor.setIsDialogOpen}
        onSubmit={editor.handleSaveBlock}
      />
    </>
  );
}
