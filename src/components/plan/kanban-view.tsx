import type { PlanItem } from "@/lib/types";
import { PlanItemCard } from "@/components/plan/plan-item-card";

const columns: { status: PlanItem["status"]; label: string }[] = [
  { status: "programada", label: "Programada" },
  { status: "en_progreso", label: "En progreso" },
  { status: "completada", label: "Completada" },
  { status: "en_riesgo", label: "En riesgo" },
];

export function KanbanView({ items }: { items: PlanItem[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {columns.map(({ status, label }) => {
        const columnItems = items.filter((item) => item.status === status);

        return (
          <div
            key={status}
            className="flex flex-col gap-3 rounded-xl border border-border bg-muted/40 p-3"
          >
            <h3 className="text-eyebrow px-1">
              {label} <span className="text-foreground/40">· {columnItems.length}</span>
            </h3>
            <div className="flex flex-col gap-2.5">
              {columnItems.map((item) => (
                <PlanItemCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
