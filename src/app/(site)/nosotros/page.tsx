import type { Metadata } from "next";
import { MediaImage } from "@/components/site/media-image";
import { PageHero } from "@/components/site/page-hero";
import { ButtonLink } from "@/components/ui/button";
import { Container, DotPattern, GlowBlob, Section } from "@/components/ui/layout";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { AcademyBanner } from "@/components/site/sections/academy-banner";
import { ClientsCarousel } from "@/components/site/sections/clients-carousel";
import { homeContent, nosotrosContent } from "@/content";
import { getClients } from "@/server/repositories/content";
import { servicesByArea } from "@/content/services";
import type { ServiceContent } from "@/content/types";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Sobre nosotros",
  description:
    "Conoce la trayectoria de Sound Tech Perú: más de 10 años en la venta de equipos profesionales y en la ingeniería de sonido.",
  alternates: { canonical: "/nosotros" },
};

/**
 * Icono de cada area, con los PNG que envio el disenador.
 * La clave es el slug del servicio.
 */
const AREA_ICONS: Record<string, string> = {
  "sistema-de-audio-profesional-y-comercial": "area-audio",
  "acondicionamiento-y-aislamiento-acustico": "area-acustica",
  "sistemas-de-conferencia-y-votacion": "area-conferencia",
  "sistemas-de-control-integrado": "area-control",
  "sistemas-de-iluminacion": "area-iluminacion",
  "circuito-cerrado-de-television-cctv": "area-seguridad",
  "sistemas-de-videoproyeccion-y-pantallas": "area-video",
  "cableado-estructurado": "area-cableado",
  "sistemas-de-teleconferencia": "area-telecomunicacion",
};

function ServiceAreaCard({ service }: { service: ServiceContent }) {
  const iconKey = AREA_ICONS[service.slug];

  return (
    <div className="flex gap-3.5">
      {iconKey ? (
        <MediaImage
          mediaKey={iconKey}
          alt=""
          fill={false}
          width={36}
          height={36}
          sizes="36px"
          className="mt-0.5 size-9 shrink-0 object-contain"
        />
      ) : null}

      <div>
        <h3 className="font-display text-[11px] font-black uppercase tracking-[0.14em] text-brand-500">
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
  // La rejilla de areas sigue el orden del diseno, que no coincide con el de
  // la lista de /servicios: por eso se usa servicesByArea.
  const [clients] = await Promise.all([getClients()]);
  const services = servicesByArea;

  // Imagenes que el disenador ya envio montadas para esta seccion.
  const galleryKeys = [
    "nosotros-imagenes",
    "nosotros-banner",
    "home-nosotros",
    "fondo-clientes",
  ];

  return (
    <>
      <PageHero
        titleLead="SOBRE"
        titleAccent="NOSOTROS"
        subtitle="Conoce nuestra trayectoria"
        imageKey="nosotros-banner"
        variant="tenue"
      />

      {/* Division de proyectos */}
      <Section className="overflow-hidden pt-14 md:pt-16">
        <GlowBlob
          className="-right-36 top-6 opacity-45"
          size={500}
          color="rgba(235,93,26,0.24)"
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
