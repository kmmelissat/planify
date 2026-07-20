import type { Task, TaskInput, TaskUpdate } from "@/lib/types";
import type { TaskRepository } from "@/lib/services/interfaces";
import { requestJson } from "@/lib/services/http/client";
import { fromBackendTask, toBackendTaskCreate, toBackendTaskUpdate } from "@/lib/services/http/mappers";
import type { BackendTaskOut } from "@/lib/services/http/types";

export class HttpTaskRepository implements TaskRepository {
  async list(): Promise<Task[]> {
    const tasks = await requestJson<BackendTaskOut[]>("/tasks/");
    return tasks.map(fromBackendTask);
  }

  async getById(id: string): Promise<Task | null> {
    try {
      const task = await requestJson<BackendTaskOut>(`/tasks/${id}`);
      return fromBackendTask(task);
    } catch {
      return null;
    }
  }

  async create(input: TaskInput): Promise<Task> {
    const task = await requestJson<BackendTaskOut>("/tasks/", {
      method: "POST",
      body: JSON.stringify(toBackendTaskCreate(input)),
    });
    return fromBackendTask(task);
  }

  async update(id: string, update: TaskUpdate): Promise<Task> {
    const task = await requestJson<BackendTaskOut>(`/tasks/${id}`, {
      method: "PATCH",
      body: JSON.stringify(toBackendTaskUpdate(update)),
    });
    return fromBackendTask(task);
  }

  async remove(id: string): Promise<void> {
    await requestJson<void>(`/tasks/${id}`, { method: "DELETE" });
  }
}