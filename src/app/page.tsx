"use client";

import { useEffect, useMemo } from "react";
import { AlertTriangle, CheckCircle2, Clock, RotateCcw } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useTaskStore } from "@/store/use-task-store";
import { usePlanStore } from "@/store/use-plan-store";
import type { TaskStatus } from "@/lib/types";

const counters: { status: TaskStatus; label: string; icon: typeof Clock }[] = [
  { status: "pendiente", label: "Pendientes", icon: Clock },
  { status: "completada", label: "Completadas", icon: CheckCircle2 },
  { status: "atrasada", label: "Atrasadas", icon: AlertTriangle },
  { status: "reprogramada", label: "Reprogramadas", icon: RotateCcw },
];

export default function DashboardPage() {
  const { tasks, fetchTasks } = useTaskStore();
  const { currentPlan, fetchCurrentPlan } = usePlanStore();

  useEffect(() => {
    fetchTasks();
    fetchCurrentPlan();
  }, [fetchTasks, fetchCurrentPlan]);

  const countsByStatus = useMemo(() => {
    const map = new Map<TaskStatus, number>();
    for (const task of tasks) {
      map.set(task.status, (map.get(task.status) ?? 0) + 1);
    }
    return map;
  }, [tasks]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Panel de seguimiento</h1>
        <p className="text-sm text-muted-foreground">
          Resumen del estado de tus tareas y del plan vigente.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {counters.map(({ status, label, icon: Icon }) => (
          <Card key={status}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {label}
              </CardTitle>
              <Icon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {countsByStatus.get(status) ?? 0}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Plan vigente</CardTitle>
          <CardDescription>
            {currentPlan
              ? `Versión ${currentPlan.version} · ${currentPlan.approvalStatus}`
              : "Todavía no se ha generado ningún plan."}
          </CardDescription>
        </CardHeader>
        {currentPlan && currentPlan.conflicts.length > 0 && (
          <CardContent className="flex flex-col gap-2">
            {currentPlan.conflicts.map((conflict) => (
              <Alert
                key={conflict.id}
                variant={
                  conflict.severity === "critico" ? "destructive" : "default"
                }
              >
                <AlertTriangle className="size-4" />
                <AlertTitle className="capitalize">
                  {conflict.type.replace(/_/g, " ")}
                </AlertTitle>
                <AlertDescription>{conflict.message}</AlertDescription>
              </Alert>
            ))}
          </CardContent>
        )}
      </Card>
    </div>
  );
}
