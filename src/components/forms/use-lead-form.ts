"use client";

import { useState } from "react";
import { useForm, type FieldValues, type UseFormReturn, type DefaultValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ZodType } from "zod";

/**
 * Logica comun de envio de los formularios publicos.
 *
 * Centraliza el POST al Route Handler, el manejo de errores por campo y el
 * estado de exito, para que los tres formularios se comporten igual.
 */

export type LeadFormState = "idle" | "success" | "error";

interface ApiResponse {
  ok?: boolean;
  message?: string;
  errors?: Record<string, string>;
}

export function useLeadForm<TValues extends FieldValues>({
  schema,
  endpoint,
  defaultValues,
}: {
  schema: ZodType;
  endpoint: string;
  defaultValues?: DefaultValues<TValues>;
}) {
  const form = useForm<TValues>({
    resolver: zodResolver(schema as never),
    defaultValues,
    mode: "onBlur",
  });

  const [state, setState] = useState<LeadFormState>("idle");
  const [feedback, setFeedback] = useState<string>("");

  const onSubmit = form.handleSubmit(async (values) => {
    setState("idle");
    setFeedback("");

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = (await response.json().catch(() => ({}))) as ApiResponse;

      if (!response.ok || data.ok === false) {
        // Errores por campo devueltos por el servidor: se pintan en el campo.
        if (data.errors) {
          for (const [field, message] of Object.entries(data.errors)) {
            form.setError(field as never, { type: "server", message });
          }
        }

        setState("error");
        setFeedback(
          data.message ??
            (response.status === 429
              ? "Demasiados intentos. Espera unos minutos antes de volver a enviar."
              : "No pudimos enviar tu mensaje. Revisa los campos e inténtalo otra vez."),
        );
        return;
      }

      setState("success");
      setFeedback(data.message ?? "¡Gracias! Te contactaremos muy pronto.");
      form.reset();
    } catch {
      setState("error");
      setFeedback(
        "No pudimos conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.",
      );
    }
  });

  return {
    form: form as UseFormReturn<TValues>,
    state,
    feedback,
    onSubmit,
    pending: form.formState.isSubmitting,
    rootError: form.formState.errors.root?.message,
  };
}
