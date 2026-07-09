/** Simula la latencia de una llamada de red real para que la UI se comporte igual cuando se swap-ee a fetch/axios. */
export function networkDelay(ms = 250): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export { generateId } from "@/lib/utils";
