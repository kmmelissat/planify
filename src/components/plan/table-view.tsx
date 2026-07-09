import type { PlanItem } from "@/lib/types";
import { PriorityBadge } from "@/components/tasks/badges";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const dayLabels: Record<string, string> = {
  lunes: "Lunes",
  martes: "Martes",
  miercoles: "Miércoles",
  jueves: "Jueves",
  viernes: "Viernes",
  sabado: "Sábado",
  domingo: "Domingo",
};

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
        <TableRow>
          <TableHead>Tarea</TableHead>
          <TableHead>Prioridad</TableHead>
          <TableHead>Día</TableHead>
          <TableHead>Horario</TableHead>
          <TableHead>Estado</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sorted.length === 0 && (
          <TableRow>
            <TableCell colSpan={5} className="text-center text-muted-foreground">
              No hay bloques en el plan actual.
            </TableCell>
          </TableRow>
        )}
        {sorted.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">{item.taskTitle}</TableCell>
            <TableCell>
              <PriorityBadge priority={item.priority} />
            </TableCell>
            <TableCell>{dayLabels[item.day]}</TableCell>
            <TableCell>
              {item.startTime} – {item.endTime}
            </TableCell>
            <TableCell className="capitalize">
              {item.status.replace(/_/g, " ")}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
