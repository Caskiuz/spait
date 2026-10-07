import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { Container, Section } from "@/components/ui/layout";
import { MediaImage } from "@/components/site/media-image";
import { SocialsSection } from "@/components/site/sections/socials-section";
import { ContactForm } from "@/components/forms/contact-form";
import { contactPageContent } from "@/content";
import { getServices, getSocialLinks } from "@/server/repositories/content";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Contáctenos",
  description:
    "Cuéntanos qué solución necesitas y nuestro equipo se pondrá en contacto contigo. Teléfono +51 964 687 451.",
  alternates: { canonical: "/contactenos" },
};

export default async function ContactenosPage() {
  const [socials, services] = await Promise.all([
    getSocialLinks(),
    getServices(),
  ]);

  const serviceOptions = services.map((service) => ({
    value: service.slug,
    label: service.title,
  }));

  return (
    <>
      {/* Bicolor como en la referencia: «CONTÁCTE» en blanco y «NOS» en
          naranja. Sin espacio entre las dos partes, para que se lea como la
          palabra que es y no como «contácte nos». */}
      <PageHero
        titleLead="CONTÁCTE"
        titleAccent="NOS"
        accentJoined
        subtitle="Hablemos de tu próximo proyecto"
        imageKey="deco-disco"
        variant="tenue"
      />

      <SocialsSection
        eyebrow={contactPageContent.socialsEyebrow}
        title={contactPageContent.socialsHeading}
        quote={contactPageContent.socialsQuote}
        body={contactPageContent.socialsBody}
        socials={socials}
        cta={{ label: contactPageContent.socialsCta, href: "/redes-sociales" }}
      />

      {/* Formulario */}
      <Section tone="raised" className="relative overflow-hidden">
        <div className="absolute inset-0">
          <MediaImage
            mediaKey="fondo-clientes"
            sizes="100vw"
            className="object-cover opacity-70"
          />
          <span
            aria-hidden
            className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/94 to-ink-950/70"
          />
        </div>

        <Container className="relative">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start lg:gap-16">
            {/* Formulario */}
            <div>
              <h2 className="headline text-3xl md:text-4xl lg:text-[2.9rem]">
                <span className="text-white">
                  {contactPageContent.formHeadingLead}
                </span>
                <span className="text-gradient-brand block">
                  {contactPageContent.formHeadingAccent}
                </span>
              </h2>

              <p className="mt-5 max-w-md text-sm leading-relaxed text-fog-300">
                {contactPageContent.formSubtitle}
              </p>

              <div className="mt-9 max-w-md">
                <ContactForm serviceOptions={serviceOptions} />
              </div>
            </div>

            {/* Imagen */}
            <div className="relative hidden lg:block">
              <div className="relative aspect-4/5 overflow-hidden rounded-card-lg border border-hairline">
                <MediaImage
                  mediaKey="home-nosotros"
                  sizes="50vw"
                  className="object-cover"
                />
                <span
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-ink-950/80 to-transparent"
                />
              </div>

              {/* Rótulo vertical, presente en la captura */}
              <p
                aria-hidden
                className="absolute -right-10 top-1/2 -translate-y-1/2 rotate-90 text-[10px] font-semibold uppercase tracking-[0.4em] text-fog-500"
              >
                Audio · Tecnología · Experiencia · Soluciones
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
