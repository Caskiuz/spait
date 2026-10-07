import { MediaImage } from "@/components/site/media-image";

/**
 * Separador de linea de colores: la tira de luz que el disenador coloco entre
 * la franja de clientes y la de redes sociales.
 *
 * La imagen trae margen oscuro en sus costados, y el disenador pidio que la
 * luz llegue hasta el borde de la pantalla; por eso se pinta un poco mas ancha
 * que el viewport y se recorta el sobrante.
 */
export function ColorLine({ className }: { className?: string }) {
  return (
    <div aria-hidden className={`overflow-hidden ${className ?? ""}`}>
      <MediaImage
        mediaKey="deco-linea-colores"
        alt=""
        fill={false}
        width={1600}
        height={380}
        sizes="100vw"
        className="h-auto w-[106vw] max-w-none -translate-x-[3vw]"
      />
    </div>
  );
}
