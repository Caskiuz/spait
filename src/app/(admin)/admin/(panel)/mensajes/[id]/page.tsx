import { notFound } from "next/navigation";
import { LeadActions } from "@/components/admin/lead-actions";
import { LeadDetail, LeadNotes } from "@/components/admin/lead-inbox";
import { requirePrisma } from "@/lib/db";
import { formatDateTime } from "@/lib/utils";
import { getServices } from "@/server/repositories/content";

export const dynamic = "force-dynamic";

export default async function AdminMensajePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const prisma = requirePrisma();

  const [message, services] = await Promise.all([
    prisma.contactMessage.findUnique({
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

  if (!message) notFound();

  const serviceName =
    services.find((s) => s.slug === message.serviceText)?.title ??
    message.serviceText;

  return (
    <LeadDetail
      basePath="/admin/mensajes"
      title={message.fullName}
      subtitle={`Consulta recibida el ${formatDateTime(message.createdAt)}`}
      fields={[
        ["Correo", message.email],
        ["Teléfono", message.phone],
        ["Empresa", message.company ?? ""],
        ["Servicio de interés", serviceName ?? ""],
        ["Origen", message.source.replace("FORMULARIO_", "").toLowerCase()],
        ["Estado", message.status.replace("_", " ").toLowerCase()],
        ["Aviso por correo", message.notified ? "Enviado" : "Pendiente"],
        ["IP registrada", message.ip ?? ""],
      ]}
      message={message.message}
      actions={
        <LeadActions
          kind="mensaje"
          id={message.id}
          status={message.status}
          email={message.email}
          phone={message.phone}
        />
      }
      history={
        <LeadNotes
          notes={message.notes.map((note) => ({
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
