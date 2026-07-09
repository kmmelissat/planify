import type { Constraint, ConstraintInput } from "@/lib/types";
import type { ConstraintRepository } from "@/lib/services/interfaces";
import { seedConstraints } from "@/lib/services/mock/seed-data";
import { generateId, networkDelay } from "@/lib/services/mock/utils";

export class MockConstraintRepository implements ConstraintRepository {
  private constraints: Constraint[] = [...seedConstraints];

  async list(): Promise<Constraint[]> {
    await networkDelay();
    return [...this.constraints];
  }

  async create(input: ConstraintInput): Promise<Constraint> {
    await networkDelay();
    const constraint: Constraint = {
      ...input,
      id: generateId("constraint"),
      createdAt: new Date().toISOString(),
    };
    this.constraints.push(constraint);
    return constraint;
  }

  async update(
    id: string,
    update: Partial<ConstraintInput>,
  ): Promise<Constraint> {
    await networkDelay();
    const index = this.constraints.findIndex(
      (constraint) => constraint.id === id,
    );
    if (index === -1) {
      throw new Error(`Restricción no encontrada: ${id}`);
    }
    const updated = { ...this.constraints[index], ...update };
    this.constraints[index] = updated;
    return updated;
  }

  async remove(id: string): Promise<void> {
    await networkDelay();
    this.constraints = this.constraints.filter(
      (constraint) => constraint.id !== id,
    );
  }
}
