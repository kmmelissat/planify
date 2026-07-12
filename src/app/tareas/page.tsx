"use client";

import { useEffect } from "react";
import { useTaskStore } from "@/store/use-task-store";
import { PriorityBadge, StatusBadge, priorityAccentClass } from "@/components/tasks/badges";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/page-header";
import { cn } from "@/lib/utils";

export default function TareasPage() {
  const { tasks, isLoading, fetchTasks } = useTaskStore();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <div className="flex flex-col gap-10">
      <PageHeader
        eyebrow="Registro"
        title="Tareas"
        description="Registra y consulta tus tareas académicas y personales."
      />

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
                <TableHead className="pr-6">Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                    Cargando tareas...
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && tasks.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                    No hay tareas registradas todavía.
                  </TableCell>
                </TableRow>
              )}
              {tasks.map((task) => (
                <TableRow key={task.id} className={cn(priorityAccentClass(task.priority))}>
                  <TableCell className="py-4 pl-5.25 font-medium">
                    {task.title}
                  </TableCell>
                  <TableCell className="capitalize text-muted-foreground">
                    {task.category}
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
                  <TableCell className="pr-6">
                    <StatusBadge status={task.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
