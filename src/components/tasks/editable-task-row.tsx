"use client";

import { useState, type KeyboardEvent } from "react";
import { MoreHorizontal, Pencil } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
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
  categoryLabels,
  priorityAccentClass,
  priorityLabels,
  statusLabels,
} from "@/components/tasks/badges";
import { cn } from "@/lib/utils";
import type {
  Task,
  TaskCategory,
  TaskPriority,
  TaskStatus,
  TaskUpdate,
} from "@/lib/types";

/** Look "transparente hasta que se toca" compartido por los 3 Select inline. */
const inlineTriggerClass =
  "gap-1 rounded-md border-transparent bg-transparent px-1.5 py-1 hover:bg-muted data-open:bg-muted dark:bg-transparent dark:hover:bg-muted";

const inlineFieldClass =
  "w-full min-w-0 rounded-md border border-transparent bg-transparent px-1.5 py-1 text-sm outline-none transition-colors hover:bg-muted focus:border-ring focus:bg-transparent focus:ring-3 focus:ring-ring/50";

export function EditableTaskRow({
  task,
  onUpdate,
  onEdit,
}: {
  task: Task;
  onUpdate: (id: string, update: TaskUpdate) => void;
  onEdit: (task: Task) => void;
}) {
  const isCompleted = task.status === "completada";

  const [title, setTitle] = useState(task.title);
  const [effort, setEffort] = useState(String(task.estimatedEffortMinutes));

  function commitTitle() {
    const trimmed = title.trim();
    if (!trimmed) {
      setTitle(task.title);
      return;
    }
    if (trimmed !== task.title) onUpdate(task.id, { title: trimmed });
  }

  function commitEffort() {
    const minutes = Number(effort);
    if (!Number.isFinite(minutes) || minutes <= 0) {
      setEffort(String(task.estimatedEffortMinutes));
      return;
    }
    if (minutes !== task.estimatedEffortMinutes) {
      onUpdate(task.id, { estimatedEffortMinutes: minutes });
    }
  }

  function handleCommitKeyDown(
    event: KeyboardEvent<HTMLInputElement>,
    revert: () => void,
  ) {
    if (event.key === "Enter") {
      event.currentTarget.blur();
    } else if (event.key === "Escape") {
      revert();
      event.currentTarget.blur();
    }
  }

  return (
    <TableRow
      className={cn(
        priorityAccentClass(task.priority),
        "animate-in fade-in slide-in-from-top-2 duration-300",
        isCompleted && "opacity-60 transition-opacity",
      )}
    >
      <TableCell className="py-2 pl-5.25 font-medium">
        <div className="flex items-center gap-2.5">
          <Checkbox
            checked={isCompleted}
            onCheckedChange={(checked) =>
              onUpdate(task.id, {
                status: checked ? "completada" : "pendiente",
              })
            }
            aria-label={
              isCompleted
                ? `Marcar "${task.title}" como pendiente`
                : `Marcar "${task.title}" como completada`
            }
          />
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={commitTitle}
            onKeyDown={(e) => handleCommitKeyDown(e, () => setTitle(task.title))}
            className={cn(
              inlineFieldClass,
              "font-medium",
              isCompleted && "text-muted-foreground line-through",
            )}
          />
        </div>
      </TableCell>

      <TableCell>
        <Select
          value={task.category}
          onValueChange={(value) =>
            onUpdate(task.id, { category: value as TaskCategory })
          }
        >
          <SelectTrigger size="sm" className={inlineTriggerClass}>
            <span className="text-sm text-muted-foreground">
              {categoryLabels[task.category]}
            </span>
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(categoryLabels) as TaskCategory[]).map(
              (category) => (
                <SelectItem key={category} value={category}>
                  {categoryLabels[category]}
                </SelectItem>
              ),
            )}
          </SelectContent>
        </Select>
      </TableCell>

      <TableCell>
        <input
          type="date"
          defaultValue={task.dueDate ? task.dueDate.slice(0, 10) : ""}
          onChange={(e) =>
            onUpdate(task.id, {
              dueDate: e.target.value
                ? new Date(e.target.value).toISOString()
                : undefined,
            })
          }
          className={inlineFieldClass}
        />
      </TableCell>

      <TableCell>
        <Select
          value={task.priority}
          onValueChange={(value) =>
            onUpdate(task.id, { priority: value as TaskPriority })
          }
        >
          <SelectTrigger size="sm" className={inlineTriggerClass}>
            <PriorityBadge priority={task.priority} />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(priorityLabels) as TaskPriority[]).map(
              (priority) => (
                <SelectItem key={priority} value={priority}>
                  {priorityLabels[priority]}
                </SelectItem>
              ),
            )}
          </SelectContent>
        </Select>
      </TableCell>

      <TableCell>
        <div className="flex items-center gap-1.5">
          <input
            type="number"
            min={1}
            value={effort}
            onChange={(e) => setEffort(e.target.value)}
            onBlur={commitEffort}
            onKeyDown={(e) =>
              handleCommitKeyDown(e, () =>
                setEffort(String(task.estimatedEffortMinutes)),
              )
            }
            className={cn(inlineFieldClass, "w-16 text-muted-foreground")}
          />
          <span className="text-sm text-muted-foreground">min</span>
        </div>
      </TableCell>

      <TableCell>
        <Select
          value={task.status}
          onValueChange={(value) =>
            onUpdate(task.id, { status: value as TaskStatus })
          }
        >
          <SelectTrigger size="sm" className={inlineTriggerClass}>
            <StatusBadge status={task.status} />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(statusLabels) as TaskStatus[]).map((status) => (
              <SelectItem key={status} value={status}>
                {statusLabels[status]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
            <DropdownMenuItem onClick={() => onEdit(task)}>
              <Pencil />
              Editar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
