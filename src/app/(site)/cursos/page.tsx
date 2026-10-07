import type { Metadata } from "next";
import Image from "next/image";
import { BadgeCheck, Sparkles } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { ButtonLink } from "@/components/ui/button";
import { Container, GlowBlob, Section } from "@/components/ui/layout";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { MediaImage, mediaUrl } from "@/components/site/media-image";
import { EnrollmentForm } from "@/components/forms/enrollment-form";
import { getCourse, getSiteSettings } from "@/server/repositories/content";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Cursos de ingeniería de sonido",
  description:
    "Programa profesional de Ingeniería de Sonido: 1 año, 4 módulos, certificación por módulo y 100% de práctica en estudio propio.",
  alternates: { canonical: "/cursos" },
};

/** Insignias del programa, con los PNG del disenador. */
const BADGE_ICONS: Record<string, string> = {
  practice: "insignia-practica",
  certificate: "insignia-certificacion",
  jobs: "insignia-salidas",
};

export default async function CursosPage() {
  const [course, settings] = await Promise.all([
    getCourse("ingenieria-de-sonido"),
    getSiteSettings(),
  ]);

  if (!course) {
    return (
      <Section>
        <Container>
          <SectionHeading
            titleLead="CURSOS"
            titleAccent="PRÓXIMAMENTE"
            subtitle="Estamos preparando el contenido del programa."
            align="center"
          />
        </Container>
      </Section>
    );
  }

  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.subtitle,
    provider: {
      "@type": "Organization",
      name: settings.companyName,
      sameAs: settings.siteUrl,
    },
    inLanguage: "es-PE",
    educationalCredentialAwarded: "Certificación por módulo",
    hasCourseInstance: course.modules.map((module) => ({
      "@type": "CourseInstance",
      name: module.title,
      courseMode: "onsite",
      duration: "P3M",
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
      />

      <PageHero
        titleLead="NUESTROS"
        titleAccent="CURSOS"
        subtitle="Formación profesional en ingeniería de sonido"
        imageKey="fondo-matriculate"
        variant="tenue"
      />

      {/* Presentacion del programa */}
      <Section className="overflow-hidden pt-14 md:pt-16">
        <GlowBlob
          className="left-1/2 top-0 -translate-x-1/2 opacity-50"
          size={560}
          color="rgba(235,93,26,0.26)"
        />

        <Container className="relative text-center">
          <Reveal>
            <span className="inline-flex items-center gap-3">
              <Image
                src={mediaUrl(
                  "logo-soundtech-simbolo",
                  "/media/logo-soundtech-simbolo.png",
                )}
                alt=""
                width={370}
                height={400}
                className="h-9 w-auto"
              />
              <span className="font-display text-base font-extrabold tracking-tight text-white">
                Sound Tech
              </span>
            </span>

            <h2 className="headline mx-auto mt-6 max-w-4xl text-3xl md:text-4xl lg:text-[3rem]">
              <span className="text-white">{course.headline} </span>
              <span className="text-gradient-brand">{course.headlineAccent}</span>
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-fog-300">
              {course.subtitle}
            </p>
          </Reveal>

          {/* Insignias */}
          <RevealGroup className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {course.badges.map((badge) => {
              const iconKey = BADGE_ICONS[badge.icon];
              return (
                <RevealItem key={badge.title}>
                  <div className="flex h-full items-center gap-4 rounded-card border border-hairline bg-ink-900/60 p-5 text-left">
                    <span
                      aria-hidden
                      className="grid size-11 shrink-0 place-items-center rounded-2xl bg-gradient-brand p-2 text-white"
                    >
                      {iconKey ? (
                        <MediaImage
                          mediaKey={iconKey}
                          alt=""
                          fill={false}
                          width={28}
                          height={28}
                          sizes="28px"
                          className="size-7 object-contain brightness-0 invert"
                        />
                      ) : null}
                    </span>
                    <span>
                      <span className="block font-display text-[12px] font-extrabold uppercase tracking-wide text-white">
                        {badge.title}
                      </span>
                      <span className="mt-0.5 block text-xs text-fog-400">
                        {badge.description}
                      </span>
                    </span>
                  </div>
                </RevealItem>
              );
            })}
          </RevealGroup>

          <Reveal delay={0.1} className="relative mt-10">
            <div className="relative mx-auto aspect-16/9 max-w-3xl overflow-hidden rounded-card-lg border border-hairline">
              <MediaImage
                mediaKey="home-nosotros"
                sizes="(max-width: 1024px) 92vw, 48rem"
                className="object-cover"
              />
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* Sobre nosotros + por que elegirnos */}
      <Section tone="raised" className="overflow-hidden">
        <Container className="relative">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <SectionHeading
                eyebrow="NOSOTROS"
                titleLead="SOBRE"
                titleAccent="NOSOTROS"
                size="md"
              />
              <div className="mt-6 flex flex-col gap-4">
                {course.description.map((paragraph, index) => (
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
              <div className="rounded-card-lg border border-hairline bg-ink-900/70 p-7 md:p-8">
                <h3 className="font-display text-xl font-extrabold uppercase tracking-tight text-white md:text-2xl">
                  ¿POR QUÉ ELEGIRNOS?
                </h3>
                <ul className="mt-6 flex flex-col gap-4">
                  {course.highlights.map((highlight) => (
                    <li key={highlight.title} className="flex gap-3">
                      <Sparkles
                        aria-hidden
                        className="mt-0.5 size-4 shrink-0 text-brand-500"
                      />
                      <span>
                        <span className="block font-display text-[12px] font-extrabold uppercase tracking-wide text-brand-500">
                          {highlight.title}
                        </span>
                        <span className="mt-0.5 block text-xs leading-relaxed text-fog-400">
                          {highlight.description}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* Nuestra carrera */}
      <Section>
        <Container>
          <Reveal className="text-center">
            <h2 className="headline text-3xl md:text-4xl">
              <span className="text-white">NUESTRA </span>
              <span className="text-gradient-brand">CARRERA</span>
            </h2>
            <p className="mt-3 text-sm text-fog-400">
              Formación profesional en sonido
            </p>
          </Reveal>

          <div className="mt-10 grid items-stretch gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <Reveal>
              <article className="flex h-full flex-col rounded-card-lg bg-white p-8 text-ink-950">
                <p className="eyebrow text-ink-600">CARRERA PROFESIONAL</p>
                <h3 className="headline mt-3 text-2xl text-ink-950 md:text-3xl">
                  EN INGENIERÍA DE SONIDO
                </h3>
                <p className="mt-4 text-sm font-semibold text-ink-700">
                  Duración {course.duration}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-ink-600">
                  La capacitación está diseñada para brindarte una formación
                  integral y práctica, especializada en los diferentes campos de
                  la ingeniería de sonido profesional.
                </p>

                <ul className="mt-7 flex flex-col gap-2.5 border-t border-ink-950/10 pt-6">
                  {course.modules.map((module) => (
                    <li
                      key={module.number}
                      className="flex items-baseline gap-3 text-xs text-ink-700"
                    >
                      <span className="font-display font-black text-brand-600">
                        {String(module.number).padStart(2, "0")}
                      </span>
                      <span className="font-semibold text-ink-950">
                        {module.title}
                      </span>
                      <span className="text-ink-500">· {module.duration}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-8">
                  <ButtonLink
                    href="#matricula"
                    size="md"
                    className="w-full sm:w-auto"
                  >
                    Solicitar información
                  </ButtonLink>
                </div>
              </article>
            </Reveal>

            <Reveal delay={0.1} className="relative">
              <div className="relative h-full min-h-[20rem] overflow-hidden rounded-card-lg border border-hairline">
                <MediaImage
                  mediaKey="nosotros-imagenes"
                  sizes="(max-width: 1024px) 92vw, 50vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* Infraestructura */}
      <Section tone="raised">
        <Container>
          <Reveal>
            <h2 className="headline text-2xl md:text-3xl lg:text-[2.35rem]">
              <span className="text-gradient-brand">INFRAESTRUCTURA</span>
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-fog-400">
              {course.facilitiesIntro}
            </p>
          </Reveal>

          <RevealGroup className="mt-9 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {course.facilities.map((facility) => (
              <RevealItem key={facility.title}>
                <figure className="group overflow-hidden rounded-card border border-hairline">
                  <div className="relative aspect-4/3">
                    <MediaImage
                      mediaKey={facility.imageKey}
                      sizes="(max-width: 1024px) 46vw, 22vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <figcaption className="bg-gradient-brand px-4 py-3 font-display text-[10px] font-extrabold uppercase leading-snug tracking-wide text-white">
                    {facility.title}
                  </figcaption>
                </figure>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </Section>

      {/* Perfil del egresado + tendencias */}
      <Section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <MediaImage mediaKey="home-preguntas" sizes="100vw" className="object-cover" />
          <span
            aria-hidden
            className="absolute inset-0 bg-ink-950/90"
          />
        </div>

        <Container className="relative">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <p className="eyebrow mb-3">PERFIL DEL</p>
              <h2 className="headline text-2xl md:text-3xl lg:text-[2.35rem]">
                <span className="text-gradient-brand">EGRESADO</span>
              </h2>
              <p className="mt-5 max-w-lg text-sm leading-relaxed text-fog-300">
                {course.outcomesIntro}
              </p>

              <ul className="mt-7 flex flex-col gap-2.5">
                {course.outcomes.map((outcome) => (
                  <li
                    key={outcome.title}
                    className="flex items-center gap-3 text-sm text-fog-200"
                  >
                    <span
                      aria-hidden
                      className="size-1.5 shrink-0 rounded-full bg-brand-600"
                    />
                    {outcome.title}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="rounded-card-lg border border-hairline bg-ink-900/70 p-7 md:p-8">
                <h3 className="font-display text-xl font-extrabold tracking-tight text-brand-500 md:text-2xl">
                  {course.trendsTitle}
                </h3>
                <ul className="mt-6 flex flex-col gap-4">
                  {course.trends.map((trend) => (
                    <li
                      key={trend.title}
                      className="flex items-center gap-3 text-sm text-fog-200"
                    >
                      <BadgeCheck
                        aria-hidden
                        className="size-4 shrink-0 text-brand-500"
                      />
                      {trend.title}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* Matricula */}
      <Section id="matricula" tone="raised">
        <Container>
          <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
            <Reveal className="relative">
              <div className="relative aspect-4/5 overflow-hidden rounded-card-lg border border-hairline lg:sticky lg:top-28">
                <MediaImage
                  mediaKey="fondo-matriculate"
                  sizes="(max-width: 1024px) 92vw, 44vw"
                  className="object-cover"
                />
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <h2 className="font-display text-3xl font-black tracking-tight text-brand-500 md:text-4xl">
                Matricúlate
              </h2>
              <p className="mt-2 text-lg font-semibold text-white">
                y aprende con nosotros
              </p>

              <div className="mt-8">
                <EnrollmentForm courseSlug={course.slug} />
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>
    </>
  );
}
