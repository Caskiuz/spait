/**
 * Optimiza las imagenes de public/media.
 *
 * Uso:  node scripts/optimize-media.mjs
 *
 * Los proveedores de fotos libres sirven originales de camara: el lote inicial
 * llego a pesar 149 MB, con un archivo de 75 MB que bloqueaba el optimizador
 * de Next. Este script los redimensiona y recomprime para que el sitio sea
 * desplegable y rapido.
 *
 * - Heroes  -> 1920 px de ancho
 * - Resto   -> 1400 px de ancho
 * - Calidad 78, progresivo, sin metadatos
 *
 * Es idempotente: si un archivo ya esta por debajo del limite se omite.
 */

import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const MEDIA = path.join(ROOT, "public", "media");

const HERO_MAX_WIDTH = 1920;
const CARD_MAX_WIDTH = 1400;
const QUALITY = 78;
/** Por encima de este peso conviene recomprimir aunque el ancho sea correcto. */
const MAX_BYTES = 700 * 1024;

const isHero = (name) => name.startsWith("hero-");

async function main() {
  const files = (await readdir(MEDIA)).filter((f) => /\.(jpe?g|png)$/i.test(f));

  let optimized = 0;
  let saved = 0;

  for (const file of files) {
    const full = path.join(MEDIA, file);
    const before = (await stat(full)).size;

    const maxWidth = isHero(file) ? HERO_MAX_WIDTH : CARD_MAX_WIDTH;
    const image = sharp(full, { failOn: "none" });
    const meta = await image.metadata();

    const needsResize = (meta.width ?? 0) > maxWidth;
    const needsRecompress = before > MAX_BYTES;

    if (!needsResize && !needsRecompress) {
      continue;
    }

    const buffer = await image
      .rotate() // respeta la orientacion EXIF antes de descartar metadatos
      .resize({ width: maxWidth, withoutEnlargement: true })
      .jpeg({ quality: QUALITY, progressive: true, mozjpeg: true })
      .toBuffer();

    // Solo escribimos si de verdad mejora el peso.
    // Escribimos a un temporal y luego reemplazamos: en Windows sharp mantiene
    // un descriptor abierto sobre el original y no se puede sobrescribir
    // directamente (falla con errno -4094).
    if (buffer.length < before) {
      const { writeFile, rename, unlink } = await import("node:fs/promises");
      const temp = `${full}.tmp`;

      await writeFile(temp, buffer);
      try {
        await rename(temp, full);
      } catch (error) {
        await unlink(temp).catch(() => undefined);
        throw error;
      }

      const after = buffer.length;
      saved += before - after;
      optimized += 1;
      console.log(
        `${file}: ${(before / 1048576).toFixed(1)} MB -> ${(after / 1048576).toFixed(1)} MB` +
          (needsResize ? ` (${meta.width}px -> ${Math.min(meta.width, maxWidth)}px)` : ""),
      );
    }
  }

  console.log(
    `\n${optimized} imagen(es) optimizada(s). Espacio liberado: ${(saved / 1048576).toFixed(1)} MB.`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
