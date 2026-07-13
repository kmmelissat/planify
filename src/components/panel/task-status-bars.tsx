"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CardMenu } from "@/components/panel/card-menu";
import { useTaskStore } from "@/store/use-task-store";
import { cn } from "@/lib/utils";
import type { Task, TaskStatus } from "@/lib/types";

const statusOrder: TaskStatus[] = [
  "pendiente",
  "en_progreso",
  "completada",
  "atrasada",
  "reprogramada",
];

const statusLabels: Record<TaskStatus, string> = {
  pendiente: "Pendiente",
  en_progreso: "En progreso",
  completada: "Completada",
  atrasada: "Atrasada",
  reprogramada: "Reprogramada",
};

const statusDotClass: Record<TaskStatus, string> = {
  pendiente: "bg-status-pendiente",
  en_progreso: "bg-status-progreso",
  completada: "bg-status-completada",
  atrasada: "bg-status-atrasada",
  reprogramada: "bg-status-reprogramada",
};

const statusBorderClass: Record<TaskStatus, string> = {
  pendiente: "border-l-status-pendiente",
  en_progreso: "border-l-status-progreso",
  completada: "border-l-status-completada",
  atrasada: "border-l-status-atrasada",
  reprogramada: "border-l-status-reprogramada",
};

const statusTextClass: Record<TaskStatus, string> = {
  pendiente: "text-status-pendiente",
  en_progreso: "text-status-progreso",
  completada: "text-status-completada",
  atrasada: "text-status-atrasada",
  reprogramada: "text-status-reprogramada",
};

const statusTrackClass: Record<TaskStatus, string> = {
  pendiente: "bg-status-pendiente/15",
  en_progreso: "bg-status-progreso/15",
  completada: "bg-status-completada/15",
  atrasada: "bg-status-atrasada/15",
  reprogramada: "bg-status-reprogramada/15",
};

export function TaskStatusBars({ tasks }: { tasks: Task[] }) {
  const router = useRouter();
  const fetchTasks = useTaskStore((state) => state.fetchTasks);

  const counts = useMemo(() => {
    const map = new Map<TaskStatus, number>();
    for (const task of tasks) {
      map.set(task.status, (map.get(task.status) ?? 0) + 1);
    }
    return map;
  }, [tasks]);

  const total = tasks.length;

  return (
    <Card className="py-6">
      <CardHeader className="px-6">
        <CardTitle className="text-xl font-semibold">
          Distribución por estado
        </CardTitle>
        <CardAction>
          <CardMenu
            items={[
              { label: "Actualizar", onSelect: () => fetchTasks() },
              { label: "Ver tareas", onSelect: () => router.push("/plan") },
            ]}
          />
        </CardAction>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-x-6 gap-y-8 px-6 sm:grid-cols-3 lg:grid-cols-5">
        {statusOrder.map((status) => {
          const count = counts.get(status) ?? 0;
          const percent = total > 0 ? Math.round((count / total) * 100) : 0;
          return (
            <div
              key={status}
              className={cn(
                "flex flex-col gap-2 border-l-2 pl-3",
                statusBorderClass[status],
              )}
            >
              <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <span
                  className={cn(
                    "size-1.75 shrink-0 rounded-full",
                    statusDotClass[status],
                  )}
                  aria-hidden
                />
                {statusLabels[status]}
              </span>
              <span
                className={cn(
                  "text-3xl font-bold tabular-nums",
                  statusTextClass[status],
                )}
              >
                {percent}%
              </span>
              <div
                className={cn(
                  "h-1.5 w-full overflow-hidden rounded-full",
                  statusTrackClass[status],
                )}
              >
                <div
                  className={cn(
                    "h-full rounded-full transition-[width]",
                    statusDotClass[status],
                  )}
                  style={{ width: `${percent}%` }}
                />
              </div>
              <span className="text-xs tabular-nums text-muted-foreground">
                {count} tarea{count === 1 ? "" : "s"}
              </span>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
