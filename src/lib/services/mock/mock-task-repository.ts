import type { Task, TaskInput, TaskUpdate } from "@/lib/types";
import type { TaskRepository } from "@/lib/services/interfaces";
import { seedTasks } from "@/lib/services/mock/seed-data";
import { generateId, networkDelay } from "@/lib/services/mock/utils";

/** Implementación in-memory de TaskRepository. Swap a una versión con fetch/axios sin tocar la UI. */
export class MockTaskRepository implements TaskRepository {
  private tasks: Task[] = [...seedTasks];

  async list(): Promise<Task[]> {
    await networkDelay();
    return [...this.tasks];
  }

  async getById(id: string): Promise<Task | null> {
    await networkDelay();
    return this.tasks.find((task) => task.id === id) ?? null;
  }

  async create(input: TaskInput): Promise<Task> {
    await networkDelay();
    const now = new Date().toISOString();
    const task: Task = {
      ...input,
      id: generateId("task"),
      createdAt: now,
      updatedAt: now,
    };
    this.tasks.push(task);
    return task;
  }

  async update(id: string, update: TaskUpdate): Promise<Task> {
    await networkDelay();
    const index = this.tasks.findIndex((task) => task.id === id);
    if (index === -1) {
      throw new Error(`Tarea no encontrada: ${id}`);
    }
    const updated: Task = {
      ...this.tasks[index],
      ...update,
      updatedAt: new Date().toISOString(),
    };
    this.tasks[index] = updated;
    return updated;
  }

  async remove(id: string): Promise<void> {
    await networkDelay();
    this.tasks = this.tasks.filter((task) => task.id !== id);
  }
}
