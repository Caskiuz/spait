"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container, GlowBlob } from "@/components/ui/layout";
import { getMedia } from "@/content";

/**
 * Portada con vídeo de fondo.
 *
 * El vídeo que envió el diseñador dura 5,5 s y se reproduce en bucle, sin
 * audio y sin controles: es un fondo, no un contenido.
 *
 * Tres decisiones de rendimiento:
 *  - `preload="metadata"`: no se descarga entero antes de mostrar la página.
 *  - El póster se pinta de inmediato, así que nunca se ve un hueco negro.
 *  - Con `prefers-reduced-motion` el vídeo no se reproduce: se queda el
 *    póster para quien pide menos movimiento.
 */
export function VideoHero({
  titleLead,
  titleAccent,
  primaryCta,
  secondaryCta,
  posterKey,
  eyebrow,
}: {
  titleLead: string;
  titleAccent: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  posterKey: string;
  eyebrow: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [reproducir, setReproducir] = useState(false);

  useEffect(() => {
    const prefiereQuieto = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefiereQuieto) return;

    setReproducir(true);
    const video = videoRef.current;
    if (!video) return;

    // En algunos móviles la reproducción automática falla si el vídeo no
    // está silenciado; lo forzamos y reintentamos una vez.
    video.muted = true;
    video.play().catch(() => {
      const reintento = () => {
        video.play().catch(() => undefined);
        document.removeEventListener("touchstart", reintento);
      };
      document.addEventListener("touchstart", reintento, { once: true });
    });
  }, []);

  const poster = getMedia(posterKey)?.url;

  return (
    // `svh` (con `vh` de respaldo) es el alto visible real en el movil: evita
    // que la barra del navegador tape el boton de desplazamiento y los CTA.
    <section className="relative flex min-h-[86vh] items-center overflow-hidden pt-36 pb-24 supports-[height:100svh]:min-h-[86svh] md:min-h-[92vh] md:pt-40 md:supports-[height:100svh]:min-h-[92svh]">
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          poster={poster}
          autoPlay={reproducir}
          loop
          muted
          playsInline
          preload="metadata"
          aria-hidden
          tabIndex={-1}
          className="size-full scale-105 object-cover"
        >
          <source src="/media/hero-video.webm" type="video/webm" />
          <source src="/media/hero-video.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Velo: oscurece arriba para la navbar y abajo para el contenido */}
      {/* Velo calculado para que el vídeo se lea pero el titular mantenga
          contraste suficiente (AA) sobre cualquier fotograma. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-ink-950/72 via-ink-950/38 to-ink-950"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,transparent_0%,rgba(8,8,10,0.62)_100%)]"
      />
      <GlowBlob
        className="-left-40 top-1/4 opacity-60"
        size={560}
        color="rgba(235,93,26,0.34)"
      />

      <Container className="relative text-center">
        <p className="eyebrow mb-6">{eyebrow}</p>

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
