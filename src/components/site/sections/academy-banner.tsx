import { ButtonLink } from "@/components/ui/button";
import { Container, GlowBlob, Grain, Section } from "@/components/ui/layout";
import { Reveal } from "@/components/ui/reveal";
import { MediaImage } from "@/components/site/media-image";

/* ==========================================================================
   Banner de la academia: texto y ventajas a la izquierda, tarjeta de
   matricula a la derecha. Aparece en la portada y en la pagina de cursos.
   ========================================================================== */

export function AcademyBanner({
  eyebrow,
  titleLead,
  titleAccent,
  body,
  bullets,
  cta,
  enrollCard,
  imageKey,
}: {
  eyebrow: string;
  titleLead: string;
  titleAccent: string;
  body: string;
  bullets?: readonly string[];
  cta: { label: string; href: string };
  enrollCard: { title: string; subtitle: string; cta: { label: string; href: string } };
  imageKey: string;
}) {
  return (
    <Section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <MediaImage
          mediaKey={imageKey}
          sizes="100vw"
          className="object-cover"
        />
        <span
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/88 to-ink-950/55"
        />
      </div>
      <Grain />
      <GlowBlob
        className="-left-24 bottom-0 opacity-45"
        size={420}
        color="rgba(235,93,26,0.3)"
      />

      <Container className="relative">
        <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <Reveal>
            <p className="eyebrow mb-3">{eyebrow}</p>
            <h2 className="headline text-3xl md:text-4xl lg:text-[2.9rem]">
              <span className="text-white">{titleLead} </span>
              <span className="text-gradient-brand">{titleAccent}</span>
            </h2>

            <p className="mt-5 max-w-xl text-[0.95rem] leading-relaxed text-fog-300">
              {body}
            </p>

            {bullets?.length ? (
              <ul className="mt-7 flex flex-col gap-2.5">
                {bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="flex items-center gap-3 text-sm text-fog-200"
                  >
                    <span
                      aria-hidden
                      className="size-1.5 shrink-0 rounded-full bg-brand-600"
                    />
                    {bullet}
                  </li>
                ))}
              </ul>
            ) : null}

            <div className="mt-9">
              <ButtonLink href={cta.href} variant="outline" size="md">
                {cta.label}
              </ButtonLink>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <EnrollCard {...enrollCard} />
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}

/* ==========================================================================
   Banner de matricula que cierra las fichas de servicio.
   ========================================================================== */

export function EnrollBanner({
  eyebrow,
  titleLead,
  titleAccent,
  body,
  enrollCard,
  imageKey,
}: {
  eyebrow: string;
  titleLead: string;
  titleAccent: string;
  body: string;
  enrollCard: { title: string; subtitle: string; cta: { label: string; href: string } };
  imageKey: string;
}) {
  return (
    <Section className="relative overflow-hidden py-14 md:py-16">
      <div className="absolute inset-0">
        <MediaImage
          mediaKey={imageKey}
          sizes="100vw"
          className="object-cover"
        />
        <span
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/90 to-ink-950/60"
        />
      </div>
      <Grain />

      <Container className="relative">
        <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-14">
          <div>
            <p className="eyebrow mb-3">{eyebrow}</p>
            <h2 className="headline text-2xl md:text-3xl lg:text-[2.25rem]">
              <span className="text-white">{titleLead} </span>
              <span className="text-gradient-brand">{titleAccent}</span>
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-fog-300">
              {body}
            </p>
          </div>

          <EnrollCard {...enrollCard} compact />
        </div>
      </Container>
    </Section>
  );
}

/* ==========================================================================
   Tarjeta "Matricúlate"
   ========================================================================== */

function EnrollCard({
  title,
  subtitle,
  cta,
  compact,
}: {
  title: string;
  subtitle: string;
  cta: { label: string; href: string };
  compact?: boolean;
}) {
  return (
    <div className="relative overflow-hidden rounded-card-lg border border-hairline bg-ink-900/85 p-7 backdrop-blur-sm md:p-8">
      <span
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full opacity-70 blur-3xl"
        style={{
          background:
            "radial-gradient(circle at center, rgba(235,93,26,0.4) 0%, transparent 70%)",
        }}
      />

      <div className="relative text-center">
        <h3 className="font-display text-3xl font-black tracking-tight text-brand-500 md:text-4xl">
          {title}
        </h3>
        <p className="mt-2 text-lg font-semibold text-white">{subtitle}</p>

        <ButtonLink href={cta.href} size="lg" withArrow className="mt-6 w-full">
          {cta.label}
        </ButtonLink>

        {!compact ? (
          <p className="mt-6 text-xs leading-relaxed text-fog-400">
            Contamos con ambientes acondicionados acústicamente y equipados con
            <span className="font-semibold text-brand-400"> Tecnología Profesional</span>
          </p>
        ) : null}
      </div>
    </div>
  );
}
