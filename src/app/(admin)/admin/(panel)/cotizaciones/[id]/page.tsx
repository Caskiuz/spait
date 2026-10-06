import { notFound } from "next/navigation";
import { LeadActions } from "@/components/admin/lead-actions";
import { LeadDetail, LeadNotes } from "@/components/admin/lead-inbox";
import { requirePrisma } from "@/lib/db";
import { formatDateTime } from "@/lib/utils";
import { getServices } from "@/server/repositories/content";

export const dynamic = "force-dynamic";

const BUDGET_LABELS: Record<string, string> = {
  "menos-5k": "Menos de S/ 5,000",
  "5k-15k": "S/ 5,000 – 15,000",
  "15k-50k": "S/ 15,000 – 50,000",
  "mas-50k": "Más de S/ 50,000",
  "por-definir": "Aún por definir",
};

const PROJECT_TYPE_LABELS: Record<string, string> = {
  "proyecto-nuevo": "Proyecto nuevo",
  ampliacion: "Ampliación de sistema existente",
  mantenimiento: "Mantenimiento o soporte",
  asesoria: "Asesoría técnica",
  otro: "Otro",
};

export default async function AdminCotizacionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const prisma = requirePrisma();

  const [quote, services] = await Promise.all([
    prisma.quoteRequest.findUnique({
      where: { id },
      include: {
        notes: {
          orderBy: { createdAt: "desc" },
          include: { author: { select: { name: true } } },
        },
      },
    }),
    getServices(),
  ]);

  if (!quote) notFound();

  const serviceName =
    services.find((s) => s.slug === quote.serviceText)?.title ??
    quote.serviceText;

  return (
    <LeadDetail
      basePath="/admin/cotizaciones"
      title={quote.fullName}
      subtitle={`Cotización solicitada el ${formatDateTime(quote.createdAt)}`}
      fields={[
        ["Correo", quote.email],
        ["Teléfono", quote.phone],
        ["Empresa", quote.company ?? ""],
        ["Servicio", serviceName ?? ""],
        ["Tipo de proyecto", PROJECT_TYPE_LABELS[quote.projectType ?? ""] ?? quote.projectType ?? ""],
        ["Presupuesto", BUDGET_LABELS[quote.budget ?? ""] ?? quote.budget ?? ""],
        ["Estado", quote.status.replace("_", " ").toLowerCase()],
        ["Aviso por correo", quote.notified ? "Enviado" : "Pendiente"],
      ]}
      message={quote.description}
      messageLabel="Descripción del proyecto"
      actions={
        <LeadActions
          kind="cotizacion"
          id={quote.id}
          status={quote.status}
          email={quote.email}
          phone={quote.phone}
        />
      }
      history={
        <LeadNotes
          notes={quote.notes.map((note) => ({
            id: note.id,
            body: note.body,
            createdAt: note.createdAt,
            author: note.author?.name ?? null,
          }))}
        />
      }
    />
  );
}
