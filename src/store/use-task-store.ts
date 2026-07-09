import { create } from "zustand";
import type { Task, TaskInput, TaskUpdate } from "@/lib/types";
import { getTaskRepository } from "@/lib/services";

interface TaskStoreState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  createTask: (input: TaskInput) => Promise<void>;
  updateTask: (id: string, update: TaskUpdate) => Promise<void>;
  removeTask: (id: string) => Promise<void>;
}

export const useTaskStore = create<TaskStoreState>((set) => ({
  tasks: [],
  isLoading: false,
  error: null,

  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const tasks = await getTaskRepository().list();
      set({ tasks, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  createTask: async (input) => {
    const task = await getTaskRepository().create(input);
    set((state) => ({ tasks: [...state.tasks, task] }));
  },

  updateTask: async (id, update) => {
    const task = await getTaskRepository().update(id, update);
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? task : t)),
    }));
  },

  removeTask: async (id) => {
    await getTaskRepository().remove(id);
    set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) }));
  },
}));
