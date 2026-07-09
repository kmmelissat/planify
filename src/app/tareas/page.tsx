"use client";

import { useEffect } from "react";
import { useTaskStore } from "@/store/use-task-store";
import { PriorityBadge, StatusBadge } from "@/components/tasks/badges";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";

export default function TareasPage() {
  const { tasks, isLoading, fetchTasks } = useTaskStore();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Tareas</h1>
        <p className="text-sm text-muted-foreground">
          Registra y consulta tus tareas académicas y personales.
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Fecha límite</TableHead>
                <TableHead>Prioridad</TableHead>
                <TableHead>Esfuerzo</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    Cargando tareas...
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && tasks.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No hay tareas registradas todavía.
                  </TableCell>
                </TableRow>
              )}
              {tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">{task.title}</TableCell>
                  <TableCell className="capitalize">{task.category}</TableCell>
                  <TableCell>
                    {new Date(task.dueDate).toLocaleDateString("es-CO")}
                  </TableCell>
                  <TableCell>
                    <PriorityBadge priority={task.priority} />
                  </TableCell>
                  <TableCell>{task.estimatedEffortMinutes} min</TableCell>
                  <TableCell>
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
