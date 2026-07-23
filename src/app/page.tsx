"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "motion/react";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  CalendarClock,
  History,
  ListTodo,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PriorityBadge, priorityAccentClass } from "@/components/tasks/badges";
import type { TaskPriority } from "@/lib/types/task";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.09, ease: [0.16, 1, 0.3, 1] },
  }),
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const heroWords = "Planificá tu semana con un agente que propone, vos decidís".split(
  " "
);

const previewItems: {
  title: string;
  priority: TaskPriority;
  time: string;
  justification: string;
}[] = [
  {
    title: "Entrega proyecto IA",
    priority: "urgente",
    time: "09:00 – 11:00",
    justification: "Vence mañana; se ubica en tu bloque de mayor foco.",
  },
  {
    title: "Estudiar para parcial",
    priority: "alta",
    time: "11:30 – 13:00",
    justification: "Prioridad académica alta con examen esta semana.",
  },
  {
    title: "Gimnasio",
    priority: "baja",
    time: "18:00 – 19:00",
    justification: "Cae en tu bloque libre de la tarde, sin conflictos.",
  },
];

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

const trustChips = [
  { icon: ShieldCheck, label: "Nada se aplica sin tu aprobación" },
  { icon: AlertTriangle, label: "Avisa sobrecargas y conflictos" },
  { icon: History, label: "Cada versión queda en el historial" },
];

function BackgroundDecor() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <motion.div
        className="absolute -top-32 -left-24 size-112 rounded-full bg-primary-soft/70 blur-3xl"
        animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-40 -right-32 size-104 rounded-full bg-accent-bright/20 blur-3xl"
        animate={{ x: [0, -25, 0], y: [0, 30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(var(--border)_1px,transparent_1px)] bg-size-[26px_26px] opacity-40 mask-[radial-gradient(ellipse_60%_60%_at_50%_0%,black,transparent)]"
      />
    </div>
  );
}

function PlanPreviewCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotate: -2 }}
      animate={{ opacity: 1, y: 0, rotate: -2 }}
      transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="relative mx-auto w-full max-w-md"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative"
      >
        <Card className="gap-4 rounded-3xl border-transparent bg-card p-1 shadow-2xl shadow-primary/10 ring-1 ring-foreground/10">
          <div className="flex items-center justify-between px-4 pt-3">
            <div className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-priority-baja/60" />
              <span className="size-2.5 rounded-full bg-priority-alta/60" />
              <span className="size-2.5 rounded-full bg-priority-urgente/60" />
            </div>
            <Badge variant="outline" className="font-medium text-muted-foreground">
              Propuesto · v3
            </Badge>
          </div>

          <div className="flex flex-col gap-2 px-4">
            <p className="text-eyebrow">Semana del 20 al 26 de julio</p>
            {previewItems.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + i * 0.12 }}
              >
                <Card
                  size="sm"
                  className={`gap-1 rounded-xl bg-surface/60 ${priorityAccentClass(
                    item.priority
                  )}`}
                >
                  <div className="flex items-center justify-between px-3 pt-0.5">
                    <span className="text-sm font-semibold">{item.title}</span>
                    <PriorityBadge priority={item.priority} />
                  </div>
                  <p className="px-3 text-xs font-medium text-muted-foreground">
                    {item.time}
                  </p>
                  <p className="px-3 pb-0.5 text-xs text-muted-foreground">
                    {item.justification}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="flex items-center justify-between gap-2 border-t border-border px-4 py-3">
            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <Sparkles className="size-3.5 text-primary" />
              Justificación disponible por tarea
            </span>
            <div className="flex items-center gap-1.5">
              <Button size="icon-sm" variant="outline" aria-label="Rechazar">
                <X className="size-3.5" />
              </Button>
              <Button size="icon-sm" aria-label="Aprobar">
                <Check className="size-3.5" />
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: [0, 8, 0] }}
        transition={{
          opacity: { duration: 0.5, delay: 1.1 },
          scale: { duration: 0.5, delay: 1.1 },
          y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.1 },
        }}
        className="absolute -bottom-8 -left-10 hidden w-60 sm:block"
      >
        <Alert className="rounded-2xl border-priority-alta/30 bg-card shadow-xl shadow-priority-alta/10">
          <AlertTriangle className="text-priority-alta" />
          <AlertTitle className="text-xs">Sobrecarga el jueves</AlertTitle>
          <AlertDescription className="text-xs">
            6.5 h planificadas en un bloque de 4 h disponibles.
          </AlertDescription>
        </Alert>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1, rotate: [0, 3, 0] }}
        transition={{
          opacity: { duration: 0.5, delay: 1.3 },
          scale: { duration: 0.5, delay: 1.3 },
          rotate: { duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1.3 },
        }}
        className="absolute -top-6 -right-6 hidden sm:block"
      >
        <Badge className="gap-1 rounded-full bg-status-completada px-3 py-2.5 text-xs text-white shadow-lg shadow-status-completada/30">
          <Check className="size-3.5" />
          Revisado por vos
        </Badge>
      </motion.div>
    </motion.div>
  );
}

export default function LandingPage() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-background text-foreground">
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 border-b border-border/60 bg-background/75 backdrop-blur-md"
      >
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-4 md:px-8">
          <Image
            src="/planify.svg"
            alt="Planify"
            width={624}
            height={173}
            className="h-7 w-auto"
            priority
          />
          <div className="flex items-center gap-2">
            <Button variant="outline" render={<Link href="/login" />}>
              Iniciar sesión
            </Button>
            <Button render={<Link href="/registro" />}>Crear cuenta</Button>
          </div>
        </div>
      </motion.header>

      <main className="flex-1">
        <section className="relative mx-auto w-full max-w-6xl px-5 pt-16 pb-20 md:px-8 md:pt-24 md:pb-28">
          <BackgroundDecor />

          <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
            <div className="flex flex-col items-start gap-6 text-left">
              <motion.span
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1 text-eyebrow text-primary-deep"
              >
                <Sparkles className="size-3.5" />
                Agente de planificación académica y personal
              </motion.span>

              <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-balance md:text-6xl">
                {heroWords.map((word, i) => (
                  <motion.span
                    key={`${word}-${i}`}
                    custom={i}
                    initial="hidden"
                    animate="visible"
                    variants={fadeUp}
                    className="mr-[0.3ch] inline-block"
                  >
                    {word}
                  </motion.span>
                ))}
              </h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
                className="max-w-lg text-lg leading-relaxed text-muted-foreground"
              >
                Cargá tus tareas, tu disponibilidad y tus restricciones.
                Planify te devuelve un plan con justificación clara — y nunca
                lo aplica sin tu aprobación.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.05 }}
                className="flex flex-wrap items-center gap-3"
              >
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button size="lg" render={<Link href="/registro" />} className="gap-1.5">
                    Crear cuenta gratis
                    <ArrowRight className="size-4" />
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button
                    size="lg"
                    variant="outline"
                    render={<Link href="/login" />}
                  >
                    Iniciar sesión
                  </Button>
                </motion.div>
              </motion.div>

              <motion.div
                initial="hidden"
                animate="visible"
                variants={stagger}
                transition={{ delayChildren: 1.2 }}
                className="flex flex-wrap gap-2 pt-2"
              >
                {trustChips.map(({ icon: Icon, label }) => (
                  <motion.span
                    key={label}
                    variants={fadeUp}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface/70 px-3 py-1.5 text-xs font-medium text-muted-foreground"
                  >
                    <Icon className="size-3.5 text-primary" />
                    {label}
                  </motion.span>
                ))}
              </motion.div>
            </div>

            <PlanPreviewCard />
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-5 pb-16 md:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            {features.map(({ icon: Icon, title, description }, i) => (
              <motion.div
                key={title}
                custom={i}
                variants={fadeUp}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Card className="group relative h-full gap-3 overflow-hidden border-transparent bg-surface py-6 transition-shadow hover:shadow-lg hover:shadow-primary/10">
                  <span className="pointer-events-none absolute -top-3 -right-1 text-5xl font-bold text-foreground/4 transition-colors group-hover:text-primary/8">
                    0{i + 1}
                  </span>
                  <div className="flex flex-col gap-2 px-6">
                    <span className="mb-1 flex size-10 items-center justify-center rounded-full bg-linear-to-br from-primary to-primary-deep text-primary-foreground shadow-md shadow-primary/25">
                      <Icon className="size-4.5" />
                    </span>
                    <h3 className="text-base font-semibold">{title}</h3>
                    <p className="text-sm text-muted-foreground">{description}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-5 pb-16 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl bg-primary-soft/60 px-6 py-14 md:px-12"
          >
            <p className="text-eyebrow mb-2 text-center">Cómo funciona</p>
            <h2 className="mb-14 text-center text-2xl font-semibold tracking-tight md:text-3xl">
              Revisión humana en cada paso
            </h2>
            <div className="relative grid grid-cols-1 gap-10 md:grid-cols-3">
              <div className="absolute top-5 right-[16.5%] left-[16.5%] hidden border-t-2 border-dashed border-primary/25 md:block" />
              {steps.map(({ number, title, description }, i) => (
                <motion.div
                  key={number}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  className="relative flex flex-col items-center gap-2 text-center"
                >
                  <motion.span
                    whileHover={{ scale: 1.1 }}
                    className="relative z-10 flex size-10 items-center justify-center rounded-full bg-primary-deep text-lg font-semibold text-white shadow-lg shadow-primary-deep/30"
                  >
                    {number}
                  </motion.span>
                  <h3 className="text-base font-semibold">{title}</h3>
                  <p className="max-w-xs text-sm text-muted-foreground">
                    {description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-5 pb-20 md:px-8">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
              className="flex flex-col gap-4"
            >
              <p className="text-eyebrow">Sin sorpresas</p>
              <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                Si algo no cierra, te lo decimos — no lo escondemos
              </h2>
              <p className="max-w-md text-muted-foreground">
                Cuando una tarea no entra en tu disponibilidad, o una semana
                se sobrecarga, Planify lo marca de forma explícita en el plan
                en vez de forzar un resultado que no vas a poder cumplir.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {(["propuesto", "aprobado", "editado", "rechazado"] as const).map(
                  (label) => (
                    <Badge key={label} variant="outline" className="capitalize">
                      {label}
                    </Badge>
                  )
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex flex-col gap-3"
            >
              <Alert className="rounded-2xl border-priority-urgente/30 bg-card shadow-sm">
                <AlertTriangle className="text-priority-urgente" />
                <AlertTitle>Tarea sin tiempo disponible</AlertTitle>
                <AlertDescription>
                  &ldquo;Informe final&rdquo; requiere 3 h y no hay bloques libres
                  antes del viernes.
                </AlertDescription>
              </Alert>
              <Alert className="rounded-2xl border-priority-alta/30 bg-card shadow-sm">
                <RefreshCw className="text-priority-alta" />
                <AlertTitle>Replanificación sugerida</AlertTitle>
                <AlertDescription>
                  Cambiaste la prioridad de una tarea — el plan de la semana
                  puede actualizarse.
                </AlertDescription>
              </Alert>
            </motion.div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-5 pb-24 md:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-3xl bg-linear-to-br from-primary-deep to-primary px-6 py-14 text-center text-white md:px-12"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(white_1px,transparent_1px)] bg-size-[22px_22px] opacity-20"
            />
            <div className="relative flex flex-col items-center gap-5">
              <h2 className="max-w-xl text-2xl font-semibold tracking-tight text-balance md:text-3xl">
                Tu semana, propuesta por un agente — decidida por vos
              </h2>
              <p className="max-w-md text-primary-foreground/85">
                Creá tu cuenta y probá los tres escenarios: semana normal,
                sobrecarga y replanificación por cambio inesperado.
              </p>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button
                  size="lg"
                  variant="secondary"
                  render={<Link href="/registro" />}
                  className="gap-1.5"
                >
                  Crear cuenta gratis
                  <ArrowRight className="size-4" />
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </section>
      </main>

      <footer className="border-t border-border px-5 py-8 text-center text-sm text-muted-foreground md:px-8">
        Planify — Proyecto académico de planificación con IA y revisión
        humana.
      </footer>
    </div>
  );
}
