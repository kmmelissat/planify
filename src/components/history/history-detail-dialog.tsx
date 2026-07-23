"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { HistorialEntry } from "@/lib/types";

export function HistoryDetailDialog({ entry }: { entry: HistorialEntry }) {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button variant="link" size="sm" className="h-auto px-0 text-xs">
            Ver detalles
          </Button>
        }
      />
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Detalle de trazabilidad — versión {entry.version}</DialogTitle>
          <DialogDescription>
            {new Date(entry.createdAt).toLocaleString("es-CO")}
          </DialogDescription>
        </DialogHeader>

        <div className="flex max-h-[60vh] flex-col gap-4 overflow-y-auto pr-1">
          <div className="flex flex-col gap-1.5">
            <h4 className="text-eyebrow">Prompt usado</h4>
            <p className="max-h-48 overflow-y-auto rounded-md bg-muted/60 p-3 text-xs whitespace-pre-wrap text-foreground">
              {entry.promptUsed}
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <h4 className="text-eyebrow">Respuesta generada</h4>
            <p className="max-h-48 overflow-y-auto rounded-md bg-muted/60 p-3 text-xs whitespace-pre-wrap text-foreground">
              {entry.aiResponse ?? "No hay respuesta de IA registrada para este evento."}
            </p>
          </div>

          {entry.userNote && (
            <div className="flex flex-col gap-1.5">
              <h4 className="text-eyebrow">Nota del usuario</h4>
              <p className="rounded-md bg-muted/60 p-3 text-xs whitespace-pre-wrap text-foreground">
                {entry.userNote}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
