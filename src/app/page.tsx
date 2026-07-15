import Image from "next/image";
import Link from "next/link";
import { CalendarClock, History, ListTodo, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const features = [
  {
    icon: ListTodo,
    title: "Tareas",
    description:
      "Cargá, editá y completá tareas en segundos, con captura rápida y edición en línea.",
  },
  {
    icon: CalendarClock,
    title: "Disponibilidad y restricciones",
    description:
      "Declará tus bloques libres, horarios ocupados y límites de sesión.",
  },
  {
    icon: Sparkles,
    title: "Plan propuesto",
    description:
      "El agente organiza tu semana y explica cada decisión — vos aprobás, editás o pedís otra versión.",
  },
  {
    icon: History,
    title: "Historial y trazabilidad",
    description:
      "Cada versión del plan y cada decisión humana queda registrada.",
  },
];

const steps = [
  {
    number: "1",
    title: "Cargá tu contexto",
    description: "Tareas, disponibilidad y restricciones.",
  },
  {
    number: "2",
    title: "El agente propone",
    description: "Un plan con orden sugerido, tiempos y justificación.",
  },
  {
    number: "3",
    title: "Vos decidís",
    description:
      "Aprobá, editá, rechazá o pedí una nueva versión — nada se aplica solo.",
  },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-6 md:px-8">
        <Image
          src="/planify.svg"
          alt="Planify"
          width={624}
          height={173}
          className="h-8 w-auto"
          priority
        />
        <div className="flex items-center gap-2">
          <Button variant="outline" render={<Link href="/login" />}>
            Iniciar sesión
          </Button>
          <Button render={<Link href="/registro" />}>Crear cuenta</Button>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto flex w-full max-w-6xl flex-col items-center gap-6 px-5 py-16 text-center md:px-8 md:py-24">
          <p className="text-eyebrow">
            Agente de planificación académica y personal
          </p>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance md:text-6xl">
            Planificá tu semana con un agente que propone, vos decidís
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Cargá tus tareas, tu disponibilidad y tus restricciones. Planify
            te devuelve un plan con justificación clara — y nunca lo aplica
            sin tu aprobación.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" render={<Link href="/registro" />}>
              Crear cuenta gratis
            </Button>
            <Button size="lg" variant="outline" render={<Link href="/login" />}>
              Iniciar sesión
            </Button>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-5 pb-16 md:px-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(({ icon: Icon, title, description }) => (
              <Card key={title} className="gap-3 border-transparent bg-surface py-6">
                <CardHeader className="px-6">
                  <span className="mb-2 flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Icon className="size-4" />
                  </span>
                  <CardTitle className="text-base font-semibold">
                    {title}
                  </CardTitle>
                  <CardDescription>{description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-5 pb-24 md:px-8">
          <div className="rounded-3xl bg-primary-soft/60 px-6 py-12 md:px-12">
            <p className="text-eyebrow mb-2 text-center">Cómo funciona</p>
            <h2 className="mb-10 text-center text-2xl font-semibold tracking-tight md:text-3xl">
              Revisión humana en cada paso
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {steps.map(({ number, title, description }) => (
                <div
                  key={number}
                  className="flex flex-col items-center gap-2 text-center"
                >
                  <span className="flex size-10 items-center justify-center rounded-full bg-primary-deep text-lg font-semibold text-white">
                    {number}
                  </span>
                  <h3 className="text-base font-semibold">{title}</h3>
                  <p className="max-w-xs text-sm text-muted-foreground">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border px-5 py-8 text-center text-sm text-muted-foreground md:px-8">
        Planify — Proyecto académico de planificación con IA y revisión
        humana.
      </footer>
    </div>
  );
}
