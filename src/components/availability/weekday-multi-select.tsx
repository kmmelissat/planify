"use client";

import { dayLabels, weekdayOrder } from "@/lib/constants/weekday";
import { cn } from "@/lib/utils";
import type { Weekday } from "@/lib/types";

const presets: { label: string; days: Weekday[] }[] = [
  {
    label: "Lunes a viernes",
    days: ["lunes", "martes", "miercoles", "jueves", "viernes"],
  },
  { label: "Fin de semana", days: ["sabado", "domingo"] },
  { label: "Todos los días", days: [...weekdayOrder] },
];

export function WeekdayMultiSelect({
  value,
  onChange,
}: {
  value: Weekday[];
  onChange: (days: Weekday[]) => void;
}) {
  function toggleDay(day: Weekday) {
    onChange(
      value.includes(day) ? value.filter((d) => d !== day) : [...value, day],
    );
  }

  function applyPreset(days: Weekday[]) {
    const allSelected = days.every((d) => value.includes(d));
    onChange(
      allSelected
        ? value.filter((d) => !days.includes(d))
        : Array.from(new Set([...value, ...days])),
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-1.5">
        {weekdayOrder.map((day) => {
          const selected = value.includes(day);
          return (
            <button
              key={day}
              type="button"
              onClick={() => toggleDay(day)}
              aria-pressed={selected}
              className={cn(
                "rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
                selected
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {dayLabels[day].slice(0, 3)}
            </button>
          );
        })}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {presets.map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={() => applyPreset(preset.days)}
            className="rounded-full border border-dashed border-border px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  );
}
