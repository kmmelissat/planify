"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { navItems } from "@/components/layout/nav-items";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function SidebarNav({ isCollapsed }: { isCollapsed: boolean }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1 p-3">
      {navItems.map((item) => {
        const isActive =
          item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        const Icon = item.icon;

        const linkContent = (
          <Link
            href={item.href}
            aria-label={item.label}
            className={cn(
              "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm outline-none transition-colors",
              "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar",
              isCollapsed && "justify-center px-2",
              isActive
                ? "bg-primary text-primary-foreground font-medium"
                : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground",
            )}
          >
            <Icon className="size-4 shrink-0" />
            {!isCollapsed && (
              <span className="flex flex-col leading-tight">
                <span>{item.label}</span>
                <span
                  className={cn(
                    "text-xs",
                    isActive
                      ? "text-primary-foreground/80"
                      : "text-muted-foreground/80",
                  )}
                >
                  {item.description}
                </span>
              </span>
            )}
          </Link>
        );

        if (!isCollapsed) {
          return <div key={item.href}>{linkContent}</div>;
        }

        return (
          <Tooltip key={item.href}>
            <TooltipTrigger render={linkContent} />
            <TooltipContent side="right">{item.label}</TooltipContent>
          </Tooltip>
        );
      })}
    </nav>
  );
}
