import type { MediaContent } from "./types";

/**
 * Manifiesto de medios. ARCHIVO GENERADO — no editar a mano.
 * Regenerar con: node scripts/generate-media-manifest.mjs
 *
 * Cada entrada corresponde a un archivo de public/media. Para reemplazar una
 * imagen por la fotografia real del cliente basta con sobrescribir el archivo
 * conservando el nombre, o subirla desde /admin.
 */

export const media = {
  "academy-photo": { key: "academy-photo", url: "/media/academy-photo.jpg", alt: "Docente trabajando en un estudio de sonido" },
  "acustica-1": { key: "acustica-1", url: "/media/acustica-1.jpg", alt: "Paneles acústicos en la pared de un estudio" },
  "acustica-2": { key: "acustica-2", url: "/media/acustica-2.jpg", alt: "Tratamiento acústico con espuma en un estudio" },
  "audio-1": { key: "audio-1", url: "/media/audio-1.jpg", alt: "Parlante profesional instalado en una sala" },
  "audio-2": { key: "audio-2", url: "/media/audio-2.jpg", alt: "Parlantes de techo instalados en una oficina" },
  "cableado-1": { key: "cableado-1", url: "/media/cableado-1.jpg", alt: "Rack de servidores con cableado de red" },
  "cableado-2": { key: "cableado-2", url: "/media/cableado-2.jpg", alt: "Patch panel de cableado estructurado" },
  "cctv-1": { key: "cctv-1", url: "/media/cctv-1.jpg", alt: "Cámara de videovigilancia en un edificio" },
  "client-carmelines": { key: "client-carmelines", url: "/media/client-carmelines.svg", alt: "Colegio Carmelines" },
  "client-nuestra-senora-del-consuelo": { key: "client-nuestra-senora-del-consuelo", url: "/media/client-nuestra-senora-del-consuelo.svg", alt: "Colegio Nuestra Señora del Consuelo" },
  "client-reino-del-mundo": { key: "client-reino-del-mundo", url: "/media/client-reino-del-mundo.svg", alt: "Colegio Reino del Mundo" },
  "client-san-francisco-de-borja": { key: "client-san-francisco-de-borja", url: "/media/client-san-francisco-de-borja.svg", alt: "Colegio San Francisco de Borja" },
  "conferencia-1": { key: "conferencia-1", url: "/media/conferencia-1.jpg", alt: "Mesa de conferencia con micrófonos" },
  "control-1": { key: "control-1", url: "/media/control-1.jpg", alt: "Panel táctil de control de una sala" },
  "control-2": { key: "control-2", url: "/media/control-2.jpg", alt: "Sala de reuniones moderna con pantalla táctil" },
  "course-classroom": { key: "course-classroom", url: "/media/course-classroom.jpg", alt: "Alumnos en un aula con equipos de cómputo" },
  "course-gear": { key: "course-gear", url: "/media/course-gear.jpg", alt: "Equipos de audio profesional en detalle" },
  "course-lab": { key: "course-lab", url: "/media/course-lab.jpg", alt: "Estación de trabajo de producción musical" },
  "course-studio": { key: "course-studio", url: "/media/course-studio.jpg", alt: "Consola de mezcla en el estudio de grabación" },
  "faq-photo": { key: "faq-photo", url: "/media/faq-photo.jpg", alt: "Sistema de sonido en un escenario" },
  "hero-clientes": { key: "hero-clientes", url: "/media/hero-clientes.jpg", alt: "Fachada de una institución educativa" },
  "hero-contacto": { key: "hero-contacto", url: "/media/hero-contacto.jpg", alt: "Consola de mezcla en ambiente oscuro" },
  "hero-cotizar": { key: "hero-cotizar", url: "/media/hero-cotizar.jpg", alt: "Rack de equipos de audio profesional" },
  "hero-cursos": { key: "hero-cursos", url: "/media/hero-cursos.jpg", alt: "Sala de control de un estudio de grabación" },
  "hero-galeria": { key: "hero-galeria", url: "/media/hero-galeria.jpg", alt: "Interior de un estudio de grabación equipado" },
  "hero-home": { key: "hero-home", url: "/media/hero-home.jpg", alt: "Consola de mezcla de audio profesional en un estudio" },
  "hero-legal": { key: "hero-legal", url: "/media/hero-legal.jpg", alt: "Fondo abstracto tecnológico en tonos oscuros" },
  "hero-nosotros": { key: "hero-nosotros", url: "/media/hero-nosotros.jpg", alt: "Ingeniero de sonido operando una consola de mezcla" },
  "hero-proyectos": { key: "hero-proyectos", url: "/media/hero-proyectos.jpg", alt: "Auditorio con sistema de audio e iluminación" },
  "hero-redes": { key: "hero-redes", url: "/media/hero-redes.jpg", alt: "Equipos de estudio de audio en penumbra" },
  "hero-servicios": { key: "hero-servicios", url: "/media/hero-servicios.jpg", alt: "Detalle de los faders de una consola de audio" },
  "iluminacion-1": { key: "iluminacion-1", url: "/media/iluminacion-1.jpg", alt: "Iluminación comercial en el interior de una tienda" },
  "logo-soundtech": { key: "logo-soundtech", url: "/media/logo-soundtech.svg", alt: "Logotipo de Sound Tech Perú" },
  "socials-photo": { key: "socials-photo", url: "/media/socials-photo.jpg", alt: "Ambiente de estudio de audio" },
  "teleconferencia-1": { key: "teleconferencia-1", url: "/media/teleconferencia-1.jpg", alt: "Sala de videoconferencia con pantalla" },
  "video-1": { key: "video-1", url: "/media/video-1.jpg", alt: "Video wall con pantallas LED" },
  "video-2": { key: "video-2", url: "/media/video-2.jpg", alt: "Proyector instalado en un auditorio" },
} as const satisfies Record<string, MediaContent>;

export type MediaKey = keyof typeof media;

/** Devuelve los datos de una imagen por clave, o undefined si no existe. */
export function getMedia(key: string): MediaContent | undefined {
  return (media as Record<string, MediaContent>)[key];
}
