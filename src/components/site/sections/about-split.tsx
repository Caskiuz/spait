import { ButtonLink } from "@/components/ui/button";
import { Container, GlowBlob, Section } from "@/components/ui/layout";
import { Reveal } from "@/components/ui/reveal";
import { MediaImage } from "@/components/site/media-image";

/**
 * Bloque "Sobre nosotros" de la portada.
 *
 * Sigue la composicion de la referencia: titular arriba a la izquierda con el
 * disco decorativo enfrente, el resplandor naranja lateral, y debajo las
 * fotografias con el texto que continua al costado.
 *
 * El parrafo va partido en dos tramos porque asi lo pide el disenador: la
 * primera frase queda bajo el titular y la segunda ocupa el hueco que dejan
 * las fotografias.
 */
export function AboutSplit({
  eyebrow,
  titleLead,
  titleAccent,
  bodyLead,
  bodyRest,
  cta,
  imageKey,
  decorativeKey,
}: {
  eyebrow: string;
  titleLead: string;
  titleAccent: string;
  bodyLead: string;
  bodyRest: string;
  cta: { label: string; href: string };
  /** Imagen que el diseñador ya envió montada para esta sección. */
  imageKey: string;
  decorativeKey: string;
}) {
  return (
    <Section id="sobre-nosotros" className="overflow-hidden">
      {/* Resplandor naranja del borde derecho, como en la referencia */}
      <GlowBlob
        className="-right-24 top-1/4 opacity-70 lg:-right-16"
        size={620}
        color="rgba(235,93,26,0.34)"
      />

      <Container className="relative">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-16">
          <Reveal>
            <p className="eyebrow mb-3">{eyebrow}</p>
            {/* El titular va en dos lineas: «DIVISIÓN DE PROYECTOS» y debajo
                «CON MÁS DE 10 AÑOS». Para que la primera entre en una sola
                linea el tamano baja respecto al resto de titulares. */}
            <h2 className="headline max-w-xl text-2xl leading-[1.1] sm:text-3xl md:text-4xl lg:text-[2.4rem]">
              <span className="block text-white">{titleLead}</span>
              <span className="text-gradient-brand block">{titleAccent}</span>
            </h2>

            <p className="mt-5 max-w-md text-[0.9rem] leading-relaxed text-fog-400">
              {bodyLead}
            </p>
          </Reveal>

          {/* El disco que envio el disenador, sin recortar. Pidió dejarlo a la
              mitad de tamano: es solo un adorno. */}
          <Reveal delay={0.1} className="hidden lg:block">
            <div className="relative flex justify-end lg:pt-2">
              <MediaImage
                mediaKey={decorativeKey}
                fill={false}
                width={900}
                height={778}
                sizes="(max-width: 1280px) 14rem, 16rem"
                className="h-auto w-full max-w-56 xl:max-w-64"
              />
            </div>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-10 lg:mt-6 lg:grid-cols-[1.25fr_0.75fr] lg:items-center lg:gap-14">
          {/* Fotografia: el disenador la envio ya compuesta, con los puntitos
              incorporados, asi que no se anade ningun adorno encima. El
              recuadro recorta los margenes vacios de la composicion —que no
              aportan nada— para que las fotos ganen el tamano que pidio. */}
          <Reveal className="relative">
            <div className="relative aspect-[62/30] overflow-hidden rounded-card">
              <MediaImage
                mediaKey={imageKey}
                sizes="(max-width: 1024px) 92vw, 58vw"
                className="scale-[1.16] object-cover"
              />
            </div>
          </Reveal>

          {/* Texto que continua al costado de las fotografias */}
          <Reveal delay={0.12} className="lg:pt-8">
            <p className="text-[0.9rem] leading-relaxed text-fog-400">
              {bodyRest}
            </p>

            <div className="mt-8">
              <ButtonLink href={cta.href} variant="outline" size="md">
                {cta.label}
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
