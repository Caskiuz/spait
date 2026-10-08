import { MediaImage } from "@/components/site/media-image";

/**
 * Separador de linea de colores: la tira de luz que el disenador coloco entre
 * la franja de clientes y la de redes sociales.
 *
 * La imagen trae margen oscuro en los costados y, a su tamano natural, queda
 * mas gruesa de lo que pide el diseno. El disenador lo marco con dos lineas en
 * una captura: la tira debia verse la mitad de gruesa. Por eso se pinta en una
 * banda del 5 % del ancho de la pantalla (la mitad del 10 % anterior) y un poco
 * mas ancha que el viewport: la imagen se recorta, nunca se deforma, y la luz
 * llega a las dos paredes.
 */
export function ColorLine({ className }: { className?: string }) {
  return (
    <div aria-hidden className={className}>
      <div className="relative h-[5vw] w-[106vw] max-w-none -translate-x-[3vw] overflow-hidden">
        <MediaImage
          mediaKey="deco-linea-colores"
          alt=""
          sizes="106vw"
          className="object-cover"
        />
      </div>
    </div>
  );
}
