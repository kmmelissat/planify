"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Loader2, UserPlus, Mail, Lock, User } from "lucide-react";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthField, AuthPasswordField } from "@/components/auth/auth-field";
import { Button } from "@/components/ui/button";
import { persistSession } from "@/lib/auth/session";
import { registerUser } from "@/lib/services/http/auth-repository";
import { ApiError } from "@/lib/services/api-error";

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
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

  async function handleSubmit(event: FormEvent) {
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
    try {
      const response = await registerUser(name.trim(), email, password);
      persistSession(response.access_token, response.user);
      router.push("/app");
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        setErrors({ email: "Ya existe una cuenta con este correo." });
      } else {
        setErrors({ general: "No se pudo crear la cuenta. Intentá de nuevo." });
      }
      setIsSubmitting(false);
    }
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
        <AuthField
          id="register-name"
          label="Nombre"
          icon={<User className="size-3.5" />}
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
          autoComplete="name"
        />

        <AuthField
          id="register-email"
          label="Email"
          type="email"
          icon={<Mail className="size-3.5" />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          autoComplete="email"
        />

        <AuthPasswordField
          id="register-password"
          label="Contraseña"
          icon={<Lock className="size-3.5" />}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          autoComplete="new-password"
        />

        <AuthPasswordField
          id="register-confirm-password"
          label="Confirmar contraseña"
          icon={<Lock className="size-3.5" />}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={errors.confirmPassword}
          autoComplete="new-password"
        />

        <AnimatePresence>
          {errors.general && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.15 }}
              className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {errors.general}
            </motion.p>
          )}
        </AnimatePresence>

        <Button type="submit" disabled={isSubmitting} className="mt-2 gap-1.5">
          {isSubmitting ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <UserPlus className="size-4" />
          )}
          Crear cuenta
        </Button>
      </form>
    </AuthCard>
  );
}
