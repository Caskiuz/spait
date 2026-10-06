import { AdminCard, AdminPageHeader } from "@/components/admin/ui";
import {
  AdminForm,
  CheckboxInput,
  TextInput,
} from "@/components/admin/admin-form";
import { saveClientForm } from "@/server/actions/admin-forms";
import { MediaImage } from "@/components/site/media-image";
import { requirePrisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminClientesPage() {
  const prisma = requirePrisma();

  const clients = await prisma.client.findMany({
    orderBy: { order: "asc" },
    include: { logo: true },
  });

  return (
    <>
      <AdminPageHeader
        title="Clientes"
        description="Instituciones y empresas que aparecen en el carrusel de clientes."
      />

      <div className="mt-6 flex flex-col gap-6">
        {/* Alta */}
        <AdminCard title="Agregar cliente">
          <AdminForm
            action={saveClientForm}
            submitLabel="Agregar cliente"
            compact
          >
            <div className="grid gap-4 md:grid-cols-3">
              <TextInput name="name" label="Nombre completo" required />
              <TextInput
                name="shortName"
                label="Nombre corto"
                hint="Se muestra en la tarjeta"
                required
              />
              <TextInput
                name="category"
                label="Categoría"
                defaultValue="Educación"
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <TextInput
                name="websiteUrl"
                label="Sitio web (opcional)"
                type="url"
                placeholder="https://…"
              />
              <TextInput name="order" label="Orden" type="number" defaultValue={99} />
            </div>
            <CheckboxInput
              name="isVisible"
              label="Visible en el sitio"
              defaultChecked
            />
          </AdminForm>
        </AdminCard>

        {/* Listado */}
        <AdminCard
          title={`Clientes registrados (${clients.length})`}
          padded={false}
        >
          <ul className="divide-y divide-hairline">
            {clients.map((client) => (
              <li key={client.id} className="p-5">
                <div className="flex items-start gap-5">
                  <div className="grid size-16 shrink-0 place-items-center rounded-xl border border-hairline bg-ink-850/60">
                    {client.logo ? (
                      <MediaImage
                        mediaKey={client.logo.key ?? ""}
                        fallbackAlt={client.name}
                        fill={false}
                        width={44}
                        height={50}
                        sizes="44px"
                        className="h-11 w-auto object-contain"
                      />
                    ) : (
                      <span className="text-[10px] text-fog-600">sin logo</span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <AdminForm
                      action={saveClientForm}
                      hiddenFields={{ id: client.id }}
                      submitLabel="Guardar"
                      compact
                    >
                      <div className="grid gap-4 md:grid-cols-3">
                        <TextInput
                          name="name"
                          label="Nombre"
                          defaultValue={client.name}
                          required
                        />
                        <TextInput
                          name="shortName"
                          label="Nombre corto"
                          defaultValue={client.shortName}
                          required
                        />
                        <TextInput
                          name="category"
                          label="Categoría"
                          defaultValue={client.category}
                        />
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <TextInput
                          name="websiteUrl"
                          label="Sitio web"
                          defaultValue={client.websiteUrl}
                        />
                        <TextInput
                          name="order"
                          label="Orden"
                          type="number"
                          defaultValue={client.order}
                        />
                      </div>
                      <CheckboxInput
                        name="isVisible"
                        label="Visible en el sitio"
                        defaultChecked={client.isVisible}
                      />
                    </AdminForm>
                  </div>
                </div>
              </li>
            ))}
            {clients.length === 0 ? (
              <li className="px-5 py-12 text-center text-sm text-fog-500">
                Todavía no hay clientes cargados.
              </li>
            ) : null}
          </ul>
        </AdminCard>
      </div>
    </>
  );
}
