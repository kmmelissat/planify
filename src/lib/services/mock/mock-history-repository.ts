import type { HistorialEntry } from "@/lib/types";
import type { HistoryRepository } from "@/lib/services/interfaces";
import { seedHistory } from "@/lib/services/mock/seed-data";
import { networkDelay } from "@/lib/services/mock/utils";

export class MockHistoryRepository implements HistoryRepository {
  private entries: HistorialEntry[] = [...seedHistory];

  async list(): Promise<HistorialEntry[]> {
    await networkDelay();
    return [...this.entries].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }

  async append(entry: HistorialEntry): Promise<HistorialEntry> {
    await networkDelay();
    this.entries.push(entry);
    return entry;
  }
}
