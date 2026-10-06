import { ButtonLink } from "@/components/ui/button";
import { Container, DotPattern, GlowBlob, Section } from "@/components/ui/layout";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { MediaImage } from "@/components/site/media-image";

/**
 * Bloque "Sobre nosotros" de la portada: titular a la izquierda, parrafo y
 * llamada a la accion a la derecha, y una composicion de dos fotografias.
 */
export function AboutSplit({
  eyebrow,
  titleLead,
  titleAccent,
  body,
  cta,
  imageKeys,
  decorativeKey,
}: {
  eyebrow: string;
  titleLead: string;
  titleAccent: string;
  body: string;
  cta: { label: string; href: string };
  imageKeys: [string, string];
  decorativeKey: string;
}) {
  return (
    <Section id="sobre-nosotros" className="overflow-hidden">
      <GlowBlob
        className="-right-32 top-0 opacity-50"
        size={480}
        color="rgba(255,107,0,0.26)"
      />

      <Container className="relative">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <Reveal>
            <SectionHeading
              eyebrow={eyebrow}
              titleLead={titleLead}
              titleAccent={titleAccent}
              size="lg"
            />
          </Reveal>

          {/* Composicion decorativa: altavoz circular con anillos */}
          <Reveal delay={0.1} className="hidden lg:block">
            <div className="relative flex justify-end">
              <div className="relative size-56 overflow-hidden rounded-full xl:size-64">
                <MediaImage
                  mediaKey={decorativeKey}
                  sizes="16rem"
                  className="object-cover"
                />
                <span
                  aria-hidden
                  className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/10"
                />
              </div>

              <span
                aria-hidden
                className="absolute -bottom-6 right-2 size-24 rounded-full border border-brand-600/50 xl:size-28"
              />
              <span
                aria-hidden
                className="absolute -bottom-2 right-16 size-16 rounded-full border border-brand-500/30 xl:size-20"
              />
            </div>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-10 lg:mt-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          {/* Fotografias */}
          <Reveal className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="relative aspect-4/3 overflow-hidden rounded-card">
                <MediaImage
                  mediaKey={imageKeys[0]}
                  sizes="(max-width: 1024px) 45vw, 24vw"
                  className="object-cover"
                />
              </div>
              <div className="relative aspect-4/3 overflow-hidden rounded-card">
                <MediaImage
                  mediaKey={imageKeys[1]}
                  sizes="(max-width: 1024px) 45vw, 24vw"
                  className="object-cover"
                />
              </div>
            </div>

            <DotPattern className="-bottom-4 -left-6 size-24 opacity-40" />
          </Reveal>

          {/* Texto */}
          <Reveal delay={0.12} className="flex flex-col justify-center">
            <p className="text-[0.95rem] leading-relaxed text-fog-300">{body}</p>

            <div className="mt-8">
              <ButtonLink href={cta.href} variant="outline" size="md">
                {cta.label}
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
