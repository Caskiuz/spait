import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { Container, GlowBlob, Section } from "@/components/ui/layout";
import { QuoteForm } from "@/components/forms/quote-form";
import { ClientsCarousel } from "@/components/site/sections/clients-carousel";
import { homeContent } from "@/content";
import {
  getClients,
  getServices,
  getSiteSettings,
} from "@/server/repositories/content";
import { Mail, MessageSquare, Phone } from "lucide-react";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Cotizar proyecto",
  description:
    "Solicita una cotización para tu proyecto de audio, acústica, iluminación, videoproyección, CCTV o cableado estructurado.",
  alternates: { canonical: "/cotizar" },
};

export default async function CotizarPage({
  searchParams,
}: {
  searchParams: Promise<{ servicio?: string }>;
}) {
  const [{ servicio }, services, clients, settings] = await Promise.all([
    searchParams,
    getServices(),
    getClients(),
    getSiteSettings(),
  ]);

  const serviceOptions = services.map((service) => ({
    value: service.slug,
    label: service.title,
  }));

  const preselected = services.some((s) => s.slug === servicio)
    ? servicio
    : undefined;

  const steps = [
    {
      title: "1. Nos cuentas tu proyecto",
      description:
        "Completas el formulario con el tipo de espacio, la necesidad y el presupuesto estimado.",
    },
    {
      title: "2. Evaluamos y proponemos",
      description:
        "Revisamos los requerimientos y te enviamos una propuesta preliminar con alternativas de equipamiento.",
    },
    {
      title: "3. Coordinamos una visita",
      description:
        "Si el proyecto lo requiere, agendamos una inspección técnica del espacio sin costo.",
    },
    {
      title: "4. Ejecutamos e instalamos",
      description:
        "Ejecutamos la instalación, la probamos contigo y entregamos la documentación del sistema.",
    },
  ];

  return (
    <>
      <PageHero
        titleLead="COTIZA TU"
        titleAccent="PROYECTO"
        subtitle="Cuéntanos qué necesitas y te enviamos una propuesta"
        imageKey="fondo-matriculate"
        variant="tenue"
      />

      <Section className="overflow-hidden pt-14 md:pt-16">
        <GlowBlob
          className="-right-32 top-0 opacity-45"
          size={520}
          color="rgba(235,93,26,0.24)"
        />

        <Container className="relative">
          <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            {/* Formulario */}
            <div>
              <h2 className="headline text-3xl md:text-4xl">
                <span className="text-white">SOLICITA TU </span>
                <span className="text-gradient-brand">COTIZACIÓN</span>
              </h2>
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-fog-400">
                Mientras más detalle nos des, más precisa será la propuesta.
                Todos los datos son confidenciales.
              </p>

              <div className="mt-9">
                <QuoteForm
                  serviceOptions={serviceOptions}
                  defaultService={preselected}
                />
              </div>
            </div>

            {/* Proceso + contacto directo */}
            <div className="flex flex-col gap-6">
              <div className="rounded-card-lg border border-hairline bg-ink-900/60 p-7">
                <h3 className="font-display text-lg font-extrabold uppercase tracking-tight text-white">
                  Cómo trabajamos
                </h3>
                <ol className="mt-6 flex flex-col gap-5">
                  {steps.map((step) => (
                    <li key={step.title}>
                      <p className="font-display text-[12px] font-extrabold uppercase tracking-wide text-brand-500">
                        {step.title}
                      </p>
                      <p className="mt-1.5 text-xs leading-relaxed text-fog-400">
                        {step.description}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="rounded-card-lg border border-hairline bg-ink-900/60 p-7">
                <h3 className="font-display text-lg font-extrabold uppercase tracking-tight text-white">
                  ¿Prefieres hablar directo?
                </h3>

                <ul className="mt-5 flex flex-col gap-3 text-sm">
                  <li>
                    <a
                      href={`tel:${settings.phone}`}
                      className="inline-flex items-center gap-2.5 text-fog-300 transition-colors hover:text-brand-400"
                    >
                      <Phone className="size-4 text-brand-500" aria-hidden />
                      {settings.phoneDisplay}
                    </a>
                  </li>
                  <li>
                    <a
                      href={`mailto:${settings.email}`}
                      className="inline-flex items-center gap-2.5 break-all text-fog-300 transition-colors hover:text-brand-400"
                    >
                      <Mail className="size-4 text-brand-500" aria-hidden />
                      {settings.email}
                    </a>
                  </li>
                  <li>
                    <a
                      href={`https://wa.me/${settings.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2.5 text-fog-300 transition-colors hover:text-brand-400"
                    >
                      <MessageSquare className="size-4 text-brand-500" aria-hidden />
                      Escríbenos por WhatsApp
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <ClientsCarousel
        clients={clients}
        eyebrow={homeContent.clients.eyebrow}
        titleLead={homeContent.clients.titleLead}
        titleAccent={homeContent.clients.titleAccent}
        subtitle={homeContent.clients.subtitle}
        tone="raised"
      />
    </>
  );
}
