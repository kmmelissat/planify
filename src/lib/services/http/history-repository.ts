import type { HistorialEntry } from "@/lib/types";
import type { HistoryRepository } from "@/lib/services/interfaces";
import { requestJson } from "@/lib/services/http/client";
import { fromBackendHistory } from "@/lib/services/http/mappers";
import type { BackendHistoryEntryOut } from "@/lib/services/http/types";

export class HttpHistoryRepository implements HistoryRepository {
  async list(): Promise<HistorialEntry[]> {
    const entries = await requestJson<BackendHistoryEntryOut[]>("/plans/history");
    return entries.map(fromBackendHistory);
  }

  async append(entry: HistorialEntry): Promise<HistorialEntry> {
    return entry;
  }
}