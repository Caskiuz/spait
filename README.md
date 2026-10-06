# Sound Tech Perú — Sitio web + CMS

Sitio web corporativo con panel de administración para **Sound Tech Perú**,
construido como una sola aplicación Next.js (frontend y backend juntos) lista
para desplegarse en **Vercel**.

Reproduce con fidelidad de píxel el diseño entregado por el cliente e
incorpora la gestión de contenido y de prospectos que se deduce de esas
pantallas. Las capturas de referencia son material del cliente y **no forman
parte de este repositorio**.

---

## Qué incluye

**Sitio público** — 14 rutas, todas navegables:

| Ruta | Contenido |
|---|---|
| `/` | Portada con las 7 secciones del diseño |
| `/nosotros` | Trayectoria, 9 áreas de proyecto, galería |
| `/servicios` | Rejilla de los 9 servicios |
| `/servicios/[slug]` | 9 fichas completas con bloques opcionales |
| `/cursos` | Programa de Ingeniería de Sonido + matrícula |
| `/proyectos` y `/proyectos/[slug]` | Portafolio |
| `/clientes` | Clientes, cifras y testimonios |
| `/galeria` | Galería filtrable por categoría |
| `/contactenos` | Redes + formulario de contacto |
| `/cotizar` | Formulario de cotización con proceso de trabajo |
| `/redes-sociales` | Directorio de canales |
| `/politica-de-privacidad` | Texto legal (Ley N.º 29733) |
| 404 | Página de error con navegación |

**Backend** — todo dentro de la misma app, sin servicios aparte:

- Formularios con validación, antispam y límite de envíos por IP.
- Guardado de prospectos en Postgres con estados y notas internas.
- Aviso por correo al equipo y acuse de recibo automático al interesado.
- Panel `/admin` con autenticación, bandeja de prospectos, gestión de
  contenido y exportación a CSV.
- SEO: metadatos por página, sitemap, robots, JSON-LD y Open Graph.

---

## Cómo funciona la capa de contenido

El sitio está diseñado para funcionar **con o sin base de datos**:

1. **Sin `DATABASE_URL`** — se sirve el contenido base de `src/content/`,
   extraído de las capturas del cliente. Todo el sitio es navegable y
   desplegable en Vercel desde el primer minuto.
2. **Con `DATABASE_URL`** — los repositorios leen de Postgres y el panel de
   administración se activa. El contenido base sigue siendo el respaldo, así
   que un fallo de la base de datos nunca deja el sitio en blanco.

La misma lógica se aplica a los formularios: sin base de datos el prospecto se
registra en los logs de Vercel con un aviso explícito; en cuanto se conecta
Neon, se guarda y aparece en la bandeja.

---

## Puesta en marcha

```bash
npm install
cp .env.example .env.local   # opcional: sin esto arranca en modo demostración
npm run dev                  # http://localhost:3000
```

### Activar el panel de administración

```bash
# 1. Crea una base Postgres gratuita en https://neon.tech
# 2. Copia la cadena de conexión a .env.local (DATABASE_URL y DIRECT_URL)
# 3. Genera el secreto de sesión
npx auth secret

# 4. Crea las tablas y carga el contenido de las capturas
npx prisma db push
npm run db:seed
```

El seed imprime por pantalla la contraseña del primer administrador: si no
defines `SEED_ADMIN_PASSWORD`, genera una aleatoria y la muestra una sola vez.
Anótala antes de cerrar la terminal. Luego entra en
<http://localhost:3000/admin> con `SEED_ADMIN_EMAIL` (por defecto
`admin@soundtechperu.com`).

---

## Comandos

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Compila para producción (incluye `prisma generate`) |
| `npm run typecheck` | Verificación de tipos |
| `npm test` | Pruebas unitarias (Vitest) |
| `npm run shots` | Capturas de todas las páginas en 3 resoluciones |
| `npm run db:seed` | Carga el contenido base en la base de datos |
| `npm run db:studio` | Explorador visual de la base de datos |
| `node scripts/fetch-media.mjs` | Descarga las imágenes de marcador de posición |
| `node scripts/optimize-media.mjs` | Redimensiona y recomprime `public/media` |
| `node scripts/generate-media-manifest.mjs` | Regenera `src/content/media.ts` |

---

## Despliegue en Vercel

1. **Importa el repositorio** en Vercel. El framework se detecta solo; no hace
   falta tocar el comando de build.
2. **Conecta la base de datos**: pestaña Storage → Marketplace → **Neon**. Vercel
   inyecta `DATABASE_URL` automáticamente.
3. **Añade las variables** de `.env.example` que vayas a usar (como mínimo
   `AUTH_SECRET` y `DATABASE_URL` para el panel).
4. **Aplica el esquema y el seed** desde tu máquina, apuntando a la base de
   producción:
   ```bash
   DATABASE_URL="<url-de-produccion>" DIRECT_URL="<url-directa>" npx prisma db push
   DATABASE_URL="<url-de-produccion>" DIRECT_URL="<url-directa>" npm run db:seed
   ```
5. **Comparte la URL de preview** con el cliente. Cada push genera una nueva;
   la de producción solo se publica cuando apruebe.

> Las imágenes se sirven desde `public/media`, así que no necesitas Vercel Blob
> para el lanzamiento. Actívalo cuando el cliente quiera subir fotos desde el
> panel.

---

## Estructura

```
prisma/
  schema.prisma          modelo de datos completo
  seed.ts                carga el contenido de las capturas
public/media/            imágenes (ver ATRIBUCIONES.md)
scripts/                 utilidades de medios
src/
  app/
    (site)/              sitio público (navbar + footer)
    (admin)/admin/       panel protegido
    api/                 contacto, matrícula, cotización, subida, salud
  components/
    ui/                  sistema de diseño (botones, layout, animaciones)
    site/                secciones del sitio público
    forms/               formularios y campos
    admin/               piezas del panel
  content/               contenido base y manifiesto de medios
  lib/                   db, auth, validaciones, correo, límites, csv
  server/
    repositories/        lectura de contenido (BD con respaldo en content/)
    actions/             mutaciones del panel
tests/
  unit/                  Vitest
  visual/                capturas para comparar con las referencias
```

> Las capturas de diseño del cliente viven en `docs/referencias/` en la máquina
> de desarrollo, excluidas del repositorio por ser material de terceros.

---

## Decisiones de diseño

- **Un solo despliegue.** Frontend y backend comparten repo, tipos y despliegue,
  como pedía el cliente.
- **El contenido base es el respaldo, no un duplicado.** `src/content/` es la
  fuente de verdad del seed y también el respaldo cuando no hay base de datos.
- **Validación compartida.** Los mismos esquemas de Zod validan en el navegador
  y en el servidor; es imposible que se desincronicen.
- **Sin HTML crudo en la base de datos.** El contenido se estructura en campos y
  bloques JSON, lo que elimina de raíz el riesgo de XSS almacenado.
- **`useActionState` sobre formularios nativos.** El panel funciona incluso con
  JavaScript degradado, y el sitio público no depende de JS para renderizar
  (importante para SEO y accesibilidad).
- **El campo trampa no se valida.** Si lo rechazáramos, el bot aprendería qué
  campo lo delata; se acepta y se descarta en silencio.

---

## Pendientes del cliente

- Logo vectorial real y fotografías propias (hoy hay marcadores de posición
  libres — ver `public/media/ATRIBUCIONES.md`).
- URLs definitivas de Discord, X y Pinterest (las actuales son provisionales).
- Razón social, RUC y dirección fiscal para completar la política de privacidad.
- Revisión del diseño móvil: las capturas entregadas son solo de escritorio.

---

## Licencias de las imágenes

Las fotografías de `public/media` son marcadores de posición con licencias
libres obtenidas vía Openverse. El detalle de autoría y licencia de cada archivo
está en [`public/media/ATRIBUCIONES.md`](public/media/ATRIBUCIONES.md).
**Deben reemplazarse por material propio antes de la publicación definitiva.**
