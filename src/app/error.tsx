"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <AlertTriangle className="size-10 text-destructive" />
      <div className="flex flex-col gap-1.5">
        <h1 className="text-lg font-semibold">Algo salió mal</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          Ocurrió un error inesperado y no pudimos mostrar esta pantalla.
          {error.message ? ` (${error.message})` : ""}
        </p>
      </div>
      <Button onClick={reset}>Reintentar</Button>
    </div>
  );
}
