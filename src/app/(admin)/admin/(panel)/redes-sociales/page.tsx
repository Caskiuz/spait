import { AdminCard, AdminPageHeader, Pill } from "@/components/admin/ui";
import {
  AdminForm,
  CheckboxInput,
  SelectInput,
  TextInput,
} from "@/components/admin/admin-form";
import { SocialIcon } from "@/components/site/social-icon";
import { saveSocialLinkForm } from "@/server/actions/admin-forms";
import { requirePrisma } from "@/lib/db";
import type { SocialPlatform } from "@/content/types";

export const dynamic = "force-dynamic";

const PLATFORMS = [
  "facebook",
  "instagram",
  "whatsapp",
  "discord",
  "x",
  "pinterest",
  "youtube",
  "tiktok",
].map((value) => ({ value, label: value.toUpperCase() }));

export default async function AdminRedesPage() {
  const prisma = requirePrisma();

  const socials = await prisma.socialLink.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <>
      <AdminPageHeader
        title="Redes sociales"
        description="Enlaces que aparecen en la portada, en /redes-sociales y en el pie del sitio."
      />

      <div className="mt-6 flex flex-col gap-6">
        <AdminCard title="Agregar red social">
          <AdminForm
            action={saveSocialLinkForm}
            submitLabel="Agregar red"
            compact
          >
            <div className="grid gap-4 md:grid-cols-3">
              <SelectInput
                name="platform"
                label="Plataforma"
                options={PLATFORMS}
                defaultValue="instagram"
              />
              <TextInput name="label" label="Etiqueta" required />
              <TextInput name="order" label="Orden" type="number" defaultValue={99} />
            </div>
            <TextInput
              name="url"
              label="URL completa"
              type="url"
              placeholder="https://…"
              required
            />
            <div className="grid gap-4 md:grid-cols-3">
              <CheckboxInput
                name="isFeatured"
                label="Destacada en portada"
                hint="Aparece en el bloque grande"
              />
              <CheckboxInput
                name="showInFooter"
                label="Mostrar en el pie"
                defaultChecked
              />
              <CheckboxInput name="isVisible" label="Visible" defaultChecked />
            </div>
          </AdminForm>
        </AdminCard>

        <div className="flex flex-col gap-4">
          {socials.map((social) => (
            <AdminCard
              key={social.id}
              title={social.label}
              description={
                social.note ? `Nota: ${social.note}` : "Sin notas pendientes"
              }
              actions={
                <div className="flex items-center gap-2">
                  <SocialIcon
                    platform={social.platform as SocialPlatform}
                    className="size-5 text-brand-500"
                  />
                  <Pill tone={social.isVisible ? "success" : "muted"}>
                    {social.isVisible ? "Visible" : "Oculta"}
                  </Pill>
                </div>
              }
            >
              <AdminForm
                action={saveSocialLinkForm}
                hiddenFields={{ id: social.id }}
                submitLabel="Guardar"
                compact
              >
                <div className="grid gap-4 md:grid-cols-3">
                  <SelectInput
                    name="platform"
                    label="Plataforma"
                    options={PLATFORMS}
                    defaultValue={social.platform}
                  />
                  <TextInput
                    name="label"
                    label="Etiqueta"
                    defaultValue={social.label}
                    required
                  />
                  <TextInput
                    name="order"
                    label="Orden"
                    type="number"
                    defaultValue={social.order}
                  />
                </div>

                <TextInput
                  name="url"
                  label="URL completa"
                  type="url"
                  defaultValue={social.url}
                  required
                />

                <TextInput
                  name="note"
                  label="Nota interna (opcional)"
                  defaultValue={social.note}
                  hint="Se muestra en el panel y como tooltip, no en el sitio público."
                />

                <div className="grid gap-4 md:grid-cols-3">
                  <CheckboxInput
                    name="isFeatured"
                    label="Destacada en portada"
                    defaultChecked={social.isFeatured}
                  />
                  <CheckboxInput
                    name="showInFooter"
                    label="Mostrar en el pie"
                    defaultChecked={social.showInFooter}
                  />
                  <CheckboxInput
                    name="isVisible"
                    label="Visible"
                    defaultChecked={social.isVisible}
                  />
                </div>
              </AdminForm>
            </AdminCard>
          ))}
        </div>
      </div>
    </>
  );
}
