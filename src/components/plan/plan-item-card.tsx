import { Pencil } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PriorityBadge, priorityAccentClass } from "@/components/tasks/badges";
import { cn } from "@/lib/utils";
import type { PlanItem } from "@/lib/types";

export function PlanItemCard({
  item,
  onEdit,
}: {
  item: PlanItem;
  onEdit?: (item: PlanItem) => void;
}) {
  return (
    <Card className={cn("py-0", priorityAccentClass(item.priority))}>
      <CardContent className="flex flex-col gap-2 px-4 py-3.5">
        <div className="flex items-start justify-between gap-2">
          <span className="text-sm leading-snug font-medium">
            {item.taskTitle}
          </span>
          <div className="flex shrink-0 items-center gap-1">
            <PriorityBadge priority={item.priority} />
            {onEdit && (
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={`Editar bloque de ${item.taskTitle}`}
                className="text-muted-foreground"
                onClick={() => onEdit(item)}
              >
                <Pencil className="size-3.5" />
              </Button>
            )}
          </div>
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
