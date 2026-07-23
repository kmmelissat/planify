"use client";

import { useState, type ComponentProps, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Eye, EyeOff } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

function FieldError({ error }: { error?: string }) {
  return (
    <AnimatePresence>
      {error && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.15 }}
          className="text-xs text-destructive"
        >
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

export function AuthField({
  id,
  label,
  icon,
  error,
  className,
  ...props
}: {
  id: string;
  label: string;
  icon: ReactNode;
  error?: string;
} & Omit<ComponentProps<typeof Input>, "id">) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative flex items-center">
        <span className="pointer-events-none absolute left-2.5 flex items-center text-muted-foreground">
          {icon}
        </span>
        <Input
          id={id}
          aria-invalid={Boolean(error)}
          className={cn("pl-8", className)}
          {...props}
        />
      </div>
      <FieldError error={error} />
    </div>
  );
}

export function AuthPasswordField({
  id,
  label,
  icon,
  error,
  className,
  ...props
}: {
  id: string;
  label: string;
  icon: ReactNode;
  error?: string;
} & Omit<ComponentProps<typeof Input>, "id" | "type">) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative flex items-center">
        <span className="pointer-events-none absolute left-2.5 flex items-center text-muted-foreground">
          {icon}
        </span>
        <Input
          id={id}
          type={visible ? "text" : "password"}
          aria-invalid={Boolean(error)}
          className={cn("pl-8 pr-8", className)}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-2.5 flex items-center text-muted-foreground transition-colors hover:text-foreground"
          aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
          tabIndex={-1}
        >
          {visible ? (
            <EyeOff className="size-3.5" />
          ) : (
            <Eye className="size-3.5" />
          )}
        </button>
      </div>
      <FieldError error={error} />
    </div>
  );
}
