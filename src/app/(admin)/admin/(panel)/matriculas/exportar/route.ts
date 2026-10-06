import { csvFilename, csvResponse, toCsv } from "@/lib/csv";
import { requirePrisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

/** GET /admin/matriculas/exportar — descarga las matrículas en CSV. */
export async function GET() {
  await requireUser();
  const prisma = requirePrisma();

  const rows = await prisma.enrollment.findMany({
    orderBy: { createdAt: "desc" },
    include: { course: { select: { title: true } } },
  });

  const csv = toCsv(
    [
      "Fecha",
      "Nombre",
      "Correo",
      "Teléfono",
      "Empresa",
      "Curso",
      "Comentario",
      "Estado",
    ],
    rows.map((row) => [
      row.createdAt,
      row.fullName,
      row.email,
      row.phone,
      row.company,
      row.course?.title ?? row.courseText,
      row.message,
      row.status,
    ]),
  );

  return csvResponse(csv, csvFilename("matriculas-soundtech"));
}
