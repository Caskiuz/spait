import Link from "next/link";
import { ExternalLink } from "lucide-react";
import {
  AdminCard,
  AdminCell,
  AdminNotice,
  AdminPageHeader,
  AdminRow,
  AdminTable,
  Pill,
} from "@/components/admin/ui";

export const dynamic = "force-dynamic";

const SEED_PROJECTS = [
  "auditorio-escolar-audio-e-iluminacion",
  "videovigilancia-colegio-control-integral",
  "sala-de-directorio-conferencia-y-votacion",
  "red-de-datos-y-cableado-estructurado",
  "acondicionamiento-acustico-de-aulas",
  "iluminacion-y-control-de-salas-comunes",
];

/**
 * Los proyectos viven en src/content/pages.ts hasta que el cliente cargue los
 * suyos desde este panel. Se muestran como referencia editable.
 */
export default function AdminProyectosPage() {
  return (
    <>
      <AdminPageHeader
        title="Proyectos"
        description="Casos de éxito que se muestran en /proyectos."
      />

      <div className="mt-6 flex flex-col gap-6">
        <AdminNotice tone="info" title="Contenido de ejemplo cargado">
          Estos proyectos son ejemplos construidos con el mismo sistema visual
          para que el sitio no quede vacío. Reemplázalos por los casos reales:
          se editan en{" "}
          <code className="rounded bg-ink-800 px-1.5 py-0.5">
            src/content/pages.ts
          </code>{" "}
          y se publican al desplegar.
        </AdminNotice>

        <AdminCard padded={false}>
          <AdminTable head={["Proyecto", "URL", "Estado", ""]} empty={false}>
            {SEED_PROJECTS.map((slug) => (
              <AdminRow key={slug}>
                <AdminCell className="font-mono text-xs text-fog-300">
                  {slug}
                </AdminCell>
                <AdminCell className="font-mono text-[11px] text-fog-500">
                  /proyectos/{slug}
                </AdminCell>
                <AdminCell>
                  <Pill tone="success">Publicado</Pill>
                </AdminCell>
                <AdminCell>
                  <Link
                    href={`/proyectos/${slug}`}
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
