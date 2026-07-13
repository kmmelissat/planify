"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  MoreHorizontal,
  Pencil,
  Plus,
  RefreshCw,
  X,
} from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CalendarView } from "@/components/plan/calendar-view";
import { KanbanView } from "@/components/plan/kanban-view";
import { TableView } from "@/components/plan/table-view";
import { PageHeader } from "@/components/layout/page-header";
import { TaskFormDialog } from "@/components/tasks/task-form-dialog";
import {
  TaskStatusFilter,
  type TaskStatusFilterValue,
} from "@/components/tasks/task-status-filter";
import {
  PriorityBadge,
  StatusBadge,
  categoryLabels,
  priorityAccentClass,
} from "@/components/tasks/badges";
import { cn } from "@/lib/utils";
import type { Task, TaskInput } from "@/lib/types";

export default function PlanPage() {
  const { tasks, fetchTasks, createTask, updateTask } = useTaskStore();
  const {
    currentPlan,
    isGenerating,
    fetchCurrentPlan,
    generateNewPlan,
    setApprovalStatus,
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
                    <TableRow
                      key={task.id}
                      className={cn(priorityAccentClass(task.priority))}
                    >
                      <TableCell className="py-4 pl-5.25 font-medium">
                        {task.title}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {categoryLabels[task.category]}
                      </TableCell>
                      <TableCell>
                        {new Date(task.dueDate).toLocaleDateString("es-CO")}
                      </TableCell>
                      <TableCell>
                        <PriorityBadge priority={task.priority} />
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {task.estimatedEffortMinutes} min
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={task.status} />
                      </TableCell>
                      <TableCell className="pr-6 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            render={
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                aria-label="Acciones de la tarea"
                                className="rounded-full text-muted-foreground"
                              >
                                <MoreHorizontal className="size-4" />
                              </Button>
                            }
                          />
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => openEditDialog(task)}
                            >
                              <Pencil />
                              Editar
                            </DropdownMenuItem>
                            {task.status !== "completada" && (
                              <DropdownMenuItem
                                onClick={() =>
                                  updateTask(task.id, { status: "completada" })
                                }
                              >
                                <CheckCircle2 />
                                Marcar como completada
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
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
