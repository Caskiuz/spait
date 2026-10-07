/**
 * Genera una hoja de contacto con los recursos gráficos que envió el cliente,
 * para identificarlos de un vistazo antes de integrarlos al sitio.
 *
 * Uso:  node scripts/preview-material.mjs <carpeta-del-material>
 */

import { readdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const MATERIAL =
  process.argv[2] ??
  path.resolve(import.meta.dirname, "../../diseñoweb/wetransfer_sound-tech-peru-material-rar_2026-10-06_1837");

const OUT = path.resolve(import.meta.dirname, "../tests/visual/__shots__");

const GRUPOS = [
  { titulo: "MARCAS CLIENTES", dir: "Home/Home/Marcas clientes" },
  { titulo: "ICONOS REDES", dir: "Home/Home/iconos redes sociales" },
  {
    titulo: "DECORATIVOS",
    dir: "Home/Home",
    lista: [
      "cuadro-puntos.png",
      "discooo.png",
      "linea-de-colores.png",
      "punto-naranja.png",
      "fondo-consola-nuestra-clientes.png",
      "fondo-matriculate.png",
      "imagen-home-1.png",
      "imagen-preguntas-frecuentes.png",
    ],
  },
  {
    titulo: "ICONOS HOME",
    dir: "Home/Home/iconos",
  },
  {
    titulo: "ICONOS NOSOTROS",
    dir: "Nostros/Nostros/iconos",
  },
  {
    titulo: "NOSOTROS",
    dir: "Nostros/Nostros",
    lista: ["banner 70% opacidad.png", "imagenes-nosotros.png"],
  },
];

const COLS = 4;
const CW = 300;
const CH = 200;
const LAB = 30;

const escapar = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

async function main() {
  const items = [];

  for (const grupo of GRUPOS) {
    const dir = path.join(MATERIAL, grupo.dir);
    let archivos;
    try {
      archivos =
        grupo.lista ?? (await readdir(dir)).filter((f) => /\.(png|jpe?g|webp)$/i.test(f));
    } catch {
      console.warn(`No se pudo leer ${dir}`);
      continue;
    }
    for (const archivo of archivos) {
      items.push({ grupo: grupo.titulo, archivo, ruta: path.join(dir, archivo) });
    }
  }

  console.log(`Elementos encontrados: ${items.length}`);

  const filas = Math.ceil(items.length / COLS);
  const comps = [];

  for (let i = 0; i < items.length; i++) {
    const col = i % COLS;
    const fila = Math.floor(i / COLS);
    const x = col * CW;
    const y = fila * (CH + LAB);

    try {
      const buf = await sharp(items[i].ruta)
        .resize(CW - 10, CH - 10, {
          fit: "contain",
          background: { r: 20, g: 20, b: 22, alpha: 1 },
        })
        .png()
        .toBuffer();
      comps.push({ input: buf, left: x + 5, top: y + 5 });
    } catch {
      console.warn(`  no se pudo leer ${items[i].archivo}`);
    }

    const meta = await sharp(items[i].ruta).metadata().catch(() => null);
    const etiqueta = `${items[i].grupo.slice(0, 9)} | ${items[i].archivo.slice(0, 30)}${meta ? ` (${meta.width}x${meta.height})` : ""}`;

    comps.push({
      input: Buffer.from(
        `<svg width="${CW}" height="${LAB}"><rect width="100%" height="100%" fill="#0a0a0b"/><text x="5" y="19" font-family="Arial" font-size="11" fill="#ff8a1a">${escapar(etiqueta)}</text></svg>`,
      ),
      left: x,
      top: y + CH,
    });
  }

  await sharp({
    create: {
      width: COLS * CW,
      height: filas * (CH + LAB),
      channels: 3,
      background: "#0a0a0b",
    },
  })
    .composite(comps)
    .jpeg({ quality: 80 })
    .toFile(path.join(OUT, "material-clientes.jpg"));

  console.log(`Hoja creada en ${path.join(OUT, "material-clientes.jpg")}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
