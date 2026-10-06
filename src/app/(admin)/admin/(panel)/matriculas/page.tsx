import { LeadInbox, type LeadRow } from "@/components/admin/lead-inbox";
import { requirePrisma } from "@/lib/db";

export const dynamic = "force-dynamic";

const BASE = "/admin/matriculas";

export default async function AdminMatriculasPage({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string }>;
}) {
  const { estado } = await searchParams;
  const prisma = requirePrisma();
  const status = estado && estado !== "TODOS" ? estado : undefined;

  const [rows, grouped] = await Promise.all([
    prisma.enrollment.findMany({
      where: status ? { status: status as never } : undefined,
      orderBy: { createdAt: "desc" },
      take: 200,
      include: { course: { select: { title: true } } },
    }),
    prisma.enrollment.groupBy({ by: ["status"], _count: true }),
  ]);

  const counts = Object.fromEntries(
    grouped.map((g) => [g.status, g._count]),
  ) as Record<string, number>;

  const items: LeadRow[] = rows.map((row) => ({
    id: row.id,
    fullName: row.fullName,
    email: row.email,
    phone: row.phone,
    company: row.company,
    status: row.status,
    createdAt: row.createdAt,
    subject:
      row.course?.title ??
      row.courseText ??
      row.message ??
      "Sin especificar",
  }));

  return (
    <LeadInbox
      title="Matrículas"
      description="Solicitudes de información para el programa de Ingeniería de Sonido."
      basePath={BASE}
      rows={items}
      counts={counts}
      activeFilter={status ?? "TODOS"}
      exportHref={`${BASE}/exportar`}
      subjectLabel="Curso"
    />
  );
}
