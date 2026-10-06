import Link from "next/link";
import { ExternalLink } from "lucide-react";
import {
  AdminCard,
  AdminCell,
  AdminPageHeader,
  AdminRow,
  AdminTable,
  Pill,
} from "@/components/admin/ui";
import { requirePrisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminServiciosPage() {
  const prisma = requirePrisma();

  const services = await prisma.service.findMany({
    orderBy: { order: "asc" },
    include: {
      _count: { select: { solutions: true, paragraphs: true, images: true } },
    },
  });

  return (
    <>
      <AdminPageHeader
        title="Servicios"
        description="Las nueve fichas de servicio. Edita textos, SEO y visibilidad de cada una."
      />

      <div className="mt-6">
        <AdminCard padded={false}>
          <AdminTable
            head={["Orden", "Servicio", "Bloques", "Estado", ""]}
            empty={services.length === 0}
          >
            {services.map((service) => (
              <AdminRow key={service.id}>
                <AdminCell className="w-16 text-xs text-fog-500">
                  {String(service.order).padStart(2, "0")}
                </AdminCell>
                <AdminCell>
                  <Link
                    href={`/admin/servicios/${service.id}`}
                    className="font-medium text-white transition-colors hover:text-brand-400"
                  >
                    {service.title}
                  </Link>
                  <span className="mt-0.5 block font-mono text-[10px] text-fog-600">
                    /servicios/{service.slug}
                  </span>
                </AdminCell>
                <AdminCell className="text-xs text-fog-400">
                  {service._count.paragraphs} párrafos ·{" "}
                  {service._count.solutions} soluciones ·{" "}
                  {service._count.images} imágenes
                </AdminCell>
                <AdminCell>
                  {service.isPublished ? (
                    <Pill tone="success">Publicado</Pill>
                  ) : (
                    <Pill tone="muted">Borrador</Pill>
                  )}
                  {service.isFeatured ? (
                    <span className="ml-2">
                      <Pill tone="brand">Destacado</Pill>
                    </span>
                  ) : null}
                </AdminCell>
                <AdminCell>
                  <Link
                    href={`/servicios/${service.slug}`}
                    target="_blank"
                    className="inline-flex items-center gap-1.5 text-[11px] text-fog-400 transition-colors hover:text-brand-400"
                  >
                    Ver
                    <ExternalLink className="size-3" aria-hidden />
                  </Link>
                </AdminCell>
              </AdminRow>
            ))}
          </AdminTable>
        </AdminCard>
      </div>
    </>
  );
}
