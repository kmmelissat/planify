import { MockAvailabilityRepository } from "@/lib/services/mock/mock-availability-repository";
import { MockConstraintRepository } from "@/lib/services/mock/mock-constraint-repository";
import { MockHistoryRepository } from "@/lib/services/mock/mock-history-repository";
import { MockPlanRepository } from "@/lib/services/mock/mock-plan-repository";
import { MockTaskRepository } from "@/lib/services/mock/mock-task-repository";

export type {
  AvailabilityRepository,
  ConstraintRepository,
  HistoryRepository,
  PlanRepository,
  TaskRepository,
} from "@/lib/services/interfaces";

/**
 * Punto central de composición de la capa de datos. La interfaz está conectada
 * a repositorios en memoria para que la demo funcione íntegramente sin backend.
 * Si más adelante se conecta una API real, este archivo es el único lugar que
 * debería cambiar para intercambiar las implementaciones.
 */
const taskRepository = new MockTaskRepository();
const availabilityRepository = new MockAvailabilityRepository();
const constraintRepository = new MockConstraintRepository();
const planRepository = new MockPlanRepository();
const historyRepository = new MockHistoryRepository();

export function getTaskRepository() {
  return taskRepository;
}

export function getAvailabilityRepository() {
  return availabilityRepository;
}

export function getConstraintRepository() {
  return constraintRepository;
}

export function getPlanRepository() {
  return planRepository;
}

export function getHistoryRepository() {
  return historyRepository;
}
