import { Container, Section } from "@/components/ui/layout";
import { SectionHeading } from "@/components/ui/section-heading";
import { MediaImage } from "@/components/site/media-image";
import type { ClientContent } from "@/content/types";

/**
 * Carrusel continuo de clientes.
 *
 * El diseñador pidió sustituir las dos filas del diseño por una sola que corra
 * sola, con los logos enlazados.
 *
 * Se resuelve con una animación CSS y no con JavaScript: es más fluido, no
 * bloquea el hilo principal y funciona aunque el JavaScript no haya cargado.
 * La lista se duplica para que el bucle no tenga salto, y esa copia queda
 * oculta a los lectores de pantalla.
 *
 * Se detiene al pasar el cursor o al enfocar con el teclado, y con
 * `prefers-reduced-motion` se muestra como una fila que se puede desplazar.
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
  if (!clients.length) return null;

  return (
    <Section tone={tone} className="overflow-hidden">
      <Container>
        {eyebrow || titleLead ? (
          <SectionHeading
            eyebrow={eyebrow}
            titleLead={titleLead}
            titleAccent={titleAccent}
            subtitle={subtitle}
          />
        ) : null}
      </Container>

      {/* La marquesina ocupa todo el ancho, sin el acolchado del contenedor */}
      <div
        className="group/marquee relative mt-12"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
        }}
      >
        <ul
          aria-label="Clientes que confían en nosotros"
          className="no-scrollbar flex w-max animate-marquee gap-5 px-5 group-hover/marquee:[animation-play-state:paused] group-focus-within/marquee:[animation-play-state:paused] motion-reduce:w-full motion-reduce:animate-none motion-reduce:overflow-x-auto motion-reduce:px-5"
        >
          {[...clients, ...clients].map((client, index) => {
            // La segunda mitad es la copia que cierra el bucle.
            const esCopia = index >= clients.length;
            return (
              <li
                key={`${client.name}-${index}`}
                aria-hidden={esCopia || undefined}
                // Con movimiento reducido no hay bucle, así que la copia sobra.
                className={esCopia ? "shrink-0 motion-reduce:hidden" : "shrink-0"}
              >
                <ClientCard client={client} />
              </li>
            );
          })}
        </ul>
      </div>
    </Section>
  );
}

function ClientCard({ client }: { client: ClientContent }) {
  const contenido = (
    <>
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

      <h3 className="font-display text-[12px] font-black uppercase leading-tight tracking-wide">
        <span className="block text-white">
          {client.shortName.split(" ").slice(0, 1).join(" ")}
        </span>
        <span className="text-gradient-brand block">
          {client.shortName.split(" ").slice(1).join(" ")}
        </span>
      </h3>
    </>
  );

  const clases =
    "group flex w-52 flex-col items-center gap-4 rounded-card border border-hairline bg-ink-900/70 p-6 text-center transition-all duration-300 hover:border-brand-600/45 hover:bg-ink-850";

  return client.websiteUrl ? (
    <a
      href={client.websiteUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={clases}
    >
      {contenido}
    </a>
  ) : (
    <article className={clases}>{contenido}</article>
  );
}
