import { MediaImage } from "@/components/site/media-image";

/**
 * Separador de linea de colores: la tira de luz que el disenador coloco entre
 * la franja de clientes y la de redes sociales.
 */
export function ColorLine({ className }: { className?: string }) {
  return (
    <div aria-hidden className={className}>
      <MediaImage
        mediaKey="deco-linea-colores"
        alt=""
        fill={false}
        width={1600}
        height={380}
        sizes="100vw"
        className="h-auto w-full"
      />
    </div>
  );
}
