import { ButtonLink } from "@/components/ui/button";
import { Container, Grain } from "@/components/ui/layout";
import { Reveal } from "@/components/ui/reveal";
import { MediaImage } from "@/components/site/media-image";

/**
 * Banda de llamada a la accion a sangre, usada al final de cada ficha de
 * servicio. Reproduce el patron: foto de fondo + velo + titular centrado.
 */
export function CtaSection({
  title,
  subtitle,
  buttonLabel,
  buttonHref = "/contactenos",
  imageKey,
  className,
}: {
  title: string;
  subtitle: string;
  buttonLabel: string;
  buttonHref?: string;
  imageKey: string;
  className?: string;
}) {
  return (
    <section
      className={
        "relative flex min-h-[24rem] items-center overflow-hidden py-20 md:min-h-[28rem] md:py-24" +
        (className ? ` ${className}` : "")
      }
    >
      <div className="absolute inset-0">
        <MediaImage mediaKey={imageKey} sizes="100vw" className="object-cover" />
        <span
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-ink-950/78 via-ink-950/72 to-ink-950/92"
        />
      </div>
      <Grain />

      <Container className="relative text-center">
        <Reveal>
          <h2 className="headline mx-auto max-w-4xl text-3xl md:text-4xl lg:text-[3rem]">
            <span className="text-white">{title}</span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-fog-300 md:text-[0.95rem]">
            {subtitle}
          </p>

          <div className="mt-9 flex justify-center">
            <ButtonLink href={buttonHref} size="lg" withArrow>
              {buttonLabel}
            </ButtonLink>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
