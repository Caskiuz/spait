import { ChevronDown } from "lucide-react";
import { Container, Grain } from "@/components/ui/layout";
import { MediaImage } from "./media-image";
import { cn } from "@/lib/utils";

/**
 * Encabezado de las paginas internas.
 *
 * Reproduce el patron de las capturas: fotografia a sangre con velo oscuro,
 * titular centrado muy pesado, subtitulo y linea naranja de separacion.
 */
export function PageHero({
  titleLead,
  titleAccent,
  subtitle,
  imageKey,
  priority = true,
  showScrollCue = true,
  className,
}: {
  titleLead: string;
  titleAccent: string;
  subtitle?: string;
  imageKey: string;
  priority?: boolean;
  showScrollCue?: boolean;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "relative flex min-h-[52vh] items-center justify-center overflow-hidden pt-32 pb-20 md:min-h-[58vh] md:pt-40 md:pb-24",
        className,
      )}
    >
      <div className="absolute inset-0">
        <MediaImage
          mediaKey={imageKey}
          priority={priority}
          sizes="100vw"
          className="scale-105 object-cover"
        />
      </div>

      {/* Velo: oscurece arriba para la navbar y abajo para el contenido */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-ink-950/92 via-ink-950/72 to-ink-950"
      />
      <Grain />

      <Container className="relative text-center">
        <h1 className="headline text-4xl sm:text-5xl md:text-6xl lg:text-[4.25rem]">
          <span className="text-white">{titleLead} </span>
          <span className="text-gradient-brand">{titleAccent}</span>
        </h1>

        {subtitle ? (
          <p className="mx-auto mt-5 max-w-2xl text-sm text-fog-300 md:text-base">
            {subtitle}
          </p>
        ) : null}

        <span
          aria-hidden
          className="mx-auto mt-7 block h-px w-16 bg-gradient-to-r from-transparent via-brand-600 to-transparent"
        />
      </Container>

      {showScrollCue ? (
        <span
          aria-hidden
          className="absolute bottom-6 left-1/2 grid size-9 -translate-x-1/2 place-items-center rounded-full border border-hairline-strong text-fog-400"
        >
          <ChevronDown className="size-4 animate-bounce" />
        </span>
      ) : null}
    </section>
  );
}
