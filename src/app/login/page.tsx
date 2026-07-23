"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Loader2, LogIn, Mail, Lock } from "lucide-react";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthField, AuthPasswordField } from "@/components/auth/auth-field";
import { Button } from "@/components/ui/button";
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
        <AuthField
          id="login-email"
          label="Email"
          type="email"
          icon={<Mail className="size-3.5" />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          autoComplete="email"
        />

        <AuthPasswordField
          id="login-password"
          label="Contraseña"
          icon={<Lock className="size-3.5" />}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          autoComplete="current-password"
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
            <LogIn className="size-4" />
          )}
          Iniciar sesión
        </Button>
      </form>
    </AuthCard>
  );
}
