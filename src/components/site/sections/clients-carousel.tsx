"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Container, Section } from "@/components/ui/layout";
import { SectionHeading } from "@/components/ui/section-heading";
import { MediaImage } from "@/components/site/media-image";
import { cn } from "@/lib/utils";
import type { ClientContent } from "@/content/types";

/**
 * Carrusel de clientes con flechas y puntos, igual que en las capturas.
 * Con pocos elementos las flechas se ocultan y la fila se centra.
 */
export function ClientsCarousel({
  clients,
  eyebrow,
  titleLead,
  titleAccent,
  subtitle,
  tone = "base",
}: {
  clients: ClientContent[];
  eyebrow?: string;
  titleLead?: string;
  titleAccent?: string;
  subtitle?: string;
  tone?: "base" | "raised" | "sunken";
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: clients.length > 4,
    slidesToScroll: 1,
  });

  const [selected, setSelected] = useState(0);
  const [snaps, setSnaps] = useState<number[]>([]);
  const [canScroll, setCanScroll] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setSnaps(emblaApi.scrollSnapList());
    setCanScroll(emblaApi.canScrollNext() || emblaApi.canScrollPrev());
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", () => {
      setSnaps(emblaApi.scrollSnapList());
      setCanScroll(emblaApi.canScrollNext() || emblaApi.canScrollPrev());
      onSelect();
    });
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  if (!clients.length) return null;

  return (
    <Section tone={tone} className="overflow-hidden">
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          {eyebrow || titleLead ? (
            <SectionHeading
              eyebrow={eyebrow}
              titleLead={titleLead}
              titleAccent={titleAccent}
              subtitle={subtitle}
            />
          ) : (
            <span />
          )}

          {canScroll ? (
            <div className="flex shrink-0 gap-2.5">
              <CarouselButton
                label="Clientes anteriores"
                onClick={() => emblaApi?.scrollPrev()}
              >
                <ChevronLeft className="size-5" />
              </CarouselButton>
              <CarouselButton
                label="Clientes siguientes"
                onClick={() => emblaApi?.scrollNext()}
              >
                <ChevronRight className="size-5" />
              </CarouselButton>
            </div>
          ) : null}
        </div>

        <div className="mt-10 overflow-hidden" ref={emblaRef}>
          <ul className="flex gap-5">
            {clients.map((client) => (
              <li
                key={client.name}
                className="min-w-0 shrink-0 grow-0 basis-[78%] sm:basis-[46%] lg:basis-[calc((100%-3.75rem)/4)]"
              >
                <article className="group flex h-full flex-col items-center gap-4 rounded-card border border-hairline bg-ink-900/70 p-6 text-center transition-all duration-300 hover:border-brand-600/45 hover:bg-ink-850">
                  <div className="relative grid h-24 w-full place-items-center">
                    <MediaImage
                      mediaKey={client.logoKey}
                      fallbackAlt={client.name}
                      fill={false}
                      width={96}
                      height={110}
                      sizes="96px"
                      className="h-24 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  <h3 className="font-display text-[13px] font-extrabold uppercase leading-tight tracking-wide">
                    <span className="block text-white">
                      {client.shortName.split(" ").slice(0, 1).join(" ")}
                    </span>
                    <span className="block text-gradient-brand">
                      {client.shortName.split(" ").slice(1).join(" ")}
                    </span>
                  </h3>
                </article>
              </li>
            ))}
          </ul>
        </div>

        {snaps.length > 1 ? (
          <div className="mt-8 flex justify-center gap-2">
            {snaps.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => emblaApi?.scrollTo(index)}
                aria-label={`Ir al grupo de clientes ${index + 1}`}
                aria-current={index === selected ? "true" : undefined}
                className={cn(
                  "size-1.5 rounded-full transition-all duration-300",
                  index === selected
                    ? "w-6 bg-brand-600"
                    : "bg-fog-600 hover:bg-fog-500",
                )}
              />
            ))}
          </div>
        ) : null}
      </Container>
    </Section>
  );
}

function CarouselButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="grid size-11 place-items-center rounded-full border border-hairline-strong text-fog-200 transition-all hover:border-brand-600/70 hover:text-brand-400"
    >
      {children}
    </button>
  );
}
