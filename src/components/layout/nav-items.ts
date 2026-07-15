import {
  CalendarClock,
  History,
  LayoutDashboard,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  description: string;
  icon: LucideIcon;
}

export const navItems: NavItem[] = [
  {
    href: "/app",
    label: "Panel",
    description: "Seguimiento general",
    icon: LayoutDashboard,
  },
  {
    href: "/app/plan",
    label: "Tareas y Plan",
    description: "Gestión de tareas y propuesta del agente",
    icon: Sparkles,
  },
  {
    href: "/app/disponibilidad",
    label: "Disponibilidad",
    description: "Bloques y restricciones",
    icon: CalendarClock,
  },
  {
    href: "/app/historial",
    label: "Historial",
    description: "Trazabilidad humano-IA",
    icon: History,
  },
];
