/**
 * Captura de pantalla de todas las paginas publicas.
 *
 * Uso:  node tests/visual/capture.mjs [--base http://localhost:3000]
 *
 * Genera capturas de pagina completa a 1440 px de ancho en
 * tests/visual/__shots__/, que es la referencia para comparar la maqueta
 * contra las imagenes que entrego el cliente (guardadas fuera del
 * repositorio, en la maquina de desarrollo).
 *
 * Usa Microsoft Edge si Chromium de Playwright no esta instalado.
 */

import { mkdir } from "node:fs/promises";
import path from "node:path";

const { chromium } = await import("playwright-core").catch(() => import("playwright"));

const ROOT = path.resolve(import.meta.dirname, "../..");
const OUT = path.join(ROOT, "tests", "visual", "__shots__");

const argBase = process.argv.indexOf("--base");
const BASE = argBase > -1 ? process.argv[argBase + 1] : "http://localhost:3000";

const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 1000 },
  { name: "tablet", width: 1024, height: 1000 },
  { name: "mobile", width: 390, height: 844 },
  // iPhone SE y equivalentes: el ancho mas estrecho que se usa de verdad.
  { name: "mobile-sm", width: 360, height: 640 },
];

// Las paginas que el cliente revisa en el movil se capturan en las cuatro
// resoluciones; el resto solo en escritorio para no alargar la tanda.
const ROUTES = [
  { path: "/", slug: "01-home", allViewports: true },
  { path: "/nosotros", slug: "02-nosotros", allViewports: true },
  { path: "/servicios", slug: "03-servicios", allViewports: true },
  { path: "/servicios/sistema-de-audio-profesional-y-comercial", slug: "04-servicio-audio", allViewports: true },
  { path: "/servicios/acondicionamiento-y-aislamiento-acustico", slug: "05-servicio-acustica" },
  { path: "/servicios/circuito-cerrado-de-television-cctv", slug: "06-servicio-cctv" },
  { path: "/servicios/cableado-estructurado", slug: "07-servicio-cableado" },
  { path: "/cursos", slug: "08-cursos", allViewports: true },
  { path: "/proyectos", slug: "09-proyectos" },
  { path: "/clientes", slug: "10-clientes" },
  { path: "/galeria", slug: "11-galeria", allViewports: true },
  { path: "/contactenos", slug: "12-contactenos", allViewports: true },
  { path: "/cotizar", slug: "13-cotizar", allViewports: true },
  { path: "/redes-sociales", slug: "14-redes-sociales" },
  { path: "/politica-de-privacidad", slug: "15-privacidad" },
  // El 404 devuelve 404 a proposito: es el comportamiento esperado.
  { path: "/ruta-que-no-existe", slug: "16-404", expectStatus: 404 },
  { path: "/admin/login", slug: "17-admin-login" },
];

/**
 * Mide si la pagina se sale de ancho.
 *
 * `html` lleva `overflow-x: clip` como red de seguridad, asi que para medir de
 * verdad hay que desactivarla un momento: si aun asi el documento es mas ancho
 * que la pantalla, alguna seccion dejo escapar un adorno y hay que arreglarlo
 * en el componente, no taparlo con la red.
 */
async function medirDesbordamiento(page) {
  return page.evaluate(() => {
    const html = document.documentElement;
    const previoHtml = html.style.overflowX;
    const previoBody = document.body.style.overflowX;
    html.style.overflowX = "visible";
    document.body.style.overflowX = "visible";

    const ancho = html.clientWidth;
    const resultado = { ancho, scrollWidth: html.scrollWidth, culpables: [] };

    if (html.scrollWidth > ancho + 1) {
      resultado.culpables = [...document.querySelectorAll("body *")]
        .filter((el) => {
          const cs = getComputedStyle(el);
          if (cs.display === "none" || cs.position === "static") return false;
          if (el.getBoundingClientRect().right <= ancho + 1) return false;
          // Solo cuenta si ningun ancestro lo recorta.
          let padre = el.parentElement;
          while (padre && padre !== document.body) {
            if (getComputedStyle(padre).overflowX !== "visible") return false;
            padre = padre.parentElement;
          }
          return true;
        })
        .slice(0, 4)
        .map((el) => `${el.tagName.toLowerCase()}.${(el.className || "").toString().split(" ")[0]}`);
    }

    html.style.overflowX = previoHtml;
    document.body.style.overflowX = previoBody;
    return resultado;
  });
}

/** Localiza un navegador utilizable: Chromium propio o el Edge del sistema. */
async function launch() {
  try {
    return await chromium.launch({ channel: "chromium" });
  } catch {
    console.info("Chromium de Playwright no disponible; se usa Microsoft Edge.");
    return await chromium.launch({ channel: "msedge" });
  }
}

async function main() {
  await mkdir(OUT, { recursive: true });

  let browser;
  try {
    browser = await launch();
  } catch (error) {
    console.error(
      "No se pudo iniciar ningún navegador. Instala Chromium con:\n" +
        "  npx playwright install chromium\n",
      error.message,
    );
    process.exit(1);
  }

  const failures = [];

  for (const route of ROUTES) {
    const targets = route.allViewports ? VIEWPORTS : [VIEWPORTS[0]];

    for (const vp of targets) {
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        deviceScaleFactor: 1,
        locale: "es-PE",
        reducedMotion: "reduce", // fija las animaciones para que la captura sea estable
      });
      const page = await context.newPage();

      const url = `${BASE}${route.path}`;
      const errors = [];
      page.on("pageerror", (e) => errors.push(e.message));
      page.on("console", (m) => {
        // Los scripts de analitica de Vercel solo existen en Vercel: en local
        // devuelven 404 y ensuciarian el informe con un falso positivo.
        // El aviso generico de recurso caido no trae la URL: las respuestas
        // con error se registran aparte, con su direccion, mas abajo.
        const texto = m.text();
        const esRuido =
          /_vercel\/|vercel\/(insights|speed-insights)/.test(texto) ||
          /Failed to load resource/i.test(texto);
        if (m.type() === "error" && !esRuido) {
          errors.push(texto);
        }
      });
      page.on("response", (r) => {
        if (r.status() >= 400 && !r.url().includes("_vercel/")) {
          errors.push(`HTTP ${r.status()} en ${r.url()}`);
        }
      });

      try {
        const response = await page.goto(url, {
          // No usamos "networkidle": el websocket de recarga en caliente y los
          // scripts de analitica mantienen la red ocupada y nunca se estabiliza.
          waitUntil: "load",
          timeout: 90_000,
        });

        const expected = route.expectStatus ?? 200;
        if (!response || response.status() !== expected) {
          failures.push(
            `${url} → HTTP ${response?.status() ?? "sin respuesta"} (esperado ${expected})`,
          );
        }

        // Espera a que las fuentes esten listas para que la captura sea estable.
        await page.evaluate(() => document.fonts?.ready);
        await page.waitForTimeout(600);

        // Fuerza la carga diferida de imagenes antes de capturar.
        await page.evaluate(async () => {
          const step = window.innerHeight;
          for (let y = 0; y < document.body.scrollHeight; y += step) {
            window.scrollTo(0, y);
            await new Promise((r) => setTimeout(r, 220));
          }
          window.scrollTo(0, document.body.scrollHeight);
          await new Promise((r) => setTimeout(r, 600));
          window.scrollTo(0, 0);
          await new Promise((r) => setTimeout(r, 400));
        });

        await page.waitForLoadState("load");

        // Ninguna pagina debe ensancharse mas que la pantalla.
        const desborde = await medirDesbordamiento(page);
        if (desborde.scrollWidth > desborde.ancho + 1) {
          failures.push(
            `${url} (${vp.name}) se sale de ancho: ${desborde.scrollWidth}px en una pantalla de ${desborde.ancho}px` +
              (desborde.culpables.length
                ? ` → ${desborde.culpables.join(", ")}`
                : ""),
          );
        }

        const file = path.join(OUT, `${route.slug}-${vp.name}.png`);
        await page.screenshot({ path: file, fullPage: true });
        console.log(`✓ ${route.slug}-${vp.name}.png`);

        if (errors.length && route.expectStatus !== 404) {
          failures.push(
            `${url} (${vp.name}) errores de consola: ${errors.slice(0, 3).join(" | ")}`,
          );
        }
      } catch (error) {
        failures.push(`${url} (${vp.name}) → ${error.message}`);
      } finally {
        await context.close();
      }
    }
  }

  await browser.close();

  if (failures.length) {
    console.error(`\n${failures.length} problema(s):`);
    for (const f of failures) console.error(`  - ${f}`);
    process.exit(1);
  }

  console.log(`\nCapturas guardadas en ${OUT}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
