import { Check, Info } from "lucide-react";
import { Container, DotPattern, GlowBlob, Section } from "@/components/ui/layout";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { MediaImage } from "@/components/site/media-image";
import { cn } from "@/lib/utils";
import type { ServiceContent } from "@/content/types";

/* ==========================================================================
   Bloque de introduccion de una ficha de servicio.
   Titular bicolor + parrafos a la izquierda, fotografias a la derecha.
   ========================================================================== */

export function ServiceIntro({ service }: { service: ServiceContent }) {
  const [first, ...rest] = service.imageKeys;

  return (
    <Section className="overflow-hidden pt-14 md:pt-16">
      <GlowBlob
        className="-right-40 top-0 opacity-45"
        size={520}
        color="rgba(255,107,0,0.24)"
      />

      <Container className="relative">
        <div className="grid gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:gap-14">
          <Reveal>
            <h2 className="headline text-3xl md:text-4xl lg:text-[2.85rem]">
              <span className="text-white">{service.titleLead} </span>
              <span className="text-gradient-brand">{service.titleAccent}</span>
            </h2>

            <div className="mt-7 flex flex-col gap-4">
              {service.paragraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className={cn(
                    "text-[0.9rem] leading-relaxed",
                    paragraph.highlight ? "text-fog-200" : "text-fog-400",
                  )}
                >
                  {paragraph.highlight ? (
                    <span
                      aria-hidden
                      className="mr-2 inline-block size-1.5 translate-y-[-2px] rounded-full bg-brand-600"
                    />
                  ) : null}
                  {paragraph.text}
                </p>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.12} className="relative">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <div className="relative aspect-4/3 overflow-hidden rounded-card">
                <MediaImage
                  mediaKey={first ?? ""}
                  sizes="(max-width: 1024px) 92vw, 44vw"
                  className="object-cover"
                  priority
                />
              </div>

              {rest[0] ? (
                <div className="relative aspect-16/10 overflow-hidden rounded-card sm:aspect-4/3">
                  <MediaImage
                    mediaKey={rest[0]}
                    sizes="(max-width: 1024px) 45vw, 44vw"
                    className="object-cover"
                  />
                </div>
              ) : null}
            </div>

            <DotPattern className="-left-5 bottom-4 size-24 opacity-40" />
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}

/* ==========================================================================
   Bloque de soluciones: barras numeradas 01-04 + tarjeta con fotografia.
   Es el bloque que aparece en las nueve fichas.
   ========================================================================== */

export function ServiceSolutions({ service }: { service: ServiceContent }) {
  const card = service.solutionCard;

  return (
    <Section tone="raised" className="overflow-hidden">
      <Container className="relative">
        <Reveal>
          <h2 className="headline max-w-3xl text-2xl md:text-3xl lg:text-[2.35rem]">
            <span className="text-white">{service.solutionsTitle}</span>
          </h2>
          {service.solutionsSubtitle &&
          service.solutionsSubtitle !== service.solutionsTitle ? (
            <p className="mt-3 text-sm text-fog-400">{service.solutionsSubtitle}</p>
          ) : null}
        </Reveal>

        <div className="mt-9 grid gap-6 lg:grid-cols-[1.35fr_1fr] lg:items-stretch">
          {/* Barras numeradas */}
          <RevealGroup className="flex flex-col gap-3">
            {service.solutions.map((solution) => (
              <RevealItem key={solution.number}>
                <div className="group relative flex items-center gap-5 overflow-hidden rounded-pill bg-gradient-brand px-5 py-3.5 shadow-[0_14px_38px_-20px_rgba(255,107,0,0.95)] md:gap-7 md:px-7 md:py-4">
                  <span
                    aria-hidden
                    className="font-display text-4xl font-black leading-none text-white/35 md:text-5xl"
                  >
                    {solution.number}
                  </span>
                  <span className="font-display text-[13px] font-extrabold uppercase tracking-wide text-white md:text-[15px]">
                    {solution.title}
                  </span>
                  <span
                    aria-hidden
                    className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white/15 to-transparent"
                  />
                </div>
              </RevealItem>
            ))}
          </RevealGroup>

          {/* Tarjeta con imagen y sello de experiencia */}
          <Reveal delay={0.15} className="relative">
            <article className="relative h-full min-h-[18rem] overflow-hidden rounded-card-lg border border-hairline">
              <MediaImage
                mediaKey={service.imageKeys[0] ?? ""}
                sizes="(max-width: 1024px) 92vw, 30vw"
                className="object-cover"
              />
              <span
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-ink-950/95 via-ink-950/45 to-transparent"
              />

              <div className="absolute inset-x-0 bottom-0 p-6">
                <h3 className="font-display text-lg font-extrabold uppercase leading-tight text-white md:text-xl">
                  {card.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-fog-300">
                  {card.description}
                </p>
              </div>

              <span className="absolute right-4 top-4 flex flex-col items-center rounded-2xl bg-gradient-brand px-3.5 py-2 text-center shadow-[0_12px_30px_-14px_rgba(255,107,0,0.9)]">
                <span className="font-display text-base font-black leading-none text-white">
                  {card.badgeValue}
                </span>
                <span className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-white/85">
                  {card.badgeLabel}
                </span>
              </span>
            </article>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}

/* ==========================================================================
   Bloque "¿Dónde se aplica?" — rejilla de tarjetas + tarjeta destacada.
   Presente en las fichas de acustica y videoproyeccion.
   ========================================================================== */

export function ServiceApplications({ service }: { service: ServiceContent }) {
  const applications = service.applications ?? [];
  const highlight = service.applicationHighlight;
  if (!applications.length) return null;

  const left = applications.filter((a) => a.side === "IZQUIERDA");
  const right = applications.filter((a) => a.side === "DERECHA");

  return (
    <Section className="overflow-hidden">
      <Container className="relative">
        <Reveal>
          <h2 className="headline text-2xl md:text-3xl lg:text-[2.35rem]">
            <span className="text-white">{service.applicationsTitle}</span>
          </h2>
        </Reveal>

        <div className="mt-9 grid gap-4 lg:grid-cols-3">
          {/* Columna izquierda */}
          <div className="flex flex-col gap-4">
            {left.map((application) => (
              <ApplicationCard
                key={application.title}
                title={application.title}
                description={application.description}
              />
            ))}
          </div>

          {/* Columna central: fotografia + tarjeta destacada */}
          <div className="flex flex-col gap-4">
            <Reveal delay={0.08} className="relative">
              <div className="relative aspect-4/3 overflow-hidden rounded-card">
                <MediaImage
                  mediaKey={service.imageKeys[1] ?? service.imageKeys[0] ?? ""}
                  sizes="(max-width: 1024px) 92vw, 32vw"
                  className="object-cover"
                />
              </div>
            </Reveal>

            {highlight ? (
              <Reveal delay={0.12}>
                <div className="rounded-card border border-hairline bg-ink-900/70 p-6">
                  <h3 className="font-display text-sm font-extrabold uppercase leading-snug tracking-wide text-white">
                    {highlight.title}
                  </h3>
                  <ul className="mt-4 flex flex-col gap-2.5">
                    {highlight.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className="flex items-center gap-2.5 text-xs text-fog-300"
                      >
                        <span
                          aria-hidden
                          className="size-1.5 shrink-0 rounded-full bg-brand-600"
                        />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ) : null}
          </div>

          {/* Columna derecha */}
          <div className="flex flex-col gap-4">
            {right.map((application) => (
              <ApplicationCard
                key={application.title}
                title={application.title}
                description={application.description}
              />
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}

function ApplicationCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="h-full rounded-card border border-hairline bg-ink-900/60 p-5 transition-colors duration-300 hover:border-brand-600/40">
      <h3 className="flex items-start gap-2.5 font-display text-[12px] font-extrabold uppercase leading-snug tracking-wide text-brand-500">
        <span
          aria-hidden
          className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand-600"
        />
        {title}
      </h3>
      <p className="mt-2.5 pl-4 text-xs leading-relaxed text-fog-400">
        {description}
      </p>
    </div>
  );
}

/* ==========================================================================
   Bloque de escala: galeria de tres fotos + tipos de proyecto.
   Presente en las fichas de audio y CCTV.
   ========================================================================== */

export function ServiceScope({ service }: { service: ServiceContent }) {
  const groups = service.scopeGroups ?? [];
  if (!groups.length) return null;

  const images = service.imageKeys.slice(0, 3);
  const padding = ["audio-2", "iluminacion-1", "video-2"];
  while (images.length < 3) {
    const candidate = padding[images.length];
    if (candidate && !images.includes(candidate)) images.push(candidate);
    else break;
  }

  return (
    <Section tone="raised" className="overflow-hidden">
      <Container className="relative">
        <Reveal>
          <h2 className="headline max-w-3xl text-2xl md:text-3xl lg:text-[2.35rem]">
            <span className="text-white">{service.scopeTitle}</span>
          </h2>
          {service.scopeIntro ? (
            <p className="mt-3 max-w-2xl text-sm text-fog-400">
              {service.scopeIntro}
            </p>
          ) : null}
        </Reveal>

        <div className="mt-9 grid gap-4 sm:grid-cols-3">
          {images.map((key, index) => (
            <Reveal key={key} delay={index * 0.06}>
              <div className="relative aspect-4/3 overflow-hidden rounded-card">
                <MediaImage
                  mediaKey={key}
                  sizes="(max-width: 640px) 92vw, 30vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1} className="mt-4">
          <div className="rounded-card-lg border border-hairline bg-ink-900/60 p-6 md:p-7">
            <ul className="grid gap-5 md:grid-cols-3">
              {groups.map((group) => (
                <li key={group.title}>
                  <h3 className="flex items-center gap-2.5 font-display text-[12px] font-extrabold uppercase tracking-wide text-brand-500">
                    <span
                      aria-hidden
                      className="size-1.5 shrink-0 rounded-full bg-brand-600"
                    />
                    {group.title}
                  </h3>
                  <p className="mt-2 pl-4 text-xs leading-relaxed text-fog-400">
                    {group.description}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}

/* ==========================================================================
   Aviso de contenido provisional para el cliente.
   Se muestra solo cuando la pagina se abre con ?preview=1
   ========================================================================== */

export function ContentNotice({ service }: { service: ServiceContent }) {
  return (
    <div className="shell pt-8">
      <p className="flex items-start gap-3 rounded-card border border-brand-600/30 bg-brand-600/8 p-4 text-xs leading-relaxed text-fog-300">
        <Info className="mt-0.5 size-4 shrink-0 text-brand-500" aria-hidden />
        <span>
          <span className="font-semibold text-white">{service.title}.</span>{" "}
          Contenido y fotografías de marcador de posición: se reemplazan por los
          definitivos desde el panel de administración.
        </span>
      </p>
    </div>
  );
}
