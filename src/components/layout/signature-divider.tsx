import { cn } from "@/lib/utils";

/**
 * Elemento de firma visual del proyecto: una regla con degradado azul y una
 * marca (✺) al inicio, en el color "signal" (azul-cian eléctrico). Se repite
 * bajo encabezados de página y entre secciones.
 */
export function SignatureDivider({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)} aria-hidden>
      <span className="text-sm leading-none text-signal">✺</span>
      <span className="h-px flex-1 bg-linear-to-r from-primary/70 via-primary-soft to-transparent" />
    </div>
  );
}
