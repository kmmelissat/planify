"use client";

import { useState, type FormEvent } from "react";
import { Input } from "@/components/ui/input";

/** Captura de un solo paso: escribir + Enter crea la tarea con defaults razonables. */
export function QuickAddTaskInput({
  onAdd,
}: {
  onAdd: (title: string) => Promise<void>;
}) {
  const [value, setValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const title = value.trim();
    if (!title || isSubmitting) return;

    setValue("");
    setIsSubmitting(true);
    try {
      await onAdd(title);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex-1">
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="+ Agregar tarea..."
        disabled={isSubmitting}
        aria-label="Agregar tarea rápida"
      />
    </form>
  );
}
