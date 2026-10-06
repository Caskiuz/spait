import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container, GlowBlob, Section } from "@/components/ui/layout";
import { Reveal } from "@/components/ui/reveal";
import { SocialIcon } from "@/components/site/social-icon";
import type { SocialLinkContent } from "@/content/types";

/**
 * Seccion de redes sociales: titular con resplandor naranja y tarjeta con los
 * accesos, tal como aparece en la portada y en /contactenos.
 */
export function SocialsSection({
  eyebrow,
  title,
  quote,
  body,
  socials,
  cta,
  showCta = true,
  className,
}: {
  eyebrow: string;
  title: string;
  quote?: string;
  body: string;
  socials: SocialLinkContent[];
  cta?: { label: string; href: string };
  showCta?: boolean;
  className?: string;
}) {
  const featured = socials.filter((s) => s.isFeatured).slice(0, 3);
  const visible = featured.length ? featured : socials.slice(0, 3);

  if (!visible.length) return null;

  return (
    <Section className={className}>
      <GlowBlob
        className="left-1/2 top-4 -translate-x-1/2 opacity-55"
        size={620}
        color="rgba(255,107,0,0.28)"
      />

      <Container className="relative">
        <Reveal className="text-center">
          <p className="eyebrow mb-3">{eyebrow}</p>
          <h2
            className="headline text-4xl sm:text-5xl md:text-6xl lg:text-[4rem]"
            style={{
              textShadow:
                "0 0 48px rgba(255,107,0,0.35), 0 0 100px rgba(255,107,0,0.18)",
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
                    <SocialIcon platform={social.platform} className="size-6" />
                  </span>

                  <div className="min-w-0 flex-1 text-center">
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-9 items-center gap-2 rounded-full bg-gradient-brand px-6 font-display text-[11px] font-bold tracking-wide text-white transition-all hover:brightness-110"
                    >
                      Síguenos en
                      <span
                        aria-hidden
                        className="grid size-4 place-items-center rounded-full bg-white/25"
                      >
                        <ArrowRight className="size-2.5" strokeWidth={3} />
                      </span>
                    </a>
                    <p className="mt-1.5 truncate text-[11px] text-fog-400">
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
      </Container>
    </Section>
  );
}
