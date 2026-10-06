"use client";

import Link from "next/link";
import {
  Building2,
  Layers,
  Mail,
  MessageSquare,
  Phone,
  User,
} from "lucide-react";
import {
  ConsentField,
  FormErrorNotice,
  HoneypotField,
  SelectField,
  SubmitButton,
  SuccessNotice,
  TextField,
  TextareaField,
} from "./fields";
import { useLeadForm } from "./use-lead-form";
import { contactSchema, type ContactInput } from "@/lib/validations";

/**
 * Formulario de contacto. Campos y textos tomados de la captura de
 * /contactenos: nombres, empresa opcional, correo, telefono, servicio de
 * interes y mensaje.
 */
export function ContactForm({
  serviceOptions,
  defaultService,
}: {
  serviceOptions: { value: string; label: string }[];
  defaultService?: string;
}) {
  const { form, state, feedback, onSubmit, pending } = useLeadForm<ContactInput>({
    schema: contactSchema,
    endpoint: "/api/contact",
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      company: "",
      serviceSlug: defaultService ?? "",
      message: "",
      website: "",
      consent: false,
    } as never,
  });

  const {
    register,
    formState: { errors },
  } = form;

  if (state === "success") {
    return <SuccessNotice title="Consulta enviada" message={feedback} />;
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
        error={errors.fullName?.message}
        {...register("fullName")}
      />

      <TextField
        label="Empresa"
        optional
        icon={<Building2 className="size-4" />}
        autoComplete="organization"
        error={errors.company?.message}
        {...register("company")}
      />

      <TextField
        label="Correo electrónico"
        type="email"
        icon={<Mail className="size-4" />}
        autoComplete="email"
        inputMode="email"
        error={errors.email?.message}
        {...register("email")}
      />

      <TextField
        label="Número de teléfono"
        type="tel"
        icon={<Phone className="size-4" />}
        autoComplete="tel"
        inputMode="tel"
        error={errors.phone?.message}
        {...register("phone")}
      />

      <SelectField
        label="Servicio de interés"
        icon={<Layers className="size-4" />}
        placeholder="Selecciona un servicio"
        options={serviceOptions}
        error={errors.serviceSlug?.message}
        {...register("serviceSlug")}
      />

      <TextareaField
        label="Mensaje"
        rows={5}
        icon={<MessageSquare className="size-4" />}
        error={errors.message?.message}
        {...register("message")}
      />

      <ConsentField
        id="contacto-consent"
        error={errors.consent?.message}
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
