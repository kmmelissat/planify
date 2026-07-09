import type { PlanItem, Weekday } from "@/lib/types";
import { PlanItemCard } from "@/components/plan/plan-item-card";

const weekOrder: { day: Weekday; label: string }[] = [
  { day: "lunes", label: "Lunes" },
  { day: "martes", label: "Martes" },
  { day: "miercoles", label: "Miércoles" },
  { day: "jueves", label: "Jueves" },
  { day: "viernes", label: "Viernes" },
  { day: "sabado", label: "Sábado" },
  { day: "domingo", label: "Domingo" },
];

export function CalendarView({ items }: { items: PlanItem[] }) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-7">
      {weekOrder.map(({ day, label }) => {
        const dayItems = items
          .filter((item) => item.day === day)
          .sort((a, b) => a.startTime.localeCompare(b.startTime));

        return (
          <div key={day} className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold text-muted-foreground">
              {label}
            </h3>
            <div className="flex flex-col gap-2">
              {dayItems.length === 0 && (
                <p className="text-xs text-muted-foreground">Sin bloques</p>
              )}
              {dayItems.map((item) => (
                <PlanItemCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
