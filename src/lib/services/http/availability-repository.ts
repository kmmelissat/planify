import type { AvailabilityBlock, AvailabilityBlockInput } from "@/lib/types";
import type { AvailabilityRepository } from "@/lib/services/interfaces";
import { requestJson } from "@/lib/services/http/client";
import { fromBackendAvailability, toBackendAvailabilityCreate } from "@/lib/services/http/mappers";
import type { BackendAvailabilityOut } from "@/lib/services/http/types";

export class HttpAvailabilityRepository implements AvailabilityRepository {
  async listBlocks(): Promise<AvailabilityBlock[]> {
    const blocks = await requestJson<BackendAvailabilityOut[]>("/availability/");
    return blocks.map(fromBackendAvailability);
  }

  async createBlock(input: AvailabilityBlockInput): Promise<AvailabilityBlock> {
    const block = await requestJson<BackendAvailabilityOut>("/availability/", {
      method: "POST",
      body: JSON.stringify(toBackendAvailabilityCreate(input)),
    });
    return fromBackendAvailability(block);
  }

  async updateBlock(
    id: string,
    update: Partial<AvailabilityBlockInput>,
  ): Promise<AvailabilityBlock> {
    const block = await requestJson<BackendAvailabilityOut>(`/availability/${id}`, {
      method: "PATCH",
      body: JSON.stringify({
        ...(update.day !== undefined ? { day: update.day } : {}),
        ...(update.startTime !== undefined ? { start_time: update.startTime } : {}),
        ...(update.endTime !== undefined ? { end_time: update.endTime } : {}),
        ...(update.label !== undefined ? { label: update.label } : {}),
      }),
    });
    return fromBackendAvailability(block);
  }

  async removeBlock(id: string): Promise<void> {
    await requestJson<void>(`/availability/${id}`, { method: "DELETE" });
  }
}