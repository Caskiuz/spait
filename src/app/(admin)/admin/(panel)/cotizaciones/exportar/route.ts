import { csvFilename, csvResponse, toCsv } from "@/lib/csv";
import { requirePrisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

/** GET /admin/cotizaciones/exportar — descarga las cotizaciones en CSV. */
export async function GET() {
  await requireUser();
  const prisma = requirePrisma();

  const rows = await prisma.quoteRequest.findMany({
    orderBy: { createdAt: "desc" },
  });

  const csv = toCsv(
    [
      "Fecha",
      "Nombre",
      "Correo",
      "Teléfono",
      "Empresa",
      "Servicio",
      "Tipo de proyecto",
      "Presupuesto",
      "Descripción",
      "Estado",
    ],
    rows.map((row) => [
      row.createdAt,
      row.fullName,
      row.email,
      row.phone,
      row.company,
      row.serviceText,
      row.projectType,
      row.budget,
      row.description,
      row.status,
    ]),
  );

  return csvResponse(csv, csvFilename("cotizaciones-soundtech"));
}
