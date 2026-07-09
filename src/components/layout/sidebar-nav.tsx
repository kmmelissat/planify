"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { navItems } from "@/components/layout/nav-items";

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1 p-3">
      {navItems.map((item) => {
        const isActive =
          item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
              isActive
                ? "bg-primary text-primary-foreground font-medium"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Icon className="size-4 shrink-0" />
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
          </Link>
        );
      })}
    </nav>
  );
}
