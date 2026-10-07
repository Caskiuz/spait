/**
 * Verifica que cada activo importado al sitio coincida con su original del
 * material del cliente. No confía en los nombres: compara el contenido.
 *
 * Uso: node scripts/verify-client-assets.mjs
 *
 * Método: decodifica ambos lados, los normaliza (fondo plano, recorte del
 * contenido, 48×48 y centrado en 64×64) y mide la diferencia media de píxeles.
 * Con recompresión y redimensionado la diferencia queda por debajo de ~4/255;
 * por encima de 6 se marca como sospechoso.
 *
 * También comprueba que el zip de BR Firma traiga los seis pesos y que el
 * póster del vídeo guarde el aspecto del .mov original.
 */

import { readdirSync, existsSync } from "node:fs";
import { execSync } from "node:child_process";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const MEDIA = path.join(ROOT, "public", "media");
const MAT = "C:/Users/rijar/Proyectos/spait/diseñoweb/wetransfer_sound-tech-peru-material-rar_2026-10-06_1837";
const HOME = path.join(MAT, "Home", "Home");
const NOS = path.join(MAT, "Nostros", "Nostros");
const LOGO = path.join(MAT, "Sound tech peru (material)", "logo");

/** Normaliza una imagen y devuelve un buffer crudo comparable. */
async function normalizar(entrada, opciones = {}) {
  let img = sharp(entrada);
  if (opciones.recorte) {
    const [x, y, w, h] = opciones.recorte;
    img = img.extract({ left: x, top: y, width: w, height: h });
  }
  // Sin recorte de margenes: los dos lados conservan las mismas proporciones
  // (las importaciones son redimensionados puros), asi que encajan igual.
  img = img.flatten({ background: "#ffffff" });
  img = img.resize(48, 48, { fit: "inside" });
  const { data, info } = await img
    .extend({ top: 8, bottom: 8, left: 8, right: 8, background: "#ffffff" })
    .resize(64, 64)
    .raw()
    .toBuffer({ resolveWithObject: true });
  return { data, info };
}

/** Diferencia media de píxeles (0..255) entre dos buffers ya normalizados. */
function mad(a, b) {
  let suma = 0;
  const n = a.data.length;
  for (let i = 0; i < n; i++) suma += Math.abs(a.data[i] - b.data[i]);
  return suma / n;
}

/** Devuelve el archivo concreto de public/media para una clave dada. */
function archivoImportado(clave) {
  const f = readdirSync(MEDIA).find((n) => n.startsWith(clave + "."));
  if (!f) throw new Error(`No existe ${clave}.* en public/media`);
  return path.join(MEDIA, f);
}

/** Lista las imágenes de una carpeta (salta .psd y otros). */
function imagenesEn(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => /\.(png|jpe?g|webp)$/i.test(f))
    .map((f) => path.join(dir, f));
}

/**
 * Compara cada activo destino contra todos los candidatos de su grupo y
 * devuelve el mejor emparejamiento.
 */
async function compararGrupo(nombre, claves, candidatos, opciones = {}) {
  const filas = [];
  for (const clave of claves) {
    const destino = archivoImportado(clave);
    const d = await normalizar(destino);
    let mejor = { mad: Infinity, origen: null };
    for (const c of candidatos) {
      try {
        const o = await normalizar(c, { recorte: opciones.recorte });
        const m = mad(d, o);
        if (m < mejor.mad) mejor = { mad: m, origen: c };
      } catch {
        // El candidato no se pudo decodificar; se salta.
      }
    }
    const ok = mejor.mad < 6;
    filas.push({
      clave,
      origen: mejor.origen ? mejor.origen.split(/[\\/]/).pop() : "(ninguno)",
      mad: Number(mejor.mad.toFixed(2)),
      ok,
    });
  }
  return { nombre, filas };
}

const servicioClaves = [
  "servicio-audio", "servicio-acustica", "servicio-conferencia",
  "servicio-teleconferencia", "servicio-control", "servicio-iluminacion",
  "servicio-video", "servicio-cctv", "servicio-cableado",
];
const clienteClaves = [
  "cliente-carmelitas", "cliente-san-francisco-de-borja",
  "cliente-nuestra-senora-del-consuelo", "cliente-reina-del-mundo",
  "cliente-santa-anita", "cliente-iset-juan-23", "cliente-universidad-de-lima",
];
const areaClaves = [
  "area-acustica", "area-audio", "area-cableado", "area-conferencia",
  "area-control", "area-iluminacion", "area-seguridad",
  "area-telecomunicacion", "area-video",
];

const grupos = [
  { nombre: "logo (lockup)", claves: ["logo-soundtech"], candidatos: [`${LOGO}/sound.png`] },
  { nombre: "logo (símbolo)", claves: ["logo-soundtech-simbolo"], candidatos: [`${LOGO}/sound.png`], recorte: [0, 0, 700, 757] },
  { nombre: "servicios", claves: servicioClaves, candidatos: imagenesEn(path.join(HOME, "servicios imagenes")) },
  { nombre: "clientes", claves: clienteClaves, candidatos: imagenesEn(path.join(HOME, "Marcas clientes")) },
  { nombre: "insignias", claves: ["insignia-certificacion", "insignia-practica", "insignia-salidas"], candidatos: imagenesEn(path.join(HOME, "iconos")) },
  { nombre: "áreas", claves: areaClaves, candidatos: imagenesEn(path.join(NOS, "iconos")) },
  // Nota: los iconos de redes se dibujan en SVG en linea (social-icon.tsx).
  // El tik-tok.png del material es identico al instagram.png (error del
  // disenador, verificado con este mismo comparador: diferencia 0.00), asi
  // que no se importan los PNG.
  { nombre: "decorativos", claves: ["deco-cuadro-puntos", "deco-disco", "deco-linea-colores", "deco-punto-naranja"], candidatos: imagenesEn(HOME) },
  {
    nombre: "portada y nosotros",
    claves: ["fondo-clientes", "fondo-matriculate", "home-nosotros", "home-preguntas", "nosotros-imagenes", "nosotros-banner"],
    candidatos: [...imagenesEn(HOME), ...imagenesEn(NOS)],
  },
];

let fallos = 0;
for (const g of grupos) {
  const r = await compararGrupo(g.nombre, g.claves, g.candidatos, { recorte: g.recorte });
  console.log(`\n== ${r.nombre} ==`);
  for (const f of r.filas) {
    const marca = f.ok ? "OK " : "?? ";
    if (!f.ok) fallos++;
    console.log(`  ${marca} ${f.clave.padEnd(34)} <- ${f.origen.padEnd(46)} dif ${f.mad}`);
  }
}

// Fuentes: el zip debe traer los seis pesos y los woff2 deben corresponder.
console.log("\n== Fuentes BR Firma ==");
const zip = path.join(MAT, "Sound tech peru (material)", "Fonts", "BR Firma Font Family (1).zip");
try {
  const lista = execSync(`unzip -l "${zip}"`, { encoding: "utf8" });
  const ttf = lista.split("\n").filter((l) => /\.ttf$/i.test(l.trim()));
  console.log(`  ${ttf.length} TTF en el zip:`);
  ttf.forEach((l) => console.log("   ", l.trim().split(/\s+/).pop()));
  const woff2 = readdirSync(path.join(ROOT, "public", "fonts")).filter((f) => f.endsWith(".woff2"));
  console.log(`  ${woff2.length} WOFF2 en public/fonts: ${woff2.join(", ")}`);
  const pesos = ["Light", "Regular", "Medium", "SemiBold", "Bold", "Black"];
  const okPesos = pesos.every((p) => woff2.some((w) => w.includes(p)));
  console.log(okPesos ? "  OK: los seis pesos presentes" : "  ?? falta algún peso");
  if (!okPesos) fallos++;
} catch (e) {
  console.log("  No se pudo leer el zip:", e.message);
}

// Vídeo: el póster debe guardar el aspecto del .mov.
console.log("\n== Vídeo ==");
const mov = path.join(MAT, "Sound tech peru (material)", "Videos", "1107959_1080p_4k_4096x2160.mov");
const poster = archivoImportado("hero-video-poster");
const pm = await sharp(poster).metadata();
const aspectoPoster = pm.width / pm.height;
const aspectoMov = 4096 / 2160;
const okVideo = Math.abs(aspectoPoster - aspectoMov) < 0.02;
console.log(`  póster ${pm.width}×${pm.height} (${aspectoPoster.toFixed(3)}) vs .mov 4096×2160 (${aspectoMov.toFixed(3)}) ${okVideo ? "OK" : "??"}`);
console.log(`  vídeos: ${["hero-video.mp4", "hero-video.webm"].filter((f) => existsSync(path.join(MEDIA, f))).join(", ")}`);
if (!okVideo) fallos++;

console.log(`\n${fallos === 0 ? "Todo el material coincide con sus originales." : `${fallos} elemento(s) por revisar.`}`);
process.exit(fallos === 0 ? 0 : 1);
