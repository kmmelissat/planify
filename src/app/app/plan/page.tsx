"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Check, Plus, RefreshCw, X } from "lucide-react";
import { useTaskStore } from "@/store/use-task-store";
import { usePlanStore } from "@/store/use-plan-store";
import { usePlanViewStore } from "@/store/use-plan-view-store";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CalendarView } from "@/components/plan/calendar-view";
import { KanbanView } from "@/components/plan/kanban-view";
import { TableView } from "@/components/plan/table-view";
import { PageHeader } from "@/components/layout/page-header";
import { TaskFormDialog } from "@/components/tasks/task-form-dialog";
import { QuickAddTaskInput } from "@/components/tasks/quick-add-task-input";
import { EditableTaskRow } from "@/components/tasks/editable-task-row";
import {
  TaskStatusFilter,
  type TaskStatusFilterValue,
} from "@/components/tasks/task-status-filter";
import type { Task, TaskInput } from "@/lib/types";

export default function PlanPage() {
  const { tasks, fetchTasks, createTask, updateTask } = useTaskStore();
  const {
    currentPlan,
    isGenerating,
    fetchCurrentPlan,
    generateNewPlan,
    setApprovalStatus,
    error,
  } = usePlanStore();
  const { viewMode, setViewMode } = usePlanViewStore();

  const [activeTab, setActiveTab] = useState<"tareas" | "plan">("tareas");
  const [statusFilter, setStatusFilter] = useState<TaskStatusFilterValue>("todas");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogTask, setDialogTask] = useState<Task | null>(null);
  const [dialogSession, setDialogSession] = useState(0);

  useEffect(() => {
    fetchTasks();
    fetchCurrentPlan();
  }, [fetchTasks, fetchCurrentPlan]);

  const filteredTasks = useMemo(
    () =>
      statusFilter === "todas"
        ? tasks
        : tasks.filter((task) => task.status === statusFilter),
    [tasks, statusFilter],
  );

  function openCreateDialog() {
    setDialogTask(null);
    setDialogSession((session) => session + 1);
    setIsDialogOpen(true);
  }

  function openEditDialog(task: Task) {
    setDialogTask(task);
    setDialogSession((session) => session + 1);
    setIsDialogOpen(true);
  }

  async function handleDialogSubmit(input: TaskInput) {
    if (dialogTask) {
      await updateTask(dialogTask.id, input);
    } else {
      await createTask(input);
    }
  }

  const completedCount = tasks.filter(
    (task) => task.status === "completada",
  ).length;

  const errorBanner = error
    ? error.code === "ERR-DATA-001"
      ? {
          title: "Faltan tareas o bloques de disponibilidad",
          description:
            "Necesitás cargar al menos una tarea y un bloque de disponibilidad antes de generar un plan.",
        }
      : error.code === "ERR-SYS-001"
        ? {
            title: "Servicio de IA no disponible",
            description:
              "No se pudo consultar al motor de planificación. Tu estado local se mantiene intacto.",
          }
        : error.code === "ERR-PLAN-001"
          ? {
              title: "El plan no cumple las reglas de negocio",
              description:
                "Revisá el déficit de horas y los conflictos de sobrecarga antes de pedir una nueva versión.",
            }
          : {
              title: "Error al generar el plan",
              description: error.message,
            }
    : null;

  const planWarning = currentPlan?.viabilidad
    ? currentPlan.viabilidad === "no_viable"
      ? {
          title: "Plan no viable",
          description:
            currentPlan.validationCode === "ERR-IA-004"
              ? "El motor detectó conflictos con disponibilidad, tareas fijas o límites de sesión."
              : "La propuesta requiere revisión antes de aprobarse.",
        }
      : currentPlan.viabilidad === "viable_con_ajustes"
        ? {
            title: "Plan viable con ajustes",
            description:
              "La propuesta es útil, pero todavía contiene recomendaciones o conflictos menores.",
          }
        : null
    : null;

  async function handleQuickAdd(title: string) {
    await createTask({
      title,
      description: "",
      category: "personal",
      dueDate: undefined,
      priority: "media",
      estimatedEffortMinutes: 30,
      status: "pendiente",
    });
  }

  return (
    <div className="flex flex-col gap-10">
      <PageHeader
        eyebrow="Tareas y Plan"
        title="Tus tareas y la propuesta del agente"
        description="Gestioná tus tareas y revisá el plan que propone el agente — todo en un solo lugar."
      />

      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as "tareas" | "plan")}
      >
        <TabsList>
          <TabsTrigger value="tareas">Tareas</TabsTrigger>
          <TabsTrigger value="plan">Plan propuesto</TabsTrigger>
        </TabsList>

        <TabsContent value="tareas" className="mt-6 flex flex-col gap-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <QuickAddTaskInput onAdd={handleQuickAdd} />
            <span className="shrink-0 text-sm text-muted-foreground">
              {completedCount} de {tasks.length} completadas
            </span>
          </div>

          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <TaskStatusFilter
              tasks={tasks}
              value={statusFilter}
              onValueChange={setStatusFilter}
            />
            <Button onClick={openCreateDialog} className="gap-1.5">
              <Plus className="size-4" /> Nueva tarea
            </Button>
          </div>

          <Card className="py-0">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="pl-6">Título</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Fecha límite</TableHead>
                    <TableHead>Prioridad</TableHead>
                    <TableHead>Esfuerzo</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="pr-6 text-right">Acción</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTasks.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="py-10 text-center text-muted-foreground"
                      >
                        No hay tareas para este filtro.
                      </TableCell>
                    </TableRow>
                  )}
                  {filteredTasks.map((task) => (
                    <EditableTaskRow
                      key={task.id}
                      task={task}
                      onUpdate={updateTask}
                      onEdit={openEditDialog}
                    />
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plan" className="mt-6 flex flex-col gap-8">
          <div className="flex justify-end">
            <Button
              onClick={() => generateNewPlan()}
              disabled={isGenerating}
              className="gap-2"
            >
              <RefreshCw
                className={isGenerating ? "size-4 animate-spin" : "size-4"}
              />
              {currentPlan ? "Pedir nueva versión" : "Generar plan"}
            </Button>
          </div>

          {!currentPlan && !isGenerating && (
            <Card>
              <CardContent className="py-14 text-center text-sm text-muted-foreground">
                Todavía no hay un plan generado. Usa el botón &quot;Generar
                plan&quot; para pedirle una propuesta al agente.
              </CardContent>
            </Card>
          )}

          {currentPlan && (
            <>
              <Card className="py-6">
                <CardHeader className="flex flex-col gap-3 px-6 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2.5 text-xl font-semibold">
                      Versión {currentPlan.version}
                      <Badge variant="outline" className="capitalize">
                        {currentPlan.approvalStatus}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="mt-1.5 max-w-2xl leading-relaxed">
                      {currentPlan.overallJustification}
                    </CardDescription>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5"
                      onClick={() => setApprovalStatus("rechazado")}
                    >
                      <X className="size-4" /> Rechazar
                    </Button>
                    <Button
                      size="sm"
                      className="gap-1.5"
                      onClick={() => setApprovalStatus("aprobado")}
                    >
                      <Check className="size-4" /> Aprobar
                    </Button>
                  </div>
                </CardHeader>
                {currentPlan.conflicts.length > 0 && (
                  <CardContent className="flex flex-col gap-2.5 px-6">
                    {currentPlan.conflicts.map((conflict) => (
                      <Alert
                        key={conflict.id}
                        variant={
                          conflict.severity === "critico"
                            ? "destructive"
                            : "default"
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

              <Tabs
                value={viewMode}
                onValueChange={(value) =>
                  setViewMode(value as typeof viewMode)
                }
              >
                <TabsList>
                  <TabsTrigger value="calendario">Calendario</TabsTrigger>
                  <TabsTrigger value="kanban">Kanban</TabsTrigger>
                  <TabsTrigger value="tabla">Lista priorizada</TabsTrigger>
                </TabsList>
                <TabsContent value="calendario" className="mt-5">
                  <CalendarView items={currentPlan.items} />
                </TabsContent>
                <TabsContent value="kanban" className="mt-5">
                  <KanbanView items={currentPlan.items} />
                </TabsContent>
                <TabsContent value="tabla" className="mt-5">
                  <Card className="py-0">
                    <CardContent className="p-0">
                      <TableView items={currentPlan.items} />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          )}
        </TabsContent>
      </Tabs>

      {errorBanner && (
        <Alert variant="destructive">
          <AlertTriangle className="size-4" />
          <AlertTitle>{errorBanner.title}</AlertTitle>
          <AlertDescription>{errorBanner.description}</AlertDescription>
        </Alert>
      )}

      {planWarning && currentPlan && (
        <Alert>
          <AlertTriangle className="size-4" />
          <AlertTitle>{planWarning.title}</AlertTitle>
          <AlertDescription>
            {planWarning.description}
            {currentPlan.validationCode ? ` Código: ${currentPlan.validationCode}.` : ""}
          </AlertDescription>
        </Alert>
      )}

      <TaskFormDialog
        key={dialogSession}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        task={dialogTask}
        onSubmit={handleDialogSubmit}
      />
    </div>
  );
}
