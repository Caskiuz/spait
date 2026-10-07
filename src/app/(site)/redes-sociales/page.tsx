import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { Container, GlowBlob, Section } from "@/components/ui/layout";
import { Reveal } from "@/components/ui/reveal";
import { SocialsSection } from "@/components/site/sections/socials-section";
import { CtaSection } from "@/components/site/sections/cta-section";
import { SocialIcon } from "@/components/site/social-icon";
import { redesPageContent } from "@/content";
import { getSocialLinks } from "@/server/repositories/content";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Redes sociales",
  description:
    "Descubre contenido exclusivo, noticias, consejos y mucho más. Únete a la comunidad de Sound Tech Perú.",
  alternates: { canonical: "/redes-sociales" },
};

export default async function RedesSocialesPage() {
  const socials = await getSocialLinks();
  const visible = socials.filter((s) => s.isVisible);

  return (
    <>
      <PageHero
        titleLead="NUESTRAS"
        titleAccent="REDES SOCIALES"
        subtitle="Prepárate hoy para ser parte del futuro"
        imageKey="hero-redes"
      />

      <SocialsSection
        eyebrow={redesPageContent.eyebrow}
        title={redesPageContent.heading}
        quote={redesPageContent.quote}
        body={redesPageContent.body}
        socials={visible}
        showCta={false}
      />

      {/* Directorio completo de canales */}
      <Section tone="raised" className="overflow-hidden">
        <GlowBlob
          className="-right-32 top-0 opacity-40"
          size={480}
          color="rgba(235,93,26,0.22)"
        />

        <Container className="relative">
          <Reveal>
            <h2 className="headline text-2xl md:text-3xl">
              <span className="text-white">TODOS NUESTROS </span>
              <span className="text-gradient-brand">CANALES</span>
            </h2>
          </Reveal>

          <ul className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((social) => (
              <li key={`${social.platform}-${social.url}`}>
                <a
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 rounded-card border border-hairline bg-ink-900/60 p-5 transition-all duration-300 hover:border-brand-600/50 hover:bg-ink-850"
                >
                  <span
                    aria-hidden
                    className="grid size-11 shrink-0 place-items-center rounded-2xl bg-white/[0.05] text-white transition-colors group-hover:bg-gradient-brand"
                  >
                    <SocialIcon platform={social.platform} className="size-5" />
                  </span>

                  <span className="min-w-0">
                    <span className="block font-display text-[12px] font-extrabold uppercase tracking-wide text-white">
                      {social.label}
                    </span>
                    <span className="mt-0.5 block truncate text-[11px] text-fog-400">
                      {social.url.replace(/^https?:\/\//, "")}
                    </span>
                    {social.note ? (
                      <span className="mt-1 block text-[10px] text-fog-600">
                        {social.note}
                      </span>
                    ) : null}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <CtaSection
        title="¿PREFIERES ESCRIBIRNOS DIRECTO?"
        subtitle="Nuestro equipo responde consultas por WhatsApp y correo en menos de 24 horas hábiles."
        buttonLabel="Ir a contacto"
        buttonHref="/contactenos"
        imageKey="hero-contacto"
      />
    </>
  );
}
