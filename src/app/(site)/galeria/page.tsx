import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { GalleryGrid } from "@/components/site/sections/gallery-grid";
import { CtaSection } from "@/components/site/sections/cta-section";
import { galleryItems } from "@/content/pages";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Galería",
  description:
    "Galería de instalaciones, aulas acústicas, laboratorio y estudio de grabación de Sound Tech Perú.",
  alternates: { canonical: "/galeria" },
};

export default function GaleriaPage() {
  const items = galleryItems
    .filter((item) => item.isVisible)
    .map(({ title, category, imageKey }) => ({ title, category, imageKey }));

  return (
    <>
      <PageHero
        titleLead="NUESTRA"
        titleAccent="GALERÍA"
        subtitle="Instalaciones, aulas y estudio de grabación"
        imageKey="hero-galeria"
      />

      <GalleryGrid items={items} />

      <CtaSection
        title="¿QUIERES CONOCER NUESTRO ESTUDIO?"
        subtitle="Agenda una visita y conoce las aulas acondicionadas acústicamente y el estudio de grabación."
        buttonLabel="Agendar visita"
        buttonHref="/contactenos"
        imageKey="hero-galeria"
      />
    </>
  );
}
