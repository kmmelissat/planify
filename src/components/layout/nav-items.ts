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
    href: "/",
    label: "Panel",
    description: "Seguimiento general",
    icon: LayoutDashboard,
  },
  {
    href: "/plan",
    label: "Tareas y Plan",
    description: "Gestión de tareas y propuesta del agente",
    icon: Sparkles,
  },
  {
    href: "/disponibilidad",
    label: "Disponibilidad",
    description: "Bloques y restricciones",
    icon: CalendarClock,
  },
  {
    href: "/historial",
    label: "Historial",
    description: "Trazabilidad humano-IA",
    icon: History,
  },
];
