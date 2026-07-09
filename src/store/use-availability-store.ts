import { create } from "zustand";
import type {
  AvailabilityBlock,
  AvailabilityBlockInput,
  Constraint,
  ConstraintInput,
} from "@/lib/types";
import {
  getAvailabilityRepository,
  getConstraintRepository,
} from "@/lib/services";

interface AvailabilityStoreState {
  blocks: AvailabilityBlock[];
  constraints: Constraint[];
  isLoading: boolean;
  error: string | null;
  fetchAll: () => Promise<void>;
  createBlock: (input: AvailabilityBlockInput) => Promise<void>;
  removeBlock: (id: string) => Promise<void>;
  createConstraint: (input: ConstraintInput) => Promise<void>;
  removeConstraint: (id: string) => Promise<void>;
}

export const useAvailabilityStore = create<AvailabilityStoreState>(
  (set) => ({
    blocks: [],
    constraints: [],
    isLoading: false,
    error: null,

    fetchAll: async () => {
      set({ isLoading: true, error: null });
      try {
        const [blocks, constraints] = await Promise.all([
          getAvailabilityRepository().listBlocks(),
          getConstraintRepository().list(),
        ]);
        set({ blocks, constraints, isLoading: false });
      } catch (error) {
        set({ error: (error as Error).message, isLoading: false });
      }
    },

    createBlock: async (input) => {
      const block = await getAvailabilityRepository().createBlock(input);
      set((state) => ({ blocks: [...state.blocks, block] }));
    },

    removeBlock: async (id) => {
      await getAvailabilityRepository().removeBlock(id);
      set((state) => ({
        blocks: state.blocks.filter((block) => block.id !== id),
      }));
    },

    createConstraint: async (input) => {
      const constraint = await getConstraintRepository().create(input);
      set((state) => ({ constraints: [...state.constraints, constraint] }));
    },

    removeConstraint: async (id) => {
      await getConstraintRepository().remove(id);
      set((state) => ({
        constraints: state.constraints.filter(
          (constraint) => constraint.id !== id,
        ),
      }));
    },
  }),
);
