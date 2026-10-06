import type { Metadata } from "next";
import {
  Camera,
  Cable,
  Lightbulb,
  Mic,
  Monitor,
  Network,
  Radio,
  ShieldCheck,
  SlidersHorizontal,
  Waves,
} from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { ButtonLink } from "@/components/ui/button";
import { Container, DotPattern, GlowBlob, Section } from "@/components/ui/layout";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { MediaImage } from "@/components/site/media-image";
import { AcademyBanner } from "@/components/site/sections/academy-banner";
import { ClientsCarousel } from "@/components/site/sections/clients-carousel";
import { homeContent, nosotrosContent } from "@/content";
import { getClients, getServices } from "@/server/repositories/content";
import type { ServiceContent } from "@/content/types";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Sobre nosotros",
  description:
    "Conoce la trayectoria de Sound Tech Perú: más de 10 años en la venta de equipos profesionales y en la ingeniería de sonido.",
  alternates: { canonical: "/nosotros" },
};

/** Icono por area de proyecto, en el mismo orden que las capturas. */
const AREA_ICONS: Record<string, typeof Mic> = {
  AUDIO: Mic,
  ACÚSTICA: Waves,
  "CONFERENCIA Y VOTACIÓN": SlidersHorizontal,
  "CONTROL INTEGRADO": Monitor,
  ILUMINACIÓN: Lightbulb,
  SEGURIDAD: ShieldCheck,
  VIDEO: Camera,
  "CABLEADO ESTRUCTURADO": Cable,
  TELECOMUNICACIÓN: Network,
};

function ServiceAreaCard({ service }: { service: ServiceContent }) {
  const Icon = AREA_ICONS[service.areaLabel] ?? Radio;

  return (
    <div className="flex gap-3.5">
      <span
        aria-hidden
        className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl border border-brand-600/35 bg-brand-600/10 text-brand-500"
      >
        <Icon className="size-4" />
      </span>

      <div>
        <h3 className="font-display text-[11px] font-extrabold uppercase tracking-[0.14em] text-brand-500">
          {service.areaLabel}
        </h3>
        <p className="mt-1.5 text-xs leading-relaxed text-fog-400">
          {service.areaDescription}
        </p>
      </div>
    </div>
  );
}

export default async function NosotrosPage() {
  const [services, clients] = await Promise.all([getServices(), getClients()]);

  const galleryKeys = [
    "hero-nosotros",
    "hero-galeria",
    "conferencia-1",
    "iluminacion-1",
  ];

  return (
    <>
      <PageHero
        titleLead="SOBRE"
        titleAccent="NOSOTROS"
        subtitle="Conoce nuestra trayectoria"
        imageKey="hero-nosotros"
      />

      {/* Division de proyectos */}
      <Section className="overflow-hidden pt-14 md:pt-16">
        <GlowBlob
          className="-right-36 top-6 opacity-45"
          size={500}
          color="rgba(255,107,0,0.24)"
        />

        <Container className="relative">
          <Reveal>
            <p className="eyebrow mb-3">{nosotrosContent.projects.eyebrow}</p>
            <h2 className="headline max-w-3xl text-3xl md:text-4xl lg:text-[2.9rem]">
              <span className="text-white">
                {nosotrosContent.projects.titleLead}{" "}
              </span>
              <span className="text-gradient-brand">
                {nosotrosContent.projects.titleAccent}
              </span>
            </h2>
            <p className="mt-6 max-w-3xl text-[0.9rem] leading-relaxed text-fog-400">
              {nosotrosContent.projects.body}
            </p>
          </Reveal>

          {/* Areas de proyecto */}
          <RevealGroup className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-12">
            {services.map((service) => (
              <RevealItem key={service.slug}>
                <ServiceAreaCard service={service} />
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </Section>

      {/* Galeria + cierre */}
      <Section className="pt-0">
        <Container>
          <Reveal className="relative">
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {galleryKeys.map((key, index) => (
                <div
                  key={key}
                  className={
                    "relative overflow-hidden rounded-card " +
                    (index % 2 === 1 ? "mt-6 lg:mt-0" : "")
                  }
                >
                  <div className="aspect-4/3">
                    <MediaImage
                      mediaKey={key}
                      sizes="(max-width: 1024px) 46vw, 23vw"
                      className="object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>
            <DotPattern className="-left-4 bottom-4 size-20 opacity-35" />
          </Reveal>

          <Reveal delay={0.1} className="mx-auto mt-12 max-w-3xl text-center">
            <p className="text-[0.9rem] leading-relaxed text-fog-300">
              {nosotrosContent.closingText}
            </p>
            <div className="mt-8 flex justify-center">
              <ButtonLink
                href={nosotrosContent.closingCta.href}
                variant="outline"
                size="md"
              >
                {nosotrosContent.closingCta.label}
              </ButtonLink>
            </div>
          </Reveal>
        </Container>
      </Section>

      <AcademyBanner
        eyebrow={homeContent.academy.eyebrow}
        titleLead={homeContent.academy.titleLead}
        titleAccent={homeContent.academy.titleAccent}
        body={homeContent.academy.body}
        cta={homeContent.academy.cta}
        enrollCard={homeContent.academy.enrollCard}
        imageKey="academy-photo"
      />

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
