"use client";

import { useMemo } from "react";
import Link from "next/link";
import { CheckCircle2, MoreHorizontal } from "lucide-react";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Button } from "@/components/ui/button";
import {
  PriorityBadge,
  StatusBadge,
  priorityAccentClass,
} from "@/components/tasks/badges";
import { cn } from "@/lib/utils";
import type { Task } from "@/lib/types";

const MAX_ROWS = 6;

export function UpcomingTasksTable({
  tasks,
  onComplete,
  className,
}: {
  tasks: Task[];
  onComplete: (id: string) => void;
  className?: string;
}) {
  const upcoming = useMemo(
    () =>
      tasks
        .filter((task) => task.status !== "completada")
        .sort((a, b) => {
          const aTime = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
          const bTime = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
          return aTime - bTime;
        })
        .slice(0, MAX_ROWS),
    [tasks],
  );

  return (
    <Card className={cn("flex flex-col py-6", className)}>
      <CardHeader className="px-6">
        <CardTitle className="text-xl font-semibold">
          Próximas tareas
        </CardTitle>
        <CardAction>
          <Link
            href="/app/plan"
            className="text-sm font-medium text-primary hover:underline"
          >
            Ver todas
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent className="flex-1 px-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="pl-6">Tarea</TableHead>
              <TableHead>Fecha límite</TableHead>
              <TableHead>Prioridad</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="pr-6 text-right">Acción</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {upcoming.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-10 text-center text-muted-foreground"
                >
                  No tienes tareas pendientes. ¡Vas al día!
                </TableCell>
              </TableRow>
            )}
            {upcoming.map((task) => (
              <TableRow
                key={task.id}
                className={cn(priorityAccentClass(task.priority))}
              >
                <TableCell className="py-4 pl-5.25 font-medium">
                  {task.title}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {task.dueDate ? (
                    new Date(task.dueDate).toLocaleDateString("es-CO")
                  ) : (
                    <span className="italic">Sin fecha</span>
                  )}
                </TableCell>
                <TableCell>
                  <PriorityBadge priority={task.priority} />
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
                        onClick={() => onComplete(task.id)}
                      >
                        <CheckCircle2 />
                        Marcar como completada
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        render={<Link href="/app/plan">Ver en Tareas</Link>}
                      />
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
