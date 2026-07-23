"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { dayLabels } from "@/lib/constants/weekday";
import type { PlanItem } from "@/lib/types";

export function EditPlanItemDialog({
  item,
  open,
  onOpenChange,
  onSubmit,
}: {
  item: PlanItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (startTime: string, endTime: string) => Promise<void>;
}) {
  const [startTime, setStartTime] = useState(item?.startTime ?? "");
  const [endTime, setEndTime] = useState(item?.endTime ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!startTime || !endTime) {
      setError("Completá ambos horarios.");
      return;
    }
    if (endTime <= startTime) {
      setError("La hora de fin debe ser posterior a la hora de inicio.");
      return;
    }

    setError(null);
    setIsSubmitting(true);
    try {
      await onSubmit(startTime, endTime);
      toast.success("Bloque actualizado.");
      onOpenChange(false);
    } catch {
      toast.error("No se pudo guardar el bloque. Intentá de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>Editar bloque</DialogTitle>
            <DialogDescription>
              {item
                ? `${item.taskTitle} · ${dayLabels[item.day]}`
                : "Ajustá el horario de este bloque."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="plan-item-start">Hora de inicio</Label>
              <Input
                id="plan-item-start"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                aria-invalid={Boolean(error)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="plan-item-end">Hora de fin</Label>
              <Input
                id="plan-item-end"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                aria-invalid={Boolean(error)}
              />
            </div>
          </div>
          {error && <p className="text-xs text-destructive">{error}</p>}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              Guardar cambios
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
