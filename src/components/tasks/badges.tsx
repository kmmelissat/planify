import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { TaskPriority, TaskStatus } from "@/lib/types";

const priorityLabels: Record<TaskPriority, string> = {
  urgente: "Urgente",
  alta: "Alta",
  media: "Media",
  baja: "Baja",
};

const priorityDotClass: Record<TaskPriority, string> = {
  urgente: "bg-priority-urgente",
  alta: "bg-priority-alta",
  media: "bg-priority-media",
  baja: "bg-priority-baja",
};

/** Marca de prioridad de firma: punto de color + etiqueta, sin píldora sólida. */
export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground">
      <span
        className={cn("size-1.75 shrink-0 rounded-full", priorityDotClass[priority])}
        aria-hidden
      />
      {priorityLabels[priority]}
    </span>
  );
}

/** Clase de borde izquierdo para usar en cards/filas: refuerza la prioridad sin repetir el punto. */
const priorityBorderClass: Record<TaskPriority, string> = {
  urgente: "border-l-priority-urgente",
  alta: "border-l-priority-alta",
  media: "border-l-priority-media",
  baja: "border-l-priority-baja",
};

export function priorityAccentClass(priority: TaskPriority): string {
  return cn("border-l-[3px]", priorityBorderClass[priority]);
}

const statusStyles: Record<TaskStatus, string> = {
  pendiente: "bg-status-pendiente/15 text-status-pendiente",
  en_progreso: "bg-status-progreso/12 text-status-progreso",
  completada: "bg-status-completada/12 text-status-completada",
  atrasada: "bg-status-atrasada/12 text-status-atrasada",
  reprogramada: "bg-status-reprogramada/12 text-status-reprogramada",
};

const statusLabels: Record<TaskStatus, string> = {
  pendiente: "Pendiente",
  en_progreso: "En progreso",
  completada: "Completada",
  atrasada: "Atrasada",
  reprogramada: "Reprogramada",
};

export function StatusBadge({ status }: { status: TaskStatus }) {
  return (
    <Badge
      variant="outline"
      className={cn(statusStyles[status], "border-0 font-medium")}
    >
      {statusLabels[status]}
    </Badge>
  );
}
