import { ChevronDown } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container, GlowBlob, Grain } from "@/components/ui/layout";
import { MediaImage } from "@/components/site/media-image";

/**
 * Portada: fotografia a sangre, velo oscuro y titular pesado bicolor.
 * Es el bloque mas reconocible del diseno de referencia.
 */
export function HomeHero({
  titleLead,
  titleAccent,
  primaryCta,
  secondaryCta,
  imageKey,
}: {
  titleLead: string;
  titleAccent: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  imageKey: string;
}) {
  return (
    <section className="relative flex min-h-[86vh] items-center overflow-hidden pt-36 pb-24 md:min-h-[92vh] md:pt-40">
      <div className="absolute inset-0">
        <MediaImage
          mediaKey={imageKey}
          priority
          sizes="100vw"
          className="scale-105 object-cover"
        />
      </div>

      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-ink-950/85 via-ink-950/55 to-ink-950"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,transparent_0%,rgba(8,8,10,0.75)_100%)]"
      />
      <GlowBlob
        className="-left-40 top-1/4 opacity-60"
        size={560}
        color="rgba(255,107,0,0.34)"
      />
      <Grain />

      <Container className="relative text-center">
        <p className="eyebrow mb-6">Audio · Tecnología · Experiencia</p>

        <h1 className="headline mx-auto max-w-5xl text-[2.15rem] sm:text-5xl md:text-6xl lg:text-[4.5rem]">
          <span className="block text-white">{titleLead}</span>
          <span className="text-gradient-brand block">{titleAccent}</span>
        </h1>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <ButtonLink href={primaryCta.href} size="lg" className="w-full sm:w-auto">
            {primaryCta.label}
          </ButtonLink>
          <ButtonLink
            href={secondaryCta.href}
            size="lg"
            className="w-full sm:w-auto"
          >
            {secondaryCta.label}
          </ButtonLink>
        </div>
      </Container>

      <span
        aria-hidden
        className="absolute bottom-7 left-1/2 grid size-10 -translate-x-1/2 place-items-center rounded-full border border-hairline-strong bg-ink-950/50 text-fog-300 backdrop-blur"
      >
        <ChevronDown className="size-4 animate-bounce" />
      </span>
    </section>
  );
}
