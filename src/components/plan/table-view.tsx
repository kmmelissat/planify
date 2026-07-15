import type { PlanItem } from "@/lib/types";
import { PriorityBadge, priorityAccentClass } from "@/components/tasks/badges";
import { dayLabels } from "@/lib/constants/weekday";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const priorityWeight: Record<PlanItem["priority"], number> = {
  urgente: 4,
  alta: 3,
  media: 2,
  baja: 1,
};

export function TableView({ items }: { items: PlanItem[] }) {
  const sorted = [...items].sort(
    (a, b) => priorityWeight[b.priority] - priorityWeight[a.priority],
  );

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="pl-6">Tarea</TableHead>
          <TableHead>Prioridad</TableHead>
          <TableHead>Día</TableHead>
          <TableHead>Horario</TableHead>
          <TableHead className="pr-6">Estado</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sorted.length === 0 && (
          <TableRow>
            <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
              No hay bloques en el plan actual.
            </TableCell>
          </TableRow>
        )}
        {sorted.map((item) => (
          <TableRow key={item.id} className={cn(priorityAccentClass(item.priority))}>
            <TableCell className="py-4 pl-5.25 font-medium">
              {item.taskTitle}
            </TableCell>
            <TableCell>
              <PriorityBadge priority={item.priority} />
            </TableCell>
            <TableCell className="text-muted-foreground">
              {dayLabels[item.day]}
            </TableCell>
            <TableCell className="text-xs text-muted-foreground tabular-nums">
              {item.startTime} – {item.endTime}
            </TableCell>
            <TableCell className="pr-6 capitalize text-muted-foreground">
              {item.status.replace(/_/g, " ")}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
