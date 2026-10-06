"use client";

import { useActionState } from "react";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import type { ActionResult } from "@/server/actions/admin";
import { cn } from "@/lib/utils";

/**
 * Formulario del panel conectado a una Server Action.
 *
 * Usa useActionState para mostrar el resultado (exito o errores por campo)
 * sin recargar la pagina.
 */
export function AdminForm({
  action,
  children,
  submitLabel = "Guardar cambios",
  className,
  hiddenFields,
  compact,
}: {
  action: (state: ActionResult | null, formData: FormData) => Promise<ActionResult>;
  children: React.ReactNode;
  submitLabel?: string;
  className?: string;
  hiddenFields?: Record<string, string>;
  compact?: boolean;
}) {
  const [state, formAction, pending] = useActionState(action, null);

  return (
    <form action={formAction} className={cn("flex flex-col gap-5", className)}>
      {hiddenFields
        ? Object.entries(hiddenFields).map(([name, value]) => (
            <input key={name} type="hidden" name={name} value={value} />
          ))
        : null}

      {state && !state.ok ? (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-xl border border-red-500/35 bg-red-500/8 p-4 text-xs text-fog-200"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0 text-red-400" aria-hidden />
          <span>
            {state.message}
            {state.errors ? (
              <ul className="mt-2 flex flex-col gap-1 text-fog-300">
                {Object.entries(state.errors).map(([field, message]) => (
                  <li key={field}>
                    <span className="font-semibold text-white">{field}:</span>{" "}
                    {message}
                  </li>
                ))}
              </ul>
            ) : null}
          </span>
        </div>
      ) : null}

      {state?.ok ? (
        <div
          role="status"
          className="flex items-center gap-2.5 rounded-xl border border-emerald-500/35 bg-emerald-500/8 p-4 text-xs text-emerald-200"
        >
          <CheckCircle2 className="size-4 shrink-0" aria-hidden />
          {state.message}
        </div>
      ) : null}

      <div className={cn(compact ? "flex flex-col gap-4" : "flex flex-col gap-5")}>
        {children}
      </div>

      <div>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-11 items-center gap-2.5 rounded-full bg-gradient-brand px-6 font-display text-xs font-bold uppercase tracking-[0.14em] text-white transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? (
            <>
              <Loader2 className="size-3.5 animate-spin" aria-hidden />
              Guardando…
            </>
          ) : (
            submitLabel
          )}
        </button>
      </div>
    </form>
  );
}

/* ==========================================================================
   Controles
   ========================================================================== */

const baseInput =
  "w-full rounded-xl border border-hairline bg-ink-900/70 px-4 py-3 text-sm text-white placeholder:text-fog-500 transition-colors focus:border-brand-600/70 focus:outline-none";

export function Field({
  label,
  name,
  hint,
  children,
  className,
}: {
  label: string;
  name: string;
  hint?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label
        htmlFor={name}
        className="text-[11px] font-semibold uppercase tracking-[0.14em] text-fog-400"
      >
        {label}
      </label>
      {children ?? (
        <input id={name} name={name} className={baseInput} placeholder={label} />
      )}
      {hint ? <p className="text-[11px] text-fog-500">{hint}</p> : null}
    </div>
  );
}

export function TextInput({
  name,
  label,
  hint,
  defaultValue,
  type = "text",
  required,
  placeholder,
  className,
}: {
  name: string;
  label: string;
  hint?: string;
  defaultValue?: string | number | null;
  type?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
}) {
  return (
    <Field label={label} name={name} hint={hint} className={className}>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder ?? label}
        defaultValue={defaultValue ?? ""}
        className={baseInput}
      />
    </Field>
  );
}

export function TextArea({
  name,
  label,
  hint,
  defaultValue,
  rows = 4,
  required,
  className,
}: {
  name: string;
  label: string;
  hint?: string;
  defaultValue?: string | null;
  rows?: number;
  required?: boolean;
  className?: string;
}) {
  return (
    <Field label={label} name={name} hint={hint} className={className}>
      <textarea
        id={name}
        name={name}
        rows={rows}
        required={required}
        placeholder={label}
        defaultValue={defaultValue ?? ""}
        className={cn(baseInput, "resize-y")}
      />
    </Field>
  );
}

export function SelectInput({
  name,
  label,
  options,
  defaultValue,
  hint,
  className,
}: {
  name: string;
  label: string;
  options: { value: string; label: string }[];
  defaultValue?: string | null;
  hint?: string;
  className?: string;
}) {
  return (
    <Field label={label} name={name} hint={hint} className={className}>
      <select
        id={name}
        name={name}
        defaultValue={defaultValue ?? ""}
        className={cn(baseInput, "appearance-none pr-10")}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

export function CheckboxInput({
  name,
  label,
  hint,
  defaultChecked,
}: {
  name: string;
  label: string;
  hint?: string;
  defaultChecked?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <input
        id={name}
        name={name}
        type="checkbox"
        defaultChecked={defaultChecked}
        className="mt-0.5 size-4 shrink-0 cursor-pointer appearance-none rounded border border-hairline-strong bg-ink-900 checked:border-brand-600 checked:bg-brand-600"
      />
      <label htmlFor={name} className="cursor-pointer">
        <span className="block text-[12px] font-semibold text-fog-200">
          {label}
        </span>
        {hint ? (
          <span className="mt-0.5 block text-[11px] text-fog-500">{hint}</span>
        ) : null}
      </label>
    </div>
  );
}
