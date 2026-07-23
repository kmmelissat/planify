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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { dayLabels, weekdayOrder } from "@/lib/constants/weekday";
import { WeekdayMultiSelect } from "@/components/availability/weekday-multi-select";
import type { AvailabilityBlock, AvailabilityBlockInput, Weekday } from "@/lib/types";

interface FormValues {
  days: Weekday[];
  startTime: string;
  endTime: string;
  label: string;
}

const emptyValues: FormValues = {
  days: ["lunes"],
  startTime: "",
  endTime: "",
  label: "",
};

function toFormValues(block: AvailabilityBlock): FormValues {
  return {
    days: [block.day],
    startTime: block.startTime,
    endTime: block.endTime,
    label: block.label ?? "",
  };
}

type FormErrors = Partial<Record<"days" | "startTime" | "endTime", string>>;

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  if (values.days.length === 0) errors.days = "Elegí al menos un día.";
  if (!values.startTime) errors.startTime = "La hora de inicio es obligatoria.";
  if (!values.endTime) errors.endTime = "La hora de fin es obligatoria.";
  if (values.startTime && values.endTime && values.endTime <= values.startTime) {
    errors.endTime = "La hora de fin debe ser posterior a la de inicio.";
  }
  return errors;
}

export function AvailabilityBlockFormDialog({
  open,
  onOpenChange,
  block,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  block?: AvailabilityBlock | null;
  onSubmit: (input: AvailabilityBlockInput) => Promise<void>;
}) {
  const isEditing = Boolean(block);
  const [values, setValues] = useState<FormValues>(() =>
    block ? toFormValues(block) : emptyValues,
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function setField<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      for (const day of values.days) {
        await onSubmit({
          day,
          startTime: values.startTime,
          endTime: values.endTime,
          label: values.label.trim() || undefined,
        });
      }
      toast.success(
        isEditing
          ? "Bloque actualizado."
          : values.days.length > 1
            ? `${values.days.length} bloques creados.`
            : "Bloque creado.",
      );
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
            <DialogTitle>
              {isEditing ? "Editar bloque" : "Nuevo bloque de disponibilidad"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Actualizá el día u horario de este bloque."
                : "Declará un rango de tiempo libre para un día de la semana."}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-1.5">
            <Label>Día</Label>
            {isEditing ? (
              <Select
                value={values.days[0]}
                onValueChange={(value) => setField("days", [value as Weekday])}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {weekdayOrder.map((day) => (
                    <SelectItem key={day} value={day}>
                      {dayLabels[day]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <>
                <WeekdayMultiSelect
                  value={values.days}
                  onChange={(days) => setField("days", days)}
                />
                <p className="text-xs text-muted-foreground">
                  Elegí varios días para crear el mismo bloque en cada uno.
                </p>
                {errors.days && (
                  <p className="text-xs text-destructive">{errors.days}</p>
                )}
              </>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="block-start">Hora inicio</Label>
              <Input
                id="block-start"
                type="time"
                value={values.startTime}
                onChange={(e) => setField("startTime", e.target.value)}
                aria-invalid={Boolean(errors.startTime)}
              />
              {errors.startTime && (
                <p className="text-xs text-destructive">{errors.startTime}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="block-end">Hora fin</Label>
              <Input
                id="block-end"
                type="time"
                value={values.endTime}
                onChange={(e) => setField("endTime", e.target.value)}
                aria-invalid={Boolean(errors.endTime)}
              />
              {errors.endTime && (
                <p className="text-xs text-destructive">{errors.endTime}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="block-label">Etiqueta (opcional)</Label>
            <Input
              id="block-label"
              value={values.label}
              onChange={(e) => setField("label", e.target.value)}
              placeholder="Ej. Bloque largo de estudio"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isEditing ? "Guardar cambios" : "Crear bloque"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
