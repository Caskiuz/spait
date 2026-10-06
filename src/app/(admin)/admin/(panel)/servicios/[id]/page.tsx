import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import {
  AdminCard,
  AdminCell,
  AdminPageHeader,
  AdminRow,
  AdminTable,
} from "@/components/admin/ui";
import {
  AdminForm,
  CheckboxInput,
  TextArea,
  TextInput,
} from "@/components/admin/admin-form";
import { saveServiceForm } from "@/server/actions/admin-forms";
import { requirePrisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminServicioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const prisma = requirePrisma();

  const service = await prisma.service.findUnique({
    where: { id },
    include: {
      paragraphs: { orderBy: { order: "asc" } },
      solutions: { orderBy: { order: "asc" } },
      applications: { orderBy: { order: "asc" } },
      scopeGroups: { orderBy: { order: "asc" } },
      images: { orderBy: { order: "asc" }, include: { media: true } },
    },
  });

  if (!service) notFound();

  return (
    <>
      <Link
        href="/admin/servicios"
        className="text-xs text-fog-400 transition-colors hover:text-brand-400"
      >
        ← Volver a servicios
      </Link>

      <div className="mt-4">
        <AdminPageHeader
          title={service.title}
          description="Edita el contenido editable. Los párrafos, soluciones e imágenes se cargan desde el contenido base o desde la API."
          actions={
            <Link
              href={`/servicios/${service.slug}`}
              target="_blank"
              className="inline-flex h-10 items-center gap-2 rounded-full border border-hairline px-4 text-xs text-fog-300 transition-colors hover:border-brand-600/60 hover:text-brand-400"
            >
              Ver ficha
              <ExternalLink className="size-3.5" aria-hidden />
            </Link>
          }
        />
      </div>

      <div className="mt-6 flex flex-col gap-6">
        <AdminCard title="Contenido principal">
          <AdminForm
            action={saveServiceForm}
            hiddenFields={{ id: service.id }}
            submitLabel="Guardar servicio"
          >
            <div className="grid gap-5 md:grid-cols-2">
              <TextInput
                name="slug"
                label="Slug (URL)"
                defaultValue={service.slug}
                hint="Solo minúsculas, números y guiones."
                required
              />
              <TextInput
                name="order"
                label="Orden"
                type="number"
                defaultValue={service.order}
              />
            </div>

            <TextInput
              name="title"
              label="Título del servicio"
              defaultValue={service.title}
              required
            />

            <div className="grid gap-5 md:grid-cols-2">
              <TextInput
                name="titleLead"
                label="Título — parte blanca"
                defaultValue={service.titleLead}
                required
              />
              <TextInput
                name="titleAccent"
                label="Título — parte naranja"
                defaultValue={service.titleAccent}
                required
              />
            </div>

            <TextArea
              name="summary"
              label="Resumen (se usa en el listado y en Google)"
              defaultValue={service.summary}
              rows={3}
              required
            />

            <div className="grid gap-5 md:grid-cols-2">
              <TextInput
                name="areaLabel"
                label="Etiqueta de área"
                defaultValue={service.areaLabel}
                hint="Aparece en /nosotros, p. ej. AUDIO"
                required
              />
              <TextInput
                name="areaDescription"
                label="Descripción de área"
                defaultValue={service.areaDescription}
                required
              />
            </div>
          </AdminForm>
        </AdminCard>

        <AdminCard title="Bloque de soluciones y llamada a la acción">
          <AdminForm
            action={saveServiceForm}
            hiddenFields={{
              id: service.id,
              slug: service.slug,
              title: service.title,
              titleLead: service.titleLead,
              titleAccent: service.titleAccent,
              summary: service.summary,
              areaLabel: service.areaLabel,
              areaDescription: service.areaDescription,
              order: String(service.order),
              isPublished: service.isPublished ? "true" : "false",
              isFeatured: service.isFeatured ? "true" : "false",
            }}
            submitLabel="Guardar bloque"
          >
            <TextInput
              name="solutionsTitle"
              label="Título del bloque de soluciones"
              defaultValue={service.solutionsTitle}
              required
            />

            <TextInput
              name="ctaTitle"
              label="Título de la llamada a la acción"
              defaultValue={service.ctaTitle}
              required
            />

            <TextArea
              name="ctaSubtitle"
              label="Subtítulo de la llamada a la acción"
              defaultValue={service.ctaSubtitle}
              rows={3}
              required
            />

            <div className="grid gap-5 md:grid-cols-2">
              <TextInput
                name="ctaButtonLabel"
                label="Texto del botón"
                defaultValue={service.ctaButtonLabel}
                required
              />
              <TextInput
                name="keywords"
                label="Palabras clave (separadas por coma)"
                defaultValue={service.keywords.join(", ")}
              />
            </div>
          </AdminForm>
        </AdminCard>

        <AdminCard
          title="Visibilidad y SEO"
          description="El slug, el título y el orden se editan en el bloque de contenido principal."
        >
          <AdminForm
            action={saveServiceForm}
            hiddenFields={{
              id: service.id,
              slug: service.slug,
              title: service.title,
              titleLead: service.titleLead,
              titleAccent: service.titleAccent,
              summary: service.summary,
              areaLabel: service.areaLabel,
              areaDescription: service.areaDescription,
              solutionsTitle: service.solutionsTitle,
              ctaTitle: service.ctaTitle,
              ctaSubtitle: service.ctaSubtitle,
              ctaButtonLabel: service.ctaButtonLabel,
              order: String(service.order),
              keywords: service.keywords.join(", "),
            }}
            submitLabel="Guardar visibilidad"
          >
            <div className="flex flex-col gap-4">
              <CheckboxInput
                name="isPublished"
                label="Publicado"
                hint="Si lo desactivas, la ficha deja de aparecer en el sitio."
                defaultChecked={service.isPublished}
              />
              <CheckboxInput
                name="isFeatured"
                label="Destacado"
                hint="Aparece en el carrusel de la portada."
                defaultChecked={service.isFeatured}
              />
            </div>

            <TextInput
              name="seoTitle"
              label="Título SEO"
              defaultValue={service.seoTitle}
            />
            <TextArea
              name="seoDescription"
              label="Descripción SEO"
              defaultValue={service.seoDescription}
              rows={3}
            />
          </AdminForm>
        </AdminCard>

        {/* Bloques de solo lectura: se cargan desde el contenido base */}
        <AdminCard
          title="Bloques cargados"
          description="Contenido estructurado de esta ficha. Para editarlo, modifica src/content/services.ts o amplía el editor."
          padded={false}
        >
          <AdminTable head={["Bloque", "Elementos"]} empty={false}>
            <AdminRow>
              <AdminCell>Párrafos de introducción</AdminCell>
              <AdminCell className="text-xs text-fog-400">
                {service.paragraphs.length}
              </AdminCell>
            </AdminRow>
            <AdminRow>
              <AdminCell>Soluciones 01–04</AdminCell>
              <AdminCell className="text-xs text-fog-400">
                {service.solutions.map((s) => `${s.number} ${s.title}`).join(" · ") ||
                  "—"}
              </AdminCell>
            </AdminRow>
            <AdminRow>
              <AdminCell>Aplicaciones</AdminCell>
              <AdminCell className="text-xs text-fog-400">
                {service.applications.map((a) => a.title).join(" · ") || "—"}
              </AdminCell>
            </AdminRow>
            <AdminRow>
              <AdminCell>Tipos de proyecto</AdminCell>
              <AdminCell className="text-xs text-fog-400">
                {service.scopeGroups.map((g) => g.title).join(" · ") || "—"}
              </AdminCell>
            </AdminRow>
            <AdminRow>
              <AdminCell>Imágenes</AdminCell>
              <AdminCell className="text-xs text-fog-400">
                {service.images.map((i) => i.media.alt).join(" · ") || "—"}
              </AdminCell>
            </AdminRow>
          </AdminTable>
        </AdminCard>
      </div>
    </>
  );
}
