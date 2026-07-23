"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Check, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getApiErrorMessage } from "@/lib/services/api-error";
import {
  parseBulkTasksInput,
  type BulkTaskParseResult,
} from "@/lib/tasks/parse-bulk-tasks";
import type { TaskInput } from "@/lib/types";

const PLACEHOLDER = `Entrega proyecto final de IA | Académico | 2026-07-24 | Urgente | 240 | Pendiente
Estudiar para parcial de Bases de Datos | Académico | 2026-07-27 | Alta | 180
Entrenar en el gimnasio | Salud | | Baja | 60`;

export function BulkAddTasksDialog({
  open,
  onOpenChange,
  onCreateTask,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateTask: (input: TaskInput) => Promise<void>;
}) {
  const [text, setText] = useState("");
  const [results, setResults] = useState<BulkTaskParseResult[] | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pendingCount = useMemo(
    () => parseBulkTasksInput(text).filter((r) => r.input).length,
    [text],
  );

  function handleOpenChange(next: boolean) {
    if (!next) {
      setText("");
      setResults(null);
    }
    onOpenChange(next);
  }

  async function handleImport() {
    const parsed = parseBulkTasksInput(text);
    if (parsed.length === 0) return;

    setIsSubmitting(true);
    const outcomes: BulkTaskParseResult[] = [];

    for (const item of parsed) {
      if (!item.input) {
        outcomes.push(item);
        continue;
      }
      try {
        await onCreateTask(item.input);
        outcomes.push(item);
      } catch (error) {
        outcomes.push({ ...item, error: getApiErrorMessage(error) });
      }
    }

    setResults(outcomes);
    setText("");
    setIsSubmitting(false);

    const succeeded = outcomes.filter((r) => r.input && !r.error).length;
    const failed = outcomes.length - succeeded;
    if (failed === 0) {
      toast.success(`${succeeded} tareas creadas.`);
    } else {
      toast.error(`${succeeded} tareas creadas, ${failed} con errores.`);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Importar tareas en lote</DialogTitle>
          <DialogDescription>
            Una tarea por línea:{" "}
            <span className="font-medium text-foreground">
              Título | Categoría | Fecha límite | Prioridad | Esfuerzo (min) | Estado
            </span>
            . Solo el título es obligatorio — podés dejar el resto vacío. También
            podés pegar una tabla directo, sea el markdown crudo (con "|") o una
            tabla ya renderizada copiada tal cual (Excel, Sheets, una página).
          </DialogDescription>
        </DialogHeader>

        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={PLACEHOLDER}
          rows={8}
          className="font-mono text-xs"
          disabled={isSubmitting}
        />

        {results && (
          <ScrollArea className="max-h-48 rounded-lg border border-border">
            <ul className="flex flex-col divide-y divide-border">
              {results.map((result, i) => (
                <li
                  key={`${result.line}-${i}`}
                  className="flex items-start gap-2 px-3 py-2 text-xs"
                >
                  {result.input && !result.error ? (
                    <Check className="mt-0.5 size-3.5 shrink-0 text-status-completada" />
                  ) : (
                    <X className="mt-0.5 size-3.5 shrink-0 text-destructive" />
                  )}
                  <div className="flex flex-col gap-0.5">
                    <span className="font-medium">
                      {result.input?.title ?? result.line}
                    </span>
                    {result.error && (
                      <span className="text-destructive">{result.error}</span>
                    )}
                    {result.note && !result.error && (
                      <span className="text-muted-foreground">{result.note}</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </ScrollArea>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
          >
            Cerrar
          </Button>
          <Button
            type="button"
            onClick={handleImport}
            disabled={isSubmitting || pendingCount === 0}
          >
            {isSubmitting
              ? "Importando..."
              : `Importar${pendingCount ? ` ${pendingCount} tareas` : ""}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
