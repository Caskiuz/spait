import type { Metadata } from "next";
import { VideoHero } from "@/components/site/sections/video-hero";
import { AboutSplit } from "@/components/site/sections/about-split";
import { ServicesShowcase } from "@/components/site/sections/services-showcase";
import { AcademyBanner } from "@/components/site/sections/academy-banner";
import { ClientsCarousel } from "@/components/site/sections/clients-carousel";
import { SocialsSection } from "@/components/site/sections/socials-section";
import { FaqSection } from "@/components/site/sections/faq-section";
import { homeContent } from "@/content";
import {
  getClients,
  getFaqs,
  getFeaturedServices,
  getServices,
  getSiteSettings,
  getSocialLinks,
} from "@/server/repositories/content";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: `${settings.companyName} — Soluciones profesionales de audio e integración tecnológica`,
    description: settings.seoDescription,
    alternates: { canonical: "/" },
  };
}

export default async function HomePage() {
  const [settings, services, featured, clients, socials, faqs] =
    await Promise.all([
      getSiteSettings(),
      getServices(),
      getFeaturedServices(),
      getClients(),
      getSocialLinks(),
      getFaqs(),
    ]);

  // La portada destaca los 8 primeros servicios: 4 grandes y 4 compactos.
  const showcased = (featured.length >= 8 ? featured : services).slice(0, 8);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: settings.companyName,
    description: settings.seoDescription,
    telephone: settings.phone,
    email: settings.email,
    url: settings.siteUrl,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Lima",
      addressCountry: "PE",
    },
    areaServed: "Perú",
    knowsAbout: services.map((s) => s.title),
  };

  return (
    <>
      <script
        type="application/ld+json"
        // El contenido es estatico y controlado; se serializa con JSON.stringify.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <VideoHero
        eyebrow="Audio · Tecnología · Experiencia"
        titleLead={homeContent.hero.titleLead}
        titleAccent={homeContent.hero.titleAccent}
        primaryCta={homeContent.hero.primaryCta}
        secondaryCta={homeContent.hero.secondaryCta}
        posterKey="hero-video-poster"
      />

      {/* En la portada el titular va íntegramente en blanco, como en la
          referencia; el bicolor se reserva para la página de servicios. */}
      <AboutSplit
        eyebrow={homeContent.about.eyebrow}
        titleLead={homeContent.about.titleLead}
        titleAccent=""
        body={homeContent.about.body}
        cta={homeContent.about.cta}
        imageKey="home-nosotros"
        decorativeKey="deco-disco"
      />

      <ServicesShowcase
        services={showcased}
        eyebrow={homeContent.services.eyebrow}
        titleLead={homeContent.services.titleLead}
        titleAccent={homeContent.services.titleAccent}
        cta={homeContent.services.cta}
      />

      <AcademyBanner
        eyebrow={homeContent.academy.eyebrow}
        titleLead={homeContent.academy.titleLead}
        titleAccent={homeContent.academy.titleAccent}
        body={homeContent.academy.body}
        bullets={[
          "Docentes profesionales",
          "Enfoque 100% práctico",
          "Estudio de grabación propio",
          "Certificación por módulo",
          "Alta demanda laboral",
        ]}
        cta={homeContent.academy.cta}
        enrollCard={homeContent.academy.enrollCard}
        imageKey="fondo-matriculate"
      />

      <ClientsCarousel
        clients={clients}
        eyebrow={homeContent.clients.eyebrow}
        titleLead={homeContent.clients.titleLead}
        titleAccent={homeContent.clients.titleAccent}
        subtitle={homeContent.clients.subtitle}
      />

      <SocialsSection
        eyebrow={homeContent.socials.eyebrow}
        title={`${homeContent.socials.titleLead} ${homeContent.socials.titleAccent}`}
        quote={homeContent.socials.quote}
        body={homeContent.socials.body}
        socials={socials}
        cta={homeContent.socials.cta}
      />

      <FaqSection
        faqs={faqs}
        eyebrow={homeContent.faq.eyebrow}
        titleLead={homeContent.faq.titleLead}
        titleAccent={homeContent.faq.titleAccent}
        subtitle={homeContent.faq.subtitle}
        cta={homeContent.faq.cta}
        imageKey="home-preguntas"
      />
    </>
  );
}
