"use client";

import { useEffect, useState, type FormEvent } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { dayLabels, weekdayOrder } from "@/lib/constants/weekday";
import { WeekdayMultiSelect } from "@/components/availability/weekday-multi-select";
import { useTaskStore } from "@/store/use-task-store";
import type {
  Constraint,
  ConstraintInput,
  ConstraintType,
  Task,
  Weekday,
} from "@/lib/types";

export const constraintTypeLabels: Record<ConstraintType, string> = {
  horario_ocupado: "Horario ocupado",
  tarea_fija: "Tarea fija",
  tiempo_maximo_sesion: "Tiempo máximo por sesión",
  otro: "Otro",
};

const constraintTypeOrder: ConstraintType[] = [
  "horario_ocupado",
  "tarea_fija",
  "tiempo_maximo_sesion",
  "otro",
];

function needsSchedule(type: ConstraintType): boolean {
  return type === "horario_ocupado" || type === "tarea_fija";
}

function needsMaxSession(type: ConstraintType): boolean {
  return type === "tiempo_maximo_sesion";
}

interface FormValues {
  type: ConstraintType;
  description: string;
  taskId: string;
  days: Weekday[];
  startTime: string;
  endTime: string;
  maxSessionMinutes: string;
}

const emptyValues: FormValues = {
  type: "horario_ocupado",
  description: "",
  taskId: "",
  days: ["lunes"],
  startTime: "",
  endTime: "",
  maxSessionMinutes: "",
};

function toFormValues(constraint: Constraint): FormValues {
  return {
    type: constraint.type,
    description: constraint.description,
    taskId: constraint.taskId ?? "",
    days: [constraint.day ?? "lunes"],
    startTime: constraint.startTime ?? "",
    endTime: constraint.endTime ?? "",
    maxSessionMinutes:
      constraint.maxSessionMinutes != null
        ? String(constraint.maxSessionMinutes)
        : "",
  };
}

type FormErrors = Partial<
  Record<
    "description" | "taskId" | "days" | "startTime" | "endTime" | "maxSessionMinutes",
    string
  >
>;

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  if (!values.description.trim()) {
    errors.description = "La descripción es obligatoria.";
  }

  if (values.type === "tarea_fija" && !values.taskId) {
    errors.taskId = "Seleccioná una tarea.";
  }

  if (needsSchedule(values.type)) {
    if (values.days.length === 0) errors.days = "Elegí al menos un día.";
    if (!values.startTime) errors.startTime = "La hora de inicio es obligatoria.";
    if (!values.endTime) errors.endTime = "La hora de fin es obligatoria.";
    if (
      values.startTime &&
      values.endTime &&
      values.endTime <= values.startTime
    ) {
      errors.endTime = "La hora de fin debe ser posterior a la de inicio.";
    }
  }

  if (needsMaxSession(values.type)) {
    const minutes = Number(values.maxSessionMinutes);
    if (!values.maxSessionMinutes || !Number.isFinite(minutes) || minutes <= 0) {
      errors.maxSessionMinutes = "Ingresá un máximo de minutos válido.";
    }
  }

  return errors;
}

export function ConstraintFormDialog({
  open,
  onOpenChange,
  constraint,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  constraint?: Constraint | null;
  onSubmit: (input: ConstraintInput) => Promise<void>;
}) {
  const isEditing = Boolean(constraint);
  const { tasks, fetchTasks } = useTaskStore();
  const [values, setValues] = useState<FormValues>(() =>
    constraint ? toFormValues(constraint) : emptyValues,
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open && tasks.length === 0) {
      void fetchTasks();
    }
  }, [open, tasks.length, fetchTasks]);

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
      const scheduled = needsSchedule(values.type);
      const days = scheduled ? values.days : [undefined];

      for (const day of days) {
        const input: ConstraintInput = {
          type: values.type,
          description: values.description.trim(),
          taskId: values.type === "tarea_fija" ? values.taskId : undefined,
          day,
          startTime: scheduled ? values.startTime : undefined,
          endTime: scheduled ? values.endTime : undefined,
          maxSessionMinutes: needsMaxSession(values.type)
            ? Number(values.maxSessionMinutes)
            : undefined,
        };
        await onSubmit(input);
      }

      toast.success(
        isEditing
          ? "Restricción actualizada."
          : days.length > 1
            ? `${days.length} restricciones creadas.`
            : "Restricción creada.",
      );
      onOpenChange(false);
    } catch {
      toast.error("No se pudo guardar la restricción. Intentá de nuevo.");
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
              {isEditing ? "Editar restricción" : "Nueva restricción"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Actualizá los datos de esta restricción."
                : "Registrá un horario ocupado, una tarea fija o un límite de sesión."}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-1.5">
            <Label>Tipo</Label>
            <Select
              value={values.type}
              onValueChange={(value) => setField("type", value as ConstraintType)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {constraintTypeOrder.map((type) => (
                  <SelectItem key={type} value={type}>
                    {constraintTypeLabels[type]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {values.type === "tarea_fija" && (
            <div className="flex flex-col gap-1.5">
              <Label>Tarea</Label>
              <Select
                value={values.taskId}
                onValueChange={(value) => setField("taskId", value ?? "")}
              >
                <SelectTrigger className="w-full" aria-invalid={Boolean(errors.taskId)}>
                  <SelectValue placeholder="Seleccioná una tarea" />
                </SelectTrigger>
                <SelectContent>
                  {tasks.map((task: Task) => (
                    <SelectItem key={task.id} value={task.id}>
                      {task.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.taskId && (
                <p className="text-xs text-destructive">{errors.taskId}</p>
              )}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="constraint-description">Descripción</Label>
            <Textarea
              id="constraint-description"
              value={values.description}
              onChange={(e) => setField("description", e.target.value)}
              aria-invalid={Boolean(errors.description)}
            />
            {errors.description && (
              <p className="text-xs text-destructive">{errors.description}</p>
            )}
          </div>

          {needsSchedule(values.type) && (
            <>
              <div className="flex flex-col gap-1.5">
                <Label>Día</Label>
                {isEditing ? (
                  <Select
                    value={values.days[0]}
                    onValueChange={(value) =>
                      setField("days", [value as Weekday])
                    }
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
                      Elegí varios días para repetir esta restricción en cada
                      uno.
                    </p>
                    {errors.days && (
                      <p className="text-xs text-destructive">
                        {errors.days}
                      </p>
                    )}
                  </>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="constraint-start">Hora inicio</Label>
                  <Input
                    id="constraint-start"
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
                  <Label htmlFor="constraint-end">Hora fin</Label>
                  <Input
                    id="constraint-end"
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
            </>
          )}

          {needsMaxSession(values.type) && (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="constraint-max-session">
                Minutos máximos por sesión
              </Label>
              <Input
                id="constraint-max-session"
                type="number"
                min={1}
                value={values.maxSessionMinutes}
                onChange={(e) => setField("maxSessionMinutes", e.target.value)}
                aria-invalid={Boolean(errors.maxSessionMinutes)}
              />
              {errors.maxSessionMinutes && (
                <p className="text-xs text-destructive">
                  {errors.maxSessionMinutes}
                </p>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isEditing ? "Guardar cambios" : "Crear restricción"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}