"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AuthCard } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { persistSession } from "@/lib/auth/session";
import { loginUser } from "@/lib/services/http/auth-repository";
import { ApiError } from "@/lib/services/api-error";

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const nextErrors: FormErrors = {};
    if (!isValidEmail(email)) nextErrors.email = "Ingresá un email válido.";
    if (!password) nextErrors.password = "La contraseña es obligatoria.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      const response = await loginUser(email, password);
      persistSession(response.access_token, response.user);
      router.push("/app");
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        setErrors({ general: "Correo o contraseña incorrectos." });
      } else {
        setErrors({ general: "No se pudo iniciar sesión. Intentá de nuevo." });
      }
      setIsSubmitting(false);
    }
  }

  return (
    <AuthCard
      title="Iniciar sesión"
      description="Entrá para ver tus tareas y el plan propuesto."
      footerText="¿No tenés cuenta?"
      footerLinkLabel="Registrate"
      footerLinkHref="/registro"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="login-email">Email</Label>
          <Input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={Boolean(errors.email)}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="login-password">Contraseña</Label>
          <Input
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-invalid={Boolean(errors.password)}
          />
          {errors.password && (
            <p className="text-xs text-destructive">{errors.password}</p>
          )}
        </div>

        {errors.general && (
          <p className="text-sm text-destructive">{errors.general}</p>
        )}

        <Button type="submit" disabled={isSubmitting} className="mt-2">
          Iniciar sesión
        </Button>
      </form>
    </AuthCard>
  );
}
