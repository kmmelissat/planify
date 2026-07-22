"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/store/use-sidebar-store";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { clearDemoSession } from "@/lib/auth/demo-session";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function Sidebar() {
  const router = useRouter();
  const { isCollapsed, toggleCollapsed } = useSidebarStore();

  function handleLogout() {
    clearDemoSession();
    router.push("/login");
  }

  return (
    <aside
      className={cn(
        "hidden shrink-0 flex-col rounded-[28px] bg-sidebar/70 text-sidebar-foreground shadow-xl shadow-primary/10 backdrop-blur-2xl backdrop-saturate-150 md:flex",
        "md:sticky md:top-4 md:h-[calc(100vh-2rem)]",
        "transition-[width] duration-200 ease-out",
        isCollapsed ? "w-[76px]" : "w-72",
      )}
    >
      <div
        className={cn(
          "flex w-full items-center py-6",
          isCollapsed ? "justify-center" : "px-6",
        )}
      >
        {isCollapsed ? (
          <Image
            src="/planify-iso.svg"
            alt="Planify"
            width={32}
            height={32}
            className="mx-auto size-8"
            priority
          />
        ) : (
          <Image
            src="/planify.svg"
            alt="Planify"
            width={624}
            height={173}
            className="h-8 w-auto"
            priority
          />
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        <SidebarNav isCollapsed={isCollapsed} />
      </div>

      <div
        className={cn(
          "p-3",
          isCollapsed && "flex justify-center",
        )}
      >
        <div className="flex flex-col gap-2">
          <Tooltip>
            <TooltipTrigger
              onClick={toggleCollapsed}
              aria-label={isCollapsed ? "Expandir menú" : "Colapsar menú"}
              className={cn(
                "flex items-center gap-2 rounded-full px-3 py-2 text-sm text-muted-foreground outline-none transition-colors",
                "hover:bg-sidebar-accent hover:text-foreground",
                "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar",
                isCollapsed && "px-2",
              )}
            >
              {isCollapsed ? (
                <PanelLeftOpen className="size-4" />
              ) : (
                <PanelLeftClose className="size-4" />
              )}
              {!isCollapsed && <span>Colapsar</span>}
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right">Expandir menú</TooltipContent>
            )}
          </Tooltip>

          <Button
            type="button"
            variant="outline"
            size={isCollapsed ? "icon" : "sm"}
            onClick={handleLogout}
            className={cn(isCollapsed ? "mx-auto" : "justify-start")}
          >
            {isCollapsed ? "⇥" : "Cerrar sesión"}
          </Button>
        </div>
      </div>
    </aside>
  );
}
