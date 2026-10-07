/**
 * Genera src/content/media.ts escaneando public/media.
 *
 * Uso: node scripts/generate-media-manifest.mjs
 *
 * Se ejecuta despues de scripts/fetch-media.mjs. Si una imagen no se pudo
 * descargar y quedo el respaldo .svg, el manifiesto apunta al .svg
 * automaticamente, de modo que nunca hay rutas rotas.
 */

import { readdir, writeFile, readFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const MEDIA_DIR = path.join(ROOT, "public", "media");
const OUT = path.join(ROOT, "src", "content", "media.ts");

/**
 * Textos alternativos de los recursos reales del cliente.
 *
 * Los escribe scripts/import-client-assets.mjs y tienen prioridad sobre el
 * mapa de marcadores de posicion de mas abajo.
 */
let ALT_IMPORTADOS = {};
try {
  ALT_IMPORTADOS = JSON.parse(
    await readFile(path.join(MEDIA_DIR, "alt-textos.json"), "utf8"),
  );
} catch {
  // Todavia no se han importado los recursos del cliente.
}

/** Texto alternativo por clave: obligatorio para accesibilidad. */
const ALT = {
  "hero-home": "Consola de mezcla de audio profesional en un estudio",
  "hero-nosotros": "Ingeniero de sonido operando una consola de mezcla",
  "hero-servicios": "Detalle de los faders de una consola de audio",
  "hero-cursos": "Sala de control de un estudio de grabación",
  "hero-proyectos": "Auditorio con sistema de audio e iluminación",
  "hero-clientes": "Fachada de una institución educativa",
  "hero-galeria": "Interior de un estudio de grabación equipado",
  "hero-contacto": "Consola de mezcla en ambiente oscuro",
  "hero-cotizar": "Rack de equipos de audio profesional",
  "hero-redes": "Equipos de estudio de audio en penumbra",
  "hero-legal": "Fondo abstracto tecnológico en tonos oscuros",

  "audio-1": "Parlante profesional instalado en una sala",
  "audio-2": "Parlantes de techo instalados en una oficina",
  "acustica-1": "Paneles acústicos en la pared de un estudio",
  "acustica-2": "Tratamiento acústico con espuma en un estudio",
  "conferencia-1": "Mesa de conferencia con micrófonos",
  "teleconferencia-1": "Sala de videoconferencia con pantalla",
  "control-1": "Panel táctil de control de una sala",
  "control-2": "Sala de reuniones moderna con pantalla táctil",
  "iluminacion-1": "Iluminación comercial en el interior de una tienda",
  "video-1": "Video wall con pantallas LED",
  "video-2": "Proyector instalado en un auditorio",
  "cctv-1": "Cámara de videovigilancia en un edificio",
  "cableado-1": "Rack de servidores con cableado de red",
  "cableado-2": "Patch panel de cableado estructurado",

  "course-studio": "Consola de mezcla en el estudio de grabación",
  "course-classroom": "Alumnos en un aula con equipos de cómputo",
  "course-lab": "Estación de trabajo de producción musical",
  "course-gear": "Equipos de audio profesional en detalle",
  "academy-photo": "Docente trabajando en un estudio de sonido",
  "faq-photo": "Sistema de sonido en un escenario",
  "socials-photo": "Ambiente de estudio de audio",

  "logo-soundtech": "Logotipo de Sound Tech Perú",
  "hero-video-poster": "Consola de mezcla en penumbra",
  "hero-video": "Vídeo de fondo con equipos de audio",
};

/** Logos de clientes: se generan como emblemas SVG, no se descargan. */
const CLIENT_LOGOS = {
  "client-carmelines": "Colegio Carmelines",
  "client-san-francisco-de-borja": "Colegio San Francisco de Borja",
  "client-nuestra-senora-del-consuelo": "Colegio Nuestra Señora del Consuelo",
  "client-reino-del-mundo": "Colegio Reino del Mundo",
};

async function main() {
  const files = await readdir(MEDIA_DIR);
  const found = new Map();
  for (const f of files) {
    if (!/\.(jpe?g|png|webp|svg|avif)$/i.test(f)) continue;
    const key = f.replace(/\.[^.]+$/, "");
    const ext = f.slice(f.lastIndexOf(".")).toLowerCase();
    // Preferimos raster sobre el respaldo SVG.
    if (!found.has(key) || ext !== ".svg") found.set(key, ext);
  }

  for (const key of Object.keys(CLIENT_LOGOS)) {
    found.set(key, ".svg");
  }
  found.set("logo-soundtech", ".svg");

  const entries = [...found.entries()].sort(([a], [b]) => a.localeCompare(b));

  const missingAlt = entries
    .map(([k]) => k)
    .filter((k) => !ALT[k] && !CLIENT_LOGOS[k] && !(k in ALT_IMPORTADOS));
  if (missingAlt.length) {
    console.warn(
      `Aviso: ${missingAlt.length} imagenes sin texto alternativo: ${missingAlt.join(", ")}`,
    );
  }

  const body = entries
    .map(([key, ext]) => {
      const alt =
        ALT_IMPORTADOS[key] ?? ALT[key] ?? CLIENT_LOGOS[key] ?? key;
      return `  "${key}": { key: "${key}", url: "/media/${key}${ext}", alt: ${JSON.stringify(alt)} },`;
    })
    .join("\n");

  const file = `import type { MediaContent } from "./types";

/**
 * Manifiesto de medios. ARCHIVO GENERADO — no editar a mano.
 * Regenerar con: node scripts/generate-media-manifest.mjs
 *
 * Cada entrada corresponde a un archivo de public/media. Para reemplazar una
 * imagen por la fotografia real del cliente basta con sobrescribir el archivo
 * conservando el nombre, o subirla desde /admin.
 */

export const media = {
${body}
} as const satisfies Record<string, MediaContent>;

export type MediaKey = keyof typeof media;

/** Devuelve los datos de una imagen por clave, o undefined si no existe. */
export function getMedia(key: string): MediaContent | undefined {
  return (media as Record<string, MediaContent>)[key];
}
`;

  await writeFile(OUT, file, "utf8");
  console.log(`Manifiesto escrito con ${entries.length} entradas -> src/content/media.ts`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
