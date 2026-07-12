import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SidebarStoreState {
  isCollapsed: boolean;
  toggleCollapsed: () => void;
}

/** Preferencia de colapso del sidebar (solo desktop), persistida por sesión. */
export const useSidebarStore = create<SidebarStoreState>()(
  persist(
    (set) => ({
      isCollapsed: false,
      toggleCollapsed: () =>
        set((state) => ({ isCollapsed: !state.isCollapsed })),
    }),
    {
      name: "planify-sidebar",
      storage: {
        getItem: (name) => {
          if (typeof window === "undefined") return null;
          const value = window.sessionStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: (name, value) => {
          window.sessionStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          window.sessionStorage.removeItem(name);
        },
      },
    },
  ),
);
