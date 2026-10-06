import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { ButtonLink } from "@/components/ui/button";
import { Container, GlowBlob, Section } from "@/components/ui/layout";
import { RevealGroup, RevealItem } from "@/components/ui/reveal";
import { MediaImage } from "@/components/site/media-image";
import { CtaSection } from "@/components/site/sections/cta-section";
import { projects } from "@/content/pages";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Proyectos",
  description:
    "Proyectos de audio, acústica, control integrado, iluminación, videoproyección, CCTV y cableado estructurado ejecutados por Sound Tech Perú.",
  alternates: { canonical: "/proyectos" },
};

export default function ProyectosPage() {
  const featured = projects.filter((p) => p.isFeatured);
  const rest = projects.filter((p) => !p.isFeatured);
  const ordered = [...featured, ...rest];

  return (
    <>
      <PageHero
        titleLead="NUESTROS"
        titleAccent="PROYECTOS"
        subtitle="Espacios que suenan y funcionan mejor"
        imageKey="hero-proyectos"
      />

      <Section className="overflow-hidden pt-14 md:pt-16">
        <GlowBlob
          className="-left-32 top-8 opacity-40"
          size={480}
          color="rgba(255,107,0,0.22)"
        />

        <Container className="relative">
          <h2 className="headline max-w-3xl text-3xl md:text-4xl lg:text-[2.9rem]">
            <span className="text-white">DIVISIÓN DE </span>
            <span className="text-gradient-brand">PROYECTOS</span>
          </h2>
          <p className="mt-5 max-w-2xl text-[0.9rem] leading-relaxed text-fog-400">
            Cada proyecto empieza con una visita técnica y una medición. A
            partir de ahí diseñamos la solución, la instalamos y la dejamos
            funcionando con la documentación correspondiente.
          </p>

          <RevealGroup className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {ordered.map((project, index) => (
              <RevealItem key={project.slug}>
                <article
                  className={
                    "group flex h-full flex-col overflow-hidden rounded-card-lg border border-hairline bg-ink-900/60 transition-all duration-300 hover:border-brand-600/45 " +
                    (index === 0 ? "md:col-span-2 lg:col-span-2" : "")
                  }
                >
                  <Link
                    href={`/proyectos/${project.slug}`}
                    className={
                      "relative block overflow-hidden " +
                      (index === 0 ? "aspect-16/9" : "aspect-4/3")
                    }
                  >
                    <MediaImage
                      mediaKey={project.coverImageKey}
                      sizes={
                        index === 0
                          ? "(max-width: 1024px) 92vw, 62vw"
                          : "(max-width: 1024px) 92vw, 30vw"
                      }
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <span
                      aria-hidden
                      className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-ink-950/25 to-transparent"
                    />
                    <span className="absolute left-5 top-5 rounded-full bg-ink-950/80 px-3.5 py-1.5 font-display text-[10px] font-bold uppercase tracking-[0.14em] text-brand-400 backdrop-blur">
                      {project.category}
                    </span>
                  </Link>

                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-display text-base font-extrabold uppercase leading-snug tracking-tight text-white md:text-lg">
                      {project.title}
                    </h3>

                    <p className="mt-3 text-xs leading-relaxed text-fog-400">
                      {project.summary}
                    </p>

                    <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-fog-500">
                      {project.clientName ? <span>{project.clientName}</span> : null}
                      {project.location ? <span>· {project.location}</span> : null}
                      {project.year ? <span>· {project.year}</span> : null}
                    </p>

                    <div className="mt-auto pt-5">
                      <Link
                        href={`/proyectos/${project.slug}`}
                        className="inline-flex items-center gap-2 font-display text-[11px] font-bold uppercase tracking-[0.15em] text-brand-500 transition-colors hover:text-brand-400"
                      >
                        Ver proyecto
                        <ArrowUpRight className="size-3.5" />
                      </Link>
                    </div>
                  </div>
                </article>
              </RevealItem>
            ))}
          </RevealGroup>

          <div className="mt-12 flex justify-center">
            <ButtonLink href="/cotizar" variant="outline" size="md" withArrow>
              Cotizar mi proyecto
            </ButtonLink>
          </div>
        </Container>
      </Section>

      <CtaSection
        title="¿TIENES UN PROYECTO EN MENTE?"
        subtitle="Cuéntanos qué espacio quieres resolver y te asesoramos sin compromiso."
        buttonLabel="Solicitar información"
        buttonHref="/cotizar"
        imageKey="hero-cotizar"
      />
    </>
  );
}
