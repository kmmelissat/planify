import { HttpAvailabilityRepository } from "@/lib/services/http/availability-repository";
import { HttpConstraintRepository } from "@/lib/services/http/constraint-repository";
import { HttpHistoryRepository } from "@/lib/services/http/history-repository";
import { HttpPlanRepository } from "@/lib/services/http/plan-repository";
import { HttpTaskRepository } from "@/lib/services/http/task-repository";

export type {
  AvailabilityRepository,
  ConstraintRepository,
  HistoryRepository,
  PlanRepository,
  TaskRepository,
} from "@/lib/services/interfaces";

/**
 * Único punto de composición de la capa de datos. Hoy instancia los
 * repositorios HTTP contra la API real; los mocks en `src/lib/services/mock`
 * quedan disponibles solo para demos sin backend.
 */
const taskRepository = new HttpTaskRepository();
const availabilityRepository = new HttpAvailabilityRepository();
const constraintRepository = new HttpConstraintRepository();
const planRepository = new HttpPlanRepository();
const historyRepository = new HttpHistoryRepository();

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
