import { categoryLabels, priorityLabels, statusLabels } from "@/components/tasks/badges";
import type { TaskCategory, TaskInput, TaskPriority, TaskStatus } from "@/lib/types";

export interface BulkTaskParseResult {
  line: string;
  input?: TaskInput;
  note?: string;
  error?: string;
}

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function reverseLookup<K extends string>(
  labels: Record<K, string>,
  raw: string | undefined,
): K | null {
  if (!raw?.trim()) return null;
  const target = normalize(raw);
  const entry = (Object.entries(labels) as [K, string][]).find(
    ([key, label]) => normalize(label) === target || normalize(key) === target,
  );
  return entry ? entry[0] : null;
}

function isSeparatorRow(line: string): boolean {
  return /^\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?$/.test(line);
}

/**
 * Divide una línea en celdas. Soporta pegar markdown crudo (con "|") y
 * también una tabla ya renderizada copiada tal cual: al copiar un <table>
 * del navegador, el portapapeles suele separar celdas con tabs (o varios
 * espacios) en vez de "|", así que probamos esos delimitadores en orden.
 */
function splitCells(line: string): string[] {
  if (line.includes("|")) {
    return line
      .replace(/^\|/, "")
      .replace(/\|$/, "")
      .split("|")
      .map((cell) => cell.trim());
  }
  if (line.includes("\t")) {
    return line.split("\t").map((cell) => cell.trim());
  }
  if (/\s{2,}/.test(line)) {
    return line.split(/\s{2,}/).map((cell) => cell.trim());
  }
  return [line.trim()];
}

function todayDateString(): string {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Acepta una tarea por línea, con campos separados por "|" en el orden
 * Título | Categoría | Fecha límite | Prioridad | Esfuerzo | Estado. Todo
 * menos el título es opcional. Compatible con filas de tabla markdown
 * (pipes al borde, fila de encabezado y de separador se ignoran), así se
 * puede pegar directo una lista generada como tabla.
 */
export function parseBulkTasksInput(text: string): BulkTaskParseResult[] {
  const results: BulkTaskParseResult[] = [];
  const today = todayDateString();

  for (const rawLine of text.split("\n")) {
    const line = rawLine.trim();
    if (!line || isSeparatorRow(line)) continue;

    const cells = splitCells(line);

    const [titleRaw, categoryRaw, dateRaw, priorityRaw, effortRaw, statusRaw] = cells;
    if (normalize(titleRaw ?? "") === "titulo") continue; // fila de encabezado

    const title = titleRaw?.trim();
    if (!title) {
      results.push({ line, error: "Falta el título." });
      continue;
    }

    const notes: string[] = [];

    const categoryMatch = reverseLookup<TaskCategory>(categoryLabels, categoryRaw);
    if (categoryRaw && !categoryMatch) {
      notes.push(`categoría "${categoryRaw}" no reconocida, se usó Personal`);
    }

    const priorityMatch = reverseLookup<TaskPriority>(priorityLabels, priorityRaw);
    if (priorityRaw && !priorityMatch) {
      notes.push(`prioridad "${priorityRaw}" no reconocida, se usó Media`);
    }

    const statusMatch = reverseLookup<TaskStatus>(statusLabels, statusRaw);
    if (statusRaw && !statusMatch) {
      notes.push(`estado "${statusRaw}" no reconocido, se usó Pendiente`);
    }

    let dueDate: string | undefined;
    if (dateRaw) {
      if (!DATE_RE.test(dateRaw)) {
        notes.push(`fecha "${dateRaw}" inválida (usar AAAA-MM-DD), se omitió`);
      } else if (dateRaw < today) {
        notes.push(`fecha "${dateRaw}" ya pasó, se omitió`);
      } else {
        dueDate = new Date(dateRaw).toISOString();
      }
    }

    let estimatedEffortMinutes = 30;
    if (effortRaw) {
      // Acepta "240", "240 min" o "240 minutos" — toma el primer número de la celda.
      const digits = effortRaw.match(/\d+(\.\d+)?/)?.[0];
      const parsed = digits ? Number(digits) : NaN;
      if (Number.isFinite(parsed) && parsed > 0) {
        estimatedEffortMinutes = parsed;
      } else {
        notes.push(`esfuerzo "${effortRaw}" inválido, se usaron 30 min`);
      }
    }

    results.push({
      line,
      input: {
        title,
        description: "",
        category: categoryMatch ?? "personal",
        dueDate,
        priority: priorityMatch ?? "media",
        estimatedEffortMinutes,
        status: statusMatch ?? "pendiente",
      },
      note: notes.length ? notes.join("; ") : undefined,
    });
  }

  return results;
}
