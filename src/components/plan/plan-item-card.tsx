import { Card, CardContent } from "@/components/ui/card";
import { PriorityBadge, priorityAccentClass } from "@/components/tasks/badges";
import { cn } from "@/lib/utils";
import type { PlanItem } from "@/lib/types";

export function PlanItemCard({ item }: { item: PlanItem }) {
  return (
    <Card className={cn("py-0", priorityAccentClass(item.priority))}>
      <CardContent className="flex flex-col gap-2 px-4 py-3.5">
        <div className="flex items-start justify-between gap-2">
          <span className="text-sm leading-snug font-medium">
            {item.taskTitle}
          </span>
          <PriorityBadge priority={item.priority} />
        </div>
        <span className="text-xs font-medium text-muted-foreground tabular-nums">
          {item.startTime} – {item.endTime}
        </span>
        <p className="text-xs leading-relaxed text-muted-foreground">
          {item.justification}
        </p>
      </CardContent>
    </Card>
  );
}
