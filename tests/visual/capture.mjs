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
];

// Solo se capturan todas las paginas en escritorio para agilizar;
// las otras medidas se muestran en la portada y en una ficha de servicio.
const ROUTES = [
  { path: "/", slug: "01-home", allViewports: true },
  { path: "/nosotros", slug: "02-nosotros" },
  { path: "/servicios", slug: "03-servicios" },
  { path: "/servicios/sistema-de-audio-profesional-y-comercial", slug: "04-servicio-audio" },
  { path: "/servicios/acondicionamiento-y-aislamiento-acustico", slug: "05-servicio-acustica", allViewports: true },
  { path: "/servicios/circuito-cerrado-de-television-cctv", slug: "06-servicio-cctv" },
  { path: "/servicios/cableado-estructurado", slug: "07-servicio-cableado" },
  { path: "/cursos", slug: "08-cursos" },
  { path: "/proyectos", slug: "09-proyectos" },
  { path: "/clientes", slug: "10-clientes" },
  { path: "/galeria", slug: "11-galeria" },
  { path: "/contactenos", slug: "12-contactenos" },
  { path: "/cotizar", slug: "13-cotizar" },
  { path: "/redes-sociales", slug: "14-redes-sociales" },
  { path: "/politica-de-privacidad", slug: "15-privacidad" },
  // El 404 devuelve 404 a proposito: es el comportamiento esperado.
  { path: "/ruta-que-no-existe", slug: "16-404", expectStatus: 404 },
  { path: "/admin/login", slug: "17-admin-login" },
];

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
    const viewports = route.allViewports
      ? VIEWPORTS
      : [VIEWPORTS[0]];
    const others = route.allViewports
      ? []
      : VIEWPORTS.slice(1).map((v) => ({ ...v, name: `${v.name}` }));

    const targets = route.allViewports ? viewports : [VIEWPORTS[0], ...others];

    for (const vp of targets) {
      // La portada y la ficha de acustica se miden en las tres resoluciones;
      // el resto solo en escritorio salvo que se pida lo contrario.
      if (!route.allViewports && vp.name !== "desktop") continue;

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
        if (m.type() === "error") errors.push(m.text());
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
