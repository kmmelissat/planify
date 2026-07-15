"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useTaskStore } from "@/store/use-task-store";
import { usePlanStore } from "@/store/use-plan-store";
import { useAvailabilityStore } from "@/store/use-availability-store";
import { PageHeader } from "@/components/layout/page-header";
import { TaskPriorityDonut } from "@/components/panel/task-priority-donut";
import { TaskStatusBars } from "@/components/panel/task-status-bars";
import { AvailabilityHeatmap } from "@/components/panel/availability-heatmap";
import { UpcomingTasksTable } from "@/components/panel/upcoming-tasks-table";

export default function DashboardPage() {
  const { tasks, fetchTasks, updateTask } = useTaskStore();
  const { currentPlan, fetchCurrentPlan } = usePlanStore();
  const { blocks, constraints, fetchAll } = useAvailabilityStore();

  useEffect(() => {
    fetchTasks();
    fetchCurrentPlan();
    fetchAll();
  }, [fetchTasks, fetchCurrentPlan, fetchAll]);

  return (
    <div className="flex flex-col gap-10">
      <PageHeader
        eyebrow="Panel"
        title="Bienvenido de vuelta"
        description="Esto es lo que está pasando con tu semana, de un vistazo."
      />

      <TaskStatusBars tasks={tasks} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="flex flex-col gap-4 lg:col-span-5">
          <TaskPriorityDonut tasks={tasks} />
          <UpcomingTasksTable
            tasks={tasks}
            onComplete={(id) => updateTask(id, { status: "completada" })}
            className="flex-1"
          />
        </div>
        <div className="flex flex-col lg:col-span-7">
          <AvailabilityHeatmap
            blocks={blocks}
            constraints={constraints}
            className="h-full"
          />
        </div>
      </div>

      <Card className="gap-3 border-l-4 border-l-primary py-6">
        <CardHeader className="flex flex-row items-center justify-between gap-3 px-6">
          <CardTitle className="flex flex-wrap items-baseline gap-2 text-xl font-semibold">
            Plan vigente
            <span className="text-sm font-normal text-muted-foreground">
              {currentPlan
                ? `Versión ${currentPlan.version}`
                : "Todavía no se ha generado ningún plan."}
            </span>
          </CardTitle>
          {currentPlan && (
            <Badge className="border-transparent bg-primary-soft capitalize text-primary-deep hover:bg-primary-soft">
              {currentPlan.approvalStatus}
            </Badge>
          )}
        </CardHeader>
        {currentPlan && currentPlan.conflicts.length > 0 && (
          <CardContent className="flex flex-col gap-3 px-6">
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
