"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/layout";
import { SectionHeading } from "@/components/ui/section-heading";
import { MediaImage } from "@/components/site/media-image";
import { cn } from "@/lib/utils";
import type { ServiceContent } from "@/content/types";

/**
 * Escaparate de servicios de la portada.
 *
 * El disenador pidio que con la flecha derecha se recorran los nueve
 * servicios, asi que el carrusel los lleva todos y desaparecio la fila
 * compacta que repetia cuatro de ellos.
 */
export function ServicesShowcase({
  services,
  eyebrow,
  titleLead,
  titleAccent,
  cta,
}: {
  services: ServiceContent[];
  eyebrow: string;
  titleLead: string;
  titleAccent: string;
  cta: { label: string; href: string };
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
    slidesToScroll: 1,
  });

  const [selected, setSelected] = useState(0);
  const [snaps, setSnaps] = useState<number[]>([]);

  const onSelect = useCallback(() => {
    if (emblaApi) setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setSnaps(emblaApi.scrollSnapList());
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", () => {
      setSnaps(emblaApi.scrollSnapList());
      onSelect();
    });
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  if (!services.length) return null;

  return (
    <Section id="servicios" tone="raised" className="overflow-hidden">
      <Container>
        <SectionHeading
          eyebrow={eyebrow}
          titleLead={titleLead}
          titleAccent={titleAccent}
          align="center"
          size="lg"
        />

        <div className="relative mt-12">
          <div className="overflow-hidden" ref={emblaRef}>
            <ul className="flex gap-5">
              {services.map((service) => (
                <li
                  key={service.slug}
                  className="min-w-0 shrink-0 grow-0 basis-[85%] sm:basis-[52%] lg:basis-[calc((100%-2.5rem)/3)]"
                >
                  <ServiceTile service={service} />
                </li>
              ))}
            </ul>
          </div>

          <button
            type="button"
            onClick={() => emblaApi?.scrollPrev()}
            aria-label="Servicios anteriores"
            className="absolute -left-4 top-1/2 hidden size-11 -translate-y-1/2 place-items-center rounded-full border border-hairline-strong bg-ink-950/80 text-fog-200 backdrop-blur transition-all hover:border-brand-600/70 hover:text-brand-400 lg:grid"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => emblaApi?.scrollNext()}
            aria-label="Servicios siguientes"
            className="absolute -right-4 top-1/2 hidden size-11 -translate-y-1/2 place-items-center rounded-full border border-hairline-strong bg-ink-950/80 text-fog-200 backdrop-blur transition-all hover:border-brand-600/70 hover:text-brand-400 lg:grid"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>

        {/* El punto visible mide 6 px, pero el area tactil es de 44 px: en
            el movil es la unica forma de pasar tarjeta ademas del gesto. */}
        {snaps.length > 1 ? (
          <div className="mt-7 flex flex-wrap justify-center">
            {snaps.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => emblaApi?.scrollTo(index)}
                aria-label={`Ir al grupo de servicios ${index + 1}`}
                aria-current={index === selected ? "true" : undefined}
                className="group grid h-11 w-11 place-items-center md:h-5 md:w-5"
              >
                <span
                  className={cn(
                    "block h-1.5 rounded-full transition-all duration-300",
                    index === selected
                      ? "w-6 bg-brand-600"
                      : "w-1.5 bg-fog-600 group-hover:bg-fog-500",
                  )}
                />
              </button>
            ))}
          </div>
        ) : null}

        <div className="mt-10 flex justify-center">
          <ButtonLink href={cta.href} variant="outline" size="md">
            {cta.label}
          </ButtonLink>
        </div>
      </Container>
    </Section>
  );
}

/** Tarjeta de servicio: el titulo va sobre la fotografia, como en la
 *  referencia. */
function ServiceTile({ service }: { service: ServiceContent }) {
  return (
    <Link
      href={`/servicios/${service.slug}`}
      className="group block h-full focus-visible:outline-offset-4"
    >
      <article className="relative h-full aspect-3/4 overflow-hidden rounded-card border border-hairline">
        <MediaImage
          mediaKey={service.imageKeys[0] ?? ""}
          sizes="(max-width: 1024px) 85vw, 30vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />

        <span
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/45 to-transparent"
        />

        <span
          aria-hidden
          className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background:
              "linear-gradient(to top, rgba(235,93,26,0.28) 0%, transparent 55%)",
          }}
        />

        <div className="absolute inset-x-0 bottom-0 p-5">
          <h3 className="font-display text-base font-extrabold uppercase leading-tight tracking-tight text-white md:text-lg">
            {service.title}
          </h3>
          <span className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-400 opacity-0 transition-all duration-300 group-hover:opacity-100">
            Saber más
            <ChevronRight className="size-3" />
          </span>
        </div>
      </article>
    </Link>
  );
}
