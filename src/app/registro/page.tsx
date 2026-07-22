"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AuthCard } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { persistDemoSession } from "@/lib/auth/demo-session";

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default function RegistroPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const nextErrors: FormErrors = {};
    if (!name.trim()) nextErrors.name = "El nombre es obligatorio.";
    if (!isValidEmail(email)) nextErrors.email = "Ingresá un email válido.";
    if (!password || password.length < 6) {
      nextErrors.password = "La contraseña debe tener al menos 6 caracteres.";
    }
    if (confirmPassword !== password) {
      nextErrors.confirmPassword = "Las contraseñas no coinciden.";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);
    persistDemoSession(name.trim() || "Usuario", email);
    router.push("/app");
  }

  return (
    <AuthCard
      title="Crear cuenta"
      description="Registrate para empezar a planificar con el agente."
      footerText="¿Ya tenés cuenta?"
      footerLinkLabel="Iniciá sesión"
      footerLinkHref="/login"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="register-name">Nombre</Label>
          <Input
            id="register-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-invalid={Boolean(errors.name)}
          />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="register-email">Email</Label>
          <Input
            id="register-email"
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
          <Label htmlFor="register-password">Contraseña</Label>
          <Input
            id="register-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-invalid={Boolean(errors.password)}
          />
          {errors.password && (
            <p className="text-xs text-destructive">{errors.password}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="register-confirm-password">
            Confirmar contraseña
          </Label>
          <Input
            id="register-confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            aria-invalid={Boolean(errors.confirmPassword)}
          />
          {errors.confirmPassword && (
            <p className="text-xs text-destructive">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        <Button type="submit" disabled={isSubmitting} className="mt-2">
          Crear cuenta
        </Button>
      </form>
    </AuthCard>
  );
}
