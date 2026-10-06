"use client";

import Link from "next/link";
import { Building2, GraduationCap, Mail, MessageSquare, Phone, User } from "lucide-react";
import {
  ConsentField,
  FormErrorNotice,
  HoneypotField,
  SubmitButton,
  SuccessNotice,
  TextField,
  TextareaField,
} from "./fields";
import { useLeadForm } from "./use-lead-form";
import { enrollmentSchema, type EnrollmentInput } from "@/lib/validations";

/**
 * Formulario de matricula del programa de ingenieria de sonido.
 * Campos tomados de la captura de /cursos: nombres, empresa opcional, correo,
 * telefono, curso y mensaje.
 */
export function EnrollmentForm({
  courseSlug,
  courseName,
}: {
  courseSlug: string;
  courseName?: string;
}) {
  const { form, state, feedback, onSubmit, pending } =
    useLeadForm<EnrollmentInput>({
      schema: enrollmentSchema,
      endpoint: "/api/enrollments",
      defaultValues: {
        fullName: "",
        email: "",
        phone: "",
        company: "",
        courseSlug,
        message: "",
        website: "",
      } as never,
    });

  const {
    register,
    formState: { errors },
  } = form;

  if (state === "success") {
    return (
      <SuccessNotice
        title="Matrícula registrada"
        message={feedback}
      />
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="relative flex flex-col gap-4">
      <HoneypotField register={register("website")} />

      {state === "error" && feedback ? (
        <FormErrorNotice message={feedback} />
      ) : null}

      <TextField
        label="Nombres y Apellidos"
        icon={<User className="size-4" />}
        autoComplete="name"
        error={errors.fullName?.message as string | undefined}
        {...register("fullName")}
      />

      <TextField
        label="Empresa"
        optional
        icon={<Building2 className="size-4" />}
        autoComplete="organization"
        error={errors.company?.message as string | undefined}
        {...register("company")}
      />

      <TextField
        label="Correo electrónico"
        type="email"
        icon={<Mail className="size-4" />}
        autoComplete="email"
        inputMode="email"
        error={errors.email?.message as string | undefined}
        {...register("email")}
      />

      <TextField
        label="Número de teléfono"
        type="tel"
        icon={<Phone className="size-4" />}
        autoComplete="tel"
        inputMode="tel"
        error={errors.phone?.message as string | undefined}
        {...register("phone")}
      />

      {/* El programa viene fijado por la pagina; se muestra, no se edita. */}
      <input type="hidden" {...register("courseSlug")} />
      <TextField
        label="Curso de interés"
        icon={<GraduationCap className="size-4" />}
        value={courseName ?? courseSlug}
        readOnly
        tabIndex={-1}
        aria-readonly
        onChange={() => undefined}
        className="cursor-default text-fog-300"
        hint="Programa seleccionado"
      />

      <TextareaField
        label="Mensaje"
        rows={4}
        icon={<MessageSquare className="size-4" />}
        error={errors.message?.message as string | undefined}
        {...register("message")}
      />

      <ConsentField
        id="matricula-consent"
        error={errors.consent?.message as string | undefined}
        {...register("consent")}
      >
        Acepto que Sound Tech Perú trate mis datos personales para responder a
        esta solicitud, conforme a la{" "}
        <Link
          href="/politica-de-privacidad"
          className="font-semibold text-brand-400 underline underline-offset-2"
        >
          Política de privacidad
        </Link>
        .
      </ConsentField>

      <SubmitButton pending={pending} className="mt-1">
        Enviar Consulta
      </SubmitButton>

      <p className="text-[11px] leading-relaxed text-fog-500">
        Nuestro equipo se comunicará contigo para brindarte mayor información.
      </p>
    </form>
  );
}
