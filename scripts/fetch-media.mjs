/**
 * Descarga las imagenes de marcador de posicion desde Openverse
 * (agregador de contenido con licencia libre) hacia public/media.
 *
 * Uso:  node scripts/fetch-media.mjs [--force]
 *
 * - Filtra por licencias que permiten uso comercial y modificacion.
 * - Prefiere imagenes grandes y en formato horizontal.
 * - Escribe la atribucion en public/media/ATRIBUCIONES.md
 * - Si no encuentra nada, genera un respaldo con degradado de marca para
 *   que el sitio nunca muestre una imagen rota.
 *
 * Reemplazar por las fotos reales del cliente es tan simple como sobrescribir
 * el archivo correspondiente en public/media conservando el nombre.
 */

import { mkdir, writeFile, access } from "node:fs/promises";
import { createWriteStream } from "node:fs";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT_DIR = path.join(ROOT, "public", "media");
const API = "https://api.openverse.org/v1/images/";
const UA = "SoundTechPeruSiteBuilder/1.0 (build-time placeholder fetcher)";
const FORCE = process.argv.includes("--force");

/** --only a,b,c  limita el trabajo a esas claves. */
const onlyIndex = process.argv.indexOf("--only");
const ONLY =
  onlyIndex > -1 && process.argv[onlyIndex + 1]
    ? new Set(process.argv[onlyIndex + 1].split(",").map((s) => s.trim()))
    : null;

/**
 * key -> consultas en orden de especificidad. Se prueban de la mas concreta
 * a la mas generica hasta encontrar una imagen valida. El key es el nombre
 * del archivo final.
 */
const TARGETS = {
  // Heroes de pagina
  "hero-home": { q: ["mixing console", "audio mixer", "sound studio"] },
  "hero-nosotros": { q: ["mixing desk engineer", "sound engineer", "mixing console"] },
  "hero-servicios": { q: ["mixing console faders", "audio mixer", "mixing console"] },
  "hero-cursos": { q: ["recording studio control room", "recording studio", "music studio"] },
  "hero-proyectos": { q: ["auditorium stage", "concert stage", "auditorium"] },
  "hero-clientes": { q: ["classroom desks", "school classroom", "university lecture room"] },
  "hero-galeria": { q: ["condenser microphone studio", "microphone boom arm", "studio microphone"] },
  "hero-contacto": { q: ["mixing console", "audio mixer", "sound studio"] },
  "hero-cotizar": { q: ["xlr audio cables", "audio connectors cable", "rack equipment"] },
  "hero-redes": { q: ["music studio", "recording studio", "mixing console"] },
  "hero-legal": { q: ["dark abstract light", "abstract technology", "dark background"] },

  // Servicios
  "audio-1": { q: ["loudspeaker", "audio speaker", "public address system"] },
  "audio-2": { q: ["ceiling speaker", "loudspeaker ceiling", "speaker installation"] },
  "acustica-1": { q: ["acoustic foam", "soundproof foam studio wall", "egg crate foam"] },
  "acustica-2": { q: ["acoustic foam studio", "recording studio acoustic", "soundproof foam"] },
  "conferencia-1": { q: ["boardroom table", "conference room table", "meeting room table microphone"] },
  "teleconferencia-1": { q: ["video conference room", "video call screen office", "telepresence"] },
  "control-1": { q: ["touchscreen control panel", "touch panel wall", "control panel room"] },
  "control-2": { q: ["meeting room screen", "conference room modern", "meeting room"] },
  "iluminacion-1": { q: ["stage lighting rig", "architectural lighting facade", "led strip lighting"] },
  "video-1": { q: ["video wall", "led display screen", "led screen stage"] },
  "video-2": { q: ["projector screen", "video projector ceiling", "cinema projector"] },
  "cctv-1": { q: ["dome surveillance camera", "security camera ceiling", "cctv camera building"] },
  "cableado-1": { q: ["server rack cables", "network cabinet", "server room"] },
  "cableado-2": { q: ["patch panel cables", "ethernet cables", "network cables"] },

  // Formacion / academia
  "course-studio": { q: ["recording studio mixing console", "recording studio", "mixing console"] },
  "course-classroom": { q: ["lecture hall students", "university classroom", "students classroom"] },
  "course-lab": { q: ["music production workstation", "home studio computer", "audio workstation"] },
  "course-gear": { q: ["audio mixer close up", "studio microphone", "mixing console detail"] },
  "academy-photo": { q: ["sound engineer mixing desk", "studio engineer console", "mixing console hands"] },
  "faq-photo": { q: ["concert stage sound system", "concert stage", "stage lights"] },
  "socials-photo": { q: ["music studio", "recording studio", "mixing console"] },
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function exists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function search(query, minW) {
  const params = new URLSearchParams({
    q: query,
    page_size: "20",
    license_type: "commercial,modification",
    mature: "false",
  });
  const res = await fetch(`${API}?${params}`, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`Openverse ${res.status}`);
  const data = await res.json();

  const usable = (data.results ?? []).filter(
    (r) => r.url && r.filetype !== "svg" && r.width > 0 && r.height > 0,
  );

  // Primero los que cumplen el minimo pedido; si no hay, cualquiera horizontal.
  const preferred = usable
    .filter((r) => r.width >= minW && r.width / r.height >= 1.2)
    .sort((a, b) => b.width * b.height - a.width * a.height);
  if (preferred.length) return preferred;

  return usable
    .filter((r) => r.width / r.height >= 1.05)
    .sort((a, b) => b.width * b.height - a.width * a.height);
}

/** Respaldo: degradado de marca con la firma de la empresa. */
function fallbackSvg(key) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#141417"/>
      <stop offset="55%" stop-color="#0c0c0e"/>
      <stop offset="100%" stop-color="#1c1206"/>
    </linearGradient>
    <radialGradient id="glow" cx="72%" cy="28%" r="62%">
      <stop offset="0%" stop-color="#ff6b00" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="#ff6b00" stop-opacity="0"/>
    </radialGradient>
    <pattern id="dots" width="14" height="14" patternUnits="userSpaceOnUse">
      <circle cx="1.4" cy="1.4" r="1.4" fill="#ffffff" opacity="0.07"/>
    </pattern>
  </defs>
  <rect width="1600" height="1000" fill="url(#g)"/>
  <rect width="1600" height="1000" fill="url(#dots)"/>
  <rect width="1600" height="1000" fill="url(#glow)"/>
  <g fill="none" stroke="#ff6b00" stroke-opacity="0.35" stroke-width="2">
    <circle cx="1150" cy="300" r="120"/><circle cx="1150" cy="300" r="190"/>
  </g>
  <text x="80" y="880" font-family="Montserrat, Arial, sans-serif" font-size="30"
        font-weight="700" letter-spacing="9" fill="#ffffff" fill-opacity="0.28">${key.toUpperCase()}</text>
</svg>`;
}

async function download(url, dest) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`download ${res.status}`);
  await pipeline(Readable.fromWeb(res.body), createWriteStream(dest));
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const attributions = [];
  const failures = [];
  const keys = Object.keys(TARGETS).filter((k) => !ONLY || ONLY.has(k));

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const dest = path.join(OUT_DIR, `${key}.jpg`);

    if (!FORCE && (await exists(dest))) {
      console.log(`[${i + 1}/${keys.length}] ${key} — ya existe, se omite`);
      continue;
    }

    const { q, minW = 1000 } = TARGETS[key];
    const queries = Array.isArray(q) ? q : [q];
    let done = false;

    for (const query of queries) {
      if (done) break;
      for (let attempt = 0; attempt < 2 && !done; attempt++) {
        try {
          const candidates = await search(query, minW);
          if (!candidates.length) throw new Error("sin resultados");

          for (const c of candidates.slice(0, 4)) {
            try {
              await download(c.url, dest);
              attributions.push({
                key,
                title: c.title ?? "(sin titulo)",
                creator: c.creator ?? "desconocido",
                license: `${c.license} ${c.license_version ?? ""}`.trim(),
                source: c.foreign_landing_url ?? c.url,
                provider: c.provider,
              });
              console.log(
                `[${i + 1}/${keys.length}] ${key} — ok (${c.width}x${c.height}, ${c.license}, "${query}")`,
              );
              done = true;
              break;
            } catch (err) {
              console.warn(`   candidato fallo (${err.message}), probando otro`);
            }
          }
          if (!done) throw new Error("ningun candidato descargable");
        } catch (err) {
          if (attempt === 1) {
            console.warn(`   consulta "${query}" agotada (${err.message})`);
          } else {
            await sleep(2000);
          }
        }
        await sleep(1600);
      }
    }

    if (!done) {
      console.warn(`[${i + 1}/${keys.length}] ${key} — respaldo SVG`);
      await writeFile(path.join(OUT_DIR, `${key}.svg`), fallbackSvg(key));
      failures.push({ key, reason: "sin resultados utilizables" });
    }

    // Respetamos el limite de 20 peticiones por minuto de Openverse.
    await sleep(3200);
  }

  const md = [
    "# Atribuciones de imagenes de marcador de posicion",
    "",
    "Estas imagenes son **provisionales** y se usan solo durante el desarrollo.",
    "Deben reemplazarse por las fotografias reales del cliente antes de publicar.",
    "",
    "Para reemplazar una imagen: sobrescribe el archivo en `public/media/`",
    "manteniendo el mismo nombre, o sube la foto desde el panel `/admin`.",
    "",
    "---",
    "",
    ...attributions.map(
      (a) =>
        `- **${a.key}** — "${a.title}" por ${a.creator} · Licencia ${a.license} · ${a.provider}\n  Fuente: ${a.source}`,
    ),
    "",
    failures.length
      ? `\n## Sin resultados en Openverse (se genero un respaldo de marca)\n\n${failures
          .map((f) => `- ${f.key} (${f.reason})`)
          .join("\n")}`
      : "",
  ].join("\n");

  await writeFile(path.join(OUT_DIR, "ATRIBUCIONES.md"), md, "utf8");
  console.log(
    `\nListo: ${attributions.length} imagenes descargadas, ${failures.length} respaldos SVG.`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
