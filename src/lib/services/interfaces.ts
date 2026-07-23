import type {
  AvailabilityBlock,
  AvailabilityBlockInput,
  Constraint,
  ConstraintInput,
  HistorialEntry,
  PlanGenerado,
  Task,
  TaskInput,
  TaskUpdate,
} from "@/lib/types";

/**
 * Todos los métodos son async y devuelven Promise: la firma coincide con lo
 * que devuelve el cliente fetch contra la API real (src/lib/services/http).
 */

export interface TaskRepository {
  list(): Promise<Task[]>;
  getById(id: string): Promise<Task | null>;
  create(input: TaskInput): Promise<Task>;
  update(id: string, update: TaskUpdate): Promise<Task>;
  remove(id: string): Promise<void>;
}

export interface AvailabilityRepository {
  listBlocks(): Promise<AvailabilityBlock[]>;
  createBlock(input: AvailabilityBlockInput): Promise<AvailabilityBlock>;
  updateBlock(
    id: string,
    update: Partial<AvailabilityBlockInput>,
  ): Promise<AvailabilityBlock>;
  removeBlock(id: string): Promise<void>;
}

export interface ConstraintRepository {
  list(): Promise<Constraint[]>;
  create(input: ConstraintInput): Promise<Constraint>;
  update(id: string, update: Partial<ConstraintInput>): Promise<Constraint>;
  remove(id: string): Promise<void>;
}

export interface PlanRepository {
  list(): Promise<PlanGenerado[]>;
  getById(id: string): Promise<PlanGenerado | null>;
  getLatest(): Promise<PlanGenerado | null>;
  save(plan: PlanGenerado): Promise<PlanGenerado>;
  updateApprovalStatus(
    id: string,
    status: PlanGenerado["approvalStatus"],
    userNote?: string,
  ): Promise<PlanGenerado>;
}

export interface HistoryRepository {
  list(): Promise<HistorialEntry[]>;
  append(entry: HistorialEntry): Promise<HistorialEntry>;
}
