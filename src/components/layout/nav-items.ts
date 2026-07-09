import {
  CalendarClock,
  History,
  LayoutDashboard,
  ListTodo,
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
    href: "/tareas",
    label: "Tareas",
    description: "Gestión de tareas",
    icon: ListTodo,
  },
  {
    href: "/disponibilidad",
    label: "Disponibilidad",
    description: "Bloques y restricciones",
    icon: CalendarClock,
  },
  {
    href: "/plan",
    label: "Plan",
    description: "Propuesta del agente",
    icon: Sparkles,
  },
  {
    href: "/historial",
    label: "Historial",
    description: "Trazabilidad humano-IA",
    icon: History,
  },
];
