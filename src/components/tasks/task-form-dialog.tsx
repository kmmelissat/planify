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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  categoryLabels,
  priorityLabels,
  statusLabels,
} from "@/components/tasks/badges";
import type {
  Task,
  TaskCategory,
  TaskInput,
  TaskPriority,
  TaskStatus,
} from "@/lib/types";

interface FormValues {
  title: string;
  description: string;
  category: TaskCategory;
  dueDate: string;
  priority: TaskPriority;
  estimatedEffortMinutes: string;
  status: TaskStatus;
}

const emptyValues: FormValues = {
  title: "",
  description: "",
  category: "academico",
  dueDate: "",
  priority: "media",
  estimatedEffortMinutes: "",
  status: "pendiente",
};

function toFormValues(task: Task): FormValues {
  return {
    title: task.title,
    description: task.description,
    category: task.category,
    dueDate: task.dueDate ? task.dueDate.slice(0, 10) : "",
    priority: task.priority,
    estimatedEffortMinutes: String(task.estimatedEffortMinutes),
    status: task.status,
  };
}

type FormErrors = Partial<Record<keyof FormValues, string>>;

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  if (!values.title.trim()) errors.title = "El título es obligatorio.";
  if (!values.description.trim())
    errors.description = "La descripción es obligatoria.";

  const effort = Number(values.estimatedEffortMinutes);
  if (
    !values.estimatedEffortMinutes ||
    !Number.isFinite(effort) ||
    effort <= 0
  ) {
    errors.estimatedEffortMinutes =
      "Ingresá un esfuerzo estimado válido, en minutos.";
  }

  return errors;
}

export function TaskFormDialog({
  open,
  onOpenChange,
  task,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task | null;
  onSubmit: (input: TaskInput) => Promise<void>;
}) {
  const isEditing = Boolean(task);
  const [values, setValues] = useState<FormValues>(() =>
    task ? toFormValues(task) : emptyValues,
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
      const input: TaskInput = {
        title: values.title.trim(),
        description: values.description.trim(),
        category: values.category,
        dueDate: values.dueDate
          ? new Date(values.dueDate).toISOString()
          : undefined,
        priority: values.priority,
        estimatedEffortMinutes: Number(values.estimatedEffortMinutes),
        status: values.status,
      };
      await onSubmit(input);
      toast.success(isEditing ? "Tarea actualizada." : "Tarea creada.");
      onOpenChange(false);
    } catch {
      toast.error("No se pudo guardar la tarea. Intentá de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Editar tarea" : "Nueva tarea"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Actualizá los datos de la tarea."
                : "Completá los datos para agregar una tarea nueva."}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="task-title">Título</Label>
            <Input
              id="task-title"
              value={values.title}
              onChange={(e) => setField("title", e.target.value)}
              aria-invalid={Boolean(errors.title)}
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="task-description">Descripción</Label>
            <Textarea
              id="task-description"
              value={values.description}
              onChange={(e) => setField("description", e.target.value)}
              aria-invalid={Boolean(errors.description)}
            />
            {errors.description && (
              <p className="text-xs text-destructive">{errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label>Categoría</Label>
              <Select
                value={values.category}
                onValueChange={(value) =>
                  setField("category", value as TaskCategory)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(categoryLabels) as TaskCategory[]).map(
                    (category) => (
                      <SelectItem key={category} value={category}>
                        {categoryLabels[category]}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>Prioridad</Label>
              <Select
                value={values.priority}
                onValueChange={(value) =>
                  setField("priority", value as TaskPriority)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(priorityLabels) as TaskPriority[]).map(
                    (priority) => (
                      <SelectItem key={priority} value={priority}>
                        {priorityLabels[priority]}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="task-due-date">Fecha límite (opcional)</Label>
              <Input
                id="task-due-date"
                type="date"
                value={values.dueDate}
                onChange={(e) => setField("dueDate", e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="task-effort">Esfuerzo (min)</Label>
              <Input
                id="task-effort"
                type="number"
                min={1}
                value={values.estimatedEffortMinutes}
                onChange={(e) =>
                  setField("estimatedEffortMinutes", e.target.value)
                }
                aria-invalid={Boolean(errors.estimatedEffortMinutes)}
              />
              {errors.estimatedEffortMinutes && (
                <p className="text-xs text-destructive">
                  {errors.estimatedEffortMinutes}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Estado</Label>
            <Select
              value={values.status}
              onValueChange={(value) =>
                setField("status", value as TaskStatus)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(statusLabels) as TaskStatus[]).map((status) => (
                  <SelectItem key={status} value={status}>
                    {statusLabels[status]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
              {isEditing ? "Guardar cambios" : "Crear tarea"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
