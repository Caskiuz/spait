import { csvFilename, csvResponse, toCsv } from "@/lib/csv";
import { requirePrisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

/** GET /admin/mensajes/exportar — descarga las consultas en CSV. */
export async function GET() {
  await requireUser();
  const prisma = requirePrisma();

  const rows = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  const csv = toCsv(
    [
      "Fecha",
      "Nombre",
      "Correo",
      "Teléfono",
      "Empresa",
      "Servicio de interés",
      "Mensaje",
      "Estado",
      "Origen",
      "Aviso enviado",
    ],
    rows.map((row) => [
      row.createdAt,
      row.fullName,
      row.email,
      row.phone,
      row.company,
      row.serviceText,
      row.message,
      row.status,
      row.source,
      row.notified ? "Sí" : "No",
    ]),
  );

  return csvResponse(csv, csvFilename("mensajes-soundtech"));
}
