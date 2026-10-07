import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const MAT = "C:/Users/rijar/Proyectos/spait/diseñoweb/wetransfer_sound-tech-peru-material-rar_2026-10-06_1837";
const DIR = path.join(MAT, "Home", "Home", "imagenes");
const DIR2 = path.join(MAT, "Nostros", "Nostros", "imagenes");

/**
 * Fotografías sueltas del material del diseñador, elegidas para la galería.
 * Cada entrada: clave del sitio, archivo de origen y texto alternativo.
 */
const FOTOS = [
  ["galeria-consola-estudio", path.join(DIR, "0bc77f8f-05f1-46b0-980c-72ba68eaedfc.png"), "Consola principal del estudio de grabación"],
  ["galeria-ingeniero-consola", path.join(DIR, "2fc1874f-6590-4d4f-8d30-976d6db2b1cd.png"), "Ingeniero de sonido trabajando en la sala de control"],
  ["galeria-fader-mano", path.join(DIR, "3e375693-b6a7-49dd-8b1d-e8bfcabdd3e2.png"), "Ajuste de un fader en la consola de mezcla"],
  ["galeria-monitores-estudio", path.join(DIR, "5-ZU920T.jpg"), "Monitores de estudio en la sala de control"],
  ["galeria-faders", path.join(DIR, "736e2e0e-ff3e-49a3-bcfb-cc8ddbed98dc.png"), "Detalle de los faders de una consola profesional"],
  ["galeria-aula-audio", path.join(DIR, "87ea68f0-a593-415a-9cae-8cd3f626011f.png"), "Aula equipada para las clases de audio"],
  ["galeria-escenario-luces", path.join(DIR, "a2d2a37e-b416-42f2-aea2-916bbc5fc4d6.png"), "Escenario con iluminación de evento"],
  ["galeria-mezcla-digital", path.join(DIR, "a3a03d75-958b-4e67-b2f2-3841f92719f9.png"), "Mezcla en consola digital"],
  ["galeria-rack-equipos", path.join(DIR, "b67076c7-a300-4b06-ac8e-75032d107701.png"), "Rack de equipos de audio"],
  ["galeria-produccion-daw", path.join(DIR, "ba4ebab9-bdef-4bf7-a6e6-638caada1c9c.png"), "Estación de producción con software de audio"],
  ["galeria-monitor-campo", path.join(DIR, "ce1f5210-a9ba-45e3-8774-836fa2acec0a.png"), "Monitor de estudio de campo cercano"],
  ["galeria-concierto-vivo", path.join(DIR, "Digico-en-los-Grammy-Latino-1.jpg"), "Consola en un concierto en vivo"],
  ["galeria-fader-digital", path.join(DIR, "fader-digital-mixing-console-with-volume-meter.jpg"), "Fader de consola digital con medidores"],
  ["galeria-aula-computo", path.join(DIR, "imagen034.png"), "Aula de cómputo para los cursos"],
  ["galeria-escritorio-mezcla", path.join(DIR2, "maxresdefault.jpg"), "Escritorio de mezcla del estudio"],
  ["galeria-consola-vivo", path.join(MAT, "Home", "Home", "8bf07ad7-700d-4635-9570-ed53050db6cd.png"), "Operación de consola en vivo"],
  ["galeria-consola-penumbra", path.join(MAT, "Home", "Home", "websiteB.jpg"), "Consola de mezcla en penumbra"],
];

const ALT = JSON.parse(readFileSync("public/media/alt-textos.json", "utf8"));

for (const [clave, origen, alt] of FOTOS) {
  await sharp(origen)
    .resize({ width: 1400, withoutEnlargement: true })
    .jpeg({ quality: 78, mozjpeg: true })
    .toFile(`public/media/${clave}.jpg`);
  ALT[clave] = alt;
  console.log(`✓ ${clave}.jpg  <-  ${origen.split(/[\/]/).pop()}`);
}

writeFileSync("public/media/alt-textos.json", JSON.stringify(ALT, null, 2) + "\n");
console.log("alt-textos.json actualizado");
