"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { addDays, format, isToday, startOfWeek } from "date-fns";
import { es } from "date-fns/locale";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CardMenu } from "@/components/panel/card-menu";
import { useAvailabilityStore } from "@/store/use-availability-store";
import { cn } from "@/lib/utils";
import type { AvailabilityBlock, Constraint, Weekday } from "@/lib/types";

const weekdayKeys: Weekday[] = [
  "lunes",
  "martes",
  "miercoles",
  "jueves",
  "viernes",
  "sabado",
  "domingo",
];

const START_HOUR = 6;
const END_HOUR = 23;
const hours = Array.from(
  { length: END_HOUR - START_HOUR },
  (_, i) => START_HOUR + i,
);

function toMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function slotOverlaps(
  slotStartMinutes: number,
  slotEndMinutes: number,
  startTime?: string,
  endTime?: string,
): boolean {
  if (!startTime || !endTime) return false;
  const start = toMinutes(startTime);
  const end = toMinutes(endTime);
  return start < slotEndMinutes && end > slotStartMinutes;
}

type CellState = "libre" | "ocupado" | "vacio";

function computeGrid(
  blocks: AvailabilityBlock[],
  constraints: Constraint[],
): Record<Weekday, CellState[]> {
  const busyConstraints = constraints.filter(
    (c) => c.type === "horario_ocupado" || c.type === "tarea_fija",
  );

  const grid = {} as Record<Weekday, CellState[]>;
  for (const day of weekdayKeys) {
    grid[day] = hours.map((hour) => {
      const slotStart = hour * 60;
      const slotEnd = slotStart + 60;

      const isBusy = busyConstraints.some(
        (c) =>
          c.day === day &&
          slotOverlaps(slotStart, slotEnd, c.startTime, c.endTime),
      );
      if (isBusy) return "ocupado";

      const isFree = blocks.some(
        (b) =>
          b.day === day &&
          slotOverlaps(slotStart, slotEnd, b.startTime, b.endTime),
      );
      if (isFree) return "libre";

      return "vacio";
    });
  }
  return grid;
}

const cellStateClass: Record<CellState, string> = {
  libre: "bg-primary",
  ocupado: "bg-ink/12",
  vacio: "bg-surface",
};

export function AvailabilityHeatmap({
  blocks,
  constraints,
  className,
}: {
  blocks: AvailabilityBlock[];
  constraints: Constraint[];
  className?: string;
}) {
  const router = useRouter();
  const fetchAll = useAvailabilityStore((state) => state.fetchAll);

  const grid = useMemo(
    () => computeGrid(blocks, constraints),
    [blocks, constraints],
  );

  const weekDates = useMemo(() => {
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    return weekdayKeys.map((key, i) => ({
      key,
      date: addDays(weekStart, i),
    }));
  }, []);

  const rangeLabel = useMemo(() => {
    const start = weekDates[0].date;
    const end = weekDates[6].date;
    return `${format(start, "d MMM", { locale: es })} – ${format(end, "d MMM", { locale: es })}`;
  }, [weekDates]);

  return (
    <Card className={cn("flex h-full flex-col py-6", className)}>
      <CardHeader className="px-6">
        <CardTitle className="flex flex-wrap items-baseline gap-2 text-xl font-semibold">
          Disponibilidad semanal
          <span className="text-sm font-normal capitalize text-muted-foreground">
            {rangeLabel}
          </span>
        </CardTitle>
        <CardAction>
          <CardMenu
            items={[
              { label: "Actualizar", onSelect: () => fetchAll() },
              {
                label: "Ver disponibilidad",
                onSelect: () => router.push("/app/disponibilidad"),
              },
            ]}
          />
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 px-6">
        <div className="overflow-x-auto">
          <div className="flex min-w-140 gap-1.5">
            <div className="flex w-11 shrink-0 flex-col gap-1 pt-11">
              {hours.map((hour) => (
                <div
                  key={hour}
                  className="flex h-6 items-center text-xs font-medium tabular-nums text-muted-foreground"
                >
                  {String(hour).padStart(2, "0")}:00
                </div>
              ))}
            </div>
            {weekDates.map(({ key: day, date }) => {
              const today = isToday(date);
              return (
                <div key={day} className="flex flex-1 flex-col gap-1">
                  <div
                    className={cn(
                      "flex flex-col items-center gap-0.5 pb-2 text-center",
                      today && "rounded-md bg-primary-soft py-1",
                    )}
                  >
                    <span
                      className={cn(
                        "text-[0.65rem] font-medium uppercase text-muted-foreground",
                        today && "text-primary-deep",
                      )}
                    >
                      {format(date, "EEE", { locale: es })}
                    </span>
                    <span
                      className={cn(
                        "text-sm font-semibold tabular-nums text-foreground",
                        today && "text-primary-deep",
                      )}
                    >
                      {format(date, "d")}
                    </span>
                  </div>
                  {grid[day].map((state, i) => (
                    <div
                      key={i}
                      className={cn(
                        "h-6 rounded-[3px]",
                        cellStateClass[state],
                      )}
                      title={`${format(date, "EEEE d", { locale: es })} ${String(hours[i]).padStart(2, "0")}:00 — ${state}`}
                    />
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-[3px] bg-primary" aria-hidden />
            Libre
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-[3px] bg-ink/12" aria-hidden />
            Ocupado
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-[3px] bg-surface" aria-hidden />
            Sin datos
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
