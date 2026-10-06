import { notFound } from "next/navigation";
import { LeadActions } from "@/components/admin/lead-actions";
import { LeadDetail, LeadNotes } from "@/components/admin/lead-inbox";
import { requirePrisma } from "@/lib/db";
import { formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminMatriculaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const prisma = requirePrisma();

  const enrollment = await prisma.enrollment.findUnique({
    where: { id },
    include: {
      course: { select: { title: true, duration: true } },
      notes: {
        orderBy: { createdAt: "desc" },
        include: { author: { select: { name: true } } },
      },
    },
  });

  if (!enrollment) notFound();

  return (
    <LeadDetail
      basePath="/admin/matriculas"
      title={enrollment.fullName}
      subtitle={`Matrícula registrada el ${formatDateTime(enrollment.createdAt)}`}
      fields={[
        ["Correo", enrollment.email],
        ["Teléfono", enrollment.phone],
        ["Empresa", enrollment.company ?? ""],
        ["Curso", enrollment.course?.title ?? enrollment.courseText ?? ""],
        ["Duración", enrollment.course?.duration ?? "1 año (4 módulos)"],
        ["Estado", enrollment.status.replace("_", " ").toLowerCase()],
        ["Aviso por correo", enrollment.notified ? "Enviado" : "Pendiente"],
      ]}
      message={enrollment.message}
      messageLabel="Comentario del interesado"
      actions={
        <LeadActions
          kind="matricula"
          id={enrollment.id}
          status={enrollment.status}
          email={enrollment.email}
          phone={enrollment.phone}
        />
      }
      history={
        <LeadNotes
          notes={enrollment.notes.map((note) => ({
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
