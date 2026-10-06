"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container, GlowBlob, Section } from "@/components/ui/layout";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { MediaImage } from "@/components/site/media-image";
import { cn } from "@/lib/utils";
import type { FaqContent } from "@/content/types";

/**
 * Preguntas frecuentes en acordeon.
 *
 * Usa <details>/<summary> nativos envueltos en estado controlado: funciona sin
 * JavaScript, es accesible por teclado y el buscador puede leer el contenido.
 */
export function FaqSection({
  faqs,
  eyebrow,
  titleLead,
  titleAccent,
  subtitle,
  cta,
  imageKey,
}: {
  faqs: FaqContent[];
  eyebrow: string;
  titleLead: string;
  titleAccent: string;
  subtitle?: string;
  cta: { label: string; href: string };
  imageKey: string;
}) {
  const [open, setOpen] = useState<number | null>(0);

  if (!faqs.length) return null;

  return (
    <Section tone="raised" className="overflow-hidden">
      <GlowBlob
        className="-left-40 top-10 opacity-40"
        size={480}
        color="rgba(255,107,0,0.24)"
      />

      <Container className="relative">
        <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          {/* Columna izquierda: titular + imagen */}
          <div>
            <Reveal>
              <SectionHeading
                eyebrow={eyebrow}
                titleLead={titleLead}
                titleAccent={titleAccent}
                subtitle={subtitle}
                size="lg"
              />
            </Reveal>

            <Reveal delay={0.12} className="mt-9">
              <div className="relative aspect-4/3 overflow-hidden rounded-card-lg border border-hairline">
                <MediaImage
                  mediaKey={imageKey}
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover"
                />
                <span
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-ink-950/70 to-transparent"
                />
              </div>
            </Reveal>
          </div>

          {/* Columna derecha: acordeon */}
          <Reveal delay={0.1} className="flex flex-col justify-center">
            <ul className="flex flex-col gap-3">
              {faqs.map((faq, index) => {
                const isOpen = open === index;
                return (
                  <li key={faq.question}>
                    <div
                      className={cn(
                        "overflow-hidden rounded-card border transition-colors duration-300",
                        isOpen
                          ? "border-brand-600/45 bg-ink-850"
                          : "border-hairline bg-ink-900/60 hover:border-hairline-strong",
                      )}
                    >
                      <h3>
                        <button
                          type="button"
                          onClick={() => setOpen(isOpen ? null : index)}
                          aria-expanded={isOpen}
                          aria-controls={`faq-panel-${index}`}
                          id={`faq-trigger-${index}`}
                          className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                        >
                          <span
                            className={cn(
                              "font-display text-sm font-extrabold uppercase tracking-wide transition-colors md:text-[15px]",
                              isOpen ? "text-brand-400" : "text-white",
                            )}
                          >
                            {faq.question}
                          </span>
                          <ChevronDown
                            aria-hidden
                            className={cn(
                              "size-4 shrink-0 transition-transform duration-300",
                              isOpen ? "rotate-180 text-brand-500" : "text-fog-500",
                            )}
                          />
                        </button>
                      </h3>

                      <div
                        id={`faq-panel-${index}`}
                        role="region"
                        aria-labelledby={`faq-trigger-${index}`}
                        hidden={!isOpen}
                        className="px-5 pb-5"
                      >
                        <p className="text-sm leading-relaxed text-fog-300">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="mt-8">
              <ButtonLink href={cta.href} size="md" withArrow>
                {cta.label}
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
