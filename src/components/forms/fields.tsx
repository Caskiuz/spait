"use client";

import { forwardRef, type ReactNode } from "react";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/* ==========================================================================
   Campos de formulario con el estilo del diseno: fondo oscuro, borde fino,
   icono a la izquierda y etiqueta en linea de ayuda.
   ========================================================================== */

const controlBase =
  "peer w-full rounded-xl border bg-ink-900/70 py-3.5 text-sm text-white placeholder:text-fog-500 transition-colors focus:outline-none focus-visible:outline-none disabled:opacity-60";

const stateRing = (hasError?: boolean) =>
  hasError
    ? "border-red-500/60 focus:border-red-500"
    : "border-hairline focus:border-brand-600/70";

function Wrapper({
  children,
  error,
  hint,
  className,
}: {
  children: ReactNode;
  error?: string;
  hint?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {children}
      {error ? (
        <p
          role="alert"
          className="flex items-center gap-1.5 text-[11px] font-medium text-red-400"
        >
          <AlertCircle className="size-3 shrink-0" aria-hidden />
          {error}
        </p>
      ) : hint ? (
        <p className="text-[11px] text-fog-500">{hint}</p>
      ) : null}
    </div>
  );
}

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: ReactNode;
  error?: string;
  hint?: string;
  optional?: boolean;
  containerClassName?: string;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  function TextField(
    { label, icon, error, hint, optional, className, containerClassName, id, ...rest },
    ref,
  ) {
    const fieldId = id ?? rest.name;

    return (
      <Wrapper error={error} hint={hint} className={containerClassName}>
        <label htmlFor={fieldId} className="sr-only">
          {label}
        </label>
        <div className="relative">
          {icon ? (
            <span
              aria-hidden
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-fog-500"
            >
              {icon}
            </span>
          ) : null}

          <input
            ref={ref}
            id={fieldId}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${fieldId}-error` : undefined}
            placeholder={optional ? `${label} (opcional)` : label}
            className={cn(
              controlBase,
              stateRing(Boolean(error)),
              icon ? "pl-11 pr-4" : "px-4",
              className,
            )}
            {...rest}
          />
        </div>
      </Wrapper>
    );
  },
);

interface TextareaFieldProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  icon?: ReactNode;
  error?: string;
  hint?: string;
  optional?: boolean;
  containerClassName?: string;
}

export const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
  function TextareaField(
    { label, icon, error, hint, optional, className, containerClassName, id, ...rest },
    ref,
  ) {
    const fieldId = id ?? rest.name;

    return (
      <Wrapper error={error} hint={hint} className={containerClassName}>
        <label htmlFor={fieldId} className="sr-only">
          {label}
        </label>
        <div className="relative">
          {icon ? (
            <span
              aria-hidden
              className="pointer-events-none absolute left-4 top-4 text-fog-500"
            >
              {icon}
            </span>
          ) : null}

          <textarea
            ref={ref}
            id={fieldId}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${fieldId}-error` : undefined}
            placeholder={optional ? `${label} (opcional)` : label}
            className={cn(
              controlBase,
              stateRing(Boolean(error)),
              "resize-y",
              icon ? "pl-11 pr-4" : "px-4",
              className,
            )}
            {...rest}
          />
        </div>
      </Wrapper>
    );
  },
);

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  icon?: ReactNode;
  error?: string;
  hint?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
  containerClassName?: string;
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  function SelectField(
    {
      label,
      icon,
      error,
      hint,
      options,
      placeholder,
      className,
      containerClassName,
      id,
      ...rest
    },
    ref,
  ) {
    const fieldId = id ?? rest.name;

    return (
      <Wrapper error={error} hint={hint} className={containerClassName}>
        <label htmlFor={fieldId} className="sr-only">
          {label}
        </label>
        <div className="relative">
          {icon ? (
            <span
              aria-hidden
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-fog-500"
            >
              {icon}
            </span>
          ) : null}

          <select
            ref={ref}
            id={fieldId}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${fieldId}-error` : undefined}
            className={cn(
              controlBase,
              stateRing(Boolean(error)),
              "appearance-none",
              icon ? "pl-11" : "pl-4",
              "pr-10",
              className,
            )}
            {...rest}
          >
            {placeholder ? (
              <option value="">{placeholder}</option>
            ) : null}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <span
            aria-hidden
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-fog-500"
          >
            <svg viewBox="0 0 12 8" className="size-3" fill="none">
              <path
                d="M1 1.5 6 6.5l5-5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </Wrapper>
    );
  },
);

/** Casilla de consentimiento de datos personales. */
export function ConsentField({
  id,
  error,
  children,
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <Wrapper error={error}>
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          id={id}
          aria-invalid={error ? true : undefined}
          className="mt-0.5 size-4 shrink-0 cursor-pointer appearance-none rounded border border-hairline-strong bg-ink-900 checked:border-brand-600 checked:bg-brand-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
          {...rest}
        />
        <label
          htmlFor={id}
          className="cursor-pointer text-[11px] leading-relaxed text-fog-400"
        >
          {children}
        </label>
      </div>
    </Wrapper>
  );
}

/**
 * Campo trampa contra bots: invisible y fuera del orden de tabulacion.
 * Si llega con contenido, el servidor descarta el envio.
 */
export function HoneypotField({
  register,
}: {
  register: React.InputHTMLAttributes<HTMLInputElement>;
}) {
  return (
    <div aria-hidden className="absolute h-0 w-0 overflow-hidden opacity-0">
      <label htmlFor="website">No completar este campo</label>
      <input
        id="website"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        {...register}
      />
    </div>
  );
}

/** Mensaje de exito mostrado tras enviar un formulario. */
export function SuccessNotice({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <div
      role="status"
      className="flex items-start gap-3 rounded-card border border-emerald-500/35 bg-emerald-500/8 p-5"
    >
      <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-400" aria-hidden />
      <div>
        <p className="font-display text-sm font-extrabold uppercase tracking-wide text-white">
          {title}
        </p>
        <p className="mt-1.5 text-xs leading-relaxed text-fog-300">{message}</p>
      </div>
    </div>
  );
}

/** Aviso de error general del formulario. */
export function FormErrorNotice({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-card border border-red-500/35 bg-red-500/8 p-5"
    >
      <AlertCircle className="mt-0.5 size-5 shrink-0 text-red-400" aria-hidden />
      <p className="text-xs leading-relaxed text-fog-200">{message}</p>
    </div>
  );
}

/** Boton de envio con estado de carga. */
export function SubmitButton({
  pending,
  children,
  className,
}: {
  pending: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "inline-flex h-13 w-full items-center justify-center gap-2.5 rounded-full bg-gradient-brand px-7 font-display text-[13px] font-bold uppercase tracking-[0.16em] text-white transition-all duration-300 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
    >
      {pending ? (
        <>
          <Loader2 className="size-4 animate-spin" aria-hidden />
          Enviando…
        </>
      ) : (
        <>
          {children}
          <span
            aria-hidden
            className="grid size-5 place-items-center rounded-full bg-white/25"
          >
            <svg viewBox="0 0 12 12" className="size-3" fill="none">
              <path
                d="M2 6h8M6.5 2.5 10 6l-3.5 3.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </>
      )}
    </button>
  );
}
