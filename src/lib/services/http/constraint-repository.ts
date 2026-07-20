import type { Constraint, ConstraintInput } from "@/lib/types";
import type { ConstraintRepository } from "@/lib/services/interfaces";
import { requestJson } from "@/lib/services/http/client";
import { fromBackendConstraint, toBackendConstraintCreate, toBackendConstraintUpdate } from "@/lib/services/http/mappers";
import type { BackendConstraintOut } from "@/lib/services/http/types";

export class HttpConstraintRepository implements ConstraintRepository {
  async list(): Promise<Constraint[]> {
    const constraints = await requestJson<BackendConstraintOut[]>("/constraints/");
    return constraints.map(fromBackendConstraint);
  }

  async create(input: ConstraintInput): Promise<Constraint> {
    const constraint = await requestJson<BackendConstraintOut>("/constraints/", {
      method: "POST",
      body: JSON.stringify(toBackendConstraintCreate(input)),
    });
    return fromBackendConstraint(constraint);
  }

  async update(
    id: string,
    update: Partial<ConstraintInput>,
  ): Promise<Constraint> {
    const constraint = await requestJson<BackendConstraintOut>(`/constraints/${id}`, {
      method: "PATCH",
      body: JSON.stringify(toBackendConstraintUpdate(update)),
    });
    return fromBackendConstraint(constraint);
  }

  async remove(id: string): Promise<void> {
    await requestJson<void>(`/constraints/${id}`, { method: "DELETE" });
  }
}