import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { ButtonLink } from "@/components/ui/button";
import { Container, GlowBlob, Section } from "@/components/ui/layout";
import { RevealGroup, RevealItem } from "@/components/ui/reveal";
import { MediaImage } from "@/components/site/media-image";
import { ClientsCarousel } from "@/components/site/sections/clients-carousel";
import { EnrollBanner } from "@/components/site/sections/academy-banner";
import { homeContent, serviciosPageContent } from "@/content";
import { getClients, getServices } from "@/server/repositories/content";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Nuestros servicios",
  description:
    "Audio profesional, acústica, conferencia y votación, teleconferencia, control integrado, iluminación, videoproyección, CCTV y cableado estructurado.",
  alternates: { canonical: "/servicios" },
};

export default async function ServiciosPage() {
  const [services, clients] = await Promise.all([getServices(), getClients()]);

  return (
    <>
      <PageHero
        titleLead="NUESTROS"
        titleAccent="SERVICIOS"
        subtitle="Soluciones profesionales para cada espacio"
        imageKey="hero-servicios"
      />

      {/* Division de proyectos */}
      <Section className="overflow-hidden pt-14 md:pt-16">
        <GlowBlob
          className="-left-32 top-0 opacity-40"
          size={460}
          color="rgba(255,107,0,0.22)"
        />

        <Container className="relative">
          <p className="eyebrow mb-3">{serviciosPageContent.eyebrow}</p>
          <h2 className="headline text-3xl md:text-4xl lg:text-[2.9rem]">
            <span className="text-white">{serviciosPageContent.titleLead} </span>
            <span className="text-gradient-brand">
              {serviciosPageContent.titleAccent}
            </span>
          </h2>

          <div className="mt-6 max-w-3xl">
            <p className="font-display text-lg font-extrabold text-brand-500">
              {serviciosPageContent.brandName}
            </p>
            <p className="mt-3 text-[0.9rem] leading-relaxed text-fog-400">
              {serviciosPageContent.intro}
            </p>
          </div>

          {/* Rejilla de servicios */}
          <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <RevealItem key={service.slug}>
                <article className="group flex h-full flex-col overflow-hidden rounded-card-lg border border-hairline bg-ink-900/60 transition-all duration-300 hover:border-brand-600/45 hover:bg-ink-850">
                  <Link
                    href={`/servicios/${service.slug}`}
                    className="relative block aspect-4/3 overflow-hidden"
                    tabIndex={-1}
                    aria-hidden
                  >
                    <MediaImage
                      mediaKey={service.imageKeys[0] ?? ""}
                      sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 30vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <span
                      aria-hidden
                      className="absolute inset-0 bg-gradient-to-t from-ink-950/70 to-transparent"
                    />
                  </Link>

                  <div className="flex flex-1 flex-col p-5 text-center">
                    <h3 className="font-display text-sm font-extrabold uppercase leading-snug tracking-wide text-white">
                      {service.title}
                    </h3>

                    <div className="mt-auto pt-5">
                      <Link
                        href={`/servicios/${service.slug}`}
                        className="inline-flex h-9 items-center gap-2 rounded-full border border-brand-600/60 px-5 font-display text-[11px] font-bold uppercase tracking-[0.15em] text-brand-500 transition-colors hover:bg-brand-600 hover:text-white"
                      >
                        {serviciosPageContent.cardCta}
                        <ChevronRight className="size-3.5" />
                      </Link>
                    </div>
                  </div>
                </article>
              </RevealItem>
            ))}
          </RevealGroup>

          <div className="mt-12 flex justify-center">
            <ButtonLink href="/cotizar" variant="outline" size="md" withArrow>
              Cotizar un proyecto
            </ButtonLink>
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

      <EnrollBanner
        eyebrow={homeContent.enrollBanner.eyebrow}
        titleLead={homeContent.enrollBanner.titleLead}
        titleAccent={homeContent.enrollBanner.titleAccent}
        body={homeContent.enrollBanner.body}
        enrollCard={{
          title: homeContent.enrollBanner.cardTitle,
          subtitle: homeContent.enrollBanner.cardSubtitle,
          cta: homeContent.enrollBanner.cta,
        }}
        imageKey="academy-photo"
      />
    </>
  );
}
