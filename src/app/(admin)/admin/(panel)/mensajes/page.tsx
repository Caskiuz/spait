import { LeadInbox, type LeadRow } from "@/components/admin/lead-inbox";
import { getServices } from "@/server/repositories/content";
import { requirePrisma } from "@/lib/db";

export const dynamic = "force-dynamic";

const BASE = "/admin/mensajes";

export default async function AdminMensajesPage({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string }>;
}) {
  const { estado } = await searchParams;
  const prisma = requirePrisma();
  const status = estado && estado !== "TODOS" ? estado : undefined;

  const [rows, grouped, services] = await Promise.all([
    prisma.contactMessage.findMany({
      where: status ? { status: status as never } : undefined,
      orderBy: { createdAt: "desc" },
      take: 200,
    }),
    prisma.contactMessage.groupBy({ by: ["status"], _count: true }),
    getServices(),
  ]);

  const counts = Object.fromEntries(
    grouped.map((g) => [g.status, g._count]),
  ) as Record<string, number>;

  const serviceName = new Map(services.map((s) => [s.slug, s.title]));

  const items: LeadRow[] = rows.map((row) => ({
    id: row.id,
    fullName: row.fullName,
    email: row.email,
    phone: row.phone,
    company: row.company,
    status: row.status,
    createdAt: row.createdAt,
    subject: serviceName.get(row.serviceText ?? "") ?? row.serviceText ?? row.message,
  }));

  return (
    <LeadInbox
      title="Mensajes"
      description="Consultas enviadas desde el formulario de contacto del sitio."
      basePath={BASE}
      rows={items}
      counts={counts}
      activeFilter={status ?? "TODOS"}
      exportHref={`${BASE}/exportar`}
      subjectLabel="Servicio / mensaje"
    />
  );
}
