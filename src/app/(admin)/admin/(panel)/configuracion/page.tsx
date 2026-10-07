import { AdminCard, AdminNotice, AdminPageHeader } from "@/components/admin/ui";
import { AdminForm, TextArea, TextInput } from "@/components/admin/admin-form";
import { updateSiteSettingsForm } from "@/server/actions/admin-forms";
import { getSiteSettings } from "@/server/repositories/content";
import { env } from "@/lib/env";

export const dynamic = "force-dynamic";

export default async function AdminConfiguracionPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <AdminPageHeader
        title="Configuración"
        description="Datos de contacto, dominio y metadatos globales del sitio."
      />

      <div className="mt-6 flex flex-col gap-6">
        {/* Campos pendientes de confirmar con el cliente */}
        <AdminNotice tone="warning" title="Pendiente de confirmar con el cliente">
          <ul className="flex flex-col gap-1.5">
            <li>
              · El <strong>Discord</strong> y el <strong>Pinterest</strong> son
              provisionales; reemplázalos en «Redes sociales».
            </li>
            <li>
              · Faltan <strong>razón social</strong> y <strong>RUC</strong> para
              completar la política de privacidad.
            </li>
            <li>
              · La <strong>dirección</strong> y el <strong>horario</strong> deben
              ser los reales del local.
            </li>
          </ul>
        </AdminNotice>

        <AdminCard title="Datos de contacto">
          <AdminForm
            action={updateSiteSettingsForm}
            submitLabel="Guardar configuración"
          >
            <div className="grid gap-5 md:grid-cols-2">
              <TextInput
                name="companyName"
                label="Nombre comercial"
                defaultValue={settings.companyName}
                required
              />
              <TextInput
                name="tagline"
                label="Lema"
                defaultValue={settings.tagline}
              />
              <TextInput
                name="phoneDisplay"
                label="Teléfono visible"
                defaultValue={settings.phoneDisplay}
                hint="Como se muestra en el sitio: +51 964 687 451"
                required
              />
              <TextInput
                name="whatsapp"
                label="WhatsApp (solo dígitos)"
                defaultValue={settings.whatsapp}
                hint="Con código de país y sin espacios: 51964687451"
                required
              />
              <TextInput
                name="email"
                label="Correo de contacto"
                type="email"
                defaultValue={settings.email}
                required
              />
              <TextInput
                name="address"
                label="Dirección"
                defaultValue={settings.address}
              />
              <TextInput
                name="hours"
                label="Horario de atención"
                defaultValue={settings.hours}
              />
            </div>

            <div className="mt-2 border-t border-hairline pt-5">
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-fog-400">
                Posicionamiento en buscadores
              </p>

              <div className="flex flex-col gap-5">
                <TextInput
                  name="seoTitleTemplate"
                  label="Plantilla de título"
                  defaultValue={settings.seoTitleTemplate}
                  hint="Usa %s donde va el título de cada página."
                />
                <TextArea
                  name="seoDescription"
                  label="Descripción por defecto"
                  defaultValue={settings.seoDescription}
                  rows={3}
                />
              </div>
            </div>
          </AdminForm>
        </AdminCard>

        <AdminCard
          title="Infraestructura"
          description="Se configura con variables de entorno en Vercel, no desde este panel."
        >
          <ul className="flex flex-col gap-3 text-xs">
            <li className="flex items-center justify-between gap-4">
              <span className="text-fog-300">
                Correo de aviso de nuevos prospectos
              </span>
              <code className="rounded bg-ink-800 px-2 py-1 text-[11px] text-brand-400">
                {env.adminNotifyEmail}
              </code>
            </li>
            <li className="flex items-center justify-between gap-4">
              <span className="text-fog-300">Remitente de los correos</span>
              <code className="rounded bg-ink-800 px-2 py-1 text-[11px] text-brand-400">
                {env.mailFrom}
              </code>
            </li>
            <li className="flex items-center justify-between gap-4">
              <span className="text-fog-300">URL pública del sitio</span>
              <code className="rounded bg-ink-800 px-2 py-1 text-[11px] text-brand-400">
                {settings.siteUrl}
              </code>
            </li>
            <li className="flex items-center justify-between gap-4">
              <span className="text-fog-300">Almacenamiento de imágenes</span>
              <span className={env.hasBlob ? "text-emerald-400" : "text-fog-500"}>
                {env.hasBlob
                  ? "Vercel Blob configurado"
                  : "Sin configurar (usa /public/media)"}
              </span>
            </li>
          </ul>
        </AdminCard>
      </div>
    </>
  );
}
