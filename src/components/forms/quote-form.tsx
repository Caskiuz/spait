"use client";

import Link from "next/link";
import {
  Building2,
  FileText,
  Layers,
  Mail,
  Phone,
  User,
  Wallet,
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
import { quoteSchema, type QuoteInput } from "@/lib/validations";

const PROJECT_TYPES = [
  { value: "proyecto-nuevo", label: "Proyecto nuevo (obra o local desde cero)" },
  { value: "ampliacion", label: "Ampliación de un sistema existente" },
  { value: "mantenimiento", label: "Mantenimiento o soporte" },
  { value: "asesoria", label: "Asesoría técnica" },
  { value: "otro", label: "Otro" },
];

const BUDGETS = [
  { value: "menos-5k", label: "Menos de S/ 5,000" },
  { value: "5k-15k", label: "S/ 5,000 – 15,000" },
  { value: "15k-50k", label: "S/ 15,000 – 50,000" },
  { value: "mas-50k", label: "Más de S/ 50,000" },
  { value: "por-definir", label: "Aún por definir" },
];

/**
 * Formulario de cotizacion. A diferencia del de contacto, pide contexto del
 * proyecto (tipo, presupuesto y descripcion) para poder preparar una
 * propuesta util desde el primer contacto.
 */
export function QuoteForm({
  serviceOptions,
  defaultService,
}: {
  serviceOptions: { value: string; label: string }[];
  defaultService?: string;
}) {
  const { form, state, feedback, onSubmit, pending } = useLeadForm<QuoteInput>({
    schema: quoteSchema,
    endpoint: "/api/quotes",
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      company: "",
      serviceSlug: defaultService ?? "",
      projectType: undefined,
      budget: undefined,
      description: "",
      website: "",
      consent: false,
    } as never,
  });

  const {
    register,
    formState: { errors },
  } = form;

  if (state === "success") {
    return <SuccessNotice title="Solicitud enviada" message={feedback} />;
  }

  return (
    <form onSubmit={onSubmit} noValidate className="relative flex flex-col gap-4">
      <HoneypotField register={register("website")} />

      {state === "error" && feedback ? (
        <FormErrorNotice message={feedback} />
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
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
      </div>

      <SelectField
        label="Servicio de interés"
        icon={<Layers className="size-4" />}
        placeholder="Selecciona un servicio"
        options={serviceOptions}
        error={errors.serviceSlug?.message}
        {...register("serviceSlug")}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField
          label="Tipo de proyecto"
          icon={<FileText className="size-4" />}
          placeholder="Selecciona una opción"
          options={PROJECT_TYPES}
          error={errors.projectType?.message}
          {...register("projectType")}
        />

        <SelectField
          label="Presupuesto estimado"
          icon={<Wallet className="size-4" />}
          placeholder="Selecciona un rango"
          options={BUDGETS}
          error={errors.budget?.message}
          {...register("budget")}
        />
      </div>

      <TextareaField
        label="Cuéntanos sobre tu proyecto"
        rows={6}
        icon={<FileText className="size-4" />}
        hint="Indica tipo de espacio, metros aproximados y qué necesitas resolver."
        error={errors.description?.message}
        {...register("description")}
      />

      <ConsentField
        id="cotizar-consent"
        error={errors.consent?.message}
        {...register("consent")}
      >
        Acepto que Sound Tech Perú trate mis datos personales para preparar y
        enviarme una propuesta, conforme a la{" "}
        <Link
          href="/politica-de-privacidad"
          className="font-semibold text-brand-400 underline underline-offset-2"
        >
          Política de privacidad
        </Link>
        .
      </ConsentField>

      <SubmitButton pending={pending} className="mt-1">
        Solicitar cotización
      </SubmitButton>

      <p className="text-[11px] leading-relaxed text-fog-500">
        Respondemos con una propuesta preliminar en un plazo de 24 a 48 horas
        hábiles.
      </p>
    </form>
  );
}
