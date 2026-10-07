import Link from "next/link";
import { Compass } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container, GlowBlob, Grain } from "@/components/ui/layout";
import { MediaImage } from "@/components/site/media-image";
import { mainNav } from "@/content";

export default function NotFound() {
  return (
    <section className="relative flex min-h-dvh items-center overflow-hidden py-32">
      <div className="absolute inset-0">
        <MediaImage mediaKey="hero-legal" sizes="100vw" className="object-cover" />
        <span
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-ink-950/92 via-ink-950/85 to-ink-950"
        />
      </div>
      <Grain />
      <GlowBlob
        className="left-1/2 top-1/3 -translate-x-1/2 opacity-55"
        size={560}
        color="rgba(235,93,26,0.28)"
      />

      <Container className="relative text-center">
        <span
          aria-hidden
          className="mx-auto grid size-14 place-items-center rounded-2xl border border-brand-600/40 bg-brand-600/10 text-brand-500"
        >
          <Compass className="size-6" />
        </span>

        <p className="headline mt-8 text-6xl text-gradient-brand md:text-8xl">404</p>

        <h1 className="headline mt-4 text-2xl md:text-4xl">
          <span className="text-white">PÁGINA NO </span>
          <span className="text-gradient-brand">ENCONTRADA</span>
        </h1>

        <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-fog-400">
          La dirección que buscas no existe o cambió. Puedes volver al inicio o
          ir directo a una de las secciones principales.
        </p>

        <nav
          aria-label="Secciones principales"
          className="mt-9 flex flex-wrap justify-center gap-2.5"
        >
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full border border-hairline px-4 py-2 text-xs text-fog-300 transition-colors hover:border-brand-600/60 hover:text-brand-400"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-10 flex justify-center">
          <ButtonLink href="/" size="lg" withArrow>
            Volver al inicio
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
