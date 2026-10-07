import type { Metadata } from "next";
import { Quote } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { Container, GlowBlob, Section } from "@/components/ui/layout";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { MediaImage } from "@/components/site/media-image";
import { ClientsCarousel } from "@/components/site/sections/clients-carousel";
import { CtaSection } from "@/components/site/sections/cta-section";
import { homeContent, siteSettings } from "@/content";
import { testimonials } from "@/content/pages";
import { getClients } from "@/server/repositories/content";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Clientes",
  description:
    "Colegios, empresas e instituciones que confían en Sound Tech Perú para sus proyectos de audio e integración tecnológica.",
  alternates: { canonical: "/clientes" },
};

export default async function ClientesPage() {
  const clients = await getClients();

  const stats = [
    { value: `+${siteSettings.yearsOfExperience}`, label: "años de experiencia" },
    { value: String(clients.length), label: "clientes activos" },
    { value: "9", label: "líneas de servicio" },
    { value: "100%", label: "proyectos con soporte" },
  ];

  return (
    <>
      <PageHero
        titleLead="NUESTROS"
        titleAccent="CLIENTES"
        subtitle="Empresas que confían en nosotros"
        imageKey="fondo-clientes"
        variant="tenue"
      />

      {/* Cifras */}
      <Section className="pt-14 md:pt-16">
        <Container>
          <RevealGroup className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {stats.map((stat) => (
              <RevealItem key={stat.label}>
                <div className="rounded-card border border-hairline bg-ink-900/60 p-6 text-center">
                  <p className="font-display text-3xl font-black text-gradient-brand md:text-4xl">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-[11px] uppercase tracking-[0.14em] text-fog-400">
                    {stat.label}
                  </p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </Section>

      {/* Rejilla completa de clientes */}
      <Section tone="raised" className="overflow-hidden">
        <GlowBlob
          className="left-1/2 top-0 -translate-x-1/2 opacity-45"
          size={520}
          color="rgba(235,93,26,0.24)"
        />

        <Container className="relative">
          <h2 className="headline text-3xl md:text-4xl">
            <span className="text-white">EMPRESAS QUE </span>
            <span className="text-gradient-brand">CONFÍAN EN NOSOTROS</span>
          </h2>

          <RevealGroup className="mt-10 grid grid-cols-2 gap-5 lg:grid-cols-4">
            {clients.map((client) => (
              <RevealItem key={client.name}>
                <article className="flex h-full flex-col items-center gap-4 rounded-card border border-hairline bg-ink-900/70 p-6 text-center">
                  <div className="relative grid h-24 w-full place-items-center">
                    <MediaImage
                      mediaKey={client.logoKey}
                      fallbackAlt={client.name}
                      fill={false}
                      width={96}
                      height={110}
                      sizes="96px"
                      className="h-24 w-auto object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="font-display text-[13px] font-extrabold uppercase leading-tight text-white">
                      {client.shortName}
                    </h3>
                    <p className="mt-1.5 text-[11px] text-brand-400">
                      {client.category}
                    </p>
                  </div>
                </article>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </Section>

      {/* Testimonios */}
      <Section>
        <Container>
          <Reveal>
            <h2 className="headline text-3xl md:text-4xl">
              <span className="text-white">LO QUE </span>
              <span className="text-gradient-brand">DICEN</span>
            </h2>
          </Reveal>

          <RevealGroup className="mt-10 grid gap-5 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <RevealItem key={testimonial.author}>
                <figure className="flex h-full flex-col rounded-card-lg border border-hairline bg-ink-900/60 p-7">
                  <Quote
                    aria-hidden
                    className="size-6 text-brand-600/70"
                  />
                  <blockquote className="mt-5 flex-1 text-sm leading-relaxed text-fog-200">
                    {testimonial.quote}
                  </blockquote>
                  <figcaption className="mt-6 border-t border-hairline pt-5">
                    <span className="block font-display text-[12px] font-extrabold uppercase tracking-wide text-white">
                      {testimonial.author}
                    </span>
                    <span className="mt-1 block text-[11px] text-brand-400">
                      {testimonial.role}
                    </span>
                  </figcaption>
                </figure>
              </RevealItem>
            ))}
          </RevealGroup>
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

      <CtaSection
        title="¿QUIERES SER NUESTRO PRÓXIMO CASO DE ÉXITO?"
        subtitle="Cuéntanos qué necesitas y armamos una propuesta para tu institución."
        buttonLabel="Solicitar información"
        buttonHref="/cotizar"
        imageKey="fondo-clientes"
      />
    </>
  );
}
