import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { TaskPriority, TaskStatus } from "@/lib/types";

const priorityStyles: Record<TaskPriority, string> = {
  urgente: "bg-red-600 text-white hover:bg-red-600",
  alta: "bg-orange-500 text-white hover:bg-orange-500",
  media: "bg-amber-400 text-black hover:bg-amber-400",
  baja: "bg-slate-300 text-slate-900 hover:bg-slate-300",
};

const priorityLabels: Record<TaskPriority, string> = {
  urgente: "Urgente",
  alta: "Alta",
  media: "Media",
  baja: "Baja",
};

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  return (
    <Badge className={cn(priorityStyles[priority])}>
      {priorityLabels[priority]}
    </Badge>
  );
}

const statusStyles: Record<TaskStatus, string> = {
  pendiente: "bg-slate-200 text-slate-900 hover:bg-slate-200",
  en_progreso: "bg-blue-500 text-white hover:bg-blue-500",
  completada: "bg-emerald-600 text-white hover:bg-emerald-600",
  atrasada: "bg-red-600 text-white hover:bg-red-600",
  reprogramada: "bg-purple-500 text-white hover:bg-purple-500",
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
    <Badge variant="outline" className={cn(statusStyles[status], "border-0")}>
      {statusLabels[status]}
    </Badge>
  );
}
