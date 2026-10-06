import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ==========================================================================
   Piezas de interfaz del panel. Comparten lenguaje visual con el sitio
   (fondo oscuro, acento naranja, bordes finos) pero priorizan la densidad
   de informacion sobre el impacto visual.
   ========================================================================== */

export function AdminPageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="flex flex-col gap-4 border-b border-hairline pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-2xl font-black uppercase tracking-tight text-white">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 max-w-2xl text-sm text-fog-400">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 gap-2.5">{actions}</div> : null}
    </header>
  );
}

export function AdminCard({
  title,
  description,
  actions,
  children,
  className,
  padded = true,
}: {
  title?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <section
      className={cn(
        "rounded-card border border-hairline bg-ink-900/60",
        className,
      )}
    >
      {title ? (
        <header className="flex items-center justify-between gap-4 border-b border-hairline px-5 py-4">
          <div>
            <h2 className="font-display text-[13px] font-extrabold uppercase tracking-wide text-white">
              {title}
            </h2>
            {description ? (
              <p className="mt-1 text-xs text-fog-500">{description}</p>
            ) : null}
          </div>
          {actions}
        </header>
      ) : null}
      <div className={padded ? "p-5" : ""}>{children}</div>
    </section>
  );
}

/** Cifra destacada del panel. */
export function StatCard({
  label,
  value,
  hint,
  accent,
  href,
}: {
  label: string;
  value: string | number;
  hint?: string;
  accent?: boolean;
  href?: string;
}) {
  const content = (
    <div className="rounded-card border border-hairline bg-ink-900/60 p-5 transition-colors hover:border-brand-600/40">
      <p className="text-[11px] uppercase tracking-[0.16em] text-fog-500">
        {label}
      </p>
      <p
        className={cn(
          "mt-2 font-display text-3xl font-black",
          accent ? "text-gradient-brand" : "text-white",
        )}
      >
        {value}
      </p>
      {hint ? <p className="mt-1.5 text-[11px] text-fog-500">{hint}</p> : null}
    </div>
  );

  return href ? (
    <a href={href} className="block">
      {content}
    </a>
  ) : (
    content
  );
}

const STATUS_STYLES: Record<string, string> = {
  NUEVO: "border-brand-600/45 bg-brand-600/12 text-brand-400",
  EN_PROCESO: "border-sky-500/40 bg-sky-500/10 text-sky-300",
  ATENDIDO: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
  DESCARTADO: "border-hairline bg-white/5 text-fog-400",
};

export function StatusBadge({ status }: { status: string }) {
  const label = status.replace("_", " ").toLowerCase();
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em]",
        STATUS_STYLES[status] ?? STATUS_STYLES.DESCARTADO,
      )}
    >
      {label}
    </span>
  );
}

export function Pill({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "brand" | "success" | "muted";
}) {
  const tones = {
    neutral: "border-hairline bg-white/5 text-fog-300",
    brand: "border-brand-600/40 bg-brand-600/12 text-brand-400",
    success: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
    muted: "border-hairline text-fog-500",
  } as const;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em]",
        tones[tone],
      )}
    >
      {children}
    </span>
  );
}

/** Tabla del panel. Envolver siempre en un contenedor con scroll horizontal. */
export function AdminTable({
  head,
  children,
  empty,
}: {
  head: string[];
  children: ReactNode;
  empty?: boolean;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[42rem] border-collapse text-sm">
        <thead>
          <tr className="border-b border-hairline">
            {head.map((cell) => (
              <th
                key={cell}
                className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.14em] text-fog-500"
              >
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={empty ? "hidden" : undefined}>{children}</tbody>
      </table>
      {empty ? (
        <p className="px-5 py-12 text-center text-sm text-fog-500">
          No hay registros todavía.
        </p>
      ) : null}
    </div>
  );
}

export function AdminRow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <tr
      className={cn(
        "border-b border-hairline/70 transition-colors last:border-0 hover:bg-white/[0.03]",
        className,
      )}
    >
      {children}
    </tr>
  );
}

export function AdminCell({
  children,
  className,
  mono,
}: {
  children: ReactNode;
  className?: string;
  mono?: boolean;
}) {
  return (
    <td
      className={cn(
        "px-5 py-3.5 align-middle text-fog-200",
        mono && "font-mono text-xs",
        className,
      )}
    >
      {children}
    </td>
  );
}

/** Aviso neutro para explicar el estado de una integración. */
export function AdminNotice({
  tone = "info",
  title,
  children,
}: {
  tone?: "info" | "warning" | "success";
  title: string;
  children: ReactNode;
}) {
  const tones = {
    info: "border-sky-500/30 bg-sky-500/8 text-sky-200",
    warning: "border-amber-500/35 bg-amber-500/8 text-amber-200",
    success: "border-emerald-500/35 bg-emerald-500/8 text-emerald-200",
  } as const;

  return (
    <div className={cn("rounded-card border p-5", tones[tone])}>
      <p className="font-display text-[12px] font-extrabold uppercase tracking-wide">
        {title}
      </p>
      <div className="mt-2 text-xs leading-relaxed text-fog-300">{children}</div>
    </div>
  );
}
