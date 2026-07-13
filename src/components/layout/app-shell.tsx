import type { ReactNode } from "react";
import Image from "next/image";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-background text-foreground md:h-screen md:gap-4 md:overflow-hidden md:p-4">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex flex-col gap-3 border-b border-border px-5 py-4 md:hidden">
          <Image
            src="/planify.svg"
            alt="Planify"
            width={624}
            height={173}
            className="h-7 w-auto"
            priority
          />
          <MobileNav />
        </header>
        <main className="flex-1 overflow-y-auto px-5 py-8 md:px-8 md:py-10">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
