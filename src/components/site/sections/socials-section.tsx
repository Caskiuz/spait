import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container, GlowBlob, Section } from "@/components/ui/layout";
import { Reveal } from "@/components/ui/reveal";
import { MediaImage } from "@/components/site/media-image";
import { SocialIcon } from "@/components/site/social-icon";
import { cn } from "@/lib/utils";
import type { SocialLinkContent, SocialPlatform } from "@/content/types";

/**
 * Iconos de red que el diseñador entregó como PNG. Las redes que no estén
 * aquí se dibujan con el SVG en línea de `social-icon.tsx`.
 */
const ICONOS_ENTREGADOS: Partial<Record<SocialPlatform, string>> = {
  facebook: "social-facebook",
  instagram: "social-instagram",
  tiktok: "social-tiktok",
};

function SocialMark({
  platform,
  className,
}: {
  platform: SocialPlatform;
  className?: string;
}) {
  const mediaKey = ICONOS_ENTREGADOS[platform];

  if (mediaKey) {
    return (
      <MediaImage
        mediaKey={mediaKey}
        alt=""
        fill={false}
        width={64}
        height={64}
        sizes="64px"
        className={cn("object-contain", className)}
      />
    );
  }

  return <SocialIcon platform={platform} className={className} />;
}

/**
 * Seccion de redes sociales: titular con resplandor naranja y tarjeta con los
 * accesos, tal como aparece en la portada y en /contactenos.
 *
 * Dos variantes, segun el diseño de cada pagina:
 *  - `lista`   una fila por red, con su enlace (contáctenos y /redes-sociales).
 *  - `tarjeta` los tres iconos grandes y un solo boton (portada).
 */
export function SocialsSection({
  eyebrow,
  title,
  quote,
  body,
  socials,
  cta,
  showCta = true,
  variant = "lista",
  className,
}: {
  eyebrow: string;
  title: string;
  quote?: string;
  body: string;
  socials: SocialLinkContent[];
  cta?: { label: string; href: string };
  showCta?: boolean;
  variant?: "lista" | "tarjeta";
  className?: string;
}) {
  const featured = socials.filter((s) => s.isFeatured).slice(0, 3);
  const visible = featured.length ? featured : socials.slice(0, 3);

  if (!visible.length) return null;

  // `overflow-hidden` recorta el resplandor de 620 px: sin el, la seccion
  // ensanchaba el documento 125 px en el movil.
  return (
    <Section className={cn("overflow-hidden", className)}>
      <GlowBlob
        className="left-1/2 top-4 -translate-x-1/2 opacity-55"
        size={620}
        color="rgba(235,93,26,0.28)"
      />

      <Container className="relative">
        <Reveal className="text-center">
          <p className="eyebrow mb-3">{eyebrow}</p>
          <h2
            className="headline text-4xl sm:text-5xl md:text-6xl lg:text-[4rem]"
            style={{
              textShadow:
                "0 0 48px rgba(235,93,26,0.35), 0 0 100px rgba(235,93,26,0.18)",
            }}
          >
            <span className="text-white">{title}</span>
          </h2>
        </Reveal>

        <div className="mt-8 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-14">
          {quote ? (
            <Reveal delay={0.05}>
              <p className="font-display text-base font-extrabold uppercase leading-snug tracking-wide text-brand-500 md:text-lg">
                {quote}
              </p>
            </Reveal>
          ) : (
            <span />
          )}

          <Reveal delay={0.1} className="lg:text-right">
            <p className="max-w-md text-sm leading-relaxed text-fog-300 lg:ml-auto">
              {body}
            </p>
          </Reveal>
        </div>

        {variant === "tarjeta" ? (
          <Reveal delay={0.15} className="mt-10">
            <div className="mx-auto max-w-2xl rounded-card-lg border border-hairline bg-ink-900/60 p-7 text-center md:p-9">
              <ul className="flex items-center justify-center gap-6 md:gap-12">
                {visible.map((social) => (
                  <li key={`${social.platform}-${social.url}`}>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${social.label ?? social.platform} de Sound Tech Perú`}
                      className="grid size-20 place-items-center rounded-2xl text-white transition-transform duration-300 hover:scale-110 md:size-24"
                    >
                      <SocialMark
                        platform={social.platform}
                        className="size-14 md:size-16"
                      />
                    </a>
                  </li>
                ))}
              </ul>

              <p className="mt-6 text-sm text-fog-300">
                Descubre nuestras redes sociales
              </p>

              {cta ? (
                <div className="mt-5 flex justify-center">
                  <ButtonLink
                    href={cta.href}
                    size="md"
                    withArrow
                    className="min-w-40"
                  >
                    Síguenos en
                  </ButtonLink>
                </div>
              ) : null}
            </div>
          </Reveal>
        ) : (
          <Reveal delay={0.15} className="mt-10">
            <div className="mx-auto max-w-2xl rounded-card-lg border border-hairline bg-ink-900/60 p-6 md:p-8">
              <ul className="flex flex-col gap-3">
                {visible.map((social) => (
                  <li
                    key={`${social.platform}-${social.url}`}
                    className="flex items-center gap-5 rounded-card border border-hairline bg-ink-850/70 p-4"
                  >
                    <span
                      aria-hidden
                      className="grid size-12 shrink-0 place-items-center rounded-2xl bg-white/[0.04] text-white"
                    >
                      <SocialMark platform={social.platform} className="size-6" />
                    </span>

                    <div className="min-w-0 flex-1 text-center">
                      <a
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-10 items-center gap-2 rounded-full bg-gradient-brand px-6 font-display text-[12px] font-bold tracking-wide text-white transition-all hover:brightness-110"
                      >
                        Síguenos en
                        <span
                          aria-hidden
                          className="grid size-4 place-items-center rounded-full bg-white/25"
                        >
                          <ArrowRight className="size-2.5" strokeWidth={3} />
                        </span>
                      </a>
                      <p className="mt-1.5 truncate text-[12px] text-fog-400">
                        {social.url.replace(/^https?:\/\//, "")}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              {showCta && cta ? (
                <div className="mt-7 text-center">
                  <ButtonLink href={cta.href} size="md" withArrow>
                    {cta.label}
                  </ButtonLink>
                </div>
              ) : null}
            </div>
          </Reveal>
        )}
      </Container>
    </Section>
  );
}
