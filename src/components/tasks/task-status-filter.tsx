"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { statusLabels } from "@/components/tasks/badges";
import type { Task, TaskStatus } from "@/lib/types";

const statusOrder: TaskStatus[] = [
  "pendiente",
  "en_progreso",
  "completada",
  "atrasada",
  "reprogramada",
];

export type TaskStatusFilterValue = "todas" | TaskStatus;

export function TaskStatusFilter({
  tasks,
  value,
  onValueChange,
}: {
  tasks: Task[];
  value: TaskStatusFilterValue;
  onValueChange: (value: TaskStatusFilterValue) => void;
}) {
  const counts = tasks.reduce<Partial<Record<TaskStatus, number>>>(
    (acc, task) => {
      acc[task.status] = (acc[task.status] ?? 0) + 1;
      return acc;
    },
    {},
  );

  return (
    <Tabs
      value={value}
      onValueChange={(v) => onValueChange(v as TaskStatusFilterValue)}
    >
      <TabsList>
        <TabsTrigger value="todas">Todas · {tasks.length}</TabsTrigger>
        {statusOrder.map((status) => (
          <TabsTrigger key={status} value={status}>
            {statusLabels[status]} · {counts[status] ?? 0}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
