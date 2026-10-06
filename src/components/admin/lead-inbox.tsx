import Link from "next/link";
import {
  AdminCard,
  AdminCell,
  AdminPageHeader,
  AdminRow,
  AdminTable,
  StatCard,
  StatusBadge,
} from "@/components/admin/ui";
import { formatDateTime, truncate } from "@/lib/utils";

export interface LeadRow {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  company: string | null;
  status: string;
  createdAt: Date;
  /** Texto libre que resume el motivo de contacto. */
  subject: string;
}

const FILTERS = ["TODOS", "NUEVO", "EN_PROCESO", "ATENDIDO", "DESCARTADO"] as const;

/**
 * Bandeja de prospectos reutilizada por mensajes, matriculas y cotizaciones.
 * Incluye filtro por estado y exportacion a CSV.
 */
export function LeadInbox({
  title,
  description,
  basePath,
  rows,
  counts,
  activeFilter,
  exportHref,
  subjectLabel,
}: {
  title: string;
  description: string;
  basePath: string;
  rows: LeadRow[];
  counts: Record<string, number>;
  activeFilter: string;
  exportHref: string;
  subjectLabel: string;
}) {
  return (
    <>
      <AdminPageHeader
        title={title}
        description={description}
        actions={
          <a
            href={exportHref}
            className="inline-flex h-10 items-center rounded-full border border-hairline px-4 text-xs text-fog-300 transition-colors hover:border-brand-600/60 hover:text-brand-400"
          >
            Exportar CSV
          </a>
        }
      />

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Nuevos" value={counts.NUEVO ?? 0} accent={(counts.NUEVO ?? 0) > 0} />
        <StatCard label="En proceso" value={counts.EN_PROCESO ?? 0} />
        <StatCard label="Atendidos" value={counts.ATENDIDO ?? 0} />
        <StatCard label="Descartados" value={counts.DESCARTADO ?? 0} />
      </div>

      {/* Filtros */}
      <nav aria-label="Filtrar por estado" className="mt-6 flex flex-wrap gap-2">
        {FILTERS.map((filter) => {
          const isActive = filter === activeFilter;
          const href =
            filter === "TODOS" ? basePath : `${basePath}?estado=${filter}`;
          return (
            <Link
              key={filter}
              href={href}
              aria-current={isActive ? "page" : undefined}
              className={
                "rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] transition-all " +
                (isActive
                  ? "border-brand-600 bg-brand-600/15 text-brand-300"
                  : "border-hairline text-fog-400 hover:border-brand-600/50 hover:text-brand-400")
              }
            >
              {filter === "TODOS"
                ? "Todos"
                : filter.replace("_", " ").toLowerCase()}
              {filter !== "TODOS" && counts[filter]
                ? ` (${counts[filter]})`
                : ""}
            </Link>
          );
        })}
      </nav>

      <div className="mt-6">
        <AdminCard padded={false}>
          <AdminTable
            head={["Nombre", "Contacto", subjectLabel, "Estado", "Recibido"]}
            empty={rows.length === 0}
          >
            {rows.map((row) => (
              <AdminRow key={row.id}>
                <AdminCell>
                  <Link
                    href={`${basePath}/${row.id}`}
                    className="font-medium text-white transition-colors hover:text-brand-400"
                  >
                    {row.fullName}
                  </Link>
                  {row.company ? (
                    <span className="mt-0.5 block text-[11px] text-fog-500">
                      {row.company}
                    </span>
                  ) : null}
                </AdminCell>
                <AdminCell className="text-xs text-fog-400">
                  <span className="block">{row.email}</span>
                  <span className="block text-fog-500">{row.phone}</span>
                </AdminCell>
                <AdminCell className="max-w-[18rem] text-xs text-fog-400">
                  {truncate(row.subject, 90)}
                </AdminCell>
                <AdminCell>
                  <StatusBadge status={row.status} />
                </AdminCell>
                <AdminCell className="text-xs text-fog-500">
                  {formatDateTime(row.createdAt)}
                </AdminCell>
              </AdminRow>
            ))}
          </AdminTable>
        </AdminCard>
      </div>
    </>
  );
}

/** Ficha de detalle de un prospecto. */
export function LeadDetail({
  title,
  subtitle,
  basePath,
  fields,
  message,
  messageLabel = "Mensaje",
  actions,
  history,
}: {
  title: string;
  subtitle: string;
  basePath: string;
  fields: [string, string][];
  message?: string | null;
  messageLabel?: string;
  /** Componente con los controles de gestión (LeadActions). */
  actions: React.ReactNode;
  /** Notas internas ya registradas. */
  history?: React.ReactNode;
}) {
  return (
    <>
      <Link
        href={basePath}
        className="text-xs text-fog-400 transition-colors hover:text-brand-400"
      >
        ← Volver a la bandeja
      </Link>

      <div className="mt-4">
        <AdminPageHeader title={title} description={subtitle} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.25fr_0.85fr]">
        <div className="flex flex-col gap-6">
          <AdminCard title="Datos del contacto">
            <dl className="flex flex-col">
              {fields.map(([label, value]) => (
                <div
                  key={label}
                  className="flex flex-col gap-1 border-b border-hairline py-3 last:border-0 sm:flex-row sm:items-start sm:justify-between sm:gap-6"
                >
                  <dt className="shrink-0 text-[11px] uppercase tracking-[0.14em] text-fog-500">
                    {label}
                  </dt>
                  <dd className="break-words text-sm text-fog-100 sm:max-w-[65%] sm:text-right">
                    {value || "—"}
                  </dd>
                </div>
              ))}
            </dl>
          </AdminCard>

          {message ? (
            <AdminCard title={messageLabel}>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-fog-200">
                {message}
              </p>
            </AdminCard>
          ) : null}

          {history}
        </div>

        <div className="flex flex-col gap-6">
          <AdminCard title="Gestión">{actions}</AdminCard>
        </div>
      </div>
    </>
  );
}

/** Historial de notas internas de un prospecto. */
export function LeadNotes({
  notes,
}: {
  notes: { id: string; body: string; createdAt: Date; author: string | null }[];
}) {
  if (!notes.length) return null;

  return (
    <AdminCard title="Notas internas" description={`${notes.length} registradas`}>
      <ul className="flex flex-col gap-4">
        {notes.map((note) => (
          <li
            key={note.id}
            className="rounded-xl border border-hairline bg-ink-850/60 p-4"
          >
            <p className="whitespace-pre-wrap text-sm text-fog-200">{note.body}</p>
            <p className="mt-2.5 text-[11px] text-fog-500">
              {note.author ?? "Sistema"} · {formatDateTime(note.createdAt)}
            </p>
          </li>
        ))}
      </ul>
    </AdminCard>
  );
}
