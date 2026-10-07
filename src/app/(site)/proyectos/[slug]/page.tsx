import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/site/page-hero";
import { Container, GlowBlob, Section } from "@/components/ui/layout";
import { Reveal } from "@/components/ui/reveal";
import { MediaImage } from "@/components/site/media-image";
import { CtaSection } from "@/components/site/sections/cta-section";
import { projects } from "@/content/pages";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return { title: "Proyecto no encontrado" };

  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/proyectos/${project.slug}` },
  };
}

export default async function ProyectoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  const meta = [
    project.clientName ? ["Cliente", project.clientName] : null,
    ["Categoría", project.category],
    project.location ? ["Ubicación", project.location] : null,
    project.year ? ["Año", String(project.year)] : null,
  ].filter(Boolean) as [string, string][];

  return (
    <>
      <PageHero
        titleLead="PROYECTO"
        titleAccent={project.category.toUpperCase()}
        subtitle={project.title}
        imageKey={project.coverImageKey}
      />

      <Section className="overflow-hidden pt-14 md:pt-16">
        <GlowBlob
          className="-right-32 top-0 opacity-40"
          size={480}
          color="rgba(235,93,26,0.22)"
        />

        <Container className="relative">
          <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
            <Reveal>
              <h2 className="headline text-2xl md:text-3xl lg:text-[2.35rem]">
                <span className="text-white">EL </span>
                <span className="text-gradient-brand">PROYECTO</span>
              </h2>

              <div className="mt-6 flex flex-col gap-4">
                {project.description.map((paragraph, index) => (
                  <p
                    key={index}
                    className="text-[0.9rem] leading-relaxed text-fog-400"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <dl className="rounded-card-lg border border-hairline bg-ink-900/60 p-7">
                {meta.map(([label, value]) => (
                  <div
                    key={label}
                    className="flex justify-between gap-6 border-b border-hairline py-3 last:border-0"
                  >
                    <dt className="text-xs text-fog-500">{label}</dt>
                    <dd className="text-right text-xs font-semibold text-fog-100">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          {/* Galeria */}
          <Reveal delay={0.12} className="mt-12">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {project.galleryKeys.map((key) => (
                <div
                  key={key}
                  className="relative aspect-4/3 overflow-hidden rounded-card border border-hairline"
                >
                  <MediaImage
                    mediaKey={key}
                    sizes="(max-width: 1024px) 92vw, 30vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </Reveal>
        </Container>
      </Section>

      <CtaSection
        title="¿QUIERES UN RESULTADO ASÍ?"
        subtitle="Cuéntanos las características de tu espacio y te proponemos una solución a medida."
        buttonLabel="Solicitar información"
        buttonHref="/cotizar"
        imageKey={project.coverImageKey}
      />
    </>
  );
}
