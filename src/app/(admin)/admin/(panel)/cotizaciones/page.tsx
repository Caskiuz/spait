import { LeadInbox, type LeadRow } from "@/components/admin/lead-inbox";
import { requirePrisma } from "@/lib/db";
import { getServices } from "@/server/repositories/content";

export const dynamic = "force-dynamic";

const BASE = "/admin/cotizaciones";

const BUDGET_LABELS: Record<string, string> = {
  "menos-5k": "Menos de S/ 5,000",
  "5k-15k": "S/ 5,000 – 15,000",
  "15k-50k": "S/ 15,000 – 50,000",
  "mas-50k": "Más de S/ 50,000",
  "por-definir": "Por definir",
};

export default async function AdminCotizacionesPage({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string }>;
}) {
  const { estado } = await searchParams;
  const prisma = requirePrisma();
  const status = estado && estado !== "TODOS" ? estado : undefined;

  const [rows, grouped, services] = await Promise.all([
    prisma.quoteRequest.findMany({
      where: status ? { status: status as never } : undefined,
      orderBy: { createdAt: "desc" },
      take: 200,
    }),
    prisma.quoteRequest.groupBy({ by: ["status"], _count: true }),
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
    subject: [
      serviceName.get(row.serviceText ?? "") ?? row.serviceText,
      BUDGET_LABELS[row.budget ?? ""] ?? row.budget,
    ]
      .filter(Boolean)
      .join(" · ") || row.description,
  }));

  return (
    <LeadInbox
      title="Cotizaciones"
      description="Solicitudes de propuesta enviadas desde el sitio."
      basePath={BASE}
      rows={items}
      counts={counts}
      activeFilter={status ?? "TODOS"}
      exportHref={`${BASE}/exportar`}
      subjectLabel="Servicio / presupuesto"
    />
  );
}
