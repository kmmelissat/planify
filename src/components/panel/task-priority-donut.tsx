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
import type { Task, TaskPriority } from "@/lib/types";

const priorityOrder: TaskPriority[] = ["urgente", "alta", "media", "baja"];

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

const priorityStrokeVar: Record<TaskPriority, string> = {
  urgente: "var(--priority-urgente)",
  alta: "var(--priority-alta)",
  media: "var(--priority-media)",
  baja: "var(--priority-baja)",
};

const RADIUS = 60;
const STROKE = 22;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function TaskPriorityDonut({ tasks }: { tasks: Task[] }) {
  const router = useRouter();
  const fetchTasks = useTaskStore((state) => state.fetchTasks);

  const counts = useMemo(() => {
    const map = new Map<TaskPriority, number>();
    for (const task of tasks) {
      map.set(task.priority, (map.get(task.priority) ?? 0) + 1);
    }
    return map;
  }, [tasks]);

  const total = tasks.length;

  const segments = useMemo(() => {
    const dashes = priorityOrder.map((priority) => {
      const count = counts.get(priority) ?? 0;
      const fraction = total > 0 ? count / total : 0;
      return { priority, count, dash: fraction * CIRCUMFERENCE };
    });
    return dashes.map(({ priority, count, dash }, index) => {
      const offset = dashes
        .slice(0, index)
        .reduce((sum, d) => sum + d.dash, 0);
      return {
        priority,
        count,
        dashArray: `${dash} ${CIRCUMFERENCE - dash}`,
        dashOffset: -offset,
      };
    });
  }, [counts, total]);

  return (
    <Card className="py-6">
      <CardHeader className="px-6">
        <CardTitle className="text-xl font-semibold">
          Prioridad de tareas
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
      <CardContent className="flex items-center gap-6 px-6">
        <svg
          viewBox="0 0 160 160"
          className="size-32 shrink-0 -rotate-90"
          role="img"
          aria-label="Distribución de tareas por prioridad"
        >
          <circle
            cx="80"
            cy="80"
            r={RADIUS}
            fill="none"
            stroke="var(--surface)"
            strokeWidth={STROKE}
          />
          {total > 0 &&
            segments.map(
              (segment) =>
                segment.count > 0 && (
                  <circle
                    key={segment.priority}
                    cx="80"
                    cy="80"
                    r={RADIUS}
                    fill="none"
                    stroke={priorityStrokeVar[segment.priority]}
                    strokeWidth={STROKE}
                    strokeDasharray={segment.dashArray}
                    strokeDashoffset={segment.dashOffset}
                  />
                ),
            )}
          <text
            x="80"
            y="80"
            textAnchor="middle"
            dominantBaseline="middle"
            className="rotate-90 fill-foreground text-2xl font-bold tabular-nums"
            style={{ transformOrigin: "80px 80px" }}
          >
            {total}
          </text>
        </svg>

        <div className="flex flex-1 flex-col gap-2.5">
          {priorityOrder.map((priority) => {
            const count = counts.get(priority) ?? 0;
            const percent = total > 0 ? Math.round((count / total) * 100) : 0;
            return (
              <div
                key={priority}
                className="flex items-center gap-1.5 text-xs font-medium"
              >
                <span
                  className={cn(
                    "size-1.75 shrink-0 rounded-full",
                    priorityDotClass[priority],
                  )}
                  aria-hidden
                />
                <span className="text-foreground">
                  {priorityLabels[priority]}
                </span>
                <span className="tabular-nums text-muted-foreground">
                  {count} · {percent}%
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
