import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/site/page-hero";
import {
  ServiceApplications,
  ServiceIntro,
  ServiceScope,
  ServiceSolutions,
} from "@/components/site/service-blocks";
import { CtaSection } from "@/components/site/sections/cta-section";
import { ClientsCarousel } from "@/components/site/sections/clients-carousel";
import { EnrollBanner } from "@/components/site/sections/academy-banner";
import { homeContent, serviciosPageContent } from "@/content";
import { getClients, getServiceBySlug, getServices } from "@/server/repositories/content";

export const revalidate = 300;

// Las nueve fichas se generan en el build a partir del contenido/BD.
export async function generateStaticParams() {
  const services = await getServices();
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return { title: "Servicio no encontrado" };

  return {
    title: service.title,
    description: service.summary,
    keywords: service.keywords,
    alternates: { canonical: `/servicios/${service.slug}` },
    openGraph: {
      title: `${service.title} | Sound Tech Perú`,
      description: service.summary,
      type: "article",
    },
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [service, clients] = await Promise.all([
    getServiceBySlug(slug),
    getClients(),
  ]);

  if (!service) notFound();

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: "/" },
      { "@type": "ListItem", position: 2, name: "Servicios", item: "/servicios" },
      {
        "@type": "ListItem",
        position: 3,
        name: service.title,
        item: `/servicios/${service.slug}`,
      },
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.summary,
    serviceType: service.areaDescription,
    provider: { "@type": "LocalBusiness", name: "Sound Tech Perú" },
    areaServed: "Perú",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      <PageHero
        titleLead={serviciosPageContent.heroTitleLead}
        titleAccent={serviciosPageContent.heroTitleAccent}
        subtitle={serviciosPageContent.heroSubtitle}
        imageKey="hero-servicios"
      />

      <ServiceIntro service={service} />
      <ServiceSolutions service={service} />
      <ServiceApplications service={service} />
      <ServiceScope service={service} />

      <CtaSection
        title={service.ctaTitle}
        subtitle={service.ctaSubtitle}
        buttonLabel={service.ctaButtonLabel}
        buttonHref={`/cotizar?servicio=${service.slug}`}
        imageKey={service.imageKeys[0] ?? "hero-servicios"}
      />

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
