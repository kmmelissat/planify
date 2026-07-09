import type {
  AvailabilityBlock,
  Constraint,
  HistorialEntry,
  PlanGenerado,
  Task,
} from "@/lib/types";

function isoInDays(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

export const seedTasks: Task[] = [
  {
    id: "task_1",
    title: "Entregar avance de proyecto IA",
    description:
      "Preparar y subir el avance del agente de planificación académica.",
    category: "academico",
    dueDate: isoInDays(2),
    priority: "urgente",
    estimatedEffortMinutes: 180,
    status: "en_progreso",
    createdAt: isoInDays(-5),
    updatedAt: isoInDays(-1),
  },
  {
    id: "task_2",
    title: "Estudiar para parcial de bases de datos",
    description: "Repasar normalización y transacciones.",
    category: "academico",
    dueDate: isoInDays(4),
    priority: "alta",
    estimatedEffortMinutes: 120,
    status: "pendiente",
    createdAt: isoInDays(-3),
    updatedAt: isoInDays(-3),
  },
  {
    id: "task_3",
    title: "Rutina de ejercicio",
    description: "Sesión de cardio y fuerza.",
    category: "salud",
    dueDate: isoInDays(1),
    priority: "media",
    estimatedEffortMinutes: 60,
    status: "pendiente",
    createdAt: isoInDays(-2),
    updatedAt: isoInDays(-2),
  },
  {
    id: "task_4",
    title: "Pagar servicios del mes",
    description: "Luz, agua e internet.",
    category: "personal",
    dueDate: isoInDays(-1),
    priority: "media",
    estimatedEffortMinutes: 20,
    status: "atrasada",
    createdAt: isoInDays(-6),
    updatedAt: isoInDays(-6),
  },
  {
    id: "task_5",
    title: "Preparar informe semanal de trabajo",
    description: "Resumen de avances para el equipo.",
    category: "trabajo",
    dueDate: isoInDays(3),
    priority: "alta",
    estimatedEffortMinutes: 90,
    status: "reprogramada",
    createdAt: isoInDays(-4),
    updatedAt: isoInDays(0),
  },
  {
    id: "task_6",
    title: "Leer capítulo del libro de algoritmos",
    description: "Capítulo 4: técnicas de programación dinámica.",
    category: "academico",
    dueDate: isoInDays(6),
    priority: "baja",
    estimatedEffortMinutes: 45,
    status: "completada",
    createdAt: isoInDays(-7),
    updatedAt: isoInDays(-1),
  },
];

export const seedAvailabilityBlocks: AvailabilityBlock[] = [
  { id: "avail_1", day: "lunes", startTime: "18:00", endTime: "21:00" },
  { id: "avail_2", day: "martes", startTime: "18:00", endTime: "21:00" },
  { id: "avail_3", day: "miercoles", startTime: "08:00", endTime: "11:00" },
  { id: "avail_4", day: "jueves", startTime: "18:00", endTime: "21:00" },
  {
    id: "avail_5",
    day: "sabado",
    startTime: "09:00",
    endTime: "13:00",
    label: "Bloque largo de estudio",
  },
];

export const seedConstraints: Constraint[] = [
  {
    id: "constraint_1",
    type: "horario_ocupado",
    description: "Clases en la universidad",
    day: "miercoles",
    startTime: "12:00",
    endTime: "18:00",
    createdAt: isoInDays(-10),
  },
  {
    id: "constraint_2",
    type: "tarea_fija",
    description: "Reunión de equipo (trabajo)",
    day: "lunes",
    startTime: "16:00",
    endTime: "17:30",
    createdAt: isoInDays(-10),
  },
  {
    id: "constraint_3",
    type: "tiempo_maximo_sesion",
    description: "Evitar sesiones de estudio de más de 90 minutos seguidos",
    maxSessionMinutes: 90,
    createdAt: isoInDays(-10),
  },
];

export const seedPlans: PlanGenerado[] = [
  {
    id: "plan_1",
    version: 1,
    scope: "semanal",
    generatedAt: isoInDays(-1),
    approvalStatus: "aprobado",
    overallJustification:
      "Se priorizaron las tareas académicas con fecha límite más próxima, respetando la disponibilidad declarada y el límite de 90 minutos por sesión.",
    promptUsed:
      "Genera un plan semanal a partir de mis tareas pendientes, disponibilidad y restricciones registradas.",
    items: [
      {
        id: "item_1",
        taskId: "task_1",
        taskTitle: "Entregar avance de proyecto IA",
        priority: "urgente",
        day: "lunes",
        startTime: "18:00",
        endTime: "19:30",
        status: "completada",
        justification:
          "Fecha límite más próxima y prioridad urgente: se ubica en el primer bloque disponible.",
      },
      {
        id: "item_2",
        taskId: "task_2",
        taskTitle: "Estudiar para parcial de bases de datos",
        priority: "alta",
        day: "martes",
        startTime: "18:00",
        endTime: "19:30",
        status: "en_progreso",
        justification:
          "Requiere repaso extenso; se separa en sesiones de 90 minutos por la restricción de tiempo máximo.",
      },
      {
        id: "item_3",
        taskId: "task_3",
        taskTitle: "Rutina de ejercicio",
        priority: "media",
        day: "miercoles",
        startTime: "08:00",
        endTime: "09:00",
        status: "programada",
        justification:
          "Se agenda temprano para no chocar con el bloque de clases de 12:00 a 18:00.",
      },
    ],
    conflicts: [],
  },
];

export const seedHistory: HistorialEntry[] = [
  {
    id: "hist_1",
    planId: "plan_1",
    version: 1,
    scope: "semanal",
    action: "generado",
    approvalStatus: "propuesto",
    promptUsed:
      "Genera un plan semanal a partir de mis tareas pendientes, disponibilidad y restricciones registradas.",
    createdAt: isoInDays(-1),
  },
  {
    id: "hist_2",
    planId: "plan_1",
    version: 1,
    scope: "semanal",
    action: "aprobado",
    approvalStatus: "aprobado",
    promptUsed:
      "Genera un plan semanal a partir de mis tareas pendientes, disponibilidad y restricciones registradas.",
    createdAt: isoInDays(-1),
    userNote: "Se aprueba sin cambios.",
  },
];
