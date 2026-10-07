/**
 * Importa los recursos gráficos que envió el cliente a public/media.
 *
 * Uso:  node scripts/import-client-assets.mjs [carpeta-del-material]
 *
 * El material de origen (1,2 GB con PSD, .rar y un vídeo 4K) NO entra al
 * repositorio. Este script copia solo lo que el sitio usa, lo redimensiona y
 * lo guarda con nombres semanticos en public/media.
 *
 * Es re-ejecutable: sobrescribe los archivos de destino.
 */

import { mkdir, writeFile, readFile, access } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const MATERIAL =
  process.argv[2] ??
  path.resolve(
    import.meta.dirname,
    "../../diseñoweb/wetransfer_sound-tech-peru-material-rar_2026-10-06_1837",
  );

const OUT = path.resolve(import.meta.dirname, "../public/media");

const HOME = path.join(MATERIAL, "Home/Home");
const NOS = path.join(MATERIAL, "Nostros/Nostros");
const LOGO = path.join(MATERIAL, "Sound tech peru (material)/logo");

/**
 * clave final -> { origen, ancho, formato, alt }
 * El ancho es el maximo util; nunca se amplia.
 */
const RECURSOS = {
  /* --- Marca ------------------------------------------------------------ */
  "logo-soundtech": {
    origen: path.join(LOGO, "sound.png"),
    ancho: 900,
    formato: "png",
    alt: "Logotipo de Sound Tech Perú",
  },

  /* --- Fotos reales de los 9 servicios ---------------------------------- */
  "servicio-audio": {
    origen: path.join(HOME, "servicios imagenes/Sistema-de-audio-profesional.png"),
    ancho: 1200,
    alt: "Sistema de audio profesional instalado en un centro comercial",
  },
  "servicio-acustica": {
    origen: path.join(
      HOME,
      "servicios imagenes/aconcionamiento-y-aislamiento-acustico.png",
    ),
    ancho: 1200,
    alt: "Acondicionamiento y aislamiento acústico de un recinto",
  },
  "servicio-conferencia": {
    origen: path.join(
      HOME,
      "servicios imagenes/sistema-de-conferencia-y-votacion.png",
    ),
    ancho: 1200,
    alt: "Sistema de conferencia y votación en una sala de directorio",
  },
  "servicio-teleconferencia": {
    origen: path.join(HOME, "servicios imagenes/sisitema-de-teleconferencia.png"),
    ancho: 1200,
    alt: "Sala de teleconferencia con pantalla y cámara",
  },
  "servicio-control": {
    origen: path.join(
      HOME,
      "servicios imagenes/sistema-de-control-integrado-para-salas.png",
    ),
    ancho: 1200,
    alt: "Panel de control integrado de una sala automatizada",
  },
  "servicio-iluminacion": {
    origen: path.join(
      HOME,
      "servicios imagenes/sistema-de-iluminacion-comercial.png",
    ),
    ancho: 1200,
    alt: "Iluminación comercial y arquitectónica de un espacio",
  },
  "servicio-video": {
    origen: path.join(
      HOME,
      "servicios imagenes/sistema-de-videoproyeccion-y-pantalla.png",
    ),
    ancho: 1200,
    alt: "Sistema de videoproyección y pantallas profesionales",
  },
  "servicio-cctv": {
    origen: path.join(
      HOME,
      "servicios imagenes/Sistemas-de-Circuito-Cerrado-de-Televisión-(CCTV).png",
    ),
    ancho: 1200,
    alt: "Sistema de circuito cerrado de televisión (CCTV)",
  },
  "servicio-cableado": {
    origen: path.join(HOME, "servicios imagenes/cableado-estructurado.png"),
    ancho: 1200,
    alt: "Cableado estructurado y organizado en rack",
  },

  /* --- Los 7 clientes --------------------------------------------------- */
  "cliente-carmelitas": {
    origen: path.join(HOME, "Marcas clientes/46b54323-faf9-47b5-8cec-cd8044ab820a.png"),
    ancho: 400,
    alt: "Colegio Carmelitas",
  },
  "cliente-san-francisco-de-borja": {
    origen: path.join(HOME, "Marcas clientes/e7283ad1-8457-4e66-9b40-6569843c9b23.png"),
    ancho: 400,
    alt: "Colegio San Francisco de Borja",
  },
  "cliente-nuestra-senora-del-consuelo": {
    origen: path.join(HOME, "Marcas clientes/NSC.webp"),
    ancho: 400,
    alt: "Colegio Nuestra Señora del Consuelo",
  },
  "cliente-reina-del-mundo": {
    origen: path.join(HOME, "Marcas clientes/logo_sin_fondo.png"),
    ancho: 400,
    alt: "Colegio Reina del Mundo",
  },
  "cliente-santa-anita": {
    origen: path.join(HOME, "Marcas clientes/ESCUDO-COLEGIO-SANTA-ANITA.png"),
    ancho: 400,
    alt: "Colegio Madres Dominicas Santa Anita",
  },
  "cliente-iset-juan-23": {
    origen: path.join(HOME, "Marcas clientes/6c4858e2-c63b-4c77-9590-b363f24bf4ec.png"),
    ancho: 400,
    alt: "Instituto Superior Iset Juan 23",
  },
  "cliente-universidad-de-lima": {
    origen: path.join(HOME, "Marcas clientes/Universidad_de_Lima_logo (1).png"),
    ancho: 400,
    alt: "Universidad de Lima",
  },

  /* --- Redes sociales --------------------------------------------------- */
  "social-facebook": {
    origen: path.join(HOME, "iconos redes sociales/facebook.png"),
    ancho: 120,
    alt: "Facebook",
  },
  "social-instagram": {
    origen: path.join(HOME, "iconos redes sociales/instagram.png"),
    ancho: 120,
    alt: "Instagram",
  },
  "social-tiktok": {
    origen: path.join(HOME, "iconos redes sociales/tik-tok.png"),
    ancho: 120,
    alt: "TikTok",
  },

  /* --- Piezas decorativas ----------------------------------------------- */
  "deco-cuadro-puntos": {
    origen: path.join(HOME, "cuadro-puntos.png"),
    ancho: 320,
    formato: "png",
    alt: "Textura de puntos decorativa",
  },
  // El disenador pidio expresamente este archivo: el otro (`discooo.png`)
  // tiene el disco recortado por la izquierda y por abajo.
  "deco-disco": {
    origen: path.join(HOME, "8bf07ad7-700d-4635-9570-ed53050db6cd.png"),
    ancho: 900,
    formato: "png",
    alt: "Disco con anillos naranjas",
  },
  "deco-linea-colores": {
    origen: path.join(HOME, "linea-de-colores.png"),
    ancho: 1600,
    formato: "png",
    alt: "Línea de colores decorativa",
  },
  "deco-punto-naranja": {
    origen: path.join(HOME, "punto-naranja.png"),
    ancho: 700,
    formato: "png",
    alt: "Resplandor naranja decorativo",
  },

  /* --- Fondos ----------------------------------------------------------- */
  "fondo-clientes": {
    origen: path.join(HOME, "fondo-consola-nuestra-clientes.png"),
    ancho: 1500,
    alt: "Consola de audio de fondo con desvanecido",
  },
  "fondo-matriculate": {
    origen: path.join(HOME, "fondo-matriculate.png"),
    ancho: 1600,
    alt: "Estudio de grabación con desvanecido",
  },

  /* --- Imágenes de la portada ------------------------------------------- */
  "home-nosotros": {
    origen: path.join(HOME, "imagen-home-1.png"),
    ancho: 1800,
    alt: "Estudio de grabación y sala de control",
  },
  "home-preguntas": {
    origen: path.join(HOME, "imagen-preguntas-frecuentes.png"),
    ancho: 1400,
    alt: "Escenario con sistema de sonido e iluminación",
  },

  /* --- Nosotros --------------------------------------------------------- */
  "nosotros-banner": {
    origen: path.join(NOS, "banner 70% opacidad.png"),
    ancho: 1920,
    alt: "Consola de mezcla al 70% de opacidad",
  },
  "nosotros-imagenes": {
    origen: path.join(NOS, "imagenes-nosotros.png"),
    ancho: 1800,
    alt: "Ambientes de Sound Tech Perú",
  },

  /* --- Insignias del programa de estudios ------------------------------- */
  // Los nombres de archivo no dicen cual es cual: se identifico cada icono
  // abriendolo (escudo con check, trofeo y maletin).
  "insignia-practica": {
    origen: path.join(HOME, "iconos/444823b3-b854-4dea-be72-a4b5d53136dd.png"),
    ancho: 160,
    formato: "png",
    alt: "",
  },
  "insignia-certificacion": {
    origen: path.join(HOME, "iconos/260f91e5-aedd-426b-82e1-4ed165c39035.png"),
    ancho: 160,
    formato: "png",
    alt: "",
  },
  "insignia-salidas": {
    origen: path.join(HOME, "iconos/4cf0815c-fc7f-4a59-88fd-d365ef64edc8.png"),
    ancho: 160,
    formato: "png",
    alt: "",
  },

  /* --- Iconos de las 9 áreas de proyecto -------------------------------- */
  "area-audio": { origen: path.join(NOS, "iconos/100d7a20-8f39-42c9-98f2-c3bbd3684490.png"), ancho: 160, formato: "png", alt: "" },
  "area-acustica": { origen: path.join(NOS, "iconos/39c662b4-f7ff-4fe4-b85c-9cd12ab5d400.png"), ancho: 160, formato: "png", alt: "" },
  "area-conferencia": { origen: path.join(NOS, "iconos/6b3a80f9-849e-4553-80de-79cabd58d09a.png"), ancho: 160, formato: "png", alt: "" },
  "area-control": { origen: path.join(NOS, "iconos/040fdfc7-3235-44b1-8da5-f67dd9b264ab.png"), ancho: 160, formato: "png", alt: "" },
  "area-iluminacion": { origen: path.join(NOS, "iconos/60ecac74-12f4-44a9-a53e-d43909e89fea.png"), ancho: 160, formato: "png", alt: "" },
  "area-seguridad": { origen: path.join(NOS, "iconos/c63b2ce2-5a16-4c40-92f4-f892608d1635.png"), ancho: 160, formato: "png", alt: "" },
  "area-video": { origen: path.join(NOS, "iconos/1f8c75a0-96af-44c9-93cb-0ffdc0480b04.png"), ancho: 160, formato: "png", alt: "" },
  "area-cableado": { origen: path.join(NOS, "iconos/6ec84dbc-8855-4fa2-a5fc-ff6e6cfe5380.png"), ancho: 160, formato: "png", alt: "" },
  "area-telecomunicacion": { origen: path.join(NOS, "iconos/4ee35e51-41f0-43b5-b9b3-9cfac54750ec.png"), ancho: 160, formato: "png", alt: "" },
};

async function existe(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

/** Conserva la transparencia en PNG; recomprime el resto como JPEG. */
async function procesar(recurso, destino, esPng) {
  const pipeline = sharp(recurso.origen, { failOn: "none" }).resize({
    width: recurso.ancho,
    withoutEnlargement: true,
  });

  if (esPng) {
    return pipeline
      .png({ compressionLevel: 9, palette: true, quality: 90 })
      .toFile(destino);
  }

  return pipeline
    .jpeg({ quality: 82, progressive: true, mozjpeg: true })
    .toFile(destino);
}

/**
 * Decide el formato de salida ANTES de construir el nombre del archivo.
 *
 * Es importante que la extension coincida con el contenido real: si
 * guardaramos datos PNG en un archivo .jpg, el servidor anunciaria
 * image/jpeg y el optimizador de Next fallaria al leerlo.
 */
async function elegirFormato(recurso) {
  if (recurso.formato === "png") return true;
  if (recurso.formato === "jpg") return false;

  const meta = await sharp(recurso.origen).metadata();
  const stats = await sharp(recurso.origen).stats();

  const tieneAlfa = meta.hasAlpha || meta.channels === 4;
  const alfaReal = stats.channels[3]?.min === 0;
  const esPaleta = Boolean(meta.palette);

  return tieneAlfa || alfaReal || esPaleta;
}

async function main() {
  await mkdir(OUT, { recursive: true });

  const alt = [];
  const faltantes = [];
  let importados = 0;
  let bytesEntrada = 0;
  let bytesSalida = 0;

  for (const [clave, recurso] of Object.entries(RECURSOS)) {
    if (!(await existe(recurso.origen))) {
      faltantes.push(`${clave} <- ${path.basename(recurso.origen)}`);
      continue;
    }

    const esPng = await elegirFormato(recurso);
    const ext = esPng ? ".png" : ".jpg";
    const destino = path.join(OUT, `${clave}${ext}`);

    try {
      const entrada = (await sharp(recurso.origen).metadata()).size ?? 0;
      const salida = await procesar(recurso, destino, esPng);
      const escritos = salida.size;

      bytesEntrada += entrada;
      bytesSalida += escritos;
      importados++;

      alt.push({ clave, alt: recurso.alt });
      console.log(
        `  ${clave}${ext}  ${(entrada / 1024).toFixed(0)} KB -> ${(escritos / 1024).toFixed(0)} KB`,
      );
    } catch (error) {
      faltantes.push(`${clave} (error: ${error.message})`);
    }
  }

  // Textos alternativos, para que el generador del manifiesto los use.
  // Se mezclan con los que ya hubiera: otros importadores (la galeria, por
  // ejemplo) escriben en este mismo archivo.
  const rutaAlt = path.join(OUT, "alt-textos.json");
  let previos = {};
  try {
    previos = JSON.parse(await readFile(rutaAlt, "utf8"));
  } catch {
    // Todavia no existe el archivo.
  }
  await writeFile(
    rutaAlt,
    `${JSON.stringify({ ...previos, ...Object.fromEntries(alt.map((a) => [a.clave, a.alt])) }, null, 2)}\n`,
    "utf8",
  );

  console.log(
    `\n${importados} recursos importados. ` +
      `${(bytesEntrada / 1048576).toFixed(1)} MB de origen -> ${(bytesSalida / 1048576).toFixed(1)} MB finales.`,
  );

  if (faltantes.length) {
    console.log(`\nNo encontrados (${faltantes.length}):`);
    for (const f of faltantes) console.log(`  - ${f}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
