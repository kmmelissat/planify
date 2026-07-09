import type { AvailabilityBlock, AvailabilityBlockInput } from "@/lib/types";
import type { AvailabilityRepository } from "@/lib/services/interfaces";
import { seedAvailabilityBlocks } from "@/lib/services/mock/seed-data";
import { generateId, networkDelay } from "@/lib/services/mock/utils";

export class MockAvailabilityRepository implements AvailabilityRepository {
  private blocks: AvailabilityBlock[] = [...seedAvailabilityBlocks];

  async listBlocks(): Promise<AvailabilityBlock[]> {
    await networkDelay();
    return [...this.blocks];
  }

  async createBlock(input: AvailabilityBlockInput): Promise<AvailabilityBlock> {
    await networkDelay();
    const block: AvailabilityBlock = { ...input, id: generateId("avail") };
    this.blocks.push(block);
    return block;
  }

  async updateBlock(
    id: string,
    update: Partial<AvailabilityBlockInput>,
  ): Promise<AvailabilityBlock> {
    await networkDelay();
    const index = this.blocks.findIndex((block) => block.id === id);
    if (index === -1) {
      throw new Error(`Bloque de disponibilidad no encontrado: ${id}`);
    }
    const updated = { ...this.blocks[index], ...update };
    this.blocks[index] = updated;
    return updated;
  }

  async removeBlock(id: string): Promise<void> {
    await networkDelay();
    this.blocks = this.blocks.filter((block) => block.id !== id);
  }
}
