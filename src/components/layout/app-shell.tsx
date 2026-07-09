import type { ReactNode } from "react";
import { Sparkles } from "lucide-react";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { MobileNav } from "@/components/layout/mobile-nav";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      <aside className="hidden w-64 shrink-0 border-r bg-card md:flex md:flex-col">
        <div className="flex items-center gap-2 border-b px-4 py-4">
          <Sparkles className="size-5 text-primary" />
          <div className="flex flex-col leading-tight">
            <span className="font-semibold">Planify</span>
            <span className="text-xs text-muted-foreground">
              Agente de planificación
            </span>
          </div>
        </div>
        <SidebarNav />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex flex-col gap-3 border-b px-4 py-3 md:hidden">
          <div className="flex items-center gap-2">
            <Sparkles className="size-5 text-primary" />
            <span className="font-semibold">Planify</span>
          </div>
          <MobileNav />
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
