/**
 * Convierte el vídeo del banner que envió el cliente.
 *
 * Uso:  node scripts/convert-video.mjs [ruta-del-video]
 *
 * El original es un .mov de 4096x2160 en MJPEG a 380 Mbps: 264 MB para 5,5
 * segundos. Aquí se reduce a 1080p en H.264 y VP9, sin pista de audio
 * (es un fondo decorativo) y con el atomo moov al principio para que empiece
 * a reproducirse antes de terminar de descargar.
 *
 * También extrae un fotograma de respaldo, que es lo que se ve mientras carga
 * el vídeo y lo que se muestra si el navegador no puede reproducirlo.
 */

import { mkdir, stat } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";
import ffmpegPath from "ffmpeg-static";

const ejecutar = promisify(execFile);

const ENTRADA =
  process.argv[2] ??
  path.resolve(
    import.meta.dirname,
    "../../diseñoweb/wetransfer_sound-tech-peru-material-rar_2026-10-06_1837/Sound tech peru (material)/Videos/1107959_1080p_4k_4096x2160.mov",
  );

const SALIDA = path.resolve(import.meta.dirname, "../public/media");
const ANCHO = 1920;

async function ffmpeg(args) {
  return ejecutar(ffmpegPath, ["-hide_banner", "-loglevel", "error", "-y", ...args], {
    maxBuffer: 1024 * 1024 * 32,
  });
}

async function peso(p) {
  try {
    return (await stat(p)).size;
  } catch {
    return 0;
  }
}

const mb = (bytes) => `${(bytes / 1048576).toFixed(2)} MB`;

async function main() {
  await mkdir(SALIDA, { recursive: true });

  const original = await peso(ENTRADA);
  if (!original) {
    throw new Error(`No se encontró el vídeo de origen:\n  ${ENTRADA}`);
  }
  console.log(`Origen: ${mb(original)}`);

  // --- MP4 (H.264): compatible con todos los navegadores -------------------
  const mp4 = path.join(SALIDA, "hero-video.mp4");
  process.stdout.write("Generando MP4 (H.264)… ");
  await ffmpeg([
    "-i", ENTRADA,
    "-an",
    "-vf", `scale=${ANCHO}:-2:flags=lanczos`,
    "-c:v", "libx264",
    "-profile:v", "high",
    "-preset", "slow",
    "-crf", "26",
    "-pix_fmt", "yuv420p",
    "-movflags", "+faststart",
    mp4,
  ]);
  console.log(mb(await peso(mp4)));

  // --- WebM (VP9): un 25-35 % más ligero -----------------------------------
  const webm = path.join(SALIDA, "hero-video.webm");
  process.stdout.write("Generando WebM (VP9)… ");
  await ffmpeg([
    "-i", ENTRADA,
    "-an",
    "-vf", `scale=${ANCHO}:-2:flags=lanczos`,
    "-c:v", "libvpx-vp9",
    "-crf", "36",
    "-b:v", "0",
    "-row-mt", "1",
    "-deadline", "good",
    "-cpu-used", "2",
    webm,
  ]);
  console.log(mb(await peso(webm)));

  // --- Fotograma de respaldo ----------------------------------------------
  const poster = path.join(SALIDA, "hero-video-poster.jpg");
  process.stdout.write("Extrayendo fotograma… ");
  await ffmpeg([
    "-ss", "0.2",
    "-i", ENTRADA,
    "-frames:v", "1",
    "-vf", `scale=${ANCHO}:-2:flags=lanczos`,
    "-q:v", "4",
    poster,
  ]);
  console.log(mb(await peso(poster)));

  const total = (await peso(mp4)) + (await peso(webm)) + (await peso(poster));
  console.log(
    `\nTotal: ${mb(total)} — un ${((1 - total / original) * 100).toFixed(1)} % menos que el original.`,
  );
}

main().catch((error) => {
  console.error("\nFallo la conversión:", error.message);
  process.exit(1);
});
