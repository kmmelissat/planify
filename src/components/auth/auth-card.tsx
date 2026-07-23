"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { motion } from "motion/react";
import { Sparkles } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function BackgroundDecor() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <motion.div
        className="absolute -top-32 -left-24 size-96 rounded-full bg-primary-soft/70 blur-3xl"
        animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-40 -right-32 size-96 rounded-full bg-accent-bright/20 blur-3xl"
        animate={{ x: [0, -25, 0], y: [0, 30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(var(--border)_1px,transparent_1px)] bg-size-[26px_26px] opacity-40 mask-[radial-gradient(ellipse_60%_60%_at_50%_0%,black,transparent)]" />
    </div>
  );
}

export function AuthCard({
  title,
  description,
  children,
  footerText,
  footerLinkLabel,
  footerLinkHref,
}: {
  title: string;
  description: string;
  children: ReactNode;
  footerText: string;
  footerLinkLabel: string;
  footerLinkHref: string;
}) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-5 py-12">
      <BackgroundDecor />

      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <Link href="/" className="mb-8 flex items-center justify-center">
          <Image
            src="/planify.svg"
            alt="Planify"
            width={624}
            height={173}
            className="h-8 w-auto"
            priority
          />
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm"
      >
        <Card className="gap-5 rounded-3xl border-transparent py-7 shadow-2xl shadow-primary/10 ring-1 ring-foreground/10">
          <CardHeader className="px-7">
            <span className="mb-2 inline-flex size-9 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <Sparkles className="size-4" />
            </span>
            <CardTitle className="text-xl font-semibold">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent className="px-7">{children}</CardContent>
        </Card>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-6 text-sm text-muted-foreground"
      >
        {footerText}{" "}
        <Link
          href={footerLinkHref}
          className="font-medium text-primary hover:underline"
        >
          {footerLinkLabel}
        </Link>
      </motion.p>
    </div>
  );
}
