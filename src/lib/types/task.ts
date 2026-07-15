export type TaskCategory =
  | "academico"
  | "personal"
  | "trabajo"
  | "salud"
  | "otro";

export type TaskPriority = "baja" | "media" | "alta" | "urgente";

export type TaskStatus =
  | "pendiente"
  | "en_progreso"
  | "completada"
  | "atrasada"
  | "reprogramada";

export interface Task {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  dueDate?: string; // ISO 8601
  priority: TaskPriority;
  estimatedEffortMinutes: number;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

export type TaskInput = Omit<Task, "id" | "createdAt" | "updatedAt">;

export type TaskUpdate = Partial<TaskInput>;
