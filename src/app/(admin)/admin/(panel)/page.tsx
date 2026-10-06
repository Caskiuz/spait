import Link from "next/link";
import {
  ArrowUpRight,
  Cable,
  CheckCircle2,
  FolderKanban,
  Users,
  XCircle,
} from "lucide-react";
import {
  AdminCard,
  AdminNotice,
  AdminPageHeader,
  AdminTable,
  AdminRow,
  AdminCell,
  StatCard,
  StatusBadge,
} from "@/components/admin/ui";
import { getPrisma } from "@/lib/db";
import { infrastructureStatus } from "@/lib/env";
import { checkDatabase } from "@/lib/db";
import { formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const prisma = getPrisma();
  const status = infrastructureStatus();
  const reachable = await checkDatabase();

  // Sin base de datos no hay panel: el layout ya redirige, pero por si acaso.
  if (!prisma || !reachable) {
    return (
      <>
        <AdminPageHeader title="Escritorio" />
        <div className="mt-6">
          <AdminNotice tone="warning" title="Base de datos no disponible">
            No pudimos conectar con Postgres. Revisa la variable{" "}
            <code className="rounded bg-ink-800 px-1.5 py-0.5">DATABASE_URL</code>{" "}
            y vuelve a intentarlo.
          </AdminNotice>
        </div>
      </>
    );
  }

  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [
    services,
    clients,
    projects,
    faqs,
    messages,
    enrollments,
    quotes,
    newMessages,
    newEnrollments,
    newQuotes,
    recentMessages,
    recentEnrollments,
    recentQuotes,
  ] = await Promise.all([
    prisma.service.count({ where: { isPublished: true } }),
    prisma.client.count({ where: { isVisible: true } }),
    prisma.project.count({ where: { isPublished: true } }),
    prisma.faq.count({ where: { isVisible: true } }),
    prisma.contactMessage.count({ where: { createdAt: { gte: since } } }),
    prisma.enrollment.count({ where: { createdAt: { gte: since } } }),
    prisma.quoteRequest.count({ where: { createdAt: { gte: since } } }),
    prisma.contactMessage.count({ where: { status: "NUEVO" } }),
    prisma.enrollment.count({ where: { status: "NUEVO" } }),
    prisma.quoteRequest.count({ where: { status: "NUEVO" } }),
    prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.enrollment.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.quoteRequest.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  const totalNew = newMessages + newEnrollments + newQuotes;

  // Actividad reciente unificada y ordenada por fecha.
  const activity = [
    ...recentMessages.map((m) => ({
      kind: "Mensaje",
      href: `/admin/mensajes/${m.id}`,
      name: m.fullName,
      detail: m.company ?? m.email,
      status: m.status,
      date: m.createdAt,
    })),
    ...recentEnrollments.map((e) => ({
      kind: "Matrícula",
      href: `/admin/matriculas/${e.id}`,
      name: e.fullName,
      detail: e.courseText ?? e.email,
      status: e.status,
      date: e.createdAt,
    })),
    ...recentQuotes.map((q) => ({
      kind: "Cotización",
      href: `/admin/cotizaciones/${q.id}`,
      name: q.fullName,
      detail: q.serviceText ?? q.email,
      status: q.status,
      date: q.createdAt,
    })),
  ]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 8);

  return (
    <>
      <AdminPageHeader
        title="Escritorio"
        description="Resumen de prospectos y contenido del sitio."
        actions={
          <Link
            href="/"
            target="_blank"
            className="inline-flex h-10 items-center gap-2 rounded-full border border-hairline px-4 text-xs text-fog-300 transition-colors hover:border-brand-600/60 hover:text-brand-400"
          >
            Ver sitio
            <ArrowUpRight className="size-3.5" aria-hidden />
          </Link>
        }
      />

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Sin atender"
          value={totalNew}
          hint="Prospectos en estado nuevo"
          accent={totalNew > 0}
          href="/admin/mensajes"
        />
        <StatCard
          label="Últimos 30 días"
          value={messages + enrollments + quotes}
          hint={`${messages} mensajes · ${enrollments} matrículas · ${quotes} cotizaciones`}
        />
        <StatCard label="Servicios publicados" value={services} href="/admin/servicios" />
        <StatCard
          label="Contenido activo"
          value={`${clients} / ${projects} / ${faqs}`}
          hint="Clientes / Proyectos / Preguntas"
        />
      </div>

      {/* Estado de integraciones */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <AdminCard title="Integraciones" description="Qué está activo en este despliegue">
          <ul className="flex flex-col gap-2.5 text-xs">
            <IntegrationRow label="Base de datos (Neon)" active={status.database} />
            <IntegrationRow label="Correo saliente (Resend)" active={status.mail} />
            <IntegrationRow label="Almacenamiento (Vercel Blob)" active={status.storage} />
            <IntegrationRow label="Antispam (Turnstile)" active={status.captcha} />
            <IntegrationRow label="Límite de envíos (Upstash)" active={status.rateLimit} />
          </ul>
        </AdminCard>

        <AdminCard title="Resumen operativo">
          <div className="grid grid-cols-2 gap-4">
            <MiniStat icon={Cable} label="Servicios" value={services} />
            <MiniStat icon={Users} label="Clientes" value={clients} />
            <MiniStat icon={FolderKanban} label="Proyectos" value={projects} />
            <MiniStat
              icon={CheckCircle2}
              label="Atendidos"
              value={
                (await prisma.contactMessage.count({ where: { status: "ATENDIDO" } })) +
                (await prisma.enrollment.count({ where: { status: "ATENDIDO" } })) +
                (await prisma.quoteRequest.count({ where: { status: "ATENDIDO" } }))
              }
            />
          </div>
        </AdminCard>
      </div>

      {/* Actividad reciente */}
      <div className="mt-6">
        <AdminCard
          title="Actividad reciente"
          description="Últimos prospectos recibidos desde el sitio"
          padded={false}
        >
          <AdminTable
            head={["Tipo", "Nombre", "Contacto", "Estado", "Recibido"]}
            empty={activity.length === 0}
          >
            {activity.map((item) => (
              <AdminRow key={item.href}>
                <AdminCell>
                  <Link
                    href={item.href}
                    className="text-brand-400 hover:text-brand-300"
                  >
                    {item.kind}
                  </Link>
                </AdminCell>
                <AdminCell className="font-medium text-white">{item.name}</AdminCell>
                <AdminCell className="text-xs text-fog-400">{item.detail}</AdminCell>
                <AdminCell>
                  <StatusBadge status={item.status} />
                </AdminCell>
                <AdminCell className="text-xs text-fog-500">
                  {formatDateTime(item.date)}
                </AdminCell>
              </AdminRow>
            ))}
          </AdminTable>
        </AdminCard>
      </div>
    </>
  );
}

function IntegrationRow({ label, active }: { label: string; active: boolean }) {
  return (
    <li className="flex items-center justify-between gap-4">
      <span className="text-fog-300">{label}</span>
      <span
        className={
          active
            ? "inline-flex items-center gap-1.5 text-emerald-400"
            : "inline-flex items-center gap-1.5 text-fog-500"
        }
      >
        {active ? (
          <CheckCircle2 className="size-3.5" aria-hidden />
        ) : (
          <XCircle className="size-3.5" aria-hidden />
        )}
        {active ? "Activo" : "Sin configurar"}
      </span>
    </li>
  );
}

function MiniStat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Cable;
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center gap-3">
      <span
        aria-hidden
        className="grid size-9 shrink-0 place-items-center rounded-xl border border-hairline bg-white/[0.04] text-brand-500"
      >
        <Icon className="size-4" />
      </span>
      <span>
        <span className="block font-display text-lg font-black text-white">
          {value}
        </span>
        <span className="block text-[10px] uppercase tracking-[0.12em] text-fog-500">
          {label}
        </span>
      </span>
    </div>
  );
}
