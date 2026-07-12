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
import { Badge } from "@/components/ui/badge";
import { useTaskStore } from "@/store/use-task-store";
import { usePlanStore } from "@/store/use-plan-store";
import { PageHeader } from "@/components/layout/page-header";
import { cn } from "@/lib/utils";
import type { TaskStatus } from "@/lib/types";

const counters: {
  status: TaskStatus;
  label: string;
  icon: typeof Clock;
  cardClass: string;
  chipClass: string;
}[] = [
  {
    status: "pendiente",
    label: "Pendientes",
    icon: Clock,
    cardClass: "bg-primary-soft/60",
    chipClass: "bg-primary",
  },
  {
    status: "completada",
    label: "Completadas",
    icon: CheckCircle2,
    cardClass: "bg-surface",
    chipClass: "bg-primary-deep",
  },
  {
    status: "atrasada",
    label: "Atrasadas",
    icon: AlertTriangle,
    cardClass: "bg-primary-soft",
    chipClass: "bg-primary-deep",
  },
  {
    status: "reprogramada",
    label: "Reprogramadas",
    icon: RotateCcw,
    cardClass: "bg-surface",
    chipClass: "bg-primary",
  },
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
    <div className="flex flex-col gap-10">
      <PageHeader
        eyebrow="Panel"
        title="Seguimiento general"
        description="Resumen del estado de tus tareas y del plan vigente, de un vistazo."
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {counters.map(({ status, label, icon: Icon, cardClass, chipClass }) => (
          <Card
            key={status}
            className={cn("gap-3 border-transparent py-6", cardClass)}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 px-6">
              <CardTitle className="text-eyebrow">{label}</CardTitle>
              <span
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full text-white",
                  chipClass,
                )}
              >
                <Icon className="size-4" />
              </span>
            </CardHeader>
            <CardContent className="px-6">
              <div className="text-3xl font-bold text-primary-deep tabular-nums">
                {countsByStatus.get(status) ?? 0}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="gap-3 border-l-4 border-l-primary py-6">
        <CardHeader className="flex flex-row items-start justify-between gap-3 px-6">
          <div>
            <CardTitle className="text-xl font-semibold">
              Plan vigente
            </CardTitle>
            <CardDescription>
              {currentPlan
                ? `Versión ${currentPlan.version}`
                : "Todavía no se ha generado ningún plan."}
            </CardDescription>
          </div>
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
