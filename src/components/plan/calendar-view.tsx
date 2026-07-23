"use client";

import { Pencil } from "lucide-react";
import type { PlanItem, Weekday } from "@/lib/types";
import { cn } from "@/lib/utils";
import { EditPlanItemDialog } from "@/components/plan/edit-plan-item-dialog";
import { usePlanItemEditor } from "@/components/plan/use-plan-item-editor";

const weekOrder: { day: Weekday; label: string }[] = [
  { day: "lunes", label: "Lunes" },
  { day: "martes", label: "Martes" },
  { day: "miercoles", label: "Miércoles" },
  { day: "jueves", label: "Jueves" },
  { day: "viernes", label: "Viernes" },
  { day: "sabado", label: "Sábado" },
  { day: "domingo", label: "Domingo" },
];

const priorityBlockClass: Record<PlanItem["priority"], string> = {
  urgente: "bg-priority-urgente/15 border-l-priority-urgente",
  alta: "bg-priority-alta/15 border-l-priority-alta",
  media: "bg-priority-media/15 border-l-priority-media",
  baja: "bg-priority-baja/15 border-l-priority-baja",
};

const HOUR_HEIGHT = 56; // px
const HEADER_HEIGHT = 32; // px, debe calzar con el spacer de la columna de horas

function toMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function computeRange(items: PlanItem[]): { startHour: number; endHour: number } {
  if (items.length === 0) return { startHour: 8, endHour: 20 };
  const starts = items.map((item) => toMinutes(item.startTime));
  const ends = items.map((item) => toMinutes(item.endTime));
  const startHour = Math.max(0, Math.floor(Math.min(...starts) / 60));
  const endHourRaw = Math.min(24, Math.ceil(Math.max(...ends) / 60));
  return { startHour, endHour: Math.max(endHourRaw, startHour + 6) };
}

interface PositionedItem {
  item: PlanItem;
  lane: number;
  lanes: number;
}

/** Empaqueta bloques que se superponen en carriles lado a lado, como un calendario real. */
function layoutDay(items: PlanItem[]): PositionedItem[] {
  const sorted = [...items].sort(
    (a, b) => toMinutes(a.startTime) - toMinutes(b.startTime),
  );

  const positioned: PositionedItem[] = [];
  let lanesEnd: number[] = [];
  let clusterStart = 0;
  let clusterMaxEnd = -Infinity;

  const finalizeCluster = (from: number) => {
    const cluster = positioned.slice(from);
    const laneCount = Math.max(0, ...cluster.map((p) => p.lane)) + 1;
    for (const p of cluster) p.lanes = laneCount;
  };

  for (const item of sorted) {
    const startM = toMinutes(item.startTime);
    const endM = toMinutes(item.endTime);

    if (startM >= clusterMaxEnd) {
      if (positioned.length > clusterStart) finalizeCluster(clusterStart);
      clusterStart = positioned.length;
      lanesEnd = [];
      clusterMaxEnd = -Infinity;
    }

    let lane = lanesEnd.findIndex((end) => end <= startM);
    if (lane === -1) {
      lane = lanesEnd.length;
      lanesEnd.push(endM);
    } else {
      lanesEnd[lane] = endM;
    }

    positioned.push({ item, lane, lanes: 1 });
    clusterMaxEnd = Math.max(clusterMaxEnd, endM);
  }
  if (positioned.length > clusterStart) finalizeCluster(clusterStart);

  return positioned;
}

export function CalendarView({ items }: { items: PlanItem[] }) {
  const editor = usePlanItemEditor(items);
  const { startHour, endHour } = computeRange(items);
  const hours = Array.from(
    { length: endHour - startHour },
    (_, i) => startHour + i,
  );
  const totalMinutes = (endHour - startHour) * 60;
  const gridHeight = hours.length * HOUR_HEIGHT;

  return (
    <div className="overflow-x-auto">
      <div className="flex min-w-180 gap-2">
        <div className="flex w-14 shrink-0 flex-col">
          <div style={{ height: HEADER_HEIGHT }} />
          {hours.map((hour) => (
            <div key={hour} className="relative" style={{ height: HOUR_HEIGHT }}>
              <span className="absolute -top-2 right-1 text-xs font-medium tabular-nums text-muted-foreground">
                {String(hour).padStart(2, "0")}:00
              </span>
            </div>
          ))}
        </div>

        {weekOrder.map(({ day, label }) => {
          const dayItems = items.filter((item) => item.day === day);
          const positioned = layoutDay(dayItems);

          return (
            <div key={day} className="flex flex-1 flex-col">
              <div
                style={{ height: HEADER_HEIGHT }}
                className="flex items-center justify-center"
              >
                <h3 className="text-eyebrow">{label}</h3>
              </div>
              <div
                className="relative overflow-hidden rounded-lg bg-surface/60"
                style={{ height: gridHeight }}
              >
                {hours.map((hour, i) => (
                  <div
                    key={hour}
                    className="absolute inset-x-0 border-t border-border/70"
                    style={{ top: i * HOUR_HEIGHT }}
                  />
                ))}

                {positioned.map(({ item, lane, lanes }) => {
                  const startM = toMinutes(item.startTime) - startHour * 60;
                  const endM = toMinutes(item.endTime) - startHour * 60;
                  const top = (startM / totalMinutes) * gridHeight;
                  const height = Math.max(
                    18,
                    ((endM - startM) / totalMinutes) * gridHeight,
                  );
                  const width = 100 / lanes;
                  const left = lane * width;

                  return (
                    <div
                      key={item.id}
                      title={`${item.taskTitle} · ${item.startTime}–${item.endTime}\n${item.justification}`}
                      className={cn(
                        "group absolute overflow-hidden rounded-md border-l-2 px-1.5 py-1",
                        priorityBlockClass[item.priority],
                      )}
                      style={{
                        top,
                        height,
                        left: `${left}%`,
                        width: `calc(${width}% - 4px)`,
                      }}
                    >
                      <button
                        type="button"
                        aria-label={`Editar bloque de ${item.taskTitle}`}
                        onClick={() => editor.openEditDialog(item)}
                        className="absolute top-0.5 right-0.5 rounded p-0.5 text-foreground/50 opacity-0 transition-opacity hover:bg-background/70 hover:text-foreground focus-visible:opacity-100 group-hover:opacity-100"
                      >
                        <Pencil className="size-3" />
                      </button>
                      <p className="truncate pr-3.5 text-xs leading-tight font-medium text-foreground">
                        {item.taskTitle}
                      </p>
                      <p className="truncate text-[0.65rem] leading-tight text-muted-foreground">
                        {item.startTime}–{item.endTime}
                      </p>
                    </div>
                  );
                })}

                {dayItems.length === 0 && (
                  <p className="absolute inset-x-0 top-3 text-center text-xs text-muted-foreground/60 italic">
                    Sin bloques
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <EditPlanItemDialog
        key={editor.editingItem?.id}
        item={editor.editingItem}
        open={editor.isDialogOpen}
        onOpenChange={editor.setIsDialogOpen}
        onSubmit={editor.handleSaveBlock}
      />
    </div>
  );
}
