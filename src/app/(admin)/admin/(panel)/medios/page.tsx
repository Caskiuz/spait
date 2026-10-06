import { AdminCard, AdminNotice, AdminPageHeader, Pill } from "@/components/admin/ui";
import { MediaImage } from "@/components/site/media-image";
import { env } from "@/lib/env";
import { requirePrisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminMediosPage() {
  const prisma = requirePrisma();

  const assets = await prisma.mediaAsset.findMany({
    orderBy: [{ folder: "asc" }, { key: "asc" }],
  });

  const byFolder = assets.reduce<Record<string, typeof assets>>((acc, asset) => {
    (acc[asset.folder] ??= []).push(asset);
    return acc;
  }, {});

  const inUse = await Promise.all([
    prisma.serviceImage.groupBy({ by: ["mediaId"] }),
    prisma.client.groupBy({ by: ["logoId"] }),
    prisma.galleryImage.groupBy({ by: ["mediaId"] }),
    prisma.projectImage.groupBy({ by: ["mediaId"] }),
    prisma.courseFacility.groupBy({ by: ["mediaId"] }),
    prisma.service.groupBy({ by: ["heroImageId"] }),
    prisma.page.groupBy({ by: ["heroImageId"] }),
  ]);

  const usedIds = new Set(
    inUse
      .flat()
      .map((row) => Object.values(row)[0])
      .filter((id): id is string => typeof id === "string"),
  );

  return (
    <>
      <AdminPageHeader
        title="Medios"
        description={`${assets.length} imágenes registradas. Reemplaza las fotos de marcador de posición por las reales del cliente.`}
      />

      <div className="mt-6 flex flex-col gap-6">
        <AdminNotice
          tone={env.hasBlob ? "success" : "info"}
          title={
            env.hasBlob
              ? "Subida de archivos activa"
              : "Subida de archivos no configurada"
          }
        >
          {env.hasBlob ? (
            <>
              Vercel Blob está configurado. Puedes subir imágenes nuevas desde
              la ficha de cada contenido.
            </>
          ) : (
            <>
              Para habilitar la subida desde el panel, añade la variable{" "}
              <code className="rounded bg-ink-800 px-1.5 py-0.5">
                BLOB_READ_WRITE_TOKEN
              </code>{" "}
              en Vercel (Storage → Blob). Mientras tanto, reemplaza los archivos
              de <code className="rounded bg-ink-800 px-1.5 py-0.5">public/media/</code>{" "}
              conservando el nombre y el sitio se actualizará solo.
            </>
          )}
        </AdminNotice>

        {Object.entries(byFolder).map(([folder, items]) => (
          <AdminCard
            key={folder}
            title={`${folder} (${items.length})`}
            padded={false}
          >
            <ul className="grid grid-cols-2 gap-px overflow-hidden bg-hairline sm:grid-cols-3 lg:grid-cols-4">
              {items.map((asset) => (
                <li key={asset.id} className="bg-ink-900/60 p-4">
                  <div className="relative aspect-4/3 overflow-hidden rounded-xl border border-hairline">
                    <MediaImage
                      mediaKey={asset.key ?? ""}
                      alt={asset.alt}
                      sizes="(max-width: 640px) 45vw, 22vw"
                      className="object-cover"
                    />
                  </div>

                  <p className="mt-3 font-mono text-[10px] text-brand-400">
                    {asset.key ?? asset.url.split("/").pop()}
                  </p>
                  <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-fog-400">
                    {asset.alt}
                  </p>

                  <div className="mt-2.5 flex items-center gap-2">
                    <Pill tone={usedIds.has(asset.id) ? "success" : "muted"}>
                      {usedIds.has(asset.id) ? "En uso" : "Sin uso"}
                    </Pill>
                  </div>

                  <p className="mt-2 text-[10px] text-fog-600">
                    {formatDate(asset.createdAt, {
                      day: "2-digit",
                      month: "short",
                    })}
                  </p>
                </li>
              ))}
            </ul>
          </AdminCard>
        ))}
      </div>
    </>
  );
}
