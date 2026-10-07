import { ChevronDown } from "lucide-react";
import { Container, Grain } from "@/components/ui/layout";
import { MediaImage } from "./media-image";
import { cn } from "@/lib/utils";

/**
 * Encabezado de las páginas internas.
 *
 * Reproduce el patrón de las capturas: fotografía con velo oscuro, titular
 * centrado muy pesado, subtítulo y línea naranja de separación.
 *
 * Dos variantes, según indicación del diseñador:
 *  - `foto`  la imagen llena el banner (portadas de sección).
 *  - `tenue` la imagen se muestra al 70 % sobre el fondo negro, que es como
 *            compone los banners de las fichas de servicio internas.
 */
export function PageHero({
  titleLead,
  titleAccent,
  accentJoined = false,
  subtitle,
  imageKey,
  priority = true,
  showScrollCue = true,
  variant = "foto",
  className,
}: {
  titleLead: string;
  titleAccent: string;
  /** Une las dos partes del titular sin espacio (para palabras partidas en
   *  dos tonos, como «CONTÁCTE» + «NOS»). */
  accentJoined?: boolean;
  subtitle?: string;
  imageKey: string;
  priority?: boolean;
  showScrollCue?: boolean;
  variant?: "foto" | "tenue";
  className?: string;
}) {
  const tenue = variant === "tenue";

  return (
    <section
      className={cn(
        // `svh` (con `vh` de respaldo) refleja el alto visible real en el movil.
        "relative flex min-h-[52vh] items-center justify-center overflow-hidden pt-32 pb-20 supports-[height:100svh]:min-h-[52svh] md:min-h-[58vh] md:pt-40 md:pb-24 md:supports-[height:100svh]:min-h-[58svh]",
        className,
      )}
    >
      <div className="absolute inset-0 bg-ink-950">
        <MediaImage
          mediaKey={imageKey}
          priority={priority}
          sizes="100vw"
          className={cn(
            "object-cover",
            tenue ? "opacity-70" : "scale-105",
          )}
        />
      </div>

      {/* Velo: oscurece arriba para la navbar y abajo para el contenido.
          En la variante tenue es más ligero, porque la imagen ya va al 70 %. */}
      <div
        aria-hidden
        className={cn(
          "absolute inset-0 bg-gradient-to-b to-ink-950",
          tenue
            ? "from-ink-950/85 via-ink-950/40"
            : "from-ink-950/92 via-ink-950/72",
        )}
      />
      <Grain />

      <Container className="relative text-center">
        <h1 className="headline text-4xl sm:text-5xl md:text-6xl lg:text-[4.25rem]">
          <span className="text-white">
            {accentJoined ? titleLead : `${titleLead} `}
          </span>
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
