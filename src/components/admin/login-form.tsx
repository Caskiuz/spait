"use client";

import { useState } from "react";
import { Mail, Lock } from "lucide-react";
import { signIn } from "next-auth/react";
import { TextField, SubmitButton, FormErrorNotice } from "@/components/forms/fields";

/** Formulario de acceso al panel. */
export function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);

    const data = new FormData(event.currentTarget);

    try {
      const result = await signIn("credentials", {
        email: String(data.get("email") ?? "").trim(),
        password: String(data.get("password") ?? ""),
        redirect: false,
      });

      if (result?.error) {
        setError("El correo o la contraseña no son correctos.");
        setPending(false);
        return;
      }

      // Recarga completa para que el middleware vea la cookie de sesión.
      window.location.href = callbackUrl;
    } catch {
      setError("No pudimos iniciar tu sesión. Inténtalo otra vez.");
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error ? <FormErrorNotice message={error} /> : null}

      <TextField
        label="Correo electrónico"
        name="email"
        type="email"
        icon={<Mail className="size-4" />}
        autoComplete="email"
        inputMode="email"
        required
      />

      <TextField
        label="Contraseña"
        name="password"
        type="password"
        icon={<Lock className="size-4" />}
        autoComplete="current-password"
        required
      />

      <SubmitButton pending={pending} className="mt-2">
        Iniciar sesión
      </SubmitButton>
    </form>
  );
}
