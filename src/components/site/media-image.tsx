import Image from "next/image";
import { getMedia } from "@/content";
import { cn } from "@/lib/utils";

/**
 * Resuelve una clave de medios a una imagen optimizada.
 *
 * Trabajamos con claves semanticas ("audio-1", "hero-cursos") en lugar de
 * rutas, de modo que reemplazar una foto por la real del cliente sea cambiar
 * el archivo o subirlo desde /admin sin tocar el codigo.
 */
export function MediaImage({
  mediaKey,
  alt,
  fill = true,
  width,
  height,
  sizes,
  className,
  priority,
  fallbackAlt,
}: {
  mediaKey: string;
  alt?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  className?: string;
  priority?: boolean;
  fallbackAlt?: string;
}) {
  const asset = getMedia(mediaKey);

  if (!asset) {
    // Sin imagen disponible: bloque de marca para no romper la maqueta.
    return (
      <span
        aria-hidden
        className={cn(
          "block bg-gradient-to-br from-ink-800 via-ink-900 to-ink-850",
          className,
        )}
        style={fill ? undefined : { width, height }}
      />
    );
  }

  const imageAlt = alt ?? asset.alt ?? fallbackAlt ?? "";

  if (fill) {
    return (
      <Image
        src={asset.url}
        alt={imageAlt}
        fill
        sizes={sizes}
        priority={priority}
        className={cn("object-cover", className)}
      />
    );
  }

  return (
    <Image
      src={asset.url}
      alt={imageAlt}
      width={width ?? asset.width ?? 1600}
      height={height ?? asset.height ?? 1000}
      sizes={sizes}
      priority={priority}
      className={className}
    />
  );
}

/** URL cruda de una clave de medios, para usos fuera de <Image>. */
export function mediaUrl(mediaKey: string, fallback = "/media/hero-legal.jpg") {
  return getMedia(mediaKey)?.url ?? fallback;
}
