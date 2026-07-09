import { Card, CardContent } from "@/components/ui/card";
import { PriorityBadge } from "@/components/tasks/badges";
import type { PlanItem } from "@/lib/types";

export function PlanItemCard({ item }: { item: PlanItem }) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-1.5 p-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-medium">{item.taskTitle}</span>
          <PriorityBadge priority={item.priority} />
        </div>
        <span className="text-xs text-muted-foreground">
          {item.startTime} – {item.endTime}
        </span>
        <p className="text-xs text-muted-foreground">{item.justification}</p>
      </CardContent>
    </Card>
  );
}
